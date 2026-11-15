# Developer Velocity: AI Skills, MCP Architecture & Agentic Workflow Tooling
> **Target Environment:** Google Antigravity IDE / App / CLI (`.agents/skills/`, `AGENTS.md`, `~/.gemini/config/mcp_config.json`) & Production Agent Runtimes  
> **Purpose:** Definitive Knowledge Source, System Architecture Reference, and Execution Playbook for High-Velocity, Production-Grade Web & 3D Application Engineering.

---

## 0. Classification Governance & Decision Matrix

To eliminate ambiguity during autonomous or AI-assisted engineering inside **Antigravity**, every architectural concept, tool, workflow, and design decision in this document is governed by a strict two-tier classification rule:

1. **`[MANDATORY]` — Non-Negotiable Engineering & Web Excellence**
   * **Rule:** *Anything that universally improves the web application, code quality, security, performance, accessibility, observability, or developer velocity is **`[MANDATORY]`**—never "optional."*
   * **Scope:** Core Model Context Protocol (MCP) safety architecture, live documentation grounding (Context7), automated browser/DOM verification (Playwright/Chrome DevTools), core `SKILL.md` playbooks, strict TypeScript/schema validation, Core Web Vitals budgets ($LCP \le 2.5\text{s}$, $INP \le 200\text{ms}$, $CLS \le 0.1$), security hardening, responsive layout integrity, and deterministic CI/CD verification loops.
2. **`[ACCORDING TO PS]` — Driven by the Problem Statement**
   * **Rule:** *Architectural flavors, aesthetic themes, domain entities, and specialized third-party integrations that depend on the specific project prompt, client brief, or hackathon/production Problem Statement (PS).*
   * **Scope:** Visual theme & mood (e.g., Dark Sci-Fi vs. Minimalist Healthcare), color palette tokens, typography pairings, whether 3D/WebGL/shaders are central or decorative, domain-specific database schemas, custom business-logic MCP tools, and target cloud deployment topology (if constrained by the PS).

| Dimension | Classification | Rationale |
| :--- | :--- | :--- |
| **MCP Security, Transport & Schema Validation** | **`[MANDATORY]`** | Prevents tool injection, unauthorized mutations, and malformed payloads. |
| **Context7 Live Docs Grounding** | **`[MANDATORY]`** | Eliminates hallucinated or deprecated API calls across fast-moving SDKs. |
| **Automated DOM, Console & Network Inspection** | **`[MANDATORY]`** | Ensures zero runtime errors, broken layouts, or unhandled failed requests. |
| **3D / WebGL Scene & Shader Inspection Pipeline** | **`[MANDATORY]`** *(if 3D is used)* / **`[ACCORDING TO PS]`** *(whether 3D is required)* | Feature inclusion depends on PS; if 3D is present, GPU/FPS/shader telemetry is mandatory. |
| **Modular `SKILL.md` Playbook Architecture** | **`[MANDATORY]`** | Enforces progressive context disclosure and deterministic engineering standards. |
| **Core Web Vitals, Accessibility (WCAG AA) & SEO** | **`[MANDATORY]`** | Directly improves web quality for every user and device. |
| **Visual Theme, Color Palette & Typography Mood** | **`[ACCORDING TO PS]`** | Must align with the domain, brand identity, and user persona defined in the PS. |
| **Domain Data Models & Business Rules** | **`[ACCORDING TO PS]`** | Derived directly from the functional requirements of the Problem Statement. |
| **Cloud Provider & Database Engine Selection** | **`[ACCORDING TO PS]`** *(Choice)* / **`[MANDATORY]`** *(MCP Explorer & IaC Safety)* | Which DB/Cloud to use follows the PS; managing it via safe MCP tooling is mandatory. |

---

## 1. Repository & Antigravity Workspace Topology `[MANDATORY]`

For Antigravity (IDE, Desktop App, and CLI) to operate at peak velocity without exhausting context windows, the repository must follow a standardized **Progressive Disclosure Topology**. Antigravity automatically discovers workspace instructions from `AGENTS.md` at the root and modular skills from `.agents/skills/<skill-name>/SKILL.md`.

```text
project-root/
├── AGENTS.md                                  # [MANDATORY] Root system instructions & routing rules for Antigravity
├── CLAUDE.md                                  # [MANDATORY] Symlink or mirror to AGENTS.md for cross-agent compatibility
├── .gemini/
│   └── config/
│       ├── mcp_config.json                    # [MANDATORY] Workspace-scoped MCP server registry
│       └── hooks.json                         # [MANDATORY] Pre/Post tool execution verification hooks
├── .agents/
│   └── skills/                                # [MANDATORY] Modular Progressive-Disclosure Agent Playbooks
│       ├── api-scaffolding/
│       │   ├── SKILL.md                       # Frontmatter (name, description) + core instructions
│       │   ├── templates/                     # Boilerplate route/controller/OpenAPI templates
│       │   └── scripts/validate-openapi.mjs   # Black-box verification script
│       ├── security-checklist/
│       │   ├── SKILL.md
│       │   └── references/owasp-2026-rules.md
│       ├── shader-webgl-optimization/
│       │   ├── SKILL.md
│       │   └── scripts/inspect-webgl-scene.js
│       ├── aws-deployment/
│       │   ├── SKILL.md
│       │   └── templates/cdk-stack.ts
│       ├── frontend-web-excellence/
│       │   └── SKILL.md
│       ├── database-migrations/
│       │   └── SKILL.md
│       └── tdd-visual-verification/
│           └── SKILL.md
├── mcp-servers/                               # [MANDATORY] Custom FastMCP Servers (Dev & Runtime)
│   ├── runtime-domain-mcp/                    # [ACCORDING TO PS] Domain-specific tools for in-app AI agents
│   │   ├── server.py                          # FastMCP Python server (or server.ts for TypeScript)
│   │   ├── schemas.py                         # Strict Pydantic / Zod schemas
│   │   └── auth_middleware.py                 # [MANDATORY] OAuth2 / RBAC / Audit logging middleware
│   └── dev-telemetry-mcp/                     # [MANDATORY] Custom project diagnostics & build health MCP
└── docs/
    ├── llms.txt                               # [MANDATORY] Concise index of project architecture for AI ingestion
    ├── llms-full.txt                          # [MANDATORY] Deep project documentation compiled for context grounding
    └── problem-statement-spec.md              # [ACCORDING TO PS] Parsed requirements, theme tokens & user stories
```

