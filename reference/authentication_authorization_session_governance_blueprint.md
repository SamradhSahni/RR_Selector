# Enterprise Authentication, Authorization & Session Governance Blueprint

> **Purpose of this Document (Agent Directive):**  
> This document serves as the authoritative architectural knowledge base for designing, implementing, and auditing **Authentication (AuthN), Authorization (AuthZ), and Session Governance** in modern web applications. Every concept, security control, and UX pattern is explicitly classified into one of two execution tiers:
> - **`[MANDATORY]`**: Non-negotiable standards required for any production-grade, secure, high-performance web application. Any feature, security mechanism, or UX optimization that inherently improves web security, reliability, accessibility, or user experience falls under this category and **must** be implemented by default.
> - **`[ACCORDING TO PS]`**: Architectural choices, identity providers, domain-specific role hierarchies, and visual theming/design specifications that depend directly on the project's **Problem Statement (PS)**, target audience (B2C vs. B2B vs. Enterprise), and business domain.

---

## 1. Multi-Modal Authentication Architecture

Modern web applications must balance frictionless user onboarding with cryptographic assurance.

### 1.1 Credential-Based Authentication (Email/Username & Password)
*   **Classification**: **`[MANDATORY]`** *(If password authentication is included in the system)*
*   **Memory-Hard Password Hashing** **`[MANDATORY]`**:
    *   Never store plaintext passwords or use fast hashes (`MD5`, `SHA-1`, `SHA-256`).
    *   Use **Argon2id** as the primary hashing algorithm (minimum configuration per OWASP guidelines: memory $m = 19456\text{ KiB}$ ($19\text{ MiB}$), iterations $t = 2$, parallelism $p = 1$, with a unique cryptographically random $128\text{-bit}$ salt per password).
    *   Fallback alternative: **bcrypt** (cost factor $\ge 12$) with a pre-hash `HMAC-SHA256` to prevent the $72\text{-byte}$ truncation vulnerability.
*   **Application-Layer Peppering** **`[MANDATORY]`**:
    *   Apply an application-wide secret `HMAC` pepper stored in the environment/KMS (separate from the database) prior to or after hashing so that a standalone database dump (SQLi or backup leak) cannot be cracked offline.
*   **Password Policy & Breached Credential Screening** **`[MANDATORY]`**:
    *   Follow **NIST SP 800-63B** standards: enforce a minimum length of $8\text{--}12$ characters and a maximum length of at least $64\text{--}128$ characters. Allow all printable ASCII and Unicode characters (including spaces and emojis).
    *   Do **not** enforce arbitrary composition rules (e.g., "must contain 1 symbol, 1 uppercase, 1 number") or periodic forced password rotation unless a compromise is detected.
    *   Integrate **k-Anonymity Breached Password Screening** (e.g., HaveIBeenPwned Pwned Passwords API by sending only the first $5$ hex characters of the `SHA-1` hash) or an internal bloom filter of top $100,000$ compromised passwords during registration and password changes.

### 1.2 OAuth 2.1 & OpenID Connect (OIDC) Social Logins
*   **Classification**:
    *   Security protocol mechanics (PKCE, state validation, account linking hygiene): **`[MANDATORY]`**
    *   Selection of specific providers (e.g., Google, GitHub, Apple, Microsoft, Discord, LinkedIn): **`[ACCORDING TO PS]`**
*   **Authorization Code Flow with PKCE** **`[MANDATORY]`**:
    *   Always use the Authorization Code Flow paired with **Proof Key for Code Exchange (PKCE)** using the `S256` challenge method ($\text{BASE64URL}(\text{SHA256}(\text{code\_verifier}))$). Never use the deprecated Implicit Flow (`response_type=token`).
*   **CSRF & Replay Protection (`state` & `nonce`)** **`[MANDATORY]`**:
    *   Generate a cryptographically random, unguessable `state` parameter bound to the user's browser via a short-lived `HttpOnly` cookie to prevent Login CSRF.
    *   For OIDC flows, include a cryptographic `nonce` inside the ID Token claims and verify it upon token exchange to prevent token replay attacks.
*   **Safe Account Linking & Pre-Hijacking Defense** **`[MANDATORY]`**:
    *   Never automatically merge an OAuth login with an existing account based solely on an email match unless **both** the existing local account email AND the incoming OAuth provider's `email_verified` claim are explicitly verified as `true` by an authoritative provider.
    *   If an unverified OAuth provider returns an email matching an existing password account, require the user to authenticate with their existing credentials once before linking the provider identity (`oauth_accounts` table).

### 1.3 Passwordless Magic Links & Email/SMS One-Time Codes (OTP)
*   **Classification**:
    *   Email Magic Links / Email OTP availability: **`[ACCORDING TO PS]`** *(Highly recommended as a default low-friction option)*
    *   Cryptographic & scanner-resistant implementation: **`[MANDATORY]`**
*   **Token Generation & Hashed Storage** **`[MANDATORY]`**:
    *   Generate magic link tokens with at least $256\text{ bits}$ of cryptographic entropy ($\text{CSPRNG}$).
    *   Store **only the `SHA-256` hash** of the magic link token or OTP in the database, never the raw token.
