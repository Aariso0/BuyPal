# BuyPal Core API

Base path: `/api/v1`. Except registration/login and the PayPal webhook, endpoints require the `buypal_session` HttpOnly cookie.

## Authentication
- `POST /auth/register` — `{ "name": "Example User", "email": "user@example.com", "password": "at-least-8-chars" }`
- `POST /auth/login` — `{ "email": "...", "password": "..." }`
- `POST /auth/logout`
- `GET /auth/session`

## Circles
- `POST /circles` — `{ "name": "Family Circle" }`
- `GET /circles`
- `POST /circles/:circleId/invitations` — `{ "email": "...", "permissions": { "canShop": true, "canPay": true, "canReceive": false, "autoApprove": false, "perTransactionLimit": 1000, "dailyLimit": 3000, "currency": "USD" } }`
- `GET /circles/invitations/pending`
- `POST /circles/:circleId/invitations/:memberId/accept`
- `PATCH /circles/:circleId/members/:memberId/permissions`
- `DELETE /circles/:circleId/members/:memberId`

## Purchase approvals
- `POST /approvals` — `{ "circleId": "<id>", "itemName": "Headphones", "amount": "49.99", "currency": "USD" }`
- `GET /approvals/pending` — primary user's pending requests
- `POST /approvals/:approvalId/decision` — `{ "decision": "approve" }` or `{ "decision": "reject", "note": "Outside budget" }`
- `GET /approvals/mine` — secondary user's requests

Pending and approved requests count against the daily spending limit. Auto-approval only applies when explicitly enabled in the member's policy.

## PayPal Checkout
- `POST /paypal/orders` — `{ "approvalId": "<approved-purchase-approval-id>" }`
- `POST /paypal/orders/:orderId/capture`
- `POST /paypal/webhooks` — PayPal server-to-server endpoint; requires a configured webhook ID and verifies PayPal's signature.

Checkout always derives item, amount and currency from the approved server-side purchase request. It revalidates Circle membership and permissions before capture.
