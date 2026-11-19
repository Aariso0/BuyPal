# Deployment

Verified against the code in this repository. Anything that could not be verified here is marked **UNVERIFIED**.

## Detected stack

| Layer | Technology | Evidence |
|---|---|---|
| Frontend | React 19 + Vite 8 (SPA, `frontend/`) | `frontend/index.html`, `frontend/src/main.jsx`, `frontend/package.json` |
| Frontend 3D/motion | `three`, `@react-three/fiber`, `@react-three/drei`, `gsap` | `frontend/src/components/BuyPalScrollObject.jsx` |
| Backend | Node.js ≥ 20.19, Express 5, ESM (`backend/`) | `backend/src/app.js`, `backend/src/server.js` |
| Database | MongoDB via Mongoose 9 (transactions required by wallet routes) | `backend/src/db/connection.js`, `backend/src/routes/wallet.routes.js` |
| Auth | Opaque session cookie (`HttpOnly`), Argon2id hashes | `backend/src/utils/session.js` |
| Payments | PayPal JavaScript SDK v6 (browser) + `@paypal/paypal-server-sdk` 2.5.0 (server) | `backend/src/utils/paypal-sdk.js`, `backend/src/routes/paypal.routes.js` |
| AI | Not implemented yet — UI placeholders only | `frontend/src/main.jsx` (`ShoppingPage`) |
| CI | No workflows yet (only a PR template) | `.github/` |

The frontend and backend are independent packages with independent manifests and lockfiles. There is no workspace/monorepo tooling to preserve: `frontend/` and `backend/` are deployed separately.

## Frontend — Vercel

Create the Vercel project from GitHub repository `Aariso0/BuyPal` with these settings:

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | `Vite` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 20.x or 22.x (project requires `^20.19.0 \|\| >=22.12.0`) |
| Environment Variable | `VITE_API_URL` = `https://<your-backend-host>/api/v1` |

`frontend/vercel.json` contains the SPA rewrite (`/(.*)` → `/index.html`). Vercel serves real files first, so `/assets/*` and `/models/*` are unaffected while `/app/*`, `/login`, `/reset-password` etc. survive a refresh.

Notes:
- `vite.config.js` fails the build when `VITE_API_URL` is missing, so a misconfigured deploy cannot silently ship a client that points at `localhost`. `frontend/src/api.js` additionally throws at startup if it is ever built without one.
- Vite inlines `VITE_API_URL` into the JS bundle at build time. Changing it requires a redeploy, not just an env edit.
- Never put backend secrets in `VITE_*` variables; they are public.
- Build output is ~30 MB (the `public/models/buypal-core.glb` 3D asset dominates). Vercel's per-deployment size limits are not a concern here.
- The JS bundle is a single ~1.45 MB chunk (mostly `three`). It builds and runs; code-splitting is an optimisation, not a blocker.

Deploy steps:
1. Push the branch to `Aariso0/BuyPal`.
2. Vercel → *Add New… → Project* → import `Aariso0/BuyPal`.
3. Set Root Directory to `frontend`, confirm preset `Vite`.
4. Add `VITE_API_URL` for Production (and Preview, if previews should work).
5. Deploy, then copy the deployment origin (e.g. `https://buypal.vercel.app`) into the backend `FRONTEND_ORIGIN`.

## Backend — recommended: Render (or Railway/Fly)

The backend needs a long-running Node process: MongoDB connection pooling, in-memory PayPal token cache, rate-limit state, webhook endpoint and graceful `SIGTERM` shutdown. Use a persistent Node host; do **not** try to squeeze it into Vercel Functions.

Recommended: **Render Web Service** + **MongoDB Atlas**.

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Node 20+ |
| Build Command | `npm ci` |
| Start Command | `npm start` (`node src/server.js`) |
| Health Check Path | `/health` |
| Environment | variables in the table below |
| Port | Read from `PORT` (Render/Railway inject it; defaults to 4000) |

`backend/src/server.js` listens on `process.env.PORT`, enables `trust proxy` in production, and shuts down gracefully on `SIGINT`/`SIGTERM`. Exit on DB connection failure is intentional.

MongoDB must support transactions (wallet transfers use `session.withTransaction`): use Atlas (replica set by default) or your own replica set. A standalone `mongod` will break `POST /api/v1/wallet/send`.

Health check: `GET https://<backend-host>/health` → `{"status":"ok","service":"buypal-api"}`.

CORS: `FRONTEND_ORIGIN` accepts a comma-separated list so production and Vercel preview origins can coexist, e.g.

```
FRONTEND_ORIGIN=https://buypal.vercel.app,https://buypal-git-main-aariso0.vercel.app
```

The first entry is canonical and is used for password-reset links and PayPal return URLs. Requests from other origins get no `Access-Control-Allow-Origin` header and are blocked by the browser.

