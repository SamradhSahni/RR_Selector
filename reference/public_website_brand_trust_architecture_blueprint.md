# Public Website Pages, Brand & Trust Architecture
**System Specification & Knowledge Base for AI Engineering Agents (Antigravity)**

---

## 0. Agent Directives & Classification Governance

This document serves as the authoritative architectural source of truth for building the **Public Website, Brand & Trust Architecture**. Every subsystem, design pattern, and technical requirement in this specification is strictly categorized into one of two execution classes. **There are no "optional" quality features**—anything that elevates performance, trust, conversion, accessibility, or user experience is strictly mandatory.

### Classification Legend
*   **`[MANDATORY]`**: Non-negotiable architectural, engineering, UX, performance, SEO, security, or polish requirement. Every professional production web platform must implement these features regardless of the domain. Anything that improves web quality, speed, accessibility, visual polish, or conversion falls strictly under `[MANDATORY]`.
*   **`[ACCORDING TO PS]`**: Elements whose specific theme, domain copy, visual metaphors, 3D models, pricing metrics, compliance jurisdictions, or interactive sandbox logic are dictated by the specific **Problem Statement (PS)**. The *infrastructure* to support them is `[MANDATORY]`, while the *configuration, aesthetic direction, and domain logic* must adapt dynamically to the PS.

---

## 1. Design System, Theme & Visual Identity Engine

Before constructing individual pages, the public website must establish a cohesive, high-craft design system that communicates immediate engineering authority.

### 1.1 Aesthetic Direction & Theme Tokens
*   **Color Palette & Semantic Tokens** `[ACCORDING TO PS]` (Palette Choice) / `[MANDATORY]` (Token Architecture):
    *   The primary brand hue, accent gradients, and surface warmth/coolness must align with the industry domain of the Problem Statement (e.g., deep obsidian and electric cyan for developer/AI infrastructure; clean alabaster, emerald, and slate for fintech/healthcare; warm editorial neutrals for creative tools).
    *   **Implementation `[MANDATORY]`**: Define CSS custom properties (`--bg-primary`, `--surface-elevated`, `--border-subtle`, `--text-primary`, `--text-muted`, `--accent-primary`, `--status-operational`, `--status-degraded`, `--status-outage`) using `oklch()` color spaces for perceptual uniformity.
*   **Theme Polarity (Dark / Light / System Mode)** `[ACCORDING TO PS]` (Default Mode) / `[MANDATORY]` (Zero-Flash Persistence):
    *   Default theme polarity depends on the PS target persona (e.g., Dark-first for AI/DevTools/Cybersecurity; Light-first or Adaptive for Enterprise SaaS/GovTech/Healthcare).
    *   **Implementation `[MANDATORY]`**: Prevent Flash of Unstyled Content (FOUC) via an inline blocking `<script>` in `<head>` that reads `localStorage` and `prefers-color-scheme` prior to first paint.
*   **Typography Scale & Variable Fonts** `[ACCORDING TO PS]` (Font Pairing) / `[MANDATORY]` (Fluid Scale & Loading):
    *   Font families must match the PS brand voice (e.g., Geometric Sans + Monospace for technical platforms; Editorial Serif + Neo-Grotesque for research/legal platforms).
    *   **Implementation `[MANDATORY]`**: Use fluid `clamp()` typography tokens, `font-display: swap`, preloaded WOFF2 subsets, and tabular numerals (`font-variant-numeric: tabular-nums`) on all pricing calculators, metrics, latency counters, and tables.

### 1.2 Spatial Architecture, Micro-Interactions & Motion Physics
*   **Bento Grid & Architectural Borders** `[MANDATORY]`:
    *   Use structured hairline grid borders (`1px solid`), radial cursor-tracking spotlight borders on interactive cards, and multi-layered glassmorphism (`backdrop-filter: blur(16px)`) with subtle noise overlays to prevent gradient banding.
*   **Motion Choreography & Reduced Motion** `[MANDATORY]`:
    *   All UI transitions must follow spring physics or custom cubic-bezier curves (`cubic-bezier(0.22, 1, 0.36, 1)`).
    *   **Accessibility Fallback `[MANDATORY]`**: Strictly respect `@media (prefers-reduced-motion: reduce)` by disabling scroll-jacking, 3D camera sweeps, and parallax while preserving instant opacity crossfades.

