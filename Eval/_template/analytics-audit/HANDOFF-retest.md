# Analytics Retest Audit — Round {{RETEST_NUMBER}}

## Context

You are conducting an analytics retest #{{RETEST_NUMBER}} for the client described in `../../CLAUDE.md`. Started: {{RETEST_DATE}}.

Read `../../CLAUDE.md` and `../../.env.local` (for the GA4 Property ID) before starting.

**Read all prior audit reports before running any checks.** This means:
- The original audit report in `../reports/`
- All prior retest reports in `../retest-*/reports/` (if any)

The goal is to confirm that previously recommended fixes were applied, identify regressions, and document new issues. Do not re-flag items already confirmed as resolved in a prior retest unless you have new evidence that the issue has returned.

**Do NOT modify any GA4 property settings or data.** Read and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

---

## ⚠️ API Reliability Warnings

Several checks cannot be verified through the GA4 Data API or Management API alone. Do not mark these as FAIL based solely on an API check returning no data — that absence is expected, not evidence of failure. Use the guidance below for each:

| Check | API Reliable? | How to Actually Verify |
|---|---|---|
| Internal traffic filter | **No** — Data Filters API does not expose IP-based filters or developer traffic filters in most configurations | Look for indirect evidence: is internal IP traffic visibly absent from sessions? If traffic volumes look plausible and no team-member IP clusters are visible, note "not detectable via API — cannot confirm or deny" rather than FAIL |
| Search Console linked | **No** — `get_property_details` does not return linked Search Console property | If organic search sessions are present with keyword attribution, that's evidence of linkage. Otherwise note "not verifiable via API" |
| Data retention period | **No** — `update_time` on the property does NOT change when data retention is updated | Note "not detectable via API — must be verified manually in GA4 Admin → Data Settings → Data Retention" |
| Duplicate events | **Yes** — event names and counts are accurate | Check event list for capitalized/lowercase pairs or GA4 standard vs custom duplicates |
| Conversion events configured | **Yes** — conversion event list is reliable | Cross-check against prior audit's recommended events |
| Custom dimensions | **Yes** — `get_custom_dimensions_and_metrics` is reliable | Compare to prior audit's recommendations |
| Legacy GA3 events | **Yes** — event names like `checkout_progress`, `set_checkout_option` are reliable signals | |
| UTM coverage / direct traffic % | **Yes** — channel breakdown is accurate | High direct % is evidence of poor UTM coverage |

**Rule:** If a prior audit marked an item as ✅ RESOLVED and you cannot verify it through the API, carry forward the resolved status with a note like "previously confirmed resolved — not re-verifiable via API." Only revert to FAIL if you see active evidence that the problem has returned (e.g., internal traffic appearing in sessions again, duplicate events re-introduced).

---

## Deliverables

- `data/retest-data.md` — raw data collected from GA4
- `reports/00-comparison.md` — delta summary: what improved, regressed, or stayed flat
- `reports/analytics-retest-report.md` — full updated analytics snapshot

---

## Step 1: Read Prior Audit Findings

Before collecting any data, read and note:

1. Every issue flagged in the original audit with its severity (Critical / High / Medium / Low)
2. Every item marked as ✅ RESOLVED in any prior retest — these carry forward unless evidence contradicts
3. Every item still marked FAIL or WARN — these are your primary retest targets

Build an explicit carry-forward table in `data/retest-data.md`:

| Issue | Last Known Status | Source | Re-verifiable via API? |
|---|---|---|---|

---

## Step 2: Re-collect the Same Data

Re-run the same GA4 queries from the original audit. Save raw output to `data/retest-data.md`. Use the same date ranges where possible to ensure fair comparison.

- `get_property_details` — property configuration, linked services
- `get_custom_dimensions_and_metrics` — custom dimensions/metrics
- Traffic by channel (last 12 months)
- Top landing pages (last 12 months, limit 50)
- Device breakdown
- Monthly traffic trend (last 24 months)
- Top exit pages
- All events with counts and conversion flags
- Geographic distribution

---

## Step 3: Re-run the Data Quality Assessment

For each check, apply the API reliability guidance above before assigning a status. Do not mark as FAIL unless you have actual evidence of failure.

| Check | Prior Status | Retest Status | Evidence | Notes |
|---|---|---|---|---|
| Duplicate tracking | | | | |
| Internal traffic excluded | | | | |
| Sanity Studio / admin paths excluded | | | | |
| Cross-domain / subdomain tracking | | | | |
| Missing conversion events | | | | |
| UTM parameter coverage | | | | |
| Search Console linked | | | | |
| Google Ads linked | | | | |
| Data retention period | | | | |
| Legacy GA3 / UA events | | | | |
| Custom dimensions for custom events | | | | |

---

## Step 4: Write the Reports

### Report 1: Comparison (`reports/00-comparison.md`)

Lead with an executive summary (3-5 bullets) on the most significant changes.

Then cover:

#### Data Quality
- Issues confirmed resolved (include how you verified, or note "confirmed in prior retest — carried forward")
- Issues still outstanding (with updated priority and any change in severity)
- New issues introduced since last audit/retest

#### Traffic Trends
- Sessions: before → after (use the same window as the original audit where possible; note if period differs)
- Channel mix changes
- Notable landing page gains/losses
- Conversion rate changes

#### Conversion Tracking
- Newly configured conversion events
- Events still missing or not marked
- Overall conversion volume change

#### Comparison table

| Metric | Baseline | Retest {{RETEST_NUMBER}} | Delta |
|---|---|---|---|

Use ▲ / ▼ / → for increase / decrease / no change.

---

### Report 2: Full Analytics Report (`reports/analytics-retest-report.md`)

Same structure as the original analytics audit report. Write as a standalone document — do not assume the reader has seen the original. Call out explicitly where things have changed vs. the prior audit.

For any item that was resolved but cannot be re-verified via API, include a note like:
> Confirmed resolved in Retest 1 (2026-MM-DD) — not re-verifiable via API. No evidence of regression detected.

---

## Formatting Notes

- Reference specific event names, page URLs, and metric values — never make claims without data
- Where data is ambiguous or API is unreliable for a specific check, say so explicitly rather than guessing
- Do not assume an issue is unresolved just because the API returns no evidence of the fix — the API often cannot see the fix
- Audience is a dev team or marketing ops person