*   **Strict TTL & Single-Use Enforcement** **`[MANDATORY]`**:
    *   Enforce a strict Time-To-Live (TTL) of $10\text{--}15\text{ minutes}$ for magic links and $5\text{--}10\text{ minutes}$ for $6\text{-digit}$ numeric OTPs.
    *   Immediately invalidate the token upon first consumption and invalidate all previously issued unused tokens for that user when a new one is requested.
*   **Enterprise Email Scanner & Pre-Fetching Defense** **`[MANDATORY]`**:
    *   Corporate email security gateways (e.g., Microsoft Defender Safe Links, Proofpoint) automatically `GET` links inside emails, which prematurely consumes single-use tokens if state mutation occurs on `GET`.
    *   **Solution**: The magic link `GET /auth/magic-link?token=xyz` must render an intermediate lightweight landing page that validates token existence without consuming it, and triggers an explicit `POST /auth/magic-link/verify` request via user interaction (or JavaScript execution with bot filtering) to exchange the token for a session.

### 1.4 WebAuthn & Passkeys (FIDO2)
*   **Classification**:
    *   Passkey support for phishing-resistant authentication: **`[MANDATORY]`** *(For modern high-security web applications)*
*   **Relying Party (RP) Configuration & Discoverable Credentials** **`[MANDATORY]`**:
    *   Bind credentials strictly to the canonical domain (`rpId`).
    *   Support both **Synced Passkeys** (multi-device credentials backed up via iCloud Keychain, Google Password Manager, 1Password) and **Hardware Security Keys** (YubiKey).
*   **Conditional UI (Autofill Integration)** **`[MANDATORY]`**:
    *   Implement WebAuthn Conditional Mediation (`mediation: 'conditional'`) paired with `<input autocomplete="username webauthn">` so users can select their Passkey directly from the browser's native autofill prompt upon focusing the login input.
*   **Cryptographic Challenge & Signature Counter (`signCount`)** **`[MANDATORY]`**:
    *   Generate a fresh $\ge 16\text{-byte}$ random challenge per registration/authentication ceremony stored in a short-lived server session ($TTL \le 5\text{ minutes}$).
    *   Store the public key, credential ID, transports, backup eligibility flags (`BE`/`BS`), and `signCount`. If a hardware authenticator reports a `signCount` $> 0$ that is less than or equal to the previously recorded `signCount`, flag the credential as potentially cloned, reject the login, and alert the user.

### 1.5 Enterprise Single Sign-On (SAML 2.0 & Enterprise OIDC) & SCIM
*   **Classification**: **`[ACCORDING TO PS]`** *(Required for B2B SaaS, Enterprise platforms, and multi-organization workspaces; not needed for pure B2C consumer apps)*
*   **Home Realm Discovery (HRD) & Domain Capture** **`[ACCORDING TO PS]`**:
    *   Implement an identifier-first login screen (email input first). Inspect the email domain (e.g., `@acme.com`); if the domain is claimed and verified via DNS `TXT` records by an enterprise tenant with active SSO enforcement, dynamically hide the password field and redirect to the tenant's Identity Provider (Okta, Microsoft Entra ID, Google Workspace, PingFederate).
*   **SAML 2.0 Security Hardening** **`[MANDATORY]`** *(When SAML is enabled)*:
    *   Enforce strict XML schema validation and canonicalization to prevent **XML Signature Wrapping (XSW)** and **XML External Entity (XXE)** injection attacks.
    *   Validate `AudienceRestriction`, `Recipient`, `NotBefore`, `NotOnOrAfter`, and `InResponseTo` assertions. Cache processed Assertion IDs until their `NotOnOrAfter` timestamp expires to prevent assertion replay.
*   **Just-In-Time (JIT) Provisioning vs. SCIM 2.0 Directory Sync** **`[ACCORDING TO PS]`**:
    *   **JIT Provisioning**: Automatically create or update user accounts and map IdP group attributes to application roles upon initial SSO login.
    *   **SCIM 2.0 (System for Cross-domain Identity Management)**: Expose authenticated REST endpoints (`/scim/v2/Users`, `/scim/v2/Groups`) to support automated lifecycle provisioning and **instant deprovisioning** (revoking all active sessions immediately when an employee is deactivated in Okta/Entra ID).

---

## 2. Adaptive Multi-Factor Authentication (MFA) & Risk Engine

MFA must protect both initial authentication and high-privilege in-session mutations without degrading legitimate user workflows.

### 2.1 Time-Based One-Time Passwords (TOTP - RFC 6238)
*   **Classification**: **`[MANDATORY]`**
*   **Enrollment & Verification Flow** **`[MANDATORY]`**:
    *   Generate a $160\text{-bit}$ ($20\text{-byte}$) Base32-encoded secret and render an `otpauth://totp/...` QR code alongside a manual copyable setup key.
    *   Never mark TOTP as active in the database until the user successfully submits a valid $6\text{-digit}$ code confirming their authenticator app is properly synced.
