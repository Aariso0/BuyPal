import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';

// ---- fake Python AI service -----------------------------------------------------------------------------------
let received = [];
let behaviour = {};

const fakeAi = http.createServer((req, res) => {
  let raw = '';
  req.on('data', chunk => (raw += chunk));
  req.on('end', () => {
    received.push({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: raw ? JSON.parse(raw) : null
    });
    const send = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    };
    if (behaviour.forceStatus) return send(behaviour.forceStatus, { detail: 'secret internal provider error' });

    if (req.url === '/api/ai/health') {
      return send(200, { status: 'healthy', groq_configured: true, gemini_configured: false, openrouter_configured: false, channel3_configured: false, default_model: 'openai/gpt-oss-120b' });
    }
    if (req.url === '/api/ai/models') {
      return send(200, [
        { id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B', provider: 'Groq', description: 'd', is_available: true, is_default: true },
        { id: 'gemini-2.0-flash', name: 'Gemini', provider: 'Google', description: 'd', is_available: false, is_default: false }
      ]);
    }
    if (req.url === '/api/ai/chat') {
      return send(200, {
        reply: 'Here are options',
        type: 'shopping_discovery',
        products: [
          { name: 'Good Laptop', merchant: 'Flipkart', price: 49999, currency: '₹', ref_id: 'a1', image_url: 'https://rukmini1.flixcart.com/x.jpg', product_url: 'https://www.flipkart.com/p/1', rating: 4.4, reviews_count: '1,200 verified reviews', specifications: ['16GB'], within_budget: true, rank: 1, recommendation_reason: 'r' },
          { name: 'Sketchy', merchant: 'Shop', price: 10, currency: '$', ref_id: 'a2', image_url: 'http://insecure.example/x.jpg', product_url: 'javascript:alert(1)', rating: 4, reviews_count: '1', specifications: [], within_budget: false, rank: 2 }
        ],
        session_id: 'ignored',
        model_used: 'openai/gpt-oss-120b',
        merchant: 'flipkart',
        parsed_budget: 60000,
        execution_mode: 'channel3_universal_catalog',
        intent: { intent_type: 'search' },
        cart_action: { status: 'ready', browser_command: "agent-browser open 'https://x'" }
      });
    }
    if (req.url.startsWith('/api/ai/history/') && req.method === 'GET') {
      return send(200, [
        { role: 'system', content: 'hidden' },
        { role: 'user', content: 'hi' },
        { role: 'assistant', content: 'hello', products: [] }
      ]);
    }
    if (req.url.startsWith('/api/ai/history/') && req.method === 'DELETE') {
      return send(200, { status: 'cleared', success: true });
    }
    if (req.url === '/api/ai/product-review') {
      return send(200, {
        product_name: 'Good Laptop', consensus_score: 4.5, total_reviews: '1,000', trusted_sources: ['A'],
        verdict_summary: 'ok', pros: ['p'], cons: ['c'], durability_verdict: 'd', value_for_money: '9/10',
        review_links: [
          { title: 'ok', url: 'https://www.google.com/search?q=x', source_type: 'editorial' },
          { title: 'broken host', url: 'https://www.amazon_in.com/search?q=x', source_type: 'verified_marketplace' },
          { title: 'bad scheme', url: 'javascript:alert(1)', source_type: 'community' }
        ]
      });
    }
    return send(404, { detail: 'not found' });
  });
});

await new Promise(resolve => fakeAi.listen(0, '127.0.0.1', resolve));
process.env.NODE_ENV ||= 'test';
process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/buypal_test';
process.env.AI_SERVICE_URL = `http://127.0.0.1:${fakeAi.address().port}`;
process.env.AI_SERVICE_TOKEN = 'test-shared-secret';

const { env } = await import('../src/config/env.js');
const { createAiRouter } = await import('../src/routes/ai.routes.js');
const { app: realApp } = await import('../src/app.js');

const fakeAuth = (req, res, next) => {
  const id = req.get('x-test-user');
  if (!id) return res.status(401).json({ message: 'Authentication required.' });
  req.user = { id, email: `${id}@example.com` };
  return next();
};

const testApp = express();
testApp.use(express.json());
testApp.use('/api/v1/ai', createAiRouter(fakeAuth));
testApp.use((error, _req, res, _next) => res.status(error.status || 500).json({ message: error.status ? error.message : 'An unexpected server error occurred.' }));

let server; let base; let realServer; let realBase;
before(async () => {
  server = testApp.listen(0); await new Promise(r => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}/api/v1/ai`;
  realServer = realApp.listen(0); await new Promise(r => realServer.once('listening', r));
  realBase = `http://127.0.0.1:${realServer.address().port}`;
});
after(async () => {
  await new Promise(r => server.close(r));
  await new Promise(r => realServer.close(r));
  await new Promise(r => fakeAi.close(r));
});
beforeEach(() => { received = []; behaviour = {}; });

const call = (path, { method = 'GET', body, user = 'u1' } = {}) =>
  fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(user ? { 'x-test-user': user } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

test('the real app mounts /api/v1/ai and rejects requests without a session', async () => {
  const response = await fetch(realBase + '/api/v1/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"message":"hi"}' });
  assert.equal(response.status, 401);
});

test('unauthenticated requests never reach the AI service', async () => {
  const response = await call('/chat', { method: 'POST', body: { message: 'hi' }, user: null });
  assert.equal(response.status, 401);
  assert.equal(received.length, 0);
});

