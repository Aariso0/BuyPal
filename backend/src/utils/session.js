import { createHash, randomBytes } from 'node:crypto';
import { env } from '../config/env.js';

export const createSessionToken = () => randomBytes(32).toString('base64url');
export const hashSessionToken = token => createHash('sha256').update(token).digest('hex');
// SameSite=None (the cross-site default in production) is only accepted by browsers on Secure cookies.
const cookieBase = {
  httpOnly: true,
  secure: env.isProduction || env.cookieSameSite === 'none',
  sameSite: env.cookieSameSite,
  path: '/',
};
export const sessionCookieOptions = { ...cookieBase, maxAge: env.sessionTtlDays * 24 * 60 * 60 * 1000 };
export const clearSessionCookieOptions = cookieBase;
