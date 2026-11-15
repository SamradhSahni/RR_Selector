# Core User Workspace, Onboarding & Notifications — Master Architectural Blueprint

> **Purpose of this Document (For Antigravity Agent):**
> This document serves as the single source of truth for architecting, designing, and implementing the **Core User Workspace, Progressive Onboarding, Team/API Settings, and Multi-Channel Notification Engine**. 
>
> **Classification Legend:**
> - **`[MANDATORY]`**: Non-negotiable engineering, UX, security, accessibility, or performance standards required for a production-grade, highly professional web application. Anything that elevates reliability, user experience, polish, or developer ergonomics is strictly classified as **`[MANDATORY]`**.
> - **`[ACCORDING TO PS]`**: Domain-specific logic, branding, visual themes, custom AI agent templates, specific role definitions, or business rules that must adapt dynamically to the target Problem Statement (PS).

---

## 1. Global Design System, UX Polish & Cross-Cutting Standards

Before implementing individual modules, the workspace must adhere to foundational UI/UX and architectural standards.

### 1.1 Theme, Branding & Visual Identity
- **Design Token Architecture** `[MANDATORY]`: Implement CSS variables / Tailwind semantic tokens (`--bg-surface`, `--text-primary`, `--border-subtle`, `--accent-primary`) so the entire UI adapts cleanly without hardcoded hex values.
- **Color Palette, Typography & Brand Vibe** `[ACCORDING TO PS]`: The specific primary/secondary colors, font families (e.g., Inter vs. Space Grotesk vs. JetBrains Mono), border radii, and aesthetic tone (e.g., Neo-brutalist, Enterprise Minimalist, Cyberpunk, Healthcare Clean) must be derived from the Problem Statement.
- **Dark / Light / System Mode Parity** `[MANDATORY]`: Full support for theme switching with zero Flash of Unstyled Content (FOUC) and proper contrast ratios across all workspace panels and code editors.

### 1.2 Global Workspace Navigation & Ergonomics
- **Command Palette (`Cmd+K` / `Ctrl+K`)** `[MANDATORY]`: Global keyboard-first navigation allowing users to switch workspaces, trigger AI agents, search artifacts, jump to settings, or toggle themes instantly.
- **Responsive Shell & Collapsible Sidebar** `[MANDATORY]`: Persistent left navigation rail with smooth collapse/expand transitions, tooltips when collapsed, breadcrumb header, and mobile drawer fallback.
- **Skeleton Loaders & Optimistic UI** `[MANDATORY]`: Never show raw layout shifts or blocking full-page spinners for routine actions. Use shimmer skeletons matching exact component geometry and optimistic state updates with automatic rollback on failure.
- **Accessibility (WCAG 2.1 AA)** `[MANDATORY]`: Full keyboard navigability (`Tab`, `Escape`, arrow keys), ARIA live regions for streaming AI responses and toast alerts, and focus trapping inside modals/drawers.

---

## 2. Progressive User Onboarding & Activation Engine

The onboarding flow bridges initial authentication and the user's "Aha!" moment inside the AI Studio without causing cognitive overload.

### 2.1 Onboarding State Machine & Persistence
- **Server-Backed Progress Persistence** `[MANDATORY]`: Store `onboardingStep` and `onboardingCompletedAt` in the database. If a user refreshes the browser or switches devices mid-flow, they must resume at the exact step they left off.
- **Invited User Fast-Track Bypass** `[MANDATORY]`: Users joining via a team invitation link must bypass the "Create Organization/Workspace" step and only complete personal profile setup before landing directly in the shared workspace.
- **Route Guarding & Redirect Middleware** `[MANDATORY]`: Un-onboarded users attempting to hit `/workspace/*` routes are cleanly intercepted and routed to `/onboarding`, while completed users visiting `/onboarding` are redirected back to their active workspace.

### 2.2 Multi-Step Welcome Flow Breakdown
1. **Step 1: Identity & Profile Enrichment** `[MANDATORY]`
   - Capture full name, avatar upload (with client-side cropping/compression) or generated initials avatar, and preferred UI theme.
