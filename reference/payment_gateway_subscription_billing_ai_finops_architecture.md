# Production Architecture Blueprint: Payment Gateway, Subscription Billing & AI FinOps

> **Purpose of this Document (Instructions for Antigravity / AI Engineering Agent):**
> This document is the single source of truth for architecting, implementing, and auditing the **Payment Gateway, Subscription Billing, and AI FinOps** subsystem. 
>
> Every architectural concept, database table, API workflow, and UI component is explicitly classified under one of two governance tags:
> - **`[MANDATORY]`**: Required for any production-grade, secure, financially accurate, and high-converting web application. Any feature, safeguard, UX state, or optimization that improves reliability, financial integrity, security, or user experience is strictly classified as **`[MANDATORY]`** (never optional).
> - **`[ACCORDING TO PS]`**: Driven by the specific Problem Statement, business model, target geography, or brand design guidelines. Before hardcoding these parameters, the agent must inspect the Problem Statement (PS) or project configuration and adapt accordingly.

---

## 1. Classification Matrix: `[MANDATORY]` vs. `[ACCORDING TO PS]`

| Domain Area | `[MANDATORY]` (Always Implement for Production Excellence) | `[ACCORDING TO PS]` (Derive from Problem Statement) |
| :--- | :--- | :--- |
| **Gateway & Geography** | Provider abstraction interface, webhook signature verification, 3DS2/SCA handling, multi-currency formatting, tax calculation hooks, PCI-DSS zero-card footprint. | Choice of primary gateway (**Stripe** vs. **Razorpay** vs. Dual-Gateway), base settlement currency ($\text{USD}$, $\text{INR}$, $\text{EUR}$), supported regional payment methods (UPI Autopay, SEPA, ACH). |
| **Pricing & Packaging** | Proration calculation engine, upgrade/downgrade state machine, seat count synchronization, trial expiration handlers, coupon/discount validation, invoice PDF links. | Exact pricing tiers, free tier limits, trial duration (e.g., $7$ vs. $14$ days), whether pricing is flat, seat-based, pure pay-as-you-go, or hybrid. |
| **AI FinOps & Token Ledger** | Double-entry append-only ledger, integer micro-unit storage, Two-Phase Commit (Reserve $\rightarrow$ Stream $\rightarrow$ Capture/Release) for AI calls, FIFO credit bucket expiration, hard kill-switches, streaming disconnect metering. | Specific LLM models offered, token markup multiplier / margin percentage, included monthly credit allowances per tier, overage unit price vs. prepaid top-up packs. |
| **Webhooks & Concurrency** | Raw-body HMAC verification, idempotency table with row-level locks, out-of-order timestamp protection, fast HTTP $200$ acknowledgement ($< 2\text{ s}$), async retry queue with Dead Letter Queue (DLQ). | Specific internal provisioning side-effects (e.g., unlocking specific PS features, triggering custom onboarding emails, provisioning dedicated vector namespaces). |
| **UI, Theme & Billing Portal** | Optimistic UI locks during checkout, proration preview modals before plan changes, low-credit warning banners, dunning payment-recovery banners, skeleton loaders, accessible tabular numerals (`font-variant-numeric: tabular-nums`). | Visual theme (dark/light/neobrutalist/minimalist), color palette, typography, brand voice, custom vs. hosted Stripe/Razorpay portal preference. |

---

## 2. Core Financial Principles & Database Schema `[MANDATORY]`

### 2.1 Zero Floating-Point Arithmetic Rule `[MANDATORY]`
Never store or compute currency or AI token balances using `FLOAT`, `REAL`, or standard IEEE 754 floating-point numbers.
- **Currency**: Store in the smallest currency subunit (e.g., cents for $\text{USD}$, paise for $\text{INR}$) or **Micro-Units** where $\$1.00 = 10^6 \text{ micro-dollars}$ (`BIGINT`) so sub-cent AI token costs (e.g., $\$0.00015$ per $1\text{K}$ tokens) are calculated without rounding drift.
- **Mathematical Conversion Formula**:
  $$\text{Cost in Micro-USD} = \left\lceil \frac{\text{Tokens}_{\text{input}} \times \text{Price}_{\text{input\_per\_1M}} + \text{Tokens}_{\text{output}} \times \text{Price}_{\text{output\_per\_1M}}}{10^6} \right\rceil$$
  *(Note: Always apply ceiling rounding $\lceil x \rceil$ on fractional micro-units in favor of the platform so micro-transactions never leak margin).*

### 2.2 Double-Entry Append-Only Ledger Architecture `[MANDATORY]`
Never implement a naive `UPDATE users SET credits = credits - cost` pattern without an immutable ledger trail. Every balance mutation must be recorded as an immutable ledger entry tied to a specific credit grant bucket and reference transaction.

#### Production SQL Schema (PostgreSQL) `[MANDATORY]`