---

## 2. Model Context Protocol (MCP) Architecture

The Model Context Protocol (MCP) is the standardized "USB-C for AI systems," decoupling how coding agents (at development time) and application agents (at production runtime) discover context, read resources, and invoke executable tools.

### 2.1 Dual-Plane MCP Architecture `[MANDATORY]`

A professional AI-native web system separates MCP into two distinct operational planes:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        PLANE 1: DEVELOPMENT-TIME MCP SUITE                       │
│   Host / Client: Google Antigravity IDE / CLI (Local Workstation / Git Worktree) │
├──────────────────┬────────────────────┬────────────────────┬─────────────────────┤
│  Context7 MCP    │ Playwright &       │ Database Explorer  │ AWS / Cloud & IaC   │
│  (Live SDK Docs) │ Chrome DevTools MCP│ MCP (Postgres/DB)  │ MCP (@awslabs/mcp)  │
└──────────────────┴────────────────────┴────────────────────┴─────────────────────┘
                                         │
                         Builds, Verifies & Deploys
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                       PLANE 2: RUNTIME PRODUCTION MCP MESH                       │
│   Host / Client: Web App Backend Agent Orchestrator (Next.js / FastAPI / Worker) │
├──────────────────┬────────────────────┬────────────────────┬─────────────────────┤
│  FastMCP Server  │ FastMCP App UI     │ Guardrails & Auth  │ Observability       │
│  (Domain Tools)  │ (Prefab / Iframe)  │ (JWT, RBAC, HITL)  │ (OpenTelemetry)     │
└──────────────────┴────────────────────┴────────────────────┴─────────────────────┘
```

1. **Plane 1 — Development-Time MCP Suite (`[MANDATORY]`):**
   * Runs locally via `stdio` or connects to managed remote endpoints via `Streamable HTTP` (`serverUrl` in Antigravity).
   * Empowers the IDE coding agent to fetch up-to-date documentation, inspect live browser DOM/WebGL states, query local/staging databases, and synthesize cloud infrastructure.
2. **Plane 2 — Runtime Production MCP Mesh (`[MANDATORY]` if the PS includes AI/Agent features; `[ACCORDING TO PS]` for specific domain tools):**
   * Runs inside your deployed production architecture using **FastMCP** over `Streamable HTTP` with stateless session management or horizontal Redis-backed state.
   * Exposes strictly typed domain actions, read-only resources, and interactive UI components to in-app autonomous agents.

### 2.2 Core MCP Primitives & Capabilities `[MANDATORY]`

Every MCP server built or integrated into the project must properly classify its capabilities across the six core MCP primitives:

| MCP Primitive | Direction | Purpose in Web Architecture | Classification |
| :--- | :--- | :--- | :--- |
| **1. Tools (`tools/call`)** | Model-Controlled (Client $\rightarrow$ Server) | Executable functions with side effects or computation (e.g., `run_migration`, `query_metrics`, `create_order`). Must include JSON Schema input/output validation and capability annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`). | **`[MANDATORY]`** |
| **2. Resources (`resources/read`)** | Application/Agent-Driven (Client $\rightarrow$ Server) | Read-only URI-addressed data streams (e.g., `db://schema/users`, `webgl://scene/graph`, `logs://build/latest`). Prevents polluting tool lists with passive data getters. | **`[MANDATORY]`** |
| **3. Prompts (`prompts/get`)** | User/Slash-Controlled (Client $\rightarrow$ Server) | Standardized, parameterized prompt templates exposed by the server (e.g., `/audit-sql-query`, `/optimize-threejs-material`). | **`[MANDATORY]`** |
| **4. Roots (`roots/list`)** | Client $\rightarrow$ Server | Defines the exact filesystem or URI boundaries (`file:///workspace/frontend`) an MCP server is permitted to operate within. | **`[MANDATORY]`** |
| **5. Elicitation (`elicitation/create`)** | Server $\rightarrow$ Client (User) | Allows an MCP tool mid-execution to request structured confirmation or missing parameters from the user before executing a high-risk operation. | **`[MANDATORY]`** |
| **6. Sampling (`sampling/createMessage`)** | Server $\rightarrow$ Client (LLM) | Allows an MCP server to request an LLM completion from the host client without holding its own API keys. | **`[ACCORDING TO PS]`** |

### 2.3 Standardized FastMCP Server Implementation (Python & TypeScript) `[MANDATORY]`

**FastMCP** is the standard high-level framework for building both development-time and runtime production MCP servers. It handles JSON Schema generation, Pydantic/Zod validation, `Streamable HTTP` and `stdio` transports, and interactive UI component serialization (`Prefab` apps).

#### A. Production-Grade Python FastMCP Server Template (`mcp-servers/runtime-domain-mcp/server.py`)

