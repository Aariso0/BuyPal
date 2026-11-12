
import {Router} from 'express';
import mongoose from 'mongoose';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {Wallet} from '../models/Wallet.js';
import {WalletTransaction} from '../models/WalletTransaction.js';
import {WalletTopup} from '../models/WalletTopup.js';
import {User} from '../models/User.js';
import {env} from '../config/env.js';
import {requireAuth} from '../middleware/require-auth.js';
import {asyncHandler} from '../utils/async-handler.js';
import {
  paypalCreateOrder,
  paypalGetOrder,
  paypalCaptureOrder,
  paypalField,
  normalizePaypalMoney,
  normalizePaypalExchangeRate
} from '../utils/paypal-sdk.js';

const router = Router();
router.use(requireAuth);

const toMoney = n => Number((n / 100).toFixed(2));

async function getWallet(userId, session) {
  let w = await Wallet.findOne({ userId }).session(session || null);

  if (!w) {
    try {
      w = await Wallet.create(
        [{ userId, currency: 'USD' }],
        session ? { session } : {}
      );
      w = w[0];
    } catch (e) {
      if (e.code !== 11000) throw e;
      w = await Wallet.findOne({ userId }).session(session || null);
    }
  }

  if (w && w.currency !== 'USD' && w.balanceMinor === 0) {
    w.currency = 'USD';
    await w.save(session ? { session } : {});
  }

  return w;
}

function view(t, userId) {
  return {
    id: t._id.toString(),
    reference: t.reference,
    type: t.type,
    direction: t.fromUserId?.toString() === userId ? 'sent' : 'received',
    amount: toMoney(t.amountMinor),
    currency: t.currency || 'USD',
    note: t.note,
    createdAt: t.createdAt,
    status: t.status
  };
}

router.get('/', asyncHandler(async (req, res) => {
  const w = await getWallet(req.user.id);

  res.json({
    wallet: {
      id: w._id.toString(),
      balance: toMoney(w.balanceMinor),
      currency: w.currency,
      status: w.status,
      label: w.currency === 'USD'
        ? 'USD Demo Wallet — no cash value'
        : w.currency === 'INR'
          ? 'Legacy INR demo balance — migration required'
          : 'Legacy demo credits — migration required'
    }
  });
}));

router.get('/transactions', asyncHandler(async (req, res) => {
  const rows = await WalletTransaction.find({
    $or: [
      { fromUserId: req.user.id },
      { toUserId: req.user.id }
    ]
  }).sort({ createdAt: -1 }).limit(100).lean();

  res.json({
    transactions: rows.map(t => view(t, req.user.id))
  });
}));

router.get('/paypal-config', asyncHandler(async (_req, res) => {
  if (!env.paypal.clientId || !env.paypal.clientSecret) {
    return res.status(503).json({
      message: 'PayPal credentials are not configured.'
    });
  }

  res.json({
    clientId: env.paypal.clientId,
    mode: env.paypal.mode,
    currency: env.paypal.currency
  });
}));

// Accept numeric amounts and numeric strings.
const transferSchema = z.object({
  recipientEmail: z.string().trim().email().max(254),
  amount: z.coerce.number().positive().max(100000).multipleOf(0.01),
  note: z.string().trim().max(160).optional().default('')
});

