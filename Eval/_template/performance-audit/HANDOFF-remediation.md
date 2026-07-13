# Performance Audit

## Context

You are conducting a performance audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL, platform, CMS, and any relevant context.

The goal is to assess the site's current performance, identify the most impactful bottlenecks, and produce a prioritized, honest roadmap of fixes. The site is not being rebuilt; all recommendations must be actionable against the existing codebase and hosting setup.

**Do NOT modify any files.** Read and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/performance-baseline.md` — raw metrics: PageSpeed scores, Core Web Vitals (field + lab), asset inventory, identified issues
- `reports/performance-audit-report.md` — full report: executive summary, what's working, key issues, tradeoffs, phased roadmap, score expectations

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
- Any frontend optimization plugins installed — are they active and compatible with the host?

---

## What to Cover in the Report

### Architecture of the Problem

Explain **why** the scores look the way they do. Distinguish:
- **Field data** (real users, CDN-cached, fast connections) — what most visitors actually experience
- **Lab data** (first-time visitor, slow 4G, emulated mobile) — what the worst-case experience looks like
- Where the gap comes from (CDN cache vs. uncached requests; mobile vs. desktop)

### What's Working Well

Call out genuine strengths before jumping to problems. (Fast TTFB, working CDN, zero CLS, etc.)

### Key Issues

For each issue, cover:
- **What the problem is** (with specific evidence — script names, file sizes, metric values)
- **What we can directly change** (theme code, plugin config, hosting config)
- **What we have limited control over** (third-party scripts, platform constraints)
- **Estimated impact** on score or specific metrics

Common issue categories to investigate:
- Missing frontend optimization layer (minification, deferral, critical CSS)
- Excessive or globally-loaded JavaScript (animation libraries, carousels, reCAPTCHA)
- Render-blocking CSS
- Unoptimized images (no lazy loading, no WebP/AVIF, oversized)
- Font loading strategy (`font-display`, number of weights, preloading)
- Missing resource hints (preconnect, dns-prefetch)
- Third-party script governance (GTM, ads, popups, monitoring)

### Tradeoffs & Risks

Be honest about what each fix costs:
- Deferring JS may cause animation flashes or brief non-interactive periods
- Font-display: swap causes FOUT (flash of unstyled text)
- Optimization plugins add a caching layer that can confuse editors
- Image compression reduces file size but may affect quality for high-end photography
- Conditional script loading requires ongoing maintenance as content changes

**Client decisions needed:** flag anywhere a design or UX tradeoff requires client sign-off before proceeding.

### Phased Roadmap

Group fixes into phases by effort and impact:

**Phase 1 — Quick Wins** (theme code changes only, no plugin installs)
**Phase 2 — Plugin & Infrastructure** (optimization plugin, image conversion)
**Phase 3 — Conditional Loading** (enqueue scripts/styles only when needed)
**Phase 4 — Third-Party Governance** (limited by plugin constraints; ongoing)

For each task: Type (theme code / plugin config / hosting config), Effort (Low/Medium/High), Impact (Low/Medium/High).

### Score Expectations

Set realistic targets grounded in industry benchmarks. Reference the HTTP Archive Web Almanac median for the CMS in use. Be honest about ceiling effects from third-party scripts and platform constraints. Give a realistic target range after each phase.

---

## Formatting Notes

- Use markdown tables for all metrics, asset inventories, and roadmap tasks
- Executive summary: 5–8 bullets covering the core problem and biggest opportunities
- Be specific: name the scripts, quote the metric values, cite the Lighthouse version
- The audience is a dev team — focus on what's actionable, not what's theoretically ideal
- Include a "Target Outcomes" table showing projected metric improvements by phase
