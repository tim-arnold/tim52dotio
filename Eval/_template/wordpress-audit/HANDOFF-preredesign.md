# WordPress Audit

## Context

You are conducting a WordPress audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL, local site path, and CMS/hosting details.

The goal is to document the WordPress content model, plugin dependencies, and custom functionality so the dev team knows what to replicate, migrate, and discard during a rebuild.

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
- `reports/wordpress-audit-report.md` — dev-team report with executive summary and migration checklist

---

## What to Audit

### 1. Theme Architecture

Identify the active theme. Is it a custom theme, child theme, or off-the-shelf? What templating engine does it use (standard PHP, Timber/Twig, Blade, etc.)?

- PHP template files and their routing logic
- Template hierarchy — how WordPress selects templates per content type
- Any component/partial system in use

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
- Is it a hard dependency (content won't work without it) or a soft dependency (feature enhancement)?
- Does it store data only in the DB (requires export before decommission)?
- Is it a dev/staging tool that should be removed from production?

Flag especially:
- Form plugins (Gravity Forms, WPForms, CF7) — form definitions are often DB-only
- Redirect plugins — redirect rules are DB-only and load-bearing
- SEO plugins (Yoast, RankMath) — postmeta values must migrate
- E-commerce, membership, or LMS plugins

### 4. Custom Functionality

Review `functions.php` and any `inc/` files. Document:
- Custom post type and taxonomy registration
- Custom query modifications (`pre_get_posts`, `posts_where`, etc.)
- URL rewrite rules
- Any hooks that modify core WordPress behavior
- API integrations (HubSpot, Salesforce, Mailchimp, etc.)
- Any hardcoded credentials or API keys (flag for removal/rotation)
- Anything that would need to be replicated in a new CMS

### 5. Media

- Are there custom image sizes registered?
- Any custom media handling (featured image overrides, secure downloads, etc.)?
- Approximate size of `wp-content/uploads/` if accessible

### 6. What to Drop

Identify dead code, dev tools, and legacy functionality that should not be migrated:
- Dev plugins (Query Monitor, Dummybot, Duplicate Post, etc.)
- Commented-out CPTs or templates
- Legacy theme code not in use
- Any staging-only plugins or configurations active in production

---

## Migration Checklist

The report must include a pre-decommission checklist covering everything that lives only in the database:

- [ ] Full database export
- [ ] Form plugin definitions export (JSON)
- [ ] Redirect rules export (JSON)
- [ ] SEO plugin meta (captured in DB export — flag if migrating off WordPress)
- [ ] Options page values (CPT slugs, global settings, API keys)
- [ ] Media library (`wp-content/uploads/`)
- [ ] Any plugin-specific custom DB tables (forms, maps, e-commerce orders, etc.)

---

## Formatting Notes

- Use markdown tables for all structured data (CPTs, taxonomies, field groups, plugins)
- Executive summary: 6-8 bullets covering the most important things the dev team must know
- Be specific: file paths, line numbers, plugin names and versions where available
- Cross-reference the SEO audit risk register where URL slugs or content types are mentioned
