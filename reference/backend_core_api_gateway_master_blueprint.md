# Master Architectural Blueprint: Backend Core, API Gateway, Rate Limiting, Async Queues & Real-Time Streaming

> **System Directive for AI Agent (Antigravity):**
> This document serves as the authoritative architectural knowledge base for building, scaling, and auditing the backend infrastructure of any modern, high-performance web and AI-native application. 
> 
> **Classification Rules:**
> - **`[MANDATORY]`**: Any concept, pattern, security control, performance optimization, resilience mechanism, or UX-enhancing backend feature that improves reliability, speed, developer experience, or system integrity. **Nothing that improves the web application is optional.** You must implement or enforce these by default.
> - **`[ACCORDING TO PS]`**: Any concept, schema, routing choice, business quota, third-party integration, or UI/theme-coupled payload design that depends on the specific **Problem Statement (PS)**. You must dynamically adapt these based on the project's domain requirements.

---

## 1. System Taxonomy & Architectural Overview

A production-grade backend does not merely expose database CRUD operations; it acts as a hardened **Traffic Controller, State Coordinator, Asynchronous Orchestrator, and Real-Time Event Multiplexer**.

```
[Client / Browser / Mobile]
        │
        ▼ (TLS 1.3 / HTTP/2 & HTTP/3 / WSS)
┌─────────────────────────────────────────────────────────────────────────┐
│ L1: EDGE & WAF LAYER [MANDATORY]                                        │
│ CloudFront / Cloudflare / AWS WAF (DDoS, Geo-Block, IP Throttling)      │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ L2: API GATEWAY & MIDDLEWARE PIPELINE [MANDATORY]                       │
│ Correlation ID -> AuthN/AuthZ -> Multi-Tier Rate Limiter -> Idempotency │
└───────┬───────────────────────────┬─────────────────────────────┬───────┘
        │ (Sync Queries/Mutations)  │ (Heavy Compute / AI Tasks)  │ (Live Streams)
        ▼                           ▼                             ▼
┌───────────────────┐     ┌───────────────────────┐     ┌─────────────────────────┐
│ Typed API Core    │     │ Distributed Queue     │     │ Real-Time Gateway       │
│ FastAPI / Node.js │     │ BullMQ / Celery + SQS │     │ SSE & WebSockets        │
│ Pydantic / Zod    │     │ Outbox Pattern + DLQ  │     │ Redis Pub/Sub & Streams │
└─────────┬─────────┘     └───────────┬───────────┘     └────────────▲────────────┘
          │                           │                              │
          ▼                           ▼                              │
┌────────────────────────────────────────────────────────────────────┴────┐
│ L3: DATA, STATE & PUB/SUB BACKBONE [MANDATORY]                          │
│ PostgreSQL (Pooler) │ Redis Cluster (Locks/Cache/Streams) │ Vector DB   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Technology Stack Selection Matrix
* **Runtime & Framework** **`[ACCORDING TO PS]`**:
  * **Python (FastAPI + Uvicorn/Gunicorn + Pydantic v2 + SQLAlchemy 2.0 Async)**: Select when the Problem Statement is heavily skewed toward AI/ML pipelines, data science, complex PDF/document parsing, or direct Python SDK orchestration (LangGraph, LlamaIndex, PyTorch).
  * **Node.js / Bun / TypeScript (Fastify / NestJS / Hono + Zod + Prisma/Drizzle)**: Select when the Problem Statement prioritizes full-stack TypeScript monorepo unified types (tRPC/GraphQL), ultra-high I/O concurrency, or isomorphic shared validation with a Next.js/React frontend.
* **Polyglot Hybrid Approach** **`[ACCORDING TO PS]`**: Use Node.js/Go at the API & Streaming Gateway layer and Python microservices/workers for heavy AI/embedding queues.
* **Strict Type Safety & Runtime Validation** **`[MANDATORY]`**: Regardless of stack, 100% of ingress parameters, headers, query strings, bodies, and egress responses must pass through compiled schema validators (Pydantic v2 in Rust-core or Zod/TypeBox).

---

## 2. API Gateway & Edge Security Layer

The API Gateway is the single point of ingress. It decouples public network exposure from internal service topology.

### 2.1 Edge & Transport Hardening
* **TLS Termination & HTTP/2 + HTTP/3 (QUIC)** **`[MANDATORY]`**: Enforce TLS 1.3 minimum. Enable HTTP/2 multiplexing and HTTP/3 to eliminate head-of-line blocking, especially critical when streaming concurrent SSE connections.
* **Strict CORS Policy** **`[MANDATORY]`**: Never use `Access-Control-Allow-Origin: *` on authenticated routes. Explicitly whitelist frontend origins, configure `Access-Control-Max-Age: 86400` to cache preflight `OPTIONS` requests, and expose custom headers (`X-Request-ID`, `RateLimit-*`).
* **Payload Size & Compression Governance** **`[MANDATORY]`**:
  * Enforce strict body size limits at the gateway (e.g., $1\text{ MB}$ for JSON payloads) to prevent OOM (Out-Of-Memory) Denial of Service attacks.
  * Direct large binary uploads (PDFs, videos, datasets) away from the API core using **Presigned Object Storage URLs (AWS S3 / Cloudflare R2)** **`[MANDATORY]`**.
  * Enable Brotli (`br`) and Gzip compression for static/JSON payloads, but **explicitly disable compression buffering (`X-Accel-Buffering: no`)** on SSE streaming routes.
* **Security Headers (Helmet / Custom Middleware)** **`[MANDATORY]`**: Inject `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and strict `Content-Security-Policy` headers.