router.post('/send', asyncHandler(async (req, res) => {
  console.log('[SEND MONEY] Request received:', {
    bodyKeys: Object.keys(req.body || {}),
    hasRecipientEmail: typeof req.body?.recipientEmail === 'string',
    amountType: typeof req.body?.amount
  });

  const parsed = transferSchema.safeParse(req.body);

  if (!parsed.success) {
    console.error('[SEND MONEY] Validation failed:', parsed.error.issues);

    return res.status(400).json({
      message: 'Send Money validation failed.',
      errors: parsed.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  const { recipientEmail, amount, note } = parsed.data;

  const recipient = await User.findOne({
    email: recipientEmail.toLowerCase(),
    disabledAt: null
  });

  if (!recipient) {
    return res.status(404).json({
      message: 'No active BuyPal account found for that email.'
    });
  }

  if (recipient._id.toString() === req.user.id) {
    return res.status(400).json({
      message: 'You cannot send money to yourself.'
    });
  }

  const minor = Math.round(amount * 100);
  const reference = req.get('Idempotency-Key') || randomUUID();
  const session = await mongoose.startSession();
  let tx;

  try {
    await session.withTransaction(async () => {
      const prior = await WalletTransaction.findOne({
        reference
      }).session(session);

      if (prior) {
        if (
          prior.fromUserId?.toString() !== req.user.id ||
          prior.toUserId?.toString() !== recipient._id.toString() ||
          prior.amountMinor !== minor ||
          prior.note !== note
        ) {
          throw Object.assign(
            new Error('Idempotency key was already used for a different transfer.'),
            { status: 409 }
          );
        }

        tx = prior;
        return;
      }

      const sender = await getWallet(req.user.id, session);
      const receiver = await getWallet(recipient._id, session);

      if (sender.status !== 'active' || receiver.status !== 'active') {
        throw Object.assign(
          new Error('One of these wallets is not active.'),
          { status: 403 }
        );
      }

      if (sender.currency !== 'USD' || receiver.currency !== 'USD') {
        throw Object.assign(
          new Error(
            'This account has a legacy non-USD demo balance. Reconcile or reset it before using USD transfers.'
          ),
          { status: 409 }
        );
      }

      const debit = await Wallet.updateOne(
        {
          _id: sender._id,
          balanceMinor: { $gte: minor },
          status: 'active'
        },
        { $inc: { balanceMinor: -minor } },
        { session }
      );

      if (!debit.modifiedCount) {
        throw Object.assign(
          new Error('Insufficient available balance.'),
          { status: 409 }
        );
      }

      const credit = await Wallet.updateOne(
        { _id: receiver._id, status: 'active' },
        { $inc: { balanceMinor: minor } },
        { session }
      );

      if (!credit.modifiedCount) {
        throw Object.assign(
          new Error('Recipient wallet is not active.'),
          { status: 403 }
        );
      }

      [tx] = await WalletTransaction.create([{
        reference,
        type: 'TRANSFER',
        fromUserId: sender.userId,
        toUserId: receiver.userId,
        amountMinor: minor,
        currency: sender.currency,
        note
      }], { session });
    });
  } finally {
    await session.endSession();
  }

  return res.status(201).json({
    transaction: view(tx, req.user.id),
    message: 'Balance transfer completed.'
  });
}));

// Create PayPal Sandbox wallet top-up.
router.post('/sandbox-topups', asyncHandler(async (req, res) => {
  const p = z.object({
    amount: z.number().positive().max(1000).multipleOf(0.01)
  }).safeParse(req.body);

  if (!p.success) {
    return res.status(400).json({
      message: 'Enter a valid top-up amount (maximum 1,000 sandbox currency units).'
    });
  }

  if (!env.paypal.clientId || !env.paypal.clientSecret) {
    return res.status(503).json({
      message: 'PayPal credentials are not configured.'
    });
  }

  const currentWallet = await getWallet(req.user.id);

  if (currentWallet.currency !== 'USD') {
    return res.status(409).json({
      message: 'Your existing wallet has a non-USD balance. Reconcile or reset the legacy demo balance before adding USD.'
    });
  }

  if (env.paypal.currency !== 'USD') {
    return res.status(503).json({
      message: 'BuyPal wallet top-ups are configured for USD only.'
    });
  }

  const amount = p.data.amount.toFixed(2);

  const order = await paypalCreateOrder({
    intent: 'CAPTURE',
    purchaseUnits: [{
      referenceId: 'buypal-wallet-' + req.user.id,
      description: 'BuyPal demo wallet top-up in USD. Demo balance only; no cash value.',
      amount: {
        currencyCode: env.paypal.currency,
        value: amount
      }
    }],
    applicationContext: {
      brandName: 'BuyPal',
      userAction: 'PAY_NOW'
    }
  }, randomUUID());

  if (!order.id) {
    const e = new Error('PayPal did not return an order ID.');
    e.status = 502;
    throw e;
  }

  await WalletTopup.create({
    userId: req.user.id,
    paypalOrderId: order.id,
    amountMinor: Math.round(p.data.amount * 100),
    currency: env.paypal.currency
  });

  res.status(201).json({
    orderId: order.id,
    status: order.status
  });
}));

// Capture PayPal top-up and credit only a verified USD settlement amount.
router.post('/sandbox-topups/:orderId/capture', asyncHandler(async (req, res) => {
  const topup = await WalletTopup.findOne({
    paypalOrderId: req.params.orderId,
    userId: req.user.id
  });

  if (!topup) {
    return res.status(404).json({
      message: 'Wallet top-up not found.'
    });
  }

  const settlementResponse = (status, message, record = topup) => ({
    status,
    message,
    paypalSettlement: {
      grossAmount: record.paypalGrossAmount,
      fee: record.paypalFee,
      netAmount: record.paypalNetAmount,
      receivableAmount: record.paypalReceivableAmount,
      exchangeRate: record.paypalExchangeRate
    },
    walletCredit: record.walletCreditMinor == null
      ? null
      : {
          amount: toMoney(record.walletCreditMinor),
          currency: record.walletCreditCurrency || 'USD'
        }
  });

  if (topup.status === 'COMPLETED') {
    return res.json({
      ...settlementResponse('COMPLETED', 'PayPal capture was already processed.'),
      alreadyCaptured: true
    });
  }

  if (topup.status === 'CAPTURED_UNCREDITED') {
    return res.status(409).json({
      ...settlementResponse(
        'CAPTURED_UNCREDITED',
        topup.creditFailureReason ||
          'PayPal captured the payment, but did not return a USD merchant-receivable amount.'
      ),
      alreadyCaptured: true
    });
  }

  if (topup.status === 'CAPTURING') {
    return res.status(409).json({
      message: 'PayPal capture is already processing. Check the wallet activity before retrying.'
    });
  }

  const current = await paypalGetOrder(topup.paypalOrderId);
  const orderUnit = current.purchaseUnits?.[0] || current.purchase_units?.[0];
  const orderAmount = orderUnit?.amount;

  if (
    paypalField(orderAmount, 'currencyCode', 'currency_code') !== topup.currency ||
    orderAmount?.value !== (topup.amountMinor / 100).toFixed(2)
  ) {
    return res.status(409).json({
      message: 'PayPal order amount or currency mismatch.'
    });
  }

  const existingCapture = orderUnit?.payments?.captures?.[0];
  const alreadyCapturedByPayPal =
    current.status === 'COMPLETED' &&
    existingCapture?.status === 'COMPLETED';

  if (!alreadyCapturedByPayPal && current.status !== 'APPROVED') {
    return res.status(409).json({
      message: 'Approve this PayPal Sandbox order first.',
      status: current.status
    });
  }

  const claimed = await WalletTopup.findOneAndUpdate(
    {
      _id: topup._id,
      status: { $in: ['CREATED', 'FAILED'] }
    },
    { $set: { status: 'CAPTURING' } },
    { new: true }
  );

  if (!claimed) {
    return res.status(409).json({
      message: 'Top-up capture is already processing or complete.'
    });
  }

  let captured = current;
  let capture = existingCapture || null;

  try {
    if (!alreadyCapturedByPayPal) {
      captured = await paypalCaptureOrder(
        topup.paypalOrderId,
        ('buypal-topup-' + topup.paypalOrderId).slice(0, 38)
      );

      const capturedUnit =
        captured.purchaseUnits?.[0] || captured.purchase_units?.[0];

      capture = capturedUnit?.payments?.captures?.[0];
    }
  } catch (error) {
    await WalletTopup.updateOne(
      { _id: topup._id, status: 'CAPTURING' },
      { $set: { status: 'FAILED' } }
    );
    throw error;
  }

  if (capture?.status !== 'COMPLETED') {
    await WalletTopup.updateOne(
      { _id: topup._id, status: 'CAPTURING' },
      {
        $set: {
          status: 'FAILED',
          captureStatus: capture?.status || captured.status || 'UNKNOWN'
        }
      }
    );

    return res.status(409).json({
      message: 'PayPal has not completed this capture. No wallet balance was added.',
      status: capture?.status || captured.status || 'UNKNOWN'
    });
  }

  const breakdown =
    paypalField(capture, 'sellerReceivableBreakdown', 'seller_receivable_breakdown') || {};

  const receivable = normalizePaypalMoney(
    paypalField(breakdown, 'receivableAmount', 'receivable_amount')
  );

  const net = normalizePaypalMoney(
    paypalField(breakdown, 'netAmount', 'net_amount')
  );

  const gross = normalizePaypalMoney(
    paypalField(breakdown, 'grossAmount', 'gross_amount') || capture.amount
  );

  const fee = normalizePaypalMoney(
    paypalField(breakdown, 'paypalFee', 'paypal_fee')
  );

  const exchangeRate = normalizePaypalExchangeRate(
    paypalField(breakdown, 'exchangeRate', 'exchange_rate')
  );

  const creditAmount =
    receivable?.currency_code === 'USD'
      ? receivable
      : net?.currency_code === 'USD'
        ? net
        : null;

  const settlement = {
    captureId: capture.id || null,
    captureStatus: capture.status,
    paypalGrossAmount: gross,
    paypalFee: fee,
    paypalNetAmount: net,
    paypalReceivableAmount: receivable,
    paypalExchangeRate: exchangeRate
  };

  await WalletTopup.updateOne(
    { _id: topup._id, status: 'CAPTURING' },
    { $set: settlement }
  );

  if (
    !creditAmount ||
    !Number.isFinite(Number(creditAmount.value)) ||
    Number(creditAmount.value) <= 0
  ) {
    await WalletTopup.updateOne(
      { _id: topup._id, status: 'CAPTURING' },
      {
        $set: {
          ...settlement,
          status: 'CAPTURED_UNCREDITED',
          walletCreditMinor: null,
          walletCreditCurrency: 'USD',
          creditFailureReason: 'PayPal did not return a USD receivable or net amount.'
        }
      }
    );

    const saved = await WalletTopup.findById(topup._id);

    return res.status(409).json({
      status: 'CAPTURED_UNCREDITED',
      message: 'PayPal captured the payment, but its response did not contain a verified USD receivable/net amount. BuyPal did not credit the balance using an estimated or gross amount.',
      paypalSettlement: {
        grossAmount: saved.paypalGrossAmount,
        fee: saved.paypalFee,
        netAmount: saved.paypalNetAmount,
        receivableAmount: saved.paypalReceivableAmount,
        exchangeRate: saved.paypalExchangeRate
      },
      walletCredit: null
    });
  }

  const walletBefore = await getWallet(req.user.id);

  if (
    walletBefore.status !== 'active' ||
    (walletBefore.currency !== 'USD' && walletBefore.balanceMinor > 0)
  ) {
    const reason = walletBefore.status !== 'active'
      ? 'Wallet is frozen.'
      : 'An existing non-USD demo balance cannot be mixed with USD. Reconcile or reset the legacy demo balance first.';

    await WalletTopup.updateOne(
      { _id: topup._id, status: 'CAPTURING' },
      {
        $set: {
          ...settlement,
          status: 'CAPTURED_UNCREDITED',
          walletCreditMinor: null,
          walletCreditCurrency: 'USD',
          creditFailureReason: reason
        }
      }
    );

    return res.status(409).json({
      status: 'CAPTURED_UNCREDITED',
      message: `PayPal captured the payment and reported USD, but BuyPal did not credit the wallet: ${reason} Contact the project administrator for reconciliation.`,
      paypalSettlement: {
        grossAmount: settlement.paypalGrossAmount,
        fee: settlement.paypalFee,
        netAmount: settlement.paypalNetAmount,
        receivableAmount: settlement.paypalReceivableAmount,
        exchangeRate: settlement.paypalExchangeRate
      },
      walletCredit: null
    });
  }

  const usdMinor = Math.round(Number(creditAmount.value) * 100);

  if (!Number.isSafeInteger(usdMinor) || usdMinor < 1) {
    await WalletTopup.updateOne(
      { _id: topup._id, status: 'CAPTURING' },
      {
        $set: {
          ...settlement,
          status: 'CAPTURED_UNCREDITED',
          walletCreditMinor: null,
          walletCreditCurrency: 'USD',
          creditFailureReason: 'PayPal returned an invalid USD settlement amount.'
        }
      }
    );

    return res.status(409).json({
      status: 'CAPTURED_UNCREDITED',
      message: 'PayPal returned an invalid USD settlement amount. No wallet balance was added.'
    });
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const already = await WalletTransaction.findOne({
        reference: 'paypal-topup:' + topup.paypalOrderId
      }).session(session);

      if (!already) {
        const w = await getWallet(req.user.id, session);

        if (w.status !== 'active') {
          throw Object.assign(new Error('Wallet is not active.'), { status: 403 });
        }

        if (w.currency !== 'USD' && w.balanceMinor > 0) {
          throw Object.assign(
            new Error('Legacy non-USD balance cannot be mixed with USD.'),
            { status: 409 }
          );
        }

        if (w.currency !== 'USD') {
          await Wallet.updateOne(
            { _id: w._id },
            { $set: { currency: 'USD' } },
            { session }
          );
        }

        const credited = await Wallet.updateOne(
          { _id: w._id, status: 'active' },
          {
            $inc: { balanceMinor: usdMinor },
            $set: { currency: 'USD' }
          },
          { session }
        );

        if (!credited.modifiedCount) {
          throw Object.assign(new Error('Wallet is not active.'), { status: 403 });
        }

        await WalletTransaction.create([{
          reference: 'paypal-topup:' + topup.paypalOrderId,
          type: 'PAYPAL_SANDBOX_TOPUP',
          toUserId: req.user.id,
          amountMinor: usdMinor,
          currency: 'USD',
          note: `PayPal-reported USD settlement; paid ${
            capture.amount?.value || topup.amountMinor / 100
          } ${
            paypalField(capture.amount, 'currencyCode', 'currency_code') || topup.currency
          }`
        }], { session });
      }

      await WalletTopup.updateOne(
        { _id: topup._id },
        {
          $set: {
            ...settlement,
            status: 'COMPLETED',
            walletCreditMinor: usdMinor,
            walletCreditCurrency: 'USD'
          }
        },
        { session }
      );
    });
  } catch (error) {
    await WalletTopup.updateOne(
      { _id: topup._id, status: 'CAPTURING' },
      {
        $set: {
          status: 'CAPTURED_UNCREDITED',
          creditFailureReason: 'PayPal capture completed, but BuyPal could not safely post the USD wallet credit. Manual reconciliation is required.'
        }
      }
    );
    throw error;
  } finally {
    await session.endSession();
  }

  const savedTopup = await WalletTopup.findById(topup._id);

  return res.json({
    ...settlementResponse(
      'COMPLETED',
      'PayPal-reported USD amount credited to the BuyPal demo balance.',
      savedTopup
    ),
    walletCredit: {
      amount: toMoney(usdMinor),
      currency: 'USD'
    }
  });
}));

// Admin demo credit.
router.post('/admin/credit', asyncHandler(async (req, res) => {
  if (
    !env.walletAdminKey ||
    req.get('x-wallet-admin-key') !== env.walletAdminKey
  ) {
    return res.status(403).json({
      message: 'Admin credit access is not configured or authorized.'
    });
  }

  const p = z.object({
    email: z.string().email(),
    amount: z.number().positive().max(100000).multipleOf(0.01),
    note: z.string().max(160).optional().default('')
  }).safeParse(req.body);

  if (!p.success) {
    return res.status(400).json({
      message: 'Enter a valid email and amount.'
    });
  }

  const recipient = await User.findOne({
    email: p.data.email.toLowerCase(),
    disabledAt: null
  });

  if (!recipient) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const session = await mongoose.startSession();
  let tx;

  try {
    await session.withTransaction(async () => {
      const w = await getWallet(recipient._id, session);

      if (w.currency !== 'USD') {
        throw Object.assign(
          new Error('This account has a legacy non-USD demo balance. Reconcile or reset it before using USD transfers.'),
          { status: 409 }
        );
      }

      const minor = Math.round(p.data.amount * 100);

      const credited = await Wallet.updateOne(
        { _id: w._id, status: 'active' },
        { $inc: { balanceMinor: minor } },
        { session }
      );

      if (!credited.modifiedCount) {
        throw Object.assign(new Error('Wallet is not active.'), { status: 403 });
      }

      [tx] = await WalletTransaction.create([{
        reference: randomUUID(),
        type: 'ADMIN_CREDIT',
        toUserId: recipient._id,
        amountMinor: minor,
        currency: w.currency,
        note: p.data.note
      }], { session });
    });
  } finally {
    await session.endSession();
  }

  res.status(201).json({
    transaction: view(tx, recipient._id.toString()),
    message: 'Demo balance added.'
  });
}));

export default router;
