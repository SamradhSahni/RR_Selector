# Enterprise Blueprint: Admin Backoffice, Full-Stack & LLMOps Observability, Analytics & CI/CD Pipelines

> **System Role & Antigravity Agent Directive:**
> This document serves as the **Authoritative Architectural Knowledge Base & Implementation Specification** for building, instrumenting, operating, and deploying a high-reliability, AI-native, graphics-capable (WebGL/Canvas) modern web platform.
>
> **Classification Legend (Strict Enforcement):**
> * **`[MANDATORY]`**: Non-negotiable engineering, security, observability, performance, reliability, or UX capability. Anything that improves web stability, developer velocity, operational safety, debuggability, or user experience falls under **`[MANDATORY]`**—never treat these as optional.
> * **`[ACCORDING TO PS]`**: Driven by the specific **Problem Statement (PS)**, business domain, target industry, or brand identity (e.g., visual theme, color palette, domain-specific RBAC roles, business quota limits, custom LLM evaluation datasets, and industry-specific compliance rules). Whenever you encounter **`[ACCORDING TO PS]`**, inspect the project's active Problem Statement to inject the exact domain values while preserving the surrounding **`[MANDATORY]`** architecture.

---

## 1. Internal Admin & Operations Backoffice Portal

The Internal Admin & Ops Portal is the mission-control plane for customer support, trust & safety, FinOps, and site reliability engineering (SRE). It must be isolated from public user routes, hardened with zero-trust access controls, and designed for high-density operational workflows.

### 1.1 Authentication, Authorization (RBAC/ABAC) & Zero-Trust Security
* **Zero-Trust Identity & MFA Enforcement `[MANDATORY]`**:
  * Require hardware-backed WebAuthn/Passkeys or Phishing-Resistant MFA for all admin portal sessions.
  * Enforce short-lived JWT access tokens ($\le 15\text{ minutes}$) paired with rotated refresh tokens bound to device fingerprint and IP subnet.
* **Step-Up Authentication (Sudo Mode) `[MANDATORY]`**:
  * Destructive or sensitive operations (e.g., user impersonation, production feature flag kill-switches, manual quota overrides, GDPR hard-deletes, guardrail overrides) must trigger a re-authentication challenge valid for $5\text{ minutes}$ and require a mandatory `reason_code` + ticket reference string.
* **Granular RBAC + ABAC Matrix `[MANDATORY]` Architecture / `[ACCORDING TO PS]` Role Definitions**:
  * Implement policy-based access control (e.g., CASL, Oso, or OpenFGA) evaluated at both the API gateway/middleware layer and UI component level.
  * **Standard Baseline Roles `[MANDATORY]`**: `SUPER_ADMIN`, `SRE_OPS`, `AI_SAFETY_REVIEWER`, `SUPPORT_AGENT`, `FINOPS_ANALYST`, `READ_ONLY_AUDITOR`.
  * **Domain-Specific Roles `[ACCORDING TO PS]`**: Custom organizational roles (e.g., `CLINICAL_REVIEWER` for healthcare, `COMPLIANCE_OFFICER` for fintech, `CURRICULUM_MODERATOR` for EdTech) defined by the Problem Statement.

### 1.2 Backoffice UI/UX, Information Density & Theme Architecture
* **Visual Theme, Brand Palette & Aesthetic Direction `[ACCORDING TO PS]`**:
  * The overarching color palette, typography scale, border radii, and domain aesthetic (e.g., neo-brutalist, clinical minimalism, dark-mode cyberpunk, enterprise slate) must adapt directly to the Problem Statement's design language.
* **High-Density Operational Ergonomics `[MANDATORY]`**:
  * Regardless of the PS theme, the Admin Portal must enforce WCAG AA contrast ratios ($\ge 4.5:1$), monospace rendering for IDs/hashes/tokens/metrics, and zero layout shift (`CLS = 0`).
  * **Global Command Palette (`Cmd/Ctrl + K`) `[MANDATORY]`**: Instant keyboard-driven navigation to jump to any `user_id`, `tenant_id`, `trace_id`, or `feature_flag_key`.
  * **Virtualized Data Grids `[MANDATORY]`**: Support server-side cursor pagination, multi-column sorting, URL-synced filter states (so support engineers can share filtered links), and CSV/Parquet export for datasets exceeding $100,000+$ rows.

### 1.3 User Support, Multi-Tenancy & Safe Impersonation
* **Unified 360-Degree Tenant & User Inspector `[MANDATORY]`**:
  * Single-pane view aggregating user profile, active sessions, organization/tenant hierarchy, current billing tier, real-time token consumption, recent PostHog session replays, recent Sentry exceptions, and LangSmith/Phoenix LLM trace links.
