# Enterprise Reference Blueprint: Docker Containerization & AWS Production Infrastructure

---

## 0. Agent Directives & Classification Legend (For Antigravity)

This document serves as the **authoritative architectural specification and knowledge base** for designing, building, containerizing, and deploying production-grade web applications using **Docker** and **Amazon Web Services (AWS)**.

Every architectural pattern, configuration, and security control in this guide is strictly classified into one of two categories:

1. **`[MANDATORY]`**: Non-negotiable standards required for any professional, high-performance, resilient, and secure production web system. Any pattern that directly improves **security posture, runtime performance, observability, deployment safety, availability, cost efficiency, or developer parity** falls under **`[MANDATORY]`**. Antigravity must implement these by default without waiting for explicit user prompts.
2. **`[ACCORDING TO PS]`** *(According to Problem Statement)*: Architectural choices, domain-specific topologies, resource sizing, data storage engines, compliance controls, or UI/UX delivery behaviors that depend on the specific project scope, business domain, traffic profile, or problem statement. Antigravity must evaluate the Problem Statement (PS) to select the appropriate option from the decision matrices provided herein.

---

## 1. Hardened Multi-Stage Dockerfiles & Container Runtime Security

### 1.1 Multi-Stage Build Architecture `[MANDATORY]`
Production containers must never contain build toolchains, compilers (`gcc`, `make`), package managers (`npm`, `pip`, `cargo`, `mvn`), source code `.git` directories, test suites, or development dependencies.
* **Stage Separation**:
  * `deps` / `cacher`: Isolates dependency manifests (`package.json`, `pnpm-lock.yaml`, `go.mod`, `requirements.txt`, `Cargo.lock`) to maximize Docker layer caching.
  * `builder`: Compiles TypeScript/Go/Rust/Java, bundles frontend assets, and prunes development dependencies.
  * `runner` (Final Stage): Contains **only** the compiled binary or minified production bundle, required shared libraries, CA certificates, timezone data, and a minimal init binary.
* **BuildKit Optimizations**:
  * Enforce `syntax=docker/dockerfile:1` at the top of every `Dockerfile`.
  * Use `--mount=type=cache` for package manager caches (e.g., `/root/.npm`, `/root/.cache/pip`, `/go/pkg/mod`) so builds remain fast without bloating image layers.
  * Use `--mount=type=secret` if build-time private registry tokens are needed—**never** pass secrets via `ARG` or `ENV` as they persist in `docker history`.

### 1.2 Base Image Selection Strategy `[MANDATORY]` & `[ACCORDING TO PS]`
* **Deterministic Digest Pinning `[MANDATORY]`**: Base images must be pinned to both semantic versions and immutable cryptographic SHA256 digests (e.g., `FROM node:22-alpine@sha256:...`) to guarantee reproducible builds and prevent upstream tag-mutation attacks.
* **OS Family Selection `[ACCORDING TO PS]`**:
  * **Google Distroless (`gcr.io/distroless/static-debian12`, `base-debian12`, `nodejs22-debian12`) or Chainguard Images**: Preferred for maximum security. Contains zero shell (`/bin/sh` is absent), zero package manager, and minimal CVE surface area. Use for Go, Rust, Java, and standard Node.js/Python workloads.
  * **Alpine Linux (`*-alpine`)**: Uses `musl libc` and BusyBox. Ideal when a minimal image size ($< 50\text{ MB}$) is needed alongside occasional shell script execution, provided all strip/shell tools are hardened.
  * **Debian Slim (`*-bookworm-slim`)**: Required when the Problem Statement involves native C/C++ bindings, ML/AI libraries (PyTorch, OpenCV, Sharp, Prisma engines, Puppeteer/Playwright) that rely strictly on `glibc` and degrade or fail on `musl libc`.

### 1.3 Non-Root Execution & Least-Privilege Runtime `[MANDATORY]`
Containers must never execute application processes as `root` (`UID 0`).
* **High UID/GID Assignment**: Create and run as a dedicated unprivileged user with a UID/GID $> 10000$ (e.g., `10001:10001`) to prevent UID collision with host operating system users in the event of a container breakout.
* **File Ownership Hygiene**: Files copied into the final stage must remain owned by `root:root` with read/execute permissions (`0555` or `0444`) for the non-root user (`10001`), ensuring that even if the application is compromised via Remote Code Execution (RCE), the attacker cannot modify the application source code or binary on disk.

### 1.4 Read-Only Root Filesystem & Ephemeral Volumes `[MANDATORY]`
* **Immutable Root FS**: Configure `readonlyRootFilesystem: true` in ECS Task Definitions and `read_only: true` in `docker-compose.yml`.
* **Scoped Tmpfs Mounts**: Because runtimes (Node.js V8 cache, Python bytecode, NGINX PID files) require scratch space, mount in-memory `tmpfs` volumes strictly to `/tmp` and `/var/run` with `noexec,nosuid,nodev` flags and explicit size limits (e.g., $64\text{ MB}$).

### 1.5 PID 1 Signal Handling & Graceful Shutdown `[MANDATORY]`
* **The PID 1 Problem**: When a process runs as `PID 1` inside a container, the Linux kernel treats it specially: it ignores default signal handlers for `SIGTERM` unless explicitly coded, and it must reap orphaned zombie processes.
* **Init Process Injection**:
  * Always invoke containers using `exec` form (`ENTRYPOINT ["node", "dist/server.js"]`), never shell form (`ENTRYPOINT "node dist/server.js"`), because `/bin/sh -c` swallows `SIGTERM` signals.
  * Enable `initProcessEnabled: true` in AWS ECS Task Definitions (injects `tini` automatically) or explicitly copy `/sbin/tini` into Distroless/Alpine images.