2. **Step 2: User Role & Persona Profiling** `[ACCORDING TO PS]`
   - Interactive card selection capturing the user's role (e.g., *Software Engineer, Data Scientist, Product Manager, Legal Analyst, Researcher*—tailored to the PS domain) and experience level.
   - Used to dynamically customize default UI density, prompt suggestions, and terminology.
3. **Step 3: Workspace Setup & Goals** `[MANDATORY]` (Structure) / `[ACCORDING TO PS]` (Goal Options)
   - Provision the user's default Multi-Tenant Organization/Workspace (Name, URL slug with real-time availability check, and team size).
   - Multi-select chips for **Workspace Goals** (e.g., *Automate workflows, Generate UI components, Analyze documents, Monitor compliance*—defined by the PS).
4. **Step 4: Starter AI Agent & Template Selection** `[ACCORDING TO PS]`
   - Present 3–6 curated **Starter AI Agent Templates** filtered by the user's selected role and goals in Steps 2–3.
   - Each template card displays: Agent Name, System Prompt summary, pre-configured tools/capabilities, and a "Preview Sample Output" tooltip.
   - Selecting a template pre-populates the user's first AI Studio session so they never land on a cold, blank screen.
5. **Step 5: Optional Quick Team Invite** `[MANDATORY]`
   - Allow entering teammate emails (or copying an invite link) with a prominent **"Skip for now"** button to prevent friction.

### 2.3 Post-Onboarding Activation ("Zero-to-One" Experience)
- **Pre-Seeded First Session** `[MANDATORY]`: Upon completing the wizard, immediately route the user into the AI Studio with their chosen Starter Agent loaded and an interactive sample prompt ready to run with one click.
- **Dismissible Activation Checklist Widget** `[MANDATORY]`: A compact progress widget in the bottom corner of the sidebar (e.g., *1. Complete Profile ✅, 2. Run First AI Prompt ⬜, 3. Edit an Artifact ⬜, 4. Invite a Teammate ⬜*) with a progress bar to drive feature discovery.

---

## 3. AI Studio & Artifact Workspace (Core Execution Environment)

The centerpiece of the platform: a high-performance, split-pane collaborative environment combining conversational AI with live, interactive output rendering.

### 3.1 Split-Pane Layout Architecture
- **Resizable Multi-Pane Grid** `[MANDATORY]`:
  - **Left Rail**: Collapsible navigation, session history, saved artifacts, and workspace switcher.
  - **Center Pane (Chat / Prompt Stream)**: Conversational interface, context attachments, and agent controls.
  - **Right Pane (Artifact / Canvas Workbench)**: Dynamically opens when an artifact is generated or selected; supports drag-handle resizing (with min/max width constraints), full-screen Zen Mode toggle, and persistent width state in `localStorage`.
- **Responsive Viewport Adaptation** `[MANDATORY]`: On tablet/mobile viewports, smoothly transition the split-pane into a tabbed or slide-over sheet interface so the Artifact preview remains usable.

### 3.2 Real-Time Streaming Chat Engine
- **Low-Latency Token Streaming (SSE / WebSockets)** `[MANDATORY]`: Stream AI responses via Server-Sent Events (SSE) or WebSockets with smooth token buffering (~30–60fps rendering) to prevent React/DOM thrashing during high-speed generation.
- **Rich Message Rendering Pipeline** `[MANDATORY]`:
  - Full GitHub Flavored Markdown (GFM), tables, task lists, and syntax-highlighted code blocks (with copy button, line numbers, and language badge).
  - Mathematical notation rendering via LaTeX ($inline$ and $$display$$ blocks).
  - Collapsible **"Thinking / Reasoning"** accordions showing intermediate agent steps, tool calls, and execution latency.
