# BuyPal

BuyPal is a collaborative prototype exploring a PayPal-linked shared spending experience inspired by UPI Circle, together with an AI shopping assistant.

## Product vision
- Explore delegated spending for secondary users, subject to official PayPal API capabilities, eligibility, and applicable policy.
- Let a primary account holder configure permissions, limits, expiry, and revocation.
- Let an AI assistant discover and compare products.
- Keep product discovery separate from checkout.
- Support approval-required checkout by default and bounded autonomous checkout only after explicit opt-in and server-side policy checks.

> **Prototype notice:** Do not assume PayPal currently supports every proposed delegated-user, secondary-user, or receiving-money flow. Validate each capability against official PayPal APIs, sandbox behavior, regional availability, and compliance requirements.

## Repository layout
- `frontend/` — React client (Vite)
- `backend/` — Node.js application API
- `docs/` — architecture, decisions and [deployment guide](docs/DEPLOYMENT.md)

## Start here
- [Project specification](PROJECT_SPECIFICATION.md)
- [Contributor workflow](CONTRIBUTING.md)
- [Architecture decision log](docs/DECISIONS.md)
- [Deployment guide](docs/DEPLOYMENT.md)

## Run locally
```bash
# Backend (terminal 1)
cd backend
cp .env.example .env      # set MONGODB_URI, FRONTEND_ORIGIN and PayPal Sandbox credentials
npm install
npm run dev               # http://localhost:4000, health check at /health

# Frontend (terminal 2)
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:4000/api/v1
npm install
npm run dev               # http://localhost:5173
```

## Team workflow
Work on your assigned feature branch, open a pull request against `main`, and request review. Do not push directly to `main`.

## Security baseline
- Never store PayPal passwords or raw card/bank credentials.
- Use official OAuth, consent, checkout, and webhook flows.
- Enforce permissions and spending limits on the server.
- Require explicit approval unless a bounded autonomous policy was deliberately enabled.
- Maintain audit events and provide pause/revoke controls.
- Use sandbox/test accounts during development.
