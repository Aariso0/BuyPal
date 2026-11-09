import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
let transporter;
export function isMailConfigured() { return Boolean(env.smtp.user && env.smtp.pass && env.smtp.from); }
function getTransporter() {
  if (!isMailConfigured()) throw Object.assign(new Error('Email delivery is not configured. Add Gmail SMTP credentials to backend .env.'), { status: 503 });
  if (!transporter) transporter = nodemailer.createTransport({ host: env.smtp.host, port: env.smtp.port, secure: env.smtp.secure, auth: { user: env.smtp.user, pass: env.smtp.pass } });
  return transporter;
}
export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const safeName = String(name || 'there').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  await getTransporter().sendMail({
    from: env.smtp.from, to, subject: 'Reset your BuyPal password',
    text: `Hi ${name || 'there'},\n\nWe received a request to reset your BuyPal password. Open this link to choose a new password: ${resetUrl}\n\nThis link expires in 30 minutes and can only be used once. If you did not request this, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#172033"><h2>Reset your BuyPal password</h2><p>Hi ${safeName},</p><p>We received a request to reset your BuyPal password. Use the button below to choose a new password.</p><p style="margin:28px 0"><a href="${resetUrl}" style="background:#2457e6;color:#fff;padding:13px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Reset password</a></p><p>This link expires in 30 minutes and can only be used once.</p><p>If you did not request this, you can safely ignore this email.</p><hr><small>BuyPal · Secure account notifications</small></div>`
  });
}
