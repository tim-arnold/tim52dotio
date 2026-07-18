# Technology Inventory — tim52.io

## Data Sources

| Section | Tool Used | Date | Notes |
|---|---|---|---|
| Architecture / config | Bash (`cat`, `find`, `ls`) against local repo `/Users/timarnold/sites-personal/tim52dotio` | 2026-07-12 | `next.config.ts`, `wrangler.toml`, `tsconfig.json`, `.node-version`, `.nvmrc` |
| Dependencies | Bash `npm outdated`, `cat package.json` | 2026-07-12 | Live npm registry lookup via `npm outdated` |
| Lockfile / git tracking | Bash `git ls-files`, `git log` | 2026-07-12 | Confirms what's actually committed |
| Content model | Read tool on `sanity/schemas/*.ts`, `sanity.config.ts`, `sanity.cli.js` | 2026-07-12 | |
| Cloudflare Pages Functions | Read tool on `functions/api/*.ts`, `functions/lib/*.ts` | 2026-07-12 | |
| Third-party integrations (code) | Bash `grep` across `src/`, `functions/` | 2026-07-12 | |
| Third-party integrations (live, edge-injected) | Playwright MCP `browser_navigate` + `browser_network_requests` on https://tim52.io | 2026-07-13 | Captures scripts injected by Cloudflare that don't appear in the repo |
| Live page SEO/on-page data | DataForSEO MCP `on_page_instant_pages` on https://tim52.io | 2026-07-13 | |
| Live page performance | DataForSEO MCP `on_page_lighthouse` on https://tim52.io | 2026-07-13 | Desktop, simulated throttling |
| Response headers | Bash `curl -sI` / `curl -sD -` against https://tim52.io (HTML, `/portfolio`, static CSS asset) | 2026-07-13 | |
| robots.txt | Bash `curl -s https://tim52.io/robots.txt` | 2026-07-13 | |

---

## 1. Architecture Overview

- **Framework:** Next.js `15.5.14` installed (package.json range `^15.5.7`), `output: 'export'` — fully static site generation, no server runtime for pages. Not EOL; Next.js 16.2.10 is the current latest major (per `npm outdated`), so the site is one major version behind.
- **Structure:** Static export (Next.js App Router) + Cloudflare Pages Functions (`functions/api/*.ts`) for the three dynamic endpoints (contact form, AI chat, fit assessment). Content is pulled from Sanity CMS at **build time** via `@sanity/client` (not `next-sanity`'s cached client — confirmed in `src/lib/sanity.client.ts`), so there is no runtime CMS dependency once built.
- **Build/deploy pipeline:** `npm run build` runs `next build` then `scripts/build-evals.sh` (builds a separate Astro app in `Eval/web` and copies it into `out/evals/`). No CI/CD pipeline exists in-repo — no `.github/workflows` directory found. Deployment is presumably triggered by Cloudflare Pages watching the `production` branch (per project CLAUDE.md), meaning there is no automated test/lint gate before a push goes live.
- **Environment variables / secrets:** `.env.local`, `.env.local.example`, `.dev.vars`, `.env.example` are all present locally but **not tracked in git** (confirmed via `git ls-files` — none matched; `git log --all -- .dev.vars .env.local` returned no history). `.env*` and `.dev.vars` are both listed in `.gitignore`. Secrets referenced (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `ANTHROPIC_API_KEY`, `SANITY_API_READ_TOKEN`) are consumed via `env.X` / `process.env.X` only — no hardcoded credential values found via `grep` across `src/` and `functions/`.
- **`wrangler.toml`** is committed and contains a Cloudflare KV namespace ID (`RATE_LIMIT_KV`) in plaintext. A namespace ID is not a secret capable of granting access on its own, but committing infrastructure IDs is worth noting.
- **Node version pinning inconsistency:** `.node-version` = `22.12.0`, `.nvmrc` = `v22.1.0`. The two files disagree.

## 2. Dependencies

Source: `package.json` + `npm outdated` (live registry check, 2026-07-12).

| Package | Current | Wanted | Latest | Gap |
|---|---|---|---|---|
| next | 15.5.14 | 15.5.20 | **16.2.10** | 1 major behind |
| react / react-dom / react-is | 19.2.3 | 19.2.7 | 19.2.7 | patch behind |
| @next/bundle-analyzer | 15.5.9 | 15.5.20 | 16.2.10 | 1 major behind (tracks next) |
| eslint-config-next | 15.5.9 | 15.5.20 | 16.2.10 | 1 major behind |
| @sanity/client | 7.14.0 | 7.23.0 | 7.23.0 | minor behind |
| @sanity/image-url | 1.2.0 | 1.2.0 | **2.1.1** | 1 major behind |
| @sanity/vision | 4.22.0 | 4.22.0 | **6.4.0** | 2 majors behind |
| sanity | 4.22.0 | 4.22.0 | **6.4.0** | 2 majors behind |
| next-sanity | 11.6.12 | 11.6.13 | **13.1.1** | 2 majors behind |
| gsap | 3.14.2 | 3.15.0 | 3.15.0 | minor behind |
| resend | 6.7.0 | 6.17.2 | 6.17.2 | minor behind |
| styled-components | 6.3.8 | 6.4.3 | 6.4.3 | minor behind |
| sass | 1.97.2 | 1.101.0 | 1.101.0 | minor behind |
| jest / jest-environment-jsdom | 29.7.0 | 29.7.0 | **30.4.x** | 1 major behind |
| typescript | 5.9.3 | 5.9.3 | **7.0.2** | 2 majors behind |
| @types/node | 20.19.30 | 20.19.43 | **26.1.1** | major behind (tracks Node types, not urgent) |
| @playwright/test | 1.57.0 | 1.61.1 | 1.61.1 | minor behind |

- **Lockfile:** `package-lock.json` is present and committed (`git ls-files` confirms). Single lockfile, no conflicting `yarn.lock`/`pnpm-lock.yaml` found.
- **Abandoned packages:** None of the above show a 2+ year gap between current and latest — all packages have had releases within the current major/minor cycle. No abandoned dependencies identified.
- **Notable major-version gaps:** Sanity Studio core (`sanity`, `@sanity/vision`) is 2 majors behind latest; `next-sanity` is 2 majors behind (though its main data-fetching role has been deliberately bypassed in favor of `@sanity/client`, reducing exposure to this gap — see below).

## 3. Content and Data Model

Source: `sanity/schemas/*.ts`, `sanity.config.ts`, `sanity.cli.js`, `src/lib/sanity.client.ts`.

- **Sanity project:** `gwofhlpz`, dataset `production`. Studio plugins: `structureTool`, `visionTool` (GROQ playground — dev/admin tool only, gated behind Sanity Studio auth, not exposed on the public site).
- **Schema types (3 total):** `project` (portfolio items), `serviceCard` (service listing cards), `pageContent` (generic page/section text blocks, currently only `page: 'home'` in its options list).
- **Schema health:** Small, purpose-built schema set. All fields have explicit `validation` rules (required fields, min lengths, min counts). Both `project` and `serviceCard` have a `published` boolean gate and an `order` field for display ordering — no evidence of orphaned or duplicate fields.
- **Data fetching:** `src/lib/sanity.client.ts` uses `@sanity/client` directly with `useCdn: false` (fresh data at build time) and reads `SANITY_API_READ_TOKEN` from env — correctly avoids Next.js's fetch cache, which per prior project history caused stale-content bugs when using `next-sanity`'s `createClient`.
- **Admin access:** Sanity Studio is a separate deployable app (`npm run sanity:deploy`); access control is Sanity's own project-member authentication (Sanity's hosted identity system), not custom code in this repo. No local/custom admin auth to audit.

