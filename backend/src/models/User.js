import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  displayName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  passwordHash: { type: String, required: true, select: false },
  disabledAt: { type: Date, default: null },
  preferences: { type: mongoose.Schema.Types.Mixed, default: () => ({ currency: 'USD', timeZone: 'Asia/Kolkata', notifications: { email: true, inApp: true, paymentAlerts: true }, shopping: { mode: 'assisted', requireApproval: true, monthlyLimit: 0 }, appearance: 'system', language: 'en' }) },
}, { timestamps: true, versionKey: false });
export const User = mongoose.models.User || mongoose.model('User', schema);