* **Graceful Termination Lifecycle**: When ECS stops a task, it sends `SIGTERM`, waits for `stopTimeout` (default $30\text{s}$, configurable up to $120\text{s}$), and then sends `SIGKILL`. The application **must** trap `SIGTERM`, immediately stop accepting new HTTP requests, finish in-flight requests, close database/Redis pools cleanly, flush OpenTelemetry buffers, and exit with code `0`.

### 1.6 `.dockerignore` Hygiene `[MANDATORY]`
A strict `.dockerignore` file is mandatory at the repository root to prevent context bloat and accidental secret leakage into the Docker daemon:
```text
.git
.github
.env*
!.env.example
node_modules
dist
build
coverage
*.log
.terraform
*.tfstate*
Dockerfile*
docker-compose*.yml
README.md
docs/
tests/
```

### 1.7 Reference Production Dockerfile Blueprint `[MANDATORY]`
```dockerfile
# syntax=docker/dockerfile:1.7

# ============================================================================
# STAGE 1: Dependency Installation (Cached unless lockfile changes)
# ============================================================================
FROM node:22-bookworm-slim@sha256:6b7d14b3bd55e9c8c5e025a9f0eb10df5d4a0200b892e3d0a8a0a11b2a10f8a0 AS deps
WORKDIR /app

# Enable Corepack for deterministic package manager versions (pnpm/yarn)
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm fetch --frozen-lockfile && \
    pnpm install --frozen-lockfile --ignore-scripts

# ============================================================================
# STAGE 2: Application Builder
# ============================================================================
FROM deps AS builder
WORKDIR /app

COPY . .
RUN pnpm run build && \
    pnpm prune --prod --ignore-scripts

# ============================================================================
# STAGE 3: Hardened Distroless Production Runner
# ============================================================================
FROM gcr.io/distroless/nodejs22-debian12:nonroot@sha256:9c8b3f204e238e9c9a6a7b6d0d545163a84534085051b2b39c35c6908c5d9999 AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=8080 \
    NODE_OPTIONS="--enable-source-maps --max-old-space-size=1536"

# Copy production artifacts owned by root:root (read-only for nonroot user 65532)
COPY --from=builder --chown=root:root /app/node_modules ./node_modules
COPY --from=builder --chown=root:root /app/dist ./dist
COPY --from=builder --chown=root:root /app/package.json ./package.json

# Run as Distroless nonroot user (UID/GID 65532)
USER nonroot:nonroot

EXPOSE 8080

# Distroless nodejs entrypoint is already ["/nodejs/bin/node"]
CMD ["dist/server.js"]
```

---

## 2. Local Development Parity & `docker-compose` Architecture

### 2.1 Production-Mirroring Local Environment `[MANDATORY]`
Developers and AI agents must be able to spin up the entire application topology locally with a single command (`docker compose up --build`) that mirrors AWS production behavior.
* **Service Dependency Orchestration**: Never rely on naive `depends_on: [db]`. Always enforce readiness probes using `depends_on` with `condition: service_healthy` so the application container waits until PostgreSQL, Redis, and LocalStack are actively accepting connections.
* **AWS Service Emulation (LocalStack)**: Emulate S3, SQS, SNS, Secrets Manager, and DynamoDB locally via `localstack/localstack` initialized with automated bootstrap scripts (`/etc/localstack/init/ready.d/`).
* **Security Parity**: Test `read_only: true`, `tmpfs`, `cap_drop: [ALL]`, and `security_opt: [no-new-privileges:true]` locally in `docker-compose.yml` so permission regressions are caught before CI/CD.