- **Smart Scroll Physics** `[MANDATORY]`: Auto-scroll to bottom during streaming *only* if the user is already near the bottom. If the user scrolls up to read earlier content, immediately disengage auto-scroll and display a floating **"Jump to bottom ↓"** pill.
- **Conversation Lifecycle Controls** `[MANDATORY]`:
  - **Stop Generation**: Immediately abort the in-flight HTTP/SSE stream (`AbortController`) and persist partial output cleanly.
  - **Edit & Branch / Regenerate**: Edit any previous user message or regenerate an AI response, creating a non-destructive conversation branch (`< 1 / 2 >` navigator) rather than overwriting history.
  - **Prompt Library & Slash Commands (`/`)**: Typing `/` in the composer opens a floating menu to insert saved prompts, invoke specific domain agents (`@agent`), or reference workspace files (`#file`).
- **Domain-Specific Agent Tools & Model Selector** `[ACCORDING TO PS]`: The specific LLM models offered, custom parameters (temperature, reasoning effort), and domain tools (e.g., SQL runner, web scraper, medical coding lookup, CAD viewer) depend on the Problem Statement.

### 3.3 Artifact & Live Canvas System
- **Structured Artifact Detection & Extraction** `[MANDATORY]`: Parse streaming responses in real time to detect artifact blocks (e.g., HTML/CSS/JS apps, React components, Mermaid diagrams, Markdown documents, SVG graphics, JSON schemas, data charts) and pipe them directly into the Right Pane Canvas while showing a compact interactive card in the chat stream.
- **Dual-Mode Workbench (`Preview` vs. `Code/Source`)** `[MANDATORY]`:
  - **Live Preview Tab**: Renders the artifact in a secure, isolated sandbox (`iframe` with strict CSP and `sandbox` attributes) supporting live interactivity, viewport responsiveness toggles (Desktop / Tablet / Mobile preview widths), and zoom/pan controls.
  - **Code / Editor Tab**: Embedded Monaco or CodeMirror editor with syntax highlighting, in-place manual editing by the user, formatting, and real-time hot-reloading of the preview.
  - **Console / Diagnostics Drawer**: Captures runtime errors inside the preview sandbox and offers a one-click **"Fix with AI"** button that sends the stack trace back to the agent.
- **Domain-Specific Artifact Renderers** `[ACCORDING TO PS]`: Specialized viewers required by the problem statement (e.g., Kanban boards, financial spreadsheets, geospatial maps, circuit diagrams, PDF annotation canvases).

### 3.4 Artifact Version History & Time Travel
- **Immutable Version Snapshots** `[MANDATORY]`: Every AI update or manual user save creates an immutable version node ($v_1, v_2, \dots, v_n$) linked to the triggering prompt or edit action, complete with timestamp and author metadata.
- **Side-by-Side & Inline Diff Viewer** `[MANDATORY]`: Allow users to toggle a Diff View comparing any version $v_i$ against $v_j$ (highlighting additions in green and deletions in red).
- **One-Click Restore & Forking** `[MANDATORY]`: Users can revert an earlier version to become the active head (`v_n+1`) or fork an artifact into a new workspace session.
- **Export & Share Capabilities** `[MANDATORY]`: Download single files, export multi-file artifacts as a `.zip` bundle, copy raw content, or generate a read-only public/workspace share link (if permitted by workspace policy).

### 3.5 Multi-File Drag-and-Drop & Context Ingestion
- **Global Dropzone Overlay** `[MANDATORY]`: Dragging files anywhere over the AI Studio triggers a visual drop-target overlay with clear instructions. Also supports direct clipboard paste (`Cmd+V`) for screenshots and code snippets.
- **Pre-Upload Validation & Queue Management** `[MANDATORY]`:
  - Validate file size limits, file counts, and MIME types client-side before initiating network transfers.
  - Display individual file progress bars, upload cancellation buttons, and retry actions for failed uploads.
- **Direct-to-Storage Presigned Uploads** `[MANDATORY]`: Use S3/R2/GCS presigned URLs (or chunked multipart uploads for large files) so binary payloads bypass the application server bottleneck.
- **Context Processing & Token Accounting** `[MANDATORY]`: Show visual status badges on uploaded files (*Uploading → Extracting Text / OCR → Indexed*) alongside an estimated context window usage indicator.
- **Allowed File Formats & Parsing Pipelines** `[ACCORDING TO PS]`: While standard text, code, images (`.png`, `.jpg`, `.webp`), and `.pdf`/`.csv` should be supported by default, specialized parsers (e.g., `.dicom`, `.pcap`, `.parquet`, `.dwg`, audio/video transcription) depend on the Problem Statement.

