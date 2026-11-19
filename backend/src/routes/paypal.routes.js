import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { z } from 'zod';
import { PayPalOrder } from '../models/PayPalOrder.js';
import { PayPalWebhookEvent } from '../models/PayPalWebhookEvent.js';
import { PurchaseApproval } from '../models/PurchaseApproval.js';
import { Circle } from '../models/Circle.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/async-handler.js';
import { requireAuth } from '../middleware/require-auth.js';
import { paypalCreateOrder, paypalGetOrder, paypalCaptureOrder, paypalField } from '../utils/paypal-sdk.js';
const router=Router();
let accessToken; let expiresAt=0;
async function token(){
  if(!env.paypal.clientId||!env.paypal.clientSecret){const e=new Error('PayPal credentials are not configured.');e.status=503;throw e;}
  if(accessToken&&Date.now()<expiresAt-60000)return accessToken;
  const basic=Buffer.from(env.paypal.clientId+':'+env.paypal.clientSecret).toString('base64');
  const response=await fetch(env.paypal.baseUrl+'/v1/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+basic,'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials'});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.access_token){const e=new Error('PayPal authentication failed.');e.status=502;throw e;}
  accessToken=data.access_token;expiresAt=Date.now()+Number(data.expires_in||300)*1000;return accessToken;
}
async function paypal(path,access,{method='GET',body,requestId}={}){
  const response=await fetch(env.paypal.baseUrl+path,{method,headers:{Authorization:'Bearer '+access,'Content-Type':'application/json',...(requestId?{'PayPal-Request-Id':requestId}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok){const e=new Error('PayPal Sandbox request failed.');e.status=502;throw e;} return data;
}
router.post('/webhooks',asyncHandler(async(req,res)=>{
  if(!env.paypal.webhookId)return res.status(503).json({message:'PayPal webhook is not configured.'});
  const h=req.headers; const transmissionId=h['paypal-transmission-id'],transmissionTime=h['paypal-transmission-time'],transmissionSig=h['paypal-transmission-sig'],certUrl=h['paypal-cert-url'],authAlgo=h['paypal-auth-algo'];
  if(!transmissionId||!transmissionTime||!transmissionSig||!certUrl||!authAlgo)return res.status(400).json({message:'Missing PayPal transmission headers.'});
  const access=await token();
  const verification=await paypal('/v1/notifications/verify-webhook-signature',access,{method:'POST',body:{auth_algo:authAlgo,cert_url:certUrl,transmission_id:transmissionId,transmission_sig:transmissionSig,transmission_time:transmissionTime,webhook_id:env.paypal.webhookId,webhook_event:req.body}});
  if(verification.verification_status!=='SUCCESS')return res.status(400).json({message:'PayPal webhook signature verification failed.'});
  const event=req.body;if(!event?.id||!event?.event_type)return res.status(400).json({message:'Invalid PayPal webhook event.'});
  try{await PayPalWebhookEvent.create({eventId:event.id,eventType:event.event_type,status:'RECEIVED'});}
  catch(error){if(error.code!==11000)throw error;const existing=await PayPalWebhookEvent.findOne({eventId:event.id});if(existing?.status==='PROCESSED')return res.status(200).json({received:true,duplicate:true});}
  try{
    const resource=event.resource||{};const orderId=resource.supplementary_data?.related_ids?.order_id;const captureId=resource.id||null;
    const statusMap={'PAYMENT.CAPTURE.COMPLETED':'COMPLETED','PAYMENT.CAPTURE.PENDING':'PENDING','PAYMENT.CAPTURE.DENIED':'DENIED','PAYMENT.CAPTURE.REFUNDED':'REFUNDED','PAYMENT.CAPTURE.REVERSED':'REVERSED'};
    const next=statusMap[event.event_type];
    if(orderId&&next){
      const saved=await PayPalOrder.findOne({paypalOrderId:orderId});
      if(saved){
        const a=resource.amount;const amountOk=!a||(a.currency_code===saved.currency&&String(a.value)===saved.amount);
        const terminal=['COMPLETED','REFUNDED','REVERSED'];const mayUpdate=!terminal.includes(saved.status)||['REFUNDED','REVERSED'].includes(next);
        if(amountOk&&mayUpdate)await PayPalOrder.updateOne({_id:saved._id},{$set:{status:next,...(captureId?{captureId}:{})}});
      }
    }
    await PayPalWebhookEvent.updateOne({eventId:event.id},{$set:{status:'PROCESSED',processedAt:new Date()}});
    return res.status(200).json({received:true});
  }catch(error){await PayPalWebhookEvent.updateOne({eventId:event.id},{$set:{status:'FAILED'}});throw error;}
}));
router.use(requireAuth);
const schema=z.object({approvalId:z.string().regex(/^[a-f\d]{24}$/i)});
async function approvedRequest(id,userId){
  if(!mongoose.isValidObjectId(id))return null;
  const approval=await PurchaseApproval.findOne({_id:id,secondaryUserId:userId,status:'approved'});if(!approval||approval.currency!=='USD')return null;
  const circle=await Circle.findOne({_id:approval.circleId,primaryUserId:approval.primaryUserId,status:'active',members:{$elemMatch:{_id:approval.memberId,userId,role:'secondary',status:'active'}}});
  if(!circle)return null;const p=circle.members.id(approval.memberId)?.permissions;
  if(!p?.canShop||!p.canPay||p.currency!==approval.currency||Number(approval.amount)>Number(p.perTransactionLimit))return null;
  return approval;
}
router.post('/orders',asyncHandler(async(req,res)=>{
  const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({message:'Provide a valid approved purchase request ID.'});
  const approval=await approvedRequest(parsed.data.approvalId,req.user.id);if(!approval)return res.status(403).json({message:'Approved request or active Circle permissions not found.'});
  const existing=await PayPalOrder.findOne({approvalId:approval._id});if(existing)return res.json({orderId:existing.paypalOrderId,status:existing.status,approvalUrl:existing.approvalUrl,alreadyCreated:true});
  const order=await paypalCreateOrder({intent:'CAPTURE',purchaseUnits:[{referenceId:'buypal-approval-'+approval._id,description:approval.itemName,amount:{currencyCode:approval.currency,value:approval.amount}}],applicationContext:{brandName:'BuyPal',userAction:'PAY_NOW',returnUrl:env.frontendOrigin+'/checkout/paypal/return',cancelUrl:env.frontendOrigin+'/checkout/paypal/cancel'}},randomUUID());
  const approvalUrl=order.links?.find(l=>l.rel==='approve')?.href;if(!order.id||!approvalUrl){const e=new Error('PayPal did not return an approval URL.');e.status=502;throw e;}
  try{await PayPalOrder.create({userId:req.user.id,approvalId:approval._id,paypalOrderId:order.id,itemName:approval.itemName,amount:approval.amount,currency:approval.currency,status:order.status||'CREATED',approvalUrl});}
  catch(error){if(error.code===11000){const duplicate=await PayPalOrder.findOne({approvalId:approval._id});if(duplicate)return res.json({orderId:duplicate.paypalOrderId,status:duplicate.status,approvalUrl:duplicate.approvalUrl,alreadyCreated:true});}throw error;}
  return res.status(201).json({orderId:order.id,status:order.status,approvalUrl});
}));
router.post('/orders/:orderId/capture',asyncHandler(async(req,res)=>{
  const saved=await PayPalOrder.findOne({paypalOrderId:req.params.orderId,userId:req.user.id});if(!saved)return res.status(404).json({message:'PayPal order not found.'});
  if(saved.status==='COMPLETED')return res.json({orderId:saved.paypalOrderId,status:'COMPLETED',alreadyCaptured:true});
  if(saved.status==='CAPTURING')return res.status(409).json({message:'Capture is already processing.'});
  const approval=await approvedRequest(saved.approvalId.toString(),req.user.id);
  if(!approval||approval.amount!==saved.amount||approval.currency!==saved.currency||approval.itemName!==saved.itemName)return res.status(403).json({message:'Purchase approval or current Circle policy is no longer valid.'});
  const current=await paypalGetOrder(saved.paypalOrderId);
  if(current.status!=='APPROVED')return res.status(409).json({message:'PayPal buyer approval is required.',status:current.status});
  const unit=current.purchaseUnits?.[0]||current.purchase_units?.[0];const amount=unit?.amount;const amountCurrency=paypalField(amount,'currencyCode','currency_code');if(amountCurrency!==saved.currency||amount?.value!==saved.amount)return res.status(409).json({message:'PayPal order amount does not match the approved request.'});
  const claimed=await PayPalOrder.findOneAndUpdate({_id:saved._id,status:{$nin:['COMPLETED','CAPTURING']}},{$set:{status:'CAPTURING'}},{new:true});
  if(!claimed)return res.status(409).json({message:'Capture is already processing or completed.'});
  try{
    const result=await paypalCaptureOrder(saved.paypalOrderId,('buypal-'+saved.paypalOrderId).slice(0,38));
    const unit=result.purchaseUnits?.[0]||result.purchase_units?.[0];const capture=unit?.payments?.captures?.[0];const status=capture?.status||result.status||'PENDING';
    await PayPalOrder.updateOne({_id:saved._id},{$set:{status,captureId:capture?.id||null}});
    return res.json({orderId:result.id,status,captureId:capture?.id||null});
  }catch(error){await PayPalOrder.updateOne({_id:saved._id,status:'CAPTURING'},{$set:{status:'RECONCILIATION_REQUIRED'}});throw error;}
}));
export default router;