### 2.2 Authentication (AuthN), Authorization (AuthZ) & Multi-Tenancy
* **Zero-Trust Token Verification** **`[MANDATORY]`**:
  * Validate short-lived Stateless JWTs ($T_{\text{exp}} \le 15\text{ minutes}$) using asymmetric keys (`RS256` or `EdDSA`) verified via cached JWKS (JSON Web Key Sets), paired with rotating HttpOnly, Secure, SameSite Refresh Tokens.
  * Support programmatic **API Keys** **`[ACCORDING TO PS]`**: If the PS requires developer API access or webhook integrations, store API keys hashed via `SHA-256` or `Argon2id` with a recognizable prefix (e.g., `sk_live_...`) for secret scanning.
* **Role-Based & Attribute-Based Access Control (RBAC / ABAC)** **`[MANDATORY]`**: Enforce permission checks at the route decorator/middleware level *and* row-level security (RLS) or tenant-ID scoping at the data access layer.
* **Auth Provider & Identity Schema** **`[ACCORDING TO PS]`**: Whether the system uses OAuth2 social logins, Enterprise SAML/OIDC, Web3 wallet signatures, or custom email/password depends on the Problem Statement.

### 2.3 API Paradigm & Versioning
* **URI or Header API Versioning** **`[MANDATORY]`**: Prefix all routes with `/api/v1/...` or enforce `Accept-Version` headers so breaking contract changes never crash active frontend clients.
* **REST vs. GraphQL vs. gRPC Selection** **`[ACCORDING TO PS]`**:
  * **REST (OpenAPI 3.1)**: Default **`[MANDATORY]`** baseline for public endpoints, webhooks, health checks, file uploads, and SSE streams.
  * **GraphQL (Apollo / Strawberry)**: Use **`[ACCORDING TO PS]`** when the frontend requires complex, deeply nested relational graph queries with client-driven field selection. *If GraphQL is used, Query Depth Limiting, Query Complexity Cost Analysis, and Persisted Queries become **`[MANDATORY]`** to prevent nested DoS attacks.*

---

## 3. Typed API Contract & Atomic Idempotency Layer

Network connections are inherently unreliable. Mobile clients drop connections, browsers retry timed-out requests, and webhook senders deliver at-least-once events. Without strict schemas and idempotency, retries cause duplicate charges, double-spawned AI agents, and corrupted state.

### 3.1 Strict Schema Validation & Serialization (Pydantic v2 / Zod)
* **Ingress Sanitization & Coercion Rules** **`[MANDATORY]`**:
  * Strip unknown fields (`extra="forbid"` in Pydantic or `.strict()` in Zod) to prevent Mass Assignment vulnerabilities.
  * Validate string bounds (min/max length, regex patterns, trimmed whitespace), numeric bounds, and UUID/ULID formats before executing a single line of business logic.
* **Egress Serialization & Data Masking** **`[MANDATORY]`**: Never return raw ORM/database models directly to the client. Map every response through an explicit Egress Schema to guarantee internal fields (`password_hash`, `internal_cost`, `deleted_at`) never leak.
* **Domain Data Models & Business Validation Rules** **`[ACCORDING TO PS]`**: The exact entity fields (e.g., Healthcare HIPAA records, FinTech ledger entries, E-commerce SKUs, EdTech rubrics) are defined strictly according to the Problem Statement.
* **UI/Theme Metadata Synchronization** **`[ACCORDING TO PS]`**: When the Problem Statement requires dynamic theming, white-labeling, or server-driven UI states, expose strongly typed configuration endpoints (e.g., `/api/v1/tenant/theme-config`) with ETag caching.

### 3.2 Standardized Error Contract (RFC 7807 / RFC 9457 Problem Details)
* **Unified Error Envelope** **`[MANDATORY]`**: Every `4xx` and `5xx` error across the entire API Gateway, Auth Layer, Rate Limiter, and Business Core must return a deterministic JSON structure so the frontend can render rich, toast/inline feedback seamlessly:
```json
{
  "type": "https://api.yourdomain.com/errors/validation-failed",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "The request payload failed schema validation.",
  "instance": "/api/v1/agents/execute",
  "request_id": "req_01HV8X9Z2P4M7K8N9Q0R1S2T3U",
  "timestamp": "2026-11-13T17:15:00.000Z",
  "errors": [
    {
      "field": "body.max_tokens",
      "code": "number_too_large",
      "message": "Value must be less than or equal to 8192."
    }
  ]
}
```

### 3.3 Atomic Idempotency State Machine
* **Idempotency-Key Enforcement** **`[MANDATORY]`**: All state-mutating endpoints (`POST`, `PATCH`, `PUT` with non-idempotent side effects such as payments, job creation, agent triggers, or email dispatches) must require or support an `Idempotency-Key: <UUIDv4/ULID>` HTTP header.
* **Payload Fingerprinting** **`[MANDATORY]`**: Compute a cryptographic hash of the incoming request payload:
  $$H_{\text{payload}} = \text{SHA-256}(\text{Method} \parallel \text{Path} \parallel \text{TenantID} \parallel \text{CanonicalJSON(Body)})$$
  If a client reuses an `Idempotency-Key` with a *different* request body ($H_{\text{payload}}^{(1)} \neq H_{\text{payload}}^{(2)}$), immediately reject with **`422 Unprocessable Entity` (Idempotency Key Payload Mismatch)**.
