# Analytics Remediation Audit

## Context

You are conducting an analytics audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL and a pointer to `.env.local` for the GA4 Property ID.

The goal is to assess the quality of the existing analytics setup and produce an actionable remediation plan. The site is not being rebuilt — findings should be fixable on the current site.

**Do NOT modify any GA4 property settings or data.** Read and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/analytics-raw.md` — raw data collected from GA4
- `reports/analytics-audit-report.md` — structured report with executive summary and remediation checklist

---

## Prerequisites: Google Analytics MCP

Before running this audit, verify the Google Analytics MCP is connected: run `/mcp` in Claude Code and look for `analytics-mcp` with a green status.

**All clients share one GCP project and one service account** — do not create a new GCP project per client. The one-time machine setup (installing `analytics-mcp`, creating the service account, registering the MCP server) is documented in the root `README.md` under "Analytics Audit → Google Cloud project and service account." If `analytics-mcp` isn't connected, follow that section, not per-client project creation.

### Grant the service account access to this client's GA4 property

The client must add the **service account** as a **Viewer** on their GA4 property — not a personal email:

> GA4 Admin → Account Access Management (for all properties) **or** Property Access Management (for one property) → Add users → enter `analytics-mcp@analytics-mcp-502222.iam.gserviceaccount.com` → role: Viewer

Then confirm `analytics-mcp` shows connected via `/mcp` before proceeding.

---

## Step 1: Read Context

1. Read `../CLAUDE.md` — note the public URL and any relevant platform details.
2. Read `../.env.local` — extract `GA4_PROPERTY_ID`. If the file doesn't exist or the value is missing, note it and ask the user before proceeding.
3. Check whether an SEO audit has been run: look for `../seo-audit/reports/`. If reports exist, you will cross-reference them in Step 4.

---

## Step 2: Collect Data

Use the **Google Analytics MCP** with the GA4 Property ID. Run all queries in parallel where possible. Save all raw output to `data/analytics-raw.md`.

### a) Property metadata
Use `get_property_details` to get: data retention period, time zone, currency, linked services (Search Console, Google Ads). Use `get_custom_dimensions_and_metrics` to document any custom dimensions/metrics configured.

### b) Traffic by channel (12 months)
`run_report` — dimensions: `sessionDefaultChannelGroup`; metrics: `sessions`, `engagedSessions`, `bounceRate`, `conversions`. Date range: last 12 months.

### c) Top landing pages (12 months)
`run_report` — dimensions: `landingPage`; metrics: `sessions`, `bounceRate`, `averageSessionDuration`, `conversions`. Limit 50, sorted by sessions descending.

### d) Device breakdown
`run_report` — dimensions: `deviceCategory`; metrics: `sessions`, `bounceRate`, `conversions`.

### e) Monthly traffic trend (24 months)
`run_report` — dimensions: `yearMonth`; metrics: `sessions`, `newUsers`. Date range: last 24 months.

### f) Top exit pages
`run_report` — dimensions: `pagePath`; metrics: `sessions`, `exitRate`. Limit 20, sorted by `exitRate` descending.

### g) Conversion events
`run_report` — dimensions: `eventName`; metrics: `eventCount`, `conversions`. Filter to events where `isConversionEvent = true`. Also pull all events by name (no filter) to see what's being tracked vs. what's marked as a conversion.

### h) Geographic distribution (top 10 countries)
`run_report` — dimensions: `country`; metrics: `sessions`, `conversions`.

### i) Page-level engagement
`run_report` — dimensions: `pagePath`; metrics: `sessions`, `averageSessionDuration`, `bounceRate`, `conversions`. Limit 30, sorted by sessions descending.

---

## Step 3: Data Quality Assessment

For each item below, determine Pass / Fail / Unknown and document your evidence. Include in `data/analytics-raw.md` and summarize in the report.

| Check | How to Assess |
|---|---|
| **Duplicate tracking** | Compare event counts to session counts — if page_view events are roughly 2× sessions on most pages, tracking may be firing twice. Check property details for multiple data streams. |
| **Internal traffic not excluded** | Review if a data filter exists for internal IPs (visible in property details). If absent, flag as likely inflated. |
| **Bot/spam traffic** | Look for sessions with `engagedSessions = 0` at scale, or geographic concentrations that don't match the client's known audience. |
| **Cross-domain / subdomain tracking** | If the client has subdomains (check `../CLAUDE.md` and known URLs), check if traffic from those subdomains appears as "direct" in channel data — a sign that cross-domain tracking is broken. |
| **Missing conversion events** | Check whether high-intent actions are tracked as conversions: form submissions, contact/inquiry clicks, phone clicks, newsletter signups. Flag any that appear absent. |
| **UTM parameter gaps** | If "direct" traffic exceeds ~40% of sessions, significant UTM leakage is likely — emails, social posts, or ad campaigns arriving without tags, inflating direct. |
| **Search Console linked** | Check property details for Search Console linkage. If absent, organic keyword data is unavailable in GA4. |
| **Google Ads linked** | Check property details. If the client runs paid search, an unlinked Ads account means GA4 can't report on campaign performance. |
| **Data retention period** | Note the retention setting (default 2 months vs. 14 months). If set to 2 months, historical reporting is limited. |

---

## Step 4: SEO Correlation

*Only run this step if `../seo-audit/reports/` contains reports.*

Cross-reference GA4 data with SEO findings:

1. **Organic traffic vs. keyword rankings** — Take the top 10–15 organic landing pages from GA4. Look up each URL in `../seo-audit/data/baseline-data.md`. Do pages with strong keyword rankings match pages with high organic sessions? Flag any high-ranking pages with unexpectedly low traffic (possible tracking gap or intent mismatch).

2. **Bounce rate vs. page performance** — For the top organic landing pages, cross-reference bounce rate (GA4) with page weight and Lighthouse scores (SEO technical baseline). High bounce + slow page = performance is hurting retention. These are the highest-priority fixes.

3. **Traffic but no conversions** — Flag pages with meaningful session counts but zero conversions. These pages may be missing CTAs, or the conversions on them are not being tracked.

4. **On-page SEO gaps on high-traffic pages** — Pages with traffic that also have known issues (missing meta description, multiple H1s, missing alt text from SEO audit) are the quickest wins: fixing the SEO issue on a page that already gets traffic has immediate measurable impact.

Build a correlation table:

| Page | Organic Sessions | Bounce Rate | SEO Issues | Priority |
|---|---|---|---|---|
| /example | 1,200 | 72% | Missing meta, slow load | High |

---

## Step 5: Write the Report

Save to `reports/analytics-audit-report.md`.

### Structure

**Executive Summary** — 5–7 bullets. Lead with: data quality posture, most critical tracking problems, any traffic trend issues, and the top SEO correlation findings (if applicable).

**1. Property Configuration**
Table: Property ID | Data retention | Time zone | Search Console linked | Google Ads linked | Custom dimensions count

**2. Data Quality Assessment**
Table: Check | Status (Pass/Fail/Unknown) | Evidence | Recommended Fix

**3. Traffic Overview**
- Channel breakdown table (sessions, % of total, engaged sessions, conversions)
- Device mix table
- Top 10 landing pages table (sessions, bounce rate, avg session duration, conversions)
- Traffic trend: summarize 24-month pattern — growing, flat, or declining; any notable spikes or drops

**4. Conversion Tracking**
- Conversion events configured: table (event name, count, what it represents)
- Gaps: actions that should be tracked as conversions but aren't
- Recommendation: specific event names to set up as conversions

**5. SEO Correlation** *(omit if no SEO audit)*
- Correlation table (from Step 4)
- Narrative: 3–5 headline findings from the cross-reference

**6. Remediation Priorities**
Prioritized fix list — organize by tier:

**Critical (fix immediately)** — data integrity problems (duplicate tracking, missing conversion events, broken cross-domain tracking)
**High (fix soon)** — configuration gaps (no internal traffic filter, UTM leakage, Search Console unlinked)
**Medium (planned work)** — data retention settings, missing event parameters, naming inconsistencies
**Low (backlog)** — custom dimensions cleanup, segment configuration, dashboard improvements

For each item: What | Risk | Fix | Effort

---

## Formatting Notes

- Use markdown tables throughout
- Reference specific event names, page URLs, and metric values — no vague language
- Where GA4 data is incomplete or ambiguous, say so explicitly and note what additional access or information would resolve it
- Audience is a dev team or marketing ops person — be specific about what to change and where (GTM tag name, GA4 admin panel location, etc.)

---

## BigQuery (Optional)

If the client has GA4 → BigQuery export enabled (check property details for a linked BigQuery project), BigQuery can supplement this audit for:
- Longer historical analysis than GA4's data retention allows
- Session-level path analysis and funnel reconstruction
- Custom queries on raw event data (e.g., identifying specific broken UTM patterns)

If BigQuery is available, use the BigQuery MCP for these deeper queries and note the findings separately in `data/analytics-raw.md`.
