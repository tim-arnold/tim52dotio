# SEO Retest Audit — Round {{RETEST_NUMBER}}

## Context

You are conducting SEO retest #{{RETEST_NUMBER}} for the client described in `../../CLAUDE.md`. Started: {{RETEST_DATE}}.

Read `../../CLAUDE.md` first for the public URL, CMS, and hosting details. Then read the original baseline reports in `../reports/` to understand what was measured before and what issues were flagged for remediation.

The goal is to re-run the same measurements from the initial audit, compare results, and assess whether the remediation or redesign improved things — or introduced new issues.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

Save all output to this directory:
- Raw data → `data/`
  - `data/retest-data.md` — all tool outputs (domain overview, backlinks, on-page audits, Lighthouse, AI mentions, GSC)
  - `data/full-keyword-inventory.md` — complete ranked keyword list (1,000 rows from step 1b)
- Final reports → `reports/`

Produce three reports:

**`reports/00-comparison.md`** — Delta summary: what improved, regressed, or stayed flat
**`reports/01-technical-baseline.md`** — Full technical snapshot (same structure as original)
**`reports/02-strategic-baseline.md`** — Full rankings/traffic/backlinks snapshot (same structure as original)

---

## Step 1: Re-collect the Same Data

Run the same DataForSEO tools as the original audit. Save raw output to `data/retest-data.md`.

### a) Domain rank overview
`dataforseo_labs_google_domain_rank_overview` — compare total ranked keywords and estimated traffic value against the baseline.

### b) Top ranked keywords
`dataforseo_labs_google_ranked_keywords` with `limit: 100`, sorted by search volume. Then again with `filters: [["ranked_serp_element.serp_item.rank_group","<=",10]]` for top-10 rankings.

Save the full list to `data/full-keyword-inventory.md`.

### c) Backlink profile
`backlinks_summary`, `backlinks_referring_domains`, `backlinks_anchors` — note any changes in referring domain count, new high-authority links, or lost links.

### d) AI/LLM mentions
`ai_opt_llm_ment_top_domains` and `ai_opt_llm_ment_top_pages` — note any new appearances or losses since the baseline, and any queries where citation context has changed.

### e) On-page audit of key pages
`on_page_instant_pages` on the same pages audited in the original run. Use the same set of URLs to ensure a fair comparison.

### f) Lighthouse audit
`on_page_lighthouse` on the same pages as the original. Compare Core Web Vitals scores directly.

### g) Google Search Console (if property is verified)
Re-run `mcp-gsc` → `get_search_analytics` and `check_indexing_issues` using the same parameters as the baseline. Compare impressions, clicks, CTR, position, and coverage errors directly. If the property was not accessible in the baseline, try again — access may have been granted since. Note availability either way.

---

## Step 2: Write the Reports

### Report 1: Comparison (`reports/00-comparison.md`)

This is the most important deliverable. Structure it as a delta report.

**Lead with an executive summary**: 3-5 bullets on the most significant changes (positive and negative).

Then cover each category:

#### Rankings & Traffic
- Total ranked keywords: before → after (delta)
- Top-10 rankings: before → after
- Estimated monthly traffic: before → after
- Notable keyword movements: gained top-10 / dropped out / new rankings

#### Technical Health
- Core Web Vitals: score/value for each metric, before → after
- Lighthouse scores (Performance, SEO, Accessibility, Best Practices): before → after
- Issues resolved from the original technical baseline
- New issues introduced

#### On-Page SEO
- Title tag / meta description fixes applied (list which pages improved)
- Any new on-page issues

#### Backlink Profile
- Referring domains: before → after
- Notable new links acquired
- Notable lost links (flag if high-authority)
- Any changes to the previous-domain redirect chain (critical for noble-reach-type clients)

#### AI/LLM Presence
- New queries where the site appears
- Queries where it dropped out

#### Outstanding Issues
- Items from the original remediation priorities that were NOT addressed — carry them forward with updated effort estimates
- New issues surfaced in this retest

---

### Report 2: Technical Baseline (`reports/01-technical-baseline.md`)

Same structure as the original `01-technical-baseline.md`. Write this as a standalone document — do not assume the reader has seen the original. Call out explicitly where things have changed vs. the baseline.

### Report 3: Strategic Baseline (`reports/02-strategic-baseline.md`)

Same structure as the original `02-strategic-baseline.md`. Write this as a standalone document.

---

## Formatting Notes

- Use markdown tables throughout
- In comparison tables, use columns: `Metric | Baseline | Retest {{RETEST_NUMBER}} | Delta`
- Use ▲ / ▼ / → for increase / decrease / no change in delta cells
- Keep reports factual — data and findings, no filler
- Audience is the client and/or their dev team
