---
name: frontend-web-excellence
description: Use this skill when authoring web UI components, layouts, pages, and styling. Enforces Core Web Vitals budgets (LCP <= 2.5s, INP <= 200ms, CLS <= 0.1), WCAG 2.2 AA accessibility, responsive fluid layout integrity, and complete 4-state UI coverage.
---

# Frontend Web Excellence Playbook

## 1. Core Web Vitals & Performance
- **Budgets:** LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.
- **Image & Font Optimization:** Modern formats (AVIF/WebP), proper width/height attributes to prevent layout shifts, font `display: swap`.
- **Bundle Splitting:** Code-split route transitions, lazy load heavy 3D canvases and charts below the fold.

## 2. Layout & Responsive Integrity
- **Zero Horizontal Overflow:** Test seamlessly across mobile (320px-390px), tablet (768px-1024px), and desktop (1440px+).
- **Touch Target Sizing:** Minimum 44x44px clickable areas on touch devices.
- **Fluid Typography:** Employ modern `clamp()` functions for heading scales.

## 3. Complete 4-State UI Coverage [MANDATORY]
Every asynchronous UI container must deterministically handle:
1. **Loading State:** Skeleton screen matching exact final layout dimensions.
2. **Empty State:** High-clarity message with actionable next step / CTA.
3. **Error State:** Human-readable message with one-click retry trigger.
4. **Success State:** Optimistic feedback and clean rendered content.

## 4. Accessibility (WCAG 2.2 AA)
- Semantic HTML landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`).
- Visible focus rings (`:focus-visible`), aria-expanded, aria-labels for icon buttons.
- Contrast ratio >= 4.5:1 for body copy and 3:1 for large display text.
