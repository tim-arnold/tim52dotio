# Technology Audit Report — tim52.io

**Audit date:** 2026-07-13
**Scope:** Local repository (`/Users/timarnold/sites-personal/tim52dotio`) + live production site (https://tim52.io)
**Full data:** see `data/technology-inventory.md`

## Executive Summary

- The core stack is healthy: Next.js 15.5 static export on Cloudflare Pages, Lighthouse scores a perfect 100 across Performance/Accessibility/Best Practices/SEO, and no secrets are committed to git.
- **Two AI-backed endpoints (`/api/chat`, `/api/fit-assessment`) call the Anthropic API with wildcard CORS (`Access-Control-Allow-Origin: *`) and no bot-verification challenge** — the only abuse control is IP-based rate limiting that fails open if Cloudflare KV errors. This is a real cost-abuse exposure since any site can embed a call to these endpoints.
- **`X-Frame-Options` and `Content-Security-Policy` are not set on the live site**, despite `next.config.ts` explicitly calling out that they need to be added at the Cloudflare Pages hosting layer — that follow-up step appears to have never been completed.
- **A 26MB `dist/` directory (262 files) of stale build output is committed to git**, including generic Next.js starter boilerplate (`vercel.svg`, `next.svg`) unrelated to the current site, plus an `old-work` folder. It isn't excluded by `.gitignore`.
- No CI/CD pipeline exists in the repository (no GitHub Actions) — deploys appear to go live from a direct push to the `production` branch with no automated lint/test/build gate in between.
- Sanity Studio core packages (`sanity`, `@sanity/vision`) are 2 major versions behind latest; `next-sanity` is 2 majors behind (mitigated somewhat since content fetching bypasses it in favor of `@sanity/client` directly); `next` itself is 1 major behind (16.x is current).
- No client-side analytics/tag code exists in the repository, but Cloudflare Zaraz, Cloudflare Web Analytics, and Cloudflare RUM are actively running on the live site — configured entirely outside this repo (Cloudflare dashboard), so they're invisible to code review and not version-controlled.
- Minor code-quality debt: a shipped `console.log` next to an unresolved `// TODO` in `GSAPSplitText.tsx` (disabled parallax), a hardcoded production URL with a leftover "replace this" comment in `layout.tsx`, and a Node version mismatch between `.node-version` and `.nvmrc`.

---

## Remediation Checklist

### Critical (fix immediately)

| What | Risk | Fix | Effort |
|---|---|---|---|
| `/api/chat` and `/api/fit-assessment` (functions/api/chat.ts, functions/api/fit-assessment.ts) allow `Access-Control-Allow-Origin: *` with no Turnstile/human check, only IP rate-limiting that fails open on KV error | Security / stability — third-party sites can embed calls to these endpoints and drive up Anthropic API spend; a KV outage removes rate limiting entirely | Restrict CORS to `https://tim52.io` origin only; add a Turnstile check (reusing the existing widget/pattern from `functions/api/contact.ts`) before calling Anthropic; consider failing closed (deny) rather than open if KV is unavailable, or add a secondary hard cap | Hours |
| Missing `X-Frame-Options` and `Content-Security-Policy` on the live site | Security — no clickjacking protection, no CSP to contain XSS impact if one is ever introduced | Configure these headers via Cloudflare Pages (`_headers` file in the static export output, or a Cloudflare Transform Rule) — the specific values are already drafted as a comment in `next.config.ts`, they just need to be applied at the hosting layer as that comment describes | Hours |

### High (fix soon)

| What | Risk | Fix | Effort |
|---|---|---|---|
| `next` is 1 major version behind (15.5.14 installed vs 16.2.10 latest); `eslint-config-next` and `@next/bundle-analyzer` track the same gap | Maintainability — falling further behind increases eventual upgrade risk and misses security/perf fixes in the framework | Plan a Next.js 16 upgrade using the official codemods; re-run the full test suite and a Lighthouse pass afterward | Days |
| `sanity` and `@sanity/vision` are 2 majors behind (4.22 → 6.4); `next-sanity` is 2 majors behind (11.6 → 13.1) | Maintainability — Studio and tooling drift increases future migration difficulty; `next-sanity` upgrade is lower urgency since it isn't used for data fetching | Upgrade Sanity Studio dependencies together (`sanity`, `@sanity/vision`) and validate Studio still builds/deploys; defer or bundle `next-sanity` upgrade separately since it's not on the runtime critical path | Days |
| No CI/CD pipeline — deploys go live directly from a push to `production` with no automated gate | Stability — a broken build, failing test, or lint error can ship straight to production undetected | Add a GitHub Actions workflow (or Cloudflare Pages build-time check) that runs `npm run lint`, `npm test`, and `npm run build` on PRs/pushes before Cloudflare deploys | Days |
| 26MB `dist/` directory committed to git, not excluded by `.gitignore` | Maintainability — repo bloat, slower clones, and generic starter boilerplate (`vercel.svg`, `next.svg`) creates confusion about what's actually part of the live site | Remove `dist/` from git tracking (`git rm -r --cached dist`) and add `/dist/` to `.gitignore` | Hours |

### Medium (planned work)

| What | Risk | Fix | Effort |
|---|---|---|---|
| Cache-control on hashed static assets uses `must-revalidate` instead of `immutable` (`cache-control: public, max-age=31536000, must-revalidate`) | Performance — content-hashed filenames never change, so `immutable` would let browsers skip revalidation requests entirely | Adjust Cloudflare Pages cache rule / `_headers` for `/_next/static/*` to add `immutable` | Hours |
| `jest`/`jest-environment-jsdom` (1 major behind), `typescript` (2 majors behind, 5.9 → 7.0), `@types/node` (major behind), plus minor-version drift across `gsap`, `resend`, `styled-components`, `sass`, `@sanity/client`, `@playwright/test` | Maintainability — accumulating minor/major gaps compounds future upgrade effort | Batch a routine dependency bump (minor/patch versions first, low risk), then evaluate the TypeScript 7 major separately given its scope | Days |
| `.idea/` (JetBrains project files) tracked in git despite being listed in `.gitignore` | Maintainability — ignore rule has no retroactive effect on already-tracked files; unnecessary repo noise | `git rm -r --cached .idea` | Hours |
| Cloudflare Zaraz, Web Analytics, and RUM run on the live site but are configured entirely outside the repo (Cloudflare dashboard) | Maintainability / governance — no version control or code review over what these collect or where data is sent | Document the current Zaraz configuration (triggers, destinations) somewhere in the repo (e.g. `docs/`) so it isn't tribal knowledge locked in the Cloudflare dashboard | Hours |
| `.node-version` (22.12.0) and `.nvmrc` (v22.1.0) disagree | Maintainability — inconsistent local dev environments depending on which tool a contributor uses | Align both files to the same Node version | Minutes |

### Low (backlog)

| What | Risk | Fix | Effort |
|---|---|---|---|
| `console.log('Drop animation complete - parallax temporarily disabled')` in `src/components/GSAPSplitText.tsx:217`, next to an unresolved `// TODO: Re-enable parallax once ScrollTrigger conflict is resolved` | Maintainability — shipped debug output and a known-unresolved workaround | Either resolve the ScrollTrigger conflict and re-enable parallax, or remove the console.log and turn the TODO into a tracked backlog item | Hours |
| `console.log` in `src/app/services/page.tsx:20` | Maintainability — unreviewed debug output shipped to production | Review content and remove or convert to intentional messaging (as with `ConsoleMessage.tsx`) | Minutes |
| Hardcoded `const siteUrl = "https://tim52.io"; // Replace with your actual domain` in `src/app/layout.tsx` | Maintainability — leftover placeholder comment; correct today but risky if the codebase is ever reused for a staging/preview deploy | Move to an env var (`NEXT_PUBLIC_SITE_URL`) with `https://tim52.io` as the default, and drop the stale comment | Hours |
| `wrangler.toml` commits a Cloudflare KV namespace ID in plaintext | Maintainability/best-practice — not a credential, but infrastructure IDs are generally better sourced from environment-specific config | Low priority; acceptable to leave as-is, but worth noting for any future multi-environment setup | N/A |
| `robots.txt` disallows `/_next/static/` | Minor — functionally harmless since search engines don't need to crawl hashed JS/CSS bundles, but not a standard pattern | No action required; noted for awareness only | N/A |
