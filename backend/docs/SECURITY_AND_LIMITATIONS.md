# Security notes and known limitations

- Passwords are Argon2id hashes. Session tokens are random opaque values; only SHA-256 hashes are stored.
- Session cookies are HttpOnly, SameSite=Lax and Secure in production.
- Authentication checks expiry directly; MongoDB TTL cleanup is asynchronous.
- Configure an exact frontend origin and HTTPS in production.
- Approval spending totals use MongoDB transactions. Use Atlas or a replica set, not standalone MongoDB.
- PayPal uses server-side OAuth credentials. Never expose the Client Secret in frontend code.
- Checkout is standard PayPal buyer-approved Checkout, not delegated funding from a primary user's PayPal account.
- Do not treat Circle limits as funds or wallet balances.
- No payment should be captured without a current approved request and active Circle permissions.
- Capture network failures are marked for reconciliation; do not blindly retry.
- Webhook signature verification is implemented, but operational retry/reconciliation and production observability remain required.
- Email verification, password reset, email invitations, CSRF hardening, monitoring, rate-limit tuning and security review remain outstanding.
- This code is a prototype foundation and requires review before handling real money.
