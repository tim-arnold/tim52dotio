# Pre-Redesign Audit Framework

This repo contains pre-redesign audits across multiple clients. Each client lives in `clients/<slug>/`.

## Structure

```
clients/
  <client-slug>/
    CLAUDE.md                    ← client context (URL, CMS, local path, status)
    seo-audit/
      data/                      ← raw collected data
      reports/                   ← final deliverable reports
    wordpress-audit/
      data/
      reports/
    accessibility-audit/
      data/
      reports/
      screenshots/

_template/                       ← copy this to bootstrap a new client
  CLAUDE.md                      ← fill in {{PLACEHOLDERS}} or run new-client.sh
  seo-audit/HANDOFF.md
  wordpress-audit/HANDOFF.md
  accessibility-audit/HANDOFF.md
```

## Starting a New Client

```bash
./new-client.sh
```

The script will prompt for client details and create a ready-to-use directory under `clients/`.

## Running a Retest

After a redesign launches or a remediation is applied, scaffold a new retest:

```bash
./add-retest.sh
```

The script prompts for the client slug and which audit types to retest. It auto-increments the retest number and creates `<audit-type>/retest-N/` with `data/`, `reports/`, and a pre-filled `HANDOFF.md`. Multiple retests are supported per audit type.

Retest reports live at `<audit-type>/retest-N/reports/`. The comparison report is always `00-comparison.md`. The web app groups them under Initial / Retest N sub-headers in the sidebar.

## Clients

| Client | URL | Status |
|---|---|---|
| noble-reach | https://noblereach.org | SEO ✓ · WordPress ✓ · Accessibility ✓ |

## Analytics MCP Setup

The `analytics-mcp` server authenticates via a **service account key**, not personal user OAuth — the `gcloud` CLI's default OAuth client can trigger Google's "This app is blocked" screen on personal Gmail accounts when requesting the `analytics.readonly` scope, and a service account sidesteps that entirely.

- **Project:** `analytics-mcp-502222` (owned by `tim.arnold@gmail.com`)
- **Service account:** `analytics-mcp@analytics-mcp-502222.iam.gserviceaccount.com` — this is the email each client grants GA4 Viewer access to, not a personal email
- **Key file:** `~/.config/gcloud/keys/analytics-mcp-502222.json` (machine-local, gitignored, `chmod 600`)
- Registered via: `claude mcp add analytics-mcp -s user -e GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/keys/analytics-mcp-502222.json -- pipx run analytics-mcp`

If `/mcp` shows it disconnected, re-check the key file path and that the Analytics Data/Admin APIs are enabled on the project — see full setup in the root `README.md`. There's no token expiry to manage since it's key-based, not a user OAuth session.

**Field name casing:** Despite the MCP tool description saying to use snake_case, the GA4 Data API requires **camelCase** for all dimension and metric names. Use `sessionDefaultChannelGroup`, `landingPage`, `deviceCategory`, `yearMonth`, `eventName`, `eventCount`, `newUsers`, `bounceRate`, `engagedSessions`, `averageSessionDuration`, etc. Snake_case will return a 400 error with a camelCase suggestion.

The GA4 property ID for each client is stored in `clients/<slug>/.env.local` (gitignored).

## Conventions

- **Report H1 titles must start with the report name, not the client name.** The web app sidebar strips everything after the em dash, so `# Technology Audit Report — Client Name` is correct; `# Client Name — Technology Audit Report` is not.

## Report Viewer Deployment

The `web/` Astro app is built with `base: '/evals'` and ships as part of the parent `tim52dotio` site's static export, at `tim52.io/evals/` — not as its own Cloudflare Pages deployment. The parent repo's `scripts/build-evals.sh` builds `web/` and copies `web/dist/` into the parent's `out/evals/` as part of its `npm run build`. Access is gated by Cloudflare Access (email OTP) at the `tim52.io` zone level since this data includes real client audit findings (including security-audit results). Any internal link in `web/src/` must be built off `import.meta.env.BASE_URL`, not a hardcoded root-relative path, or it will break under the `/evals` prefix.
