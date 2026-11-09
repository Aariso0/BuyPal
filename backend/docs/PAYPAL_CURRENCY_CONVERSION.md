# BuyPal USD wallet and PayPal settlement

## Wallet denomination

- New BuyPal demo wallets are denominated in USD.
- The customer-facing interface calls the amount **Balance** and formats it as USD.
- Demo balances are not PayPal account balances, stored value, cash, or redeemable funds. Withdrawals are unavailable.
- Existing non-zero INR or legacy-credit wallets are not silently relabelled as USD. They remain marked as legacy until deliberately reconciled or reset. A zero-value legacy INR wallet can be switched to USD safely.

## PayPal top-up rule

1. BuyPal creates orders in USD only (`PAYPAL_CURRENCY=USD`).
2. The buyer approves and PayPal captures the order.
3. BuyPal stores the capture's gross, fee, net, receivable, and exchange-rate details.
4. BuyPal credits only the verified USD `seller_receivable_breakdown.receivable_amount`, or USD `net_amount` if receivable amount is absent.
5. If PayPal does not return a positive USD receivable/net amount, the capture is stored as `CAPTURED_UNCREDITED`; no guessed, gross, or 1:1 amount is credited.

This is a USD-only demo ledger. A US Business Sandbox account can be used to test the USD merchant flow, but Sandbox results do not establish live account eligibility or production withdrawal rights.
