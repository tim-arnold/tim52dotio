# Performance Audit

## Context

You are conducting a performance audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL, platform, CMS, and any relevant context.

The goal is to document the current site's performance baseline — scores, real-user metrics, and the biggest bottlenecks — so the rebuild team has a clear picture of what to improve on and what traps to avoid when replatforming.

**Do NOT modify any files.** Read and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/performance-baseline.md` — raw metrics: PageSpeed scores, Core Web Vitals (field + lab), asset inventory, identified issues
- `reports/performance-audit-report.md` — full report: executive summary, current state analysis, risk register for the rebuild, recommendations for the new stack

---

## Data Collection

### 1. Baseline Scores

Run **PageSpeed Insights mobile** (PSI) at [pagespeed.web.dev](https://pagespeed.web.dev/) or via the PageSpeed Insights API on:
- The homepage
- One high-traffic content page (blog post, campaign page, or product page)

**Do NOT use DataForSEO `on_page_lighthouse` for this step.** It runs desktop Lighthouse only — scores run 20–40 points higher than PSI mobile on the same page, making them incomparable to any future retest that uses PSI. Use `on_page_lighthouse` only for supplemental data: page weight, third-party script inventory, and optimization flags (see Step 4).

Collect for both **mobile** and **desktop**:
- Performance score
- Accessibility score
- Best Practices score
- SEO score

### 2. Core Web Vitals — Field Data

From the PageSpeed / CrUX report, extract **28-day field data (mobile)**:
- LCP (Largest Contentful Paint)
- INP (Interaction to Next Paint)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)

Note pass/fail against thresholds: LCP < 2.5s, INP < 200ms, CLS < 0.1, FCP < 1.8s, TTFB < 0.8s.

### 3. Core Web Vitals — Lab Data (Lighthouse)

From the Lighthouse report, extract **emulated mobile lab metrics**:
- FCP, LCP, TBT (Total Blocking Time), Speed Index, CLS

Note the Lighthouse version and device emulation used.

### 4. Asset & Script Inventory

From the Lighthouse report or browser DevTools (via Playwright if needed), identify:
- JS: all scripts loaded, their sizes, whether they're deferred/async
- CSS: all stylesheets loaded, whether any are render-blocking
- Fonts: how many font files, format, `font-display` setting
- Images: any flagged for missing lazy loading, wrong dimensions, no modern format
- Third-party scripts: each origin, purpose, whether sync or async

### 5. Caching & Infrastructure

Document:
- Hosting platform and CDN setup
- Whether full-page caching is active and functioning (check response headers: `X-Cache`, `Age`, `CF-Cache-Status`)
- Object/database caching (Redis, Memcached)
- Any performance-affecting plugins or server-side optimizations

---

## What to Cover in the Report

### Current State Summary

Explain **why** the scores look the way they do. Distinguish:
- **Field data** (real users, CDN-cached, fast connections) — what most visitors actually experience
- **Lab data** (first-time visitor, slow 4G, emulated mobile) — what the worst-case experience looks like

Document what's working well on the current site and what the new build should preserve or replicate.

### Key Performance Problems to Avoid in the Rebuild

For each issue on the current site, note:
- Whether it's a **platform/CMS artifact** (goes away automatically with a replatform)
- Whether it's a **pattern to avoid** (could recur on the new stack if not addressed)
- Whether it's a **third-party dependency** (will follow the site regardless of platform)

### New Stack Recommendations

Based on what's dragging performance on the current site, recommend:
- Hosting and CDN approach (edge rendering, static generation, CDN configuration)
- Image optimization strategy (format conversion, lazy loading, responsive images)
- Font loading strategy
- Third-party script governance (GTM, analytics, popups — how to load them without blocking)
- JavaScript bundle strategy (avoid loading globally what can be loaded conditionally)

### Performance Targets for the Rebuild

Set measurable targets for the new site:
- Minimum acceptable Lighthouse Performance score (mobile and desktop)
- Core Web Vitals pass/fail targets
- Any specific metrics tied to SEO or conversion goals

Reference the HTTP Archive Web Almanac median for the new CMS/framework in use as a benchmark.

---

## Formatting Notes

- Use markdown tables for all metrics, asset inventories, and issue lists
- Executive summary: 5–8 bullets covering the baseline and the most important rebuild guidance
- Be specific: name the scripts, quote the metric values, cite the Lighthouse version
- The audience is a dev team planning a rebuild — focus on what to replicate, what to avoid, and what targets to aim for