---

## 2. 3D Landing Page & Interactive Conversion Architecture

The landing page is the primary conversion and technical credibility engine. It blends spatial WebGL storytelling with immediate product validation.

### 2.1 Smooth Scroll & 3D Camera Choreography Pipeline
*   **Lenis Smooth Scroll Integration** `[MANDATORY]`:
    *   Initialize Lenis for normalized inertial scrolling across trackpads, mice, and touch devices.
    *   Synchronize Lenis scroll ticks directly with GSAP's `ScrollTrigger` ticker (`gsap.ticker.add((time) => lenis.raf(time * 1000))`) and the Three.js / React Three Fiber (`useFrame`) render loop to eliminate jitter.
*   **GSAP ScrollTrigger + 3D Camera Rig** `[MANDATORY]`:
    *   Construct a multi-waypoint 3D camera rig using Catmull-Rom splines or keyframed GSAP timelines bound to DOM scroll sections (`scrub: 1`).
    *   Synchronize DOM typography reveals, HUD callouts, and shader uniforms with the 3D camera's position and look-at target.
*   **3D Scene Assets, Shaders & Visual Metaphor** `[ACCORDING TO PS]`:
    *   The specific 3D geometry, particle systems, custom GLSL vertex/fragment shaders, or post-processing effects must visually represent the Problem Statement's core domain (e.g., neural node graphs for AI orchestration, cryptographic lattices for security, geospatial globes for logistics, molecular meshes for biotech).
*   **WebGL Performance Budget & Graceful Fallback** `[MANDATORY]`:
    *   **Frame Budget**: Maintain a strict frame time of $\le 16.67\text{ ms}$ ($60\text{ FPS}$) on mid-range hardware.
    *   **Asset Optimization**: Enforce Draco/Meshopt compression for `.glb`/`.gltf` models, KTX2/Basis Universal textures, and instanced mesh rendering (`THREE.InstancedMesh`) for repeated geometry.
    *   **Dynamic DPR & Intersection Pausing**: Automatically scale device pixel ratio (`dpr={[1, 2]}`) based on GPU frame rate drops, and pause the WebGL render loop via `IntersectionObserver` when the canvas is scrolled out of the viewport.
    *   **Low-Power / WebGL Context Loss Fallback**: Detect `webglcontextlost`, low-tier GPUs (`detect-gpu`), or battery-saver modes and seamlessly fall back to a high-resolution pre-rendered interactive SVG/video canvas without breaking page layout.

### 2.2 Above-the-Fold Hero & Value Proposition Architecture
*   **Announcement Pill / Release Banner** `[MANDATORY]` (Component) / `[ACCORDING TO PS]` (Message):
    *   Interactive top badge linking to the latest major release, research paper, or hackathon milestone.
*   **High-Impact Headline, Sub-copy & Dual CTA Hierarchy** `[MANDATORY]` (Structure) / `[ACCORDING TO PS]` (Copy & Destination):
    *   Primary CTA (high-contrast fill, keyboard shortcut hint, instant action such as "Launch Studio" or "Start Free") paired with a Secondary CTA ("Read Documentation", "Explore Architecture", or interactive command copy `npx ...` if developer-focused `[ACCORDING TO PS]`).
*   **Instant Telemetry / Trust Bar** `[MANDATORY]` (Component) / `[ACCORDING TO PS]` (Metrics):
    *   Live or benchmarked proof indicators right below the fold (e.g., p99 latency, throughput, accuracy benchmark, compliance badges).

### 2.3 Live Interactive AI Sandbox (Zero-Auth Trial)
*   **In-Browser Interactive Sandbox Container** `[MANDATORY]`:
    *   Users must be able to experience the core product capability directly on the landing page without creating an account.
    *   **Sandbox Features `[MANDATORY]`**:
        *   Pre-populated, one-click **Sample Presets / Prompt Chips** so evaluators don't face a blank input state.
        *   Real-time streaming output, visual state transitions, execution timer (in $\text{ms}$), token/cost telemetry badge, and a "Reset / Inspect Raw JSON" toggle.
        *   **Rate-Limiting & Edge Protection `[MANDATORY]`**: Protect the public sandbox via fingerprinting, IP sliding-window rate limits, or cached deterministic replay streams for preset inputs, escalating to "Sign up to unlock custom runs" after $N$ interactions.
