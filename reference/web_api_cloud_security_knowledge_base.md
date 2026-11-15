# Web, API & Cloud Security: Defense-in-Depth Knowledge Base & Architectural Blueprint

> **Agent Directive (For Antigravity / AI Architect):**
> This document is the single source of truth for designing, scaffolding, auditing, and implementing web, API, and cloud infrastructure security. Every architectural decision, code module, middleware, and infrastructure-as-code (IaC) template generated must strictly adhere to the specifications below.

---

## 0. Classification Governance Rules

In this knowledge base, nothing that improves security, reliability, or engineering quality is treated as "optional." Every concept is categorized under one of two strict directives:

1. **`[MANDATORY]`**: Non-negotiable baseline requirement for any production-grade, highly professional web application. Must be implemented by default in every project regardless of domain, traffic scale, or aesthetic theme. If a practice enhances security posture, resilience, or data integrity, it is classified as **`[MANDATORY]`**.
2. **`[ACCORDING TO PS]` (According to Problem Statement)**: Architectural patterns, compliance controls, domain-specific workflows, or UI/UX security themes whose exact configuration depends on the project's Problem Statement (e.g., B2B multi-tenancy vs. B2C consumer app, healthcare HIPAA vs. fintech PCI-DSS, public content sharing vs. air-gapped enterprise portal, or visual design/theme requirements). When encountering an **`[ACCORDING TO PS]`** item, inspect the Problem Statement first and apply the corresponding rule set.

---

## 1. OWASP Web & API Hardening (Application Layer)

### 1.1 Strict HTTP Security Headers `[MANDATORY]`
Every HTTP response emitted by the web server, CDN, or API gateway must strip fingerprinting headers (`X-Powered-By`, `Server`) and enforce the following strict headers:

*   **Content Security Policy (`Content-Security-Policy`) `[MANDATORY]`**:
    *   Must use cryptographic **nonces** (`'nonce-<random-base64>'` generated per request with at least $128\text{ bits}$ of entropy) or **SHA-256/SHA-384 hashes** for inline scripts and styles.
    *   Never allow `'unsafe-inline'` or `'unsafe-eval'` in `script-src`.
    *   Baseline Policy Template:
        ```http
        Content-Security-Policy: default-src 'none'; script-src 'self' 'nonce-{SERVER_NONCE}' 'strict-dynamic'; style-src 'self' 'nonce-{SERVER_NONCE}'; img-src 'self' data: blob: https://{ALLOWED_CDN_DOMAIN}; font-src 'self'; connect-src 'self' https://{API_DOMAIN}; media-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests; block-all-mixed-content;
        ```
    *   **Third-Party Integrations (Stripe, OAuth Providers, Analytics, Maps) `[ACCORDING TO PS]`**: Only whitelist specific external domains in `script-src`, `frame-src`, or `connect-src` if explicitly required by the Problem Statement's integrations.
*   **HTTP Strict Transport Security (`Strict-Transport-Security`) `[MANDATORY]`**:
    *   Force HTTPS across the entire domain hierarchy and qualify for browser preload lists:
        ```http
        Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
        ```
*   **Clickjacking & Cross-Origin Isolation Headers `[MANDATORY]`**:
    *   `X-Frame-Options: DENY` (or `SAMEORIGIN` **`[ACCORDING TO PS]`** only if the Problem Statement requires embedding internal iframes).
    *   `X-Content-Type-Options: nosniff` (Prevents MIME-sniffing attacks).
    *   `Referrer-Policy: strict-origin-when-cross-origin` (or `no-referrer` for high-privacy applications **`[ACCORDING TO PS]`**).
    *   `Cross-Origin-Opener-Policy: same-origin` (Isolates browsing context against Spectre/XS-Leaks).
    *   `Cross-Origin-Resource-Policy: same-origin` (or `same-site` if assets are served from a subdomain).
    *   `Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()` — Deny all sensitive browser APIs by default; selectively enable **`[ACCORDING TO PS]`** (e.g., enable `geolocation=(self)` only for map/delivery problem statements, or `camera=(self)` for KYC/video apps).

### 1.2 Locked Cross-Origin Resource Sharing (CORS) `[MANDATORY]`
*   **No Wildcards with Credentials `[MANDATORY]`**: Never configure `Access-Control-Allow-Origin: *` on authenticated APIs or combine wildcards with `Access-Control-Allow-Credentials: true`.
*   **Strict Origin Allowlist `[MANDATORY]`**: Maintain an explicit, environment-driven allowlist of exact origins (e.g., `https://app.example.com`). Validate the incoming `Origin` header via exact string matching—never use naive regular expressions (like `/example\.com/`) that can be bypassed via `evil-example.com`.
*   **Dynamic Multi-Tenant Subdomains or Public Read APIs `[ACCORDING TO PS]`**: If the Problem Statement requires customer vanity domains or public third-party developer APIs, validate origins against a cached database lookup of verified tenant domains and restrict `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` to the minimum required set.
*   **Preflight Caching `[MANDATORY]`**: Set `Access-Control-Max-Age: 7200` to prevent preflight (`OPTIONS`) request amplification.