* **Distributed Lock & State Transitions (Redis + RDBMS)** **`[MANDATORY]`**:
  1. **Lookup & Atomic Lock (`SET NX EX`)**: Execute an atomic Redis Lua script checking key `idemp:{tenant_id}:{idempotency_key}`.
  2. **State 1: `IN_PROGRESS`**: If the key does not exist, set state to `IN_PROGRESS` with a short lock TTL (e.g., $60\text{s}$) and proceed to execute the handler. If a concurrent duplicate request arrives while `IN_PROGRESS`, return **`409 Conflict`** (with `Retry-After: 2`) or hold the connection via pub/sub until completion.
  3. **State 2: `COMPLETED`**: Once the controller finishes, store the HTTP status code, response headers, and serialized JSON response body in Redis with a retention TTL of $24\text{ hours}$ (`86400s`). Subsequent retries with the same key immediately return the cached response with header `X-Idempotent-Replayed: true`.
  4. **State 3: `FAILED_RETRYABLE` vs. `FAILED_TERMINAL`**:
     * If an unhandled `5xx` network/database transient error occurs, **delete the idempotency key** so the client can safely retry.
     * If a deterministic `4xx` validation error occurs, cache the `4xx` response so repeated bad requests fail fast without hitting downstream databases.

---

## 4. Multi-Tier Rate Limiting & Quota Governance

Modern web applications—especially those integrating LLMs, vector searches, and heavy background processing—cannot rely on a single global requests-per-minute (RPM) counter. They require a **Multi-Tier Defense-in-Depth Rate Limiting Architecture** that protects both network bandwidth and financial/compute budgets.

### 4.1 The 4 Tiers of Traffic & Cost Governance

| Tier | Scope | Algorithm | Storage / Engine | Purpose | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Edge / L7 Network** | IP Address / ASN / Geo | Token Bucket / Fixed Block | Cloudflare / AWS WAF | Absorb volumetric DDoS, credential stuffing, and botnet scraping before hitting origin servers. | **`[MANDATORY]`** |
| **Tier 2: API Gateway RPM** | User ID / API Key / IP | Sliding Window Log or Counter | Redis Cluster (Lua) | Prevent a single noisy tenant from starving API worker threads or DB connection pools. | **`[MANDATORY]`** |
| **Tier 3: Concurrency Limiter** | User ID / Tenant ID | Active Semaphore Counter | Redis (`INCR`/`DECR` + TTL) | Limit simultaneous in-flight requests (e.g., max $3$ active SSE streams or PDF jobs at once). | **`[MANDATORY]`** |
| **Tier 4: Compute / Token Quota** | Tenant / Subscription Tier | Weighted Token Bucket + Daily Ledger | Redis + PostgreSQL Ledger | Cap LLM tokens (input + output), vector embeddings, or credits per minute/day/month. | **`[ACCORDING TO PS]`** *(Quotas)* / **`[MANDATORY]`** *(Mechanism)* |

### 4.2 Mathematical Models & Algorithms

#### A. Sliding Window Counter (Tier 2 - High Accuracy, Low Memory) **`[MANDATORY]`**
Pure Sliding Window Logs store every timestamp in a Redis Sorted Set (`ZSET`), which consumes excessive memory at high RPM. Instead, use the **Sliding Window Counter approximation** across the previous window $W_{t-1}$ and current window $W_t$ of duration $T_w$:
Let $\Delta t$ be the elapsed time in the current window $W_t$, where $0 \le \frac{\Delta t}{T_w} < 1$. The estimated request count $R_{\text{est}}$ is:
$$R_{\text{est}} = C_{\text{prev}} \times \left(1 - \frac{\Delta t}{T_w}\right) + C_{\text{curr}}$$
If $R_{\text{est}} + 1 > L_{\text{max}}$, the request is rejected with HTTP `429 Too Many Requests`.

#### B. Weighted Token Bucket (Tier 4 - Burst + Sustained Compute/LLM Quotas) **`[MANDATORY]`**
Let a bucket have capacity $B_{\text{max}}$ and refill rate $r$ tokens per second. At timestamp $t_{\text{now}}$, given last update timestamp $t_{\text{last}}$ and remaining tokens $B_{\text{prev}}$:
$$B_{\text{available}} = \min\left(B_{\text{max}}, \; B_{\text{prev}} + (t_{\text{now}} - t_{\text{last}}) \times r\right)$$
For an operation costing $W_{\text{cost}}$ tokens (e.g., estimated prompt tokens), allow iff $B_{\text{available}} \ge W_{\text{cost}}$, updating $B_{\text{new}} = B_{\text{available}} - W_{\text{cost}}$.

### 4.3 Pre-Flight Reservation vs. Post-Flight Token Reconciliation (AI/LLM Specific) **`[MANDATORY]`**
When limiting LLM or compute tokens, the exact output token count is unknown until generation finishes.
1. **Pre-Flight Reservation**: Estimate input tokens ($T_{\text{in}}$) using a fast tokenizer (`tiktoken` / character heuristic) plus a reserved buffer for expected output ($T_{\text{buffer}}$, e.g., $\min(\text{max\_tokens}, 1024)$). Deduct $W_{\text{reserve}} = T_{\text{in}} + T_{\text{buffer}}$ atomically from Redis before invoking the model.
2. **Post-Flight Reconciliation**: Once the stream or job completes with actual usage $T_{\text{actual}} = T_{\text{in}} + T_{\text{out}}$, issue an atomic refund/adjustment to the Redis bucket and asynchronously append an immutable record to the PostgreSQL usage ledger:
   $$\Delta B = W_{\text{reserve}} - T_{\text{actual}}$$

