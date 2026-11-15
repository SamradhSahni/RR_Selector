---
name: tdd-visual-verification
description: Use this skill when verifying features, bug fixes, and UI flows. Enforces Test-Driven Development (TDD), automated integration testing, and live Playwright/Chrome DevTools visual, console, and network error verification.
---

# TDD & Visual Verification Playbook

## 1. Test-Driven Development Protocol
1. **Red Stage:** Write failing unit/integration tests establishing the expected contract or behavior.
2. **Green Stage:** Write minimal implementation code satisfying the test suite.
3. **Refactor Stage:** Clean code, optimize execution time, and eliminate duplication while tests stay green.

## 2. Automated Visual & Runtime DOM Verification [MANDATORY]
Before marking any UI task complete:
- Launch and inspect the running route using Playwright / Chrome DevTools MCP.
- Assert zero unhandled exceptions, zero `console.error` logs, and zero failed network requests (4xx/5xx).
- Capture screenshots at Desktop (1440x900) and Mobile (390x844) viewports to verify alignment, contrast, and layout integrity.
