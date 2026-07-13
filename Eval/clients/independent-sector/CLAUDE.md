# Independent Sector — Remediation Audit

## Project

Remediation audit for **https://independentsector.org**. The goal is to identify and prioritize issues to fix on the existing site — no rebuild is planned.

## Client

- **Name:** Independent Sector
- **Public URL:** https://independentsector.org
- **Previous domain:** N/A
- **CMS:** WordPress
- **Hosting:** WP Engine
- **Local site path:** N/A

## Audit Status

- SEO audit: planned
- Technology audit: planned
- Accessibility audit: planned
- Analytics audit: planned
- Security audit: done
- Performance audit: planned
- WordPress audit: planned

## Tools Available

- **DataForSEO MCP** (`dfs-mcp`): SERP data, keyword volumes, on-page audits, Lighthouse, backlinks, AI mentions
- **Playwright MCP**: browser automation for live page inspection
- **Google Analytics MCP**: GA4 data — traffic, behavior, conversions, data quality checks
- **Sanity MCP**: connected but not relevant to audit work

## Analytics Credentials

GA4 property ID and other non-public credentials are stored in `.env.local` in this directory (gitignored — not committed to the repo). Read that file at the start of any analytics audit work.

## Data Integrity

Every audit deliverable in this repo must be grounded in live tool calls. These rules are non-negotiable and apply to every audit type, every session.

**The core rule: if you did not call a tool for it in this session, do not write it.**

- **No training-data fill-ins.** Do not use knowledge from model training to supply metric values, version numbers, plugin names, script inventory, or any other factual claim. If the tool didn't return it, you don't have it.
- **No estimation or inference when data is missing.** If a tool fails, errors, or returns no data: write `Not collected — [tool name] returned [error / no data]` in the data file. Do not substitute a plausible-sounding value.
- **No ambiguous tool substitution.** If a HANDOFF names a specific tool, use that tool. Do not swap in a different tool that appears similar but produces incomparable data (e.g., DataForSEO `on_page_lighthouse` runs desktop Lighthouse — it is not a substitute for PageSpeed Insights mobile).
- **Every data file must open with a Data Sources table** before any findings. Format:

```markdown
## Data Sources

| Section | Tool Used | Date | Notes |
|---|---|---|---|
| [section name] | [exact tool name] | YYYY-MM-DD | [errors, gaps, or caveats] |
```

If a section could not be collected, include it in the table with "Not collected" and the reason. Do not omit it.

Reports may summarize and interpret data file contents. They must not introduce numbers or claims that do not appear in the data file.

---

## Conventions

- Each audit type lives in its own subdirectory: `seo-audit/`, `technology-audit/`, `accessibility-audit/`, `analytics-audit/`, `security-audit/`
- Within each audit: raw/structured data goes in `<audit>/data/`, final reports go in `<audit>/reports/`
- Use markdown tables for all data presentation
- Reports should be factual and actionable — the audience is a dev team doing a site rebuild
- **Report H1 titles must start with the report name, not the client name.** The web app sidebar strips everything after the em dash, so `# Technology Audit Report — Client Name` is correct; `# Client Name — Technology Audit Report` is not.

## Retesting

After a redesign or remediation, run `./add-retest.sh` from the repo root to scaffold a new retest. The script auto-increments the retest number and creates:

```
<audit-type>/
  retest-1/
    data/        ← re-collected raw data
    reports/     ← retest reports + comparison
    HANDOFF.md   ← retest instructions
```

Retest reports follow the same naming as baseline reports. The comparison report is always `reports/00-comparison.md` — it documents the delta between the baseline and this retest round, using ▲ / ▼ / → to indicate changes.

Multiple retests are supported: `retest-1/`, `retest-2/`, etc. The web app groups them under Initial / Retest 1 / Retest 2 sub-headers in the sidebar.
