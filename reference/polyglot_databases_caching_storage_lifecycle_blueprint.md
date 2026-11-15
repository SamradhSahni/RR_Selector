# Enterprise Architectural Blueprint: Polyglot Databases, Caching & Storage Lifecycle

> **Target System:** Antigravity Autonomous Engineering & Architecture Knowledge Base  
> **Scope:** End-to-End Persistence, Distributed Caching, Semantic AI Memory, Protected 3D/Media Asset Delivery, Zero-Downtime Migrations, and Automated Compliance Lifecycle.

---

## 1. Classification Taxonomy & Execution Rules for AI Agents

When interpreting this knowledge base to design, scaffold, or audit a web platform, apply the following strict classification matrix:

*   **`[MANDATORY]` (Non-Negotiable Core & Web Enhancement Standard):** Any architectural pattern, security posture, caching layer, performance optimization, observability hook, or resilience mechanism that improves web security, latency, scalability, reliability, or developer experience. **Nothing that improves the web application is treated as optional.** These must be implemented by default in every production system.
*   **`[ACCORDING TO PS]` (Problem Statement & Domain-Driven):** Any schema topology, domain entity relationship, retention window, aesthetic/3D asset theme, consistency trade-off, or specialized database engine selection that depends directly on the business domain, user requirements, regulatory jurisdiction, or visual theme defined in the Problem Statement (PS).

---

## 2. Polyglot Persistence Architecture

Modern enterprise web applications cannot rely on a single storage engine without sacrificing performance, cost-efficiency, or developer velocity. A polyglot persistence layer routes each workload to the storage engine mathematically optimized for its access pattern.

### 2.1 Relational Persistence (Core OLTP & Financial/Identity Ledger)
*   **Engine Selection `[MANDATORY]`:** Multi-AZ Amazon RDS for PostgreSQL or Amazon Aurora PostgreSQL (Serverless v2 or Provisioned).
*   **High Availability Topology `[MANDATORY]`:**
    *   Deploy across a minimum of 3 Availability Zones (AZs) in private isolated subnets (no public IP routing).
    *   Synchronous physical replication to the standby instance for zero data loss ($\text{RPO} = 0$ for AZ failure) and automated failover within $30\text{--}60\text{ seconds}$.
    *   At least one dedicated Read Replica for offloading analytical queries, reporting, and heavy read endpoints.
*   **Connection Pooling & Multiplexing `[MANDATORY]`:**
    *   Deploy **Amazon RDS Proxy** or **PgBouncer** in `transaction` pooling mode between serverless/containerized compute (AWS Lambda, ECS, Kubernetes) and PostgreSQL.
    *   *Why it is Mandatory:* PostgreSQL forks an OS process per connection ($\approx 5\text{--}10\text{ MB}$ RAM per connection). RDS Proxy pins connections warm, absorbs connection spikes, prevents `FATAL: remaining connection slots are reserved` errors, and reduces failover disruption time by up to $66\%$ by holding client connections while switching the underlying DB endpoint.
*   **Row-Level Security (RLS) for Multi-Tenancy `[MANDATORY]`:**
    *   Enforce defense-in-depth at the database engine layer so that an application-level SQL injection or missing `WHERE` clause cannot leak cross-tenant data.
    *   *Implementation Pattern:*
        ```sql
        -- 1. Enable RLS on the table (Mandatory)
        ALTER TABLE core_transactions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE core_transactions FORCE ROW LEVEL SECURITY;

        -- 2. Enforce session-variable isolation policy
        CREATE POLICY tenant_isolation_policy ON core_transactions
            USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)
            WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
        ```
    *   *RDS Proxy Pinning Mitigation `[MANDATORY]`:* Always scope session variables locally inside a transaction block using `SET LOCAL app.current_tenant_id = '...'` rather than session-level `SET`, preventing RDS Proxy from pinning connections and degrading multiplexing efficiency.
*   **Indexing & Query Optimization Standards `[MANDATORY]`:**
    *   **B-Tree Indexes:** Default for high-cardinality equality and range queries (`=`, `<`, `>`, `BETWEEN`).
    *   **GIN (Generalized Inverted Index):** Mandatory for `JSONB` payload attributes and full-text `tsvector` search columns.
    *   **Partial Indexes:** Index only active rows (e.g., `WHERE deleted_at IS NULL AND status = 'PENDING'`) to shrink index memory footprint by $50\text{--}90\%$.
    *   **Covering Indexes (`INCLUDE`):** Attach non-filter payload columns to enable Index-Only Scans and eliminate heap fetches.