### 4.4 Standardized Rate Limit Response Headers (IETF Draft / Industry Standard) **`[MANDATORY]`**
Every API response must inject transparent quota telemetry so the frontend UI can display usage bars and SDKs can auto-throttle:
* `RateLimit-Limit`: Maximum requests/tokens allowed in the window.
* `RateLimit-Remaining`: Remaining requests/tokens in the current window.
* `RateLimit-Reset`: Seconds (or Unix epoch) until the quota resets.
* `Retry-After`: Mandatory on `429 Too Many Requests` responses, specifying exact backoff seconds.
* **Custom Quota Tiers (Free, Pro, Enterprise, Internal)** **`[ACCORDING TO PS]`**: Specific numeric thresholds (e.g., 20 RPM vs. 1000 RPM, 50k daily tokens vs. 10M daily tokens) are configured via environment/database policy tables according to the Problem Statement.

---

## 5. Asynchronous Job Queues & Distributed Background Workers

Any operation taking longer than $250\text{ ms}$—or depending on unpredictable external latency (PDF OCR, chunking, embedding generation, multi-step AI agent loops, video transcoding, bulk emails)—**must never block the HTTP request-response cycle**.

### 5.1 Queue Broker & Worker Topology
* **Broker Architecture** **`[MANDATORY]`**:
  * **BullMQ (Node.js) or Celery/Dramatiq/Taskiq (Python) backed by Redis**: Ideal for low-latency job dispatch, complex job states, parent-child job flows (DAGs), and progress events. *Must configure Redis with `appendonly yes` (AOF persistence) and `maxmemory-policy noeviction` on the queue instance so jobs are never silently dropped.*
  * **AWS SQS + Lambda / ECS Workers**: Use when massive serverless auto-scaling and managed durability are prioritized over sub-millisecond dispatch.
* **Strict Queue Segregation (Bulkhead Pattern)** **`[MANDATORY]`**: Never push fast interactive jobs and slow batch jobs into the same queue. Partition into dedicated queues with independent worker pools:
  1. `queue:critical:realtime` (Fast webhooks, auth emails, quick tool calls — SLA $< 2\text{s}$)
  2. `queue:ai:agents` (Long-running agentic workflows, LLM orchestration — SLA $10\text{s} - 5\text{m}$)
  3. `queue:ingestion:heavy` (PDF parsing, OCR, chunking, vector embeddings — CPU/Memory intensive)
  4. `queue:maintenance:batch` (Nightly cleanups, analytics rollups, report exports)

### 5.2 The Transactional Outbox Pattern **`[MANDATORY]`**
A classic distributed systems bug occurs when an API route commits a record to PostgreSQL and then crashes before publishing the job to Redis/SQS (or publishes to Redis before the DB transaction commits, causing the worker to read non-existent data).
* **Implementation**:
  1. Inside a single ACID database transaction, insert the domain entity (e.g., `Document` status = `PENDING`) **and** insert a serialized job record into an `outbox_events` table.
  2. A lightweight relay process (via PostgreSQL `LISTEN/NOTIFY`, logical replication CDC, or a high-frequency polling worker with `SELECT ... FOR UPDATE SKIP LOCKED`) reads uncommitted outbox rows, pushes them to Redis/SQS, and marks them `PROCESSED`.

### 5.3 Fault Tolerance, Exponential Backoff with Jitter & Dead Letter Queues (DLQ)
* **Idempotent Worker Execution** **`[MANDATORY]`**: Queue brokers guarantee *at-least-once* delivery, never *exactly-once*. Every background worker must check if the job step has already been applied (using deterministic chunk hashes or state flags) before mutating external state.
* **Exponential Backoff with Full Jitter** **`[MANDATORY]`**: When downstream APIs (OpenAI, Anthropic, external webhooks) fail with transient errors (`429`, `502`, `503`, `504`), workers must not retry at fixed intervals (which causes a Thundering Herd). Calculate sleep duration $T_{\text{sleep}}$ for retry attempt $k$:
  $$T_{\text{sleep}} = \text{random}\left(0, \; \min\left(T_{\text{max}}, \; T_{\text{base}} \times 2^{k}\right)\right)$$
* **Dead Letter Queue (DLQ) & Poison Pill Isolation** **`[MANDATORY]`**: After $N_{\text{max}}$ failed attempts (typically $3$ to $5$), move the job payload, stack trace, and context metadata to a persistent DLQ table/queue, transition the database entity state to `FAILED`, emit an alert metric, and notify the user via the real-time stream.
* **Heartbeat & Stalled Job Recovery** **`[MANDATORY]`**: Workers running long PDF parsing or agent loops must emit periodic lock extensions (heartbeats) every $10\text{s}$. If a worker container is OOM-killed (SIGKILL), the broker detects the expired lock and safely re-queues or fails the stalled job.

### 5.4 Heavy Ingestion & Agent Orchestration Pipelines
* **Document / PDF Parsing & Embedding Pipeline** **`[ACCORDING TO PS]`** *(Domain logic)* / **`[MANDATORY]`** *(Pipeline Architecture)*:
  1. **Direct-to-S3 Ingestion**: Client requests presigned URL $\rightarrow$ uploads file directly to S3/R2 $\rightarrow$ S3 event or client callback triggers ingestion job.
  2. **Streamed Extraction & Malware/MIME Verification**: Worker validates magic bytes (never trust file extensions), streams pages to avoid loading $500\text{ MB}$ PDFs entirely into RAM, and performs layout-aware extraction (tables, headers, OCR fallback).
  3. **Semantic Chunking & Batched Embeddings**: Split text into semantic chunks with overlap, generate deterministic chunk IDs ($\text{SHA-256}(\text{doc\_id} \parallel \text{chunk\_index} \parallel \text{text\_hash})$), batch embedding API requests, and upsert into the Vector DB (pgvector / Qdrant / Pinecone) idempotently.
