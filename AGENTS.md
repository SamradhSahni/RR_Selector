# Antigravity System Instructions & Routing Protocol (AGENTS.md)

> **Workspace:** SupeRR Selector Season 2 — Identify Most Reliable Players Under Pressure  
> **Target Framework:** Google Antigravity IDE / App / CLI (`.agents/skills/`, `.gemini/config/mcp_config.json`)

---

## 1. Mandatory Tool & Skill Routing Rules

- **Live Docs Grounding:** Whenever integrating external libraries, tools, or frameworks, ALWAYS invoke the `context7` MCP server (`resolve-library-id` -> `get-library-docs`) before writing code. Never hallucinate or guess API signatures.
- **Skill Activation Protocol:** Inspect `.agents/skills/` before executing tasks:
  - Cricket Pressure Analytics & Modeling -> Read `.agents/skills/cricket-pressure-analytics/SKILL.md`
  - Scaffolding APIs, FastMCP endpoints -> Read `.agents/skills/api-scaffolding/SKILL.md`
  - Writing SQL, DuckDB, or checking auth/security -> Read `.agents/skills/security-checklist/SKILL.md`
  - Building Web UI / 3D Visualizations -> Read `.agents/skills/frontend-web-excellence/SKILL.md` & `.agents/skills/shader-webgl-optimization/SKILL.md`
  - Schema migrations / database optimizations -> Read `.agents/skills/database-migrations/SKILL.md`
  - Verifying UI, browser DOM, or API outputs -> Read `.agents/skills/tdd-visual-verification/SKILL.md`
  - Cloud / Docker deployment -> Read `.agents/skills/aws-deployment/SKILL.md`
- **Verification Gate:** Never mark a frontend, data calculation, or API task complete without automated verification:
  - For data analytics: run statistical unit tests, cross-check distributions, and assert mathematical validity.
  - For frontend UI: inspect running views with Chrome DevTools / Playwright MCP for zero console/network errors.

---

## 2. Problem Statement Context & Domain Rules

- **Domain:** Professional Cricket (IPL 2022-2026 + T20Is 2022-2026).
- **Core Goal:** Identify and rank the Top 10 Best Batters Under Pressure and Top 10 Best Bowlers Under Pressure.
- **Data Source:** `Data Pack/` containing 6 relational CSV datasets (200,999 ball-by-ball deliveries across 883 matches).
- **Specification Document:** Read `docs/problem-statement-spec.md` and `docs/data_catalog.md` for complete schema definitions, pressure formulas, and submission requirements.
- **Output Requirements:**
  1. Top-10 Batters and Top-10 Bowlers rankings with exact IDs and names matching Unstop dropdowns.
  2. In-depth, reproducible Methodology Report explaining pressure definition, ratings construction, and empirical evidence.

---

## 3. Engineering Best Practices

- **Code Quality:** Enforce TypeScript strictness and Python PEP 8 / Pydantic validation.
- **Performance:** Maintain vectorised data processing (Pandas / NumPy / DuckDB) over slow per-row Python loops.
- **Context Hygiene:** Keep source files modular (<= 350 lines). Consult `docs/llms.txt` for fast project navigation.