*   **Domain Schema & Partitioning Strategy `[ACCORDING TO PS]`:**
    *   Entity-Relationship modeling, normalization level ($3\text{NF}$ vs. controlled denormalization), and declarative table partitioning (`PARTITION BY RANGE (created_at)` or `PARTITION BY HASH (tenant_id)`) are determined by the specific entities and volume projections of the Problem Statement.

---

### 2.2 Document & Key-Value Persistence (Agent Traces, Event Logs & Unstructured State)
*   **Engine Selection `[MANDATORY]`:** Amazon DynamoDB (for predictable single-digit millisecond latency at any scale) or MongoDB Atlas (for rich dynamic schema queries and complex aggregations).
*   **AI Agent Execution Traces & Telemetry `[MANDATORY]`:**
    *   Store non-deterministic LLM workflows, multi-agent reasoning graphs (LangGraph / CrewAI / AutoGen checkpoints), tool call inputs/outputs, latency breakdowns, and token consumption in the Document Store rather than polluting the core relational OLTP database.
    *   *Standard Agent Trace Document Structure:*
        ```json
        {
          "trace_id": "tr_01J8X9Z2A4...",
          "tenant_id": "tn_99281",
          "session_id": "sess_77412",
          "agent_version": "v2.4.1-ps-custom",
          "execution_steps": [
            {
              "step_id": 1,
              "node_type": "TOOL_EXECUTION",
              "tool_name": "vector_retriever",
              "latency_ms": 42.6,
              "status": "SUCCESS",
              "input_hash": "sha256:8f9a...",
              "output_summary": "Retrieved 4 chunks"
            }
          ],
          "token_metrics": {
            "prompt_tokens": 1420,
            "cached_prompt_tokens": 1100,
            "completion_tokens": 310,
            "estimated_cost_usd": 0.00184
          },
          "ttl_epoch": 1796515200
        }
        ```
*   **Single-Table Design & Access Pattern Modeling (DynamoDB) `[ACCORDING TO PS]`:**
    *   Partition Key (`PK`) and Sort Key (`SK`) composite structures (e.g., `PK: TENANT#<id>`, `SK: TRACE#<timestamp>#<trace_id>`) and Global Secondary Index (GSI) overloading must be designed around the exact query access patterns dictated by the PS.
*   **Write Sharding for Hot Partitions `[MANDATORY]`:**
    *   Append a calculated hash suffix or random shard number ($0 \dots N$) to high-velocity Partition Keys to prevent DynamoDB hot-partition throttling (`ProvisionedThroughputExceededException`).
*   **Automated Ephemeral Data Expiration (TTL) `[MANDATORY]`:**
    *   Enable native engine TTL (`ttl_epoch` in DynamoDB or TTL index in MongoDB) to automatically purge expired execution traces, webhook idempotency keys, and temporary state at zero write-unit cost.

---

### 2.3 Vector, Graph & Time-Series Extensions
*   **Vector Database for RAG & Semantic Search `[MANDATORY]`:**
    *   Use `pgvector` (with **HNSW** indexing: `m = 16`, `ef_construction = 64`) inside PostgreSQL for unified transactional metadata filtering, or a dedicated engine (**Qdrant / Pinecone / Milvus**) if vector scale exceeds $10^7$ embeddings.
    *   **Hybrid Search with Reciprocal Rank Fusion (RRF) `[MANDATORY]`:** Never rely solely on dense vector search. Combine dense semantic embeddings with sparse lexical matching (BM25 / `tsvector`) using RRF:
        $$\text{RRF\_Score}(d \in D) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$
        where $k = 60$ is the smoothing constant and $r_m(d)$ is the rank of document $d$ in retrieval method $m$.
    *   **Embedding Model, Chunking Strategy & Distance Metric `[ACCORDING TO PS]`:** Whether to use Cosine Similarity ($\cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$), Euclidean ($L_2$) distance, or Inner Product, as well as chunk sizes (e.g., $256$ vs. $1024$ tokens) and domain-specific embedding models (e.g., legal, medical, code), depends on the PS domain.
*   **Time-Series / Analytical Store (ClickHouse / TimescaleDB) `[ACCORDING TO PS]`:**
    *   Deployed when the PS involves high-frequency IoT ingestion, financial tick data, real-time user analytics dashboards, or usage-based billing metering.