*   **Encryption at Rest & Replay Prevention** **`[MANDATORY]`**:
    *   Unlike passwords, TOTP secrets must be decrypted by the server to compute the HMAC. Store TOTP secrets encrypted using authenticated encryption (**AES-256-GCM**) with keys managed via KMS or environment-level envelope encryption.
    *   Allow a maximum clock-skew window of $\pm 1$ time step ($30\text{ seconds}$).
    *   **Replay Mitigation**: Record the `last_used_timestep` for each user's TOTP credential. Reject any TOTP code whose time-step is $\le \text{last\_used\_timestep}$ so an intercepted code cannot be reused within the same $30\text{--}90\text{ second}$ window.

### 2.2 Recovery & Backup Codes
*   **Classification**: **`[MANDATORY]`** *(Whenever MFA is enabled)*
*   **Generation & Lifecycle** **`[MANDATORY]`**:
    *   Automatically generate $8\text{--}10$ single-use high-entropy recovery codes (e.g., `XXXX-XXXX-XXXX` alphanumeric format) upon MFA enrollment.
    *   Prompt the user to download, print, or copy the codes once; never display them in plaintext again.
    *   Hash each recovery code individually (using Argon2id or salted HMAC-SHA256) in the database. Mark each code as `used_at` upon consumption, and allow the user to regenerate a fresh batch (which atomically invalidates all previous codes) after step-up authentication.

### 2.3 Step-Up Authentication (`sudo` Mode)
*   **Classification**:
    *   Step-up verification mechanism: **`[MANDATORY]`**
    *   Specific business actions triggering step-up: **`[ACCORDING TO PS]`**
*   **Contextual Re-Verification Architecture** **`[MANDATORY]`**:
    *   Possessing an active session is insufficient for destructive or high-privilege mutations. Require re-authentication via Passkey, TOTP, or Password before executing sensitive operations.
    *   Upon successful verification, issue a short-lived `sudo_verified_at` timestamp claim in the session ($TTL = 10\text{--}15\text{ minutes}$).
    *   **Mandatory Default Triggers** **`[MANDATORY]`**: Changing account password, changing primary email address, disabling MFA, generating/revoking API keys, deleting the user account, or transferring workspace ownership.
    *   **Domain-Specific Triggers** **`[ACCORDING TO PS]`**: Modifying billing/payout destinations, viewing unmasked PII/financial records, exporting full organization datasets, or modifying production infrastructure configurations.

### 2.4 Adaptive Risk Scoring & Anomalous Login Detection
*   **Classification**:
    *   New device/IP login alerting & session fingerprinting: **`[MANDATORY]`**
    *   Geo-velocity / Impossible Travel & ASN threat feeds: **`[ACCORDING TO PS]`** *(Mandatory for fintech, healthcare, and enterprise SaaS; optional for lightweight utilities)*
*   **Device & Network Context Evaluation** **`[MANDATORY]`**:
    *   Evaluate incoming logins against historical user baselines: IP address, GeoIP country/city, Autonomous System Number (ASN), parsed `User-Agent` (OS/Browser family), and TLS/device fingerprint.
    *   **Automated Security Notifications**: When a login succeeds from an unrecognized device or new geographic region, dispatch an immediate transactional security alert email containing the timestamp, approximate location, browser/OS, IP address, and a one-click **"This wasn't me — Secure Account"** link.
    *   **Risk-Based Challenge Escalation**: If an login originates from a known Tor exit node, data center IP, or exhibits "impossible travel" (e.g., login from New York followed $10\text{ minutes}$ later by a login from Tokyo), automatically enforce an MFA or email OTP challenge even if the user has "Remember this device" enabled.

---

## 3. Token Lifecycle, Cookie Security & Session Governance

Session governance dictates how authenticated state persists securely across requests while enabling instantaneous revocation when threats emerge.

### 3.1 Token Architecture: Dual-Token Rotation vs. Stateful BFF Sessions
*   **Classification**: **`[MANDATORY]`**
*   **Pattern A: Dual-Token Architecture (Short-Lived JWT Access Token + Rotating Stateful Refresh Token)**
    *   **Access Token**: Stateless or semi-stateless JWT signed with asymmetric keys (`EdDSA` / `RS256`) using a rotating JSON Web Key Set (`/.well-known/jwks.json`). Strict lifespan: $5\text{--}15\text{ minutes}$. Contains minimal claims: `sub` (User ID), `sid` (Session ID), `org_id` (Active Tenant), `role`, `iat`, `exp`, `iss`, `aud`. Never store sensitive PII inside a JWT payload.
    *   **Refresh Token**: High-entropy opaque token (or signed reference token) backed by a persistent database/Redis session record. Lifespan: $7\text{--}30\text{ days}$ (sliding window with an absolute maximum lifetime of $90\text{ days}$).
*   **Pattern B: Backend-For-Frontend (BFF) / Server-Side Opaque Session ID**
    *   Ideal for monolithic or SSR/fullstack frameworks (Next.js, Remix, Nuxt, Django, Rails, Go). A $256\text{-bit}$ random session token is sent in an `HttpOnly` cookie, resolved on the server via an ultra-fast Redis cache backed by PostgreSQL.

