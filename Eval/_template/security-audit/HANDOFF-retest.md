# Security Retest Audit — Round {{RETEST_NUMBER}}

## Context

You are conducting a security retest #{{RETEST_NUMBER}} for the client described in `../../CLAUDE.md`. Started: {{RETEST_DATE}}.

Read `../../CLAUDE.md` first. Then read the original security audit in `../reports/` to understand what vulnerabilities and misconfigurations were found and what remediations were recommended.

The goal is to verify that critical and high findings were addressed and document the current security posture.

**Do NOT attempt to exploit any vulnerabilities.** Document and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/retest-data.md` — updated findings
- `reports/00-comparison.md` — delta summary
- `reports/security-retest-report.md` — full updated security snapshot

---

## Step 1: Re-test the Same Areas

Revisit the same areas as the original audit:

- **HTTP security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **TLS configuration** — certificate validity, protocol versions, cipher suites
- **Exposed sensitive files/paths** — `.env`, debug pages, admin panels, source maps
- **Third-party script inventory** — any new scripts added with broad permissions
- **Dependency CVEs** (if source access available) — run against current lockfile
- **WordPress-specific** (if applicable) — plugin versions, user enumeration, XML-RPC, REST API exposure

Use Playwright for live header inspection and DataForSEO `on_page_instant_pages` for additional signals.

---

## Step 2: Map Against Original Findings

| Finding | Severity | Original Status | Retest Status | Notes |
|---|---|---|---|---|

Status: **Fixed** / **Partially Fixed** / **Still Present** / **Regressed** / **Not Applicable**

---

## Step 3: Write the Reports

### Report 1: Comparison (`reports/00-comparison.md`)

Lead with an executive summary (3-5 bullets).

Cover:
- Critical/high findings resolved
- Findings still outstanding — carry forward with updated risk notes
- New findings introduced
- Overall posture change

---

### Report 2: Full Security Report (`reports/security-retest-report.md`)

Same structure as the original security audit report. Write as a standalone document. Note explicitly what changed.

---

## Formatting Notes

- Reference specific headers, paths, and CVE IDs
- Use ▲ / ▼ / → in comparison tables
- Audience is a dev team — be specific about what still needs to be fixed
