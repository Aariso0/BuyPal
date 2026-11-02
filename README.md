# BuyPal

**Your AI-powered autonomous shopping and purchasing agent.**

BuyPal is an AI-powered shopping agent that uses live browser automation to discover products, compare prices, interact with merchant websites and prepare purchases.

Powered by a custom Rust browser automation library, BuyPal enables AI agents to interact with real websites through structured browser controls rather than relying on simulated browsing.

BuyPal also introduces delegated payment capabilities through UPI Circle, allowing authorized users and, subject to NPCI approval, eligible AI software profiles to make purchases within predefined spending limits.

With PayPal integration, delegated payment support and human-controlled authorization, BuyPal aims to make agentic commerce practical and accessible.

**License:** Apache License 2.0

---

## 1. Project Vision

Online shopping involves repetitive tasks: searching multiple websites, comparing products, checking availability, navigating checkout pages and completing payments.

BuyPal aims to automate this workflow.

Users describe what they want in natural language. The AI agent operates a real browser, discovers products, evaluates available options, prepares a purchase and requests the necessary payment authorization.

The goal is to build an AI agent capable of performing actual shopping workflows rather than merely providing product recommendations.

## 2. Core Features

### 2.1 AI-Powered Shopping

- Understand natural-language shopping requests.
- Interpret budgets, preferences and product requirements.
- Ask questions when requirements are ambiguous.
- Navigate merchant websites independently.
- Search and inspect real product pages.
- Identify product variants and availability.

Example:

> Find me a wireless mechanical keyboard under ₹5,000. Prioritize build quality, battery life and hot-swappable switches.

### 2.2 Native Rust Browser Automation

BuyPal will include a dedicated Rust library named `buypal-browser`.

The library will follow the browser interaction approach used by agent-oriented browser automation tools such as Vercel Agent Browser.

Instead of depending primarily on screen coordinates, the agent will interact with structured browser elements using references generated from accessibility information.

Capabilities:

- Chromium lifecycle management.
- Chrome DevTools Protocol (CDP) communication.
- Browser navigation.
- Accessibility tree extraction.
- Structured page snapshots.
- Interactive element references.
- Clicking buttons and links.
- Filling text fields.
- Selecting dropdown options.
- Reading page content.
- Screenshots.
- Browser session management.

Example browser snapshot:

```text
- heading "Wireless Keyboards" [ref=e1]
- textbox "Search products" [ref=e2]
- button "Search" [ref=e3]
- link "Mechanical Keyboard Pro" [ref=e4]
- text "₹4,499" [ref=e5]
- button "Add to Cart" [ref=e6]
```

The AI can interact with the page:

```text
click @e4
```

The Rust browser library resolves the reference and executes the action through CDP.

References must be refreshed when navigation or page changes invalidate existing elements.

### 2.3 Intelligent Product Research

- Discover products across supported merchant websites.
- Extract product names, prices and specifications.
- Compare different merchants.
- Evaluate products against user requirements.
- Rank available options.
- Explain recommendations and trade-offs.

### 2.4 Shopping Cart and Checkout

- Select products and variants.
- Prepare shopping carts.
- Inspect shipping information.
- Calculate purchase totals.
- Verify the final order.
- Prepare checkout for payment.

### 2.5 PayPal Integration

PayPal provides the primary payment integration for the hackathon.

- PayPal Orders API.
- PayPal Sandbox.
- Order creation.
- Checkout approval.
- Payment capture after authorization.
- Transaction verification.
- Purchase history.
- Payment receipts.

### 2.6 Delegated Payments — UPI Circle

BuyPal will support a delegated payment model inspired by NPCI's UPI Circle.

This feature enables one person to authorize another person to make eligible payments from their bank account within predefined permissions and spending limits.

For example:

A person can authorize their spouse to use their UPI account for household purchases, with a monthly allowance of ₹10,000.

The secondary user can make eligible purchases using the delegated payment facility without requiring the primary user to approve every payment under full delegation.

The primary user retains control over the authorization.

#### User Roles

**Primary User**

The owner of the bank account who grants payment authorization.