```python
import time
import logging
from typing import Annotated, Optional
from pydantic import BaseModel, Field
from fastmcp import FastMCP, Context

# Configure structured JSON audit logging [MANDATORY]
logger = logging.getLogger("mcp.security.audit")

mcp = FastMCP(
    name="EnterpriseDomainMCP",
    instructions="Provides safe, schema-validated access to application telemetry and domain actions."
)

# 1. Strict Input/Output Schemas [MANDATORY]
class DatabaseQueryInput(BaseModel):
    sql_query: Annotated[str, Field(description="Read-only SELECT query. Mutations are strictly blocked.")]
    limit: Annotated[int, Field(default=50, ge=1, le=500, description="Row limit to prevent context overflow.")]

class QueryResultOutput(BaseModel):
    row_count: int
    execution_ms: float
    rows: list[dict]

# 2. Read-Only Resource Exposure [MANDATORY]
@mcp.resource("config://app/environment-summary")
async def get_environment_summary() -> str:
    """Exposes non-sensitive runtime configuration and active feature flags."""
    return '{"node_env": "production", "webgl_enabled": true, "max_query_timeout_ms": 3000}'

# 3. Safe Tool with Annotations & Guardrails [MANDATORY]
@mcp.tool(
    annotations={
        "title": "Execute Safe Read-Only SQL",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": False
    }
)
async def execute_readonly_query(payload: DatabaseQueryInput, ctx: Context) -> QueryResultOutput:
    """Executes a read-only analytical query against the replica database with automatic row bounding."""
    start = time.perf_counter()
    normalized = payload.sql_query.strip().upper()
    
    # Deterministic SQL AST / Keyword Gate [MANDATORY]
    forbidden = ("INSERT ", "UPDATE ", "DELETE ", "DROP ", "ALTER ", "TRUNCATE ", "GRANT ", "EXEC ")
    if not normalized.startswith("SELECT") or any(token in normalized for token in forbidden):
        logger.warning(f"Blocked unsafe query attempt in session {ctx.session_id}: {payload.sql_query}")
        raise ValueError("SECURITY_VIOLATION: Only read-only SELECT statements are permitted by this tool.")

    await ctx.info(f"Executing bounded SELECT query (limit={payload.limit})...")
    
    # Simulated safe execution against read-replica
    sample_rows = [{"id": 1, "status": "healthy"}]
    elapsed = round((time.perf_counter() - start) * 1000, 2)
    
    return QueryResultOutput(
        row_count=len(sample_rows),
        execution_ms=elapsed,
        rows=sample_rows
    )

if __name__ == "__main__":
    # Supports 'stdio' for local IDE agents or 'streamable-http' for production microservices
    mcp.run(transport="streamable-http", host="127.0.0.1", port=8000)
```

#### B. Production Security Guardrails for MCP Servers `[MANDATORY]`
Every MCP server exposed to an IDE agent or a runtime LLM must enforce the **Six Pillars of MCP Safety**:
1. **Zero Raw Credential Exposure (`[MANDATORY]`):** Never pass database passwords, AWS secret keys, or session tokens through LLM tool arguments. Inject credentials exclusively via server-side environment variables or short-lived IAM roles.
2. **Deterministic Input Validation & Sanitization (`[MANDATORY]`):** Validate all tool inputs with Pydantic (Python) or Zod (TypeScript) before execution. Reject path traversal (`../`), shell metacharacters, and unbounded queries.
3. **Tool Capability Annotations & HITL Gates (`[MANDATORY]`):** Explicitly annotate every tool with `readOnlyHint` and `destructiveHint`. Any tool where `destructiveHint: true` (e.g., deleting cloud resources, altering production tables) must trigger a **Human-in-the-Loop (HITL)** approval prompt via Antigravity permissions or MCP `elicitation`.
4. **Token-Bounded Outputs (`[MANDATORY]`):** MCP tools must truncate, paginate, or summarize responses exceeding $4,000$ tokens so a single tool call cannot overflow the agent's context window.
5. **Tenant & RBAC Isolation (`[MANDATORY]`):** In runtime agents, propagate the authenticated user's JWT/OAuth2 claims into the MCP context so the agent can never access rows or resources outside that user's permission boundary.
6. **Indirect Prompt Injection Defense (`[MANDATORY]`):** Wrap untrusted external content returned by MCP tools (e.g., scraped web pages, user-submitted database records, GitHub issues) in explicit structural delimiters and strip hidden instruction overrides before feeding back into the model.

---

## 3. Development-Time MCP Suite (Antigravity Integration)

To maximize Developer Velocity, the coding agent must never guess documentation, code blindly without inspecting the browser DOM/canvas, or write database queries without knowing the live schema.

### 3.1 Master Antigravity MCP Configuration (`~/.gemini/config/mcp_config.json`) `[MANDATORY]`