## 4. Third-Party Integrations

### Found in application code
| Integration | Purpose | Where |
|---|---|---|
| Resend | Transactional email for contact form | `functions/api/contact.ts` |
| Cloudflare Turnstile | Bot/spam protection on contact form | `functions/api/contact.ts`, `src/components/ContactForm.tsx` |
| Anthropic API (Claude Haiku 4.5) | "Ask AI About Me" chat + "Fit Assessment" tool | `functions/api/chat.ts`, `functions/api/fit-assessment.ts` |
| Sanity | Headless CMS content source | `src/lib/sanity.client.ts` |

- No analytics or tag-management code (GA4, GTM, HubSpot, Mailchimp, Salesforce, Meta Pixel, etc.) was found anywhere in `src/` or `functions/` via `grep`.

### Found live on the site but NOT in the repo (Cloudflare edge-injected)
Captured via Playwright network trace of a page load on https://tim52.io:
- `cdn-cgi/scripts/.../rocket-loader.min.js` — Cloudflare Rocket Loader (script optimization)
- `static.cloudflareinsights.com/beacon.min.js` — Cloudflare Web Analytics beacon
- `cdn-cgi/zaraz/s.js` and `cdn-cgi/zaraz/t` — **Cloudflare Zaraz** (third-party tag manager), actively firing an event that includes the full page title, viewport dimensions, and referrer as a base64-encoded payload
- `cdn-cgi/speculation` — Cloudflare speculation rules (prefetch/prerender)
- `cdn-cgi/rum` — Cloudflare Real User Monitoring beacon (POST)

These are configured entirely in the Cloudflare dashboard/zone settings, not in this repository — they cannot be audited or version-controlled from the codebase. What Zaraz is configured to collect/forward (e.g. to a third-party analytics or ad destination) is not visible from a client-side network trace alone.

