---
name: security-checklist
description: Use this skill before finalizing any authentication flow, database query, file upload, webhook handler, MCP tool, or pre-PR code review to enforce OWASP Top 10 and LLM Security compliance.
---

# Security & Zero-Trust Verification Playbook

## 1. Mandatory Security Gates
1. **Authentication & Session Integrity:**
   - Passwords hashed exclusively with Argon2id or bcrypt (cost >= 12).
   - Session tokens / JWTs stored in `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) cookies; never store sensitive tokens in `localStorage`.
   - Enforce CSRF protection on all state-mutating cookie-authenticated endpoints.
2. **Injection & Data Access Prevention:**
   - Parameterize 100% of SQL queries via ORM or prepared statements; zero string interpolation in SQL or shell commands.
   - Verify **Object-Level Authorization (BOLA/IDOR)**: Every query fetching or mutating a resource by `id` must include proper tenant/user authorization checks.
3. **HTTP Security Headers & CORS:**
   - Configure strict `Content-Security-Policy` (CSP), `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and explicit CORS origin allowlists.
4. **Secrets & Environment Hygiene:**
   - Scan staged diffs for hardcoded API keys, JWT secrets, private keys, or `.env` files.
   - Ensure client-bundled variables never contain server secrets.
5. **AI / MCP Specific Defenses:**
   - Validate all MCP tool arguments against strict schemas; enforce human confirmation on destructive tools; sanitize untrusted external strings before prompt injection.

## 2. Actionable Output Format
When auditing code with this skill, output a structured table with columns:
`| Severity (Critical/High/Med/Low) | File:Line | Vulnerability Category | Concrete Remediation Applied |`
