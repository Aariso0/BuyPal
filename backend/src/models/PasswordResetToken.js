import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 },
  usedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });
export const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model('PasswordResetToken', schema);
