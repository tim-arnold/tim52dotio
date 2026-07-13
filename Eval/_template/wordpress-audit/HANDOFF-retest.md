# WordPress Retest Audit — Round {{RETEST_NUMBER}}

## Context

You are conducting WordPress retest #{{RETEST_NUMBER}} for the client described in `../../CLAUDE.md`. Started: {{RETEST_DATE}}.

Read `../../CLAUDE.md` first for the local site path and CMS/hosting details. Then read the original inventory in `../data/wordpress-inventory.md` and report in `../reports/wordpress-audit-report.md` to understand what was documented before and what was flagged for migration or cleanup.

The goal is to re-survey the same filesystem areas, diff against the baseline inventory, and confirm whether flagged items (dev plugins, DB-only data, hardcoded credentials, legacy code) were addressed — or whether new ones appeared.

**Source:** Filesystem analysis of the local site copy at the path in `../../CLAUDE.md`. This is a read-only audit — do not modify any files.

If no local path is available, note that the audit is filesystem-limited and flag what could not be reassessed without DB or admin access.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call or file read made in this session. Full rules are in `../../CLAUDE.md`.

- Did not check it in this session? Do not write it.
- Could not access it? Write "Not collected — [reason]". Never estimate or infer from the baseline.
- Open the data file with a Data Sources table before writing any findings.

## Deliverables

- `data/wordpress-inventory.md` — re-surveyed inventory, same structure as baseline
- `reports/00-comparison.md` — delta summary against the baseline inventory/report
- `reports/wordpress-audit-report.md` — full standalone report, same structure as the original

---

## Step 1: Re-survey the Same Areas

Cover the same categories as the original audit — see `../HANDOFF.md` for full detail on what each covers:

### 1. Theme Architecture
Re-check the active theme, templating engine, and template hierarchy. Note any changes since baseline (new child theme, templating engine swap, etc.).

### 2. Content Model
Re-list CPTs, taxonomies, ACF field groups (or other field plugins), and any page builder layouts. Diff against baseline: new/removed CPTs or taxonomies, field group changes, new flexible-content layouts.

### 3. Plugin Inventory
Re-list active plugins. Flag: plugins added since baseline, plugins removed, version changes for form/redirect/SEO plugins. Confirm whether dev/staging plugins flagged in the baseline's "What to Drop" section were actually removed.

### 4. Custom Functionality
Re-review `functions.php` and `inc/`. Confirm whether hardcoded credentials flagged in the baseline were rotated/removed. Note any new custom queries, rewrites, or API integrations.

### 5. Media
Re-check custom image sizes and approximate `wp-content/uploads/` size if accessible. Note significant growth or changes to media handling.

### 6. What to Drop
Confirm status of every item in the baseline's "What to Drop" list — removed, still present, or partially addressed.

---

## Step 2: Write the Reports

### Report 1: Comparison (`reports/00-comparison.md`)

This is the most important deliverable. Structure it as a delta report.

**Lead with an executive summary**: 3-5 bullets on the most significant changes (positive and negative).

Then cover:

- **Migration checklist status** — for each baseline checklist item, mark done / not done / partial
- **Plugins** — added, removed, or upgraded since baseline
- **Content model changes** — new/removed CPTs, taxonomies, field groups
- **Custom functionality changes** — flagged credentials/hooks resolved or still present
- **What to Drop follow-through** — which flagged items were actually removed
- **New issues** — anything surfaced in this retest that wasn't in the baseline

Use a table: `Item | Baseline Status | Retest {{RETEST_NUMBER}} Status | Notes`. Use ▲ / ▼ / → to indicate improved / regressed / unchanged where applicable.

### Report 2: WordPress Audit Report (`reports/wordpress-audit-report.md`)

Same structure as the original `wordpress-audit-report.md`. Write this as a standalone document — do not assume the reader has seen the original. Call out explicitly where things have changed vs. the baseline.

---

## Formatting Notes

- Use markdown tables for all structured data (CPTs, taxonomies, field groups, plugins)
- Executive summary: 6-8 bullets covering the most important things the dev team must know
- Be specific: file paths, line numbers, plugin names and versions where available
- Keep reports factual — data and findings, no filler