```sql
-- 1. Billing Accounts (Maps to Tenant / Workspace / Organization or Individual User [ACCORDING TO PS])
CREATE TABLE billing_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE, -- User ID or Organization ID [ACCORDING TO PS]
    provider VARCHAR(32) NOT NULL,  -- 'stripe' | 'razorpay' [ACCORDING TO PS]
    external_customer_id VARCHAR(128) UNIQUE,
    billing_email VARCHAR(255) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD', -- 'USD' | 'INR' | 'EUR' [ACCORDING TO PS]
    tax_id_type VARCHAR(32),        -- 'in_gst' | 'eu_vat' | 'us_ein'
    tax_id_value VARCHAR(64),
    cached_available_balance_micros BIGINT NOT NULL DEFAULT 0, -- Denormalized cache, synced via trigger/transaction
    reserved_balance_micros BIGINT NOT NULL DEFAULT 0,         -- In-flight AI request holds
    hard_spend_limit_micros BIGINT,                            -- Monthly hard cap kill-switch
    soft_alert_threshold_micros BIGINT,                        -- Email/UI warning threshold
    auto_topup_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    auto_topup_trigger_micros BIGINT,
    auto_topup_amount_micros BIGINT,
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active' | 'past_due' | 'suspended' | 'delinquent'
    version BIGINT NOT NULL DEFAULT 1,            -- Optimistic locking version
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_non_negative_reserved CHECK (reserved_balance_micros >= 0)
);

-- 2. Subscriptions State Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    billing_account_id UUID NOT NULL REFERENCES billing_accounts(id) ON DELETE RESTRICT,
    provider VARCHAR(32) NOT NULL,
    external_subscription_id VARCHAR(128) NOT NULL UNIQUE,
    plan_code VARCHAR(64) NOT NULL,        -- e.g., 'free', 'pro_monthly', 'enterprise_annual' [ACCORDING TO PS]
    status VARCHAR(32) NOT NULL,           -- 'trialing' | 'active' | 'past_due' | 'paused' | 'canceled' | 'unpaid'
    seat_count INTEGER NOT NULL DEFAULT 1,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    grace_period_ends_at TIMESTAMPTZ,      -- Dunning grace window before hard feature lock
    scheduled_plan_code VARCHAR(64),       -- Pending end-of-cycle downgrade plan
    last_event_timestamp BIGINT NOT NULL DEFAULT 0, -- Prevents out-of-order webhook regression
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Credit Grant Buckets (Supports FIFO Expiration across Trial, Monthly Included, and Purchased Top-Ups)
CREATE TABLE credit_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    billing_account_id UUID NOT NULL REFERENCES billing_accounts(id) ON DELETE RESTRICT,
    grant_type VARCHAR(32) NOT NULL, -- 'promotional_trial' | 'subscription_allowance' | 'prepaid_topup' | 'manual_adjustment'
    initial_amount_micros BIGINT NOT NULL,
    remaining_amount_micros BIGINT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 100, -- Lower number consumed first (10: Trial, 20: Monthly, 30: Top-up)
    effective_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,                -- NULL for non-expiring purchased credits (if [ACCORDING TO PS])
    source_reference_id VARCHAR(128) UNIQUE, -- Invoice ID or Payment Intent ID for idempotency
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_remaining_bounds CHECK (remaining_amount_micros >= 0 AND remaining_amount_micros <= initial_amount_micros)
);

CREATE INDEX idx_credit_grants_consumption 
ON credit_grants (billing_account_id, priority ASC, expires_at ASC NULLS LAST) 
WHERE remaining_amount_micros > 0;

-- 4. Pre-Flight AI Token Reservations (Two-Phase Commit for In-Flight LLM Calls)
CREATE TABLE token_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    billing_account_id UUID NOT NULL REFERENCES billing_accounts(id) ON DELETE RESTRICT,
    request_idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    model_identifier VARCHAR(64) NOT NULL,
    reserved_micros BIGINT NOT NULL,
    actual_captured_micros BIGINT,
    status VARCHAR(32) NOT NULL DEFAULT 'RESERVED', -- 'RESERVED' | 'CAPTURED' | 'RELEASED' | 'EXPIRED'
    expires_at TIMESTAMPTZ NOT NULL, -- Stale reservation sweeper target (e.g., NOW() + INTERVAL '5 minutes')
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 5. Immutable Financial & Usage Ledger (Append-Only Audit Trail)
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    billing_account_id UUID NOT NULL REFERENCES billing_accounts(id) ON DELETE RESTRICT,
    credit_grant_id UUID REFERENCES credit_grants(id),
    reservation_id UUID REFERENCES token_reservations(id),
    entry_type VARCHAR(32) NOT NULL, -- 'CREDIT_GRANT' | 'AI_USAGE_DEBIT' | 'OVERAGE_ACCRUAL' | 'EXPIRATION_WRITE_OFF' | 'REFUND_CLAWBACK'
    amount_micros BIGINT NOT NULL,   -- Positive for credits added, Negative for consumption/debits
    balance_after_micros BIGINT NOT NULL,
    model_identifier VARCHAR(64),
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    cached_tokens INTEGER DEFAULT 0,
    reasoning_tokens INTEGER DEFAULT 0,
    provider_cogs_micros BIGINT DEFAULT 0, -- Actual wholesale cost paid to OpenAI/Anthropic/Google for margin analytics
    idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Idempotent Webhook Events Log
CREATE TABLE billing_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(32) NOT NULL,            -- 'stripe' | 'razorpay'
    external_event_id VARCHAR(128) NOT NULL UNIQUE,
    event_type VARCHAR(128) NOT NULL,
    api_version VARCHAR(64),
    status VARCHAR(32) NOT NULL DEFAULT 'PROCESSING', -- 'PROCESSING' | 'PROCESSED' | 'FAILED' | 'IGNORED_STALE'
    payload JSONB NOT NULL,
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Payment Gateway Integration (`Stripe` & `Razorpay`)

### 3.1 Provider Strategy & Unified Adapter Pattern `[MANDATORY]`
- **Gateway Selection `[ACCORDING TO PS]`**:
  - **Stripe**: Preferred for global SaaS, multi-currency ($\text{USD}$, $\text{EUR}$, $\text{GBP}$), automated Stripe Tax, and native metered billing.
  - **Razorpay**: Preferred when the Problem Statement targets Indian users/businesses requiring domestic **UPI Autopay**, RuPay, Netbanking, and lower domestic MDR, or **Hybrid Dual-Gateway** (Razorpay for $\text{INR}$ via IP/country detection + Stripe for Rest-of-World).
- **Gateway Abstraction Interface `[MANDATORY]`**: Never couple controllers directly to the Stripe or Razorpay SDK. Implement a `BillingGatewayAdapter` interface exposing:
  - `createCheckoutSession(params)`
  - `createTopupPaymentIntent(params)`
  - `updateSubscriptionPlan(params)`
  - `updateSubscriptionSeats(params)`
  - `cancelSubscription(params)`
  - `createCustomerPortalSession(params)`
  - `verifyWebhookSignature(rawBody, signatureHeader)`

### 3.2 Checkout Flows & Pricing Models
1. **Recurring Flat & Tiered Subscriptions `[MANDATORY]`**:
   - Support both **Monthly** and **Annual** billing intervals (typically offering a $15\%\text{–}20\%$ annual discount `[ACCORDING TO PS]`).
   - Pass internal `tenant_id`, `user_id`, `plan_code`, and `idempotency_key` in the gateway `metadata` / `notes` object on every checkout session so webhooks can deterministically reconcile the tenant even if the customer changes their email during checkout.
2. **Seat-Based (Per-User) Pricing `[ACCORDING TO PS]`**:
   - When the PS involves team workspaces or collaborative organizations, synchronize active workspace member counts with the subscription's `quantity` parameter.
   - **Mid-Cycle Seat Addition `[MANDATORY]`**: When adding a seat mid-month, calculate and invoice the prorated amount immediately (`proration_behavior: 'always_invoice'` in Stripe) or adjust the next invoice (`create_prorations`) `[ACCORDING TO PS]`.
   - **Seat Removal Safeguard `[MANDATORY]`**: Before permitting an admin to lower paid seat count, validate that $\text{Active Workspace Members} + \text{Pending Invites} \le \text{New Seat Count}$.
3. **Multi-Currency Checkout & Localization `[ACCORDING TO PS]`**:
   - Present prices in the customer's local currency based on billing country (`USD`, `INR`, `EUR`, `GBP`).
   - Support **Purchasing Power Parity (PPP)** or regional price books if specified by the PS.
   - Lock the customer's `currency` on their `billing_accounts` record upon their first successful transaction; payment gateways forbid mixing currencies on a single customer subscription schedule.

### 3.3 Regulatory & Regional Compliance Safeguards `[MANDATORY]`
- **India RBI e-Mandate & UPI Autopay Rules (When using Razorpay or Stripe India)**:
  - **AFA Threshold**: Recurring transactions above $\text{INR } 15,000$ (or $\text{INR } 1,00,000$ for specific BFSI categories) require Additional Factor of Authentication (AFA) via OTP/PIN on every charge.
  - **Pre-Debit Notification (PDN)**: The gateway must send a mandatory pre-debit notification at least $24\text{ hours}$ prior to actual debit. Consequently, internal subscription renewal grace windows must allow $24\text{–}48\text{ hours}$ for asynchronous mandate execution before downgrading a user.
  - **Maximum Mandate Amount**: When registering a UPI Autopay mandate for a hybrid plan (base fee + variable AI overage), register the mandate `max_amount` to cover the base plan plus the maximum allowed monthly overage cap.
- **3D Secure 2 (3DS2) / SCA (Europe & UK)**:
  - Off-session recurring renewals or auto-top-ups can trigger `authentication_required` (`invoice.payment_action_required`).
  - **`[MANDATORY]` Handling**: Catch this webhook, transition the account to `past_due` (within grace period), display an in-app banner with a direct link to the hosted invoice payment URL to complete 3DS challenge, and pause auto-top-up retries until the user completes authentication.

### 3.4 Automated Tax, GST & Compliant Invoicing `[MANDATORY]`
- **Tax Calculation**:
  - Enable **Stripe Tax** (`automatic_tax: { enabled: true }`) or compute **Indian GST ($18\%$ IGST or $9\%$ CGST + $9\%$ SGST)** dynamically based on place of supply (Billing State Code vs. Seller State Code).
- **B2B Tax IDs & GSTIN Validation `[MANDATORY]`**:
  - Allow customers to enter their **GSTIN** (India), **EU VAT Number**, or **US EIN** during checkout or in the billing portal.
  - Validate GSTIN format via regex `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$` and apply **Reverse Charge Mechanism (RCM)** for eligible cross-border B2B transactions.
- **SAC / HSN Classification**: Use SAC code `998314` or `998315` (Information technology design and development / Cloud SaaS services) on Indian tax invoices.
- **Immutable Invoice & Credit Note Rules `[MANDATORY]`**:
  - Once an invoice is finalized (`paid`), its line items and tax details must never be mutated. Any refund or downward adjustment must generate a formal **Credit Note** referencing the original invoice number.

---

## 4. AI FinOps, Token Ledger & Real-Time Usage Metering

AI applications differ fundamentally from traditional SaaS because every user action incurs real-time, variable Cost of Goods Sold (COGS) via external LLM APIs. A single race condition or infinite agent loop can bankrupt an unprotected platform.

### 4.1 The Two-Phase Commit (Reserve $\rightarrow$ Stream $\rightarrow$ Capture/Release) Pattern `[MANDATORY]`

Never check a user's balance at the start of an LLM call and only deduct credits at the end without a reservation lock. Otherwise, a user with $\$0.10$ remaining can launch $50$ parallel requests simultaneously, bypassing the balance check on all $50$ and driving the account deeply negative.

```
Client Request ──► [Phase 1: Pre-Flight Estimate & Atomic Reservation]
                         │
                         ├─► Insufficient Available Balance? ──► HTTP 402 Payment Required
                         │
                         ▼ (Sufficient Balance Locked)
                   [Phase 2: Execute LLM Call / SSE Stream]
                         │
                         ├─► Client Aborts / Network Drop? ──► Count Partial Streamed Tokens
                         │
                         ▼
                   [Phase 3: Atomic Capture & Release Surplus]
                         │
                         ├─► Deduct Actual Cost from Credit Grants (FIFO by Expiry)
                         ├─► Release Unused Reserved Balance
                         └─► Trigger Auto-Top-Up or Soft Alert if Threshold Crossed