*   **Graph Database (Neo4j / Amazon Neptune / Apache AGE) `[ACCORDING TO PS]`:**
    *   Deployed when the PS requires multi-hop relationship traversal, fraud ring detection, social graphs, or GraphRAG knowledge graphs.

---

## 3. Cross-Database Consistency & Polyglot Synchronization

When writing across PostgreSQL, MongoDB/DynamoDB, Vector Stores, and Redis, naive dual-writes in application code will cause permanent data corruption during partial network failures.

### 3.1 Transactional Outbox Pattern `[MANDATORY]`
*   Whenever a core transaction in PostgreSQL must trigger an update in DynamoDB, a vector index, or an external service, write both the business entity and an `outbox_events` record within the **same ACID database transaction**.
*   *Outbox Table Schema `[MANDATORY]`:*
    ```sql
    CREATE TABLE outbox_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        aggregate_type VARCHAR(100) NOT NULL,
        aggregate_id VARCHAR(100) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        processed_at TIMESTAMPTZ NULL
    );
    CREATE INDEX idx_outbox_unprocessed ON outbox_events (created_at) WHERE processed_at IS NULL;
    ```

### 3.2 Change Data Capture (CDC) Pipeline `[MANDATORY]`
*   Use **Debezium**, **AWS DMS**, or a transactional tailing worker reading PostgreSQL's Write-Ahead Log (`wal_level = logical`) to stream committed outbox events to a message bus (Kafka / AWS SQS / EventBridge) and synchronize downstream Document, Vector, and Cache layers asynchronously with **At-Least-Once** delivery guarantees.
*   **Idempotent Consumers `[MANDATORY]`:** Every downstream consumer updating MongoDB, DynamoDB, or Vector indexes must track `event_id` or `version_sequence` to ensure replayed messages are idempotent.

### 3.3 Distributed Saga Pattern `[ACCORDING TO PS]`
*   For multi-step business workflows spanning external microservices (e.g., Payment Gateway $\to$ Inventory Reservation $\to$ 3D Asset Minting), implement either **Orchestration** (Temporal.io / AWS Step Functions) or **Choreography** with explicit compensating rollback transactions designed around PS business rules.

---

## 4. Application & Semantic LLM Caching Architecture

A high-performance web platform treats the database as a fallback of last resort. The caching hierarchy must eliminate redundant compute, network round-trips, and LLM token expenditure.

### 4.1 Multi-Tier Application Caching (L1 + L2)
*   **Engine Selection `[MANDATORY]`:** **Valkey** or **Redis** (Cluster Mode Enabled with Multi-AZ Auto-Failover via Amazon ElastiCache) paired with an in-process **L1 Memory Cache** (e.g., LRU/W-TinyLFU in Node.js/Python/Go) for ultra-hot immutable configuration data.
*   **Caching Read/Write Topologies:**
    *   **Cache-Aside (Lazy Loading) with Stale-While-Revalidate `[MANDATORY]`:** Serve slightly stale cached responses immediately while refreshing the cache asynchronously in the background to keep tail latency ($P_{99}$) under $10\text{ ms}$.
    *   **Write-Through / Write-Behind `[ACCORDING TO PS]`:** Applied selectively based on whether the PS prioritizes read-after-write consistency (Write-Through) or extreme write throughput such as live view counters and collaborative cursors (Write-Behind).
*   **Cache Stampede (Thundering Herd) Protection `[MANDATORY]`:**
    *   **Request Coalescing (Singleflight):** If 1,000 concurrent requests miss the same cache key simultaneously, coalesce them in-process or via a distributed lock so only **1** query hits PostgreSQL, broadcasting the result to all 999 waiting callers.
    *   **Jittered TTLs:** Add random jitter ($\pm 10\%$) to all cache expiration durations to prevent mass synchronized evictions.
    *   **Probabilistic Early Expiration (XFetch Algorithm) `[MANDATORY]`:** Recompute high-traffic cache keys before they expire based on the formula:
        $$\text{CurrentTime} - (\delta \cdot \beta \cdot \ln(\text{rand}(0,1))) \ge \text{ExpiryTime}$$
        where $\delta$ is the time taken to recompute the value and $\beta > 0$ is a tuning multiplier (typically $\beta = 1.0$).
