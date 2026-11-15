---
name: database-migrations
description: Use this skill when designing, authoring, or applying database schemas, migrations, composite indexes, and analytical queries. Enforces zero-downtime expand/contract patterns, foreign key indexing, and EXPLAIN ANALYZE verification.
---

# Database Migrations & Performance Playbook

## 1. Zero-Downtime Migration Rules
- **Expand and Contract:** Always split breaking column/table renames into additive expansions, dual writes, backfills, and finally contracting drops.
- **Foreign Key Indexing:** Every foreign key column must have a matching index to prevent full-table locks during cascading checks or deletes.
- **Lock Timeouts:** Set strict session lock timeouts on DDL operations to prevent blocking incoming web traffic.

## 2. Query Optimization & Verification
- Run `EXPLAIN (ANALYZE, BUFFERS)` on analytical and joined queries to ensure index usage and eliminate sequential scans on large tables.
- Limit query batch sizes and enforce bounded pagination (`limit <= 100`).
