# Performance Retest Audit — Round {{RETEST_NUMBER}}

## Context

You are conducting a performance retest #{{RETEST_NUMBER}} for the client described in `../../CLAUDE.md`. Started: {{RETEST_DATE}}.

Read `../../CLAUDE.md` first. Then read the original performance audit in `../reports/` to understand what was measured and what improvements were recommended.

The goal is to re-run the same tests on the same pages, compare scores directly, and assess whether remediation efforts improved performance.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/retest-data.md` — raw PSI and supplemental data
- `reports/00-comparison.md` — delta summary
- `reports/performance-retest-report.md` — full updated performance snapshot

---

## ⚠️ Tool Selection — This Matters

The original performance audit used **PageSpeed Insights mobile** (PSI). PSI mobile simulates a mid-range phone on slow 4G and is what produces the scores clients see and what Google uses for Core Web Vitals assessment.

**Do NOT use `on_page_lighthouse` from DataForSEO for score comparison.** That tool runs desktop Lighthouse — a completely different test environment. Desktop scores run 20–40 points higher than mobile PSI on the same page. Using it produces scores that cannot be compared to the baseline and renders the retest useless for its primary purpose.

---

## Step 1: Re-run the Same Tests

Test the same pages as the original audit.

### PageSpeed Insights — Mobile (Primary)

Ask the user to run PageSpeed Insights mobile on each page at [pagespeed.web.dev](https://pagespeed.web.dev/) or via the PageSpeed Insights API. Record for each page:

- Performance score
- LCP (field data, if available)
- INP (field data, if available)
- CLS (field data, if available)
- LCP (lab)
- TBT (lab)
- FCP (lab)

If the user cannot run PSI manually, note this clearly and do not substitute desktop Lighthouse. The retest cannot produce comparable scores without PSI mobile data.

### Supplemental — DataForSEO (Methodology-Agnostic)

These DataForSEO checks produce useful data regardless of the primary tool used:

- **`on_page_lighthouse`** — useful for page weight (`total-byte-weight`), third-party script inventory (entity list), and optimization flags (`unused-css-rules`, `unminified-css`, `unused-javascript`). Do not use scores for comparison.
- **`on_page_instant_pages`** — on-page SEO and technical issues. Note any new or resolved issues.

Run both on the same pages. Record page weight and optimization flags. Note any new third-party scripts not present in the baseline.

---

## Step 2: Map Against Original Findings

For every issue in the original performance audit:

| Issue | Original Value | Retest Value | Delta | Status |
|---|---|---|---|---|

Status: **Fixed** / **Improved** / **Unchanged** / **Regressed**

---

## Step 3: Write the Reports

### Report 1: Comparison (`reports/00-comparison.md`)

Lead with an executive summary (3-5 bullets).

Core Web Vitals comparison table (PSI mobile field data):
| Metric | Page | Baseline | Retest {{RETEST_NUMBER}} | Delta | Status |
|---|---|---|---|---|---|

Lighthouse scores comparison (PSI mobile lab):
| Score | Page | Baseline | Retest {{RETEST_NUMBER}} | Delta |
|---|---|---|---|---|

Then: issues resolved, issues still outstanding, new issues.

Use ▲ / ▼ / → for changes. Flag any regressions prominently.

---

### Report 2: Full Performance Report (`reports/performance-retest-report.md`)

Same structure as the original performance audit report. Write as a standalone document.

---

## Formatting Notes

- Always include specific metric values (e.g., LCP: 4.2s → 2.1s), not just scores
- Flag any Core Web Vitals that cross the pass/fail threshold in either direction
- Audience is a dev team — note what changed in the codebase that likely caused each shift