Google Antigravity uses a unified MCP configuration file (`~/.gemini/config/mcp_config.json` globally or `.gemini/config/mcp_config.json` per workspace). Note that Antigravity specifies remote Streamable HTTP servers using the `serverUrl` key.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--headless=false"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "postgres-explorer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://readonly_agent:localpass@localhost:5432/app_db"
      ]
    },
    "aws-knowledge": {
      "serverUrl": "https://knowledge-mcp.global.api.aws"
    },
    "aws-iac": {
      "command": "uvx",
      "args": ["awslabs.iac-mcp-server@latest"],
      "env": {
        "AWS_PROFILE": "dev-sandbox",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

---

### 3.2 Deep Dive: Core Development-Time MCP Servers

#### 1. Context7 MCP — Live, Version-Accurate Documentation Grounding `[MANDATORY]`
* **Problem Solved:** LLMs suffer from training-cutoff drift and frequently hallucinate deprecated APIs in fast-moving libraries (e.g., Next.js App Router, React 19+, Three.js `WebGPURenderer`, Tailwind v4, FastMCP v4, AWS SDK v3).
* **How It Works:** Exposes `resolve-library-id` and `get-library-docs`. Instead of scraping bloated HTML pages (which waste $50\text{k}+$ tokens), Context7 injects high-signal, version-pinned Markdown code snippets and API signatures using $<10\%$ of the token budget.
* **Mandatory Agent Workflow Rule:**
  1. Before scaffolding any third-party SDK integration, the agent **must** invoke `resolve-library-id` for the target package (checking `package.json` or `pyproject.toml` for the exact version).
  2. Call `get-library-docs` focused on the specific module or hook required.
  3. Only write implementation code after verifying the live signature.

#### 2. Playwright MCP & Chrome DevTools MCP — Automated Browser, DOM & 3D Scene Inspection `[MANDATORY]`
* **Problem Solved:** Agents often write frontend code that compiles cleanly in TypeScript but fails visually at runtime (overlapping text, z-index collisions, hydration mismatches, silent `404`/`500` network errors, or broken WebGL shaders).
* **Core Verification Capabilities (`[MANDATORY]` for all Web Apps):**
  * **Accessibility Tree & Layout Audit:** Inspect computed CSS styles, bounding-box coordinates (`getBoundingClientRect()`), contrast ratios, and ARIA roles across Desktop ($1440\times900$), Tablet ($768\times1024$), and Mobile ($390\times844$) viewports.
  * **Console & Network Waterfall Gate:** Capture `console.error`, unhandled promise rejections, failed CORS preflights, and slow API payloads automatically after every UI change.
  * **Performance & Core Web Vitals Profiling:** Trigger DevTools performance traces to measure Scripting vs. Rendering vs. Painting time, Layout Shifts ($CLS$), and Long Animation Frames ($LoAF$).

#### 3. Automated 3D / WebGL / WebGPU Scene Inspection Architecture `[MANDATORY WHEN PS INCLUDES 3D]`
Standard DOM inspection sees a `<canvas>` element as an opaque black box. To allow Antigravity and Chrome DevTools MCP / Playwright MCP to autonomously inspect, debug, and optimize 3D scenes (Three.js, React Three Fiber, Babylon.js, Custom GLSL/WGSL Shaders), you **must** wire a **Development-Time 3D Scene Telemetry Bridge**.

* **The 3D Telemetry Bridge (`src/utils/webgl-mcp-bridge.ts`) (`[MANDATORY]` for 3D apps):**
  Expose a structured diagnostic object on `window.__MCP_3D_BRIDGE__` in development mode so the agent can invoke `evaluate_script` via Chrome DevTools MCP to read deterministic 3D metrics alongside visual screenshots:

```typescript
// src/utils/webgl-mcp-bridge.ts
import * as THREE from 'three';

export interface SceneTelemetryReport {
  fps: number;
  frameTimeMs: number;
  drawCalls: number;
  triangles: number;
  geometriesInMemory: number;
  texturesInMemory: number;
  programsCompiled: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  visibleMeshes: Array<{
    name: string;
    uuid: string;
    screenSpaceBounds: { minX: number; minY: number; maxX: number; maxY: number } | null;
    materialType: string;
  }>;
  shaderErrors: string[];
}

export function attachMcp3DBridge(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera
) {
  if (process.env.NODE_ENV === 'production') return;

  let lastTime = performance.now();
  let frames = 0;
  let currentFps = 60;
  let frameTimeMs = 16.6;

  const updateMetrics = () => {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      currentFps = Math.round((frames * 1000) / (now - lastTime));
      frameTimeMs = Number(((now - lastTime) / frames).toFixed(2));
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(updateMetrics);
  };
  requestAnimationFrame(updateMetrics);

  (window as any).__MCP_3D_BRIDGE__ = {
    getSceneReport(): SceneTelemetryReport {
      const info = renderer.info;
      const visibleMeshes: SceneTelemetryReport['visibleMeshes'] = [];

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh && obj.visible) {
          const mesh = obj as THREE.Mesh;
          const box = new THREE.Box3().setFromObject(mesh);
          const center = box.getCenter(new THREE.Vector3()).project(camera);
          visibleMeshes.push({
            name: mesh.name || 'unnamed_mesh',
            uuid: mesh.uuid,
            screenSpaceBounds: {
              minX: Number((((center.x + 1) * window.innerWidth) / 2).toFixed(1)),
              minY: Number((((-center.y + 1) * window.innerHeight) / 2).toFixed(1)),
              maxX: Number((((center.x + 1) * window.innerWidth) / 2).toFixed(1)),
              maxY: Number((((-center.y + 1) * window.innerHeight) / 2).toFixed(1)),
            },
            materialType: Array.isArray(mesh.material)
              ? mesh.material.map((m) => m.type).join(',')
              : mesh.material.type,
          });
        }
      });

      return {
        fps: currentFps,
        frameTimeMs,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        geometriesInMemory: info.memory.geometries,
        texturesInMemory: info.memory.textures,
        programsCompiled: info.programs?.length ?? 0,
        cameraPosition: camera.position.toArray() as [number, number, number],
        cameraTarget: [0, 0, 0],
        visibleMeshes,
        shaderErrors: (renderer.debug as any)?.shaderErrors ?? [],
      };
    },

    raycastClickAtScreenNormalized(ndcX: number, ndcY: number) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      return hits.map((h) => ({
        objectName: h.object.name,
        distance: Number(h.distance.toFixed(3)),
        point: h.point.toArray(),
      }));
    },
  };
}
```

* **How the Agent Uses This Bridge:**
  1. The agent calls `evaluate_script` in Chrome DevTools MCP: `window.__MCP_3D_BRIDGE__.getSceneReport()`.
  2. It gets exact screen-space $(X, Y)$ pixel coordinates for every 3D mesh, allowing it to dispatch synthetic `PointerEvent` or `click_at(x, y)` calls accurately on interactive 3D objects.
  3. It verifies that `drawCalls` remain within budget ($<100$ on desktop, $<40$ on mobile), `geometriesInMemory` does not leak across route transitions, and `shaderErrors` is empty.

#### 4. Database Explorer MCP Suite (PostgreSQL / Supabase / Prisma / Redis) `[MANDATORY]`
* **Role:** Connects Antigravity directly to local or development-branch databases using a read-only or sandboxed role.
* **Mandatory Workflows:**
  * **Live Schema Introspection:** Before writing any ORM query or migration, inspect live tables, foreign key constraints, enums, and existing composite indexes.
  * **Query Plan Verification (`EXPLAIN ANALYZE`):** For any complex analytical or joined query, run `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` through the Database MCP server to verify index scans (`Index Scan`) and eliminate full table scans (`Seq Scan`) on large tables before committing code.
  * **Zero-Drift Type Generation:** Verify that TypeScript/Pydantic models match the actual database catalog $1:1$.

#### 5. AWS MCP Suite (`@awslabs/mcp`) `[MANDATORY FOR AWS DEPLOYMENTS / ACCORDING TO PS FOR CLOUD VENDOR]`
* **Core Official Servers:**
  * **AWS Knowledge MCP (`https://knowledge-mcp.global.api.aws`):** Zero-install remote server giving the agent live access to AWS documentation, API references, Well-Architected guidance, and recent service limits.
  * **AWS IaC MCP (`awslabs.iac-mcp-server`):** Validates AWS CDK, CloudFormation, and Terraform templates, synthesizes stacks locally, and checks IAM policy least-privilege compliance (`cfn-lint` + `cfn_nag` / `checkov`).
  * **AWS Cloud Control & Security Agent MCP:** Audits active cloud resources, diagnoses IAM permission denials via CloudTrail without exposing raw credentials, and scans for public S3 buckets, unencrypted EBS/RDS volumes, or overly permissive Security Groups (`0.0.0.0/0`).

#### 6. Additional High-Velocity MCP Integrations (Frequently Overlooked) `[MANDATORY]`
To create a truly complete agentic engineering environment, integrate these four additional MCP pillars:
1. **Git & GitHub/GitLab MCP (`[MANDATORY]`):** Automates branch creation, inspects PR review comments, fetches failing CI/CD GitHub Actions logs, and links commits to issues.
2. **Design-to-Code (Figma MCP) (`[ACCORDING TO PS]`):** If a Figma file is provided in the Problem Statement, connects directly to Figma Dev Mode MCP to extract exact design tokens, spacing variables, SVG icons, and auto-layout constraints.
3. **Observability & Error Tracking MCP (Sentry / Datadog / OpenTelemetry) (`[MANDATORY]` for Production):** Allows the agent to pull live production stack traces, breadcrumbs, and regressions directly into the IDE to synthesize hotfixes.
4. **AST & Static Security (Semgrep / CodeQL MCP) (`[MANDATORY]`):** Runs deterministic AST-based security rules over agent-generated diffs before any commit is finalized.

---

## 4. Reusable Engineering Skills (`SKILL.md` Playbooks)

### 4.1 The `SKILL.md` Progressive Disclosure Standard `[MANDATORY]`

Unlike monolithic rules files that bloat every single prompt turn, **Agent Skills (`SKILL.md`)** use a **3-Stage Progressive Disclosure Architecture** supported natively by Google Antigravity (`.agents/skills/` and `~/.gemini/skills/`), Claude Code, Cursor, and OpenAI Codex:

1. **Stage 1 — Discovery (Always in Context, $\approx 50$ tokens per skill):**
   * On every turn, Antigravity reads *only* the YAML frontmatter (`name` and `description`) of each `SKILL.md`.
   * **Portability Rule (`[MANDATORY]`):** Restrict the frontmatter to the guaranteed two-field standard (`name` max 64 chars, `description` max 1,024 chars) so the exact same skill folder runs seamlessly across Antigravity, Claude Code, Cursor, and Codex.
2. **Stage 2 — Activation (Loaded on Demand, $< 2,000$ tokens):**
   * When the user's task matches a skill's `description` (or the user types `/skill-name`), the agent loads the markdown body of `SKILL.md`.
3. **Stage 3 — Execution & Bundled Resources (Zero Context Bloat):**
   * Deep checklists, JSON schemas, boilerplate templates, and verification scripts are stored in sibling subfolders (`scripts/`, `references/`, `templates/`). The agent executes scripts as **black boxes** via terminal commands or reads specific reference files only when conditional branches require them.

---

### 4.2 Production-Ready `SKILL.md` Playbooks `[MANDATORY]`

Below are the complete, production-ready `SKILL.md` templates to place directly inside `.agents/skills/` in your repository.

#### Playbook 1: API Scaffolding & Contract-First Design (`.agents/skills/api-scaffolding/SKILL.md`) `[MANDATORY]`

```markdown
---
name: api-scaffolding
description: Use this skill whenever creating, modifying, or refactoring REST, GraphQL, tRPC, or FastMCP API endpoints. Enforces contract-first schema validation, standardized error envelopes, idempotency, rate-limiting, and automated integration tests.
---

# API Scaffolding & Contract-First Playbook

## 1. Execution Protocol (Step-by-Step)
1. **Verify Live Framework Docs:** Invoke Context7 MCP (`get-library-docs`) if using version-sensitive routing features (e.g., Next.js 15/16 Route Handlers, FastAPI lifespan dependencies, Hono RPC).
2. **Define Schema Contract First:** Before writing controller logic, define strict Request Params, Query, Body, and Response schemas using **Zod** (TypeScript) or **Pydantic v2** (Python).
3. **Apply Mandatory Middleware Stack:**
   - Authentication & RBAC scope verification.
   - Rate limiting (sliding window via Redis/Upstash or in-memory fallback).
   - Correlation ID (`X-Request-ID`) propagation and structured JSON logging.
4. **Standardize Response & Error Envelope:**
   - Never leak raw database errors or stack traces to the client.
   - Return RFC 9457 Problem Details or the project's canonical envelope:
     `{ "success": boolean, "data": T | null, "error": { "code": string, "message": string, "details"?: unknown }, "meta": { "requestId": string, "timestamp": string } }`.
5. **Idempotency & Pagination:**
   - Every `POST`/`PATCH` mutation affecting financial, order, or state records must support an `Idempotency-Key` header or deterministic deduplication.
   - Every list endpoint (`GET`) must enforce cursor-based or bounded offset pagination (`limit` max 100).

## 2. Verification Gate (Must Pass Before Completion)
- Run `node .agents/skills/api-scaffolding/scripts/validate-openapi.mjs` (or equivalent typecheck/test suite).
- Execute at least 3 automated test cases: (1) Happy Path `200/201`, (2) Validation Failure `400/422`, (3) Unauthorized/Forbidden `401/403`.
```

#### Playbook 2: Security & OWASP Hardening Checklist (`.agents/skills/security-checklist/SKILL.md`) `[MANDATORY]`

```markdown
---
name: security-checklist
description: Use this skill before finalizing any authentication flow, database query, file upload, webhook handler, MCP tool, or pre-PR code review to enforce OWASP Top 10 and LLM Security compliance.
---

# Security & Zero-Trust Verification Playbook

## 1. Mandatory Security Gates
1. **Authentication & Session Integrity:**
   - Passwords hashed exclusively with Argon2id or bcrypt (cost $\ge 12$).
   - Session tokens / JWTs stored in `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) cookies; never store sensitive tokens in `localStorage`.
   - Enforce CSRF protection on all state-mutating cookie-authenticated endpoints.
2. **Injection & Data Access Prevention:**
   - Parameterize 100% of SQL queries via ORM or prepared statements; zero string interpolation in SQL or shell commands.
   - Verify **Object-Level Authorization (BOLA/IDOR)**: Every query fetching or mutating a resource by `id` must include `WHERE id = :id AND tenant_id = :currentUserTenantId`.
3. **HTTP Security Headers & CORS:**
   - Configure strict `Content-Security-Policy` (CSP), `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and explicit CORS origin allowlists (never `*` with credentials).
4. **Secrets & Environment Hygiene:**
   - Scan staged diffs for hardcoded API keys, JWT secrets, private keys, or `.env` files.
   - Ensure client-bundled variables (`NEXT_PUBLIC_*`, `VITE_*`) never contain server secrets.
5. **AI / MCP Specific Defenses:**
   - Validate all MCP tool arguments against strict schemas; enforce human confirmation on destructive tools; sanitize untrusted external strings before prompt injection.

## 2. Actionable Output Format
When auditing code with this skill, output a structured table with columns:
`| Severity (Critical/High/Med/Low) | File:Line | Vulnerability Category | Concrete Remediation Applied |`
```

#### Playbook 3: WebGL, 3D & Shader Optimization (`.agents/skills/shader-webgl-optimization/SKILL.md`) `[MANDATORY WHEN PS INCLUDES 3D]`

```markdown
---
name: shader-webgl-optimization
description: Use this skill when building, debugging, or optimizing Three.js, React Three Fiber (R3F), WebGL, WebGPU, or custom GLSL/WGSL shaders. Enforces GPU memory disposal, draw-call instancing, shader math optimization, and 60 FPS frame budgets.
---

# 3D, WebGL & Shader Performance Engineering Playbook

## 1. Geometry, Texture & Draw-Call Budgets `[MANDATORY]`
- **Draw Calls:** Keep total draw calls $\le 100$ on desktop and $\le 40$ on mobile. Use `THREE.InstancedMesh` or `MergedGeometry` for repeated geometry (>10 identical meshes).
- **Polygon & Texture Compression:** Compress all `.glb`/`.gltf` assets using **Draco** or **Meshopt** (`gltf-transform`). Convert textures to **KTX2 / Basis Universal** (GPU-compressed mipmaps) and cap dimensions at $2048\times2048$ ($1024\times1024$ on mobile).
- **Deterministic GPU Memory Disposal:** Every geometry, material, texture, and render target created dynamically must call `.dispose()` on component unmount. Never instantiate `new THREE.Vector3()` or `new THREE.Matrix4()` inside the `useFrame` / `requestAnimationFrame` render loop—pre-allocate scratch variables outside the loop.

## 2. GLSL / WGSL Shader Optimization Rules `[MANDATORY]`
- **Eliminate Dynamic Branching in Fragment Shaders:** Replace `if/else` conditionals on non-uniform values with branchless math intrinsics: `step()`, `smoothstep()`, `mix()`, and `clamp()`.
- **Move Invariant Math to the Vertex Shader:** Compute lighting vectors, UV transforms, and world-space coordinates in the vertex shader and pass them via `varying` / interpolated outputs rather than recalculating per pixel in the fragment shader.
- **Precision Qualifiers:** Use `mediump` for colors, normals, and UVs on mobile GPUs; reserve `highp` strictly for world positions and depth calculations.
- **Device Pixel Ratio (DPR) Clamping:** Always clamp canvas DPR via `Math.min(window.devicePixelRatio, 2)` to prevent $4\times$ or $9\times$ fragment shader overdraw on Retina/4K mobile screens.

## 3. Live Chrome DevTools MCP Verification Loop `[MANDATORY]`
1. Ensure `attachMcp3DBridge(renderer, scene, camera)` is active.
2. Open the scene in Chrome DevTools MCP and execute `window.__MCP_3D_BRIDGE__.getSceneReport()`.
3. Verify: `fps >= 55`, `frameTimeMs <= 18.0`, `shaderErrors.length === 0`, and zero memory growth after mounting/unmounting the 3D view twice.
4. Provide a `prefers-reduced-motion` and low-power fallback so accessibility and battery life are respected.
```

#### Playbook 4: AWS Cloud & Zero-Downtime Deployment (`.agents/skills/aws-deployment/SKILL.md`) `[MANDATORY FOR AWS DEPLOYMENTS]`

```markdown
---
name: aws-deployment
description: Use this skill when authoring Infrastructure as Code (AWS CDK, Terraform, SST), configuring IAM policies, or deploying applications to AWS. Enforces least-privilege IAM, pre-deployment synthesis checks, rollback alarms, and cost guardrails.
---

# AWS Infrastructure & Safe Deployment Playbook

## 1. Pre-Deployment Verification Protocol
1. **Grounding via AWS MCP:** Query `aws-knowledge` and `aws-iac` MCP servers to verify current service quotas, region availability, and CDK/Terraform construct props.
2. **Least-Privilege IAM:**
   - Never use `"Action": "*"` or `"Resource": "*"` in IAM policies.
   - Scope permissions to exact ARNs and use short-lived OIDC federated roles for GitHub Actions / CI runners (zero long-lived `AWS_ACCESS_KEY_ID` secrets).
3. **Network & Storage Hardening:**
   - Place databases (RDS/Aurora/ElastiCache) in isolated private subnets with no public IP.
   - Block all public access on S3 buckets; serve static and media assets exclusively through CloudFront with Origin Access Control (OAC).
   - Enable KMS encryption at rest and TLS 1.3 in transit across all resources.
4. **Zero-Downtime & Rollback Safety:**
   - Configure health-check grace periods, circuit breakers (ECS/Fargate) or canary deployments (Lambda/CloudFront).
   - Run `cdk diff` or `terraform plan` and pause for human approval via Elicitation if any stateful resource (`AWS::RDS::DBInstance`, `AWS::DynamoDB::Table`, `AWS::S3::Bucket`) is marked for `Replacement` or `Destroy`.
```

#### Playbook 5: Additional Mandatory Skills to Include in `.agents/skills/` `[MANDATORY]`
Beyond the four playbooks above, every production repository should include these three companion skills:
* **`frontend-web-excellence/SKILL.md` (`[MANDATORY]`):** Enforces Core Web Vitals budgets ($LCP \le 2.5\text{s}$, $INP \le 200\text{ms}$, $CLS \le 0.1$), semantic HTML5 landmarks, keyboard navigation (`:focus-visible`), WCAG 2.2 AA contrast ratios ($\ge 4.5:1$), responsive container queries, and Complete State Coverage (Loading Skeleton, Empty State, Error Retry State, Success State).
* **`database-migrations/SKILL.md` (`[MANDATORY]`):** Enforces expand-and-contract zero-downtime schema migrations, mandatory foreign key indexing, and `EXPLAIN ANALYZE` verification via the Database Explorer MCP.
* **`tdd-visual-verification/SKILL.md` (`[MANDATORY]`):** Enforces writing failing unit/integration tests before implementation and running an automated Playwright/Chrome DevTools MCP visual & console check before marking any UI task complete.

---

## 5. Additional High-Velocity Pillars (Completing the Architecture)

To make Antigravity operate as a self-correcting, autonomous engineering partner, you must combine MCP and `SKILL.md` with the following four architectural layers:

### 5.1 Root Workspace Instructions (`AGENTS.md`) `[MANDATORY]`

Place an `AGENTS.md` file in the root of your repository. Antigravity loads this file automatically on session initialization to establish global routing rules and tool invocation habits.

```markdown
# Project Agent Instructions (AGENTS.md)

## 1. Mandatory Tool & Skill Routing Rules
- **Live Docs First:** Whenever working with external SDKs or frameworks, ALWAYS invoke the `context7` MCP server (`resolve-library-id` -> `get-library-docs`) before writing code. Do not rely on training memory for API signatures.
- **Skill Activation:** Check `.agents/skills/` at the start of every task:
  - Creating/editing API routes -> Read `.agents/skills/api-scaffolding/SKILL.md`
  - Writing auth, SQL, or reviewing diffs -> Read `.agents/skills/security-checklist/SKILL.md`
  - Writing Three.js, WebGL, or shaders -> Read `.agents/skills/shader-webgl-optimization/SKILL.md`
  - Modifying cloud infrastructure -> Read `.agents/skills/aws-deployment/SKILL.md`
- **Browser Self-Verification:** Never declare a frontend or 3D task complete based solely on `tsc` or build output. You MUST open the running route via `chrome-devtools` or `playwright` MCP, verify zero console/network errors, inspect visual alignment across Desktop and Mobile viewports, and (if 3D is present) run `window.__MCP_3D_BRIDGE__.getSceneReport()`.

## 2. Architectural Separation of Concerns
- Keep universal web quality standards (`[MANDATORY]`) strictly enforced at all times.
- Read `docs/problem-statement-spec.md` for all `[ACCORDING TO PS]` parameters (brand theme, color palette tokens, typography, domain entities, and business rules).
```

### 5.2 Parallel Subagents & Isolated Git Worktrees `[MANDATORY]`

Google Antigravity supports asynchronous subagents executing in parallel across **isolated Git worktrees**. To maximize velocity on complex features without file-lock collisions:
1. **Architect / Planner Agent (Main Session):** Decomposes the Problem Statement into an interactive Implementation Plan with explicit API contracts and database schemas.
2. **Worktree Subagent A (Backend & MCP Tools):** Scaffolds database migrations, FastMCP tools, and API routes inside `.worktrees/feat-backend`.
3. **Worktree Subagent B (Frontend & 3D Experience):** Builds UI components, shaders, and state management against the mocked OpenAPI/Zod contract inside `.worktrees/feat-frontend`.
4. **Worktree Subagent C (QA, Security & Visual Verification):** Runs Playwright MCP, Chrome DevTools MCP (`__MCP_3D_BRIDGE__`), and `.agents/skills/security-checklist/SKILL.md` against the merged staging branch.

### 5.3 Deterministic Lifecycle Hooks & Verification Loops `[MANDATORY]`

Skills and instructions guide the model, but **Lifecycle Hooks** enforce hard engineering gates. Configure pre-tool and post-edit hooks so the agent receives immediate, deterministic feedback:
* **`PostFileEdit` Hook:** Automatically runs incremental TypeScript typechecking (`tsc --noEmit`), linter formatting (`biome check --write` or `eslint`), and unit tests related to the modified file.
* **`PreToolCall` Security Hook:** Intercepts terminal commands (`rm -rf`, `git push --force`, production DB drops) and requires explicit human approval.
* **`PreCommit / PrePR` Verification Loop:** Runs build compilation, bundle-size budget check, and Playwright MCP smoke test before allowing the agent to finalize a pull request.

### 5.4 Context Engineering & `llms.txt` Maintenance `[MANDATORY]`

To prevent context degradation during long multi-file coding sessions:
* Maintain a concise `docs/llms.txt` ($\le 2,000$ tokens) mapping every directory, core domain model, MCP server endpoint, and active `SKILL.md` path.
* Keep individual source files modular ($\le 350$ lines per file) so the agent can read and edit targeted modules without loading thousands of lines of unrelated code.

---

## 6. Master Classification Reference: `[MANDATORY]` vs. `[ACCORDING TO PS]`

When feeding a new project or Problem Statement into Antigravity, use this master checklist to separate what the agent must **always enforce automatically** (`[MANDATORY]`) from what the agent must **extract from the Problem Statement** (`[ACCORDING TO PS]`):

### 6.1 Everything That Universally Improves the Web (`[MANDATORY]`)
- [x] **Strict Type & Schema Safety:** End-to-end TypeScript (`strict: true`) + Zod/Pydantic runtime validation at every API and MCP boundary.
- [x] **Core Web Vitals & Performance:** $LCP \le 2.5\text{s}$, $INP \le 200\text{ms}$, $CLS \le 0.1$; code-splitting, lazy loading of heavy below-the-fold or 3D canvas bundles, modern image formats (`AVIF`/`WebP`), and font `display: swap`.
- [x] **Responsive & Fluid Layout Integrity:** Zero horizontal overflow across $320\text{px}$ to $2560\text{px}$; touch targets $\ge 44\times44\text{px}$ on mobile; fluid typography (`clamp()`).
- [x] **Complete UI State Coverage:** Every asynchronous view implements explicit Skeleton Loading, Empty State (with clear call-to-action), Error Boundary (with one-click retry), and Optimistic/Confirmed Success states.
- [x] **Accessibility (WCAG 2.2 AA):** Semantic landmarks (`<main>`, `<nav>`, `<header>`), full keyboard traversal, visible focus rings, ARIA live regions for dynamic updates, and `prefers-reduced-motion` support.
- [x] **Security Baseline:** OWASP Top 10 hardening, parameterized queries, BOLA/IDOR tenant checks, strict CSP/CORS headers, and zero secrets in client bundles or MCP tool arguments.
- [x] **Automated MCP Verification Loop:** Grounding via **Context7 MCP**, schema checks via **Database Explorer MCP**, and visual/console/network verification via **Chrome DevTools & Playwright MCP**.

### 6.2 Decisions Governed by the Problem Statement (`[ACCORDING TO PS]`)
- [ ] **Visual Theme & Aesthetic Direction:** Dark vs. Light default mode, Glassmorphic vs. Neubrutalist vs. Clean Enterprise Swiss Grid, Editorial vs. High-Density Cockpit layout.
- [ ] **Brand Color Palette & Semantic Tokens:** Primary, secondary, and accent brand hues defined in CSS variables (`--color-primary`, `--color-surface`) while still meeting `[MANDATORY]` WCAG contrast ratios.
- [ ] **Typography Pairing:** Selection of Display, Sans, and Monospace fonts that match the problem domain's personality.
- [ ] **3D / WebGL / Interactive Canvas Scope:** Whether the application requires a full interactive 3D viewport, subtle shader backgrounds, data visualization globes, or a purely 2D high-speed interface (note: once 3D is chosen by the PS, the **Shader Optimization Skill** and **`__MCP_3D_BRIDGE__`** immediately become `[MANDATORY]`).
- [ ] **Domain Entities, User Roles & Business Workflows:** Custom database tables, state machines, third-party API integrations (e.g., Stripe, LiveKit, Maps, Healthcare FHIR), and runtime FastMCP domain tools.
- [ ] **Target Hosting & Cloud Stack:** AWS vs. GCP/Firebase vs. Vercel/Cloudflare, and SQL vs. NoSQL/Vector storage, as specified by the Problem Statement or hackathon/enterprise constraints.

---

## 7. Quick-Start Execution Prompt for Antigravity

Copy and paste the following bootstrap prompt into **Antigravity** at the start of any new project after placing this file in your workspace:

```text
Read `antigravity_developer_velocity_mcp_skills_blueprint.md` and `docs/problem-statement-spec.md`.
1. Initialize the workspace structure (`AGENTS.md`, `.agents/skills/`, and `.gemini/config/mcp_config.json`).
2. Extract all `[ACCORDING TO PS]` requirements (theme tokens, aesthetic direction, 3D/2D scope, domain models, and cloud target) from the Problem Statement and confirm them in an Implementation Plan.
3. Enforce every `[MANDATORY]` architecture, security, performance, and MCP verification rule throughout execution—using Context7 for live docs, `.agents/skills/` playbooks for implementation standards, and Chrome DevTools / Playwright MCP for live browser and 3D scene verification.
```