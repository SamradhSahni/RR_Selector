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
- Run typecheck and test suite.
- Execute at least 3 automated test cases: (1) Happy Path `200/201`, (2) Validation Failure `400/422`, (3) Unauthorized/Forbidden `401/403`.
