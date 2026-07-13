# Analytics Pre-Redesign Audit

## Context

You are conducting an analytics audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL and a pointer to `.env.local` for the GA4 Property ID.

The goal is to establish a complete analytics baseline before the site rebuild begins. This audit serves two purposes:
1. **Preservation** — identify high-value URLs and conversion flows that must survive the redesign intact
2. **Data quality** — document tracking problems so they can be fixed during the rebuild rather than carried forward

**Do NOT modify any GA4 property settings or data.** Read and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/analytics-raw.md` — raw data collected from GA4
- `reports/analytics-audit-report.md` — structured report with URL preservation list, data quality assessment, and pre-redesign risk register

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

### c) Top pages by sessions — URL preservation list (12 months)
`run_report` — dimensions: `pagePath`; metrics: `sessions`, `bounceRate`, `averageSessionDuration`, `conversions`. Limit **50**, sorted by sessions descending. This is the primary input to the redirect planning.

### d) Top landing pages (12 months)
`run_report` — dimensions: `landingPage`; metrics: `sessions`, `bounceRate`, `averageSessionDuration`, `conversions`. Limit 50, sorted by sessions descending.

### e) Device breakdown
`run_report` — dimensions: `deviceCategory`; metrics: `sessions`, `bounceRate`, `conversions`.

### f) Monthly traffic trend (24 months)
`run_report` — dimensions: `yearMonth`; metrics: `sessions`, `newUsers`. Date range: last 24 months. This is the baseline the rebuild must maintain.

### g) Top exit pages
`run_report` — dimensions: `pagePath`; metrics: `sessions`, `bounceRate`. Limit 20, sorted by `bounceRate` descending. Note: `exitRate` is not a valid GA4 Data API metric — use `bounceRate` as a proxy for pages where users disengage.

### h) Conversion events and funnel
`run_report` — dimensions: `eventName`; metrics: `eventCount`, `conversions`. Filter to events where `isConversionEvent = true`. Also pull all events by name (no filter) to see what's being tracked.

Document the conversion funnel: what are the key user journeys from landing to conversion? What events mark each stage? The rebuild team needs this to reimplement tracking correctly.

### i) Geographic distribution (top 10 countries)
`run_report` — dimensions: `country`; metrics: `sessions`, `conversions`.

---

## Step 3: Data Quality Assessment

For each item below, determine Pass / Fail / Unknown and document your evidence. Problems found here should be **fixed during the rebuild** — not carried forward to the new site.

| Check | How to Assess |
|---|---|
| **Duplicate tracking** | Compare event counts to session counts — if page_view events are roughly 2× sessions on most pages, tracking may be firing twice. Check property details for multiple data streams. |
| **Internal traffic not excluded** | Review if a data filter exists for internal IPs (visible in property details). If absent, flag as likely inflated. |
| **Bot/spam traffic** | Look for sessions with `engagedSessions = 0` at scale, or geographic concentrations that don't match the client's known audience. |
| **Cross-domain / subdomain tracking** | If the client has subdomains, check if traffic from those subdomains appears as "direct" — a sign that cross-domain tracking is broken. The rebuild is an opportunity to fix this. |
| **Missing conversion events** | Check whether high-intent actions are tracked as conversions: form submissions, contact/inquiry clicks, phone clicks, newsletter signups. Flag any that appear absent. |
| **UTM parameter gaps** | If "direct" traffic exceeds ~40% of sessions, significant UTM leakage is likely. |
| **Search Console linked** | Check property details. If absent, organic keyword data is unavailable in GA4. |
| **Google Ads linked** | Check property details. If the client runs paid search, note for reconnection after launch. |
| **Data retention period** | Note the retention setting. If set to 2 months (default), pull an export before the rebuild migration so historical data isn't lost. |

---

## Step 4: SEO Correlation

*Only run this step if `../seo-audit/reports/` contains reports.*

Cross-reference GA4 data with SEO findings to sharpen the URL preservation priorities:

1. **Organic traffic vs. keyword rankings** — Take the top 10–15 organic landing pages from GA4. Look up each URL in `../seo-audit/data/baseline-data.md`. Pages with both strong keyword rankings AND meaningful organic sessions are the highest-priority redirects.

2. **Bounce rate vs. page performance** — For the top organic landing pages, cross-reference bounce rate (GA4) with page weight and Lighthouse scores (SEO technical baseline). The rebuild should address these performance issues — flag them as "fix in rebuild, not with redirect."

3. **Traffic but no conversions** — Pages with meaningful sessions but zero conversions may be missing CTAs. Flag for the rebuild team to address in the new design.

4. **Pages with SEO value but low traffic** — Pages that rank for keywords but get low sessions may have tracking gaps or intent mismatches. Confirm they're worth preserving with a 1:1 redirect.

Build a URL priority table (feeds directly into the redirect map):

| URL | Sessions | Conversions | Keyword Rankings | SEO Issues | Redirect Priority |
|---|---|---|---|---|---|
| /example | 1,200 | 8 | Rank 4, "dc agency" | Missing meta | High |

---

## Step 5: Write the Report

Save to `reports/analytics-audit-report.md`.

### Structure

**Executive Summary** — 5–7 bullets. Lead with: data quality posture, pre-redesign risks, top URLs to preserve, and any conversion tracking gaps.

**1. Property Configuration**
Table: Property ID | Data retention | Time zone | Search Console linked | Google Ads linked | Custom dimensions count

**2. URL Preservation Priority List**
This is a key deliverable — it feeds directly into redirect planning.

Table of top 50 pages sorted by sessions, with columns:
| URL | Sessions (12mo) | Conversions | Keyword Rankings | Redirect Priority (High/Med/Low) | Notes |

Flag High priority: any page with >100 sessions OR >1 conversion OR confirmed keyword ranking.

**3. Data Quality Assessment**
Table: Check | Status (Pass/Fail/Unknown) | Evidence | Fix in Rebuild (what the new implementation should do differently)

**4. Traffic Overview**
- Channel breakdown table
- Device mix table
- Traffic trend: summarize 24-month pattern — what baseline must the new site maintain?

**5. Conversion Tracking**
- Current conversion events: table (event name, count, what it represents)
- Conversion funnel documentation: describe the user journey from entry to conversion — what events mark each stage
- Gaps: actions that should be tracked but aren't — spec out what the rebuild should implement
- Reconnection checklist: what needs to be re-linked after launch (Search Console, Google Ads, etc.)

**6. SEO Correlation** *(omit if no SEO audit)*
- URL priority table (from Step 4)
- Narrative: 3–5 headline findings

**7. Pre-Redesign Risks**
Risks the rebuild team must account for — organized by tier:

**Critical** — if not addressed, will cause immediate data loss or traffic drop post-launch (e.g., GA4 property not reconnected, redirects missing for high-traffic pages, conversion events not reimplemented)
**High** — will degrade analytics quality or SEO if not fixed (e.g., cross-domain tracking not rebuilt, UTM leakage persists)
**Medium** — improvements the rebuild should make but won't cause immediate harm if deferred (e.g., internal traffic filter, data retention setting)

For each risk: What | Impact | How to Mitigate in Rebuild | Effort

---

## Formatting Notes

- Use markdown tables throughout
- Reference specific page URLs, event names, and metric values — no vague language
- Where GA4 data is incomplete or ambiguous, say so explicitly and note what additional access or information would resolve it
- Audience is the rebuild team — frame findings as "what must survive the launch" and "what to fix in the new implementation"

---

## BigQuery (Optional)

If the client has GA4 → BigQuery export enabled (check property details for a linked BigQuery project), BigQuery can supplement this audit for:
- Longer historical analysis than GA4's data retention allows (critical if retention is set to 2 months)
- Session-level path analysis and funnel reconstruction to document conversion flows
- Custom queries on raw event data for more granular URL performance data

If BigQuery is available, use the BigQuery MCP for these deeper queries and note the findings separately in `data/analytics-raw.md`.