### 3.2 Refresh Token Rotation & Reuse Detection (Compromise Containment)
*   **Classification**: **`[MANDATORY]`** *(Whenever Refresh Tokens are used)*
*   **Automatic Token Family Tracking** **`[MANDATORY]`**:
    *   Every time a Refresh Token $RT_1$ is used to obtain a new Access Token, $RT_1$ is marked as rotated/invalidated, and a new Refresh Token $RT_2$ belonging to the same `token_family_id` is issued.
    *   **Reuse Detection (Theft Alarm)**: If an attacker steals $RT_1$ and attempts to use it after the legitimate client has already rotated to $RT_2$ (or vice versa), the server detects that an already-rotated token was presented.
    *   **Response**: Immediately revoke the **entire `token_family_id`** (invalidating $RT_2$ and all descendant tokens), terminate the session, log a `REFRESH_TOKEN_REUSE_DETECTED` high-severity security event, and force full re-authentication.
    *   **Network Concurrency Grace Window**: Allow a tiny grace period ($5\text{--}10\text{ seconds}$) where concurrent requests from the same IP/User-Agent presenting the just-rotated token receive the same newly minted token pair without triggering a false-positive family revocation.

### 3.3 Cookie Security Hardening
*   **Classification**: **`[MANDATORY]`**
*   **Strict Cookie Attributes** **`[MANDATORY]`**:
    *   **Zero `localStorage` / `sessionStorage` for Tokens**: Never store Refresh Tokens or long-lived session tokens in `localStorage` or `sessionStorage`, as any XSS vulnerability allows instant full-account exfiltration.
    *   **`__Host-` Cookie Prefix**: Name session cookies using the `__Host-` prefix (e.g., `__Host-session` or `__Host-refresh_token`). This browser-enforced standard guarantees the cookie is sent only over `HTTPS`, has no `Domain` attribute (preventing subdomain cookie tossing attacks), and is locked to `Path=/`.
    *   **Flags**:
        *   `HttpOnly`: Mandatory (blocks `document.cookie` access).
        *   `Secure`: Mandatory in all non-localhost environments.
        *   `SameSite=Strict` or `SameSite=Lax`: Use `Strict` for sensitive API/refresh endpoints (`Path=/api/auth/refresh`), and `Lax` for primary navigation session cookies so top-level external links maintain logged-in UX.