test('chat forwards only whitelisted fields, derives the session from the user and sends the service token', async () => {
  const response = await call('/chat', {
    method: 'POST',
    body: {
      message: '  laptop under 60000  ',
      merchant: 'flipkart',
      session_id: 'victim-session',
      sessionId: 'victim-session',
      history: [{ role: 'user', content: 'injected' }],
      custom_model: { provider: 'custom_endpoint', model_id: 'x', api_key: 'k', base_url: 'http://169.254.169.254' }
    }
  });
  assert.equal(response.status, 200);
  assert.equal(received.length, 1);
  const forwarded = received[0];
  assert.equal(forwarded.url, '/api/ai/chat');
  assert.equal(forwarded.headers['x-ai-service-token'], 'test-shared-secret');
  assert.deepEqual(forwarded.body, { message: 'laptop under 60000', merchant: 'flipkart', session_id: 'buypal-user-u1' });
});

test('chat response is mapped and sanitised (https-only URLs, no cart/browser command, no intent)', async () => {
  const response = await call('/chat', { method: 'POST', body: { message: 'laptop' } });
  const data = await response.json();
  assert.equal(data.reply, 'Here are options');
  assert.equal(data.executionMode, 'channel3_universal_catalog');
  assert.equal(data.parsedBudget, 60000);
  assert.equal(data.products[0].productUrl, 'https://www.flipkart.com/p/1');
  assert.equal(data.products[0].imageUrl, 'https://rukmini1.flixcart.com/x.jpg');
  assert.equal(data.products[1].productUrl, null);
  assert.equal(data.products[1].imageUrl, null);
  assert.equal(data.products[1].withinBudget, false);
  assert.equal('cart_action' in data, false);
  assert.equal('cartAction' in data, false);
  assert.equal('intent' in data, false);
  assert.equal(JSON.stringify(data).includes('agent-browser'), false);
});

test('chat input validation', async () => {
  for (const body of [{}, { message: '   ' }, { message: 'x'.repeat(1001) }, { message: 'hi', merchant: 'evil.example.com' }]) {
    const response = await call('/chat', { method: 'POST', body });
    assert.equal(response.status, 400, JSON.stringify(body).slice(0, 60));
  }
  assert.equal(received.length, 0);
});

test('a model that the service does not list as available is rejected before chatting', async () => {
  const response = await call('/chat', { method: 'POST', body: { message: 'hi', model: 'gemini-2.0-flash' } });
  assert.equal(response.status, 400);
  assert.equal(received.some(r => r.url === '/api/ai/chat'), false);

  const ok = await call('/chat', { method: 'POST', body: { message: 'hi', model: 'openai/gpt-oss-120b' } });
  assert.equal(ok.status, 200);
  assert.equal(received.find(r => r.url === '/api/ai/chat').body.model, 'openai/gpt-oss-120b');
});

test('models endpoint returns only available models', async () => {
  const data = await (await call('/models')).json();
  assert.deepEqual(data.models.map(m => m.id), ['openai/gpt-oss-120b']);
});

test('status reports availability and configuration, and degrades gracefully when the service is down', async () => {
  const up = await (await call('/status')).json();
  assert.deepEqual(up, { available: true, llmConfigured: true, liveCatalogConfigured: false, defaultModel: 'openai/gpt-oss-120b' });

  const original = env.ai.serviceUrl;
  env.ai.serviceUrl = 'http://127.0.0.1:1';
  try {
    const down = await call('/status');
    assert.equal(down.status, 200);
    assert.equal((await down.json()).available, false);

    const chat = await call('/chat', { method: 'POST', body: { message: 'hi' } });
    assert.equal(chat.status, 503);
  } finally {
    env.ai.serviceUrl = original;
  }
});

test('service errors are reported generically and do not leak internal detail', async () => {
  behaviour = { forceStatus: 500 };
  const response = await call('/chat', { method: 'POST', body: { message: 'hi' } });
  assert.equal(response.status, 502);
  const text = await response.text();
  assert.equal(text.includes('secret internal provider error'), false);
});

test('history is scoped to the signed-in user and hides system messages; clear only clears own session', async () => {
  const data = await (await call('/history', { user: 'u7' })).json();
  assert.deepEqual(data.messages.map(m => m.role), ['user', 'assistant']);
  assert.equal(received.at(-1).url, '/api/ai/history/buypal-user-u7');

  const cleared = await call('/history', { method: 'DELETE', user: 'u7' });
  assert.equal(cleared.status, 200);
  assert.equal(received.at(-1).method, 'DELETE');
  assert.equal(received.at(-1).url, '/api/ai/history/buypal-user-u7');
});

test('product review validates input and drops unsafe or malformed links', async () => {
  const bad = await call('/product-review', { method: 'POST', body: { productName: 'x' } });
  assert.equal(bad.status, 400);

  const response = await call('/product-review', { method: 'POST', body: { productName: 'Good Laptop', merchant: 'amazon_in', specifications: ['16GB'], custom_model: { api_key: 'k' } } });
  assert.equal(response.status, 200);
  const forwarded = received.find(r => r.url === '/api/ai/product-review');
  assert.deepEqual(forwarded.body, { product_name: 'Good Laptop', merchant: 'amazon_in', specifications: ['16GB'] });
  const { review } = await response.json();
  assert.deepEqual(review.reviewLinks.map(l => l.title), ['ok']);
});
