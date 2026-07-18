# SEO Remediation Audit

## Context

You are conducting an SEO remediation audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL, CMS, and hosting details.

The goal is to identify and prioritize SEO issues to fix on the existing site. The site is not being rebuilt — this audit produces an action plan for remediation in place.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

Save all output to this directory:
- Raw data → `data/`
  - `data/baseline-data.md` — all tool outputs (domain overview, backlinks, on-page audits, Lighthouse, AI mentions, GSC)
  - `data/full-keyword-inventory.md` — complete ranked keyword list (1,000 rows from step 1b)
- Final reports → `reports/`

Produce three reports:

**`reports/01-technical-baseline.md`** — On-page and technical SEO health
**`reports/02-strategic-baseline.md`** — Keyword rankings, traffic, backlinks, AI presence
**`reports/03-remediation-priorities.md`** — Prioritized action list with effort/impact ratings

---

## Step 1: Collect Baseline Data

Run these DataForSEO tools. Do them in parallel where possible. Save raw output to `data/baseline-data.md`.

### a) Domain rank overview
Use `dataforseo_labs_google_domain_rank_overview` for the domain. Extract: total ranked keywords, estimated traffic value, top-performing pages.

### b) Top ranked keywords
Use `dataforseo_labs_google_ranked_keywords` with `limit: 100`, sorted by search volume descending. Then run again with `filters: [["ranked_serp_element.serp_item.rank_group","<=",10]]` to isolate top-10 rankings — these are highest-value pages to protect.

For a fuller picture, run again with `limit: 1000` and save the complete list to `data/full-keyword-inventory.md`.

### c) Backlink profile
Use `backlinks_summary` for the domain. Also run `backlinks_referring_domains` and `backlinks_anchors`. Extract: total backlinks, unique referring domains, TLD distribution (flag .edu and .gov), top anchor text, spam score.

Note: the `backlinks_backlinks` endpoint may require a higher API tier — if it returns an error, skip it and note what was unavailable.

### d) AI/LLM mentions
Use `ai_opt_llm_ment_top_domains` to check whether the domain appears in AI Overview / LLM responses, and `ai_opt_llm_ment_top_pages` to see which specific pages are cited and in what context. Note the queries where the site appears, what it's cited for, and any relevant queries where it should appear but doesn't.

### e) On-page audit of key pages
Use `on_page_instant_pages` on the homepage and the top 5-8 traffic-driving pages identified in steps 1a and 1b. For each, extract: title tag, meta description, H1, canonical URL, structured data present, page load issues, internal/external link counts.

### f) Lighthouse audit
Use `on_page_lighthouse` on the homepage and one representative content page. Extract: Core Web Vitals (LCP, CLS, INP/TBT), performance score, accessibility score, SEO score, Best Practices score.

### g) Google Search Console (if property is verified)
Use `mcp-gsc` → `get_search_analytics` for the property to pull actual impressions, clicks, CTR, and average position for the top queries. Also run `check_indexing_issues` to surface coverage errors, excluded pages, and crawl anomalies. This data is higher-signal than DataForSEO's estimated traffic — include it in `data/baseline-data.md` alongside the DataForSEO results. If the property is not verified or GSC access is unavailable, note "Not collected — GSC property not accessible" and continue.

### h) Competitor gap (optional)
If you can identify 2-3 peer organizations from the site content, use `dataforseo_labs_google_domain_intersection` to find keywords competitors rank for that this domain does not.

---

## Step 2: Write the Reports

### Report 1: Technical Baseline (`reports/01-technical-baseline.md`)

- Core Web Vitals (from Lighthouse) — flag any failing metrics
- On-page SEO audit results: title tags, meta descriptions, H1s, canonical issues
- Schema/structured data inventory — what types are present, any gaps
- Internal link structure summary
- Broken/404 pages (from backlink data or on-page audit)
- Mobile readiness
- Security and hosting setup

### Report 2: Strategic Baseline (`reports/02-strategic-baseline.md`)

- Current keyword rankings: summary table + link to full inventory
- Top traffic-driving pages (table: page URL, top keyword, estimated traffic)
- Backlink profile: referring domain count, TLD breakdown, notable high-authority links, anchor text distribution
- AI/LLM mention presence — where the site appears and notable gaps
- Competitor keyword gaps (if collected)
- SERP features: any featured snippets, knowledge panels, People Also Ask appearances

### Report 3: Remediation Priorities (`reports/03-remediation-priorities.md`)

This is the most important deliverable. Structure as a prioritized action list the client or dev team can work from directly.

Organize by priority tier:

**Priority 1 — Quick Wins** (high impact, low effort — fix first)
**Priority 2 — High Impact** (meaningful improvement, higher effort)
**Priority 3 — Ongoing** (process or content recommendations, no single fix)

For each issue include:
- What's wrong
- Why it matters (estimated traffic or ranking impact where possible)
- Recommended fix
- Effort estimate (hours / days / ongoing)

Cover these categories:

- **Technical fixes**: crawlability issues, indexation problems, Core Web Vitals failures, missing canonical tags, redirect chains, structured data gaps
- **On-page fixes**: weak or duplicate title tags, missing meta descriptions, H1 issues, thin content
- **Content opportunities**: keywords with ranking potential where content is missing or underperforming
- **AI visibility gaps**: queries where the site should be cited in AI Overviews or LLM responses but isn't — what content or authority improvements would help
- **Link profile**: any toxic backlinks to disavow; anchor text diversification
- **Known broken pages**: specific 404s or redirect errors to fix; any lingering old-domain issues

---

## Formatting Notes

- **Report header:** `Domain` → `Platform` → `Audit date` → `Data source`. No audit-specific extras for SEO reports. See `Eval/CLAUDE.md` Conventions for the full spec.
- Use markdown tables throughout
- Lead each report with a 3-5 bullet executive summary
- Keep reports factual — data and recommendations, no filler
- Reference specific URLs and numbers
- Audience is the client and/or their dev team — be specific about what to do, not just what's wrong