*   **Sandbox Domain Modality** `[ACCORDING TO PS]`:
    *   The input/output modality must match the PS (e.g., text prompt $\rightarrow$ multi-agent execution graph; code snippet $\rightarrow$ vulnerability AST patch; audio/document upload $\rightarrow$ structured extraction; slider parameters $\rightarrow$ predictive simulation).

### 2.4 Feature Deep-Dive: Interactive Bento Grid & Workflow Choreography
*   **Interactive Feature Bento Cards** `[MANDATORY]` (Architecture) / `[ACCORDING TO PS]` (Feature Pillars):
    *   Replace static icon-and-text grids with live micro-simulations inside Bento cards (animated state machines, interactive toggles, mini terminal logs, live latency charts).
*   **"How It Works" Step-by-Step Pipeline** `[MANDATORY]` (Interactive Scrollytelling) / `[ACCORDING TO PS]` (Pipeline Stages):
    *   A 3-to-4 stage interactive horizontal or vertical progression illustrating Input $\rightarrow$ Processing Engine $\rightarrow$ Verification/Governance $\rightarrow$ Output/Action.

### 2.5 Social Proof, Benchmarks & Conversion Capture
*   **Social Proof & Validation Engine** `[MANDATORY]` (Structure) / `[ACCORDING TO PS]` (Content Type):
    *   Include logo marquees (with pause-on-hover), filterable customer/user testimonials, or **Quantitative Benchmark Charts** comparing the system against industry baselines (accuracy, speed, cost reduction) when the project is a new product without legacy enterprise logos.
*   **Interactive Comparison Module ("Old Way vs. Our Platform")** `[MANDATORY]` (Component) / `[ACCORDING TO PS]` (Comparison Points):
    *   Visual split-screen or toggle showing legacy manual/fragmented workflows versus the unified platform workflow.
*   **High-Craft Pre-Footer CTA Section** `[MANDATORY]`:
    *   Final conversion anchor with 3D ambient background glow, frictionless onboarding trigger, and direct link to Architecture/Docs.

---

## 3. About, Story, System Transparency & Team Page

Modern buyers, developers, and judges evaluate the engineering rigor behind a product just as heavily as its marketing claims.

### 3.1 Brand Mission, Origin Story & Manifesto
*   **Problem-First Origin Narrative** `[ACCORDING TO PS]` (Story) / `[MANDATORY]` (Editorial Layout):
    *   Structured editorial narrative detailing the systemic industry bottleneck identified in the Problem Statement, why existing legacy approaches fail, and the core thesis behind the platform.
*   **Core Operating Principles & Values Grid** `[MANDATORY]` (Component) / `[ACCORDING TO PS]` (Principles):
    *   4–6 sharp engineering and ethical principles (e.g., Deterministic Reliability, Privacy by Design, Sub-Second Latency, Open Interoperability).

### 3.2 System Architecture Transparency & Engineering Credibility
*   **Interactive System Architecture Diagram** `[MANDATORY]` (Interactive Visualizer) / `[ACCORDING TO PS]` (Topology):
    *   An interactive node-and-edge diagram (built with SVG/Canvas or React Flow) illustrating the real end-to-end architecture: Client Edge $\rightarrow$ API Gateway $\rightarrow$ Orchestration/Inference Engine $\rightarrow$ Vector/Relational Storage $\rightarrow$ Security/Audit Layer.
    *   Clicking any node opens an inspection drawer displaying tech stack specs, latency targets, failure recovery mechanisms, and encryption standards.
*   **Engineering Credibility & Performance Telemetry** `[MANDATORY]` (Component) / `[ACCORDING TO PS]` (Metrics):
    *   Publish verifiable engineering benchmarks: test coverage percentage, uptime SLA target (e.g., $99.95\%$), p95/p99 response latencies, security audit status, and open-source contributions.

