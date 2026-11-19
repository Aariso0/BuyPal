import { Router } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/require-auth.js';
import { asyncHandler } from '../utils/async-handler.js';

/**
 * BuyPal AI shopping assistant gateway.
 *
 * The Python agent in /ai is never exposed to the browser. Every request goes through this router, which:
 *  - requires a signed-in BuyPal session,
 *  - derives the agent's chat session id from the signed-in user (so users cannot read each other's chats),
 *  - validates and whitelists the fields it forwards (the agent's `custom_model`, `history` and
 *    `select-product`/`browser_command` features are intentionally NOT exposed),
 *  - maps the agent's response to a small, sanitized shape (https-only URLs, bounded text lengths).
 *
 * The assistant only suggests products. It has no access to wallet, Circle or approval data and cannot spend money.
 */

const MERCHANTS = ['flipkart', 'amazon_in', 'myntra', 'amazon_com'];

const httpError = (status, message) => Object.assign(new Error(message), { status });

const sessionIdFor = userId => `buypal-user-${userId}`;

// ---- calling the Python service -------------------------------------------------------------------------------

export async function callAiService(path, { method = 'GET', body, timeoutMs = env.ai.timeoutMs } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (env.ai.serviceToken) headers['x-ai-service-token'] = env.ai.serviceToken;

  try {
    const response = await fetch(`${env.ai.serviceUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Log the status only; the agent's error detail can contain provider/internal information.
      console.error(
        'AI service request failed:',
        method,
        path.split('?')[0],
        response.status,
        response.status === 401 ? '(check that AI_SERVICE_TOKEN matches in backend/.env and ai/.env)' : ''
      );
      throw httpError(502, 'The AI assistant could not complete that request. Please try again.');
    }
    return data;
  } catch (error) {
    if (error?.status) throw error;
    if (error?.name === 'AbortError') {
      throw httpError(504, 'The AI assistant took too long to respond. Please try again.');
    }
    console.error('AI service unreachable:', error?.cause?.code || error?.message);
    throw httpError(503, 'The AI assistant is not available right now.');
  } finally {
    clearTimeout(timer);
  }
}

// ---- response mapping / sanitising ----------------------------------------------------------------------------

const text = (value, max = 500) => (typeof value === 'string' ? value.slice(0, max) : '');
const number = (value, fallback = 0) => (Number.isFinite(Number(value)) ? Number(value) : fallback);
const textList = (value, maxItems, maxLen) =>
  Array.isArray(value) ? value.filter(v => typeof v === 'string').slice(0, maxItems).map(v => v.slice(0, maxLen)) : [];

// Scraped pages and LLM output are untrusted: only pass through absolute https URLs.
function httpsUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:' && !url.hostname.includes('_') ? url.href : null;
  } catch {
    return null;
  }
}

function mapProduct(p) {
  return {
    id: text(p?.ref_id, 100),
    name: text(p?.name, 300),
    merchant: text(p?.merchant, 60),
    price: number(p?.price),
    currency: text(p?.currency, 8),
    imageUrl: httpsUrl(p?.image_url),
    productUrl: httpsUrl(p?.product_url),
    rating: number(p?.rating),
    reviewsCount: text(p?.reviews_count, 60),
    specifications: textList(p?.specifications, 6, 160),
    withinBudget: p?.within_budget !== false,
    rank: number(p?.rank, 1),
    reason: text(p?.recommendation_reason, 300)
  };
}

function mapReview(r) {
  return {
    productName: text(r?.product_name, 300),
    consensusScore: number(r?.consensus_score),
    totalReviews: text(r?.total_reviews, 200),
    trustedSources: textList(r?.trusted_sources, 6, 80),
    verdictSummary: text(r?.verdict_summary, 1200),
    pros: textList(r?.pros, 6, 240),
    cons: textList(r?.cons, 6, 240),
    durabilityVerdict: text(r?.durability_verdict, 600),
    valueForMoney: text(r?.value_for_money, 120),
    reviewLinks: (Array.isArray(r?.review_links) ? r.review_links : [])
      .slice(0, 6)
      .map(l => ({ title: text(l?.title, 200), url: httpsUrl(l?.url), sourceType: text(l?.source_type, 40) }))
      .filter(l => l.url)
  };
}

function mapChat(data) {
  const budget = data?.parsed_budget;
  return {
    reply: text(data?.reply, 8000),
    type: text(data?.type, 50),
    products: (Array.isArray(data?.products) ? data.products : []).slice(0, 8).map(mapProduct),
    modelUsed: text(data?.model_used, 100),
    merchant: text(data?.merchant, 50),
    parsedBudget: budget !== null && budget !== undefined && Number.isFinite(Number(budget)) ? Number(budget) : null,
    executionMode: text(data?.execution_mode, 50),
    trustedReview: data?.trusted_review ? mapReview(data.trusted_review) : null
  };
}

async function availableModels() {
  const data = await callAiService('/api/ai/models', { timeoutMs: 8000 });
  return (Array.isArray(data) ? data : [])
    .filter(m => m && m.is_available)
    .map(m => ({
      id: text(m.id, 100),
      name: text(m.name, 100),
      provider: text(m.provider, 100),
      description: text(m.description, 300),
      isDefault: Boolean(m.is_default)
    }));
}

// ---- routes ---------------------------------------------------------------------------------------------------

const chatSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  merchant: z.enum(MERCHANTS).optional().default('flipkart'),
  model: z.string().trim().min(1).max(100).optional()
});

const reviewSchema = z.object({
  productName: z.string().trim().min(2).max(200),
  merchant: z.enum(MERCHANTS).optional().default('flipkart'),
  specifications: z.array(z.string().trim().max(200)).max(10).optional().default([]),
  model: z.string().trim().min(1).max(100).optional()
});

async function assertModelAllowed(model) {
  if (!model) return;
  const models = await availableModels();
  if (!models.some(m => m.id === model)) {
    throw httpError(400, 'That AI model is not available.');
  }
}

export function createAiRouter(authMiddleware = requireAuth) {
  const router = Router();
  router.use(authMiddleware);

  // Is the AI service reachable and configured? Never an error: the UI uses this to explain what is missing.
  router.get('/status', asyncHandler(async (_req, res) => {
    try {
      const health = await callAiService('/api/ai/health', { timeoutMs: 5000 });
      res.json({
        available: true,
        llmConfigured: Boolean(health?.groq_configured || health?.gemini_configured || health?.openrouter_configured),
        liveCatalogConfigured: Boolean(health?.channel3_configured),
        defaultModel: text(health?.default_model, 100)
      });
    } catch {
      res.json({ available: false, llmConfigured: false, liveCatalogConfigured: false, defaultModel: '' });
    }
  }));

  router.get('/models', asyncHandler(async (_req, res) => {
    res.json({ models: await availableModels() });
  }));

  router.post('/chat', asyncHandler(async (req, res) => {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Enter a message of up to 1,000 characters.' });
    }
    const { message, merchant, model } = parsed.data;
    await assertModelAllowed(model);

    const data = await callAiService('/api/ai/chat', {
      method: 'POST',
      body: { message, merchant, model, session_id: sessionIdFor(req.user.id) }
    });
    return res.json(mapChat(data));
  }));

  router.get('/history', asyncHandler(async (req, res) => {
    const data = await callAiService(`/api/ai/history/${encodeURIComponent(sessionIdFor(req.user.id))}`, { timeoutMs: 8000 });
    const messages = (Array.isArray(data) ? data : [])
      .filter(m => m && (m.role === 'user' || m.role === 'assistant'))
      .slice(-40)
      .map(m => ({
        role: m.role,
        content: text(m.content, 8000),
        products: (Array.isArray(m.products) ? m.products : []).slice(0, 8).map(mapProduct)
      }));
    res.json({ messages });
  }));

  router.delete('/history', asyncHandler(async (req, res) => {
    await callAiService(`/api/ai/history/${encodeURIComponent(sessionIdFor(req.user.id))}`, { method: 'DELETE', timeoutMs: 8000 });
    res.json({ cleared: true });
  }));

  router.post('/product-review', asyncHandler(async (req, res) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Provide a product name (2-200 characters).' });
    }
    const { productName, merchant, specifications, model } = parsed.data;
    await assertModelAllowed(model);

    const data = await callAiService('/api/ai/product-review', {
      method: 'POST',
      body: { product_name: productName, merchant, specifications, model }
    });
    return res.json({ review: mapReview(data) });
  }));

  return router;
}

export default createAiRouter();
