# BuyPal Core Backend

Node.js 20+ / Express / MongoDB backend for BuyPal's non-AI functionality.

## Included
- Account registration, login, logout and session lookup.
- Argon2id password hashing and opaque HttpOnly session cookies.
- MongoDB persistence for users, sessions, Circles, purchase approvals and PayPal orders.
- Circle creation, invitations, acceptance, permissions and revocation.
- Server-side spending-policy checks and purchase approval workflow.
- PayPal JavaScript SDK v6 for browser checkout and the official `@paypal/paypal-server-sdk` v2.5.0 for backend Orders API create, retrieve and capture. Webhook signature verification uses PayPal REST because the current Server SDK does not expose the Notifications verification endpoint.
- PayPal webhook signature verification and event reconciliation.
- Security middleware, CORS restrictions, JSON size limits and rate limits.
- API and setup documentation.

## Explicitly outside this package
AI/LLM prompts, product search, retailer integrations, product comparison and shopping-agent orchestration are intentionally excluded. Another contributor owns that system. Later it should call the documented BuyPal approval API; it must never bypass backend permission checks.

## Requirements
- Node.js 20 or newer
- MongoDB Atlas or a MongoDB replica set (purchase approval uses transactions)
- PayPal Developer Sandbox REST app

## Setup
1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your Atlas connection string.
3. Set `FRONTEND_ORIGIN` to the exact frontend origin.
4. Add PayPal Sandbox Client ID and Secret, set `PAYPAL_MODE=sandbox`, and keep `PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com`. The frontend obtains the public Client ID from the authenticated backend config endpoint; the secret remains server-side.
5. From this directory run `npm install`.
6. Run `npm test`.
7. Run `npm run dev`.

The API listens on port 4000 by default. Health check: `GET /health`.

Frontend requests must send cookies (`credentials: 'include'`) and use the configured origin.

## Important limitations
This is a development backend, not a production-ready financial service. PayPal integration is standard buyer-approved Checkout. It is not a delegated payment from the Circle primary user's PayPal account, a shared PayPal balance, a stored-value wallet, or a peer-to-peer money transfer. No funds are held by BuyPal.

Email verification, password reset, email invitation delivery, production deployment hardening, operational webhook retry/reconciliation, audit ledger and CSRF strategy still need implementation/review before production use. Sandbox testing does not prove regional availability of a proposed PayPal Circle/delegated-payment flow.

## BuyPal USD Demo Balance (no real funds)

The wallet is a **USD-denominated demo ledger**, not a bank account, PayPal balance, stored-value product, or redeemable wallet. PayPal Sandbox top-ups are credited only when the verified capture response supplies a positive USD merchant-receivable/net amount. Existing non-zero INR or legacy-credit wallets are retained and cannot be silently relabelled or mixed with USD balances. Users can transfer demo balance to another registered BuyPal account. Each transfer runs in a MongoDB transaction and writes one immutable transaction record with sender and receiver IDs. Transfers require MongoDB transaction support (Atlas or a replica set).

### Admin-funded demo balance

Set a long random `WALLET_ADMIN_KEY` in the backend `.env` only. Never put it in Vite/frontend variables or commit it. An administrator can grant demo balance using:

```bash
curl -X POST http://localhost:4000/api/v1/wallet/admin/credit \
  -H 'Content-Type: application/json' \
  -H 'x-wallet-admin-key: YOUR_ADMIN_SECRET' \
  -d '{"email":"student@example.com","amount":500,"note":"Hackathon demo funding"}'
```

### User wallet endpoints

- `GET /api/v1/wallet` — create/read the signed-in user's wallet.
- `GET /api/v1/wallet/transactions` — latest 100 sent/received/funding entries.
- `POST /api/v1/wallet/send` — transfer balance by recipient email; supports `Idempotency-Key`.
- `POST /api/v1/wallet/sandbox-topups` — create a PayPal Sandbox checkout for the entered sandbox currency amount.
- `POST /api/v1/wallet/sandbox-topups/:orderId/capture` — capture an approved order, persist PayPal's settlement breakdown, and credit only a PayPal-reported USD amount. If no USD amount is returned, the top-up becomes `CAPTURED_UNCREDITED`.

For PayPal Sandbox top-ups, BuyPal does not assume the order gross amount equals the seller proceeds. It reads `seller_receivable_breakdown.receivable_amount` (or `net_amount` only if that amount is USD) from the verified PayPal capture response and credits that exact USD amount. PayPal's `exchange_rate`, gross, fee, net and receivable amounts are stored with the top-up for reconciliation. If PayPal does not return an USD amount, the capture is saved as `CAPTURED_UNCREDITED` and no wallet balance is added. A US Business Sandbox account can test the USD merchant flow; it does not establish live account eligibility or production withdrawal rights. The payment uses mock Sandbox funds and is not withdrawable or redeemable. Configure `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE=sandbox`, and `PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com`. Use a Sandbox Personal account as buyer. Do not use live credentials for this demo.

### Settings endpoints

- `GET /api/v1/settings` — profile, preferences and server-side PayPal configuration status.
- `PATCH /api/v1/settings/profile` — update display name.
- `PATCH /api/v1/settings/preferences` — save notification, shopping, appearance, language and timezone preferences.
- `POST /api/v1/settings/password` — change password after verifying the current password.
- `GET /api/v1/settings/sessions` and `DELETE /api/v1/settings/sessions/:id` — list/revoke other sessions.

The Settings UI intentionally does not expose or store PayPal secrets in the browser. Email verification, password reset, real email delivery, full Hindi localization, and full dark-theme styling are not implemented in this iteration. Purchase approvals and PayPal checkout are USD-only. The existing purchase approval and PayPal checkout endpoints remain separate from internal balance transfers.


### Gmail SMTP password reset
Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER`, `SMTP_APP_PASSWORD`, and `MAIL_FROM` in `.env`. Generate a Google App Password with 2-Step Verification enabled. Do not use your regular Gmail password or commit `.env`. Reset tokens expire after 30 minutes, are single-use, and are stored only as SHA-256 hashes.
