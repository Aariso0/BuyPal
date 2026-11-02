# BuyPal

### Your AI-powered autonomous shopping agent.

BuyPal is an AI-powered shopping agent that uses live browser automation to discover products, compare prices, navigate merchant websites and prepare purchases.

Built around a native Rust browser-control library and integrated with PayPal, BuyPal aims to make online shopping an autonomous, transparent and user-controlled experience.

## 1. Vision

Online shopping involves repetitive tasks: searching multiple websites, comparing specifications, checking prices, navigating checkout pages and reviewing orders.

BuyPal aims to automate this workflow.

Users describe what they want in natural language. The AI agent operates a real browser, interacts with merchant websites, evaluates available products and prepares the best purchase option.

The user remains in control of the final transaction.

**The goal: An AI agent that can actually shop, not just recommend products.**

## 2. Core Features

### AI-Powered Shopping

- Understand natural-language shopping requests.
- Interpret budgets, preferences and product requirements.
- Ask questions when requirements are ambiguous.
- Navigate merchant websites independently.
- Search for products and inspect product pages.

Example:

> Find me a wireless mechanical keyboard under ₹5,000. Prioritize build quality, battery life and hot-swappable switches.

### Native Rust Browser Automation

BuyPal will include a dedicated Rust library for browser control, inspired by the architecture and interaction model of Agent Browser.

The browser controller will:

- Launch and manage Chromium sessions.
- Navigate to merchant websites.
- Extract accessibility information from webpages.
- Generate compact, structured page snapshots.
- Assign unique references to interactive elements.
- Click buttons and links using element references.
- Fill forms and search fields.
- Select dropdown options and interact with controls.
- Capture screenshots.
- Maintain browser session state.

Instead of relying on coordinate-based clicking, the AI will interact with identifiable browser elements.

Example browser snapshot:

```text
- heading "Wireless Keyboards" [ref=e1]
- textbox "Search products" [ref=e2]
- button "Search" [ref=e3]
- link "Mechanical Keyboard Pro" [ref=e4]
- text "₹4,499" [ref=e5]
- button "Add to Cart" [ref=e6]
```

The AI can then request:

```text
click @e4
```

The Rust library resolves the reference and performs the corresponding browser action.

References will be refreshed after navigation or significant page changes to avoid interacting with stale elements.

### Intelligent Product Comparison

- Compare products across supported merchants.
- Extract prices, specifications and availability.
- Evaluate products against user requirements.
- Rank available options.
- Explain recommendations and trade-offs.

### Autonomous Shopping Workflow

- Navigate product pages.
- Select product variants.
- Prepare shopping carts.
- Inspect shipping and checkout information.
- Calculate purchase totals.
- Prepare orders for user review.

### PayPal Integration

PayPal will handle the payment workflow for supported checkout integrations.

- PayPal Orders API integration.
- PayPal Sandbox for development and testing.
- Order creation.
- Checkout approval.
- Payment capture after authorization.
- Payment status verification.
- Transaction records and receipts.

### Human-Controlled Purchasing

Financial authorization must remain separate from AI decision-making.

Before a payment is captured, BuyPal must:

1. Display the selected product.
2. Display the merchant.
3. Show the final purchase amount.
4. Present shipping and additional costs when available.
5. Request explicit user approval.
6. Verify the order and authorization on the backend.
7. Execute the approved payment.

The AI cannot independently authorize or capture a payment.

### Browser Visibility

The browser should remain observable throughout the shopping process.

The interface will provide:

- Browser activity and navigation status.
- Current page information.
- Screenshots or a live browser view.
- AI action history.
- Current shopping progress.
- User controls to pause or stop the agent.

The browser automation should not be a hidden process that users cannot inspect.

## 3. How BuyPal Works

```text
              USER REQUEST
                    |
                    v
             AI ORCHESTRATOR
                    |
                    v
             BROWSER CONTROLLER
                    |
                    v
            RUST BROWSER LIBRARY
                    |
                    v
             CHROME VIA CDP
                    |
                    v
            MERCHANT WEBSITES
                    |
                    v
           ACCESSIBILITY SNAPSHOT
                    |
                    v
             AI INTERPRETATION
                    |
                    v
         PRODUCT COMPARISON ENGINE
                    |
                    v
             SHOPPING CART
                    |
                    v
             PAYMENT REVIEW
                    |
                    v
             USER APPROVAL
                    |
                    v
              PAYPAL API
                    |
                    v
          PAYMENT VERIFICATION
                    |
                    v
            ORDER COMPLETED
```

## 4. System Architecture

### Frontend

React and TypeScript will provide the user-facing application.

Responsibilities:

- Shopping conversation interface.
- Browser activity panel.
- Product comparison interface.
- Shopping cart.
- Payment approval screen.
- Transaction history.

