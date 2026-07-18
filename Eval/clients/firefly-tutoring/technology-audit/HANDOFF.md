# Technology Audit

## Context

You are conducting a technology audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL, platform, local path, and any relevant context.

The goal is to assess the current stack for security issues, outdated dependencies, technical debt, and configuration problems — and produce a prioritized remediation plan. The site is not being rebuilt; findings should be actionable against the current codebase.

If a local path is available in `../CLAUDE.md`, use it as the primary source. If not, infer what you can from the live site and flag gaps clearly.

**Do NOT modify any files.** Read and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/technology-inventory.md` — structured inventory of everything found
- `reports/technology-audit-report.md` — dev-team report with executive summary and remediation checklist

---

## What to Audit

### 1. Architecture Overview

- What framework or CMS is in use? What version? Is it current or EOL?
- How is the site structured — monolith, headless, static, hybrid?
- What is the build and deployment pipeline? Are there CI/CD gaps?
- How are environment variables and secrets managed?

### 2. Dependencies

If a local repo is available:
- Review `package.json`, `composer.json`, or equivalent. List major dependencies and their current versions.
- Note anything significantly behind current major versions or that appears abandoned (no releases in 2+ years).
- Note whether a lockfile is present and committed.

If only the live site is available:
- Inspect response headers and HTML source for framework fingerprints and version hints.
- Flag any technology that is known EOL based on what can be inferred.

> Security evaluation of these dependencies (CVE scanning, hardcoded credentials) is covered in the security audit.

### 3. Content and Data Model

- How is content structured and stored?
- Is the content model well-organized or has it accumulated technical debt (unused post types, duplicate fields, orphaned data)?
- Are CMS admin areas accessible only to authorized users?

### 4. Third-Party Integrations

- Analytics, tag management (GTM, etc.)
- Marketing tools (HubSpot, Salesforce, Mailchimp, etc.)
- Forms and form handlers — are submissions stored securely? Is spam protection in place?
- Maps, video embeds, social feeds
- Ad platforms or A/B testing tools
- Flag any integrations that use credentials that should be rotated or reviewed

### 5. Custom Functionality and Code Quality

Review source files for:
- Custom routing or URL rewrite logic — any fragile or undocumented patterns
- Authentication or access control — are there gaps?
- Hardcoded content or configuration that should be in environment variables
- Dead code, commented-out features, legacy files consuming maintenance overhead
- Dev tools or debug panels running in production

### 6. Performance and Configuration

- Server and hosting configuration — are there obvious misconfigurations?
- Caching strategy — is it appropriate and functioning?
- Asset delivery — are images, JS, and CSS optimized and properly cached?
- Any staging-only configuration active on production

---

## Remediation Checklist

The report must include a prioritized checklist. For each item:

- **What**: the specific issue
- **Risk**: security / performance / stability / maintainability
- **Fix**: what needs to change
- **Effort**: hours / days / sprint

Organize by tier:

**Critical (fix immediately)** — security vulnerabilities, exposed credentials, EOL software with known exploits, missing authentication
**High (fix soon)** — outdated major versions, performance blockers, undocumented custom logic that creates fragility
**Medium (planned work)** — tech debt cleanup, dependency upgrades with breaking changes, configuration improvements
**Low (backlog)** — dead code removal, minor optimization, best-practice improvements

---

## Formatting Notes

- Use markdown tables for all structured data (dependencies, integrations, issues)
- Executive summary: 5-8 bullets covering the most critical issues
- Be specific: file paths, package names and versions, CVE numbers where relevant
- The audience is a dev team working on the existing site — focus on actionable fixes, not migration guidance

---

## ⚠️ Front-End Only Mode

No local path was available at setup time. This audit is limited to what can be inferred from the public URL and HTML source.

**What you can still assess:**
- HTML source: framework fingerprints, meta tags, schema markup, script inventory
- Public URL structure and redirects
- Third-party scripts (GTM, analytics, ad platforms, integrations)
- Publicly visible content model (URL patterns, page types)
- Network requests (API calls, CDN assets, third-party resources)

**What you cannot assess without source access:**
- Dependency inventory and versions
- Build configuration and environment variables
- Server-side logic, API routes, custom middleware
- Hardcoded credentials or dev tools in source files
- Non-public content types or admin-only functionality

**Recommendation:** Flag gaps clearly in the report. If source access becomes available, supplement with a filesystem pass.

