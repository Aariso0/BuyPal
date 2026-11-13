import { Router } from 'express';
import { randomBytes, createHash } from 'node:crypto';
import argon2 from 'argon2';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { sendPasswordResetEmail, isMailConfigured } from '../utils/mailer.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/async-handler.js';
import { createSessionToken, hashSessionToken, sessionCookieOptions, clearSessionCookieOptions } from '../utils/session.js';
import { requireAuth } from '../middleware/require-auth.js';
const router = Router();
const credentials = z.object({ email: z.string().trim().email().max(254).transform(v => v.toLowerCase()), password: z.string().min(8).max(128) });
const registration = credentials.extend({ name: z.string().trim().min(2).max(80) });
const publicUser = user => ({ id: user._id.toString(), email: user.email, name: user.displayName });
async function issueSession(userId, req, res) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + env.sessionTtlDays * 86400000);
  await Session.create({ userId, tokenHash: hashSessionToken(token), expiresAt, userAgent: req.get('user-agent')?.slice(0, 500) || null, ipAddress: req.ip || null });
  res.cookie(env.cookieName, token, sessionCookieOptions);
}
router.post('/register', asyncHandler(async (req, res) => {
  const parsed = registration.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Please provide a valid name, email and password.' });
  const { name, email, password } = parsed.data;
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  try {
    const user = await User.create({ email, displayName: name, passwordHash });
    await issueSession(user._id, req, res);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    throw error;
  }
}));
router.post('/login', asyncHandler(async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Enter a valid email and password.' });
  const { email, password } = parsed.data;
  const user = await User.findOne({ email, disabledAt: null }).select('+passwordHash');
  const valid = user ? await argon2.verify(user.passwordHash, password).catch(() => false) : false;
  if (!valid) return res.status(401).json({ message: 'Invalid email or password.' });
  await Session.deleteMany({ userId: user._id });
  await issueSession(user._id, req, res);
  return res.json({ user: publicUser(user) });
}));

const sha256 = value => createHash('sha256').update(value).digest('hex');
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const parsed = z.object({ email: z.string().trim().email().max(254).transform(v => v.toLowerCase()) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Enter a valid email address.' });
  const user = await User.findOne({ email: parsed.data.email, disabledAt: null });
  // Always return the same response for known and unknown email addresses.
  if (user) {
    if (!isMailConfigured()) return res.status(503).json({ message: 'Email delivery is not configured. Add Gmail SMTP credentials to backend .env.' });
    await PasswordResetToken.deleteMany({ userId: user._id });
    const rawToken = randomBytes(32).toString('hex');
    await PasswordResetToken.create({ userId: user._id, tokenHash: sha256(rawToken), expiresAt: new Date(Date.now() + 30 * 60 * 1000) });
    const base = env.frontendOrigin.replace(/\/$/, '');
    const resetUrl = `${base}/reset-password?token=${rawToken}`;
    try { await sendPasswordResetEmail({ to: user.email, name: user.displayName, resetUrl }); }
    catch (error) { await PasswordResetToken.deleteOne({ tokenHash: sha256(rawToken) }); throw error; }
  }
  return res.json({ message: 'If an account exists for that email, a password reset link has been sent.' });
}));
router.post('/reset-password', asyncHandler(async (req, res) => {
  const parsed = z.object({ token: z.string().length(64), password: z.string().min(8).max(128) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'The reset link is invalid or expired. Request a new one.' });
  const tokenHash = sha256(parsed.data.token);
  const reset = await PasswordResetToken.findOneAndUpdate({ tokenHash, usedAt: null, expiresAt: { $gt: new Date() } }, { $set: { usedAt: new Date() } }, { new: true });
  if (!reset) return res.status(400).json({ message: 'The reset link is invalid, expired, or already used. Request a new one.' });
  const passwordHash = await argon2.hash(parsed.data.password, { type: argon2.argon2id });
  await User.updateOne({ _id: reset.userId }, { $set: { passwordHash } });
  await Session.deleteMany({ userId: reset.userId });
  await PasswordResetToken.deleteMany({ userId: reset.userId });
  return res.json({ message: 'Your password has been reset. Please log in with your new password.' });
}));

router.post('/logout', asyncHandler(async (req, res) => {
  const token = req.cookies?.[env.cookieName];
  if (token) await Session.deleteOne({ tokenHash: hashSessionToken(token) });
  res.clearCookie(env.cookieName, clearSessionCookieOptions);
  return res.status(204).end();
}));
router.get('/session', requireAuth, (req, res) => res.json({ user: { id: req.user.id, email: req.user.email, name: req.user.display_name } }));
export default router;