### CORS / access posture
- `functions/api/chat.ts` and `functions/api/fit-assessment.ts` set `Access-Control-Allow-Origin: '*'` — these are cost-incurring Anthropic API proxy endpoints, and the wildcard CORS header permits any third-party origin's client-side JavaScript to call them directly. The only abuse control is per-IP rate limiting (10 req/min for chat, 5 req/min for fit-assessment) implemented via Cloudflare KV in `functions/lib/rate-limit.ts`, which **fails open** (allows the request) if the KV binding is missing or errors.
- Neither `/api/chat` nor `/api/fit-assessment` requires a Turnstile token or any other proof-of-humanity check — only `/api/contact` does.

### Credentials warranting rotation review
No credential values are present in the repository (see Architecture section). Rotation review should still cover: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `ANTHROPIC_API_KEY`, `SANITY_API_READ_TOKEN` — these live in Cloudflare Pages environment variable settings / Sanity's own token management, outside this repo's scope to inspect directly.

## 5. Custom Functionality and Code Quality

- **Routing:** Standard Next.js App Router file-based routing (`src/app/page.tsx`, `src/app/portfolio/page.tsx`, `src/app/services/page.tsx`, `src/app/code-samples/page.tsx`). No custom rewrite/redirect logic found in `next.config.ts` beyond a webpack CSS bundling tweak.
- **Authentication/access control:** No user-facing authentication in this codebase (portfolio site, no logged-in areas). CMS auth is delegated to Sanity's own system (see above).
- **Dead/legacy code:**
  - A **26MB `dist/` directory (262 files) is committed to git**, containing what appears to be an old Vercel-template build output (`vercel.svg`, `next.svg`, `window.svg` — Next.js starter boilerplate not used by the current site) plus an `old-work` subdirectory. It is not excluded by `.gitignore` (only `/out/` and `/build/` are ignored; `dist/` is not). Last touched by commit `92f45da` (2025-12-07).
  - `.idea/` (JetBrains IDE project files) is tracked in git despite being listed in `.gitignore` — the entries were committed before the ignore rule was added, so the ignore rule has no effect on them now.
- **Debug/console output left in production code:**
  - `src/components/ConsoleMessage.tsx` — an intentional "secret cow" easter-egg `console.log`, rendered on every page load. Appears deliberate (branded humor), not accidental debug output, but worth confirming with the site owner that it's meant to ship to production.
  - `src/components/GSAPSplitText.tsx:217` — a `console.log('Drop animation complete - parallax temporarily disabled')` next to a `// TODO: Re-enable parallax once ScrollTrigger conflict is resolved` comment, indicating a shipped, unresolved workaround with debug logging left active.
  - `src/app/services/page.tsx:20` — an additional `console.log` call present (not reviewed for content in this pass).
- **Hardcoded values:** `src/app/layout.tsx` hardcodes `const siteUrl = "https://tim52.io"; // Replace with your actual domain` — functionally correct today but the leftover placeholder comment suggests this was never converted to an env var, so it would silently point to production if ever reused for a staging deploy.

## 6. Performance and Configuration

Source: DataForSEO `on_page_lighthouse` and `on_page_instant_pages`, Playwright network trace, `curl` header inspection — all against the live production URL https://tim52.io on 2026-07-13.

- **Lighthouse (desktop, simulated throttling):** Performance 100, Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100. FCP 283ms, LCP 456ms, TTI 456ms, total byte weight 1.12MB, server response time 18ms.
- **Hosting:** Cloudflare (`server: cloudflare` header on all responses). HTTP/2, HTTP/3 advertised via `alt-svc`.
- **Caching:**
  - HTML documents: `cache-control: public, max-age=0, must-revalidate` — correct for dynamic-looking static HTML (`cf-cache-status: DYNAMIC` observed).
  - Static hashed assets (`/_next/static/css/*.css`): `cache-control: public, max-age=31536000, must-revalidate` — long max-age is appropriate for content-hashed filenames, but pairing it with `must-revalidate` is unusual; `immutable` would be the more standard directive for hash-named build assets and would let clients skip the revalidation round-trip entirely. Observed `cf-cache-status: REVALIDATED` on a hashed asset consistent with this.
- **Security headers:** `x-content-type-options: nosniff` and `referrer-policy: strict-origin-when-cross-origin` are present on responses. **`X-Frame-Options` and `Content-Security-Policy` are absent** on the live site — `next.config.ts` contains a comment block listing these as "Recommended headers" to be configured "at the hosting level (Cloudflare Pages)... since they don't work with static export," but that follow-up configuration was not found to be in place on the live responses checked.
- **CORS:** `access-control-allow-origin: *` is present even on the main HTML document response (not just API endpoints) — likely a Cloudflare Pages default rather than an explicit choice, but confirmed present via `curl -sI https://tim52.io/`.
- **robots.txt:** Present, allows all crawling, references `sitemap.xml`, and explicitly disallows `/scripts/` and `/_next/static/`.
- **Image delivery:** `next.config.ts` sets `images: { unoptimized: true }`, required for static export — Next.js image optimization is not available; images are served as-is (observed `.webp` format in use for photos, which is good practice even without the optimizer).
