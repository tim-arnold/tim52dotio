# Technology Audit

## Context

You are conducting a technology audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL, platform, local path, and any relevant context.

The goal is to document the technology stack, content model, and custom functionality so the dev team knows what to replicate, migrate, and discard during a rebuild.

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
- `reports/technology-audit-report.md` — dev-team report with executive summary and migration checklist

---

## What to Audit

### 1. Architecture Overview

- What framework or CMS is in use? What version?
- How is the site structured — monolith, headless, static, hybrid?
- What is the build and deployment pipeline?
- How are environment variables and secrets managed?

### 2. Dependencies

If a local repo is available:
- Review `package.json`, `composer.json`, or equivalent. List major dependencies and their current versions.
- Note anything significantly behind current major versions or that appears abandoned (no releases in 2+ years).
- Note whether a lockfile is present and committed.

> Security evaluation of these dependencies (CVE scanning, hardcoded credentials) is covered in the security audit.

### 3. Content Model

- How is content structured and stored (database, files, CMS, API)?
- What content types / schemas exist?
- How is content authored — CMS admin, Markdown files, headless CMS, etc.?
- What content is in the codebase vs. in a database or external system?
- What must be exported or migrated before decommissioning the current system?

### 4. Third-Party Integrations

- Analytics, tag management (GTM, etc.)
- Marketing tools (HubSpot, Salesforce, Mailchimp, etc.)
- Forms and form handlers
- Maps, video embeds, social feeds
- Ad platforms or A/B testing tools
- Any integrations that require credentials to carry over

### 5. Custom Functionality

Review source files for:
- Custom routing or URL rewrite logic
- Search implementation
- Authentication or access control
- Any hardcoded content or configuration that should move to environment variables
- Anything non-obvious that would need to be replicated in a new stack

### 6. What to Drop

- Dev tools running in production (debug panels, annotation tools, etc.)
- Dead code, commented-out features, legacy files
- Plugins or packages no longer in use
- Staging-only configuration active on production

---

## Migration Checklist

The report must include a pre-decommission checklist covering everything that must be captured before the current environment is retired:

- [ ] Source code exported / repo access confirmed
- [ ] Database or content export (if applicable)
- [ ] Environment variables and secrets documented
- [ ] Third-party API credentials inventoried
- [ ] Form submission data exported (if needed)
- [ ] Redirect rules documented
- [ ] Media / uploaded assets exported
- [ ] Any platform-specific data exports (CMS exports, plugin data, etc.)

---

## Formatting Notes

- Use markdown tables for all structured data (dependencies, integrations, content types)
- Executive summary: 5-8 bullets covering the most important things the dev team must know
- Be specific: file paths, package names and versions, API endpoints where relevant
- Cross-reference the SEO audit risk register where URL structure or content types are mentioned