Cross-site cookie auth: because the SPA and API live on different sites, the session cookie must be `SameSite=None; Secure`. That is the production default (`COOKIE_SAMESITE` defaults to `none` when `NODE_ENV=production`). If you host the API on the same registrable site as the frontend, set `COOKIE_SAMESITE=lax`.

### Recommended alternative: proxy `/api` through Vercel (first-party cookies)

Browsers are phasing out third-party cookies, so a `SameSite=None` session cookie between `*.vercel.app` and a different host can be dropped for some users (login appears to succeed, then every request is 401). To avoid that, make the API same-origin from the browser's point of view:

1. Set `VITE_API_URL=/api/v1` in Vercel (a relative value is supported).
2. Add a rewrite in `frontend/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://<your-backend-host>/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

With this setup traffic reaches the backend through Vercel's proxy: requests are first-party, cookies are `Lax`-compatible, and CORS is not exercised (keep `FRONTEND_ORIGIN` set anyway so direct API calls still work). Keep the generic SPA rewrite last. This is the setup to prefer for production; the direct cross-site option stays documented above because it needs no extra configuration.

## Environment variables

Frontend (build-time, public):

| Variable | Component | Required | Description |
|---|---|---|---|
| `VITE_API_URL` | frontend | Yes | Backend base URL including `/api/v1`, e.g. `https://buypal-api.onrender.com/api/v1`. Build fails without it. |

Backend:

| Variable | Component | Required | Description |
|---|---|---|---|
| `NODE_ENV` | backend | Yes in production | `production` enables secure cookies, `SameSite=None` default, `trust proxy`, and disables Mongoose autoIndex. |
| `MONGODB_URI` | backend | Yes | `mongodb://` or `mongodb+srv://` URI. Must support transactions. Startup fails if missing/invalid. |
| `FRONTEND_ORIGIN` | backend | Yes | Allowed CORS origin(s), comma separated, no trailing slash. First entry is canonical. |
| `PORT` | backend | No | Defaults to `4000`; injected by most hosts. |
| `COOKIE_SAMESITE` | backend | No | `lax` \| `strict` \| `none`. Defaults to `none` in production, `lax` otherwise. `none` requires HTTPS. |
| `COOKIE_NAME` | backend | No | Session cookie name, default `buypal_session`. |
| `SESSION_TTL_DAYS` | backend | No | Session lifetime, default `7` (clamped 1–30). |
| `WALLET_ADMIN_KEY` | backend | No | Enables `POST /api/v1/wallet/admin/credit` demo funding. Long random secret; empty disables it. |
| `SMTP_HOST` | backend | No | Defaults to `smtp.gmail.com`; password-reset email is disabled unless SMTP user/password/from are set. |
| `SMTP_PORT` | backend | No | Default `465`. |
| `SMTP_SECURE` | backend | No | Default `true`. |
| `SMTP_USER` | backend | No | Gmail address. |
| `SMTP_APP_PASSWORD` | backend | No | Google App Password (never the account password). |
| `MAIL_FROM` | backend | No | From address for reset emails. |
| `PAYPAL_MODE` | backend | No | `sandbox` (default) or `production`. Startup rejects any other value. |
| `PAYPAL_BASE_URL` | backend | No | Derived from mode. Startup enforces that sandbox mode uses `https://api-m.sandbox.paypal.com` and production uses `https://api-m.paypal.com`. |
| `PAYPAL_CLIENT_ID` | backend | For payments | Sandbox/live REST app client ID. Also served to the browser via the authenticated `/api/v1/wallet/paypal-config` endpoint (it is public by design). |
| `PAYPAL_CLIENT_SECRET` | backend | For payments | **Server-only.** Never expose to the frontend, never commit. |
| `PAYPAL_WEBHOOK_ID` | backend | For webhooks | Webhook ID from the PayPal developer dashboard. Webhooks return 503 until set. |
| `PAYPAL_CURRENCY` | backend | No | Must be `USD`; startup rejects anything else. |

Templates: `frontend/.env.example`, `backend/.env.example`. No real credentials are committed anywhere in the repository.

## PayPal

Verified in code:

- **Amounts are never trusted from the client.** `POST /api/v1/paypal/orders` takes only an approval ID, then derives item, amount and currency from the server-side `PurchaseApproval` and re-validates Circle membership and permissions. Capture re-checks that approval and compares it with the live PayPal order amount/currency before capturing (`backend/src/routes/paypal.routes.js`).
- Wallet top-ups take a client amount but the capture path compares it against the PayPal order and credits only a PayPal-reported USD receivable/net amount.
- **Credentials:** client ID is intentionally public (SDK checkout); the secret is used only server-side and is never sent to the browser. `settings` exposes only `{mode, configured, currency}`.
- **Environment separation:** `PAYPAL_MODE`/`PAYPAL_BASE_URL` are validated against each other at startup, so a sandbox secret cannot be pointed at the live API by accident.
- **Webhooks:** `POST /api/v1/paypal/webhooks` requires the five `paypal-*` transmission headers, verifies the signature via PayPal's `/v1/notifications/verify-webhook-signature` with `PAYPAL_WEBHOOK_ID`, stores events idempotently (`eventId` unique) and matches order amounts before applying status changes.
- Order creation is idempotent (`PayPal-Request-Id` + unique `approvalId`/`paypalOrderId`).