---

## 4. Workspace, Team & API Settings (Multi-Tenant Control Plane)

A comprehensive self-serve administration suite designed for both solo builders and multi-tenant organizations.

### 4.1 Multi-Tenant Organization Architecture & Switching
- **Strict Tenant Isolation** `[MANDATORY]`: Every database query for workspaces, sessions, artifacts, and API keys must be scoped by `workspaceId`. Enforce tenant validation in backend middleware—never trust a client-supplied `workspaceId` without verifying membership.
- **Instant Organization Switcher** `[MANDATORY]`: Dropdown in the top-left sidebar displaying the active workspace logo, name, plan/role badge, a list of other workspaces the user belongs to, and a **"+ Create New Workspace"** action.
- **Seamless Context Switching** `[MANDATORY]`: Switching workspaces updates active state, clears tenant-specific client caches, and routes smoothly without requiring re-authentication.
- **Workspace General & Danger Zone Settings** `[MANDATORY]`: Edit workspace name, slug, and logo; view usage quotas; and provide a guarded **"Delete Workspace"** or **"Leave Workspace"** action requiring typed confirmation (e.g., typing the workspace slug).

### 4.2 Self-Serve User Profile & Account Security
- **Personal Profile Editor** `[MANDATORY]`: Update display name, profile photo, job title, timezone, and preferred language.
- **Authentication & Security Controls** `[MANDATORY]`:
  - Email address change with verification token sent to the new address.
  - Password update (if using credentials) and connected OAuth provider management (Google, GitHub, etc.).
  - Active Device Sessions list (showing IP, browser/OS, last active timestamp, and **"Revoke Session"** buttons).

### 4.3 Team Member Invitations & Lifecycle Management
- **Member Directory Table** `[MANDATORY]`: Searchable, filterable table showing all workspace members, their avatar/name/email, assigned role, 2FA status, join date, and actions menu.
- **Invitation Pipeline** `[MANDATORY]`:
  - Invite via single email or bulk comma-separated emails with an assigned initial role.
  - Generate cryptographically signed, single-use invitation tokens with configurable expiration (e.g., $t_{\text{exp}} = 7\text{ days}$).
  - Dedicated **"Pending Invitations"** tab allowing admins to **Resend Invite** (with rate-limiting), **Copy Invite Link**, or **Revoke Invite**.
- **Domain Auto-Join / SSO Enforcement** `[ACCORDING TO PS]`: Optional enterprise capabilities such as allowing anyone with `@company.com` to join automatically or enforcing SAML SSO if specified by the PS.

### 4.4 Role-Based Access Control (RBAC)
- **Standard Role Hierarchy** `[MANDATORY]`:
  - **Owner**: Full control, billing, workspace deletion, ownership transfer.
  - **Admin**: Manage workspace settings, invite/remove members, manage roles, manage workspace-level API keys and webhooks.
  - **Member (Editor)**: Create/edit sessions and artifacts, manage personal API keys.
  - **Viewer (Guest)**: Read-only access to shared sessions and artifacts; cannot invoke paid AI actions or modify settings.
- **Custom Domain Roles & Granular Scopes** `[ACCORDING TO PS]`: If the Problem Statement involves specialized compliance or workflows (e.g., *Auditor, Approver, Clinician, Billing Manager*), extend the permission matrix accordingly.
- **Dual-Layer Enforcement** `[MANDATORY]`: Hide or disable unauthorized UI controls on the frontend (with explanatory tooltips like *"Ask a Workspace Admin for permission"*) **and** strictly enforce permissions via backend RBAC middleware on every API route.

