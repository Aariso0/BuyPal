import 'dotenv/config';

const required = ['MONGODB_URI'];
for (const key of required) {
  if (!process.env[key]) throw new Error('Missing required environment variable: ' + key);
}
const paypalMode = (process.env.PAYPAL_MODE || 'sandbox').toLowerCase();
if (!['sandbox', 'production'].includes(paypalMode)) throw new Error('PAYPAL_MODE must be sandbox or production.');
const paypalCurrency = (process.env.PAYPAL_CURRENCY || 'USD').toUpperCase();
if (paypalCurrency !== 'USD') throw new Error('BuyPal wallet currency is USD; PAYPAL_CURRENCY must be USD.');
const paypalBaseUrl = process.env.PAYPAL_BASE_URL || (paypalMode === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com');
if (paypalMode === 'sandbox' && !paypalBaseUrl.startsWith('https://api-m.sandbox.paypal.com')) throw new Error('PayPal Sandbox mode must use https://api-m.sandbox.paypal.com');
if (paypalMode === 'production' && !paypalBaseUrl.startsWith('https://api-m.paypal.com')) throw new Error('PayPal Production mode must use https://api-m.paypal.com');
const aiServiceUrl = (process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000').trim().replace(/\/+$/, '');
try {
  const parsedAiUrl = new URL(aiServiceUrl);
  if (!['http:', 'https:'].includes(parsedAiUrl.protocol)) throw new Error('bad protocol');
} catch {
  throw new Error('AI_SERVICE_URL must be a valid http:// or https:// URL (for example http://127.0.0.1:8000).');
}
const aiTimeoutMs = Math.max(5000, Math.min(120000, Number(process.env.AI_REQUEST_TIMEOUT_MS || 45000) || 45000));
const mongodbUri = process.env.MONGODB_URI.trim();
if (!/^mongodb(\+srv)?:\/\//i.test(mongodbUri)) {
  throw new Error('MONGODB_URI must be a valid mongodb:// or mongodb+srv:// connection URI');
}
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  mongodbUri,
  sessionTtlDays: Math.max(1, Math.min(30, Number(process.env.SESSION_TTL_DAYS || 7))),
  cookieName: process.env.COOKIE_NAME || 'buypal_session',
  walletAdminKey: process.env.WALLET_ADMIN_KEY || '',
  isProduction: process.env.NODE_ENV === 'production',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_SECURE || 'true') === 'true',
    user: process.env.SMTP_USER || '',
    pass: (process.env.SMTP_APP_PASSWORD || '').replace(/\s/g, ''),
    from: process.env.MAIL_FROM || process.env.SMTP_USER || '',
  },
  ai: {
    serviceUrl: aiServiceUrl,
    serviceToken: process.env.AI_SERVICE_TOKEN || '',
    timeoutMs: aiTimeoutMs,
  },
  paypal: {
    mode: paypalMode,
    baseUrl: paypalBaseUrl,
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
    currency: paypalCurrency,
  },
};
