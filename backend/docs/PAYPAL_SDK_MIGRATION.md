# BuyPal PayPal SDK integration

## SDKs used

- Backend: official `@paypal/paypal-server-sdk` for Orders API v2 create, retrieve, and capture operations.
- Frontend: PayPal JavaScript SDK v6, loaded from PayPal Sandbox or Production according to `PAYPAL_MODE`.
- Webhook signature verification remains a direct REST call because the current Server SDK package does not include the Notifications / webhook verification API.

## Environment

Set `PAYPAL_MODE=sandbox`, `PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_CURRENCY=USD`, and `PAYPAL_WEBHOOK_ID`. For live use, explicitly set production mode and production credentials. Never use Sandbox credentials in production.

## Checkout and wallet credit

1. Frontend loads PayPal JavaScript SDK v6 and checks eligibility for USD.
2. The authenticated wallet endpoint creates a USD PayPal order through the Server SDK.
3. The buyer approves the PayPal checkout.
4. The backend retrieves and captures the order using the Server SDK.
5. BuyPal credits the demo balance only when the verified capture explicitly reports a positive USD seller-receivable or net amount. Otherwise the capture is retained as `CAPTURED_UNCREDITED` for reconciliation.

The SDK does not grant account eligibility or convert a Sandbox account into a production merchant account. Demo wallet balances have no cash value and cannot be withdrawn or redeemed.
