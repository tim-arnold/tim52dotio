# Accessibility Retest Audit — Round {{RETEST_NUMBER}}

## Context

You are conducting an accessibility retest #{{RETEST_NUMBER}} for the client described in `../../CLAUDE.md`. Started: {{RETEST_DATE}}.

Read `../../CLAUDE.md` first. Then read the original findings and report in `../data/` and `../reports/` to understand what issues were flagged and what was recommended.

The goal is to re-audit the same pages and components, confirm that critical and major issues were addressed, and document any remaining or new issues.

**Do NOT modify any files** in the site installation or on the live site. Read and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/retest-findings.md` — updated findings
- `reports/00-comparison.md` — delta summary
- `reports/accessibility-retest-report.md` — full updated accessibility snapshot
- `screenshots/` — updated visual evidence

---

## Step 1: Re-audit the Same Scope

Test the same pages audited originally using both passes.

### Pass 1: Code-Level (Filesystem)
If a local site path is available in `../../CLAUDE.md`, re-check the same templates for:
- Heading hierarchy and landmark structure
- Image alt text (hardcoded and CMS-rendered)
- Form label associations
- Interactive element ARIA usage
- Focus styles and keyboard handlers
- Skip-to-content link
- `<html lang>` attribute
- Viewport meta tag

### Pass 2: Live Audit (Playwright)
Test the same pages as the original audit. For each:
1. Screenshot (`browser_take_screenshot`) → save to `screenshots/`
2. Accessibility tree snapshot (`browser_snapshot`)
3. Keyboard navigation pass — verify focus indicator visibility and logical order
4. Heading structure check
5. Landmark regions check
6. Image alt text check
7. Interactive elements (accordion, modal, tabs) — mouse and keyboard activation
8. Console errors

---

## Step 2: Map Against Original Findings

For every finding in the original `../data/accessibility-findings.md`:

| Finding ID | WCAG Criterion | Severity | Original Status | Retest Status | Notes |
|---|---|---|---|---|---|

Status options: **Fixed** / **Partially Fixed** / **Still Present** / **Regressed**

Note any new issues not present in the original audit.

---

## Step 3: Write the Reports

### Report 1: Comparison (`reports/00-comparison.md`)

Lead with an executive summary (3-5 bullets).

Then cover:

#### Issues Resolved
- List each finding that was fixed, with the WCAG criterion and what changed

#### Issues Still Present
- Carry forward unresolved issues with updated severity assessments

#### New Issues
- Any issues introduced since the original audit (e.g., new components, content changes)

#### WCAG Coverage Change
| Criterion | Original | Retest {{RETEST_NUMBER}} |
|---|---|---|

Use Pass / Fail / Partial / Not Tested.

---

### Report 2: Full Accessibility Report (`reports/accessibility-retest-report.md`)

Same structure as the original accessibility audit report. Write as a standalone document. Call out explicitly where things have changed vs. the baseline.

---

## Formatting Notes

- Include WCAG criterion numbers throughout
- Be specific: file paths, URLs, element selectors
- Use ▲ / ▼ / → for issue count changes in comparison tables
- Audience is a dev team — be specific about what still needs to be fixed