Responsibilities:
- Invite trusted secondary users.
- Grant payment permissions.
- Set spending allowances.
- Monitor delegated transactions.
- Modify or revoke authorization through the supported UPI app.

**Secondary User**

The person authorized to make payments using the primary user's account.

Responsibilities:
- View available delegated payment permissions.
- Initiate eligible payments.
- Stay within the authorized spending allowance.
- View payment history and available spending information.

#### Delegation Modes

**Full Delegation**

The primary user authorizes a secondary user to make eligible payments within a predefined spending limit.

- Monthly spending allowance.
- No primary-user approval for every transaction.
- Transaction history and monitoring.
- Authorization expiry and revocation.

**Partial Delegation**

The secondary user initiates a payment request, and the primary user must approve each payment through the supported UPI application.

- Individual payment approval.
- Transaction amount visibility.
- Payment request tracking.
- Primary-user authorization before payment completion.

#### BuyPal AI Software Delegation

An important extension of this feature is the possibility of registering BuyPal itself as a delegated software profile.

NPCI's circular NPCI/UPI/OC-201B/2025-26, dated October 8, 2025, extends UPI Circle to eligible IoT devices and software profiles, including AI profiles initially within a limited closed user group.

This creates a potential pathway for an AI shopping agent to operate with explicitly delegated payment authority.

For eligible software profiles, the circular specifies:

- Full Delegation framework.
- Maximum monthly limit of ₹15,000 per delegation.
- Maximum transaction amount of ₹5,000.
- A 24-hour cooling period with a cumulative transaction limit of ₹5,000.
- Automatic revocation after six months of inactivity or certain security concerns.
- Domestic person-to-merchant transactions only.
- Explicit user action to initiate debits.
- Registration through a participating secondary PSP, including due diligence and application security evaluation.
- Only NPCI-permitted software profiles; the circular specifies paid software profiles and initially limited-user availability.

These are regulatory limits for this particular software-profile framework, not universally available limits for every UPI Circle user. Participating PSPs and banks may impose additional restrictions.

BuyPal will not assume that any ordinary application automatically qualifies for this integration.

#### Delegated Payment Architecture

BuyPal will maintain a payment permission layer that separates AI decisions from actual payment authorization.

```text
          PRIMARY USER
                |
        Grants Authorization
                |
                v
        UPI CIRCLE / PSP
                |
        Delegation Record
                |
                v
         BUYPal AGENT
                |
        Shopping Request
                |
                v
       Purchase Preparation
                |
                v
       Permission Validation
                |
                v
        Explicit User Action
                |
                v
       Authorized UPI Flow
                |
                v
        Merchant Payment
```

BuyPal must verify that:

- Delegation is active.
- The software or secondary user is authorized.
- The transaction is eligible.
- The transaction is within the available allowance.
- The authorization has not expired or been revoked.
- All provider-specific conditions are satisfied.

The UPI participant remains authoritative for the actual mandate and payment status.

#### Integration Strategy

UPI Circle is a feature of the UPI ecosystem, not a PayPal API.

The implementation will therefore use a separate UPI integration layer.

**Hackathon MVP:**
- Implement a delegated-payment permission manager.
- Support primary and secondary user profiles.
- Implement full and partial delegation workflows for the human-user simulation.
- Implement spending limits, expiry and revocation.
- Build a clearly labelled simulated UPI Circle connector.
- Demonstrate the authorization and purchasing workflow without moving real UPI funds.

**Future production integration:**
- Work with an eligible UPI Circle participant or certified secondary PSP.
- Complete software-profile onboarding and security evaluation.
- Register BuyPal only if it satisfies NPCI eligibility requirements.
- Obtain actual delegation and payment capabilities through the approved integration.
- Keep UPI authentication and payment initiation within the authorized UPI application or approved integration.

BuyPal will never collect, store or automate the entry of UPI PINs or OTPs.

### 2.7 Human-Controlled Payments

Financial authorization must remain separate from AI reasoning.

Before a payment is initiated, BuyPal must:

