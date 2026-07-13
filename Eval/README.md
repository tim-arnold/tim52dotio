# Site Audit Framework

Pre-redesign and remediation audits across multiple clients. Each client lives in `clients/<slug>/`.

## Clients

| Client      | URL                      | Type | Status |
|-------------|--------------------------|---|---|
| client-name | https://clientdomain.org | Remediation | SEO ✓ · Technology ✓ · Accessibility ✓ · Analytics ✓ · Security ✓ |

## Audit Dependencies

Each audit type requires different tools to be configured in Claude Code.

### SEO Audit
- **DataForSEO MCP** (`dfs-mcp`) — provides SERP data, keyword rankings, backlink analysis, Lighthouse, on-page audits, and AI mention data
- Configure via the DataForSEO MCP server in Claude Code settings with your API credentials

### Technology Audit
- **Local repo/site copy** — a filesystem copy of the codebase (WordPress local, git clone, etc.). Path goes in the client's `CLAUDE.md`.
- No external API credentials required — the audit is filesystem-only (read-only)
- Front-end only mode available if no local copy exists (with caveats)

### Analytics Audit

**Tool:** Google Analytics MCP (`analytics-mcp`) — queries GA4 for traffic, behavior, events, conversions, and data quality checks.

#### Access requirements

The client must grant the **service account** below **Viewer** access (read-only) to their GA4 property before you can pull data. They do this in:

> GA4 Admin → Account Access Management (for all properties) **or** Property Access Management (for one property) → Add users → enter the service account email below → role: Viewer

You need the GA4 **property ID** (a numeric ID, e.g. `526160702`, found in GA4 Admin → Property Settings). Store it in the client's `.env.local`:

```
GA4_PROPERTY_ID=526160702
```

#### Google Cloud project and service account

All client analytics audits route through a personal Google Cloud project, authenticated via a **service account key** rather than personal user OAuth — this avoids Google's "This app is blocked" screen, which the `gcloud` CLI's OAuth client can trigger on personal Gmail accounts when requesting sensitive scopes:

- **Google account (project owner):** `tim.arnold@gmail.com`
- **Project:** Analytics MCP
- **Project ID:** `analytics-mcp-502222`
- **Service account:** `analytics-mcp@analytics-mcp-502222.iam.gserviceaccount.com` — this is the email clients grant GA4 Viewer access to, not a personal email
- **Key file:** `~/.config/gcloud/keys/analytics-mcp-502222.json` (gitignored, machine-local, `chmod 600`)

The Google Analytics Data API must be enabled on this project:

```bash
gcloud config set project analytics-mcp-502222
gcloud services enable analyticsdata.googleapis.com analyticsadmin.googleapis.com
```

#### One-time setup (per machine)

Create the service account and key (only needed once, or once per new machine):

```bash
gcloud iam service-accounts create analytics-mcp --display-name="Analytics MCP" --project=analytics-mcp-502222
mkdir -p ~/.config/gcloud/keys
gcloud iam service-accounts keys create ~/.config/gcloud/keys/analytics-mcp-502222.json \
  --iam-account=analytics-mcp@analytics-mcp-502222.iam.gserviceaccount.com
chmod 600 ~/.config/gcloud/keys/analytics-mcp-502222.json
```

Then register the MCP server with the key passed as an env var:

```bash
pipx install analytics-mcp
claude mcp add analytics-mcp -s user -e GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/keys/analytics-mcp-502222.json -- pipx run analytics-mcp
```

No browser OAuth flow, no token expiry to manage — the key file is the credential. Confirm it's connected via `/mcp` in Claude Code.

#### Field name casing

The GA4 Data API requires **camelCase** for all dimension and metric names (`sessionDefaultChannelGroup`, `landingPage`, `deviceCategory`, `yearMonth`, `eventName`, `bounceRate`, etc.), even though the MCP tool description says to use snake_case. Using snake_case returns a 400 error.

### Security Audit
- **Local repo/site copy** — for dependency scanning and credential checks
- **Playwright MCP** — for live site header and TLS inspection
- No additional API credentials required beyond what other audits use

### Accessibility Audit
- **Playwright MCP** — browser automation for live page testing, screenshots, keyboard navigation, and accessibility tree inspection
- Install: add the Playwright MCP server to Claude Code settings
- **Local site copy** (optional) — for the code-level pass; audit proceeds with live site only if unavailable

---

## Adding a New Client

```bash
./new-client.sh
```

Prompts for client details and creates a ready-to-use directory under `clients/` from the `_template/`.

## Adding an Audit to an Existing Client

```bash
./new-client.sh --add-audit
```

Lists existing clients and their current audit status, then prompts for which client and which audit type to add. Scaffolds the audit directory (with `data/` and `reports/` subdirectories and a `HANDOFF.md`) and updates the client's `CLAUDE.md` status. Automatically selects the correct HANDOFF template (pre-redesign vs. remediation) based on the client's existing `CLAUDE.md`.

## Report Viewer

Reports are rendered as a navigable web app in `web/`. It's built with a `/evals` base path and shipped as part of the main tim52dotio static export, live at `tim52.io/evals/` (gated by Cloudflare Access — email OTP required — since it serves real client audit data, including security findings).

### Run locally

```bash
cd web
npm install
npm run dev
```

Opens at `http://localhost:4321`. No auth required locally — all reports are accessible. Note that internal links are built with a `/evals` prefix (`astro.config.mjs` → `base: '/evals'`), so in dev they resolve at `http://localhost:4321/evals/`, not `/`.

### Build

```bash
cd web
npm run build
```

Output goes to `web/dist/`, prefixed for `/evals/`. This isn't deployed standalone anymore — the root site's `npm run build` (in the main `tim52dotio` repo) runs `scripts/build-evals.sh`, which builds `web/` and copies `web/dist/` into the main Next.js static export at `out/evals/`. Cloudflare Pages then deploys it all together as one site.

## Repo Structure

```
clients/
  <client-slug>/
    CLAUDE.md                    ← client context (URL, CMS, local path, status)
    .env.local                   ← GA4 property ID and other secrets (gitignored)
    seo-audit/
      data/                      ← raw collected data
      reports/                   ← final deliverable reports
    technology-audit/
      data/
      reports/
    accessibility-audit/
      data/
      reports/
      screenshots/
    analytics-audit/
      data/
      reports/
    security-audit/
      data/
      reports/
    wordpress-audit/             ← WordPress-only clients
      data/
      reports/

_template/                       ← copied by new-client.sh; each audit type has
  <audit-type>/                    HANDOFF-preredesign.md and HANDOFF-remediation.md
  CLAUDE.md

web/                             ← Astro report viewer, base path "/evals"
  src/
    lib/reports.ts               ← reads clients/*/reports/*.md at build time
    pages/                       ← [client]/[report] dynamic routes
    layouts/
    styles/
  astro.config.mjs
  wrangler.toml                  ← unused now; viewer ships via the main site's build

wrangler.toml                    ← root-level Cloudflare config (legacy, unused)
new-client.sh                    ← scaffold new client or add audit to existing one
CLAUDE.md                        ← project-level instructions for Claude Code
```

Note: the parent `tim52dotio` repo's `scripts/build-evals.sh` and `package.json` build script are what actually wire `web/` into the live site at `/evals/` — see those for the current build/deploy path.