### 1.3 Cross-Site Request Forgery (CSRF) Protection `[MANDATORY]`
*   **Cookie-Authenticated State-Changing Requests `[MANDATORY]`**:
    *   Enforce **Synchronizer Token Pattern** (cryptographically random token bound to the user's session) or **Signed Double-Submit Cookie Pattern** (using HMAC-SHA256 bound to the session ID to prevent subdomain cookie-tossing).
    *   Verify the CSRF token on all `POST`, `PUT`, `PATCH`, and `DELETE` requests via a custom header (`X-CSRF-Token`).
*   **Origin & Fetch Metadata Verification `[MANDATORY]`**:
    *   Inspect `Sec-Fetch-Site` headers (`same-origin` or `same-site` allowed; reject `cross-site` on state-changing endpoints unless explicitly part of a webhook/OAuth callback).
    *   Verify that the `Origin` or `Referer` header matches the application's target host.

### 1.4 XSS Prevention & DOMPurify HTML/Markdown Sanitization `[MANDATORY]`
*   **Contextual Output Encoding `[MANDATORY]`**: Rely on framework auto-escaping (React JSX, Vue, Angular) and strictly forbid dangerous sinks (`dangerouslySetInnerHTML`, `v-html`, `innerHTML`, `document.write`, `eval()`, `new Function()`).
*   **DOMPurify Pipeline for Rich Text / Markdown `[MANDATORY]`**:
    *   Whenever user-generated Markdown or rich HTML must be rendered, parse the Markdown first, and pass the resulting HTML through **DOMPurify** on **both** the server side (`isomorphic-dompurify` / `jsdom` or native HTML sanitizer) and client side before rendering.
    *   **Strict DOMPurify Configuration `[MANDATORY]`**:
        *   Explicitly block dangerous tags: `FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'svg', 'math', 'base', 'link', 'meta']`.
        *   Explicitly block event handlers and dangerous attributes: `FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style', 'srcdoc', 'formaction']`.
        *   Restrict URI schemes in `href` and `src` exclusively to `https://`, `http://`, and `mailto:`. Block `javascript:`, `vbscript:`, `data:`, and `blob:` URLs inside anchors/images.
        *   Enforce `rel="noopener noreferrer nofollow ugc"` on all user-generated `<a>` tags via a DOMPurify hook (`afterSanitizeAttributes`).
*   **Allowed Rich-Media Elements `[ACCORDING TO PS]`**: If the Problem Statement is a developer platform, LMS, or blogging tool requiring embedded code blocks, LaTeX math, or YouTube embeds, whitelist only sandboxed custom components rather than raw `<iframe>` or `<script>` tags.

### 1.5 Authorization Architecture: BOLA, BOPLA & BFLA Defense `[MANDATORY]`
*   **BOLA (Broken Object Level Authorization / IDOR) Prevention `[MANDATORY]`**:
    *   **Never trust client-supplied resource IDs**: Every database query fetching, updating, or deleting a record by ID **must** include the authenticated principal's scope (`user_id`, `organization_id`, or `tenant_id`) directly in the `WHERE` clause:
        ```sql
        SELECT * FROM documents WHERE id = $1 AND tenant_id = $2 AND owner_id = $3;
        ```
    *   **Non-Enumerable Identifiers `[MANDATORY]`**: Use **UUIDv4** or **UUIDv7** (or cryptographically random ULIDs/NanoIDs) for all externally exposed resource identifiers instead of sequential auto-incrementing integers (`1, 2, 3...`).
    *   **Centralized Policy Decision Point (PDP) `[MANDATORY]`**: Enforce ownership and permission checks in a centralized authorization middleware/service layer (e.g., CASL, Oso, OpenFGA, or custom policy guards) rather than scattering `if (user.id !== item.userId)` across controllers.
*   **BOPLA (Broken Object Property Level Authorization / Mass Assignment) `[MANDATORY]`**:
    *   Never bind raw request bodies (`req.body`) directly to ORM models (`User.create(req.body)` or `Object.assign(entity, req.body)`).
    *   Use explicit Input DTOs / Zod schemas for write operations that exclude sensitive internal properties (`role`, `isAdmin`, `organizationId`, `balance`, `isVerified`, `subscriptionTier`).
    *   Use explicit Output DTOs / serializers for read responses so internal database columns (`passwordHash`, `mfaSecret`, `internalNotes`, `deletedAt`) are never serialized to JSON.
*   **BFLA (Broken Function Level Authorization) `[MANDATORY]`**:
    *   Deny all routes by default. Require explicit role/permission decorators on every controller or route handler (`@RequirePermission('invoices:approve')`).
    *   Separate administrative API routes onto distinct router prefixes (`/api/v1/admin/*`) with dedicated middleware verifying elevated claims and step-up MFA.
*   **Access Control Model (RBAC vs. ABAC vs. ReBAC) `[ACCORDING TO PS]`**:
    *   Simple consumer apps: Role-Based Access Control (RBAC).
    *   Multi-tenant SaaS / Enterprise apps: Organization-scoped RBAC + Attribute-Based Access Control (ABAC).
    *   Collaborative workspaces (e.g., Google Docs/Notion clones, healthcare records): Relationship-Based Access Control (ReBAC / Zanzibar model).

---

## 2. Identity, Authentication & Session Security

### 2.1 Password & Credential Storage `[MANDATORY]`
*   **Hashing Algorithm `[MANDATORY]`**: Use **Argon2id** for all password hashing with minimum parameters: memory cost $m = 65536\text{ KiB}$ ($64\text{ MiB}$), time cost (iterations) $t = 3$, parallelism $p = 4$, and a unique $16\text{-byte}$ cryptographically random salt per password.
*   **Application-Level Pepper `[MANDATORY]`**: Pre-hash or HMAC passwords with a high-entropy secret "pepper" stored in AWS Secrets Manager (separate from the database) before passing to Argon2id, protecting hashes even if the database is exfiltrated.
*   **Breached Password Screening `[MANDATORY]`**: Check new passwords against the HaveIBeenPwned (HIBP) k-Anonymity API (sending only the first $5$ hex characters of the SHA-1 hash) and reject compromised passwords.

### 2.2 Token & Session Lifecycle Architecture `[MANDATORY]`
*   **Short-Lived Access + Rotating Refresh Tokens `[MANDATORY]`**:
    *   **Access Tokens**: Stateless JWTs signed with asymmetric keys (**RS256**, **ES256**, or **EdDSA/Ed25519**—never symmetric HS256 with weak secrets), short lifespan ($5\text{ to }15\text{ minutes}$). Validate `iss`, `aud`, `exp`, `nbf`, and explicit `alg` header (preventing the `alg: none` and RSA-to-HMAC key confusion attacks).
    *   **Refresh Tokens**: Opaque high-entropy random strings (stored as SHA-256 hashes in the database) with **Refresh Token Rotation** and **Reuse Detection**. If a previously rotated refresh token is replayed, immediately revoke the entire token family for that session and force re-authentication.
*   **Hardened Cookie Attributes `[MANDATORY]`**:
    *   Store session/refresh tokens exclusively in cookies using the `__Host-` prefix:
        ```http
        Set-Cookie: __Host-session={TOKEN}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=900
        ```
    *   Never store sensitive tokens inside `localStorage` or `sessionStorage` where any XSS payload can exfiltrate them.
*   **Authentication Methods (OAuth2.1 / OIDC, Passkeys/WebAuthn, SAML, MFA) `[ACCORDING TO PS]`**:
    *   All OAuth2 flows must enforce **PKCE (`S256`)** and strict `state` + `nonce` validation **`[MANDATORY]`**.
    *   Specific identity providers (Google, GitHub, Enterprise Okta/Entra ID SAML, Passkeys, TOTP/SMS MFA) and step-up authentication triggers must be configured **`[ACCORDING TO PS]`**.

---

## 3. API Gateway, Schema Validation & Rate Limiting

### 3.1 Strict Input Schema Validation `[MANDATORY]`
*   **Zero Unvalidated Input `[MANDATORY]`**: Validate every request's path parameters, query strings, headers, and JSON body using a strict schema validator (**Zod**, **Valibot**, **AJV**, or **Pydantic**).
*   **Reject Unknown Fields `[MANDATORY]`**: Configure schemas in `.strict()` mode (`additionalProperties: false`) so unexpected payload properties are immediately rejected with `400 Bad Request`.
*   **Payload Size & Depth Limits `[MANDATORY]`**:
    *   Limit standard JSON request bodies to $100\text{ KB}$ (or endpoint-specific limits) to prevent memory exhaustion / Denial of Service.
    *   Limit JSON object nesting depth to $\le 10$ levels and array lengths to bounded maximums to prevent JSON parsing bombs and prototype pollution (`__proto__`, `constructor`, `prototype`).
*   **GraphQL / WebSockets / gRPC Specific Hardening `[ACCORDING TO PS]`**:
    *   If GraphQL is used: Disable introspection in production, enforce query depth limiting ($\le 7$), implement query complexity/cost analysis, and block batching amplification attacks **`[MANDATORY when GraphQL is in PS]`**.
    *   If WebSockets are used: Authenticate during the upgrade handshake, validate origin headers, and rate-limit inbound frames per socket **`[MANDATORY when WebSockets are in PS]`**.

### 3.2 Multi-Tier Rate Limiting & Abuse Prevention `[MANDATORY]`
*   **Layered Throttling Algorithms `[MANDATORY]`**: Implement distributed Redis-backed rate limiting (using atomic Lua scripts with Sliding Window or Token Bucket algorithms):
    *   **Global IP Rate Limit**: Protects against unauthenticated volumetric floods.
    *   **Strict Auth/Sensitive Endpoint Limit**: Login, registration, password reset, OTP verification, and coupon redemption must have tight limits (e.g., $5\text{ attempts per }15\text{ minutes}$ per IP + account identifier) with exponential backoff.
    *   **Authenticated Per-User / Per-Tenant Quota**: Prevents a single noisy or compromised tenant from starving shared compute resources.
*   **Idempotency Keys `[MANDATORY]`**: Require an `Idempotency-Key` header (UUID) on all non-idempotent financial, booking, order, or resource-creation `POST` endpoints, locking state in Redis for $24\text{ hours}$ to prevent race conditions (TOCTOU) and duplicate processing.
*   **Tiered Business Quotas & Monetization Limits `[ACCORDING TO PS]`**: Adjust rate limit thresholds (e.g., Free vs. Pro vs. Enterprise API calls per minute, AI token generation budgets) based on the Problem Statement's business model.

---

## 4. Secure File Upload Pipeline & SSRF Protection

### 4.1 Asynchronous Presigned S3 Upload & Quarantine Pipeline `[MANDATORY]`
Never stream large file uploads directly through application servers (which ties up worker threads and opens RCE/memory exhaustion vectors). Implement this exact 6-stage pipeline:

```
[Client] 
   │ 1. Request upload intent (filename, declared MIME, size, SHA-256 hash)
   ▼
[API Server] ──► Validates auth, quota, & extension allowlist; generates Presigned POST/PUT URL
   │             pointing ONLY to an isolated S3 Quarantine Bucket (TTL = 5 mins)
   ▼
[S3 Quarantine Bucket] (BlockPublicAccess=True, No public read, Object expiration = 24h)
   │ 2. S3 ObjectCreated Event triggers isolated Malware/Sanitization Worker (Lambda / ECS)
   ▼
[Verification & Sanitization Worker]
   ├── Step A: Fetch first 4100 bytes -> Magic-Byte verification (reject if mismatch)
   ├── Step B: Antivirus Scan (ClamAV / AWS GuardDuty S3 Malware Protection)
   ├── Step C: EXIF & Metadata Stripping + Image Re-encoding / PDF Sanitization
   ▼
[S3 Production Bucket] (Private; served exclusively via CloudFront OAC with nosniff headers)
```

1.  **Constrained Presigned S3 URLs `[MANDATORY]`**:
    *   Generate presigned URLs using `createPresignedPost` (or constrained `PutObject` with signed headers) with a strict expiration of $\le 300\text{ seconds}$.
    *   Enforce cryptographic policy conditions directly in S3:
        *   `["content-length-range", 1, MAX_BYTES]` (exact byte ceiling based on file type).
        *   `["eq", "$Content-Type", ALLOWED_MIME]`.
        *   `["eq", "$x-amz-checksum-sha256", CLIENT_PRECOMPUTED_SHA256]` (locks payload integrity).
    *   **Randomized Storage Keys `[MANDATORY]`**: Never use the user-supplied filename in the S3 object key (prevents path traversal `../../` and key overwrites). Generate keys using `uploads/{tenant_id}/{uuid_v4}` and store the sanitized original filename in database metadata only.
2.  **Magic-Byte (File Signature) Verification `[MANDATORY]`**:
    *   Never trust the HTTP `Content-Type` header or file extension (`.jpg`, `.pdf`).
    *   Read the file's binary header (first $4100\text{ bytes}$) and validate the exact magic numbers (e.g., `FF D8 FF` for JPEG, `89 50 4E 47 0D 0A 1A 0A` for PNG, `25 50 44 46` for PDF) using a strict binary parser (`file-type`).
    *   **Block SVG Uploads by Default `[MANDATORY]`**: `.svg` files are XML documents capable of executing embedded `<script>` and XSS payloads. Reject SVGs from user uploads unless explicitly required **`[ACCORDING TO PS]`**, in which case they must be sanitized through DOMPurify's SVG profile and served from a separate sandboxed static domain with `Content-Security-Policy: sandbox`.
3.  **Antivirus & Malware Scanning `[MANDATORY]`**:
    *   Scan every uploaded object in the Quarantine Bucket before marking it available. Use **AWS GuardDuty Malware Protection for S3** or an isolated container running **ClamAV** with daily signature updates and YARA rules.
    *   If a threat is detected: immediately delete or move the object to an encrypted forensic vault, revoke the upload record, log a high-severity security event, and alert the security channel.
4.  **EXIF Stripping & Content Disarm and Reconstruction (CDR) `[MANDATORY]`**:
    *   **Images**: Strip all EXIF, IPTC, and XMP metadata (which can contain GPS coordinates, camera serial numbers, and embedded PHP/JS polyglot payloads in comment headers) and re-encode the pixel buffer into a fresh image file (e.g., via `sharp` or `libvips`).
    *   **Image Dimensions Bomb Defense**: Verify image pixel dimensions (`width` $\times$ `height` $\le 25,000,000\text{ pixels}$) before decoding into memory to prevent "Decompression Bomb" / Pixel Flood DoS attacks.
5.  **Safe Content Delivery `[MANDATORY]`**:
    *   Serve user-uploaded files from a dedicated, cookieless static domain (`cdn-userdata.example.com`) via CloudFront Origin Access Control (OAC).
    *   Enforce response headers on all downloaded files:
        *   `X-Content-Type-Options: nosniff`
        *   `Content-Disposition: attachment; filename="sanitized_name.ext"` (for all non-inline files).
        *   `Content-Security-Policy: default-src 'none'; sandbox`
*   **Allowed File Formats & Size Ceilings `[ACCORDING TO PS]`**: Whitelist only the exact file types needed by the Problem Statement (e.g., avatars = `.png, .jpg, .webp` $\le 5\text{ MB}$; resume portal = `.pdf` $\le 10\text{ MB}$; video platform = `.mp4` multipart upload).

### 4.2 Server-Side Request Forgery (SSRF) Protection `[MANDATORY]`
Whenever the backend fetches a user-supplied URL (e.g., webhooks, URL previews, OpenGraph scrapers, PDF generators, remote image imports, OAuth OIDC discovery):

1.  **Protocol & Port Whitelisting `[MANDATORY]`**:
    *   Allow **only** `https://` (and `http://` only if explicitly required). Block `file://`, `gopher://`, `ftp://`, `dict://`, `ldap://`, `ws://`, and `data:`.
    *   Restrict destination ports strictly to `443` (and `80` if HTTP is permitted).
2.  **Comprehensive Private & Reserved IP Blocklist `[MANDATORY]`**:
    *   Before opening a socket, resolve the hostname and block the request if any returned IPv4 or IPv6 address falls within:
        *   `0.0.0.0/8` (Current network)
        *   `127.0.0.0/8` (Loopback)
        *   `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (RFC 1918 Private networks)
        *   `169.254.0.0/16` (Link-local & **AWS/Cloud Instance Metadata Service `169.254.169.254`**)
        *   `100.64.0.0/10` (Carrier-grade NAT / AWS VPC shared space)
        *   `224.0.0.0/4` and `240.0.0.0/4` (Multicast & Reserved)
        *   `::1/128`, `::/128` (IPv6 Loopback & Unspecified)
        *   `fc00::/7` (IPv6 Unique Local Addresses)
        *   `fe80::/10` (IPv6 Link-Local, including AWS IPv6 IMDS `fd00:ec2::254`)
        *   `::ffff:0:0/96` (IPv4-mapped IPv6 addresses—normalize and check against the IPv4 blocklist).
3.  **DNS Rebinding Prevention `[MANDATORY]`**:
    *   **Never** resolve DNS in a validation function and then pass the hostname string to `fetch(url)` or `axios.get(url)` (which performs a second DNS lookup vulnerable to Time-of-Check to Time-of-Use DNS rebinding).
    *   Implement a custom HTTP Agent / Socket Lookup hook that resolves DNS **once**, validates the resolved IP against the CIDR blocklist, and forces the TCP/TLS connection to connect directly to that verified IP address while preserving the `Host` header and TLS SNI.
4.  **Redirect & Response Hardening `[MANDATORY]`**:
    *   Disable automatic HTTP redirects (`redirect: 'error'` or `maxRedirects: 0`), or manually re-validate every `Location` header target through the entire SSRF DNS/IP pipeline up to a maximum of $3$ hops.
    *   Enforce strict connection timeouts ($\le 3000\text{ ms}$), overall response timeouts ($\le 5000\text{ ms}$), and stream byte limits (abort stream if response exceeds $5\text{ MB}$).
5.  **Dedicated Egress Proxy `[MANDATORY for High-Volume Outbound Fetching]`**: Route all outbound user-triggered HTTP requests through an isolated egress proxy inside a dedicated DMZ subnet that has zero routing capability to internal VPC subnets.

---

## 5. Zero-Trust AWS Cloud & Network Architecture

### 5.1 Multi-Tier VPC & Chained Security Groups `[MANDATORY]`
Design the network assuming the perimeter will be breached. Never place compute instances or databases in public subnets.

```
[Internet]
    │
    ▼
[AWS Shield + AWS WAFv2 + CloudFront]
    │ (HTTPS TLS 1.3 + Custom Origin Secret Header)
    ▼
┌─── VPC (Multi-AZ across 3 Availability Zones) ──────────────────────────┐
│                                                                         │
│  ┌── Public Subnet Tier ─────────────────────────────────────────────┐  │
│  │  • Application Load Balancer (ALB) [SG_ALB: Inbound 443 only]     │  │
│  │  • NAT Gateways (For controlled outbound internet patching/APIs)  │  │
│  └───────────────────────────────┬───────────────────────────────────┘  │
│                                  │ Inbound allowed ONLY from SG_ALB     │
│                                  ▼                                      │
│  ┌── Private Application / Compute Subnet Tier ──────────────────────┐  │
│  │  • ECS Fargate / EKS / EC2 Tasks [SG_APP]                         │  │
│  │  • Interface VPC Endpoints (KMS, Secrets Manager, ECR, Logs)      │  │
│  └───────────────────────────────┬───────────────────────────────────┘  │
│                                  │ Inbound allowed ONLY from SG_APP     │
│                                  ▼                                      │
│  ┌── Isolated Data / Persistence Subnet Tier (Zero Route to IGW/NAT) ┐  │
│  │  • RDS PostgreSQL / Aurora [SG_DB: Port 5432 from SG_APP only]    │  │
│  │  • ElastiCache Redis [SG_CACHE: Port 6379 from SG_APP only]       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

*   **Strict Chained Security Groups `[MANDATORY]`**:
    *   Security Groups must reference **upstream Security Group IDs** (`source_security_group_id`), never broad VPC CIDR blocks (`10.0.0.0/16`):
        *   `SG_ALB`: Inbound TCP `443` from CloudFront Managed Prefix List (blocking direct-to-ALB bypass of WAF). Outbound TCP `APP_PORT` strictly to `SG_APP`.
        *   `SG_APP`: Inbound TCP `APP_PORT` strictly from `SG_ALB`. Outbound TCP `5432` strictly to `SG_DB`, TCP `6379` to `SG_CACHE`, and TCP `443` to `SG_VPC_ENDPOINTS` (plus controlled external HTTPS if required).
        *   `SG_DB`: Inbound TCP `5432` strictly from `SG_APP`. **Zero outbound rules** (Databases never initiate outbound connections).
*   **Stateless Network ACLs (NACLs) `[MANDATORY]`**: Configure NACLs on the Isolated Data Subnets to explicitly deny all traffic to/from the Public Subnet CIDRs and external internet as a backup barrier against Security Group misconfigurations.

### 5.2 AWS WAFv2 & DDoS Protection `[MANDATORY]`
*   **Edge Filtering `[MANDATORY]`**: Attach **AWS WAFv2** to CloudFront and the ALB with the following rule sets:
    *   `AWSManagedRulesCommonRuleSet` (Core OWASP protections: SQLi, XSS, LFI, RFI).
    *   `AWSManagedRulesKnownBadInputsRuleSet` (Blocks Log4j, SSRF patterns, and known exploit payloads).
    *   `AWSManagedRulesSQLiRuleSet` & `AWSManagedRulesLinuxRuleSet`.
    *   `AWSManagedRulesAmazonIpReputationList` & `AWSManagedRulesAnonymousIpList` (Blocks Tor exit nodes, botnets, and malicious proxies where appropriate).
    *   **WAF Rate-Based Rules**: Block any IP exceeding threshold requests per $5\text{-minute}$ window at the edge before traffic reaches compute.
*   **Origin Cloaking `[MANDATORY]`**: Configure CloudFront to inject a rotating custom secret header (`X-Origin-Verify` managed via Secrets Manager) and configure the ALB listener rule to drop any request lacking that header, combined with the AWS CloudFront Managed Prefix List on `SG_ALB`.
*   **Geo-Restriction & Bot Control `[ACCORDING TO PS]`**: Enable geographic allow/block lists and AWS WAF Targeted Bot Control if the Problem Statement specifies regional operation (e.g., India-only fintech or US-only govtech) or high-value inventory protection (e.g., ticketing/e-commerce).

### 5.3 IMDSv2 Enforcement & Compute Hardening `[MANDATORY]`
*   **Enforce IMDSv2 Everywhere `[MANDATORY]`**:
    *   Configure an AWS Organizations Service Control Policy (SCP) and launch templates requiring:
        *   `HttpTokens = required` (Disables IMDSv1 `GET http://169.254.169.254/...` completely; requires a session-oriented `PUT` request with `X-aws-ec2-metadata-token-ttl-seconds`).
        *   `HttpPutResponseHopLimit = 1` (Prevents SSRF payloads or compromised containers running inside bridged networks on EC2 hosts from forwarding the PUT packet to the host metadata service).
*   **Task-Level IAM Roles `[MANDATORY]`**: For ECS/EKS, bind least-privilege IAM roles per microservice task/pod (ECS Task Role / EKS Pod Identity) rather than granting permissions to the underlying EC2 node role.

### 5.4 Private VPC Endpoints (AWS PrivateLink) `[MANDATORY]`
*   **Zero Public Internet Traversal for AWS APIs `[MANDATORY]`**:
    *   Provision **Gateway VPC Endpoints** for **Amazon S3** and **Amazon DynamoDB** (free of charge; eliminates NAT Gateway data transfer fees and keeps traffic on the AWS backbone).
    *   Provision **Interface VPC Endpoints (AWS PrivateLink)** for **AWS KMS**, **AWS Secrets Manager**, **Amazon ECR**, **CloudWatch Logs**, and **STS**.
    *   Attach **VPC Endpoint Policies** restricting access so only principals and resources belonging to your AWS Organization (`aws:PrincipalOrgID`) and specific buckets/secrets can be accessed through the endpoint.

---

## 6. Cryptography, Key Management & Secrets Governance

### 6.1 Encryption in Transit (TLS 1.3 & mTLS) `[MANDATORY]`
*   **TLS 1.3 Enforcement `[MANDATORY]`**:
    *   Enforce TLS 1.3 (`TLS_AES_256_GCM_SHA384`, `TLS_CHACHA20_POLY1305_SHA256`, `TLS_AES_128_GCM_SHA256`) at CloudFront and ALB (`ELBSecurityPolicy-TLS13-1-2-Res-2021-06` or stricter TLS 1.3-only policy). Disable TLS 1.0, TLS 1.1, and weak CBC/RC4/3DES ciphers.
    *   Enforce end-to-end encryption: CloudFront $\xrightarrow{\text{TLS 1.3}}$ ALB $\xrightarrow{\text{TLS 1.3}}$ Application Container $\xrightarrow{\text{TLS 1.3}}$ RDS (`rds.force_ssl = 1`) & ElastiCache (`TransitEncryptionEnabled = true`). Never terminate TLS at the load balancer and send plaintext HTTP inside the VPC.
*   **Internal Service-to-Service mTLS `[ACCORDING TO PS]`**: For microservices architectures or regulated fintech/healthcare workloads, enforce mutual TLS (mTLS) via AWS App Mesh / VPC Lattice / Istio with short-lived SPIFFE/X.509 certificates via AWS Private CA.

### 6.2 Encryption at Rest & AWS KMS Customer Managed Keys `[MANDATORY]`
*   **AWS KMS Customer Managed Keys (CMKs) `[MANDATORY]`**:
    *   Use dedicated **Customer Managed Keys (CMKs)** (rather than default AWS-managed keys) for encrypting:
        *   RDS Databases & Automated Snapshots
        *   S3 Buckets (`SSE-KMS` with Bucket Keys enabled to reduce KMS API costs by $99\%$)
        *   EBS Volumes
        *   ElastiCache Redis backups
        *   AWS Secrets Manager secrets
        *   CloudWatch Log Groups & SNS/SQS queues
    *   **Automatic Key Rotation `[MANDATORY]`**: Enable automatic annual cryptographic key rotation (`EnableKeyRotation: true`) on all symmetric KMS CMKs.
    *   **Least-Privilege KMS Key Policies `[MANDATORY]`**: Separate the **Key Administrator** role (can manage/rotate keys, cannot encrypt/decrypt data) from the **Key User** role (application execution role; can call `kms:Decrypt` and `kms:GenerateDataKey` with condition `kms:ViaService`, cannot modify key policies).
*   **Application-Layer Envelope Encryption `[MANDATORY for High-Risk PII/Secrets]`**:
    *   For highly sensitive fields stored in the database (e.g., government IDs, tax numbers, OAuth third-party access tokens, webhook secrets, medical notes), implement **Client-Side / Application-Layer Envelope Encryption** using `AES-256-GCM`:
        1. Request a Data Encryption Key (DEK) from AWS KMS (`GenerateDataKey`).
        2. Encrypt the field using `AES-256-GCM` with a unique $96\text{-bit}$ ($12\text{-byte}$) initialization vector (IV) and authenticated Encryption Context (e.g., `{"tenant_id": "...", "record_id": "..."}`) to prevent ciphertext swapping across rows.
        3. Store the encrypted DEK, IV, authentication tag, and ciphertext together, and zero out the plaintext DEK in memory immediately.

### 6.3 Runtime Secret Injection & Zero Static Credentials `[MANDATORY]`
*   **Zero Secrets in Code or Git `[MANDATORY]`**: Never store API keys, database passwords, JWT private keys, or `.env` files in source control, Docker images, or plaintext CI variables.
*   **Runtime Injection via AWS Secrets Manager `[MANDATORY]`**:
    *   Inject secrets dynamically at container startup or fetch and cache them in memory via the **AWS Parameters and Secrets Lambda Extension** / ECS `secrets` task definition block.
    *   **Automated Rotation `[MANDATORY]`**: Configure AWS Secrets Manager automated rotation (every $30\text{ to }90\text{ days}$) using the **Alternating Users Strategy** for RDS databases so secret rotation occurs with zero application downtime.

---

## 7. Database, Persistence & Data Layer Hardening

### 7.1 SQL/NoSQL Injection Defense & Role Segregation `[MANDATORY]`
*   **Parameterized Queries Only `[MANDATORY]`**: Use prepared statements / parameterized queries exclusively (`$1, $2` in PostgreSQL). Strictly forbid string concatenation or template literals inside raw SQL queries, `ORDER BY` clauses, or NoSQL filter objects (sanitize MongoDB/JSONB inputs to strip `$where`, `$gt`, `$ne` operator injection).
*   **Database Principle of Least Privilege `[MANDATORY]`**:
    *   Never connect the web application to the database using the `postgres` superuser or schema owner account.
    *   Create three distinct database roles:
        1. `db_migrator`: Used only during CI/CD deployment jobs to run DDL (`CREATE`, `ALTER`, `DROP`).
        2. `app_runtime`: Used by the live backend; granted only `SELECT`, `INSERT`, `UPDATE`, `DELETE` on application tables (and `INSERT, SELECT` only on audit log tables—never `DELETE` or `DROP`).
        3. `db_readonly`: Used by analytics or reporting workers.
    *   Authenticate compute tasks to RDS using **RDS IAM Database Authentication** (short-lived $15\text{-minute}$ auth tokens) where supported.

### 7.2 PostgreSQL Row-Level Security (RLS) `[MANDATORY for Multi-Tenant Apps]`
*   Even if a developer forgets a `WHERE tenant_id = $1` filter in application code, PostgreSQL **Row-Level Security (RLS)** acts as a database-enforced firewall:
    ```sql
    ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
    ALTER TABLE invoices FORCE ROW LEVEL SECURITY;
    CREATE POLICY tenant_isolation_policy ON invoices
        USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
    ```
*   At the start of every database transaction, the backend middleware sets `SET LOCAL app.current_tenant_id = '...';`.

### 7.3 Backup Resilience & Ransomware Protection `[MANDATORY]`
*   Enable Point-in-Time Recovery (PITR), automated daily snapshots, `DeletionProtection = true`, and cross-region backup replication into a dedicated backup vault secured with **AWS Backup Vault Lock (WORM - Write Once Read Many)** so even a compromised root/admin credential cannot delete backups.

---

## 8. Supply Chain, Container & CI/CD Security

### 8.1 Container Hardening `[MANDATORY]`
*   **Minimal Base Images `[MANDATORY]`**: Use multi-stage Docker builds ending in **Distroless** (`gcr.io/distroless/nodejs22-debian12`) or minimal hardened Alpine images pinned by immutable SHA-256 digest (`FROM node:22-alpine@sha256:...`), never mutable `:latest` tags.
*   **Non-Root Execution & Read-Only Root Filesystem `[MANDATORY]`**:
    *   Run the container process as an unprivileged user (`USER 10001:10001`).
    *   Configure `readonlyRootFilesystem: true` in ECS/Kubernetes (mounting an ephemeral `tmpfs` volume with `noexec,nosuid,nodev` only at `/tmp` if temporary scratch space is needed).
    *   Drop all Linux kernel capabilities (`capDrop: ["ALL"]`) and enable `no-new-privileges`.

### 8.2 CI/CD Pipeline & Dependency Security `[MANDATORY]`
*   **Keyless OIDC CI/CD Authentication `[MANDATORY]`**: Authenticate GitHub Actions / GitLab CI to AWS using **OpenID Connect (OIDC)** federation with short-lived STS tokens scoped to the exact repository and branch (`repo:org/repo:ref:refs/heads/main`). Never store static `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in CI/CD secrets.
*   **Automated Security Gates on Every Pull Request `[MANDATORY]`**:
    *   **Secret Scanning**: `gitleaks` / `trufflehog` (pre-commit hook + CI gate).
    *   **Software Composition Analysis (SCA)**: Enforce lockfile integrity (`npm ci --ignore-scripts` or `pnpm install --frozen-lockfile --ignore-scripts`) and block builds with critical CVEs (`trivy` / `osv-scanner`).
    *   **SAST & IaC Scanning**: Scan application code (`semgrep`) and Terraform/CloudFormation (`checkov` / `tfsec`) before merge.

---

## 9. Observability, Audit Logging & Error Handling

### 9.1 Fail-Safe Error Handling `[MANDATORY]`
*   **Zero Stack Trace Leakage `[MANDATORY]`**: Global exception handlers must catch all unhandled errors and return a standardized RFC 9457 Problem Details JSON response containing only a generic safe message and a unique `correlationId` (`trace_id`), while logging the full stack trace internally.
*   **Constant-Time Responses on Auth Flows `[MANDATORY]`**: Prevent user enumeration on login, registration, and password reset endpoints by returning identical HTTP status codes, identical response messages (*"If an account matches that email, we have sent instructions"*), and normalizing execution timing.

### 9.2 Structured Logging with Automated PII Redaction `[MANDATORY]`
*   **Redaction Pipeline `[MANDATORY]`**: Configure the structured JSON logger (`pino` / `winston`) with an automated redaction list that masks `Authorization` headers, cookies, `password`, `token`, `secret`, `creditCard`, `ssn`, and `cvv` fields before log serialization.
*   **Immutable Security Audit Trail `[MANDATORY]`**: Record all security-critical events (login success/failure, MFA changes, role escalations, password resets, API key creation, data exports, BOLA violation attempts) in an append-only audit table with actor ID, IP address, User-Agent, timestamp, target resource, and cryptographic hash chaining.
*   **Cloud Threat Detection `[MANDATORY]`**: Enable multi-region **AWS CloudTrail** (with Log File Validation and KMS encryption), **AWS GuardDuty**, **AWS Config**, and **AWS Security Hub**.

---

## 10. Problem-Statement Driven Architecture & Theme Matrix `[ACCORDING TO PS]`

When analyzing a new Problem Statement (PS), the AI Architect must evaluate the following dimensions and apply the corresponding security and UI/UX controls:

| Dimension | Determined By PS `[ACCORDING TO PS]` | Mandatory Implementation Once Selected `[MANDATORY]` |
| :--- | :--- | :--- |
| **UI Theme, Brand & Visual Design** | Color palette, typography, dark/light mode, domain aesthetic (e.g., sleek fintech dashboard, medical clinical portal, minimalist developer tool), layout structure. | **Secure UI States**: Visually distinguish public vs. private resources, display clear session-timeout warnings, mask sensitive values (`•••• 4242`) with explicit "Reveal" audit triggers, and never rely on hidden CSS/disabled buttons (`disabled={true}`) as security—every UI restriction **must** be backed by server-side authorization. |
| **Multi-Tenancy Model** | Single-tenant consumer app vs. Multi-tenant B2B workspace vs. Siloed Enterprise deployment. | If Multi-Tenant: Enforce tenant context resolution middleware, PostgreSQL Row-Level Security (RLS), tenant-prefixed S3 prefixes (`s3://bucket/{tenant_id}/...`), and per-tenant rate limits. |
| **Compliance & Regulatory Regime** | Healthcare (HIPAA), Payments (PCI-DSS), European Users (GDPR), Indian Users (DPDP Act), Enterprise (SOC2). | • **Payments**: Never touch raw PAN/CVV on backend servers; use tokenized iframes (Stripe Elements / Razorpay).<br>• **Privacy (GDPR/DPDP)**: Implement automated "Right to Erasure" (cryptographic shredding + PII anonymization) and data export endpoints.<br>• **Healthcare (HIPAA)**: Enable BAA-eligible AWS services, strict PHI access audit logs, and automatic $15\text{-minute}$ idle session lockouts. |
| **Real-Time & AI/LLM Features** | Chatbots, RAG pipelines, code execution sandboxes, collaborative editing. | • **AI/LLM in PS**: Implement Prompt Injection defenses (system prompt isolation, input/output guardrails), per-user token spend limits, and ensure vector database queries filter by `user_id`/`tenant_id` before similarity search.<br>• **Code Execution in PS**: Run untrusted code exclusively inside ephemeral Firecracker microVMs or gVisor sandboxes with zero network access. |
| **Public Sharing & Access Links** | Whether users can share files/dashboards externally via link. | If enabled: Require cryptographically random capability tokens ($\ge 256\text{ bits}$), optional password protection (Argon2id), mandatory expiration dates, and immediate revocation controls. |

---

## 11. Pre-Production Verification Checklist for Antigravity Agents

Before marking any backend, frontend, or infrastructure module complete, verify:
1. [ ] Are strict HTTP headers (`CSP` with nonces, `HSTS`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, `X-Frame-Options`) active on all responses?
2. [ ] Is CORS locked to an explicit origin allowlist without wildcards on credentialed routes?
3. [ ] Are all state-changing endpoints protected against CSRF and enforcing `Idempotency-Key` where applicable?
4. [ ] Is every rich-text/Markdown rendering path sanitized via **DOMPurify** with forbidden script/style/iframe/svg tags?
5. [ ] Does **every** database query include ownership/tenant scoping (`WHERE id = $1 AND user_id = $2`) to eliminate BOLA/IDOR?
6. [ ] Are all inputs validated via strict schemas (unknown keys rejected) and outputs serialized via explicit DTOs (preventing BOPLA)?
7. [ ] Do file uploads use constrained **Presigned S3 URLs** to a **Quarantine Bucket**, followed by **Magic-Byte verification**, **Antivirus scanning**, and **EXIF stripping** before moving to the production bucket?
8. [ ] Does every outbound server-side URL fetch validate schemes/ports, resolve DNS once, and block all private/loopback/link-local/IMDS (`169.254.169.254`) CIDR ranges to eliminate SSRF?
9. [ ] Is the AWS VPC segmented into Public, Private App, and Isolated Data subnets with **Chained Security Groups** (`SG_ALB -> SG_APP -> SG_DB`), **AWS WAFv2**, **IMDSv2 (`HopLimit = 1`)**, and **Private VPC Endpoints**?
10. [ ] Is **TLS 1.3** enforced end-to-end, are **AWS KMS CMKs** with automatic rotation enabled for all storage, and are all secrets injected at runtime via **AWS Secrets Manager** with zero hardcoded secrets?