### 2.2 Reference `docker-compose.yml` Blueprint `[MANDATORY]`
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    read_only: true
    tmpfs:
      - /tmp:size=64M,mode=1777,noexec,nosuid,nodev
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    ports:
      - "8080:8080"
    env_file:
      - .env.local
    environment:
      - DATABASE_URL=postgresql://app_user:app_secret@postgres:5432/app_db?sslmode=disable
      - REDIS_URL=redis://redis:6379/0
      - AWS_ENDPOINT_URL=http://localstack:4566
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      localstack:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "/nodejs/bin/node", "-e", "fetch('http://127.0.0.1:8080/health/live').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 1024M

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: app_secret
      POSTGRES_DB: app_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user -d app_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7.4-alpine
    command: ["redis-server", "--appendonly", "yes", "--maxmemory", "256mb", "--maxmemory-policy", "allkeys-lru"]
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  localstack:
    image: localstack/localstack:3.7
    environment:
      - SERVICES=s3,sqs,sns,secretsmanager,ssm
      - DEFAULT_REGION=us-east-1
    volumes:
      - "./infra/localstack/init-aws.sh:/etc/localstack/init/ready.d/init-aws.sh:ro"
    healthcheck:
      test: ["CMD", "awslocal", "s3", "ls"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
  redisdata:
```

---

## 3. Container Registry & Supply Chain Security (Amazon ECR)

### 3.1 Amazon ECR Configuration `[MANDATORY]`
* **Tag Immutability**: Set `image_tag_mutability = "IMMUTABLE"`. Every image pushed must be tagged with the Git commit SHA (`git-sha-<short_sha>`) and semantic release version. Never use mutable tags like `:latest` or `:prod` in ECS Task Definitions.
* **Encryption at Rest**: Configure `encryption_configuration` using `KMS` (Customer Managed Key or AWS Managed Key) rather than basic AES256.
* **Lifecycle Policies**: Automatically expire untagged images after $1\text{ day}$ and retain only the last $N$ (e.g., $30$) tagged production images and $10$ staging images to prevent unbounded storage cost growth.
* **Pull-Through Cache Rules**: Configure ECR Pull-Through Cache for upstream public registries (`public.ecr.aws`, `docker.io`, `quay.io`, `ghcr.io`) to eliminate Docker Hub anonymous rate limits and cache base images inside your AWS region.

### 3.2 Vulnerability Scanning & SBOM Attestation `[MANDATORY]`
* **Continuous & On-Push Scanning**: Enable Amazon Inspector Enhanced Scanning on ECR repositories in addition to pre-push CI gating with `Trivy` (`trivy image --exit-code 1 --severity HIGH,CRITICAL --ignore-unfixed`).
* **Software Bill of Materials (SBOM) & Signing**: Generate CycloneDX or SPDX SBOMs during CI (`syft`) and cryptographically sign images using Sigstore `cosign` with AWS KMS keys.
* **Cross-Region ECR Replication `[ACCORDING TO PS]`**: Enable automated cross-region replication only if the Problem Statement mandates Multi-Region Active-Active or Warm-Standby Disaster Recovery ($RTO < 15\text{ mins}$).

---

## 4. AWS Network Topology & Multi-AZ VPC Architecture

### 4.1 3-Tier Multi-AZ Subnet Design `[MANDATORY]`
All production workloads must be deployed inside a custom Virtual Private Cloud (VPC) spanning **at least 3 Availability Zones (AZs)** to guarantee high availability ($99.99\%$) during single-AZ outages.
* **Public Subnets (1 per AZ)**:
  * Hosts only Ingress Application Load Balancers (ALBs) and Managed NAT Gateways.
  * `map_public_ip_on_launch = false` (explicitly attach EIPs only where required).
* **Private Application / Compute Subnets (1 per AZ)**:
  * Hosts all AWS ECS Fargate tasks, Lambda VPC functions, and VPC Interface Endpoints.
  * Zero direct inbound access from the internet; outbound internet access routed through AZ-local NAT Gateways.
* **Isolated Persistence / Data Subnets (1 per AZ)**:
  * Hosts Amazon RDS / Aurora, Amazon ElastiCache (Redis/Valkey), Amazon OpenSearch, and EFS Mount Targets.
  * **Zero route to Internet Gateway or NAT Gateway** (`0.0.0.0/0` does not exist in the route table). Can only communicate within the VPC CIDR.

### 4.2 Dual-Stack IPv6 & Private AWS Backbone Routing `[MANDATORY]`
* **IPv6 Dual-Stack**: Assign an Amazon-provided `/56` IPv6 CIDR block to the VPC and `/64` blocks to all subnets. Use an Egress-Only Internet Gateway for outbound IPv6 traffic to avoid NAT Gateway hourly/data processing fees where supported.
* **VPC Endpoints (PrivateLink) for Cost & Security**:
  * **Gateway Endpoints (Free, Mandatory)**: Provision for **Amazon S3** and **Amazon DynamoDB** and attach to Private and Isolated route tables. Because container image layers in ECR are stored in S3, the S3 Gateway Endpoint prevents massive NAT Gateway data processing charges during ECS task launches.
  * **Interface Endpoints (`[MANDATORY]` for High-Throughput / Strict Security, `[ACCORDING TO PS]` for Low-Budget Staging)**: `ecr.api`, `ecr.dkr`, `logs` (CloudWatch), `secretsmanager`, `ssm`, and `kms`.

### 4.3 Strict Security Group Chaining (Zero-Trust Network) `[MANDATORY]`
Never use broad CIDR ranges (`0.0.0.0/0`) inside the VPC. Every tier must reference the upstream tier's **Security Group ID** as its sole ingress source:
1. **`sg-alb` (Public ALB)**:
   * **Ingress**: Port `443` from the **AWS-Managed CloudFront Prefix List** (`com.amazonaws.global.cloudfront.origin-facing`) ONLY. This prevents attackers from bypassing CloudFront/WAF by hitting the ALB DNS name directly.
   * **Egress**: Port `<APP_PORT>` (e.g., `8080`) targeting `sg-ecs-tasks` ONLY.
2. **`sg-ecs-tasks` (ECS Fargate Service)**:
   * **Ingress**: Port `<APP_PORT>` (`8080`) sourced strictly from `sg-alb`.
   * **Egress**: Port `5432` to `sg-rds`, Port `6379` to `sg-redis`, and Port `443` to `0.0.0.0/0` (for external HTTPS APIs and AWS endpoints).
3. **`sg-rds` / `sg-redis` (Data Tier)**:
   * **Ingress**: Port `5432` / `6379` sourced strictly from `sg-ecs-tasks` (and `sg-bastion-ssm` if an SSM jump host is used).
   * **Egress**: None required.

### 4.4 VPC Flow Logs `[MANDATORY]`
Enable VPC Flow Logs capturing `ALL` (or at minimum `REJECT`) traffic delivered directly to an S3 bucket in Apache Parquet format with hourly partitions for Athena security forensics.

---

## 5. Elastic Compute Orchestration (AWS ECS Fargate)

### 5.1 ECS Cluster & Capacity Provider Strategy `[MANDATORY]` & `[ACCORDING TO PS]`
* **Container Insights**: Enable `containerInsights = "enhanced"` on the ECS Cluster for granular task-level and container-level telemetry.
* **ARM64 (AWS Graviton) Architecture `[MANDATORY]`**: Configure `runtimePlatform: { cpuArchitecture: "ARM64", operatingSystemFamily: "LINUX" }` unless a legacy closed-source x86 binary is dictated by the Problem Statement. AWS Graviton delivers up to $40\%$ better price-performance and lower latency.
* **Capacity Provider Mix (`FARGATE` vs. `FARGATE_SPOT`) `[ACCORDING TO PS]`**:
  * **Mission-Critical / Stateful Web APIs**: $100\%$ `FARGATE` for the `base` capacity (e.g., `base = 2, weight = 1`), optionally bursting overflow traffic onto `FARGATE_SPOT` (`weight = 2`).
  * **Stateless Workers / Queue Consumers / Staging**: Up to $80\text{--}100\%$ `FARGATE_SPOT` ($70\%$ cost reduction), paired with proper `SIGTERM` 2-minute spot interruption handling.

### 5.2 Task Definition Hardening & Resource Sizing `[MANDATORY]` & `[ACCORDING TO PS]`
* **Network Mode `[MANDATORY]`**: Always `awsvpc` (each task gets a dedicated Elastic Network Interface and private IP).
* **CPU & Memory Sizing `[ACCORDING TO PS]`**:
  * Standard Lightweight API (Go/Rust/Node): `512` CPU ($0.5\text{ vCPU}$) / `1024` MB ($1\text{ GB}$).
  * SSR Frontend (Next.js / Nuxt / Remix) or JVM/Python API: `1024` CPU ($1\text{ vCPU}$) / `2048` MB ($2\text{ GB}$).
  * Compute/SSR/ML Intensive Workload: `2048`--`4096` CPU ($2\text{--}4\text{ vCPU}$) / `4096`--`16384` MB.
* **Ephemeral Storage**: Default is $20\text{ GB}$; increase up to $200\text{ GB}$ (`ephemeralStorage.sizeInGiB`) only if the Problem Statement involves temporary media transcoding or large file processing, encrypted automatically with KMS.

### 5.3 Multi-Dimensional Auto-Scaling Policies `[MANDATORY]`
Every production ECS Service must be registered as an Application Auto Scaling Scalable Target (`min_capacity >= 2` across multiple AZs for production):
1. **CPU Target Tracking**: Scale at $65\%$ average CPU utilization (`ECSServiceAverageCPUUtilization`).
2. **Memory Target Tracking**: Scale at $75\%$ average Memory utilization (`ECSServiceAverageMemoryUtilization`).
3. **ALB Request Count Per Target**: Scale based on `ALBRequestCountPerTarget` (tuned via load testing, e.g., $1000\text{ requests/minute/task}$).
4. **Asymmetric Cooldowns**:
   * `scale_out_cooldown = 30` to `60` seconds (react aggressively to traffic spikes).
   * `scale_in_cooldown = 300` seconds (scale down conservatively to prevent thrashing and premature connection drops).

### 5.4 Deployment Safety, Circuit Breakers & Zero-Downtime Rollouts `[MANDATORY]`
* **Deployment Circuit Breaker**: Enable `deployment_circuit_breaker { enable = true, rollback = true }` so ECS automatically halts a broken deployment and rolls back to the last known healthy Task Definition revision if tasks fail health checks.
* **Deployment Pacing**: Set `minimum_healthy_percent = 100` and `maximum_percent = 200` so old tasks are never terminated until replacement tasks pass both container and ALB health checks.
* **Blue/Green Deployments via AWS CodeDeploy `[ACCORDING TO PS]`**: Use when the Problem Statement requires canary traffic shifting (e.g., `CodeDeployDefault.ECSLinear10PercentEvery1Minutes`) and synthetic validation hooks prior to full traffic cutover.

### 5.5 Deep Health Check Alignment & Connection Draining `[MANDATORY]`
Misaligned health checks cause intermittent `502 Bad Gateway` and `504 Gateway Timeout` errors during deployments. Enforce this exact coordination:
1. **Liveness vs. Readiness Endpoints**:
   * `/health/live` (Container Health Check): Lightweight local check verifying the event loop/process is responsive. Does **not** query downstream DBs (prevents cascading task restarts if RDS blips for $2\text{ seconds}$).
   * `/health/ready` (ALB Target Group Health Check): Verifies the task is ready to serve traffic and its connection pool is initialized.
2. **Deregistration Delay & Stop Timeout Synchronization**:
   * Set ALB Target Group `deregistration_delay.timeout_seconds = 30`.
   * Set ECS Container Definition `stopTimeout = 45`.
   * During task shutdown, handle `SIGTERM` by failing `/health/ready` (or letting ECS deregister the target), waiting $5\text{--}10\text{ seconds}$ for in-flight ALB requests to finish, draining active sockets, and exiting cleanly before `stopTimeout` expires.

---

## 6. Global Edge, Load Balancing, DNS & TLS Security

```
[Client Browser / Mobile App]
              │
              ▼  (TLS 1.3, HTTP/3 QUIC, Anycast DNS via Route 53)
┌─────────────────────────────────────────────────────────────────┐
│ Amazon CloudFront CDN + AWS WAFv2 + AWS Shield                  │
│  ├─ Static Assets (/_next/static/*, /assets/*) ──► S3 (via OAC) │
│  └─ Dynamic API / SSR Requests (/*)                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │  (Locked via CloudFront Managed Prefix List
                              │   + Secret X-Origin-Verify Header in Secrets Mgr)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Application Load Balancer (Public Subnets across 3 AZs)         │
│  └─ TLS 1.3 Termination, Header Normalization, Target Health    │
└─────────────────────────────┬───────────────────────────────────┘
                              │  (SG Chained: Only sg-alb -> sg-ecs:8080)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ AWS ECS Fargate Tasks (Private Subnets across 3 AZs)            │
└─────────────────────────────────────────────────────────────────┘
```

### 6.1 Amazon Route 53 DNS Architecture `[MANDATORY]`
* **Alias Records (`A` and `AAAA`)**: Point root (`example.com`) and subdomains (`www`, `api`) to the CloudFront Distribution using Route 53 `ALIAS` records for both IPv4 (`A`) and IPv6 (`AAAA`).
* **DNS Security**:
  * Enable **DNSSEC** signing on the Hosted Zone.
  * Provision **CAA (Certification Authority Authorization)** records (`0 issue "amazon.com"`) so only AWS Certificate Manager can issue TLS certificates for the domain.

### 6.2 AWS Certificate Manager (ACM) & Strict TLS `[MANDATORY]`
* **Automated DNS Validation**: Provision ACM certificates validated automatically via Route 53 CNAME records.
  * **Edge Certificate**: Must be provisioned in **`us-east-1`** for attachment to Amazon CloudFront.
  * **Origin Certificate**: Provisioned in the workload's primary AWS region for attachment to the Application Load Balancer (ensuring **End-to-End HTTPS encryption** from viewer to CloudFront and CloudFront to ALB).
* **TLS Cipher Policy**:
  * CloudFront Viewer Protocol Policy: `redirect-to-https`, Minimum Protocol Version: `TLSv1.2_2021` (supports TLS 1.3).
  * ALB HTTPS Listener Policy: `ELBSecurityPolicy-TLS13-1-2-2021-06`.

### 6.3 Amazon CloudFront CDN & Origin Cloaking `[MANDATORY]`
* **Multi-Origin Routing**:
  * **S3 Static Origin**: Route immutable static assets (`/static/*`, `/_next/static/*`, `/assets/*`) directly to an S3 bucket secured with **Origin Access Control (OAC)** and KMS support. Set `Cache-Control: public, max-age=31536000, immutable`.
  * **ALB Dynamic Origin**: Route dynamic HTML/SSR and API traffic to the Application Load Balancer.
* **Origin Cloaking (Defense-in-Depth)**:
  1. Restrict the ALB Security Group ingress strictly to the AWS-managed `com.amazonaws.global.cloudfront.origin-facing` Prefix List.
  2. Inject a custom secret header (`X-Origin-Verify`) from CloudFront into origin requests, rotated via AWS Secrets Manager, and configure an ALB Listener Rule to drop (`403 Forbidden`) any request lacking that exact header value.
* **Protocol & Compression Optimizations**: Enable `HTTP/2` and `HTTP/3 (QUIC)`, and enable automatic **Brotli** and **Gzip** compression at the edge.
* **Security Response Headers Policy**: Attach a CloudFront Response Headers Policy enforcing:
  * `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  * `X-Content-Type-Options: nosniff`
  * `X-Frame-Options: DENY` (or `SAMEORIGIN` `[ACCORDING TO PS]`)
  * `Referrer-Policy: strict-origin-when-cross-origin`
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  * `Content-Security-Policy`: Tailored to the application's asset/script origins `[ACCORDING TO PS]`.

### 6.4 AWS WAFv2 & Edge Protection `[MANDATORY]`
Attach an AWS WAFv2 WebACL (`CLOUDFRONT` scope) with the following baseline rules:
1. `AWSManagedRulesCommonRuleSet` (OWASP Top 10 protections: XSS, LFI, RFI).
2. `AWSManagedRulesKnownBadInputsRuleSet` (Log4j, SSRF, command injection payloads).
3. `AWSManagedRulesSQLiRuleSet` (SQL injection defense).
4. `AWSManagedRulesAmazonIpReputationList` (Blocks known botnets, Tor exit nodes, and malicious scanners).
5. **Rate-Based DDoS Rules**:
   * Global per-IP rate limit (e.g., $2000\text{ requests / 5 minutes}$).
   * Stricter auth-endpoint rate limit (`/api/auth/*`, `/login`, `/graphql`) at $100\text{ requests / 5 minutes}$.

### 6.5 Application Load Balancer (ALB) Hardening `[MANDATORY]`
* `drop_invalid_header_fields = true` (Prevents HTTP Desync / Request Smuggling attacks).
* `enable_deletion_protection = true` in production.
* `enable_cross_zone_load_balancing = true`.
* Deliver ALB Access Logs and Connection Logs to a dedicated, lifecycle-managed S3 bucket.

---

## 7. Data Persistence, Caching & State Management

### 7.1 Stateless Compute Mandate `[MANDATORY]`
ECS Fargate tasks must remain strictly **stateless**. Never store user uploads, session files, SQLite databases, or persistent state on the container filesystem. Any task can be terminated and replaced at any second.

### 7.2 Relational & NoSQL Databases `[ACCORDING TO PS]` & `[MANDATORY]`
* **Engine Selection `[ACCORDING TO PS]`**:
  * **Amazon Aurora PostgreSQL / RDS PostgreSQL**: Default choice for relational transactional workloads, complex joins, JSONB querying, or `pgvector` AI embeddings.
  * **Amazon DynamoDB**: Default choice for ultra-low-latency ($< 10\text{ ms}$) key-value access patterns, serverless global tables, or high-velocity event ingestion.
* **Mandatory RDS/Aurora Production Hardening `[MANDATORY]`**:
  * Deploy in **Isolated Subnets** (`publicly_accessible = false`).
  * `storage_encrypted = true` with a KMS Customer Managed Key (CMK).
  * `multi_az = true` for automatic failover in production.
  * `deletion_protection = true` and `skip_final_snapshot = false`.
  * `backup_retention_period = 14` to `35` days with Point-In-Time Recovery (PITR) enabled.
  * Enable **Performance Insights** (retained for at least 7 days).
  * Manage master credentials automatically via `manage_master_user_password = true` (AWS Secrets Manager native rotation) and enforce TLS connections (`rds.force_ssl = 1`).
  * **RDS Proxy `[ACCORDING TO PS]`**: Mandatory if ECS task counts scale above $20\text{--}30$ replicas or when paired with AWS Lambda to prevent PostgreSQL connection exhaustion (`max_connections`).

### 7.3 In-Memory Caching & Distributed State (Amazon ElastiCache) `[ACCORDING TO PS]` & `[MANDATORY]`
* **When Required**: Session management, rate-limiting counters, BullMQ/Celery background job queues, pub/sub WebSockets, or API query caching.
* **Engine & Hardening `[MANDATORY]`**:
  * Prefer **Amazon ElastiCache for Valkey** (drop-in open-source Redis fork with $20\text{--}33\%$ lower AWS pricing than Redis OSS) in Serverless or Multi-AZ Cluster mode.
  * Enforce **Encryption in Transit (TLS)** (`transit_encryption_enabled = true`), **Encryption at Rest** (`at_rest_encryption_enabled = true`), and **RBAC / Auth Token** authentication.

### 7.4 Object Storage (Amazon S3) `[MANDATORY]`
* **Public Access Lockdown**: Every S3 bucket must have `aws_s3_bucket_public_access_block` enabled with all 4 flags set to `true` (`block_public_acls`, `block_public_policy`, `ignore_public_acls`, `restrict_public_buckets`).
* **Direct Client Uploads via Presigned URLs**: User file uploads (images, PDFs, videos) must **never** stream through the ECS Node/Python server memory. Instead, the backend API generates a short-lived ($< 5\text{ min}$), size-constrained **S3 Presigned POST/PUT URL**, and the browser uploads directly to S3 (or S3 Transfer Acceleration).
* **Storage Lifecycle & Encryption**: Enable SSE-KMS encryption, bucket versioning, and `INTELLIGENT_TIERING` lifecycle rules for long-term assets.

---

## 8. Zero-Trust IAM, Secrets Management & Configuration Injection

### 8.1 Strict Separation of ECS IAM Roles `[MANDATORY]`
Never combine infrastructure permissions and application runtime permissions into a single IAM Role. Every ECS Task Definition requires two distinct roles:
1. **ECS Task Execution Role (`executionRoleArn`)**:
   * Used exclusively by the **AWS ECS Container Agent** (infrastructure layer) to start the container.
   * **Permissions**: Pull images from the specific ECR repository ARN, push logs to the specific CloudWatch Log Group ARN, and read the specific Secrets Manager / SSM Parameter ARNs injected at startup (`secretsmanager:GetSecretValue`, `kms:Decrypt`).
2. **ECS Task Role (`taskRoleArn`)**:
   * Assumed by the **application code running inside the container**.
   * **Permissions**: Least-privilege access scoped strictly to the exact S3 bucket ARN, SQS queue ARN, or DynamoDB table ARN required by the business logic. **Never use `Resource: "*"`**.

### 8.2 Runtime Secrets Injection `[MANDATORY]`
* **Zero Secrets in Code or Images**: Secrets (database URLs, JWT signing keys, Stripe/OpenAI API keys) must never exist in Git, `.env` files committed to the repo, Dockerfile `ENV`/`ARG` directives, or plain-text ECS `environment` blocks.
* **Native ECS Secret Injection**: Store secrets in **AWS Secrets Manager** (for secrets requiring automated rotation like RDS credentials) or **AWS Systems Manager (SSM) Parameter Store SecureString** (for static API keys). Reference them in the ECS Task Definition `secrets` block:
  ```json
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:111122223333:secret:prod/app/db-AbCdEf:url::"
    },
    {
      "name": "JWT_PRIVATE_KEY",
      "valueFrom": "arn:aws:ssm:us-east-1:111122223333:parameter/prod/app/jwt_private_key"
    }
  ]
  ```

### 8.3 Keyless CI/CD via OIDC Federation `[MANDATORY]`
Never generate long-lived IAM User `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` credentials for GitHub Actions or GitLab CI.
* Configure an **AWS IAM OpenID Connect (OIDC) Identity Provider** (`token.actions.githubusercontent.com`).
* Create a dedicated CI/CD IAM Role with a trust policy locked to the exact repository and branch/environment (`repo:org/repo:environment:production`), issuing temporary $15\text{-minute}$ STS tokens per workflow run.

---

## 9. Infrastructure as Code (IaC) — Terraform / OpenTofu / AWS CDK

### 9.1 Modular Directory Structure & Environment Isolation `[MANDATORY]`
Infrastructure must be $100\%$ declarative and reproducible. Manual clicks in the AWS Console ("ClickOps") are strictly forbidden.
* **Recommended Repository Layout (Terraform / OpenTofu)**:
  ```text
  infra/
  ├── modules/
  │   ├── network/          # VPC, Subnets, NAT, VPC Endpoints, Flow Logs
  │   ├── ecr/              # Immutable ECR repos, Inspector, Lifecycle rules
  │   ├── ecs-cluster/      # ECS Cluster, Capacity Providers, Container Insights
  │   ├── ecs-service/      # Task Def, Service, Autoscaling, SG, IAM Roles
  │   ├── edge/             # CloudFront, ALB, WAFv2, Route53, ACM
  │   ├── datastore/        # RDS Aurora, ElastiCache Valkey, S3 Buckets
  │   └── observability/    # CloudWatch Alarms, SNS, Dashboards, FireLens
  └── environments/
      ├── staging/
      │   ├── backend.tf    # Isolated staging state file
      │   ├── main.tf       # Calls ../../modules/* with staging sizing
      │   └── variables.tf
      └── production/
          ├── backend.tf    # Isolated production state file
          ├── main.tf       # Calls ../../modules/* with HA production sizing
          └── variables.tf
  ```

### 9.2 Remote State Security & Locking `[MANDATORY]`
* Store Terraform state in a hardened, versioned, KMS-encrypted Amazon S3 bucket (`encrypt = true`).
* Enable native S3 state locking (`use_lockfile = true` in Terraform $\ge 1.10$ / OpenTofu) or a DynamoDB lock table to prevent concurrent state corruption.
* Maintain completely separate state files (and ideally separate AWS accounts via AWS Organizations) for `staging` and `production`.

### 9.3 FinOps & Governance Tagging Strategy `[MANDATORY]`
Configure provider-level `default_tags` on the AWS provider so every single provisioned resource automatically inherits governance metadata:
```hcl
provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project            = var.project_name
      Environment        = var.environment       # staging | production
      ManagedBy          = "Terraform"
      Repository         = var.git_repository
      DataClassification = var.data_classification
    }
  }
}
```

### 9.4 Static Analysis & Policy-as-Code Gates `[MANDATORY]`
Every pull request modifying `infra/` must pass automated static verification before `terraform plan`:
* `terraform fmt -check -recursive`
* `terraform validate`
* `tflint` (AWS ruleset plugin enabled)
* `trivy config ./infra` or `checkov -d ./infra` (Blocks public S3 buckets, unencrypted storage, wildcard IAM policies, and open security groups before deployment).

---

## 10. Database Migrations & CI/CD Delivery Pipeline

### 10.1 Safe Database Migration Pattern in ECS `[MANDATORY]`
**Anti-Pattern (Forbidden)**: Running `prisma migrate deploy` or `alembic upgrade head` inside the container's `CMD` before starting the web server. When 10 ECS tasks launch simultaneously, they race against the database, causing lock contention or failed boots.
* **Mandatory Production Pattern (Isolated One-Off ECS `RunTask`)**:
  1. CI/CD builds and pushes the new Docker image (`git-sha-xyz`) to ECR.
  2. CI/CD registers the new ECS Task Definition revision.
  3. Before updating the ECS Service, CI/CD triggers a standalone **`aws ecs run-task`** using the new image inside the Private Subnets (`sg-ecs-tasks`) overriding the command to execute the migration script (`["node", "dist/migrate.js"]`).
  4. CI/CD waits (`aws ecs wait tasks-stopped`) and verifies the exit code of the migration container is `0`.
  5. Only after the migration succeeds does CI/CD trigger the rolling deployment of the ECS Web Service.
  * *Note*: All schema changes must follow the **Expand-and-Contract** backward-compatible pattern so the currently running `v1` tasks do not crash while `v2` migrations apply.

### 10.2 End-to-End CI/CD Pipeline Architecture `[MANDATORY]`
```
[Git Push / PR]
   │
   ├─► 1. Code Quality Gate: Lint, Typecheck, Unit Tests, Secret Scan (Gitleaks)
   ├─► 2. IaC Gate: terraform validate, tflint, trivy config
   ├─► 3. Build & Hardening Gate:
   │      ├─ Multi-Stage BuildKit Image Build (linux/arm64)
   │      ├─ Container Vulnerability Scan (Trivy HIGH/CRITICAL gate)
   │      └─ SBOM Generation (Syft) & Push Immutable SHA Tag to Amazon ECR
   ├─► 4. Staging Deployment:
   │      ├─ Terraform Apply (Staging)
   │      ├─ ECS RunTask (Database Migrations)
   │      ├─ ECS Service Update + Wait for Service Stability
   │      └─ Automated E2E / Smoke Tests against Staging URL
   └─► 5. Production Deployment (Protected Environment):
          ├─ Terraform Apply (Production)
          ├─ ECS RunTask (Database Migrations)
          └─ ECS Rolling / Blue-Green Update + Circuit Breaker Verification
```

---

## 11. Observability, Structured Logging, Tracing & Alerting

### 11.1 Structured JSON Logging `[MANDATORY]`
* Applications must write logs exclusively to `stdout` and `stderr` as single-line **structured JSON** (using libraries like `pino` for Node.js, `structlog` for Python, `slog`/`zap` for Go, `tracing` for Rust).
* Every log entry must include: `timestamp` (ISO-8601), `level`, `message`, `service`, `environment`, `trace_id`, `span_id`, and `request_id`.
* **PII Redaction**: Automatically redact `Authorization` headers, cookies, passwords, tokens, and credit card/SSN fields at the logger serializer layer.
* **CloudWatch Log Group Hygiene**: Encrypt Log Groups with KMS and set explicit `retention_in_days` (e.g., `14` days for staging, `30` to `90` days for production, archiving older logs to S3 Glacier via Subscription Filters). Never leave CloudWatch Log Groups set to "Never Expire".

### 11.2 Distributed Tracing (OpenTelemetry) `[MANDATORY]`
* Instrument the application using the vendor-neutral **OpenTelemetry (OTel) SDK** for HTTP ingress/egress, database queries, and Redis operations.
* Propagate W3C `traceparent` headers and AWS `X-Amzn-Trace-Id` headers from ALB through ECS tasks to downstream microservices.
* Export traces via the lightweight **AWS Distro for OpenTelemetry (ADOT)** sidecar container (or direct OTLP exporter) to AWS X-Ray / Grafana Tempo / Datadog.

### 11.3 Actionable Alerting & SLO Monitoring `[MANDATORY]`
Provision automated CloudWatch Metric Alarms routed via Amazon SNS to Slack/PagerDuty/Email for the "Four Golden Signals":
1. **Availability (Errors)**:
   * ALB `HTTPCode_ELB_5XX_Count` $> 5$ in $1\text{ minute}$.
   * ALB `HTTPCode_Target_5XX_Count` $> 1\%$ of total requests over $5\text{ minutes}$.
   * ALB `UnHealthyHostCount` $\ge 1$ for $3\text{ minutes}$.
2. **Latency**:
   * ALB `TargetResponseTime` $p95 > 500\text{ ms}$ or $p99 > 1500\text{ ms}$ over $5\text{ minutes}$.
3. **Saturation**:
   * ECS CPU or Memory Utilization $> 85\%$ sustained for $10\text{ minutes}$.
   * RDS CPU $> 80\%$, Freeable Memory $< 15\%$, or Database Connections $> 80\%$ of max capacity.

### 11.4 Controlled Production Debugging (ECS Exec) `[MANDATORY]`
* Because containers have no SSH daemon and often no shell (or minimal shell), configure **ECS Exec** (`enable_execute_command = true` in staging; conditional/audit-locked in production).
* All ECS Exec sessions must be encrypted via KMS and logged in real time to both a dedicated CloudWatch Log Group and an S3 audit bucket.

---

## 12. Problem Statement (`[ACCORDING TO PS]`) Decision Matrix

When Antigravity analyzes a specific Problem Statement (PS), it must use the following matrix to resolve all `[ACCORDING TO PS]` architectural variables while keeping all `[MANDATORY]` foundations intact:

| Architectural Dimension | Problem Statement Trigger / Condition | Prescribed Implementation Choice |
| :--- | :--- | :--- |
| **Base Container OS** | Pure Go, Rust, Java, or standard Node.js/Python web service | **Google Distroless** (`gcr.io/distroless/*:nonroot`) or **Chainguard** |
| **Base Container OS** | Native C++ addons, Prisma, Sharp image processing, PyTorch, Headless Chromium | **Debian Bookworm Slim** (`*-bookworm-slim`) pinned by SHA256 |
| **Frontend & Theme Delivery** | Static SPA (Vite/React) or Design/Theme-heavy Marketing Portal | **S3 + CloudFront OAC** for UI bundle; ECS Fargate exclusively for Backend API |
| **Frontend & Theme Delivery** | Dynamic SSR / ISR / SEO-critical App (Next.js App Router, Nuxt, Remix) | **ECS Fargate running Node.js SSR server** behind ALB + CloudFront caching static `/_next/static/*` assets |
| **Primary Database** | Complex relational schemas, ACID transactions, financial ledgers, vector search (`pgvector`) | **Amazon Aurora PostgreSQL** (Serverless v2 or Provisioned Multi-AZ) |
| **Primary Database** | Extreme scale key-value lookups, IoT telemetry, predictable single-table access patterns | **Amazon DynamoDB** (On-Demand or Provisioned Auto-Scaling + Point-in-Time Recovery) |
| **Caching & Queues** | Sub-millisecond caching, distributed rate limiting, WebSocket pub/sub, background job queues | **Amazon ElastiCache for Valkey** + **Amazon SQS** (with Dead-Letter Queue) |
| **Shared File Storage** | Stateless API handling user uploads (avatars, documents, media) | **Amazon S3** with Presigned URLs (No EFS needed) |
| **Shared File Storage** | Legacy POSIX shared filesystem requirement across multiple containers | **Amazon EFS** mounted via ECS `efsVolumeConfiguration` with IAM Auth & TLS |
| **Service-to-Service Comms** | Monolith or Modular Monolith (1--2 ECS services) | Single **Public ALB** routing path/host rules to Target Groups |
| **Service-to-Service Comms** | Polyglot Microservices Architecture ($\ge 3$ internal services) | **AWS ECS Service Connect** or **AWS VPC Lattice** with mTLS/IAM auth |
| **Deployment Strategy** | Standard web application requiring fast, safe rollouts | **ECS Rolling Update** (`100%/200%`) with **Deployment Circuit Breaker** |
| **Deployment Strategy** | High-risk financial/healthcare system requiring canary traffic shifting | **ECS Blue/Green Deployment** via **AWS CodeDeploy** |
| **WAF Bot Control** | Public e-commerce, ticketing, or credential-stuffing target | Enable `AWSManagedRulesBotControlRuleSet` + `AWSManagedRulesATPRuleSet` |
| **Disaster Recovery** | Standard SaaS ($RTO < 2\text{ hrs}$, $RPO < 5\text{ mins}$) | **Multi-AZ Single Region** + Cross-Region Automated RDS/S3 Backups |
| **Disaster Recovery** | Mission-Critical Enterprise ($RTO < 5\text{ mins}$, $RPO \approx 0$) | **Multi-Region Active-Active** or **Aurora Global Database** + ECR Cross-Region Replication + Route 53 Failover Routing |

---

## 13. Pre-Production Verification Checklist (Antigravity Quality Gate)

Before marking any Docker & AWS infrastructure implementation complete, verify every item below:

- [ ] **Dockerfile**: Multi-stage build used; base image pinned by SHA256; runs as non-root user (`UID > 10000`); `initProcessEnabled: true`; zero secrets in `ENV`/`ARG` or image layers.
- [ ] **Runtime Hardening**: `readonlyRootFilesystem: true` enabled with scoped `tmpfs` mounts (`/tmp`); Linux capabilities dropped (`DROP: ALL`); `SIGTERM` graceful shutdown handler implemented.
- [ ] **Local Parity**: `docker-compose.yml` uses `condition: service_healthy`, emulates dependencies, and boots cleanly with `docker compose up --build`.
- [ ] **ECR**: `IMMUTABLE` tags enforced; KMS encryption enabled; lifecycle retention policy attached; Enhanced Scanning enabled.
- [ ] **VPC**: 3 AZs configured with Public, Private (Compute), and Isolated (Data) subnets; S3 & DynamoDB Gateway Endpoints attached; Security Group chaining enforced (`CloudFront Prefix List -> ALB SG -> ECS SG -> DB SG`).
- [ ] **ECS Fargate**: `ARM64` Graviton enabled; `min_capacity >= 2` in production; CPU, Memory, and RequestCount auto-scaling configured; Deployment Circuit Breaker with auto-rollback enabled.
- [ ] **Edge & TLS**: Route 53 Alias (`A` & `AAAA`) + CAA + DNSSEC; ACM TLS 1.3 certificates; CloudFront OAC for S3 and custom secret header (`X-Origin-Verify`) for ALB; Response Security Headers policy and AWS WAFv2 attached.
- [ ] **Data & Secrets**: RDS/ElastiCache in Isolated subnets with KMS encryption and Multi-AZ; separate `executionRoleArn` and `taskRoleArn` with least privilege; secrets injected via Secrets Manager/SSM; DB migrations executed via isolated pre-deploy `ecs run-task`.
- [ ] **IaC & Observability**: Remote encrypted/locked Terraform state; `default_tags` configured; JSON structured logs with finite CloudWatch retention; OpenTelemetry tracing and CloudWatch 5xx/Latency/Saturation alarms active.