### 3.4 Cross-Site Request Forgery (CSRF) Defense-in-Depth
*   **Classification**: **`[MANDATORY]`** *(For all cookie-authenticated endpoints)*
*   **Layered CSRF Mitigation** **`[MANDATORY]`**:
    1.  **Fetch Metadata Request Headers**: Inspect `Sec-Fetch-Site` (`same-origin` / `same-site` vs `cross-site`) and `Sec-Fetch-Mode` headers on all state-mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`).
    2.  **Origin & Referer Verification**: Validate that the `Origin` header strictly matches the application's allowed origin list.
    3.  **Cryptographic Anti-CSRF Token**: Implement the Host-bound Double-Submit Cookie pattern (`__Host-csrf`) or Synchronizer Token pattern coupled with a custom request header (`X-CSRF-Token`).

### 3.5 Active Session Ledger & Instant Revocation
*   **Classification**: **`[MANDATORY]`**
*   **User-Facing Session Management UI** **`[MANDATORY]`**:
    *   Provide a dedicated **Active Sessions & Devices** section in the user's account security settings displaying:
        *   Device type & OS icon (e.g., macOS, Windows, iOS, Android)
        *   Browser name & version
        *   IP address & approximate city/country
        *   Initial sign-in timestamp & `last_active_at` timestamp
        *   Explicit badge highlighting the **"Current Session"**
    *   Provide individual **"Revoke"** buttons per session and a global **"Sign out of all other sessions"** button.
*   **Zero-Latency Revocation Propagator** **`[MANDATORY]`**:
    *   Even when using short-lived JWT Access Tokens ($5\text{--}15\text{ minutes}$), critical events (password reset, account suspension, MFA reset, explicit logout, compromise detection) must take effect **immediately** ($0\text{ ms}$ delay).
    *   Maintain a lightweight Redis revocation key (`revoked_session:{sid}` with TTL equal to the remaining JWT lifespan) or compare the JWT's `token_version` claim against a cached `user:{id}:token_version` counter incremented on security mutations.

---

## 4. Granular Access Control (RBAC, ABAC & ReBAC)

Authentication answers *"Who are you?"*; Authorization answers *"What are you allowed to do, on which resource, and under what conditions?"*

### 4.1 Multi-Tenant Isolation & Scope Boundaries
*   **Classification**:
    *   Strict tenant isolation & IDOR prevention: **`[MANDATORY]`**
    *   Account structure (Single-user Personal vs. B2B Multi-Workspace vs. Hierarchical Enterprise): **`[ACCORDING TO PS]`**
*   **Structural Hierarchy** **`[ACCORDING TO PS]`**:
    *   **Personal Scope**: Individual user-owned resources.
    *   **Workspace / Organization Scope**: Shared multi-user boundary with billing, member management, and tenant-wide settings.
    *   **Team / Project Scope**: Sub-divisions within an organization with scoped visibility.
    *   **System / Super-Admin Scope**: Internal platform operations, support tooling, and tenant moderation.
*   **Tenant Context Resolution** **`[MANDATORY]`**:
    *   Every API request operating within a workspace must resolve the active `workspace_id` (via path parameter, subdomain, header `X-Workspace-Id`, or active session claim) and verify active membership **before** executing any business logic or database query.

### 4.2 Role-Based Access Control (RBAC)
*   **Classification**:
    *   Permission-based evaluation engine (evaluating granular permissions rather than hardcoded role names): **`[MANDATORY]`**
    *   Specific roles & custom role creation UI: **`[ACCORDING TO PS]`**
*   **Decoupling Roles from Code via Granular Scopes** **`[MANDATORY]`**:
    *   **Anti-Pattern**: Scattering `if (user.role === 'admin' || user.role === 'manager')` across controllers.
    *   **Best Practice**: Map Roles to atomic `<resource>:<action>` permissions (e.g., `projects:create`, `projects:delete`, `billing:read`, `billing:manage`, `members:invite`, `audit_logs:export`). Application middleware and UI components check strictly for the required permission (`hasPermission(user, 'billing:manage')`).
*   **Standard Baseline Role Matrix** **`[ACCORDING TO PS]`**:
    *   `Owner`: Full control including workspace deletion, ownership transfer, and billing management.
    *   `Admin`: Full operational control (member management, integrations, project settings), excluding workspace destruction.
    *   `Member` / `Editor`: Can create, modify, and collaborate on domain resources.
    *   `Viewer` / `Billing` / `Guest`: Read-only or strictly scoped access to specific resources.

### 4.3 Attribute-Based Access Control (ABAC) & Policy Engine
*   **Classification**:
    *   Ownership & resource-state checks: **`[MANDATORY]`**
    *   Advanced environmental/contextual policies (IP restrictions, time windows, plan entitlements): **`[ACCORDING TO PS]`**
*   **Contextual Policy Evaluation** **`[MANDATORY]`**:
    *   Evaluate authorization decisions as a function of four attribute sets:
        $$\text{Decision} = f(\text{Subject}, \text{Resource}, \text{Action}, \text{Environment})$$
    *   **Subject Attributes**: User ID, Role, Department, Clearance Level, MFA Verification Status (`amr`), Account Status.
    *   **Resource Attributes**: `owner_id`, `workspace_id`, `status` (e.g., `draft` vs `locked`/`archived`), `visibility` (`private`, `internal`, `public`).
    *   **Environment Attributes**: Request IP (matching Organization IP Allowlist), Timestamp, Auth Method (Interactive Session vs API Key).
    *   **Subscription / Entitlement Gating** **`[ACCORDING TO PS]`**: Combine authorization with plan entitlements (e.g., checking whether `workspace.plan_tier` permits `sso:configure` or `audit_logs:export`).

### 4.4 Relationship-Based Access Control (ReBAC)
*   **Classification**: **`[ACCORDING TO PS]`** *(Required for collaborative apps with nested folders, documents, fine-grained sharing links, or complex org charts like Notion, Google Drive, Figma, Linear)*
*   **Graph/Tuple Authorization Model** **`[ACCORDING TO PS]`**:
    *   Model permissions as relationship tuples: `(User, Relation, Object)`, e.g., `user:alice` is `editor` of `folder:engineering`, and `doc:spec_v1` has `parent` `folder:engineering` $\rightarrow$ therefore `user:alice` inherits `editor` permissions on `doc:spec_v1`.

### 4.5 Policy Enforcement Point (PEP) & Database-Level Isolation
*   **Classification**: **`[MANDATORY]`**
*   **Centralized Authorization Middleware & Declarative Guards** **`[MANDATORY]`**:
    *   Enforce a **"Deny by Default"** posture. Every API route must explicitly declare its authentication and authorization policy (e.g., `@Public()`, `@RequireAuth()`, `@RequirePermission('projects:write')`, `@RequireSudo()`).
*   **Eliminating BOLA / IDOR (Broken Object Level Authorization)** **`[MANDATORY]`**:
    *   Never fetch a record solely by its primary key (`SELECT * FROM invoices WHERE id = $1`) when queried by a user. Always scope queries by the authorized tenant/owner context (`SELECT * FROM invoices WHERE id = $1 AND workspace_id = $2`) or enforce PostgreSQL **Row-Level Security (RLS)** policies bound to the current transaction's session variables.
    *   Use non-sequential external identifiers (**UUIDv4**, **UUIDv7**, or **ULID** / **NanoID**) for all public-facing URLs and API payloads so attackers cannot enumerate sequential integer IDs.

---

## 5. Machine-to-Machine (M2M), API Keys & Delegated Access

### 5.1 Scoped Personal Access Tokens (PATs) & Organization API Keys
*   **Classification**: **`[ACCORDING TO PS]`** *(Mandatory if the application exposes a public API, CLI, SDK, or third-party integrations; implementation security rules below are **`[MANDATORY]`** whenever API keys exist)*
*   **Secret Scanning Prefix & Checksum Format** **`[MANDATORY]`**:
    *   Format all generated tokens with an identifiable vendor/environment prefix (e.g., `sk_live_...`, `sk_test_...`, `pat_...`) so GitHub Secret Scanning, GitGuardian, and internal log scrubbers can automatically detect and revoke leaked credentials.
*   **Zero-Plaintext Storage & Masked Identification** **`[MANDATORY]`**:
    *   Display the raw API key to the user **only once** at creation time.
    *   Store only the `SHA-256` hash of the API key in the database alongside the key's prefix and last $4$ characters (e.g., `sk_live_...9f4a`) so users can identify which key to rotate or revoke.
*   **Scoped Permissions, Expiration & IP Restrictions** **`[MANDATORY]`**:
    *   Require users to select granular permission scopes (Read-Only vs Write per resource) and an expiration policy ($7\text{ days}$, $30\text{ days}$, $90\text{ days}$, $1\text{ year}$, or custom date) when creating an API key.
    *   Track `last_used_at` and `last_used_ip` asynchronously for every API key.

---

## 6. Abuse Prevention, Account Lifecycle & Compliance Governance

### 6.1 Layered Rate Limiting & Brute-Force Protection
*   **Classification**: **`[MANDATORY]`**
*   **Multi-Dimensional Rate Limiting (Token Bucket / Sliding Window in Redis)** **`[MANDATORY]`**:
    *   Apply distinct rate limits across both **IP Address** AND **Target Account Identifier** (email/username):
        *   `POST /auth/login`: Max $5\text{--}10$ failed attempts per $15\text{ minutes}$ per `(ip, email)` pair; max $30$ attempts per $15\text{ minutes}$ per IP across all accounts (credential stuffing defense).
        *   `POST /auth/forgot-password` & `POST /auth/magic-link`: Max $3$ requests per $15\text{ minutes}$ per email; max $10$ per hour per IP (email bombing defense).
        *   `POST /auth/mfa/verify`: Max $5$ failed attempts per $10\text{ minutes}$ before invalidating the login challenge token and requiring full primary credential re-entry.
*   **Account Lockout vs. Progressive Friction** **`[MANDATORY]`**:
    *   Avoid permanent hard account lockouts triggered purely by unauthenticated failed attempts (which allows attackers to perform a Denial-of-Service lockout against legitimate users).
    *   Instead, enforce progressive exponential backoff, require adaptive CAPTCHA (Cloudflare Turnstile / hCaptcha) after $3$ failed attempts, or require email verification unlock for unrecognized IPs.

### 6.2 User Enumeration & Timing Attack Prevention
*   **Classification**: **`[MANDATORY]`**
*   **Response Uniformity & Timing Equalization** **`[MANDATORY]`**:
    *   **Login**: Always return `"Invalid email or password"`—never `"Account does not exist"` or `"Password is incorrect"`. If an email does not exist in the database, execute a dummy Argon2id hash comparison against a precomputed dummy hash so response latency remains constant ($\Delta t \approx 0$).
    *   **Password Reset / Magic Link**: Always return `"If an account exists for that email, we have sent instructions"` with an identical HTTP `200 OK` status code, regardless of whether the email is registered. Dispatch the email asynchronously via a background queue so SMTP latency does not leak account existence.
    *   **Registration**: If an email is already registered during sign-up, either use an email-first verification flow or return a generic verification message and send an email to the existing address alerting them that a registration attempt occurred.

### 6.3 Secure Account Recovery, Email Mutation & Offboarding
*   **Classification**: **`[MANDATORY]`**
*   **Dual-Channel Email Change Verification** **`[MANDATORY]`**:
    *   When a user requests an email change from `old@example.com` to `new@example.com`:
        1. Require step-up authentication (`sudo` mode).
        2. Send a verification link/code to `new@example.com` to prove ownership before updating the record.
        3. Simultaneously send a security alert to `old@example.com` containing an emergency rollback/lock link valid for $48\text{--}72\text{ hours}$.
*   **Password Reset Hygiene** **`[MANDATORY]`**:
    *   Upon completing a password reset:
        1. Invalidate the reset token immediately.
        2. Revoke **all** active sessions and refresh tokens across all devices (except optionally the current session if MFA was also verified).
        3. Do **not** bypass MFA during a password reset—if the user has MFA enabled, they must still satisfy MFA after resetting their password to gain an active session.
        4. Send a confirmation email notifying the user that their password was changed.

### 6.4 Immutable Security Audit Logging
*   **Classification**:
    *   Core backend security audit ledger: **`[MANDATORY]`**
    *   Customer-facing Enterprise Audit Log UI & SIEM streaming (Datadog/Splunk): **`[ACCORDING TO PS]`**
*   **Append-Only Audit Schema** **`[MANDATORY]`**:
    *   Record an immutable structured log entry for every authentication, authorization, and privilege mutation:
        *   `id` (UUIDv7)
        *   `timestamp` (UTC ISO-8601)
        *   `actor_id`, `actor_type` (`user`, `api_key`, `system`, `admin_impersonation`)
        *   `impersonator_id` (if a support admin is acting on behalf of a user)
        *   `workspace_id` (Tenant context)
        *   `event_type` (e.g., `auth.login.success`, `auth.login.failed`, `auth.mfa.enrolled`, `auth.password.changed`, `rbac.role.updated`, `apikey.created`, `session.revoked`)
        *   `target_type` & `target_id`
        *   `ip_address`, `user_agent`, `geo_country`
        *   `metadata` (JSONB diff with sensitive secrets/passwords strictly redacted)

---

## 7. Frontend UX, Design & Client-Side State Governance

A world-class authentication system must feel instantaneous, accessible, and cohesive with the application's visual identity.

### 7.1 Visual Theme, Layout & Onboarding Flow
*   **Classification**: **`[ACCORDING TO PS]`**
*   **Problem-Statement Driven Customizations** **`[ACCORDING TO PS]`**:
    *   **Visual Aesthetic & Theme**: Color palette, typography, dark/light mode defaults, split-screen marketing showcase vs. centered minimalist card, glassmorphism vs. brutalist/enterprise clean layout.
    *   **Onboarding & Profile Completion Steps**: Post-signup wizard steps (e.g., creating an initial workspace, selecting user persona/role, inviting teammates, configuring domain-specific preferences).
    *   **Auth Method Prominence**: Whether OAuth buttons, Passkey sign-in, or Enterprise SSO take primary visual hierarchy over standard email/password inputs.

### 7.2 Mandatory Frontend UX & Security Engineering Standards
*   **Classification**: **`[MANDATORY]`** *(These directly elevate the quality, accessibility, and security of any web application)*
*   **Zero-Flicker Route Protection (SSR / Edge Middleware)** **`[MANDATORY]`**:
    *   Verify session state at the Edge/Server layer prior to rendering protected pages so unauthenticated users never see a brief flash of protected UI layout before redirection.
    *   Preserve the intended destination URL via a validated relative `return_to` / `redirect` query parameter (strictly validated against **Open Redirect** attacks by allowing only relative paths starting with a single `/` and rejecting `//` or external origins).
