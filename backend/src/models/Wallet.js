import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,unique:true},currency:{type:String,default:'USD',enum:['USD','INR','CREDITS']},balanceMinor:{type:Number,default:0,min:0},status:{type:String,enum:['active','frozen'],default:'active'}},{timestamps:true,versionKey:false});
export const Wallet=mongoose.models.Wallet||mongoose.model('Wallet',schema);