* **Cryptographically Audited User Impersonation ("Act As User") `[MANDATORY]`**:
  * Support engineers must be able to view the application exactly as a target user sees it to reproduce bugs (including WebGL scene states and workspace configurations).
  * **Read-Only Default `[MANDATORY]`**: Impersonation sessions default to `READ_ONLY` mode (blocking `POST`/`PUT`/`PATCH`/`DELETE` mutations at the API middleware layer) unless explicitly elevated via Step-Up Auth.
  * **Visual Banner `[MANDATORY]`**: Render an un-dismissible, high-contrast warning banner at the top of the viewport displaying: `"IMPERSONATING: [user@domain.com] | Mode: READ-ONLY | Session Expires in 14:32 | [Exit]"`.
  * **Dual-Identity Token Claim `[MANDATORY]`**: The session JWT must carry both `sub` (target user ID) and `act.sub` (the admin's actual user ID) so every log, trace, and DB mutation records who actually performed the action.
* **Account Lifecycle & Privacy Operations `[MANDATORY]`**:
  * One-click session revocation (force logout across all devices), temporary account suspension with customizable user-facing lockout messaging, and automated GDPR/CCPA "Right to be Forgotten" cryptographic erasure + data portability export jobs.

### 1.4 Tenant Quota Management, Rate-Limiting & FinOps Controls
* **Real-Time Quota & Rate-Limit Engine `[MANDATORY]`**:
  * Backed by Redis Lua scripts (atomic Sliding Window or Token Bucket algorithms) capable of hot-updating limits in $< 50\text{ ms}$ without service restarts.
* **Multi-Dimensional Quota Levers `[MANDATORY]` Infrastructure / `[ACCORDING TO PS]` Specific Metrics**:
  * **Universal Levers `[MANDATORY]`**:
    * API requests per minute/second (`RPM`/`RPS`) per tenant and per IP.
    * LLM Token Budgets: Daily and monthly limits for `input_tokens`, `output_tokens`, `reasoning_tokens`, and total USD spend (`max_monthly_cost_usd`).
    * Concurrent Execution Slots: Max simultaneous SSE/WebSocket streams, active background jobs, and concurrent WebGL/GPU cloud render tasks.
    * Storage & Vector DB Quotas: Max uploaded assets, maximum vector embeddings/namespaces per tenant.
  * **Domain-Specific Levers `[ACCORDING TO PS]`**:
    * Specific business entity caps dictated by the Problem Statement (e.g., max 3D models per project, max automated workflows, max seats per workspace, max document pages parsed).
* **Burst Credits, Grace Periods & Hard/Soft Caps `[MANDATORY]`**:
  * Support configuring **Soft Caps** (triggers webhook + email warning at $80\%$ and $100\%$ usage while allowing temporary burst) vs. **Hard Caps** (returns `HTTP 429 Too Many Requests` with `Retry-After` header and structured JSON upgrade payload).
  * Temporary emergency quota boost tool for admins with an mandatory auto-expiration timestamp (`expires_at`).

### 1.5 AI Guardrail, Safety & Compliance Audit Log Inspector
* **Guardrail Pipeline Architecture `[MANDATORY]`**:
  * Intercept both **Input (Pre-LLM)** and **Output (Post-LLM)** traffic for PII/PHI leakage, prompt injection/jailbreak attempts, toxic content, competitor mentions, and hallucinated policy violations.
* **Guardrail Policies & Restricted Topics `[ACCORDING TO PS]`**:
  * The exact forbidden topics, domain compliance rules (e.g., financial advice disclaimers, medical diagnosis blocks, age-appropriate filters), and custom regex/NER entities are configured according to the Problem Statement.
* **Interactive Guardrail Audit Log UI `[MANDATORY]`**:
  * **Side-by-Side Diff Viewer**: Inspect the original raw user prompt, the PII-redacted prompt sent to the LLM, the raw LLM response, and the final sanitized/blocked response delivered to the user.
  * **Rule Trigger Breakdown**: Display the exact guardrail classifier name, confidence score (e.g., `PromptInjectionClassifier: 0.94`, `Presidio_SSN_Detector: 1.0`), and latency overhead added by the guardrail check.
  * **False-Positive Feedback Loop `[MANDATORY]`**: Allow authorized `AI_SAFETY_REVIEWER` admins to flag a blocked prompt as a `FALSE_POSITIVE` or `TRUE_POSITIVE`, automatically appending the sanitized sample to the Golden Evaluation Dataset for CI/CD regression testing.

### 1.6 Feature Flags, Progressive Delivery & Operational Kill Switches
* **Feature Flag Engine Integration `[MANDATORY]`**:
  * Integrate PostHog Feature Flags, Unleash, or LaunchDarkly with local evaluation caching on the backend and streamed updates on the frontend.
* **Targeting & Rollout Strategies `[MANDATORY]`**:
  * Support boolean flags, multivariate JSON payload flags (e.g., dynamically swapping LLM system prompts or model IDs like `claude-3-7-sonnet` vs `gpt-4o` without code deployment), percentage rollouts (consistent hashing on `tenant_id`), and ring deployments (`Internal -> Beta -> 5% -> 25% -> 100%`).
* **Instant Operational Kill Switches `[MANDATORY]`**:
  * Dedicated red-zone panel in the Admin Portal for one-click degradation during incidents:
    * *LLM Fallback Switch*: Instantly reroute traffic from primary LLM provider to secondary provider (e.g., OpenAI $\rightarrow$ Anthropic/Bedrock/Vertex) during upstream outages.
    * *WebGL Performance Fallback Switch*: Force client applications into low-poly/2D fallback rendering mode or disable expensive post-processing shaders for specific device classes.
    * *Read-Only Maintenance Mode*: Gracefully disable write operations while keeping read paths active during high-risk maintenance.
* **Flag Lifecycle & Technical Debt Governance `[MANDATORY]`**:
  * Every feature flag must have an `owner`, `created_at`, `expiration_date`, and `flag_type` (`RELEASE`, `EXPERIMENT`, `OPS_KILL_SWITCH`, `PERMISSION`). The admin dashboard must highlight stale flags past their expiration date.

### 1.7 Background Job Queues, DLQ & Cache Operations
* **Queue & Worker Telemetry UI `[MANDATORY]`**:
  * Real-time visibility into asynchronous job queues (BullMQ / Celery / Temporal): active, waiting, delayed, completed, and failed job counts.
* **Dead-Letter Queue (DLQ) Inspection & Replay `[MANDATORY]`**:
  * Inspect failed job payloads and stack traces, edit malformed payload parameters if necessary, and trigger single-job or bulk-batch replays with idempotency guarantees.
* **Granular Cache Invalidation `[MANDATORY]`**:
  * Admin controls to purge specific Redis cache keys by prefix/tenant (never `FLUSHALL` in production) and trigger CDN edge cache invalidation for specific asset paths.

### 1.8 Immutable Admin Audit Trail
* **Append-Only Cryptographic Audit Log `[MANDATORY]`**:
  * Every state-changing action performed inside the Admin Backoffice must write to an immutable audit table (protected via PostgreSQL row-level security / triggers preventing `UPDATE` or `DELETE`, and streamed to WORM object storage).
* **Audit Schema `[MANDATORY]`**:

```json
{
  "audit_id": "0195f3a2-7c8b-7000-8000-1a2b3c4d5e6f",
  "timestamp": "2026-11-13T17:30:00.124Z",
  "actor_id": "admin_usr_9921",
  "actor_email": "sre-lead@company.com",
  "impersonated_user_id": null,
  "action": "TENANT_QUOTA_OVERRIDE",
  "resource_type": "TENANT",
  "resource_id": "tnt_enterprise_441",
  "reason_code": "INCIDENT_MITIGATION",
  "ticket_ref": "JIRA-4821",
  "before_state": { "monthly_token_limit": 5000000, "hard_cap": true },
  "after_state": { "monthly_token_limit": 15000000, "hard_cap": false },
  "client_ip": "203.0.113.42",
  "user_agent": "Mozilla/5.0...",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "prev_record_hash": "sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
  "record_hash": "sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
}
```

---

## 2. Full-Stack Infrastructure & LLMOps Observability

Modern AI and graphics-intensive web applications cannot rely on traditional APM alone. Observability must unify browser WebGL performance, backend microservices, database queries, vector retrieval, and stochastic LLM execution into a single correlated trace graph.

### 2.1 Unified OpenTelemetry (OTel) Architecture
* **End-to-End W3C Trace Context Propagation `[MANDATORY]`**:
  * Inject and propagate `traceparent` and `tracestate` HTTP headers across every boundary:
    $$\text{Browser (React/WebGL)} \xrightarrow{\text{W3C Header}} \text{CDN/ALB} \xrightarrow{} \text{API Backend} \xrightarrow{} \text{Queue Worker} \xrightarrow{} \text{Vector DB \& LLM API}$$
* **OpenTelemetry Baggage & Resource Attributes `[MANDATORY]`**:
  * Attach standardized attributes to every span and metric:
    * `service.name`, `service.version` (Git SHA), `deployment.environment` (`prod`, `staging`, `preview-pr-XX`).
    * `tenant.id`, `tenant.tier`, `user.id`, `feature_flag.active_variants`.
* **OpenTelemetry Collector Pipeline `[MANDATORY]`**:
  * Deploy the OTel Collector as a sidecar or daemonset between the application and telemetry backends.
  * **Processors `[MANDATORY]`**:
    1. `memory_limiter`: Prevents OOM crashes during telemetry spikes.
    2. `attributes/redaction`: Scrubs sensitive headers (`Authorization`, `Cookie`, `X-API-Key`) and regex-matches PII (emails, credit cards, SSNs) before spans leave the VPC.
    3. `tail_sampling`: Retain $100\%$ of traces containing an error (`status_code == ERROR`), $100\%$ of traces where latency $> P_{95}$, $100\%$ of traces with negative user feedback, and a deterministic $5\text{--}20\%$ sample of healthy baseline traces.
    4. `batch`: Compresses and batches payloads to Prometheus, Grafana Tempo/Jaeger, Loki, and LangSmith/Arize Phoenix.

### 2.2 Infrastructure & Application Metrics (Prometheus & Grafana)
* **Golden Signals, RED & USE Methodologies `[MANDATORY]`**:
  * **RED (Request-scoped services)**:
    * **Rate**: Requests per second (`http_requests_total` counter partitioned by `route`, `method`, `status_code`, `tenant_tier`).
    * **Errors**: $4\text{xx}$ (client/quota errors) and $5\text{xx}$ (server faults) rates.
    * **Duration**: Histogram buckets tailored to both fast API endpoints ($5\text{ ms}$ to $2.5\text{ s}$) and long-running AI streaming endpoints ($100\text{ ms}$ to $120\text{ s}$).
  * **USE (Infrastructure resources)**:
    * **Utilization**: CPU core usage, RAM working set, disk I/O, network bandwidth.
    * **Saturation**: Node.js/Python event loop lag (`nodejs_eventloop_lag_seconds`), thread pool queue depth, PostgreSQL PgBouncer connection pool wait time, Redis memory fragmentation ratio.
    * **Errors**: OOM kills, container restarts, TCP retransmissions.
* **Custom Business & Domain Metrics `[ACCORDING TO PS]`**:
  * Domain-specific Prometheus counters/gauges dictated by the Problem Statement (e.g., `webgl_scenes_exported_total`, `documents_indexed_total`, `cad_simulations_completed_total`).
* **Grafana Dashboards-as-Code & Multi-Window SLO Burn Rate Alerts `[MANDATORY]`**:
  * Provision all Grafana dashboards via version-controlled JSON/Jsonnet in the repository (zero manual click-ops dashboards).
  * **Required Dashboard Suite `[MANDATORY]`**:
    1. *Executive & SLO Overview*: Availability ($99.9\%$), error budget remaining, active users, global $P_{50}/P_{95}/P_{99}$ latency.
    2. *Backend & Database Deep-Dive*: Per-route latency heatmaps, slow SQL queries (`pg_stat_statements`), Redis cache hit ratio (target $> 92\%$), queue consumer lag.
    3. *LLMOps & Token FinOps Dashboard*: Token throughput (tokens/sec), TTFT, TPOT, cost per tenant, provider error rates ($429$ Rate Limits vs $503$ Overloaded), semantic cache hit rate.
  * **Multi-Window, Multi-Burn-Rate Alerting `[MANDATORY]`**:
    * Avoid noisy threshold alerts on raw CPU; page on-call engineers via Alertmanager $\rightarrow$ PagerDuty/Slack only when the error budget burn rate threatens the monthly SLO (e.g., consuming $2\%$ of the monthly error budget in $1\text{ hour}$ AND still burning over a $5\text{ minute}$ short window).

### 2.3 Structured Distributed Logging (Grafana Loki / OpenSearch)
* **Strict Structured JSON Logging `[MANDATORY]`**:
  * Unstructured `console.log` strings are forbidden in production code. Use high-performance loggers (`pino` for Node/TS, `structlog` for Python) outputting newline-delimited JSON.
  * Every log line must automatically inject `trace_id`, `span_id`, `timestamp`, `level`, `service`, `tenant_id`, and `env` for instant trace-to-log correlation in Grafana.

### 2.4 LLMOpsObservability (LangSmith / Arize Phoenix / OpenInference)
* **Granular GenAI Span Instrumentation (OpenInference / OTel GenAI Semantic Conventions) `[MANDATORY]`**:
  * Every AI workflow must emit hierarchical spans capturing:
    * **Orchestration / Agent Span**: Agent state transitions, router decisions, loop iteration counts, and total wall-clock execution time.
    * **RAG & Vector Retrieval Span**: Raw search query, rewritten query, embedding model name, embedding latency, vector DB query latency, top-$k$ retrieved document IDs, cosine/dot-product similarity scores, and cross-encoder reranker scores.
    * **LLM Invocation Span**: Provider (`openai`, `anthropic`, `google`, `bedrock`), exact model version (`gpt-4o-2024-11-20`), temperature/top_p parameters, system prompt template ID + version hash, structured tool definitions, tool call arguments, and finish reason (`stop`, `length`, `tool_calls`, `content_filter`).
* **Streaming Performance Metrics `[MANDATORY]`**:
  * **Time to First Token ($\text{TTFT}$)**:
    $$\text{TTFT} = t_{\text{first\_chunk\_received}} - t_{\text{request\_dispatched}}$$
  * **Time Per Output Token ($\text{TPOT}$ / Inter-Token Latency)**:
    $$\text{TPOT} = \frac{t_{\text{last\_token}} - t_{\text{first\_token}}}{\text{output\_tokens} - 1}$$
  * **Total Generation Latency**:
    $$T_{\text{total}} = \text{TTFT} + (\text{TPOT} \times (\text{output\_tokens} - 1))$$
* **Token Accounting & Real-Time Cost Attribution Engine `[MANDATORY]`**:
  * Track `prompt_tokens`, `Cached_prompt_tokens` (prompt caching discounts), `completion_tokens`, and `reasoning_tokens` per request.
  * Compute exact USD cost per trace using a versioned pricing matrix:
    $$\text{Cost}_{\text{trace}} = \sum_{i \in \text{spans}} \left( N_{\text{in}, i} \cdot C_{\text{in}}(M_i) + N_{\text{cache}, i} \cdot C_{\text{cache}}(M_i) + N_{\text{out}, i} \cdot C_{\text{out}}(M_i) \right)$$
  * Roll up costs by `tenant_id`, `user_id`, `feature_name`, and `prompt_version` to detect runaway agent loops or unprofitable tenant tiers.
* **User Feedback & Implicit Signal Correlation `[MANDATORY]`**:
  * Bind frontend user feedback signals directly to the `trace_id` in LangSmith / Arize Phoenix:
    * *Explicit Signals*: Thumbs up/down ($+1/-1$), star ratings, issue category tags ("Hallucinated", "Too Slow", "Ignored Instructions"), and human corrections.
    * *Implicit Signals*: Did the user copy the output? Did the user accept the generated code/3D object? Did the user immediately regenerate or abandon the session?
* **Embedding & Semantic Drift Monitoring (Arize Phoenix) `[MANDATORY]`**:
  * Continuously compute Euclidean/Cosine distance clusters on incoming user prompt embeddings to identify emerging user intents, out-of-distribution (OOD) queries, and retrieval failure clusters where vector similarity drops below threshold $\tau$ (e.g., $\tau < 0.72$).

---

## 3. Product Analytics, Behavioral Funnels & Full-Stack Crash Reporting

Understanding *how* users interact with complex AI and WebGL interfaces—and immediately diagnosing client/server exceptions when they fail—requires tight integration between PostHog and Sentry, unified by shared user, tenant, and trace identifiers.

### 3.1 Product Analytics & Behavioral Engineering (PostHog)
* **Strict Event Taxonomy & Schema Governance `[MANDATORY]` Structure / `[ACCORDING TO PS]` Specific Events**:
  * Enforce snake_case `object_action` naming conventions (`workspace_created`, `ai_prompt_submitted`, `webgl_canvas_exported`, `subscription_upgraded`).
  * Validate event properties via TypeScript discriminated unions (`analytics.track<EventMap>()`) so untyped or misspelled events cannot compile.
  * **Universal Core Events `[MANDATORY]`**: Authentication lifecycle, onboarding steps, feature discovery, AI prompt submission/completion/regeneration, quota limit reached, error modal displayed.
  * **Domain Journey Funnels `[ACCORDING TO PS]`**: The specific multi-step conversion funnel stages depend on the Problem Statement's core value loop (e.g., `Upload Dataset -> Configure Model -> Run Simulation -> Export Report`).
* **Group Analytics (B2B / Multi-Tenant Attribution) `[MANDATORY]`**:
  * Bind every PostHog event not just to `distinct_id` (user), but also to `groups: { tenant: tenant_id, workspace: workspace_id }` to measure account-level activation, seat expansion, and churn risk.
* **Privacy-Preserving Session Replay & WebGL Canvas Capture `[MANDATORY]`**:
  * **Zero-PII Masking**: Configure PostHog Session Replay with strict privacy controls (`maskAllInputs: true` by default, explicit `.ph-no-capture` and `data-ph-mask` attributes on all sensitive customer data, API keys, and PII).
  * **WebGL / Canvas Recording Strategy `[MANDATORY]`**:
    * Standard DOM mutation observers cannot see inside `<canvas>` elements. Enable throttled canvas frame snapshot recording (`recordCanvas: true`, `canvasFps: 2` to `4`, `canvasQuality: '0.4'`) executed off the main thread or via `requestIdleCallback` so session recording never degrades WebGL rendering frame rates.
  * **Network & Console Synchronization `[MANDATORY]`**: Capture network request timings, HTTP status codes, `x-trace-id` response headers, and console errors inside the replay timeline (with request/response bodies scrubbed of secrets).
* **Product Experimentation (A/B/n Testing) `[MANDATORY]`**:
  * Support statistically rigorous hypothesis testing with primary conversion metrics and **Guardrail Metrics** (e.g., an experiment that increases user engagement by $10\%$ must automatically halt if $P_{95}$ latency increases by $> 20\%$ or Sentry crash rate increases).

### 3.2 Frontend, WebGL & Backend Crash Reporting (Sentry)
* **Cross-Platform Correlation Bridge (`PostHog <-> Sentry <-> OpenTelemetry`) `[MANDATORY]`**:
  * Whenever Sentry captures an exception on the frontend or backend, automatically attach:
    * `posthog_session_id` and `posthog_distinct_id` (along with a direct clickable URL to the exact timestamp in the PostHog Session Replay).
    * `otel_trace_id` and `otel_span_id` (linking directly to Grafana Tempo and LangSmith/Phoenix traces).
    * `tenant_id`, `active_feature_flags`, and `git_release_sha`.
* **Frontend & WebGL / GPU Specific Telemetry & Crash Recovery `[MANDATORY]`**:
  * Rich graphics applications suffer from unique hardware/driver failures that standard error handlers miss. You must implement dedicated instrumentation for:
    1. **WebGL Context Loss (`webglcontextlost` & `webglcontextrestored`)**:
       * Intercept context loss events on all `<canvas>` elements, prevent default termination, log a high-priority Sentry event with GPU diagnostics, attempt automatic texture/buffer restoration, and display a graceful non-crashing recovery state to the user.
    2. **GPU Hardware & Driver Fingerprinting**:
       * Extract and attach `UNMASKED_VENDOR_WEBGL` and `UNMASKED_RENDERER_WEBGL` via the `WEBGL_debug_renderer_info` extension, alongside `MAX_TEXTURE_SIZE`, `MAX_VIEWPORT_DIMS`, WebGL2/WebGPU support status, and `navigator.deviceMemory`.
    3. **Shader Compilation & Program Linking Diagnostics**:
       * Wrap `gl.compileShader` and `gl.linkProgram`; on failure, capture `gl.getShaderInfoLog()` with the offending GLSL/WGSL line numbers and report to Sentry grouped by shader hash.
    4. **Frame Rate (FPS) Janks, Long Animation Frames (LoAF) & Memory Pressure**:
       * Monitor main-thread stalls ($> 50\text{ ms}$) using the Long Animation Frames API (`PerformanceLongAnimationFrameTiming`), track JS heap usage (`performance.memory`), and track Three.js/WebGL `renderer.info` (`geometries`, `textures`, `programs`, `calls`, `triangles`) to catch GPU memory leaks before the browser tab crashes with `RESULT_CODE_HUNG` or `Out of Memory`.
* **Backend API, Worker & LLM Exception Fingerprinting `[MANDATORY]`**:
  * Global exception filters on all API routes, WebSocket handlers, and background queue workers.
  * **Custom Sentry Grouping Rules `[MANDATORY]`**: Group upstream LLM failures intelligently (e.g., separate `OpenAIRateLimitError`, `AnthropicOverloadedError`, `ToolSchemaValidationError`, and `VectorDBConnectionTimeout`) rather than lumping them into generic `HTTP 500` buckets.
* **Source Maps, Release Health & Issue Alerting `[MANDATORY]`**:
  * Upload minified JS/TS source maps (with `--delete-after-upload` so source maps are never publicly accessible on the CDN) tied to the exact Git SHA during CI builds.
  * Track **Crash-Free Sessions** (target $\ge 99.9\%$) and **Crash-Free Users** (target $\ge 99.5\%$) per release.

---

## 4. CI/CD Pipelines, DevSecOps & Automated AI Evaluations

Every pull request and production deployment must pass through a deterministic, automated quality, security, and AI reliability gauntlet before reaching end users.

### 4.1 GitHub Actions Pipeline Architecture
* **Pipeline Engineering Standards `[MANDATORY]`**:
  * **Concurrency Control**: Automatically cancel superseded workflow runs on feature branches (`concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }`), while never canceling active production deployments.
  * **Zero Long-Lived Cloud Credentials**: Authenticate GitHub Actions to AWS exclusively via **OpenID Connect (OIDC)** (`aws-actions/configure-aws-credentials`) assuming least-privilege IAM roles.
  * **Aggressive Caching**: Cache pnpm/npm/uv/pip stores, Next.js/Vite build caches, Playwright browser binaries, and Docker BuildKit layers (`type=gha`).
* **Pipeline Stage Topology (DAG) `[MANDATORY]`**:

```
[PR Opened / Push]
       │
       ├──► Stage 1: Static Analysis, Typecheck, Lint & Secret Scan (< 90s)
       │
       ├──► Stage 2: Unit & Service-Container Integration Tests (< 3m)
       │
       ├──► Stage 3: Container Build, SBOM & Trivy Security Scan (< 3m)
       │
       ├──► Stage 4A: Playwright E2E + Headless WebGL + Visual Diff (< 5m)
       │
       ├──► Stage 4B: Automated AI Evals & LLM-as-a-Judge Gate (< 4m)
       │
       ▼ (All Gates Green + Merge to main)
       │
       └──► Stage 5: AWS ECS Blue/Green Deployment + Synthetic Canary + Auto-Rollback
```

### 4.2 Static Analysis, Secret Scanning & Integration Testing
* **Code Quality & Type Safety Gates `[MANDATORY]`**:
  * Strict TypeScript compilation (`tsc --noEmit` with `strict: true`, `noUncheckedIndexedAccess: true`), ESLint/Biome AST linting, and Python Ruff/Mypy checks.
* **DevSecOps Secret & SAST Scanning `[MANDATORY]`**:
  * Run **Gitleaks** or **TruffleHog** on commit diffs to block accidental credential commits.
  * Run **Semgrep** or **CodeQL** for static application security testing (SQL injection, SSRF, XSS, insecure deserialization, prompt injection sinks).
* **Hermetic Integration Testing `[MANDATORY]`**:
  * Spin up ephemeral PostgreSQL (with `pgvector`), Redis, and MinIO/LocalStack service containers inside GitHub Actions. Run database migrations from scratch, seed deterministic fixtures, and execute API contract tests.

### 4.3 Playwright E2E, Headless WebGL & Accessibility Testing
* **Deterministic E2E Architecture `[MANDATORY]`**:
  * Test critical user journeys across Chromium, Firefox, and WebKit using isolated browser contexts and pre-authenticated storage states (`storageState.json`) to bypass repetitive login UI flows.
* **Headless GPU & WebGL Rendering in CI `[MANDATORY]`**:
  * Standard headless CI runners lack physical GPUs, causing WebGL initialization to fail or fall back to broken contexts. Configure Playwright Chromium launch arguments explicitly for deterministic software-accelerated WebGL2 rendering via ANGLE + SwiftShader:
    ```typescript
    launchOptions: {
      args: [
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--enable-webgl',
        '--enable-webgl2-compute-context',
        '--ignore-gpu-blocklist',
        '--disable-gpu-sandbox'
      ]
    }
    ```
  * Assert within E2E tests that the `<canvas>` context is active, shaders compile with zero errors, `webglcontextlost` is not fired, and visual snapshots (`await expect(canvas).toHaveScreenshot({ maxDiffPixelRatio: 0.02 })`) match baseline golden renders.
* **Deterministic vs. Live LLM Mocking in E2E `[MANDATORY]`**:
  * Use HAR replay or Mock Service Worker (MSW) to simulate token-by-token SSE streaming responses (including simulated tool calls and network stalls) for fast, $100\%$ deterministic UI state testing, while reserving live LLM evaluation for the dedicated AI Eval stage.
* **Automated Accessibility Auditing (`@axe-core/playwright`) `[MANDATORY]`**:
  * Execute `AxeBuilder` assertions on every major user view and the Admin Backoffice portal to fail the build on any WCAG 2.1 AA violation.
* **Failure Artifact Retention `[MANDATORY]`**:
  * Automatically upload Playwright Trace Viewer archives (`trace.zip`), video recordings, console logs, and visual diff images as GitHub Actions artifacts whenever a test fails.

### 4.4 Container Hardening & Trivy Vulnerability Scanning
* **Production Container Standards `[MANDATORY]`**:
  * Multi-stage Dockerfiles producing minimal or distroless runtime images (`gcr.io/distroless/nodejs22-debian12` or `alpine` with stripped build tools).
  * Enforce non-root execution (`USER 10001:10001`), read-only root filesystems where possible, and explicit `HEALTHCHECK` instructions.
* **Trivy Security Gate & SBOM Generation `[MANDATORY]`**:
  * Scan filesystem dependencies, IaC templates (Terraform/CloudFormation/Dockerfile), and the built container image using **Aqua Trivy**:
    * **Blocking Policy**: Fail the CI pipeline (`exit-code: 1`) if any `CRITICAL` or `HIGH` severity CVE has an available fix (`--ignore-unfixed: false` for critical packages).
  * Generate a CycloneDX or SPDX Software Bill of Materials (**SBOM**) and attach it to the container registry artifact.

### 4.5 Automated AI Evaluations & LLM-as-a-Judge CI Gates
Any change to system prompts, RAG chunking strategies, embedding models, tool definitions, or agent routing code must be quantitatively evaluated in CI before merging.

* **Golden Evaluation Dataset Architecture `[MANDATORY]` Structure / `[ACCORDING TO PS]` Domain Content**:
  * Maintain version-controlled datasets (synced with LangSmith / Arize Phoenix) stratified into four buckets:
    1. **Core Happy-Path Scenarios `[ACCORDING TO PS]`**: Domain-specific user queries with verified reference answers and expected tool calls.
    2. **Complex Multi-Turn & Edge Cases `[ACCORDING TO PS]`**: Ambiguous inputs, massive context windows, missing context requiring clarification.
    3. **Adversarial & Red-Team Dataset `[MANDATORY]`**: Prompt injections, DAN jailbreaks, system prompt extraction attempts, PII exfiltration attempts, and toxic inputs.
    4. **Production Regression Bugs `[MANDATORY]`**: Real historical failures curated via the Admin Portal's Guardrail & Trace Inspector.
* **Three-Tier Evaluation Suite (Promptfoo / DeepEval / Ragas / LangSmith) `[MANDATORY]`**:
  1. **Tier 1: Deterministic & Structural Assertions (Fast, Zero Cost)**
     * Valid JSON/Pydantic/Zod schema output compliance ($100\%$ pass rate required).
     * Exact tool name and parameter selection accuracy.
     * Regex/keyword inclusion or exclusion (e.g., ensuring forbidden phrases or raw stack traces never appear).
     * Latency and token budget ceilings per test case.
  2. **Tier 2: RAG Triad Quantitative Metrics (When RAG is Present)**
     * **Context Precision**: Are the most relevant chunks ranked at the top of the retrieved results?
     * **Context Recall**: Did the retriever fetch all necessary ground-truth facts required to answer the query?
     * **Faithfulness (Groundedness)**: Does the generated response rely *strictly* on the retrieved context without fabricating facts? (Target $\ge 0.92$).
     * **Answer Relevance**: Does the output directly address the user's actual question?
  3. **Tier 3: LLM-as-a-Judge Rubric Evaluation**
     * Use a frontier reasoning model (`claude-3-7-sonnet` or `gpt-4o` at `temperature = 0.0`) with structured JSON output to grade responses against explicit criteria.
     * **Judge Bias Mitigation `[MANDATORY]`**:
       * Require **Chain-of-Thought (CoT) justification** *before* the judge outputs a numeric score.
       * Use discrete integer scales ($1\text{ to }5$ or binary $0/1$ checklists) rather than arbitrary $1\text{ to }100$ floats.
       * Swap candidate order `(A, B)` and `(B, A)` during pairwise comparisons to eliminate position bias.
     * **Domain-Specific Judge Rubrics `[ACCORDING TO PS]`**: Domain accuracy, tone adherence, pedagogical clarity, or code compilation correctness as required by the Problem Statement.
* **PR Comment Report & Blocking Regression Gate `[MANDATORY]`**:
  * Automatically post a markdown summary table directly onto the GitHub Pull Request comparing the PR branch against the `main` baseline:
    * **Fail the CI build** if:
      * Schema compliance $< 100\%$.
      * Adversarial/Safety guardrail pass rate $< 100\%$.
      * Faithfulness / Hallucination score regresses by $> 2\%$ or drops below $0.90$.
      * Domain Rubric Score regresses by $> 3\%$.
      * Mean token cost or $P_{95}$ latency increases by $> 15\%$ without an explicit `@override-perf-gate` label approved by a lead engineer.

### 4.6 Zero-Downtime Cloud Deployment (AWS ECS Blue/Green)
* **Blue/Green Architecture (AWS ECS + ALB + CodeDeploy) `[MANDATORY]`**:
  * Provision an Application Load Balancer (ALB) with two Target Groups: **Blue** (current production task set on port `443`) and **Green** (new replacement task set initially attached to an internal test listener port `8443`).
* **Deployment Lifecycle & Canary Traffic Shifting `[MANDATORY]`**:
  1. **Provision Green Task Set**: ECS spins up the new task revision in the Green Target Group and waits for container health checks (`/api/health/readiness` verifying DB, Redis, and upstream reachability) to pass.
  2. **Pre-Traffic Synthetic Smoke Hook (`BeforeAllowTraffic`)**:
     * CodeDeploy triggers a Lambda function or runner hitting the Green test listener (`:8443`) to run synthetic smoke tests (auth check, DB read, cached LLM ping, static asset load). If any assertion fails, abort immediately with zero impact to production users.
  3. **Canary / Linear Traffic Shift**:
     * Shift traffic using `CodeDeployDefault.ECSCanary10Percent5Minutes` or `ECSLinear10PercentEvery1Minute` (routing $10\%$ of live traffic to Green while $90\%$ remains on Blue).
  4. **Automated Telemetry Bake Time & Instant Rollback**:
     * During the bake window and for $15\text{ minutes}$ post-cutover, CodeDeploy monitors linked CloudWatch/Prometheus alarms:
       * ALB Target $5\text{xx}$ error rate $> 0.5\%$.
       * Application $P_{99}$ latency exceeds SLA threshold.
       * ECS Task unhealthy host count $> 0$.
       * Sentry Release Health webhook triggers on new unhandled exception spike.
     * **Auto-Rollback**: If any alarm enters `ALARM` state, CodeDeploy instantaneously flips $100\%$ of ALB listener traffic back to the untouched Blue task set in $< 5\text{ seconds}$ and notifies Slack/PagerDuty.
  5. **Connection Draining & Termination**:
     * Once $100\%$ of traffic is on Green and the bake period succeeds, gracefully drain long-lived SSE/WebSocket connections from Blue (`deregistration_delay.timeout_seconds = 120`) before terminating the old Blue tasks.
* **Expand-and-Contract Database Migration Safety `[MANDATORY]`**:
  * Because Blue ($v_N$) and Green ($v_{N+1}$) containers run simultaneously against the same production database during canary rollout—and because an instant rollback to Blue must never break against the new DB schema—all database schema changes must strictly follow the **Expand-and-Contract** pattern:
    * * forbidden in single release*: Renaming columns, dropping columns, adding `NOT NULL` constraints without defaults, or changing column data types destructively.
    * *Phase 1 (Expand)*: Add nullable columns/tables, dual-write or backfill asynchronously.
    * *Phase 2 (Migrate)*: Switch application reads to the new column once $100\%$ backfilled.
    * *Phase 3 (Contract)*: Drop legacy unused columns in a subsequent deployment after the rollback window has passed.

---

## 5. Master Classification Matrix (`[MANDATORY]` vs `[ACCORDING TO PS]`)

Use this matrix when initializing or auditing any project with Antigravity to determine what must be built unconditionally versus what must be parameterized from the Problem Statement.

| Subsystem | Component / Concept | Classification | Implementation Directive for Antigravity |
| :--- | :--- | :--- | :--- |
| **Admin Portal** | MFA, Step-Up Auth, RBAC Engine, Dual-Claim Impersonation | **`[MANDATORY]`** | Always implement full zero-trust auth, read-only default impersonation, and step-up verification. |
| **Admin Portal** | Immutable Hash-Chained Audit Log | **`[MANDATORY]`** | Always log `before_state`, `after_state`, `actor_id`, `trace_id`, and `reason_code` on every admin mutation. |
| **Admin Portal** | Feature Flags & Emergency Kill Switches | **`[MANDATORY]`** | Always wire LLM provider fallback, WebGL low-spec fallback, and maintenance mode switches. |
| **Admin Portal** | Visual Theme, Color Palette & Typography | **`[ACCORDING TO PS]`** | Adopt the brand aesthetic, color tokens, and domain styling specified in the Problem Statement while keeping high contrast and zero CLS. |
| **Admin Portal** | Business Quota Entities & Tier Limits | **`[ACCORDING TO PS]`** | Use the universal Redis token-bucket engine (`[MANDATORY]`), but configure domain entities (e.g., scenes, docs, seats) per the PS. |
| **Observability** | OpenTelemetry End-to-End W3C Trace Propagation | **`[MANDATORY]`** | Always propagate `traceparent` across Browser $\rightarrow$ API $\rightarrow$ Worker $\rightarrow$ Vector DB $\rightarrow$ LLM. |
| **Observability** | Prometheus RED/USE Metrics & Grafana SLO Alerts | **`[MANDATORY]`** | Always expose `/metrics`, track $P_{50}/P_{95}/P_{99}$ latencies, and provision Grafana JSON dashboards. |
| **Observability** | LangSmith / Arize Phoenix LLM Tracing & FinOps | **`[MANDATORY]`** | Always capture TTFT, TPOT, RAG chunk scores, prompt version hashes, and per-tenant USD token cost. |
| **Observability** | Custom Domain Prometheus Counters | **`[ACCORDING TO PS]`** | Add domain-specific business counters (e.g., `simulations_run_total`) based on the PS core loop. |
| **Analytics & Crash** | PostHog Session Replay with Zero-PII Masking | **`[MANDATORY]`** | Always mask inputs/PII, throttle WebGL canvas capture, and link `posthog_session_id` to Sentry & OTel. |
| **Analytics & Crash** | Sentry WebGL Context Loss, Shader & LoAF Telemetry | **`[MANDATORY]`** | Always attach `webglcontextlost` handlers, GPU vendor metadata, shader logs, and source maps. |
| **Analytics & Crash** | Conversion Funnel Steps & Cohort Definitions | **`[ACCORDING TO PS]`** | Define the exact `object_action` funnel steps around the user journey described in the Problem Statement. |
| **CI/CD & Evals** | Linting, Typecheck, Secret Scan & Trivy CVE Gate | **`[MANDATORY]`** | Always block PRs on type errors, leaked secrets, or Critical/High container CVEs. |
| **CI/CD & Evals** | Playwright E2E with SwiftShader WebGL & Axe A11y | **`[MANDATORY]`** | Always run headless GPU flags, visual canvas regression checks, and WCAG AA accessibility assertions. |
| **CI/CD & Evals** | LLM-as-a-Judge Pipeline, RAG Triad & Safety Gates | **`[MANDATORY]`** | Always enforce $100\%$ schema validity, $100\%$ adversarial safety pass rate, and faithfulness gates in CI. |
| **CI/CD & Evals** | Golden Dataset Prompts & Domain Judge Rubrics | **`[ACCORDING TO PS]`** | Populate the evaluation dataset and domain grading rubrics using the specific subject matter of the PS. |
| **Deployment** | AWS ECS Blue/Green, Canary Alarms & Expand/Contract DB | **`[MANDATORY]`** | Always use dual target groups, pre-traffic smoke tests, automated alarm rollbacks, and backward-compatible migrations. |

---

## 6. Reference Implementation Blueprints & Configuration Templates

### 6.1 Correlation Header & Context Middleware Contract (`[MANDATORY]`)
Every backend response must return trace correlation headers so the frontend Sentry SDK, PostHog SDK, and Admin Support Toolbar can link client sessions to backend traces:

```typescript
// Mandatory Response Headers on all API & SSE Endpoints
export interface ObservabilityResponseHeaders {
  'x-trace-id': string;           // W3C OpenTelemetry 32-char hex Trace ID
  'x-span-id': string;            // Current Server Entry Span ID
  'x-request-id': string;         // Unique UUIDv7 per HTTP request
  'x-ratelimit-limit': string;    // Current tenant quota ceiling
  'x-ratelimit-remaining': string;// Remaining quota units/tokens
  'x-ratelimit-reset': string;    // UTC epoch seconds until quota reset
}
```

### 6.2 Client-Side WebGL Crash & Telemetry Bridge (`[MANDATORY]`)
Attach this instrumentation wrapper to every WebGL/Three.js/Babylon.js `<canvas>` instance:

```typescript
import * as Sentry from '@sentry/browser';
import posthog from 'posthog-js';

export function instrumentWebGLCanvas(
  canvas: HTMLCanvasElement,
  sceneContextName: string
): void {
  const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
  const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
  const gpuVendor = debugInfo && gl ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
  const gpuRenderer = debugInfo && gl ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';

  Sentry.setContext('gpu_hardware', {
    vendor: gpuVendor,
    renderer: gpuRenderer,
    maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : null,
    deviceMemoryGB: (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 'unknown',
    sceneContextName,
  });

  canvas.addEventListener('webglcontextlost', (event: Event) => {
    event.preventDefault(); // Allows context restoration
    const posthogSessionUrl = posthog.get_session_replay_url({ withTimestamp: true });

    Sentry.withScope((scope) => {
      scope.setLevel('fatal');
      scope.setTag('error.domain', 'webgl_context_lost');
      scope.setTag('gpu.renderer', String(gpuRenderer));
      scope.setExtra('posthog_replay_url', posthogSessionUrl);
      Sentry.captureMessage(`WebGL Context Lost in [${sceneContextName}]`);
    });

    posthog.capture('webgl_context_lost', {
      scene: sceneContextName,
      gpu_vendor: gpuVendor,
      gpu_renderer: gpuRenderer,
    });
  }, false);

  canvas.addEventListener('webglcontextrestored', () => {
    posthog.capture('webgl_context_restored', { scene: sceneContextName });
  }, false);
}
```

### 6.3 Production GitHub Actions CI/CD + AI Evaluation Pipeline (`[MANDATORY]`)
Use this workflow structure as the baseline `.github/workflows/production-pipeline.yml`:

```yaml
name: Enterprise CI/CD, Security, WebGL E2E & AI Evaluations

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}

permissions:
  id-token: write   # Required for AWS OIDC passwordless auth
  contents: read
  pull-requests: write
  security-events: write

jobs:
  static-quality-and-security:
    name: 1. Lint, Typecheck & Secret Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Gitleaks Secret Scan
        uses: gitleaks/gitleaks-action@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run typecheck

  container-trivy-scan:
    name: 2. Build Image, SBOM & Trivy Gate
    needs: static-quality-and-security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Production Container
        run: docker build -t app:${{ github.sha }} .
      - name: Run Trivy Vulnerability Scanner (Blocking Gate)
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'app:${{ github.sha }}'
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          vuln-type: 'os,library'
          severity: 'CRITICAL,HIGH'

  playwright-webgl-e2e:
    name: 3. Playwright E2E + Headless WebGL + A11y
    needs: static-quality-and-security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Install Playwright Chromium with SwiftShader
        run: pnpm exec playwright install --with-deps chromium
      - name: Execute E2E, WebGL Canvas & Axe Accessibility Suite
        run: pnpm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-traces-and-diffs
          path: test-results/
          retention-days: 7

  ai-evaluations-gate:
    name: 4. Automated LLM-as-a-Judge & Safety Evals
    needs: static-quality-and-security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Run Golden Dataset, RAG Triad & Red-Team Guardrail Evals
        env:
          LANGSMITH_API_KEY: ${{ secrets.LANGSMITH_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.EVAL_JUDGE_API_KEY }}
        run: |
          pnpm run ai:eval:ci --output eval-report.json
          node scripts/assert-eval-thresholds.mjs eval-report.json

  ecs-blue-green-deploy:
    name: 5. AWS ECS Blue/Green Canary Deployment
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: [container-trivy-scan, playwright-webgl-e2e, ai-evaluations-gate]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS Credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_OIDC_ROLE_ARN }}
          aws-region: us-east-1
      - name: Trigger CodeDeploy Blue/Green ECS Rollout with Auto-Rollback
        run: ./scripts/deploy-ecs-blue-green.sh ${{ github.sha }}
```

---

## 7. Antigravity Execution Checklist (Pre-Flight Verification)

Before marking any milestone complete, the AI Agent (Antigravity) must verify:

1. [ ] **Admin Backoffice**: Are all admin endpoints protected by RBAC middleware, Step-Up Auth for destructive actions, and writing to the immutable audit log with `before_state` and `after_state`?
2. [ ] **Impersonation Safety**: Does user impersonation default to `READ_ONLY`, carry dual JWT identity claims (`sub` + `act.sub`), and render an un-dismissible top banner?
3. [ ] **Quota & Kill Switches**: Can tenant token/request quotas and operational kill switches (LLM fallback, WebGL fallback, maintenance mode) be toggled in real time via Redis/Feature Flags without redeploying?
4. [ ] **Trace Continuity**: Does a single `trace_id` flow unbroken from the browser request through the API, background queue, vector search, and LLM provider into both Grafana Tempo and LangSmith/Phoenix?
5. [ ] **LLMOps Cost & Latency**: Are `TTFT`, `TPOT`, prompt template version hash, and exact USD token cost calculated and attributed to `tenant_id` on every LLM call?
6. [ ] **Cross-Tool Correlation**: Does every Sentry crash report include a direct link to the active PostHog Session Replay and OpenTelemetry `trace_id`?
7. [ ] **WebGL Resilience**: Are `webglcontextlost`, shader compilation errors, GPU vendor metadata, and frame stalls instrumented and recoverable?
8. [ ] **CI/CD & AI Gates**: Do GitHub Actions enforce Trivy CVE blocking, Playwright SwiftShader WebGL tests, LLM-as-a-Judge faithfulness/safety thresholds, and Blue/Green automatic alarm rollbacks?
9. [ ] **Problem Statement Alignment (`[ACCORDING TO PS]`)**: Have all visual themes, domain-specific quota metrics, business funnel events, and golden dataset evaluation rubrics been tailored to the specific Problem Statement?