### 3.3 Team, Contributors & Advisory Architecture
*   **Team & Engineering Profiles** `[MANDATORY]` (Layout & Social Verification) / `[ACCORDING TO PS]` (Team Members):
    *   High-resolution profile cards featuring role, domain specialization, direct links to GitHub, LinkedIn, X/Twitter, Google Scholar (if research-heavy), and key systems architected.
*   **Culture, Open Roles / Contributors Section** `[ACCORDING TO PS]`:
    *   Depending on whether the PS represents a commercial startup, enterprise initiative, or open-source/hackathon consortium, display either an interactive Careers/Open Roles board or a Contributor & Research Governance showcase.

### 3.4 Multi-Channel Contact & Routing Engine
*   **Segmented Contact Channels** `[MANDATORY]`:
    *   Dedicated routing cards for: General & Press Inquiries, Enterprise Architecture Reviews, Security Vulnerability Reporting (linking to `security.txt`), and Technical Support.
*   **Validated Interactive Contact & Inquiry Form** `[MANDATORY]`:
    *   Client-side + server-side schema validation (Zod), honeypot + Cloudflare Turnstile/cryptographic bot protection, automatic ticket ID generation, and instant confirmation feedback.

---

## 4. Pricing, Documentation & Changelog Architecture

Transparency in cost, self-serve technical onboarding, and visible product velocity are mandatory trust signals.

### 4.1 Pricing & Interactive ROI / Usage Calculator
*   **Tiered Pricing Cards** `[MANDATORY]` (UI Architecture) / `[ACCORDING TO PS]` (Monetization Model):
    *   Support Billing Cycle Toggles (Monthly vs. Annual with automatic discount badge calculation, e.g., $20\%$ off) and Multi-Currency switching (`USD`, `EUR`, `INR`, `GBP`) `[MANDATORY]`.
    *   The exact tiers (e.g., Free/Sandbox, Pro/Growth, Enterprise/Custom; or Open-Source Self-Hosted vs. Managed Cloud) depend on `[ACCORDING TO PS]`.
*   **Interactive Usage, Token & ROI Calculator** `[MANDATORY]` (Interactive Sliders & Formula Engine) / `[ACCORDING TO PS]` (Unit Variables):
    *   Real-time interactive range sliders allowing prospects to estimate monthly cost AND estimated time/money saved based on PS-specific variables (e.g., number of API calls, active seats, documents processed, compute minutes, or GB indexed).
    *   Dynamic cost formula updates smoothly with animated number tickers and automatically highlights the recommended tier.
*   **Granular Feature Comparison Matrix** `[MANDATORY]`:
    *   Sticky-header collapsible comparison table categorized by *Core Capabilities*, *Quotas & Throughput*, *Security & Governance*, and *Support & SLAs*, with interactive tooltips explaining technical terms.
*   **Pricing & Billing FAQ Accordion** `[MANDATORY]`:
    *   Accessible (`aria-expanded`) accordion addressing overage handling, rate limits, data retention on free tiers, cancellation policies, and enterprise invoicing.

### 4.2 MDX-Powered User & API Documentation Hub
*   **Three-Pane Documentation Layout** `[MANDATORY]`:
    *   **Left Pane**: Collapsible hierarchical navigation tree with version selector (`v1.0`, `v2.0-beta`) and category badges.
    *   **Center Pane**: MDX content renderer with custom components (`<Callout>`, `<Tabs>`, `<Steps>`, `<CodeGroup>`, `<MermaidDiagram>`, `<PropertyTable>`).
    *   **Right Pane**: Sticky "On This Page" scroll-spy Table of Contents (`IntersectionObserver`) + quick action links ("Copy page as Markdown for LLMs", "Edit on GitHub", "Report Issue").
*   **Instant Semantic & Keyword Search (`Cmd/Ctrl + K`)** `[MANDATORY]`:
    *   Global keyboard-accessible modal supporting fuzzy search across docs, API endpoints, guides, and changelog entries with highlighted snippets and keyboard arrow navigation.
*   **Interactive Code Blocks & Multi-Language SDK Switcher** `[MANDATORY]`:
    *   Syntax highlighting (Shiki) with line numbers, diff highlighting (`+` / `-`), one-click copy with checkmark feedback, and synchronized language tabs (`cURL`, `TypeScript/Node`, `Python`, `Go`, `Rust`).