1. Display the selected product.
2. Display the merchant.
3. Show the purchase amount.
4. Display available taxes and shipping costs.
5. Identify the selected payment method.
6. Validate applicable spending permissions.
7. Obtain the required user action or primary-user approval.
8. Execute the transaction through the authorized payment provider.
9. Verify the resulting payment status.

An AI model must never bypass payment permission checks.

### 2.8 Purchase History

- Track completed purchases.
- Store order details.
- Display transaction status.
- Track delegated spending.
- Display remaining allowance when confirmed by the payment provider.
- Generate purchase summaries and receipts.

---

## 3. System Architecture

BuyPal will use a modular architecture with independent browser automation, AI orchestration, shopping and payment components.

```text
                    BUYPal
                       |
                React Frontend
                       |
                 Rust Backend
                       |
                AI Orchestrator
                       |
          +------------+------------+
          |            |            |
       Browser      Shopping     Payment
       Service      Engine       Manager
          |            |            |
          v            v            v
     buypal-browser  Product     Permission
          |          Analysis     Manager
          |                         |
          v                         v
     Chromium/CDP              Payment Router
          |                    /           \
          v                   /             \
     Merchant Sites        PayPal         UPI Circle
                           Sandbox        PSP Adapter
```

### Frontend

React and TypeScript.

Responsibilities:
- Shopping conversation interface.
- Browser activity display.
- Product comparison.
- Shopping cart.
- Payment approval interface.
- Delegation management interface.
- Transaction history.

### Backend

Rust application server using Axum and Tokio.

Responsibilities:
- AI orchestration.
- Browser session coordination.
- Product extraction and comparison.
- Shopping workflow management.
- Permission enforcement.
- Payment integration.
- Transaction records.

### Browser Library

`buypal-browser` will be an independently reusable Rust crate.

Responsibilities:
- CDP connectivity.
- Chromium lifecycle.
- Page navigation.
- Accessibility snapshots.
- Element references.
- Browser actions.
- Screenshots.
- Session management.

### Payment Services

Independent payment connectors:

- `paypal`: PayPal REST API integration.
- `upi-circle`: Authorized UPI integration or development simulator.
- `payment-policy`: Spending rules, eligibility and authorization checks.

The payment router must not silently change the payment method or fall back to another funding source without user consent.

---

## 4. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend | Rust |
| Browser library | Custom Rust crate |
| Browser protocol | Chrome DevTools Protocol |
| Async runtime | Tokio |
| Backend framework | Axum |
| Serialization | Serde |
| AI integration | LLM tool calling |
| Payment integration | PayPal REST API |
| UPI integration | Authorized UPI Circle PSP |
| Database | SQLite initially |
| Browser engine | Chromium |

---

## 5. Repository Structure

```text
buypal/
|
├── apps/
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── features/
│       │   │   ├── shopping/
│       │   │   ├── browser/
│       │   │   ├── comparison/
│       │   │   ├── checkout/
│       │   │   ├── delegation/
│       │   │   └── history/
│       │   └── App.tsx
│       └── package.json
|
├── crates/
│   ├── buypal-browser/
│   │   └── src/
│   │       ├── browser.rs
│   │       ├── session.rs
│   │       ├── cdp.rs
│   │       ├── snapshot.rs
│   │       ├── elements.rs
│   │       ├── actions.rs
│   │       └── lib.rs
│   │
│   └── buypal-server/
│       └── src/
│           ├── api/
│           ├── agents/
│           ├── services/
│           │   ├── browser.rs
│           │   ├── products.rs
│           │   ├── paypal.rs
│           │   └── upi_circle.rs
│           ├── payments/
│           │   ├── router.rs
│           │   ├── policy.rs
│           │   └── authorization.rs
│           ├── database/
│           └── main.rs
|
├── docs/
├── Cargo.toml
├── README.md
├── LICENSE
├── .env.example
└── .gitignore
```

---

## 6. Security Principles

- Never capture or store raw payment card details.
- Never request or store UPI PINs or payment OTPs.
- Keep PayPal credentials exclusively on the backend.
- Require server-side payment amount verification.
- Validate payment authorization before execution.
- Prevent duplicate transaction captures.
- Enforce delegation expiry and spending limits.
- Never exceed the limits returned by the authorized PSP.
- Do not automate or bypass banking security screens.
- Require explicit user action for software-profile UPI debit initiation.
- Keep browser sessions isolated.
- Maintain auditable payment and delegation records.
- Immediately disable access when a delegation is revoked.

