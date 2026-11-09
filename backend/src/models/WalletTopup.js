import mongoose from 'mongoose';

const moneySchema = new mongoose.Schema({
  currency_code: { type: String, default: null },
  value: { type: String, default: null },
}, { _id: false });

const exchangeRateSchema = new mongoose.Schema({
  value: { type: String, default: null },
  source_currency: { type: String, default: null },
  target_currency: { type: String, default: null },
}, { _id: false });

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paypalOrderId: { type: String, required: true, unique: true },
  // Original amount requested from PayPal, in the PayPal order currency.
  amountMinor: { type: Number, required: true },
  currency: { type: String, required: true },
  status: {
    type: String,
    enum: ['CREATED', 'CAPTURING', 'COMPLETED', 'CAPTURED_UNCREDITED', 'FAILED'],
    default: 'CREATED',
  },
  captureId: { type: String, default: null },
  captureStatus: { type: String, default: null },
  paypalGrossAmount: { type: moneySchema, default: null },
  paypalFee: { type: moneySchema, default: null },
  paypalNetAmount: { type: moneySchema, default: null },
  paypalReceivableAmount: { type: moneySchema, default: null },
  paypalExchangeRate: { type: exchangeRateSchema, default: null },
  // Demo wallet credits are denominated in USD; they are not redeemable cash.
  walletCreditMinor: { type: Number, default: null },
  walletCreditCurrency: { type: String, default: 'USD' },
  creditFailureReason: { type: String, default: null },
}, { timestamps: true, versionKey: false });

export const WalletTopup = mongoose.models.WalletTopup || mongoose.model('WalletTopup', schema);