*   **Interactive API Playground / OpenAPI Explorer** `[MANDATORY]` (If platform exposes APIs/webhooks) / `[ACCORDING TO PS]` (Endpoints):
    *   Auto-generated or MDX-embedded endpoint tester where users can input parameters, select mock or live bearer tokens, execute requests, and inspect status codes (`200 OK`, `400 Bad Request`, `429 Too Many Requests`) and response schemas.
*   **"Copy for AI / LLM Context" Button** `[MANDATORY]`:
    *   One-click button on every documentation page to copy clean, raw Markdown so developers can paste documentation directly into Cursor, Claude, or Antigravity.

### 4.3 Public Feature Roadmap & Versioned Changelog
*   **Public Interactive Roadmap** `[MANDATORY]` (Kanban/Timeline UI) / `[ACCORDING TO PS]` (Planned Milestones):
    *   Categorized into **Shipped**, **In Progress**, **Next Up**, and **Exploring**, with category filter pills (Core Engine, SDKs, Security, UI/UX) and community upvote/subscribe triggers.
*   **Versioned Release Notes & Changelog** `[MANDATORY]`:
    *   Semantic versioning (`vX.Y.Z`) timeline featuring release dates, visual media/GIF previews, categorized badges (`New Feature`, `Performance`, `Breaking Change`, `Bug Fix`, `Security Patch`), and an automated **RSS / Atom / JSON Feed** endpoint (`/changelog/rss.xml`).

---

## 5. Legal, Compliance, AI Governance & Live Trust Center

Enterprise readiness and regulatory compliance require an interactive Trust Center rather than buried plain-text footers.

### 5.1 Legal & Policy Document Suite
*   **Structured Legal Reader UX** `[MANDATORY]`:
    *   All legal documents must feature a sticky side navigation, Plain-English "TL;DR Summary Callouts" beside dense legal clauses (with a disclaimer that the legal text governs), a **Version Diff / Effective Date Archive**, and a "Download Signed PDF" option.
*   **Core Legal Documents** `[MANDATORY]` (Framework) / `[ACCORDING TO PS]` (Domain Clauses):
    1.  **Terms of Service (ToS)**: Account governance, SLA commitments, IP ownership of user inputs/outputs, billing terms, limitation of liability.
    2.  **Privacy Policy**: Exact taxonomy of collected PII, telemetry, retention windows, data residency, third-party subprocessors, and user deletion/export rights.
    3.  **Acceptable AI Use & Safety Policy**: Prohibited use cases (autonomous harm, disinformation, unlawful surveillance, reverse-engineering weights), human-in-the-loop requirements for high-stakes decisions, automated abuse detection, and hallucination/output disclaimers.
    4.  **Data Processing Addendum (DPA) & Subprocessor List**: Explicit table of infrastructure vendors (Cloud provider, LLM providers, vector DBs, analytics) with server locations and purpose.
    5.  **Vulnerability Disclosure Policy (VDP) & `/.well-known/security.txt`** `[MANDATORY]`: Safe-harbor guidelines for security researchers and RFC 9116 compliant `security.txt`.

### 5.2 Granular Privacy & Cookie Consent Management Engine
*   **Multi-Jurisdiction Regulatory Compliance (GDPR, India DPDP Act 2023, CCPA/CPRA)** `[MANDATORY]`:
    *   Non-intrusive, accessible consent banner and preference drawer supporting **Accept All**, **Reject Non-Essential** (equally prominent, zero dark patterns), and **Granular Category Toggles**:
        *   `Strictly Necessary` (Auth, security, load balancing — locked active).
        *   `Functional & Preferences` (Theme, language, sandbox history).
        *   `Performance & Telemetry` (Anonymized Web Vitals, error tracking).
        *   `Marketing & Attribution` (Optional campaign tracking).
    *   **Consent-Gated Script Execution `[MANDATORY]`**: Third-party scripts must remain inert until cryptographic/timestamped consent state is recorded, with a persistent footer trigger ("Manage Privacy Preferences") to revoke consent at any time.