* **Long-Running Agent State Checkpoints** **`[MANDATORY]`**: Multi-step agents must persist their state graph after every tool call so that if step 7 of 10 fails or requires Human-in-the-Loop (HITL) approval, execution resumes from step 7 rather than restarting from step 1 and burning duplicate tokens.

---

## 6. Real-Time Streaming Gateway (SSE & WebSockets)

Modern web experiences require immediate, granular visual feedback. Waiting $30\text{ seconds}$ for a spinner to resolve into a massive JSON response is unacceptable.

### 6.1 Protocol Selection: Server-Sent Events (SSE) vs. WebSockets

| Feature / Requirement | Server-Sent Events (SSE over HTTP/2) | WebSockets (`wss://`) | Classification |
| :--- | :--- | :--- | :--- |
| **Primary Use Case** | LLM token streaming, agent thought/tool step progression, live job progress bars, server notifications. | Collaborative canvas/whiteboards, multiplayer gaming, bi-directional voice/audio streaming, sub-50ms chat. | **`[MANDATORY]`** (Use SSE by default; WS when bi-directional needed) |
| **Firewall / Proxy Compatibility** | Native HTTP; passes effortlessly through corporate proxies, load balancers, and CDNs. | Requires HTTP `Upgrade` handshake; sensitive to sticky sessions and aggressive proxy timeouts. | Architectural Fact |
| **Auto-Reconnection** | Built into standard logic via `Last-Event-ID` header. | Must be manually implemented in client-side state machines with exponential backoff. | **`[MANDATORY]`** |
| **Client-to-Server Commands** | Sent via standard typed `POST` requests (e.g., `/api/v1/runs/{id}/cancel`). | Sent over the same full-duplex socket frame. | **`[MANDATORY]`** |

### 6.2 Distributed Coordination via Redis Pub/Sub & Redis Streams
Because API Gateway servers are horizontally scaled behind a Load Balancer, the worker generating LLM tokens (Server B) is rarely the same process holding the open HTTP/SSE connection with the user's browser (Server A).
* **Why Pure Redis Pub/Sub is Not Enough** **`[MANDATORY]`**: Standard Redis `PUBLISH`/`SUBSCRIBE` is fire-and-forget. If a user's Wi-Fi drops for $2\text{ seconds}$ or they refresh the page mid-generation, all tokens emitted during that gap are permanently lost.
* **The Hybrid Redis Streams (`XADD` / `XREAD`) Architecture** **`[MANDATORY]`**:
  1. Background workers emit events to a bounded **Redis Stream** (`stream:run:{run_id}`) using `XADD stream:run:{run_id} MAXLEN ~ 2000 * payload ...` and set a stream expiration TTL ($1\text{ hour}$).
  2. Each entry in a Redis Stream receives a monotonic timestamp-sequence ID (e.g., `1763054100123-0`).
  3. The SSE Gateway streams each entry to the client with `id: 1763054100123-0`.
  4. **Seamless Resume on Reconnect**: If the browser disconnects and reconnects sending `Last-Event-ID: 1763054100123-0`, the SSE Gateway simply executes `XREAD BLOCK 5000 STREAMS stream:run:{run_id} 1763054100123-0`, instantly replaying every missed token and continuing the live stream without dropping a single character!

### 6.3 Structured Real-Time Event Protocol **`[MANDATORY]`**
Never stream raw, unstructured text strings. Define a strict discriminated union event envelope so the frontend UI can render rich intermediate states (thinking accordions, tool execution badges, citation pills, progress percentages):
```text
id: 1763054100101-0
event: run.status
data: {"run_id":"run_99","status":"started","timestamp":1763054100101}

id: 1763054100250-0
event: agent.tool_call
data: {"step_id":"st_1","tool":"vector_search","status":"running","input":{"query":"revenue Q3"}}

id: 1763054100890-0
event: agent.tool_result
data: {"step_id":"st_1","tool":"vector_search","status":"completed","duration_ms":640,"citations":[{"doc_id":"doc_4","page":12}]}

id: 1763054101050-0
event: llm.token.delta
data: {"delta":"Based on the Q3 financial report"}

id: 1763054105000-0
event: run.completed
data: {"run_id":"run_99","usage":{"input_tokens":1250,"output_tokens":340},"cost_usd":0.0042}
```

### 6.4 Stream Lifecycle, Backpressure & Cancellation Governance
* **Heartbeat Keep-Alives** **`[MANDATORY]`**: Load balancers (AWS ALB, Cloudflare, Nginx) aggressively terminate idle connections after $60\text{s}$. The SSE gateway must emit an SSE comment heartbeat (`: ping - 2026-11-13T17:15:00Z\n\n`) every $15\text{ seconds}$ during long tool calls.
* **Client Disconnect & Abort Propagation** **`[MANDATORY]`**: If a user clicks "Stop Generating" or closes the tab, the API must not continue burning expensive LLM tokens in the background (unless explicitly configured as a detached background run).
  * Expose a `POST /api/v1/runs/{run_id}/cancel` endpoint that publishes a `CANCEL` signal to `channel:control:{run_id}`.
  * The background worker listens to this control channel and triggers an immediate `AbortController.abort()` / `asyncio.Task.cancel()` on the active LLM stream, saving partial output to the database.
* **Backpressure Handling** **`[MANDATORY]`**: Coalesce ultra-high-frequency token emissions into $20\text{ ms} - 40\text{ ms}$ micro-batches ($\sim 25 - 50\text{ fps}$) if network socket write buffers fill up, preventing both server memory bloat and browser React/DOM re-render thrashing.

---

## 7. Cross-Cutting Infrastructure: Resilience, Observability & Frontend Synergy

