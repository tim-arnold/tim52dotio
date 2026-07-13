# Technology Retest Audit — Round {{RETEST_NUMBER}}

## Context

You are conducting a technology retest #{{RETEST_NUMBER}} for the client described in `../../CLAUDE.md`. Started: {{RETEST_DATE}}.

Read `../../CLAUDE.md` first for the CMS, hosting, and local site path. Then read the original technology audit in `../reports/` to understand what was inventoried and what issues were flagged.

The goal is to re-audit the same areas, confirm that recommended changes were made, and document the current technical state.

**Do NOT modify any files.** Read and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/retest-data.md` — updated inventory and findings
- `reports/00-comparison.md` — delta summary
- `reports/technology-retest-report.md` — full updated technology snapshot

---

## Step 1: Re-audit the Same Areas

Revisit the same areas covered in the original audit:

- **Dependencies** — package versions, updated vs. outdated, new CVEs
- **Build configuration** — any changes to environment setup, build pipeline, CI/CD
- **Third-party scripts** — any added, removed, or updated integrations
- **Content model** — any new post types, fields, or schema changes (WordPress/headless)
- **Plugin inventory** (WordPress) — added, removed, or updated plugins; any new custom DB tables
- **Security posture** — headers, exposed credentials, hardcoded values
- **Hosting / deployment** — infrastructure changes since the original audit

Use the same tools as the original: filesystem read, Playwright for live page inspection.

---

## Step 2: Map Against Original Findings

For every issue in the original technology audit report:

| Issue | Original Status | Retest Status | Notes |
|---|---|---|---|

Status options: **Fixed** / **Partially Fixed** / **Still Present** / **Regressed** / **Not Applicable**

Note any new issues introduced.

---

## Step 3: Write the Reports

### Report 1: Comparison (`reports/00-comparison.md`)

Lead with an executive summary (3-5 bullets).

Cover:
- Dependency health: outdated packages before → after, any new CVEs
- Issues resolved from the original audit
- Issues still outstanding
- New issues introduced
- Any significant infrastructure or content model changes

Comparison table:
| Metric | Baseline | Retest {{RETEST_NUMBER}} | Delta |
|---|---|---|---|

---

### Report 2: Full Technology Report (`reports/technology-retest-report.md`)

Same structure as the original technology audit report. Write as a standalone document. Note explicitly where things changed.

---

## Formatting Notes

- Specific package versions, file paths, and plugin names throughout
- Use ▲ / ▼ / → for changes in comparison tables
- Audience is a dev team — be specific about what still needs attention