### 4.5 Personal & Workspace API Key Management
- **Secure Key Generation & Prefixing** `[MANDATORY]`:
  - Generate high-entropy cryptographic keys with identifiable prefixes (e.g., `pk_live_...` or `sk_proj_...`) to aid secret scanning.
  - **Show-Once Secret Modal**: Display the raw API key *only once* upon creation with a one-click copy button and a warning banner.
  - **Zero Plaintext Storage**: Store only the `keyPrefix` (first 8 chars), `keyHint` (last 4 chars), and a `SHA-256` / `Argon2` hash of the key in the database.
- **Granular Key Metadata & Controls** `[MANDATORY]`:
  - Name/label, scope permissions (e.g., `read:artifacts`, `write:chat`, `admin:webhooks`), and optional expiration date ($30\text{d}, 90\text{d}, 1\text{yr}, \text{Never}$).
  - Track and display `lastUsedAt` timestamp, originating IP, and total request count per key.
  - Instant **Roll / Rotate Key** (with optional grace window) and **Revoke Key** actions.

---

## 5. Multi-Channel Notification Engine

A resilient, event-driven communication infrastructure keeping users informed across in-app interfaces, email, and external team chat platforms without causing alert fatigue.

### 5.1 Event-Driven Notification Dispatcher Architecture
- **Unified Event Producer (`notify()`)** `[MANDATORY]`: Application services emit strongly typed domain events (e.g., `team.invite.sent`, `artifact.export.completed`, `api_key.compromised`, `agent.run.failed`) to a central notification service rather than calling email/webhook SDKs directly.
- **Asynchronous Queue & Retry With Exponential Backoff** `[MANDATORY]`: Process outbound deliveries (Email, Slack, Discord, Webhooks) asynchronously via background workers. On transient failures, retry using exponential backoff with jitter:
  $$t_{\text{retry}} = \min\left(t_{\text{max}}, \, t_{\text{base}} \times 2^{\text{attempt}} + \text{random}(0, \text{jitter})\right)$$
- **Idempotency Guarantees** `[MANDATORY]`: Attach a deterministic `idempotencyKey` to every notification event to guarantee a user never receives duplicate emails or webhook fires during queue retries.
- **Domain-Specific Trigger Events** `[ACCORDING TO PS]`: While system events (invites, security alerts, quota warnings) are universal, custom business triggers (e.g., * anomaly detected, report ready, approval requested*) are defined according to the PS.

### 5.2 Real-Time In-App Toasts & Persistent Notification Inbox
- **Real-Time Push Delivery** `[MANDATORY]`: Push live notification payloads to connected clients via WebSockets or SSE so the unread badge counter increments and toast alerts appear instantaneously without page reloads.
- **Non-Intrusive Toast System** `[MANDATORY]`:
  - Stackable, auto-dismissing toast alerts (Info, Success, Warning, Error) with pause-on-hover, swipe-to-dismiss, and direct action buttons (e.g., **"View Artifact"**, **"Undo"**).
- **Persistent Notification Inbox Popover / Drawer** `[MANDATORY]`:
  - Accessible via the top header bell icon with an animated unread count badge.
  - Categorized tabs: **All**, **Unread**, **Mentions / Team**, and **System / Alerts**.
  - Interactive item controls: Click to navigate to the target resource, toggle individual Read/Unread status, **Archive / Dismiss**, and a bulk **"Mark all as read"** action.
  - Cursor-based infinite scrolling for historical notifications.

### 5.3 Transactional Email Pipeline (Resend / AWS SES)
- **Provider Abstraction Layer** `[MANDATORY]`: Implement an adapter interface (`EmailProvider`) supporting **Resend** or **AWS SES** interchangeably via environment configuration, with a local console/Mailpit fallback for development.
- **Responsive HTML + Plaintext Templates** `[MANDATORY]`:
  - Build clean, dark-mode-compatible transactional templates (using React Email or MJML) for: *Welcome / Verify Email, Team Invitation, Password Reset, Security Alert (New API Key / Login), and Long-Running Task Completion*.
  - Always include a plaintext fallback and proper `List-Unsubscribe` headers for non-security emails.
- **Deliverability & Bounce Handling** `[MANDATORY]`: Configure webhook listeners for provider bounce/complaint events to automatically suppress invalid email addresses and protect sender reputation.

