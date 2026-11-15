---
name: aws-deployment
description: Use this skill when authoring Infrastructure as Code (AWS CDK, Terraform, SST), configuring IAM policies, or deploying applications to AWS. Enforces least-privilege IAM, pre-deployment synthesis checks, rollback alarms, and cost guardrails.
---

# AWS Infrastructure & Safe Deployment Playbook

## 1. Pre-Deployment Verification Protocol
1. **Grounding via AWS MCP:** Query AWS knowledge and IaC MCP servers to verify quotas, regions, and construct props.
2. **Least-Privilege IAM:** Scope permissions to exact ARNs and use short-lived OIDC roles (zero hardcoded static keys).
3. **Network & Storage Hardening:** Place databases in isolated private subnets, block public S3 access, enable TLS 1.3 and KMS encryption.
4. **Zero-Downtime & Rollback Safety:** Canary/circuit-breaker deployments with health-check grace periods.
