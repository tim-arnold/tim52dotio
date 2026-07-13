# WordPress Audit

## Context

You are conducting a WordPress audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL, local site path, and CMS/hosting details.

The goal is to assess the current WordPress install for security issues, outdated dependencies, technical debt, and configuration problems — and produce a prioritized remediation plan. The site is not being rebuilt; findings should be actionable against the current codebase.

**Source:** Filesystem analysis of the local site copy at the path in `../CLAUDE.md`. This is a read-only audit — do not modify any files.

If no local path is available, note that the audit is filesystem-limited and flag what could not be assessed without DB or admin access.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/wordpress-inventory.md` — structured inventory of everything found
- `reports/wordpress-audit-report.md` — dev-team report with executive summary and prioritized remediation plan

---

## What to Audit

### 1. Theme Architecture

Identify the active theme. Is it a custom theme, child theme, or off-the-shelf? What templating engine does it use (standard PHP, Timber/Twig, Blade, etc.)? Is it actively maintained/updated, or abandoned?

- PHP template files and their routing logic
- Template hierarchy — how WordPress selects templates per content type
- Any component/partial system in use
- Theme/WordPress core version currency — how far behind latest?

### 2. Content Model

#### Custom Post Types (CPTs)
- What CPTs are registered? What are their slugs?
- Are they public or non-public?
- Do they have archives, or are they surfaced only via custom queries?
- Which CPTs drive the most traffic (cross-reference SEO audit if complete)?

#### Taxonomies
- What taxonomies are registered per CPT?
- Are any slugs configurable (stored in options/settings)?

#### Advanced Custom Fields (ACF) or Other Field Plugins
- List all field groups, their locations (which post types/pages they apply to), and key field types
- Is there a flexible content / layout builder field? List all available layouts.
- Are there options pages? Document what global settings they store.
- Are field definitions version-controlled (JSON files) or only in the DB?

#### Page Builder
- If a page builder is in use (ACF Flexible Content, Gutenberg blocks, Elementor, etc.), document the available layouts/blocks.

### 3. Plugin Inventory

For each active plugin, assess:
- What does it do?
- Is it up to date? How far behind the latest version, and does that gap carry known CVEs?
- Is it a hard dependency (content won't work without it) or a soft dependency (feature enhancement)?
- Is it a dev/staging tool that should be removed from production?
- Is it abandoned (no updates in 1+ years) and worth replacing?

Flag especially:
- Form plugins (Gravity Forms, WPForms, CF7) — version and known vulnerabilities
- Redirect plugins — redirect rule sanity, orphaned rules
- SEO plugins (Yoast, RankMath) — configuration correctness, conflicting settings
- E-commerce, membership, or LMS plugins — PCI/security-relevant configuration
- Any plugin with a known CVE at its installed version

### 4. Custom Functionality

Review `functions.php` and any `inc/` files. Document:
- Custom post type and taxonomy registration
- Custom query modifications (`pre_get_posts`, `posts_where`, etc.)
- URL rewrite rules
- Any hooks that modify core WordPress behavior
- API integrations (HubSpot, Salesforce, Mailchimp, etc.) and whether credentials are stored securely
- Any hardcoded credentials or API keys (flag for immediate rotation/removal)
- Deprecated WordPress/PHP functions still in use
- Any code that bypasses WordPress security best practices (unescaped output, missing nonces, direct `$wpdb` queries without prepare)

### 5. Media

- Are there custom image sizes registered? Are they all still in use?
- Any custom media handling (featured image overrides, secure downloads, etc.)?
- Approximate size of `wp-content/uploads/` if accessible — any obvious bloat (unoptimized images, orphaned files)?

### 6. Security & Configuration

- `wp-config.php` — debug mode enabled in production? Keys/salts present and unique? File permissions reasonable?
- Admin accounts — default "admin" username in use? Number of admin-level users, any that look unused?
- Login hardening — brute-force protection, 2FA, XML-RPC exposure
- Core, theme, and plugin auto-update settings
- Any exposed sensitive files (`.env`, backup files, `readme.html` revealing version)

### 7. What to Clean Up

Identify dead code, dev tools, and legacy functionality that should be removed regardless of any rebuild:
- Dev plugins (Query Monitor, Dummybot, Duplicate Post, etc.) left active in production
- Commented-out CPTs or templates
- Legacy theme code not in use
- Any staging-only plugins or configurations active in production
- Orphaned database tables from long-removed plugins

---

## Remediation Priorities

The report must organize findings into priority tiers, consistent with the site's other remediation reports:

**Priority 1 — Quick Wins** (security fixes, plugin updates, credential rotation — low effort, do first)
**Priority 2 — High Impact** (theme/core upgrades, deprecated code removal — higher effort)
**Priority 3 — Ongoing** (update cadence, monitoring, process recommendations)

For each issue include: what's wrong, why it matters (security/performance/maintainability impact), recommended fix, and effort estimate.

---

## Formatting Notes

- Use markdown tables for all structured data (CPTs, taxonomies, field groups, plugins)
- Executive summary: 6-8 bullets covering the most important things the dev team must know
- Be specific: file paths, line numbers, plugin names and versions where available
- Cross-reference the security audit where vulnerabilities overlap