### 5.3 Live Trust Center & System Status Page
*   **Trust & Security Posture Overview** `[MANDATORY]` (Architecture) / `[ACCORDING TO PS]` (Certifications):
    *   Dedicated Trust Center showcasing encryption standards (TLS 1.3 in transit, AES-256 at rest), RBAC/SSO architecture, zero-data-retention (ZDR) options for AI prompts, and compliance frameworks (SOC 2, ISO 27001, HIPAA, GDPR, DPDP alignment as applicable to the PS).
*   **Live System Status & Uptime Dashboard (`/status`)** `[MANDATORY]`:
    *   **Global Operational Banner**: Real-time aggregate status indicator (`All Systems Operational`, `Partial Degradation`, `Major Service Outage`).
    *   **90-Day Uptime Bar Visualization**: Interactive 90-bar SVG timeline for each core subsystem (Web App, Public API, AI Inference Pipeline, Database/Storage, Webhooks) showing daily uptime percentage and hover tooltips for historical incidents.
    *   **Live Latency & Throughput Sparklines**: Real-time or rolling 24-hour p50/p95 response time graphs.
    *   **Incident History & Post-Mortem Feed**: Chronological log of past incidents (`Investigating` $\rightarrow$ `Identified` $\rightarrow$ `Monitoring` $\rightarrow$ `Resolved`) with root-cause analysis (RCA) transparency and "Subscribe to Updates" (Webhook, Email, Slack, RSS).

---

## 6. SEO, AEO (Answer Engine Optimization) & Social Graph Engine

A world-class public website must be effortlessly discoverable and parseable by both traditional search crawlers (Google/Bing) and modern AI Answer Engines (Perplexity, SearchGPT, Gemini, Claude).

### 6.1 Server-Side Metadata & Canonical Architecture
*   **Dynamic SSR / SSG Metadata Pipeline** `[MANDATORY]`:
    *   Every route must render deterministic server-side `<title>`, `<meta name="description">`, `<link rel="canonical">`, `hreflang` alternates, and viewport/theme-color tags.
    *   Enforce strict title templates (`{Page Title} | {Brand Name} — {Core Value Prop}`).

### 6.2 Dynamic OpenGraph & Social Preview Engine
*   **Edge-Generated Dynamic OG Cards (`/api/og`)** `[MANDATORY]`:
    *   Programmatically generate $1200 \times 630\text{ px}$ OpenGraph and Twitter (`summary_large_image`) preview cards per route (Landing, Docs pages, Changelog releases, Blog posts, Status page) featuring the page title, category badge, reading time/version, and brand visual motifs.

### 6.3 Structured Data & JSON-LD Knowledge Graph
*   **Rich Schema.org JSON-LD Injection** `[MANDATORY]`:
    *   Inject validated `<script type="application/ld+json">` graphs across respective routes:
        *   `Organization` & `WebSite` (with `SearchAction` on the root landing page).
        *   `SoftwareApplication` / `WebApplication` (with operating system, application category, and `AggregateOffer` pricing tiers).
        *   `FAQPage` (on Pricing and Product FAQ sections).
        *   `TechArticle` / `Article` & `BreadcrumbList` (across all Documentation, Blog, and Changelog routes).

### 6.4 Automated Crawler Directives & AI Readability (`llms.txt`)
*   **Automated XML Sitemaps (`sitemap.xml`)** `[MANDATORY]`:
    *   Dynamically generated, split-index XML sitemaps covering static marketing routes, MDX documentation pages, and changelog entries with accurate `<lastmod>`, `<changefreq>`, and `<priority>` attributes.
*   **Granular `robots.txt` Rules** `[MANDATORY]`:
    *   Explicitly allow public marketing and docs routes while disallowing internal API endpoints, auth callbacks, user dashboards, and query-parameter duplicates, plus declaring the `Sitemap:` absolute URL.
*   **AI Crawler Optimization (`llms.txt` & `llms-full.txt`)** `[MANDATORY]`:
    *   Provide a standardized `/llms.txt` and `/llms-full.txt` at the root domain containing a clean, structured Markdown index of the platform's mission, architecture, API capabilities, and documentation links so AI agents and answer engines index the brand with $100\%$ factual accuracy.

---

## 7. Essential Public Ecosystem Extensions (Completing the Architecture)

To ensure zero architectural gaps, the following public-facing modules and foundational systems must also be implemented:

### 7.1 Global Navigation, Command Bar & Fat Footer Architecture
*   **Smart Sticky Header with Mega-Menu Popovers** `[MANDATORY]`:
    *   Blur-backed sticky navigation featuring animated hover previews for Product/Features, Resources/Docs, Pricing, and Company, plus a live Status indicator dot and direct Auth/CTA buttons (`Sign In`, `Get Started`).
*   **Universal Command Palette (`Cmd/Ctrl + K`)** `[MANDATORY]`:
    *   Accessible from *any* public page to jump directly to pages, run sandbox presets, toggle Dark/Light theme, copy API docs, or check system status.
*   **Architectural Fat Footer** `[MANDATORY]`:
    *   Multi-column sitemap index (Product, Developers, Company, Legal & Trust), live system status pill (`● All systems normal`), newsletter capture input, copyright notice, and social/GitHub links.

### 7.2 Engineering Blog, Research & Case Studies Hub
*   **Technical Blog & Benchmark Hub (`/blog` or `/research`)** `[MANDATORY]` (Infrastructure) / `[ACCORDING TO PS]` (Articles):
    *   MDX-powered editorial space for deep-dive engineering articles, benchmark methodology breakdowns, and industry use-case studies with interactive charts, code blocks, author bios, and reading progress indicators.

### 7.3 Dedicated Comparison & Use-Case Pages
*   **Solution / Role-Based Use-Case Routes (`/solutions/[slug]`)** `[ACCORDING TO PS]` (Personas) / `[MANDATORY]` (Template):
    *   Tailored landing views addressing specific stakeholders defined by the PS (e.g., Enterprise Architects, Developers, Compliance Officers, Researchers, or End Consumers).
*   **Alternative & Benchmark Comparison Matrix (`/compare`)** `[MANDATORY]` (Component) / `[ACCORDING TO PS]` (Competitors/Baselines):
    *   Objective engineering comparison highlighting architectural advantages over legacy workflows or competing paradigms.

### 7.4 Custom Resilience, Error & Edge States
*   **Interactive 404 Not Found Page** `[MANDATORY]`:
    *   On-brand spatial/interactive 404 page featuring a search bar, quick links to Home, Docs, and Status, and a diagnostic route logger.
*   **Graceful 500 / Maintenance Boundary** `[MANDATORY]`:
    *   Self-contained static fallback boundary that pulls live updates from the Status Page API and provides direct support contact channels.

### 7.5 Performance, Accessibility & Security Hardening Budgets
*   **Core Web Vitals Targets** `[MANDATORY]`:
    *   Largest Contentful Paint ($\text{LCP}$) $< 2.0\text{ s}$
    *   Interaction to Next Paint ($\text{INP}$) $< 100\text{ ms}$
    *   Cumulative Layout Shift ($\text{CLS}$) $< 0.05$