*   **Cache Penetration Defense `[MANDATORY]`:**
    *   Cache negative lookups (`NULL_SENTINEL` with a short $30\text{--}60\text{s}$ TTL) or maintain a **Redis Bloom Filter** (`BF.EXISTS`) in front of database queries so malicious requests for non-existent UUIDs never reach PostgreSQL.
*   **Session State, Rate Limiting & Real-Time Coordination `[MANDATORY]`:**
    *   Store active session revocation lists, OAuth2 PKCE states, and Sliding Window / Token Bucket rate-limit counters executed atomically via **Redis/Valkey Lua Scripts** (`EVALSHA`).

---

### 4.2 Semantic LLM Caching (Zero-Token Cost Inference)
Repeated or semantically identical user prompts must never trigger redundant, slow, and expensive LLM API calls.

```
User Query ──► Fast Normalize ──► L1 Exact Hash Check (Valkey) ──► [HIT] ──► Return (0 ms, $0)
                                          │ [MISS]
                                          ▼
                               Compute Query Embedding
                                          │
                                          ▼
                        L2 Vector Similarity Search (Valkey/Qdrant)
                       [Filter: tenant_id + role_scope + prompt_ver]
                                          │
                        ┌─────────────────┴─────────────────┐
             [Sim >= Threshold (e.g., 0.94)]       [Sim < Threshold]
                        │                                   │
                        ▼                                   ▼
            Return Cached LLM Response          Execute Full RAG + LLM Call
             (Latency: <25ms, $0 Token)         Stream & Write Async to L1/L2
```

*   **Two-Stage LLM Cache Pipeline `[MANDATORY]`:**
    1.  **Stage 1 — Exact-Match Normalized Hash Cache:** Lowercase, strip punctuation/whitespace, hash (`SHA-256(tenant_id + model_id + system_prompt_hash + normalized_query)`), and check Valkey (`O(1)` lookup in $< 1\text{ ms}$).
    2.  **Stage 2 — Vector-Similarity Semantic Cache:** Convert the incoming query into an embedding using a lightweight, low-latency embedding model (e.g., `text-embedding-3-small`, `bge-small-en-v1.5`, or local ONNX model) and perform an HNSW KNN search in Valkey Vector Search / Redis Stack / Qdrant.
*   **Security & Multi-Tenant Cache Isolation `[MANDATORY]`:**
    *   **Never perform global un-scoped semantic cache lookups.** Every vector search in the semantic cache **must** enforce pre-filtering on metadata attributes:
        `FILTER: (tenant_id == $tenant) AND (rbac_scope == $role) AND (prompt_template_version == $ver) AND (knowledge_base_epoch == $epoch)`
    *   *Why it is Mandatory:* Without strict metadata pre-filtering, User B could ask a semantically similar question to User A and receive a cached LLM response containing User A's private tenant data.
*   **Negative Feedback & Cache Poisoning Eviction `[MANDATORY]`:**
    *   Wire the UI "Thumbs Down / Regenerate" button directly to a cache eviction endpoint that deletes the associated vector entry from the semantic cache so bad hallucinations are never served twice.
*   **Provider-Level Prompt Prefix Caching `[MANDATORY]`:**
    *   Structure system prompts, tool definitions, and static RAG context at the **beginning** of the prompt payload to maximize automatic KV-cache hits on LLM providers (OpenAI / Anthropic / Gemini Context Caching), cutting input token costs by $50\text{--}90\%$ even on semantic cache misses.
*   **Similarity Threshold $\tau$ & TTL Calibration `[ACCORDING TO PS]`:**
    *   The cosine similarity threshold $\tau$ (typically $0.90 \le \tau \le 0.97$) and cache TTL depend on the PS domain sensitivity (e.g., medical/financial queries require $\tau \ge 0.97$ with negation/number entity verification; creative or general FAQ assistants can use $\tau \approx 0.91$).

---

## 5. Protected Object, Media & 3D Asset Storage Lifecycle

Proprietary `.glb` / `.gltf` 3D models, CAD files, textures, and private user uploads represent high-value intellectual property that must be protected from automated scraping while delivering $60\text{ FPS}$ progressive rendering in the browser.

### 5.1 Zero-Trust S3 & CloudFront OAC Architecture `[MANDATORY]`
*   **Private S3 Bucket Hardening `[MANDATORY]`:**
    *   Enable `BlockPublicAcls = true`, `IgnorePublicAcls = true`, `BlockPublicPolicy = true`, and `RestrictPublicBuckets = true`.
    *   Disable ACLs entirely (`ObjectOwnership = BucketOwnerEnforced`).
    *   Enable Server-Side Encryption with AWS KMS (`SSE-KMS`) or `SSE-S3` and enforce `aws:SecureTransport` (TLS-only) in the bucket policy.
