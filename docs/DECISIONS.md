# BuyPal Decision Log

Record important decisions here using the format: date, decision, context, alternatives, consequences, owner.

## 2026-11-03 — Initial collaboration and product guardrails

- Repository: `Shivashish-IT/BuyPal`.
- Default branch: `main`.
- Initial frontend direction: React.
- Initial backend direction: Node.js.
- Product concept: shared/delegated spending experience plus AI product discovery.
- Checkout modes: approval-required by default; bounded autonomous checkout only after explicit opt-in and server-side policy checks.
- Important constraint: validate all PayPal capabilities against official APIs and sandbox; do not assume UPI Circle-like delegation or secondary-user receiving is available.

## 2026-11-03 — Root repository ownership changed

- **Decision:** Root repository changed from `Shivashish-IT/BuyPal` to `Aariso0/BuyPal`.
- **Context:** The repository was moved under Aariso0 because I will be responsible for reviewing all pull requests, maintaining the codebase, overseeing code quality, and managing the project's ongoing development.
- **Consequences:** `Aariso0/BuyPal` is now the canonical repository. All contributors should submit PRs there. I will oversee PR reviews, approve changes, maintain the main branch, and manage repository-level development.