Per the core mandate—**anything that improves the web application is `[MANDATORY]`**—the following architectural pillars must be woven into the Backend Core.

### 7.1 Outbound Resilience (LLM & Third-Party API Proxy)
* **Circuit Breakers & Fallback Routing** **`[MANDATORY]`**: Wrap external dependencies (OpenAI, Anthropic, Stripe, OCR providers) in a state-tracked Circuit Breaker (`CLOSED` $\rightarrow$ `OPEN` $\rightarrow$ `HALF_OPEN`). If a primary model provider experiences a $>25\%$ failure rate over $30\text{s}$, automatically route requests to a fallback provider/model without failing the user request.
* **Semantic & Exact Response Caching** **`[MANDATORY]`**: Cache deterministic embedding queries and idempotent tool lookups in Redis to eliminate redundant third-party API latency and cost.

### 7.2 Observability, Distributed Tracing & Auditability
* **Distributed Correlation IDs (`X-Request-ID` / W3C `traceparent`)** **`[MANDATORY]`**: Generate a globally unique trace ID at the API Gateway ingress, inject it into every structured log line, pass it into Redis/SQS job metadata, include it in SSE event envelopes, and return it in HTTP error responses.
* **OpenTelemetry (OTel) Instrumentation** **`[MANDATORY]`**: Trace spans across HTTP route $\rightarrow$ DB query $\rightarrow$ Queue enqueue $\rightarrow$ Worker execution $\rightarrow$ External LLM call.
* **Structured JSON Logging with PII Redaction** **`[MANDATORY]`**: Never use plain-text `print()` or `console.log()` in production. Emit structured JSON logs with automatic masking of `Authorization` headers, API keys, passwords, and sensitive personal data.
* **Deep Health Check Endpoints** **`[MANDATORY]`**:
  * `GET /health/live` (Liveness Probe): Immediate `200 OK` verifying the event loop is responsive.
  * `GET /health/ready` (Readiness Probe): Verifies active connectivity to PostgreSQL, Redis Cluster, and Queue Brokers before allowing the load balancer to route traffic to the instance.
* **Graceful Shutdown (`SIGTERM` Handling)** **`[MANDATORY]`**: On deployment rollouts, stop accepting new HTTP requests, notify connected SSE/WebSocket clients to reconnect cleanly to another node, wait up to $30\text{s}$ for in-flight requests and active worker steps to checkpoint, and close DB pools cleanly.

### 7.3 Backend Support for Frontend Excellence & Theme/UX
* **Optimistic UI Support & Deterministic Client IDs** **`[MANDATORY]`**: Allow clients to pass client-generated UUIDs/ULIDs or echo back correlation metadata so the frontend can render optimistic UI updates instantaneously without layout shift.
* **Cursor-Based Pagination & Filtering** **`[MANDATORY]`**: Never use `OFFSET` pagination on large tables (which degrades to $O(N)$ full scans). Enforce keyset/cursor-based pagination (`?cursor=eyJpZCI6...&limit=25`) with deterministic ordering.
* **Theme, Branding & Domain Presentation Payloads** **`[ACCORDING TO PS]`**: While the backend architecture is universal, any user-facing templates (transactional emails, generated PDF reports, dynamic widget configurations, domain-specific status badges, or white-label theme palettes) must be parameterized according to the Problem Statement's aesthetic and functional identity.

---

## 8. Master Classification Matrix: `[MANDATORY]` vs. `[ACCORDING TO PS]`

Use this checklist before initializing or reviewing any backend repository:

| Architectural Component | `[MANDATORY]` (Universal Standard — Always Implement) | `[ACCORDING TO PS]` (Problem Statement Dependent — Adapt to Domain) |
| :--- | :--- | :--- |
| **API Layer & Contracts** | Strict Pydantic/Zod validation, RFC 7807 error envelopes, `/api/v1` versioning, OpenAPI/Swagger auto-generation, Cursor pagination. | Specific REST vs. GraphQL route hierarchy, custom domain entities, business logic state transitions. |
| **Idempotency** | `Idempotency-Key` header support on all mutations, SHA-256 payload fingerprinting, Redis `IN_PROGRESS`/`COMPLETED` lock state machine. | Retention window overrides for domain compliance (e.g., 24h standard vs. 30d financial ledger audit). |
| **Rate Limiting** | Multi-tier architecture (WAF IP + Redis Sliding Window RPM + Concurrency Limiter + Token Bucket), atomic Lua execution, `RateLimit-*` & `Retry-After` headers. | Exact numerical limits per tier (Free vs. Pro RPM, daily token budgets, custom enterprise bypass rules). |
| **Async Job Queues** | Dedicated priority queues (Critical, AI, Heavy Ingestion), Transactional Outbox Pattern, Exponential Backoff with Full Jitter, DLQ, Heartbeats. | Specific worker pipelines (e.g., PDF OCR vs. audio transcription vs. code execution sandboxes vs. e-commerce fulfillment). |
| **Real-Time Streaming** | SSE over HTTP/2 with `X-Accel-Buffering: no`, Redis Streams (`XADD`/`XREAD`) for `Last-Event-ID` replayability, $15\text{s}$ heartbeats, `/cancel` abort propagation. | Specific event types in the stream union (e.g., LLM token deltas vs. live stock tickers vs. multiplayer cursor coordinates). |
| **Security & Storage** | TLS 1.3, strict CORS, JWT + Refresh rotation, RBAC middleware, Presigned S3/R2 URLs for file uploads, PII log redaction. | OAuth providers, HIPAA/SOC2/GDPR data residency rules, multi-tenant schema isolation model (shared table vs. schema-per-tenant). |
| **Theme & UX Synergy** | Sub-100ms cached read responses, optimistic UI metadata, rich progress telemetry for frontend skeleton/progress states. | Brand theme tokens in emails/exports, custom domain terminology, persona/prompt templates. |