### 5.4 Outbound Slack, Discord & Custom Webhooks
- **First-Class Slack & Discord Connectors** `[MANDATORY]`:
  - Allow workspace admins to configure Slack Incoming Webhook URLs (or OAuth Bot integration) and Discord Webhook URLs.
  - Format outbound payloads using native **Slack Block Kit** and **Discord Rich Embeds** (color-coded by severity, including deep links back to the workspace resource, actor info, and timestamps).
- **Generic Signed Outbound Webhooks** `[MANDATORY]`:
  - Allow users to register custom HTTPS endpoints subscribed to specific event types (e.g., `artifact.created`, `session.completed`).
  - **Cryptographic Payload Signing**: Sign every outbound webhook request with an `X-Signature-SHA256` header computed via $\text{HMAC-SHA256}(\text{secret}, \text{timestamp} + "." + \text{payload})$ so receivers can verify authenticity.
- **Webhook Delivery Logs & Circuit Breaker** `[MANDATORY]`:
  - Provide a UI log table showing recent webhook deliveries (HTTP status code, latency in $\text{ms}$, request/response body inspector, and a **"Resend Payload"** button for debugging).
  - **Test Ping Button**: Allow admins to send a synthetic `webhook.test` event immediately after saving a URL.
  - **Auto-Disable Circuit Breaker**: If an endpoint returns $4\text{xx}/5\text{xx}$ consecutively across $N$ attempts over $24\text{ hours}$, automatically disable the webhook and notify the workspace admin via email/in-app alert.

### 5.5 Granular User Notification Preferences Matrix
- **Channel $\times$ Category Matrix UI** `[MANDATORY]`: A dedicated settings view where users can independently toggle notifications across channels (**In-App**, **Email**, **Slack/Discord**) per event category:
  - *Account & Security* (Mandatory critical alerts locked to ON for email/in-app).
  - *Team & Workspace Activity* (Invites, role changes, mentions).
  - *AI Agent & Artifact Completions* (Long-running background tasks).
  - *Usage & Quota Warnings*.

---

## 6. Reference Data Models & Schema Blueprint

Antigravity should use the following relational/document blueprint as the baseline schema foundation, extending it with domain-specific tables `[ACCORDING TO PS]`.

```typescript
// 1. Users & Onboarding State [MANDATORY]
interface User {
  id: string; // UUID / CUID
  email: string;
  name: string;
  avatarUrl?: string;
  onboardingStep: 'PROFILE' | 'PERSONA' | 'WORKSPACE' | 'TEMPLATE' | 'COMPLETED';
  onboardingCompletedAt?: Date;
  personaRole?: string; // [ACCORDING TO PS]
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notificationMatrix: Record<string, { inApp: boolean; email: boolean; webhook: boolean }>;
  };
  createdAt: Date;
}

// 2. Multi-Tenant Workspaces & RBAC [MANDATORY]
interface Workspace {
  id: string;
  name: string;
  slug: string; // Unique URL identifier
  logoUrl?: string;
  goals: string[]; // Captured during onboarding [ACCORDING TO PS]
  createdAt: Date;
}

interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'; // Extensible [ACCORDING TO PS]
  joinedAt: Date;
}

interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  tokenHash: string;
  invitedByUserId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  expiresAt: Date;
}

// 3. AI Studio, Sessions, Artifacts & Versioning [MANDATORY]
interface StudioSession {
  id: string;
  workspaceId: string;
  createdByUserId: string;
  title: string;
  agentTemplateId?: string; // [ACCORDING TO PS]
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  parentMessageId?: string; // Supports conversation branching
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  attachments: FileAttachment[];
  artifactVersionIds: string[];
  createdAt: Date;
}

interface Artifact {
  id: string;
  workspaceId: string;
  sessionId: string;
  title: string;
  type: 'code' | 'react' | 'html' | 'markdown' | 'mermaid' | 'custom_ps_type';
  currentVersionId: string;
  createdAt: Date;
}

interface ArtifactVersion {
  id: string;
  artifactId: string;
  versionNumber: number;
  content: string; // Or multi-file tree JSON
  changeSummary: string;
  createdByMessageId?: string;
  createdByUserId?: string;
  createdAt: Date;
}

// 4. API Keys [MANDATORY]
interface ApiKey {
  id: string;
  workspaceId: string;
  createdByUserId: string;
  name: string;
  keyPrefix: string; // e.g., "sk_live_9f8a"
  keyHash: string;   // SHA-256 hash of full key
  scopes: string[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  createdAt: Date;
}

// 5. Multi-Channel Notifications & Webhooks [MANDATORY]
interface Notification {
  id: string;
  workspaceId: string;
  recipientUserId: string;
  type: string; // e.g., 'TEAM_INVITE', 'ARTIFACT_READY', 'SECURITY_ALERT'
  title: string;
  body: string;
  actionUrl?: string;
  readAt?: Date;
  archivedAt?: Date;
  createdAt: Date;
}

interface WebhookEndpoint {
  id: string;
  workspaceId: string;
  provider: 'SLACK' | 'DISCORD' | 'CUSTOM';
  url: string;
  signingSecret: string;
  subscribedEvents: string[];
  isActive: boolean;
  failureCount: number;
  lastTriggeredAt?: Date;
}
```

