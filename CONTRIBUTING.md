# Contributing to BuyPal

## Team shape

Four contributors total:

1. **Project lead / integration (Aariso0):** Architecture, product decisions, PR reviews, release coordination, and final integration.
2. **Frontend contributor:** React UI, onboarding, delegated-user screens, shopping, and approval experience.
3. **Backend / PayPal contributor:** Node.js APIs, data model, identity, authorization, notifications, and PayPal API feasibility/payment adapter.
4. **AI agent contributor:** Product discovery, comparison, structured purchase-intent orchestration, and safety testing.

## Repository structure

- **Upstream repository:** `Aariso0/BuyPal` (canonical repository).
- **Default branch:** `main`.
- **Contribution method:** Fork + Pull Request.
- Contributors work from their own GitHub forks. Direct collaborator access is not required.

## Assigned branches

Each contributor should create their own fork of `Aariso0/BuyPal` and maintain the following branches in their fork:

- Project lead: `main` (integration and release management; do not develop directly on main).
- Frontend: `feature/frontend`
- Backend / PayPal: `feature/backend-payments`
- AI agent: `feature/ai-agent`

For additional work use `docs/<short-topic>`, `fix/<short-topic>`, or `feature/<short-topic>`.

Branch names are conventions, not shared branches in the upstream repository.

## Workflow

1. Fork `Aariso0/BuyPal` into your own GitHub account.
2. Clone your fork locally.
3. Add the original repository as the `upstream` remote.
4. Fetch the latest upstream changes.
5. Create or switch to your assigned feature branch.
6. Make focused changes and run tests.
7. Commit with a clear message (e.g. `feat: add delegated-user invitation screen`).
8. Push your feature branch to your own fork.
9. Open a Pull Request targeting `Aariso0/BuyPal:main`.
10. Link related issues and describe tests, risks, and screenshots where relevant.
11. Request review from the project lead or relevant owner.
12. Address requested changes and update your PR.
13. The project lead reviews and merges the PR after approval and required checks pass.

## Git remote setup

After cloning your fork, configure the original repository as upstream:

```bash
git remote add upstream https://github.com/Aariso0/BuyPal.git
```

Your remotes should look like:

- `origin` → your personal fork.
- `upstream` → `Aariso0/BuyPal`.

To synchronize your local main branch:

```bash
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

Create a feature branch:

```bash
git switch -c feature/your-feature
```

Push it to your fork:

```bash
git push -u origin feature/your-feature
```

## Rules

- Do not push directly to the upstream `main`.
- Do not attempt to bypass the PR review process.
- Only the project lead or explicitly authorized maintainers merge PRs.
- Do not commit `.env`, API keys, OAuth tokens, private keys, or customer data.
- Add new configuration keys to `.env.example` with dummy values only.
- Keep payment authorization on the server.
- AI product discovery must not trigger a payment.
- Every checkout action must be checked against server-side user consent and policy.
- Ask before changing shared API contracts or database schemas.
- Keep PRs small and update docs/tests with behavior changes.
- Keep your fork synchronized with the upstream repository before starting significant new work.

## Pull Request requirements

Every PR should include:

- A clear description of the change.
- Related issue number, if applicable.
- Testing performed and results.
- Screenshots for UI changes.
- Security or payment-related implications, if applicable.
- Any API, database, or configuration changes.

PRs may be rejected or sent back for changes if they introduce breaking behavior, bypass authorization checks, or do not meet project standards.

## Local setup

```bash
# Backend
cd backend
cp .env.example .env    # fill in MONGODB_URI, FRONTEND_ORIGIN, PayPal Sandbox credentials
npm install
npm test
npm run dev             # API on http://localhost:4000

# Frontend
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:4000/api/v1
npm install
npm run dev             # app on http://localhost:5173
npm run build           # production build; requires VITE_API_URL
```

Deployment targets, exact Vercel settings and environment variables are documented in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Maintainer authority

The project lead (Aariso0) is responsible for:

- Reviewing all incoming PRs.
- Approving or requesting changes.
- Maintaining the canonical repository.
- Protecting the integrity of the `main` branch.
- Coordinating releases and project-wide changes.

All contributions must be merged through the upstream repository's PR process.