*   **CloudFront Origin Access Control (OAC) `[MANDATORY]`:**
    *   Use **Origin Access Control (OAC)** (replacing legacy OAI) so only the designated CloudFront distribution can read from the private S3 bucket using short-term AWS SigV4 cryptographic signatures.
    *   *Mandatory S3 Bucket Policy for OAC:*
        ```json
        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Sid": "AllowCloudFrontServicePrincipalReadOnly",
              "Effect": "Allow",
              "Principal": { "Service": "cloudfront.amazonaws.com" },
              "Action": "s3:GetObject",
              "Resource": "arn:aws:s3:::prod-protected-3d-assets-bucket/*",
              "Condition": {
                "StringEquals": {
                  "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/EDFDVBD6EXAMPLE"
                }
              }
            }
          ]
        }
        ```

### 5.2 Anti-Scraping & Cryptographic Asset Delivery `[MANDATORY]`
*   **CloudFront Signed URLs & Signed Cookies (RSA / ECDSA Key Groups) `[MANDATORY]`:**
    *   Use **CloudFront Signed URLs** with a strict custom policy (expiration window of $30\text{--}120\text{ seconds}$ and optional client IP CIDR binding) for standalone `.glb` files.
    *   Use **CloudFront Signed Cookies** when a 3D scene references dozens of external `.bin` buffers, `.ktx2` textures, or LOD chunks under a shared path prefix (`/scenes/project_42/*`), avoiding URL query-string mutation that breaks standard glTF relative path resolvers.
*   **Direct-to-S3 Presigned Multipart Upload Pipeline `[MANDATORY]`:**
    *   Never proxy large binary uploads through backend API servers. Generate short-lived **S3 Presigned PUT / Multipart Upload URLs** with strict constraints on `Content-Type`, `Content-Length-Range`, and `x-amz-checksum-sha256`.
    *   Scan uploaded objects asynchronously via an EventBridge $\to$ Lambda Quarantine Pipeline (magic-byte file verification + malware/structural validation) before promoting objects from `s3://staging-quarantine/` to `s3://prod-protected-assets/`.
*   **Client-Side Anti-Ripping & Memory Protection for `.glb` Models `[MANDATORY]`:**
    *   **Encrypted Chunk Streaming:** Encrypt proprietary `.glb` payloads at rest using AES-GCM. Fetch the encrypted binary stream via `fetch()`, decrypt in a Web Worker using a session-derived key, instantiate an ephemeral `ArrayBuffer`, pass directly into `GLTFLoader.parse(arrayBuffer)`, and immediately zero out the buffer reference (`buffer.fill(0)`) so raw `.glb` files never sit exposed in the browser Network tab.
    *   **Invisible Stumbling / Vertex Watermarking:** Inject microscopic, imperceptible geometric perturbations into specific non-visible vertices tied to the downloading user's `user_id` or `tenant_id` for forensic provenance tracking if a 3D model is leaked.

### 5.3 High-Performance 3D Asset & Media Optimization Pipeline
*   **Automated 3D Compression Pipeline (`gltf-transform` / `gltfpack`) `[MANDATORY]`:**
    *   **Geometry Compression:** Apply **Meshopt** or **Draco** compression to reduce mesh geometry size by $70\text{--}90\%$. (Prefer **Meshopt** combined with Brotli/Gzip transport compression for faster WebAssembly decoding on mobile/low-power devices).
    *   **GPU Texture Transcoding:** Convert all embedded PNG/JPEG textures into **KTX2 with Basis Universal (UASTC for normal/PBR maps, ETC1S for diffuse maps)**. KTX2 stays compressed directly inside GPU VRAM (BC7, ASTC, ETC2), reducing GPU memory usage by up to $80\%$ and preventing WebGL Context Lost crashes.
*   **HTTP `Range` Requests & Progressive LOD Streaming `[MANDATORY]`:**
    *   Enable `Accept-Ranges: bytes` on CloudFront/S3 and ship multi-resolution Level of Detail ($\text{LOD}_0, \text{LOD}_1, \text{LOD}_2$) hierarchies so the viewport renders a low-poly proxy within $< 200\text{ ms}$ while high-resolution textures and meshes stream progressively.