Sandbox setup:
1. PayPal Developer Dashboard → Apps & Credentials → Sandbox → create a REST app.
2. Use a Sandbox **Personal** account as buyer; a **US Business** account to test the USD merchant-receivable top-up path.
3. Set `PAYPAL_MODE=sandbox`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`.
4. Add a webhook pointing at `https://<backend-host>/api/v1/paypal/webhooks` for `PAYMENT.CAPTURE.*` and set `PAYPAL_WEBHOOK_ID`.

Production activation checklist (none of this is done automatically):
1. Complete PayPal onboarding/eligibility and fraud/risk review for your country and account type.
2. Create live REST credentials and set `PAYPAL_MODE=production` with the live client ID/secret in the host's secret store only.
3. Register the production webhook URL and set `PAYPAL_WEBHOOK_ID`.
4. Legal/compliance review of the demo-wallet wording (balances are demo-only, non-redeemable) before enabling real money.
5. Confirm TLS everywhere, `COOKIE_SAMESITE` matches the deployment topology, and logs contain no tokens or PII.
6. Rotate any credential that was ever pasted into a chat, issue or commit.

## AI

There is no AI implementation in this repository yet. `frontend/src/main.jsx` renders "not connected" notices for product discovery, and the backend README/`PACKAGE_SCOPE.txt` declare AI, LLM prompting, product search and retailer integrations explicitly out of scope for this package. Consequently:

- No AI provider, model, endpoint or API key is configured or required today.
- No model weights are bundled; nothing large is shipped through Vercel.
- Inference hosting requirements: none.

If AI is added later, keep it server-side: provider keys belong in backend environment variables only (`PAYPAL`/`SMTP`-style secret store), the endpoint must be configurable via env, and the shopping flow must keep calling the existing approval API (`POST /api/v1/approvals`) rather than triggering checkout directly.

## Verification performed

Commands run in this repository, with the results:

| Check | Command | Result |
|---|---|---|
| Clean frontend install | `cd frontend && npm install` | 85 packages, lockfile created |
| Clean backend install | `cd backend && npm install` | 143 packages, lockfile created |
| Frontend production build | `cd frontend && VITE_API_URL=https://buypal-api.example.com/api/v1 npm run build` | Passed; bundle contains the configured URL, no `localhost` strings |
| Build guard | `cd frontend && npm run build` (no `VITE_API_URL`) | Fails with a clear error, as intended |
| Backend tests | `cd backend && npm test` | 1/1 passed (`GET /health`) |
| Backend production startup | `NODE_ENV=production PORT=4100 MONGODB_URI=… node src/server.js` against MongoDB 7 replica set | Started, connected, logged listening on 4100 |
| Health endpoint | `GET /health` | `200 {"status":"ok","service":"buypal-api"}` |
| CORS preflight | `OPTIONS` from the configured origin | `204`, `Access-Control-Allow-Origin` + credentials echoed; unknown origin gets no allow header |
| Cross-site session cookie | `POST /api/v1/auth/register` as production | `Set-Cookie: … HttpOnly; Secure; SameSite=None`; follow-up `GET /auth/session` authenticated |
| Missing PayPal credentials | `POST /api/v1/wallet/sandbox-topups` | `503 {"message":"PayPal credentials are not configured."}` — secrets never leak |
| Lint | — | No linter is configured in either package, so none was run |
| GitHub Actions | — | No workflow files exist; nothing to regress |

## Remaining blockers / known gaps

1. **No GitHub Actions workflows** — CI is empty. A minimal "build frontend + run backend tests" workflow would guard deployments but was not requested here.
2. **No linter** configured for either package (no ESLint/Prettier config in the repo).
3. **Email verification is not implemented**; password-reset email requires SMTP configuration.
4. **AI shopping discovery is a placeholder** — see the AI section.
5. **Wallet transfers require a MongoDB replica set** (Atlas satisfies this).
6. **PayPal business/eligibility assumptions are unverified for real money** — sandbox behaviour is the only evidence available.
7. **`NODE_ENV=production` assumes a single trusted proxy hop** (`trust proxy` = 1), which matches Render/Railway/Fly defaults. Change it if your topology differs.
8. **PayPal redirect return URLs** (`/checkout/paypal/return`, `/checkout/paypal/cancel`) are generated by the backend Orders API but the SPA has no routes for them; the shipped UI uses the PayPal JS SDK v6 checkout instead, so this path is unused.
9. **Third-party cookie policies** can break cross-site session cookies for real users; prefer the `/api` proxy setup described above for production.