*   **Cross-Tab Session Synchronization (`BroadcastChannel` API)** **`[MANDATORY]`**:
    *   Bind a browser `BroadcastChannel('auth_channel')` across all open tabs. When a user logs out, switches workspaces, or experiences session expiration in Tab A, immediately propagate the state change to Tabs B, C, and D so stale tabs immediately lock or transition to the login screen without leaving sensitive data exposed on screen.
*   **Password Manager & Accessibility Harmony** **`[MANDATORY]`**:
    *   Use semantic HTML `<form>` elements with proper `autocomplete` attributes:
        *   Identifier field: `autocomplete="username webauthn"`
        *   Login password: `autocomplete="current-password"`
        *   Registration / New password: `autocomplete="new-password"`
        *   TOTP / OTP input: `autocomplete="one-time-code"` with `inputmode="numeric"` and auto-advance/paste support across segmented $6\text{-digit}$ inputs.
    *   Include an accessible show/hide password toggle (`aria-label="Show password"`, `type="button"` so it doesn't accidentally submit the form) and live inline validation (`aria-live="polite"`).
*   **Silent Token Refresh & Request Queueing Interceptor** **`[MANDATORY]`**:
    *   In the frontend HTTP client, if an API call returns `401 Unauthorized` due to an expired short-lived Access Token:
        1. Acquire an in-memory mutex lock so multiple concurrent failing requests trigger **only one** `POST /auth/refresh` call.
        2. Queue concurrent in-flight requests until the refresh completes, then transparently replay them with the fresh session.
        3. If the refresh endpoint itself fails with `401`/`403`, clear client state and redirect cleanly to `/login?reason=session_expired`.

---

## 8. Reference Relational Database Schema Blueprint

This canonical schema supports multi-modal auth, MFA, session rotation with reuse detection, RBAC/ABAC workspaces, API keys, and audit logs.

```sql
-- 1. Core Users Table [MANDATORY]
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) NOT NULL UNIQUE,
    email_verified_at TIMESTAMPTZ,
    password_hash TEXT, -- Nullable for OAuth/Passwordless-only accounts
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    totp_secret_encrypted BYTEA, -- AES-256-GCM encrypted
    totp_last_used_timestep BIGINT,
    token_version INTEGER NOT NULL DEFAULT 1, -- Incremented for instant global revocation
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_deletion')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Federated OAuth / SSO Identities [MANDATORY when OAuth/SSO is used]
CREATE TABLE oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(64) NOT NULL, -- 'google', 'github', 'saml:okta', etc.
    provider_Account_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(320),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_account_id)
);

-- 3. WebAuthn Passkeys [MANDATORY for Passkey support]
CREATE TABLE passkey_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credential_id BYTEA NOT NULL UNIQUE,
    public_key BYTEA NOT NULL,
    sign_count BIGINT NOT NULL DEFAULT 0,
    transports TEXT[], -- ['internal', 'hybrid', 'usb', 'nfc', 'ble']
    backed_up BOOLEAN NOT NULL DEFAULT FALSE,
    device_name VARCHAR(128),
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Stateful Sessions & Rotating Refresh Tokens [MANDATORY]
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_family_id UUID NOT NULL,
    refresh_token_hash CHAR(64) NOT NULL UNIQUE, -- SHA-256 hex digest
    previous_refresh_token_hash CHAR(64), -- For reuse detection & concurrency grace window
    rotated_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    device_name VARCHAR(128),
    geo_location VARCHAR(128),
    sudo_verified_at TIMESTAMPTZ, -- Step-up authentication timestamp
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revocation_reason VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sessions_user_active ON sessions(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_sessions_token_family ON sessions(token_family_id);

-- 5. Multi-Tenant Workspaces & RBAC Memberships [ACCORDING TO PS]
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(128) NOT NULL UNIQUE,
    enforce_mfa BOOLEAN NOT NULL DEFAULT FALSE,
    sso_domain VARCHAR(255) UNIQUE,
    ip_allowlist CIDR[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspace_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(64) NOT NULL, -- Maps to permission scopes in policy engine
    custom_permissions TEXT[] DEFAULT '{}',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workspace_id, user_id)
);

-- 6. Scoped API Keys / PATs [ACCORDING TO PS]
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    key_prefix VARCHAR(16) NOT NULL, -- e.g., 'sk_live_ab12'
    key_hash CHAR(64) NOT NULL UNIQUE, -- SHA-256 hash
    scopes TEXT[] NOT NULL, -- e.g., ['projects:read', 'deployments:write']
    allowed_ips CIDR[],
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Immutable Security Audit Logs [MANDATORY]
CREATE TABLE security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_type VARCHAR(32) NOT NULL, -- 'user', 'api_key', 'system', 'admin_impersonation'
    event_type VARCHAR(128) NOT NULL,
    target_type VARCHAR(64),
    target_id VARCHAR(128),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_workspace_time ON security_audit_logs(workspace_id, created_at DESC);
CREATE INDEX idx_audit_logs_actor_time ON security_audit_logs(actor_user_id, created_at DESC);
```

---

## 9. Quick-Reference Classification Matrix for Antigravity Execution

When initializing or auditing a project, use this matrix to separate **non-negotiable baseline engineering (`[MANDATORY]`)** from **Problem Statement configurations (`[ACCORDING TO PS]`)**:

| Sub-System | Feature / Control | Classification | Agent Action Rule |
| :--- | :--- | :--- | :--- |
| **Passwords** | Argon2id hashing + HMAC pepper + NIST length validation + Breached password check | **`[MANDATORY]`** | Always implement whenever password auth is active. |
| **OAuth 2.1 / OIDC** | PKCE (`S256`), `state`/`nonce` validation, verified-email account linking guard | **`[MANDATORY]`** | Enforce strictly on all OAuth flows. |
| **OAuth Providers** | Which social providers to display (Google, GitHub, Apple, Discord, Microsoft) | **`[ACCORDING TO PS]`** | Configure based on target user persona in the PS. |
| **Magic Links** | CSPRNG token, SHA-256 DB storage, $\le 15\text{ min}$ TTL, `POST` confirmation against email scanners | **`[MANDATORY]`** | Mandatory security design if passwordless email is used. |
| **WebAuthn Passkeys** | FIDO2 support, Conditional UI autofill, `signCount` clone detection | **`[MANDATORY]`** | Implement as standard modern phishing-resistant auth. |
| **Enterprise SSO / SCIM** | SAML 2.0, OIDC Enterprise, Domain Capture, SCIM 2.0 automated deprovisioning | **`[ACCORDING TO PS]`** | Implement for B2B / Enterprise SaaS problem statements. |
| **MFA & Recovery** | TOTP (AES-256-GCM encrypted secret, replay step check) + Hashed single-use backup codes | **`[MANDATORY]`** | Always provide TOTP + backup codes for account protection. |
| **Step-Up Auth (`sudo`)** | Re-verification middleware for password/email/MFA/key mutations | **`[MANDATORY]`** | Enforce on all core security settings; extend to domain actions per PS. |
| **Session & Tokens** | Short-lived Access Token + Rotating Refresh Token with Reuse Detection & Family Revocation | **`[MANDATORY]`** | Non-negotiable token lifecycle architecture. |
| **Cookie Security** | `__Host-` prefix, `HttpOnly`, `Secure`, `SameSite=Strict/Lax`, Zero `localStorage` tokens | **`[MANDATORY]`** | Enforce on all session and refresh cookies. |
| **Session Ledger** | Active devices table, IP/UA tracking, "Sign out of all other devices", instant Redis revocation | **`[MANDATORY]`** | Always build into user account security settings. |
| **Access Control Engine** | Deny-by-default middleware, granular `resource:action` permissions, IDOR/BOLA tenant scoping | **`[MANDATORY]`** | Never hardcode role strings in controllers; always scope DB queries. |
| **Domain Roles & Hierarchy** | Specific roles (`Doctor`/`Patient`, `Owner`/`Editor`/`Auditor`), Multi-workspace vs Single-tenant | **`[ACCORDING TO PS]`** | Derive role matrix and tenant hierarchy directly from PS entities. |
| **Abuse & Enumeration** | Redis sliding-window rate limiting, constant-time login responses, generic reset responses | **`[MANDATORY]`** | Apply to all public authentication endpoints. |
| **Audit Logging** | Append-only backend security event log with IP, Actor, User-Agent, and redacted metadata | **`[MANDATORY]`** | Log all authN/authZ mutations from day one. |
| **Frontend UX Polish** | SSR/Edge zero-flicker guards, `BroadcastChannel` multi-tab sync, `autocomplete` attributes | **`[MANDATORY]`** | Implement across all frontend auth views and HTTP clients. |
| **Auth Theme & Branding** | Color scheme, typography, split-screen vs card layout, custom onboarding steps | **`[ACCORDING TO PS]`** | Match visual design and onboarding questions to the PS theme. |