*   **WCAG 2.2 Level AA Accessibility** `[MANDATORY]`:
    *   Minimum contrast ratio of $4.5:1$ for normal text and $3:1$ for large text/UI components; full keyboard tab-ring navigation (`:focus-visible`); semantic HTML5 landmarks (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`); and `aria-label` coverage for all 3D canvases and icon buttons.
*   **HTTP Security Headers** `[MANDATORY]`:
    *   Enforce strict `Content-Security-Policy` (CSP), `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.

---

## 8. Master Architectural Matrix (`[MANDATORY]` vs. `[ACCORDING TO PS]`)

| Subsystem / Module | Technical Infrastructure & UX | Content, Theme & Domain Logic | Key Engineering Deliverables |
| :--- | :---: | :---: | :--- |
| **Design System & Theme Tokens** | `[MANDATORY]` | `[ACCORDING TO PS]` | `oklch()` CSS tokens, zero-FOUC theme script, fluid `clamp()` typography, reduced-motion media queries. |
| **3D Scroll Choreography (GSAP + Lenis)** | `[MANDATORY]` | `[ACCORDING TO PS]` | Synchronized Lenis + ScrollTrigger ticker, spline camera rig, Draco/KTX2 compression, $60\text{ FPS}$ budget, GPU fallback. |
| **Live Interactive AI Sandbox** | `[MANDATORY]` | `[ACCORDING TO PS]` | Zero-auth trial widget, one-click preset chips, streaming response UI, latency/token badges, rate-limiting guard. |
| **About, Story & Team Page** | `[MANDATORY]` | `[ACCORDING TO PS]` | Origin manifesto, interactive system architecture node graph, engineering benchmarks, verified team profiles, segmented contact form. |
| **Pricing & ROI Calculator** | `[MANDATORY]` | `[ACCORDING TO PS]` | Monthly/Annual toggle, multi-currency switcher, interactive usage/ROI sliders, sticky feature matrix, billing FAQ. |
| **MDX Docs & API Reference** | `[MANDATORY]` | `[ACCORDING TO PS]` | 3-pane layout, `Cmd+K` semantic search, Shiki code blocks, interactive API playground, "Copy Markdown for LLMs" action. |
| **Public Roadmap & Changelog** | `[MANDATORY]` | `[ACCORDING TO PS]` | Filterable Kanban roadmap, semantic versioned release timeline, category badges, automated RSS/Atom feed. |
| **Legal & AI Governance Suite** | `[MANDATORY]` | `[ACCORDING TO PS]` | ToS, Privacy Policy, Acceptable AI Use Policy, DPA/Subprocessors table, TL;DR callout reader, `security.txt`. |
| **GDPR / DPDP Consent Engine** | `[MANDATORY]` | `[MANDATORY]` | Zero-dark-pattern banner, granular category toggles, consent-gated script loader, persistent revocation drawer. |
| **Live Trust Center & Status Page** | `[MANDATORY]` | `[ACCORDING TO PS]` | Security posture grid, 90-day SVG uptime bars per service, live latency sparklines, incident RCA timeline. |
| **SEO, AEO & Social Graph Engine** | `[MANDATORY]` | `[ACCORDING TO PS]` | SSR metadata, Edge dynamic OG image generator, JSON-LD schemas, XML sitemap, `robots.txt`, `/llms.txt`. |
| **Global UX, A11y & Web Vitals** | `[MANDATORY]` | `[MANDATORY]` | Global `Cmd+K` palette, mega-menu header, custom 404/500 pages, WCAG 2.2 AA compliance, strict CSP/HSTS headers. |

---

## 9. Recommended Implementation Blueprint for Antigravity

When executing this specification, Antigravity should follow this dependency-ordered build sequence:

1.  **Phase 1 — Foundation & Shell (`[MANDATORY]`)**: Initialize design tokens (`[ACCORDING TO PS]` palette), typography, zero-FOUC theme provider, Lenis smooth scroll wrapper, global `Cmd+K` command palette, sticky mega-menu header, fat footer, and SEO/JSON-LD metadata helpers.
2.  **Phase 2 — 3D Landing Page & Interactive Sandbox (`[MANDATORY]` + `[ACCORDING TO PS]`)**: Build the WebGL/Three.js canvas with GSAP ScrollTrigger camera waypoints, GPU fallback detection, Hero section, Live Interactive AI Sandbox with preset chips, interactive Bento feature grid, and social proof/benchmark engine.
3.  **Phase 3 — Trust, Architecture & Brand Authority (`[MANDATORY]` + `[ACCORDING TO PS]`)**: Build the About/Story page featuring the interactive System Architecture diagram, team profiles, segmented contact form, Legal document reader (ToS, Privacy, Acceptable AI Use), GDPR/DPDP cookie consent engine, and the Live System Status page (`/status`).
4.  **Phase 4 — Commercial & Developer Ecosystem (`[MANDATORY]` + `[ACCORDING TO PS]`)**: Build the Pricing page with the interactive ROI/Usage calculator and comparison table, the 3-pane MDX Documentation & API Playground hub, the Public Roadmap, and the Versioned Changelog.
5.  **Phase 5 — Crawler, AEO & Performance Polish (`[MANDATORY]`)**: Generate dynamic `/api/og` social cards, `sitemap.xml`, `robots.txt`, `/llms.txt`, `/.well-known/security.txt`, custom 404/500 boundaries, and verify Core Web Vitals ($\text{LCP} < 2.0\text{ s}$, $\text{CLS} < 0.05$) and WCAG 2.2 AA accessibility.