---

## 9. Reference Implementation Blueprints (Production Code Patterns)

The following reference patterns demonstrate how to implement the most complex parts of this architecture without race conditions.

### 9.1 Atomic Multi-Tier Rate Limiter & Token Bucket (Redis Lua Script) **`[MANDATORY]`**
Executing rate limiting via `GET` followed by `SET` in application code creates a race condition under concurrent load. Always execute rate checks via an atomic Redis Lua script (`EVALSHA`):

```lua
-- atomic_multi_tier_limiter.lua
-- KEYS[1]: Sliding Window RPM Key (e.g., "rl:rpm:{tenant_id}:{window_id}")
-- KEYS[2]: Previous Window RPM Key
-- KEYS[3]: Token Bucket Key (e.g., "rl:tokens:{tenant_id}")
-- ARGV[1]: Current Timestamp (ms)
-- ARGV[2]: Window Size (ms, e.g., 60000)
-- ARGV[3]: Max RPM Limit
-- ARGV[4]: Bucket Max Capacity (Tokens)
-- ARGV[5]: Bucket Refill Rate (Tokens per ms)
-- ARGV[6]: Requested Token Cost (W_reserve)

local now_ms = tonumber(ARGV[1])
local window_ms = tonumber(ARGV[2])
local max_rpm = tonumber(ARGV[3])
local bucket_max = tonumber(ARGV[4])
local refill_rate = tonumber(ARGV[5])
local token_cost = tonumber(ARGV[6])

-- 1. Tier 2: Sliding Window Counter RPM Check
local curr_count = tonumber(redis.call("GET", KEYS[1]) or "0")
local prev_count = tonumber(redis.call("GET", KEYS[2]) or "0")
local elapsed_in_window = now_ms % window_ms
local weight = (window_ms - elapsed_in_window) / window_ms
local estimated_rpm = math.floor(prev_count * weight + curr_count)

if (estimated_rpm + 1) > max_rpm then
    local retry_after_ms = window_ms - elapsed_in_window
    return {0, "RPM_EXCEEDED", max_rpm - estimated_rpm, math.ceil(retry_after_ms / 1000)}
end

-- 2. Tier 4: Compute / LLM Token Bucket Check
local bucket = redis.call("HMGET", KEYS[3], "tokens", "last_updated")
local available_tokens = tonumber(bucket[1])
local last_updated = tonumber(bucket[2])

if available_tokens == nil then
    available_tokens = bucket_max
    last_updated = now_ms
else
    local delta_ms = math.max(0, now_ms - last_updated)
    available_tokens = math.min(bucket_max, available_tokens + (delta_ms * refill_rate))
    last_updated = now_ms
end

if available_tokens < token_cost then
    local deficit = token_cost - available_tokens
    local retry_after_sec = math.ceil((deficit / refill_rate) / 1000)
    return {0, "TOKEN_QUOTA_EXCEEDED", math.floor(available_tokens), retry_after_sec}
end

-- 3. Commit Deductions Atomically
redis.call("INCR", KEYS[1])
redis.call("PEXPIRE", KEYS[1], window_ms * 2)

local new_tokens = available_tokens - token_cost
redis.call("HMSET", KEYS[3], "tokens", new_tokens, "last_updated", last_updated)
redis.call("PEXPIRE", KEYS[3], 86400000) -- 24h TTL

return {1, "ALLOWED", max_rpm - (estimated_rpm + 1), math.floor(new_tokens)}
```

### 9.2 FastAPI Typed Endpoint + Atomic Idempotency + Replayable Redis Stream SSE **`[MANDATORY]`**
Below is the reference Python (FastAPI + Pydantic v2 + Redis Async) implementation combining strict typing, idempotency locking, background job dispatch, and replayable SSE streaming:

```python
import asyncio
import hashlib
import json
import time
from typing import AsyncGenerator, Literal, Optional
from fastapi import FastAPI, Header, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict, Field
import redis.asyncio as redis

app = FastAPI(title="Enterprise Backend Core & Streaming Gateway", version="1.0.0")
redis_client = redis.from_url("redis://localhost:6379", decode_responses=True)

# ---------------------------------------------------------------------------
# 1. STRICT TYPED SCHEMAS (Pydantic v2) [MANDATORY structure / PS fields]
# ---------------------------------------------------------------------------
class AgentRunRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    prompt: str = Field(..., min_length=1, max_length=32000)
    document_ids: list[str] = Field(default_factory=list, max_length=20)
    max_tokens: int = Field(default=2048, ge=64, le=16384)
    stream: bool = Field(default=True)

class AgentRunAcceptedResponse(BaseModel):
    run_id: str
    status: Literal["QUEUED", "IN_PROGRESS", "COMPLETED"]
    stream_url: str
    idempotent_replay: bool = False

# ---------------------------------------------------------------------------
# 2. ATOMIC IDEMPOTENCY LAYER [MANDATORY]
# ---------------------------------------------------------------------------
async def enforce_idempotency(
    tenant_id: str,
    idempotency_key: str,
    payload_dict: dict,
) -> tuple[bool, Optional[dict]]:
    payload_bytes = json.dumps(payload_dict, sort_keys=True).encode("utf-8")
    payload_hash = hashlib.sha256(payload_bytes).hexdigest()
    redis_key = f"idemp:{tenant_id}:{idempotency_key}"

    existing_raw = await redis_client.get(redis_key)
    if existing_raw:
        record = json.loads(existing_raw)
        if record["payload_hash"] != payload_hash:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Idempotency-Key reused with a different request payload.",
            )
        if record["state"] == "IN_PROGRESS":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A request with this Idempotency-Key is currently in progress.",
                headers={"Retry-After": "2"},
            )
        return True, record["response"]

    # Acquire atomic lock for 60s while scheduling job
    initial_record = json.dumps({
        "state": "IN_PROGRESS",
        "payload_hash": payload_hash,
        "response": None,
    })
    acquired = await redis_client.set(redis_key, initial_record, nx=True, ex=60)
    if not acquired:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Concurrent duplicate request.")
    return False, None

async def finalize_idempotency(
    tenant_id: str, idempotency_key: str, payload_dict: dict, response_data: dict
) -> None:
    payload_bytes = json.dumps(payload_dict, sort_keys=True).encode("utf-8")
    payload_hash = hashlib.sha256(payload_bytes).hexdigest()
    redis_key = f"idemp:{tenant_id}:{idempotency_key}"
    completed_record = json.dumps({
        "state": "COMPLETED",
        "payload_hash": payload_hash,
        "response": response_data,
    })
    await redis_client.set(redis_key, completed_record, ex=86400)  # 24h retention

# ---------------------------------------------------------------------------
# 3. MUTATION ENDPOINT DISPATCHING TO ASYNC WORKER QUEUE [MANDATORY]
# ---------------------------------------------------------------------------
@app.post(
    "/api/v1/agents/runs",
    response_model=AgentRunAcceptedResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def create_agent_run(
    body: AgentRunRequest,
    idempotency_key: str = Header(..., alias="Idempotency-Key", min_length=16, max_length=128),
    x_tenant_id: str = Header(default="tenant_default", alias="X-Tenant-ID"),
):
    is_replay, cached_resp = await enforce_idempotency(
        x_tenant_id, idempotency_key, body.model_dump()
    )
    if is_replay and cached_resp:
        cached_resp["idempotent_replay"] = True
        return AgentRunAcceptedResponse(**cached_resp)

    run_id = f"run_{hashlib.sha1(f'{x_tenant_id}:{idempotency_key}'.encode()).hexdigest()[:16]}"
    response_payload = {
        "run_id": run_id,
        "status": "QUEUED",
        "stream_url": f"/api/v1/agents/runs/{run_id}/stream",
        "idempotent_replay": False,
    }

    # Enqueue job to Redis Stream / Queue for Celery or BullMQ Worker
    await redis_client.xadd(
        "queue:ai:agents",
        {"run_id": run_id, "tenant_id": x_tenant_id, "payload": body.model_dump_json()},
    )
    await finalize_idempotency(x_tenant_id, idempotency_key, body.model_dump(), response_payload)
    return AgentRunAcceptedResponse(**response_payload)

# ---------------------------------------------------------------------------
# 4. REAL-TIME REPLAYABLE SSE STREAMING GATEWAY [MANDATORY]
# ---------------------------------------------------------------------------
async def sse_event_generator(
    request: Request, run_id: str, last_event_id: str
) -> AsyncGenerator[str, None]:
    stream_key = f"stream:run:{run_id}"
    cursor = last_event_id if last_event_id else "0-0"
    last_heartbeat = time.monotonic()

    while True:
        if await request.is_disconnected():
            break

        # Block up to 5000ms waiting for new tokens/tool steps from Redis Stream
        events = await redis_client.xread({stream_key: cursor}, count=50, block=5000)

        if events:
            for _, messages in events:
                for msg_id, fields in messages:
                    cursor = msg_id
                    event_type = fields.get("event", "message")
                    data_str = fields.get("data", "{}")
                    yield f"id: {msg_id}\nevent: {event_type}\ndata: {data_str}\n\n"

                    if event_type in ("run.completed", "run.failed", "run.cancelled"):
                        return

        # Emit heartbeat comment every 15 seconds to prevent ALB/Cloudflare idle drop
        now = time.monotonic()
        if now - last_heartbeat >= 15.0:
            yield f": heartbeat {int(time.time())}\n\n"
            last_heartbeat = now

@app.get("/api/v1/agents/runs/{run_id}/stream")
async def stream_agent_run(
    request: Request,
    run_id: str,
    last_event_id: Optional[str] = Header(default=None, alias="Last-Event-ID"),
):
    headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",  # Critical: Disables Nginx/Proxy response buffering
    }
    return StreamingResponse(
        sse_event_generator(request, run_id, last_event_id or "0-0"),
        headers=headers,
    )
```

---

## 10. Execution Protocol for Antigravity

When implementing a project using this blueprint, follow this exact sequence:
1. **Parse the Problem Statement (`[ACCORDING TO PS]`)**: Extract the domain entities, required third-party integrations, user roles, quota tiers, specific background workflows (e.g., PDF RAG vs. data scraping vs. media processing), and theme/UI state contracts.
2. **Scaffold the `[MANDATORY]` Core First**: Initialize the repository with strict schema validation (Pydantic/Zod), RFC 7807 error handling, Correlation ID middleware, Redis connection pools, and `/health` probes before writing domain routes.
3. **Wire the Multi-Tier Protection & Idempotency**: Attach the atomic Lua rate limiter and `Idempotency-Key` middleware to the gateway router.
4. **Decouple Heavy Compute into Queues**: Ensure zero blocking I/O or LLM orchestration happens synchronously inside HTTP controllers; route all heavy workloads through the Outbox/Queue worker pipeline and stream intermediate telemetry back via Redis Streams + SSE.