*   **3D Visual Theme, Lighting, Shaders & Asset Composition `[ACCORDING TO PS]`:**
    *   The artistic style (photorealistic PBR vs. stylized cel-shaded/low-poly), HDRI environment maps, polygon count budgets, camera choreography, and specific 3D models loaded are strictly governed by the Problem Statement's theme and UX goals.

### 5.4 Storage Lifecycle Tiering & Cost Governance `[MANDATORY]`
*   Configure automated **S3 Lifecycle Rules** on every bucket:
    1.  `AbortIncompleteMultipartUpload`: Automatically purge abandoned multipart chunks after **7 days** (`[MANDATORY]`).
    2.  `S3 Intelligent-Tiering`: Automatically move objects with unknown or changing access patterns between Frequent, Infrequent ($40\%$ cheaper after 30 days), and Archive Instant Access ($68\%$ cheaper after 90 days) tiers with zero retrieval fees (`[MANDATORY]`).
    3.  `NoncurrentVersionExpiration`: Retain a rolling window of previous object versions (e.g., 30 days) for accidental overwrite protection, then permanently expire noncurrent versions (`[MANDATORY]`).
    4.  `Glacier Deep Archive` transition timelines for cold regulatory archives (`[ACCORDING TO PS]`).

---

## 6. Zero-Downtime Migrations, Backups & Compliance Deletion

Production systems must evolve schemas without dropping a single user request, survive catastrophic infrastructure failures, and mathematically guarantee the permanent erasure of user data upon regulatory request.

### 6.1 Zero-Downtime Schema Migrations (Expand-and-Contract Pattern) `[MANDATORY]`
*   **Tooling Integration `[MANDATORY]`:** **Alembic** (Python/SQLAlchemy), **Prisma Migrate / Drizzle** (TypeScript), **Atlas**, or **Flyway** integrated into the CI/CD pipeline with automated pre-flight SQL linting (Squawk / Atlas Lint).
*   **The 4-Phase Expand-and-Contract Lifecycle `[MANDATORY]`:**
    Never rename a column, change a column type destructively, or add a `NOT NULL` constraint without a default in a single deployment while old application containers are still running.
    1.  **Phase 1 (Expand):** Add the new nullable column (`ADD COLUMN new_col TEXT NULL`). Deploy dual-write application code that writes to both `old_col` and `new_col` while reading from `old_col`.
    2.  **Phase 2 (Backfill):** Run a batched, throttled background migration script (`UPDATE ... WHERE id BETWEEN x AND y`) with `pg_sleep()` intervals to avoid replication lag and IOPS exhaustion.
    3.  **Phase 3 (Switch Reads):** Verify $100\%$ backfill parity. Deploy application code that reads from and writes only to `new_col`.
    4.  **Phase 4 (Contract):** In a subsequent release, safely drop `old_col` (`DROP COLUMN old_col`).
*   **Safe PostgreSQL DDL Locking Rules `[MANDATORY]`:**
    *   **Always** set explicit timeouts at the top of every migration script so a blocked migration fails fast instead of queuing behind a long query and blocking all subsequent application reads/writes:
        ```sql
        SET lock_timeout = '3s';
        SET statement_timeout = '15s';
        ```
    *   **Concurrent Index Creation:** Always use `CREATE INDEX CONCURRENTLY` and `DROP INDEX CONCURRENTLY` (executed outside a transaction block) so table writes are never blocked.
    *   **Two-Step Foreign Keys & `CHECK` Constraints:** Add constraints using `NOT VALID` first (acquires lock momentarily without scanning existing rows), then run `VALIDATE CONSTRAINT` in a separate step (scans table with a light `ShareUpdateExclusiveLock` that does not block reads or writes):
        ```sql
        ALTER TABLE orders ADD CONSTRAINT fk_orders_user
            FOREIGN KEY (user_id) REFERENCES users (id) NOT VALID;
        ALTER TABLE orders VALIDATE CONSTRAINT fk_orders_user;
        ```

---

### 6.2 Backups, Point-in-Time Recovery (PITR) & Disaster Recovery
*   **Continuous Point-in-Time Recovery (PITR) `[MANDATORY]`:**
    *   Enable continuous transaction log shipping (WAL archiving to S3 for PostgreSQL, continuous PITR for DynamoDB, oplog tailing for MongoDB, and S3 Versioning) allowing restoration to **any single second** within the retention window (up to 35 days) to recover from accidental `DROP`/`DELETE` bugs.