### Backend

Rust will handle the main application backend and browser integration.

Responsibilities:

- Agent orchestration.
- Browser session management.
- AI model communication.
- Purchase policy enforcement.
- Payment workflow.
- Transaction management.

### Browser Automation Library

A dedicated Rust crate named `buypal-browser`.

Responsibilities:

- Chrome DevTools Protocol communication.
- Browser lifecycle management.
- Accessibility snapshots.
- Interactive element references.
- Click and form interaction.
- Page inspection.
- Screenshots and browser state.

### AI Layer

A configurable LLM provider will power the shopping agent.

The model will receive structured browser snapshots and invoke approved tools to interact with the browser.

AI responsibilities:

- Understand shopping requests.
- Decide which browser actions to execute.
- Interpret page content.
- Compare products.
- Explain decisions.
- Prepare purchase requests.

### Payment Layer

PayPal REST APIs will provide the payment integration.

The payment service will remain independent of the AI agent and will enforce authorization and payment rules.

## 5. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend | Rust |
| Browser library | Custom Rust crate |
| Browser protocol | Chrome DevTools Protocol |
| Async runtime | Tokio |
| Backend framework | Axum |
| AI integration | LLM API with tool calling |
| Payment provider | PayPal |
| Payment testing | PayPal Sandbox |
| Database | SQLite initially |
| Browser engine | Chromium |

## 6. Repository Structure

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
│           │   └── paypal.rs
│           ├── payments/
│           ├── database/
│           └── main.rs
|
├── docs/
├── Cargo.toml
├── .env.example
├── .gitignore
└── README.md
```

## 7. Security and Permissions

Security is a core part of BuyPal.

- Never capture payments without explicit user approval.
- Never expose PayPal credentials to the AI model or browser.
- Validate product prices and order totals on the backend.
- Verify payment status using PayPal responses.
- Prevent duplicate payment captures.
- Restrict browser operations to approved capabilities.
- Never bypass merchant authentication or anti-bot protections.
- Pause and request user intervention when CAPTCHA or additional verification is required.
- Keep browsing sessions isolated.
- Do not store raw payment credentials.

## 8. Payment Integration Scope

PayPal Orders API is not a universal API for paying arbitrary third-party merchant websites.

For the hackathon prototype, BuyPal will use a controlled demo merchant checkout integrated with PayPal Sandbox.

Browser automation will perform the shopping workflow on the demo merchant website, while the PayPal integration handles the payment transaction.

External merchant websites may be supported for product discovery and cart preparation. Completing a purchase on those sites requires their own supported checkout and payment integration.

## 9. Development Roadmap

### Phase 1 — Browser Foundation

- Set up the Rust workspace.
- Create the `buypal-browser` library.
- Connect to Chromium through CDP.
- Implement navigation and session management.
- Build accessibility snapshots.
- Implement element references.
- Implement click, fill and other browser actions.

### Phase 2 — Shopping Agent

- Integrate an AI model.
- Implement browser tool calling.
- Build natural-language shopping requests.
- Search supported merchant websites.
- Extract product information.
- Implement product comparison.

### Phase 3 — Shopping Workflow

- Product selection.
- Shopping cart management.
- Budget restrictions.
- Checkout preparation.
- Browser activity interface.

### Phase 4 — PayPal Integration

- Configure PayPal Sandbox.
- Implement order creation.
- Build user approval workflow.
- Implement payment capture.
- Verify transactions.
- Generate purchase records.

### Phase 5 — Finalization

- Improve browser reliability.
- Implement error handling.
- Add transaction history.
- Deploy the application.
- Prepare documentation.
- Record the hackathon demonstration.

## 10. MVP Goals

The first working version must demonstrate one complete shopping journey:

1. User describes a product they want.
2. BuyPal opens a browser session.
3. The AI searches a merchant website.
4. The browser returns structured page information.
5. The AI identifies and compares products.
6. The user selects a product.
7. BuyPal prepares the shopping cart.
8. The user reviews the final order.
9. PayPal Sandbox handles the payment.
10. BuyPal verifies and records the transaction.

The initial release should prioritize a reliable end-to-end workflow over supporting dozens of shopping websites.

## 11. Project Vision

BuyPal aims to move online shopping from manual browsing towards agentic commerce.

By combining AI reasoning, native Rust browser automation and payment infrastructure, BuyPal gives software agents the ability to navigate real shopping websites and execute purchasing workflows under human supervision.

The long-term goal is to make BuyPal a merchant-independent shopping agent with extensible browser capabilities and payment integrations.

---

**BuyPal — Shop smarter. Let your AI do the research.**

*BuyPal is an independent project and is not affiliated with or endorsed by PayPal.*