```

#### Phase 1: Pre-Flight Estimation & Atomic Hold `[MANDATORY]`
1. Count or estimate input tokens ($T_{\text{in}}$) including system prompts, conversation history, RAG context, and tool definitions.
2. Determine the maximum possible completion tokens ($T_{\text{max\_out}}$) from the request's `max_tokens` parameter (always enforce an explicit `max_tokens` ceiling on every LLM call; never leave it unbounded).
3. Calculate the worst-case reservation cost:
   $$C_{\text{reserve}} = \left\lceil \frac{T_{\text{in}} \times P_{\text{in}} + T_{\text{max\_out}} \times P_{\text{out}}}{10^6} \right\rceil$$
4. Execute an atomic database transaction (or Redis Lua script backed by Postgres):
   - Verify:
     $$\text{cached\_available\_balance\_micros} - \text{reserved\_balance\_micros} \ge C_{\text{reserve}}$$
   - Verify workspace/key monthly hard spend limit:
     $$\text{monthly\_spend\_micros} + \text{reserved\_balance\_micros} + C_{\text{reserve}} \le \text{hard\_spend\_limit\_micros}$$
   - Increment `reserved_balance_micros += C_reserve` and insert a `RESERVED` row in `token_reservations`.
   - If the check fails, immediately abort before calling the LLM provider and return HTTP `402 Payment Required` with structured error code `INSUFFICIENT_AI_CREDITS` or `HARD_BUDGET_CAP_REACHED`.

#### Phase 2: Streaming Execution & Abort Resilience `[MANDATORY]`
- When streaming responses via Server-Sent Events (SSE), always pass `stream_options: { include_usage: true }` (OpenAI/compatible) or read the message delta usage metadata (Anthropic/Gemini).
- **Client Disconnect / Abort Trap `[MANDATORY]`**: If the user closes their browser tab or hits "Stop Generating" mid-stream, the upstream LLM provider still bills for the prompt tokens and all completion tokens generated prior to cancellation.
  - Maintain an in-memory chunk accumulator in the stream handler.
  - In a `finally` block (which executes even on stream abort or exception), compute the exact token count from the provider's final usage chunk or fallback to a local tokenizer (`tiktoken` / character-to-token heuristic $+ 10\%$ safety buffer) and commit Phase 3.

#### Phase 3: Atomic Capture, FIFO Bucket Depletion & Surplus Release `[MANDATORY]`
1. Compute actual cost $C_{\text{actual}}$ using exact `prompt_tokens`, `cached_tokens`, `reasoning_tokens`, and `completion_tokens`:
   $$C_{\text{actual}} = \left\lceil \frac{T_{\text{in\_uncached}} \cdot P_{\text{in}} + T_{\text{in\_cached}} \cdot P_{\text{cache}} + (T_{\text{out}} + T_{\text{reasoning}}) \cdot P_{\text{out}}}{10^6} \right\rceil$$
2. Deplete active `credit_grants` using **FIFO by Expiration & Priority**:
   - **Priority 10**: Expiring Promotional / Trial Credits (earliest `expires_at` first).
   - **Priority 20**: Monthly Subscription Included Credits (expire at `current_period_end`).
   - **Priority 30**: Purchased Prepaid Top-Up Credits (longest expiry or non-expiring).
3. Decrement `reserved_balance_micros -= C_reserve`, decrement `cached_available_balance_micros -= C_actual`, mark `token_reservations.status = 'CAPTURED'`, and append immutable rows to `ledger_entries`.
4. **Stale Reservation Sweeper Cron `[MANDATORY]`**: Run a background worker every $2\text{ minutes}$ to inspect `token_reservations` where `status = 'RESERVED' AND expires_at < NOW()` (caused by hard server crashes mid-stream) and release or reconcile them.

### 4.2 Multi-Modal & Multi-Model Pricing Catalog Engine `[MANDATORY]`
Store model pricing in a configurable database table or versioned configuration rather than magic numbers scattered across code:

| Cost Dimension | Metering Unit | FinOps Handling Rule `[MANDATORY]` |
| :--- | :--- | :--- |
| **Text Input / Output** | Per $10^6$ tokens | Separate rates for uncached prompt, cached prompt read, cache write, and output tokens. |
| **Reasoning / Thinking Tokens** | Per $10^6$ tokens | Billed at the output token rate even if hidden from the end user UI. |
| **Vision / Image Inputs** | Tile / Resolution calculation | Calculate token equivalent based on image dimensions (e.g., low-res $85\text{ tokens}$ vs. high-res $170\text{ tokens per } 512\times 512\text{ tile}$) during Pre-Flight Phase 1. |
| **Audio / Voice / TTS** | Per second or per character | Convert duration/characters into micro-dollar equivalents prior to reservation. |
| **Web Search / Tool Execution** | Per invocation flat fee | Add fixed micro-dollar surcharge per external tool/search call (e.g., $\$0.005$ per search call). |

### 4.3 Hard Budget Kill-Switches, Anomaly Detection & Auto-Top-Up `[MANDATORY]`
- **Multi-Level Spend Caps**:
  - **Organization/Tenant Hard Cap**: Immediately rejects all AI calls once monthly spend reaches the user-configured or tier-configured ceiling.
  - **Per-User / Per-API-Key Sub-Limits `[ACCORDING TO PS]`**: Prevents a single compromised API key or rogue team member from draining the entire organization's credit pool.
- **Infinite Loop & Velocity Circuit Breaker `[MANDATORY]`**:
  - Track sliding-window token burn rate in Redis (`tenant:{id}:spend_5m`).
  - If a tenant's spend velocity exceeds a configurable anomaly threshold (e.g., $> 20\times$ normal burn rate or $> \$20$ within $60\text{ seconds}$ due to a recursive agent loop), trip an automatic circuit breaker, pause the API key, and alert the user.
- **Automated Prepaid Top-Up (Auto-Recharge) `[MANDATORY]`**:
  - Allow users to configure: *"When my balance falls below $\$X$, automatically charge my default payment method for $\$Y$."*
  - **Anti-Loop Protection**: Enforce a strict cooldown (e.g., maximum $3$ auto-top-up charges per $24\text{ hours}$) and use a deterministic idempotency key `autotopup:{billing_account_id}:{date_bucket}:{sequence}` so concurrent requests crossing the threshold only trigger **one** off-session payment intent.
  - If an off-session auto-top-up charge fails (`card_declined` or `authentication_required`), immediately disable `auto_topup_enabled = false` on the account and notify the customer to prevent endless gateway retry penalties.

### 4.4 Unit Economics & Gross Margin Telemetry `[MANDATORY]`
Every row in `ledger_entries` records both:
- `amount_micros`: The retail credits deducted from the customer (reflecting your platform's markup `[ACCORDING TO PS]`).
- `provider_cogs_micros`: The exact wholesale cost charged by OpenAI/Anthropic/Google/AWS.
- **Gross Margin Formula**:
  $$\text{Gross Margin \%} = \left( \frac{\text{Revenue}_{\text{recognized}} - \sum \text{COGS}_{\text{LLM}}}{\text{Revenue}_{\text{recognized}}} \right) \times 100$$

---

## 5. Idempotent Billing Webhooks & Distributed State Machines

Payment gateways guarantee **at-least-once delivery** and **DO NOT guarantee delivery order**. Your webhook architecture must survive duplicate events, out-of-order arrivals, and concurrent bursts.

### 5.1 Cryptographic Signature Verification `[MANDATORY]`
- **Raw Body Requirement**: Parse the incoming webhook route using a raw buffer body parser (`express.raw({ type: 'application/json' })` or `await request.text()` in Next.js App Router). Never parse JSON first and re-stringify, as whitespace changes invalidate the HMAC signature.
- **Stripe**: Verify `Stripe-Signature` header using `stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)` with default $300\text{-second}$ timestamp tolerance to prevent replay attacks.
- **Razorpay**: Verify `X-Razorpay-Signature` using HMAC-SHA256 with `crypto.timingSafeEqual(expectedBuffer, receivedBuffer)`.

### 5.2 Idempotency, Row Locking & Out-of-Order Protection `[MANDATORY]`

Implement the following atomic pipeline inside your webhook handler:

```typescript
// Production Webhook Processing Pattern [MANDATORY]
async function handleWebhookEvent(provider: 'stripe' | 'razorpay', eventId: string, eventType: string, eventCreatedUnix: number, payload: any) {
  return await db.transaction(async (tx) => {
    // Step 1: Attempt idempotent insert of the webhook event ID
    const inserted = await tx.query(`
      INSERT INTO billing_webhook_events (provider, external_event_id, event_type, status, payload)
      VALUES ($1, $2, $3, 'PROCESSING', $4)
      ON CONFLICT (external_event_id) DO NOTHING
      RETURNING id
    `, [provider, eventId, eventType, payload]);

    if (inserted.rowCount === 0) {
      // Event is already PROCESSING or PROCESSED by another worker
      const existing = await tx.query(
        `SELECT status FROM billing_webhook_events WHERE external_event_id = $1`,
        [eventId]
      );
      if (existing.rows[0]?.status === 'PROCESSED' || existing.rows[0]?.status === 'IGNORED_STALE') {
        return { status: 200, message: 'Duplicate event ignored idempotently' };
      }
      // If status is PROCESSING or FAILED, acquire row lock or allow retry
    }

    // Step 2: Acquire Pessimistic Row-Level Lock on the Billing Account
    const account = await tx.query(`
      SELECT * FROM billing_accounts
      WHERE external_customer_id = $1
      FOR UPDATE
    `, [extractCustomerId(payload)]);

    // Step 3: Guard Against Out-of-Order Events
    // Instead of blindly trusting the webhook payload's snapshot for mutable subscription state,
    // check `last_event_timestamp` OR fetch the latest canonical subscription state directly from Stripe/Razorpay API.
    const sub = await tx.query(`
      SELECT * FROM subscriptions
      WHERE external_subscription_id = $1
      FOR UPDATE
    `, [extractSubscriptionId(payload)]);

    if (sub.rowCount > 0 && eventCreatedUnix < sub.rows[0].last_event_timestamp) {
      await tx.query(
        `UPDATE billing_webhook_events SET status = 'IGNORED_STALE', processed_at = NOW() WHERE external_event_id = $1`,
        [eventId]
      );
      return { status: 200, message: 'Stale out-of-order event ignored' };
    }

    // Step 4: Execute Domain State Transition & Credit Provisioning
    await applyBillingDomainLogic(tx, eventType, eventCreatedUnix, payload);

    // Step 5: Mark Webhook Event as PROCESSED
    await tx.query(
      `UPDATE billing_webhook_events SET status = 'PROCESSED', processed_at = NOW() WHERE external_event_id = $1`,
      [eventId]
    );

    return { status: 200, message: 'Processed' };
  });
}
```

### 5.3 Mandatory Webhook Event Matrix `[MANDATORY]`

| Event Category | Stripe Event | Razorpay Equivalent | Mandatory System Action |
| :--- | :--- | :--- | :--- |
| **Initial Checkout** | `checkout.session.completed` | `order.paid` / `subscription.authenticated` | Link `external_customer_id` to `billing_accounts`. Provision initial subscription or one-time credit top-up grant idempotently using invoice/payment ID as `source_reference_id`. |
| **Recurring Renewal** | `invoice.paid` | `subscription.charged` / `invoice.paid` | Extend `current_period_start` and `current_period_end`. Expire unused monthly non-rollover credits from the prior period. Grant fresh monthly subscription credits (`priority = 20`). Clear any `past_due` or dunning flags. |
| **Payment Failure (Dunning)** | `invoice.payment_failed` | `subscription.pending` / `subscription.halted` | Transition subscription to `past_due`. Set `grace_period_ends_at = NOW() + INTERVAL '3 days'` (or `[ACCORDING TO PS]`). Trigger dunning alert email and persistent UI banner with payment update link. |
| **Plan / Seat Mutation** | `customer.subscription.updated` | `subscription.updated` | Sync `plan_code`, `seat_count`, `cancel_at_period_end`, and `status`. If upgraded mid-cycle, immediately grant the prorated difference in AI credits. |
| **Final Cancellation** | `customer.subscription.deleted` | `subscription.cancelled` / `subscription.completed` | Downgrade account to `free` tier (or lock access `[ACCORDING TO PS]`). Expire subscription allowance credit grants (`grant_type = 'subscription_allowance'`), while preserving any non-expiring purchased `prepaid_topup` credits. |
| **Refunds & Disputes** | `charge.refunded` / `charge.dispute.created` | `refund.processed` / `payment.dispute.created` | Append a `REFUND_CLAWBACK` entry to `ledger_entries` deducting the refunded credits. If `dispute.created`, immediately freeze AI execution (`status = 'suspended'`) to stop active fraud. |

---

## 6. Subscription Lifecycle, Proration & Dunning Management `[MANDATORY]`

### 6.1 Subscription State Machine
```
                  ┌──────────────────────┐
                  │      trialing        │
                  └──────────┬───────────┘
                             │ Trial Ends + First Invoice Paid
                             ▼