---

## 7. Development Roadmap

### Phase 1 — Browser Foundation
- Establish the Rust workspace.
- Build `buypal-browser`.
- Connect Chromium through CDP.
- Implement navigation and browser sessions.
- Generate accessibility snapshots.
- Implement element references.
- Implement click and form interactions.

### Phase 2 — AI Shopping Agent
- Integrate the AI model.
- Implement browser tool calling.
- Interpret shopping requests.
- Search merchant websites.
- Extract product information.
- Compare and rank products.

### Phase 3 — Shopping Workflow
- Shopping cart management.
- Product selection.
- Budget restrictions.
- Checkout preparation.
- Browser activity interface.

### Phase 4 — PayPal Integration
- Configure PayPal Sandbox.
- Implement order creation.
- Implement checkout approval.
- Implement payment capture.
- Verify transactions.

### Phase 5 — Delegated Payment System
- Build primary and secondary user profiles.
- Implement full and partial delegation simulations.
- Add monthly spending limits.
- Implement expiry and revocation.
- Build a delegated transaction history.
- Implement the UPI Circle development simulator.
- Document the requirements for an authorized PSP integration.

### Phase 6 — Finalization
- Improve browser reliability.
- Add error handling.
- Improve security.
- Deploy the application.
- Prepare documentation.
- Record the demonstration.

---

## 8. MVP Goals

The first release must demonstrate a complete working shopping workflow:

1. User describes a shopping requirement.
2. BuyPal opens a real browser session.
3. The browser navigates to a merchant.
4. The AI searches for suitable products.
5. BuyPal extracts and compares product information.
6. The user selects a product.
7. BuyPal prepares the shopping cart.
8. The user reviews the purchase.
9. The payment is authorized through PayPal Sandbox.
10. BuyPal verifies and records the transaction.

A second demonstration will showcase delegated payments:

1. A primary user creates a delegated spending permission in the demo.
2. The primary user assigns a secondary user or eligible software-profile simulation.
3. A monthly spending allowance is configured.
4. The secondary user initiates a purchase.
5. BuyPal checks the delegation rules.
6. The purchase is either permitted or sent for approval.
7. The transaction is recorded against the delegation.

The prototype will clearly distinguish simulated UPI Circle functionality from real UPI transactions.

---

## 9. Future Vision

BuyPal aims to become a merchant-independent AI purchasing agent with reusable browser automation and extensible payment integrations.

The long-term vision includes:

- More supported merchants.
- Multiple payment providers.
- Authorized delegated payment profiles.
- Household and business spending permissions.
- Advanced product research.
- Transparent AI decision-making.
- Secure agentic commerce.

BuyPal is designed around a simple principle:

**AI should be able to do the work of shopping, while users retain control over their money.**

---

## 10. License

BuyPal is licensed under the **Apache License, Version 2.0**.

The project is open source and permits commercial and private use, modification, distribution and sublicensing subject to the license terms.

See the [LICENSE](LICENSE) file for the full license text.

For details, visit https://www.apache.org/licenses/LICENSE-2.0.

---

## References

- [NPCI UPI Circle – Delegated Payments](https://www.npci.org.in/product/upi-circle)
- [NPCI Circular: Introduction of IoT Devices and Software on UPI Circle, October 8, 2025](https://www.npci.org.in/uploads/UPI_OC_No_201_B_FY_2025_26_Addendum_to_NPCI_UPI_2024_25_OC_201_Introduction_of_Io_T_devices_software_on_UPI_Circle_09ec83c893.pdf)
- [Google Pay – UPI Circle Documentation](https://support.google.com/pay/india/answer/15128460)
- [PayPal Orders API](https://developer.paypal.com/docs/api/orders/v2/)
- [Vercel Agent Browser](https://github.com/vercel-labs/agent-browser)

---

**BuyPal — Shop smarter. Let your AI do the research.**