---

## 7. Antigravity Implementation Checklist & Verification Matrix

Use this checklist during development to verify that both **`[MANDATORY]`** platform foundations and **`[ACCORDING TO PS]`** domain requirements are completely satisfied:

| Module | Feature / Requirement | Classification | Verification Criteria |
| :--- | :--- | :--- | :--- |
| **Onboarding** | Multi-step state persistence & route guards | `[MANDATORY]` | Refreshing at Step 3 keeps user at Step 3; completed users skip `/onboarding`. |
| **Onboarding** | Invited member fast-track flow | `[MANDATORY]` | Clicking an invite link skips workspace creation and binds user to target tenant. |
| **Onboarding** | Role profiling & Starter Agent templates | `[ACCORDING TO PS]` | Templates dynamically match the domain personas and goals of the Problem Statement. |
| **AI Studio** | Resizable split-pane & Zen mode | `[MANDATORY]` | Drag handle smoothly resizes Chat vs. Canvas; layout width persists across reloads. |
| **AI Studio** | Streaming SSE/WS chat with stop & branch | `[MANDATORY]` | Tokens stream smoothly; user can abort generation mid-stream or branch edits. |
| **AI Studio** | Live sandboxed preview + Code Diff viewer | `[MANDATORY]` | Artifacts render safely in an iframe; users can toggle code view and inspect version diffs. |
| **AI Studio** | Multi-file drag-and-drop with progress | `[MANDATORY]` | Dropping multiple files validates MIME/size, shows progress bars, and attaches context. |
| **Workspace** | Multi-tenant switcher & strict isolation | `[MANDATORY]` | Switching orgs updates context immediately; zero cross-tenant data leakage in API routes. |
| **Workspace** | Self-serve Profile, Invite flow & RBAC | `[MANDATORY]` | Admins can invite/revoke; Viewers are blocked from destructive actions in UI & API. |
| **Workspace** | Hashed, show-once API Key lifecycle | `[MANDATORY]` | Raw key shown only once; stored as SHA-256 hash; supports scopes and instant revocation. |
| **Notifications** | Real-time Toasts + Persistent Inbox Drawer | `[MANDATORY]` | Events trigger live toast + badge increment; inbox supports filter, read, and bulk actions. |
| **Notifications** | Transactional Email (Resend / AWS SES) | `[MANDATORY]` | HTML + plaintext emails dispatched asynchronously with idempotency and retry backoff. |
| **Notifications** | Outbound Slack / Discord & Signed Webhooks | `[MANDATORY]` | Rich Slack/Discord blocks; HMAC-SHA256 signatures on custom webhooks; "Test Ping" works. |
| **Global UX** | Theme system, `Cmd+K` palette & skeletons | `[MANDATORY]` | Visual palette matches PS (`[ACCORDING TO PS]`); dark/light parity and keyboard nav work globally. |