*   **Ransomware-Proof Immutable Backups `[MANDATORY]`:**
    *   Replicate daily snapshots to an isolated **AWS Backup Vault** in a separate AWS Security Account with **Vault Lock (WORM - Write Once, Read Many)** enabled in Compliance Mode, ensuring even a compromised root credential cannot delete backups.
*   **Automated Backup Restore Verification (Chaos DR Drills) `[MANDATORY]`:**
    *   Backups are worthless if restores fail. Run an automated weekly cron workflow (EventBridge $\to$ Step Functions) that spins up an ephemeral database from the latest PITR snapshot, runs integrity checksum queries, records the exact restoration duration, and tears down the instance.
*   **RTO / RPO SLA Targets & Multi-Region Topology `[ACCORDING TO PS]`:**
    *   Recovery Time Objective ($\text{RTO}$) and Recovery Point Objective ($\text{RPO}$) thresholds, as well as the choice between Multi-AZ Single-Region, Cross-Region Warm Standby, or Multi-Region Active-Active (Aurora Global Database + DynamoDB Global Tables), are determined by the Problem Statement's tier and compliance budget.

---

### 6.3 Automated Compliance Deletion & Right-to-be-Forgotten (GDPR / CCPA / DPDP)
When a user invokes their statutory Right to Erasure (GDPR Art. 17 / CCPA / India DPDP Act), their Personal Identifiable Information (PII) is scattered across PostgreSQL tables, DynamoDB agent traces, Vector embeddings, Redis caches, S3 objects, and immutable PITR backups.

```
[Erasure Request API]
         │
         ▼
[Compliance Deletion Orchestrator (Step Functions / Temporal)]
         ├──► 1. Redis/Valkey: Revoke Sessions + Purge Semantic Cache Vectors for User
         ├──► 2. Vector DB: Delete Embeddings WHERE metadata.user_id = $uid
         ├──► 3. Document DB: Delete Agent Traces & Unstructured Logs for $uid
         ├──► 4. S3 Storage: Permanent DeleteObject + Version Purge for User Uploads
         ├──► 5. PostgreSQL: Anonymize/Scrub PII Columns + Preserve Financial Ledger Integrity
         └──► 6. KMS / Key Vault: Destroy User's Data Encryption Key (Crypto-Shredding)
                                         │
                                         ▼
                         [Emit Signed Cryptographic Erasure Certificate]
```

*   **Polyglot Erasure Orchestrator `[MANDATORY]`:**
    *   Implement a durable state machine that systematically deletes or anonymizes user records across every persistence tier (`PostgreSQL` $\to$ `DynamoDB/MongoDB` $\to$ `Vector Index` $\to$ `Redis/Valkey` $\to$ `S3 Buckets`) with retry policies and dead-letter alerting.
*   **Crypto-Shredding for Immutable Backups & Event Logs `[MANDATORY]`:**
    *   *The Problem:* You cannot edit a 30-day-old PostgreSQL PITR snapshot or an immutable Kafka/S3 audit log to remove a single user's PII without destroying the backup for all other users.
    *   *The Solution (`[MANDATORY]`):* Encrypt every user's sensitive PII fields using a per-user **Data Encryption Key (DEK)** stored in a dedicated key registry table (wrapped by an AWS KMS Master Key). When the user requests erasure:
        1. Scrub live database records.
        2. **Permanently delete the user's DEK** from the key registry.
        3. Even if an old PITR backup is restored months later, the user's historical PII ciphertext inside that backup is mathematically unrecoverable (crypto-shredded).
*   **Relational Referential Integrity vs. Legal Hold Retention `[ACCORDING TO PS]`:**
    *   While PII (name, email, phone, IP, biometric/3D avatars) must be purged, statutory tax/financial records (e.g., invoice totals, ledger entries) often must be retained for $7\text{ years}$ under local accounting laws. Configure the erasure workflow to **pseudonymize** foreign keys (`email = 'deleted_user_8f9a@redacted.invalid'`, `pii_scrubbed = true`) rather than cascading hard `DELETE` statements onto financial ledger tables, calibrated to the jurisdiction of the PS.

---

## 7. Master Classification Reference Matrix