┌──────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│  paused  │◄────►│        active        │─────►│     past_due         │
└──────────┘      └──────────┬───────────┘      │ (Grace Period Active)│
                             │                  └──────────┬───────────┘
        Cancel at Period End │                             │ All Retries Exhausted
                             ▼                             ▼
                  ┌──────────────────────┐      ┌──────────────────────┐
                  │       canceled       │      │  unpaid / suspended  │
                  └──────────────────────┘      └──────────────────────┘
```

### 6.2 Upgrades vs. Downgrades & Proration Rules `[MANDATORY]`
- **Upgrades (Low Tier $\rightarrow$ High Tier)**:
  - Take effect **immediately**.
  - Charge the prorated price difference immediately (`always_invoice` / `pending_if_incomplete` so the upgrade only completes if the card charge succeeds!).
  - *Critical Security Rule `[MANDATORY]`*: Never grant upgraded tier benefits or extra AI credits until the prorated upgrade invoice status is confirmed `paid`. Otherwise, users with a declining card can upgrade to Enterprise and consume credits before the webhook fails.
- **Downgrades (High Tier $\rightarrow$ Low Tier)**:
  - Schedule the downgrade to take effect at **`current_period_end`** (via Stripe Subscription Schedules or storing `scheduled_plan_code`).
  - The user has already paid for the current billing cycle and must retain their current tier's features and monthly credit bucket until the cycle concludes.

### 6.3 Smart Dunning & Involuntary Churn Recovery `[MANDATORY]`
- **Grace Period Architecture**: When a renewal payment fails, do not immediately cut off a paying customer's production workflow. Provide a configurable grace period (default $72\text{ hours}$ `[ACCORDING TO PS]`) where the subscription status is `past_due` but core access remains active while displaying a high-visibility warning banner.
- **Hard Lock after Grace Expiry**: If `NOW() > grace_period_ends_at` and the invoice remains unpaid, transition access to read-only / free tier limits and block paid AI endpoints until payment is resolved.

---

## 7. Self-Serve Billing Portal & FinOps UX Architecture

### 7.1 Visual Design & Theme Governance
- **Aesthetics & Theme `[ACCORDING TO PS]`**: Colors, border radii, dark/light mode defaults, typography, and brand personality must strictly match the Problem Statement's design system.
- **Financial UI Ergonomics `[MANDATORY]`**:
  - **Tabular Numerals**: Apply `font-variant-numeric: tabular-nums` (Tailwind `tabular-nums`) to all currency figures, token counters, invoice tables, and real-time usage meters so digits align vertically and do not jitter during live updates.
  - **Explicit Currency & Unit Formatting**: Clearly distinguish between **Currency** ($\$14.50\text{ USD}$) and **AI Credits / Tokens** ($14,500\text{ Credits}$ or $1.2\text{M Tokens}$). Never leave units ambiguous.

### 7.2 Mandatory Self-Serve Portal Components `[MANDATORY]`

1. **Real-Time Credit Balance & Burn-Rate Header**:
   - Displays **Available Balance**, **In-Flight Reserved Balance**, and a segmented progress bar breaking down credit buckets:
     - *Promotional / Trial Credits* (with expiration countdown badge)
     - *Monthly Plan Credits* (with reset date: *"Resets on Dec 1, 2026"*)
     - *Purchased Top-Up Credits* (Non-expiring or custom expiry)
   - **Burn-Rate Forecast Indicator**: Calculate the $7\text{-day}$ rolling average daily spend ($\bar{S}_{7\text{d}}$) and show:
     $$\text{Estimated Days Remaining} = \left\lfloor \frac{\text{Available Balance}}{\bar{S}_{7\text{d}}} \right\rfloor$$
2. **Granular AI Usage & FinOps Analytics View**:
   - Interactive time-series breakdown (Daily / Hourly) filterable by **Model** (e.g., `gpt-4o`, `claude-3-5-sonnet`, `gemini-2.5-pro`), **API Key**, and **Workspace Member**.
   - Detailed paginated ledger log showing timestamp, request ID, model, prompt tokens, cached tokens (highlighting cache savings!), completion tokens, and exact credit deduction.
3. **Interactive Plan Switcher with Proration Preview Modal**:
   - Before a user confirms an upgrade, downgrade, or seat count change, query the gateway's upcoming invoice preview API (`stripe.invoices.createPreview`) and render an exact breakdown:
     - *Unused time on current plan credit*
     - *Remaining time on new plan charge*
     - *Tax / GST*
     - ***Total Due Immediately Today*** vs. ***Next Recurring Renewal Amount on [Date]***.
4. **Budget Controls & Auto-Top-Up Configuration Card**:
   - Toggle for **Auto-Recharge** with threshold and recharge amount inputs.
   - Input for **Monthly Hard Spend Limit (Kill-Switch)** and **Soft Email Alert Threshold** ($50\%$, $80\%$, $95\%$).
5. **Payment Methods, Tax Profile & Invoice History Table**:
   - Ability to add/remove payment methods and designate a default method (or launch the embedded Stripe Customer Portal / Razorpay Mandate link).
   - Self-serve form to update **Billing Legal Name, Billing Address, and Tax ID / GSTIN** (automatically syncing to future invoices).
   - Paginated Invoice & Receipt history table with status badges (`Paid`, `Open`, `Void`, `Uncollectible`) and one-click **Download Tax Invoice PDF** buttons.
6. **Cancellation Deflection & Offboarding Flow**:
   - When a user clicks "Cancel Subscription", present a clean multi-step modal:
     1. **Loss Summary**: Clearly display what happens on `current_period_end` (e.g., *"You will keep access to Pro features and your $45,000$ monthly credits until Nov 30. Your $10,000$ purchased top-up credits will remain in your account."*).
     2. **Salvage Alternative**: Offer a **1-click Pause Subscription** (for $1\text{–}3$ months) or a downgrade to a lower tier.
     3. **Exit Survey**: Capture structured cancellation reason (`too_expensive`, `missing_features`, `switching_competitor`, `project_completed`) for churn analytics before executing `cancel_at_period_end = true`.

---

## 8. Reconciliation, Security & Production Verification Checklist `[MANDATORY]`

### 8.1 Nightly Automated Financial Reconciliation Job `[MANDATORY]`
Webhooks can occasionally fail due to prolonged third-party outages. Implement an automated daily reconciliation cron job:
1. **Subscription Drift Check**: Query all active/past_due subscriptions in PostgreSQL and verify their status and `current_period_end` against the payment gateway's API. Auto-heal any state drift and log an alert.
2. **Ledger Integrity Check**: Verify that for every `billing_accounts` row:
   $$\text{cached\_available\_balance\_micros} = \sum_{\text{active grants}} \text{remaining\_amount\_micros}$$
   If a discrepancy is detected, lock the account row, recompute from the immutable `ledger_entries` and `credit_grants` tables, heal the cache, and emit a high-severity engineering alert.

### 8.2 Security & PCI-DSS Guardrails `[MANDATORY]`
- **Zero Card Data Touch**: Never accept raw PAN (Primary Account Number), CVV, or expiry dates on your backend servers. Always use Stripe Checkout / Stripe Elements (`PaymentElement`) or Razorpay Checkout.js so card data goes directly to the PCI-Level-1 vault.
- **Tenant Isolation**: Every billing API endpoint (`/api/billing/portal`, `/api/billing/invoices`, `/api/billing/limits`) must enforce strict RBAC (Role-Based Access Control), verifying that the authenticated user holds the `OWNER` or `BILLING_ADMIN` role for the target `tenant_id`.
- **Rate Limiting on Checkout & Top-Up Endpoints**: Apply strict sliding-window rate limits (e.g., $5\text{ requests per minute per user}$) on payment intent and checkout creation endpoints to prevent card-testing attacks.

### 8.3 Pre-Deployment Verification Checklist for Antigravity `[MANDATORY]`
Before marking the billing and FinOps module complete, verify all of the following:
- [ ] All monetary and token cost calculations use integer micro-units (`BIGINT`) with zero floating-point math.
- [ ] Pre-flight token reservation locks balance *before* invoking the LLM API, and releases unused balance in a `finally` block even when the client aborts an SSE stream.
- [ ] Concurrent parallel LLM requests from an account with low balance cannot drive `cached_available_balance_micros` below $0$.
- [ ] Webhook handler verifies cryptographic HMAC signatures against the **raw request buffer** and rejects replayed timestamps.
- [ ] Sending the exact same `invoice.paid` webhook payload $10$ times concurrently results in **exactly $1$** credit grant and ledger entry.
- [ ] Sending an older `customer.subscription.updated` event *after* a newer event does not overwrite the newer subscription state.
- [ ] Mid-cycle plan upgrades wait for invoice payment confirmation (`paid`) before provisioning higher tier credits.
- [ ] All UI tables, token meters, and pricing cards use `tabular-nums` and handle loading, empty, `past_due` dunning, and `402 Insufficient Credits` states gracefully.