| Domain Layer | Concept / Architectural Component | Classification | Rationale / Governance Rule |
| :--- | :--- | :---: | :--- |
| **Relational DB** | Multi-AZ PostgreSQL + RDS Proxy + Row-Level Security (RLS) | `[MANDATORY]` | Core high availability, connection multiplexing, and tenant isolation. |
| **Relational DB** | B-Tree, GIN (`JSONB`), Partial & Covering Indexes | `[MANDATORY]` | Directly prevents full-table scans and improves web latency. |
| **Relational DB** | Entity Schema, Normalization & Sharding/Partitioning Keys | `[ACCORDING TO PS]` | Dictated by domain entities and specific business logic. |
| **Document DB** | Agent Execution Traces, Tool Logs & TTL Auto-Expiration | `[MANDATORY]` | Essential observability and storage hygiene for modern AI/web apps. |
| **Document DB** | DynamoDB Single-Table PK/SK Design & GSI Overloading | `[ACCORDING TO PS]` | Depends on exact application query access patterns. |
| **Vector / Graph** | Hybrid Search (Dense Vector + Sparse BM25 via RRF) | `[MANDATORY]` | Superior retrieval accuracy over naive vector-only search. |
| **Vector / Graph** | Embedding Model, Dimensionality, Graph DB & Time-Series DB | `[ACCORDING TO PS]` | Selected based on domain modality and data relationships. |
| **Polyglot Sync** | Transactional Outbox Pattern + CDC + Idempotent Consumers | `[MANDATORY]` | Prevents dual-write corruption across polyglot data stores. |
| **App Caching** | Valkey/Redis Multi-AZ + L1/L2 Cache + Stampede Protection | `[MANDATORY]` | Protects databases from traffic spikes and guarantees low latency. |
| **LLM Caching** | Exact-Match + Tenant-Scoped Vector Semantic Cache | `[MANDATORY]` | Eliminates token costs and cuts repeated LLM latency to $< 25\text{ ms}$. |
| **LLM Caching** | Semantic Similarity Threshold ($\tau$) & Domain TTLs | `[ACCORDING TO PS]` | Calibrated to domain precision vs. recall tolerance. |
| **3D / Object Storage**| Private S3 + CloudFront OAC + Signed URLs/Cookies | `[MANDATORY]` | Prevents unauthorized bucket access and proprietary asset scraping. |
| **3D / Object Storage**| Draco/Meshopt Geometry + KTX2 GPU Texture Compression | `[MANDATORY]` | Drastically improves web load speed, VRAM usage, and FPS. |
| **3D / Object Storage**| 3D Art Style, Shaders, Lighting Theme & Polygon Budgets | `[ACCORDING TO PS]` | Governed by the visual theme and UX direction of the PS. |
| **Migrations & DR** | Expand-and-Contract Migrations + Concurrent Indexing + PITR | `[MANDATORY]` | Guarantees zero downtime during deployments and zero data loss. |
| **Migrations & DR** | RTO/RPO Targets & Multi-Region Active-Active Topology | `[ACCORDING TO PS]` | Dependent on enterprise SLA requirements and infrastructure budget. |
| **Compliance** | Cascading Polyglot Erasure + Per-User DEK Crypto-Shredding | `[MANDATORY]` | Ensures legally verifiable right-to-be-forgotten across live & backup data. |
| **Compliance** | Legal Hold Windows & Financial Ledger Anonymization Rules | `[ACCORDING TO PS]` | Governed by the target geographic jurisdiction and industry regulations. |

---

## 8. Antigravity Readiness & Observability Checklist `[MANDATORY]`

Before marking any storage or caching implementation complete, verify that the following telemetry and operational guardrails are wired into the codebase:

1.  **OpenTelemetry (OTel) Auto-Instrumentation:** Every PostgreSQL query, DynamoDB/MongoDB operation, Valkey command, and S3 request emits distributed trace spans with latency histograms ($P_{50}, P_{95}, P_{99}$).
2.  **Query Performance Sentinel:** `pg_stat_statements` is enabled in PostgreSQL; any query exceeding $100\text{ ms}$ execution time or performing a sequential scan on tables with $> 10,000$ rows triggers an automated alert.
3.  **Cache Efficiency Metrics:** Track and expose `cache_hit_ratio`, `semantic_cache_hit_ratio`, and `tokens_saved_total` via Prometheus/CloudWatch. Target an application cache hit ratio $\ge 90\%$ and semantic LLM cache hit ratio $\ge 35\%$.
4.  **Strict Secret Rotation:** Database credentials are managed via AWS Secrets Manager with automated rotation or IAM Database Authentication—zero static credentials in `.env` files or source control.