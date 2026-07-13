# Security Findings — Independent Sector

Site: https://independentsector.org | Hosting: WP Engine (behind Cloudflare) | CMS: WordPress
Local repo: not available — all data collected against the live site.

## Data Sources

| Section | Tool Used | Date | Notes |
|---|---|---|---|
| TLS / certificate | SSL Labs API (`api.ssllabs.com/api/v3/analyze`) via WebFetch | 2026-07-12 | Cached result, both endpoints "READY", progress 100 |
| HTTP → HTTPS redirect | WebFetch (`http://independentsector.org`) | 2026-07-12 | — |
| HTTP response headers (homepage) | Playwright MCP `browser_network_request` (response-headers) | 2026-07-12 | Request to `https://independentsector.org/` |
| HTTP response headers (interior page) | Playwright MCP `browser_network_request` (response-headers) | 2026-07-12 | Request to `https://independentsector.org/about/` |
| Mozilla HTTP Observatory | WebFetch (`http-observatory.security.mozilla.org` API) | 2026-07-12 | **Not collected — API returned HTTP 502** |
| securityheaders.com | WebFetch | 2026-07-12 | **Not collected — returned HTTP 403 (blocked scripted access)** |
| Cookies (name/domain/flags) | Playwright MCP `browser_run_code_unsafe` (`page.context().cookies()`) | 2026-07-12 | Read-only enumeration, no interaction |
| Third-party script inventory | Playwright MCP `browser_network_requests` (static=true) on homepage | 2026-07-12 | 210 requests captured |
| SRI on third-party `<script>` tags | Playwright MCP `browser_evaluate` | 2026-07-12 | — |
| robots.txt | WebFetch | 2026-07-12 | — |
| sitemap_index.xml | WebFetch | 2026-07-12 | — |
| Generator meta tag (plugin version) | Playwright MCP `browser_evaluate` | 2026-07-12 | — |
| Plugin versions via `readme.txt` | WebFetch | 2026-07-12 | Elementor, Akismet, CookieYes/cookie-law-info, GiveWP confirmed; Gravity Forms and Smush Pro **not collected — 404** |
| Elementor Pro version | WebFetch | 2026-07-12 | **Not collected — no reliable HTTP status / readme not exposed (expected for premium plugin)** |
| `/readme.html` (WP core version) | WebFetch | 2026-07-12 | **Not collected — HTTP 403** |
| `/.env`, `/wp-config.php`, `/.git/config` | WebFetch | 2026-07-12 | All returned HTTP 403 (blocked, likely WAF rule — not confirmed absent vs. blocked) |
| `/xmlrpc.php` | WebFetch | 2026-07-12 | — |
| `/wp-login.php` | WebFetch | 2026-07-12 | — |
| `/wp-json/wp/v2/users` (user enumeration) | WebFetch | 2026-07-12 | — |
| Donation/contact form structure (CSRF fields) | Playwright MCP `browser_evaluate` (form inspection) | 2026-07-12 | `/donate/` page |
| Hardcoded credential scan in rendered HTML | Playwright MCP `browser_evaluate` (regex scan of `document.documentElement.outerHTML`) | 2026-07-12 | Homepage only |

---

## 1. Transport and TLS

- **HTTPS enforced:** Yes. `http://independentsector.org` resolves to `https://independentsector.org/` (WebFetch auto-upgrades HTTP→HTTPS and reported the final URL as HTTPS; no separate raw redirect-chain tool was available to confirm the exact 301/302 status code).
- **TLS protocols supported (SSL Labs):** TLS 1.2 and TLS 1.3 only. No evidence of TLS 1.0/1.1 in the returned protocol list.
- **SSL Labs grade:** A (both tested endpoints, 141.193.213.11 and 141.193.213.10).
- **Certificate:**
  - Issuer: Let's Encrypt (`CN=YR2, O=Let's Encrypt, C=US`)
  - Signature algorithm: SHA256withRSA
  - Expiry (`notAfter`): unix `1790335898000` ms ≈ 2026-09-24
  - Chain: Let's Encrypt YR2 → ISRG Root YR intermediate → ISRG Root X1
- **HSTS:** Present on both homepage and interior page responses: `strict-transport-security: max-age=2592000`. **max-age is 2592000 seconds (30 days)** — below the recommended ≥1 year (31536000s). No `includeSubDomains` or `preload` directive present.
- **Mixed content:** Not observed. All 210 captured network requests on the homepage load over HTTPS.

## 2. HTTP Security Headers

Homepage (`/`) and interior page (`/about/`) response headers were identical in structure:

| Header | Homepage value | Interior page value | Assessment |
|---|---|---|---|
| `Content-Security-Policy` | **absent** | **absent** | Not set on either page |
| `X-Frame-Options` | `sameorigin` | `sameorigin` | Present |
| `X-Content-Type-Options` | `nosniff` | `nosniff` | Present |
| `Referrer-Policy` | `origin-when-cross-origin` | `origin-when-cross-origin` | Present, less strict than `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `accelerometer=(self), autoplay=(self), camera=(self), encrypted-media=(self), fullscreen=(self), geolocation=(self), gyroscope=(self), magnetometer=(self), microphone=(self), midi=(self), payment=(self), usb=(self)` | same | Present, self-scoped |
| `Strict-Transport-Security` | `max-age=2592000` | `max-age=2592000` | Present, `max-age` too low, no preload |
| `X-XSS-Protection` | `1` | `1` | Deprecated header, no `mode=block`; superseded by CSP (which is absent) |
| `Server` | `cloudflare` | `cloudflare` | Does not disclose origin web server version |
| `X-Powered-By` | `WP Engine` | `WP Engine` | Discloses hosting platform |
| `Cache-Control` | `max-age=600, must-revalidate` | `max-age=600, must-revalidate` | Public page caching, not a sensitive endpoint |

No CSP was found on any page checked. Given the large number of first- and third-party scripts loaded (GTM, Google Ads, Stripe, reCAPTCHA, WordPress.com stats, Doubleclick), there is no CSP scoping what these scripts are permitted to do.

## 3. Cookie Security

Cookies observed on `independentsector.org` and directly-associated third-party domains during an anonymous (non-authenticated) session:

| Cookie | Domain | Secure | HttpOnly | SameSite | Purpose |
|---|---|---|---|---|---|
| `cookielawinfo-checkbox-*` (6 cookies) | independentsector.org | No | No | Lax | Cookie consent plugin (CookieYes/cookie-law-info) preference storage |
| `_gcl_au` | .independentsector.org | No | No | Lax | Google Ads conversion linkage |
| `_ga` | .independentsector.org | No | No | Lax | Google Analytics |
| `_ga_77523ET3D4` | .independentsector.org | No | No | Lax | Google Analytics (GA4 property) |
| `__stripe_mid` | .independentsector.org | Yes | No | Strict | Stripe fraud detection (requires JS access, HttpOnly not expected) |
| `__stripe_sid` | .independentsector.org | Yes | No | Strict | Stripe fraud detection |
| `cf_clearance` | .independentsector.org | Yes | Yes | None | Cloudflare bot/challenge clearance |
| `__cf_bm` | .independentsector.org | Yes | Yes | None | Cloudflare bot management |

No WordPress authentication/session cookie was observed since the session was anonymous (no login performed, per audit scope). No `wp-login.php` submission was attempted.

Findings:
- The GA/Ads cookies (`_ga`, `_ga_77523ET3D4`, `_gcl_au`) and the cookie-consent preference cookies are **not marked `Secure`** even though the site is HTTPS-only — browsers will still only send them over HTTPS in practice on a modern browser once set on an HTTPS origin, but the missing flag is a hardening gap.
- No cookies observed lack `SameSite` entirely; all have `Lax`, `Strict`, or `None` set.

## 4. Dependency Vulnerabilities

No local repository is available for this client (`../CLAUDE.md`: Local site path = N/A), so `npm audit` / `composer audit` could not be run. Versions below were identified from the live site via `readme.txt` files (bundled with the installed plugin package) and the WordPress generator meta tag.

| Component | Version identified | Source |
|---|---|---|
| GiveWP (donation plugin) | 4.14.6 | `<meta name="generator">` tag AND `/wp-content/plugins/give/readme.txt` (`Stable tag: 4.14.6`) — cross-confirmed |
| Elementor (page builder) | 4.0.5 | `/wp-content/plugins/elementor/readme.txt` (`Stable tag: 4.0.5`) |
| Akismet (anti-spam) | 5.7 | `/wp-content/plugins/akismet/readme.txt` (`Stable tag: 5.7`) |
| CookieYes / Cookie Law Info | 3.4.2 | `/wp-content/plugins/cookie-law-info/readme.txt` (`Stable tag: 3.4.2`) |
| Gravity Forms | Not collected — `readme.txt` returned HTTP 404 | — |
| WP Smush Pro | Not collected — `readme.txt` returned HTTP 404 | — |
| Elementor Pro | Not collected — no `readme.txt` exposed (expected for a premium plugin) | — |
| WordPress core | Not collected — `/readme.html` returned HTTP 403 | — |
| Elementor "dialog" internal library | 4.9.3 | Asset URL query string `dialog.min.js?ver=4.9.3` on `/donate/` — this is an internal Elementor sub-library version, not the Elementor core version |

Other plugins/libraries observed loaded but with **no version string exposed** (asset query strings were stripped, likely by a WP Engine asset-caching layer): `socialdriver-framework`, `top-bar`, `give-salesforce`, `give-fee-recovery`, `give-stripe`, `real-time-validation-for-gravity-forms`, `ele-custom-skin`, `ele-custom-skin-pro`, `powerpack-elements`, `unlimited-elements-for-elementor`, `advanced-testimonial-carousel-for-elementor`, `dynamicconditions`, `wp-smush-pro`.

No CVE database lookup tool (Snyk, npm audit, WPScan API) was available in this session, so CVE numbers could not be cross-referenced against these versions — **this must be done separately with WPScan or an equivalent vulnerability database before treating any of the above as confirmed-vulnerable.** No stack traces or version-specific error output suggesting a known-exploited CVE was observed during this pass.

## 5. Information Disclosure

- **`Server` header:** `cloudflare` only — origin server software/version not disclosed.
- **`X-Powered-By` header:** `WP Engine` — discloses hosting platform (not itself a high-risk disclosure, but unnecessary).
- **Generator meta tag:** exposes `Give v4.14.6` in page HTML (see §4).
- **`/.env`, `/wp-config.php`, `/.git/config`:** all returned **HTTP 403 Forbidden**. This indicates the paths are blocked (likely by a WAF/edge rule), not confirmed to be absent from the filesystem. Blocking is the desired outcome from a risk perspective either way.
- **`/xmlrpc.php`:** reachable; `robots.txt` disallows crawling it but does not prevent direct access. This session did not send an XML-RPC request to probe for `system.multicall` (would constitute active testing, out of scope for a passive audit).
- **`/wp-json/wp/v2/users`:** returned **HTTP 401 Unauthorized** — user enumeration via the REST API is blocked (positive finding; default WordPress behavior on many installs is to allow this unauthenticated).
- **Stripe publishable key in page HTML:** a `pk_live_...` key is present in the rendered homepage HTML. This is a **publishable** key (Stripe's client-side key type, distinct from secret `sk_live_` keys) and is expected to be embedded in front-end code by design — not a vulnerability in itself. No `sk_live_` (secret) key, AWS key pattern (`AKIA...`), or other generic `api_key`/`secret`-labeled value was found in the regex scan of the homepage HTML.
- **robots.txt:** discloses `/wp-admin/`, `/trackback/`, `/xmlrpc.php`, `/feed/` as disallowed paths — standard WordPress robots.txt, not itself a disclosure issue since these are well-known default paths.
- No stack traces, PHP warnings, or debug output were observed on the pages visited (homepage, `/about/`, `/donate/`).

## 6. Authentication and Access Control

- **`/wp-login.php`:** returns HTTP 200 with a standard WordPress login form. A math-based CAPTCHA challenge ("eighteen − 9 = ") is present on the form, indicating a bot-mitigation plugin is active. A "Login with Salesforce_Prod_Community" SSO option is also present.
- **Rate limiting on login:** not tested — submitting repeated login attempts would constitute active probing, out of scope for this passive audit. The presence of a CAPTCHA challenge suggests some brute-force mitigation exists, but this is inferred, not confirmed via a tool call.
- **`/wp-json/wp/v2/users`:** blocked (401) — see §5.
- **Admin interface discoverability:** `/wp-login.php` is at the predictable default WordPress path (not renamed/obscured).
- **Hardcoded credentials:** none found in the homepage HTML regex scan (see §5). Scan was limited to the homepage; interior pages and JS bundle contents were not exhaustively scanned.
- **MFA availability:** could not be determined without authenticated access to the admin dashboard — out of scope for a passive, unauthenticated audit.

## 7. Forms and User Input

Donation form at `/donate/` (Gravity Forms, embedded via GiveWP/Gravity Forms integration):

- Form fields observed: `input_7, input_1, input_2, input_5, input_4, gform_submission_method, gform_theme, gform_style_settings, is_submit_1, gform_submit, gform_currency, gform_unique_id, state_1, gform_target_page_number_1, gform_source_page_number_1, gform_field_values, ak_js`
- No field matching common CSRF-token naming patterns (`nonce`, `token`, `_wpnonce`) was found by DOM inspection. Gravity Forms uses `gform_unique_id` and `gform_field_values` (a hashed field-value payload) as part of its submission-integrity mechanism, which is a different mechanism than a classic CSRF token; whether this provides equivalent CSRF protection was not verified (would require inspecting server-side validation, which is not accessible in a passive black-box audit).
- `ak_js` field present — Akismet's JS-timestamp anti-spam check.
- Form `action` is `https://independentsector.org/donate/` (HTTPS) and `method="post"` — submissions are sent over HTTPS.
- reCAPTCHA (`google.com/recaptcha/api.js`) is loaded on the page — spam protection is present.
- File upload fields: none observed on the donation form. Other forms on the site were not exhaustively checked for upload fields in this pass.
- Second form on `/donate/` page is the site search form (`GET` to `/`, field `s`) — standard, low risk.

## 8. Third-Party Scripts

Third-party origins loading scripts on the homepage (from 210 captured network requests): `fonts.googleapis.com`, `use.typekit.net` / `p.typekit.net`, `js.stripe.com`, `m.stripe.network`, `m.stripe.com`, `www.googletagmanager.com`, `www.google-analytics.com` / `analytics.google.com`, `stats.wp.com`, `pixel.wp.com`, `www.google.com` (reCAPTCHA + ads), `www.gstatic.com`, `googleads.g.doubleclick.net`, `ad.doubleclick.net`.

SRI (`integrity` attribute) check on `<script src>` tags pointing off-domain (homepage, 6 found):

| Script | SRI present |
|---|---|
| `googletagmanager.com/gtag/js` | No |
| `gstatic.com/recaptcha/.../recaptcha__en.js` | **Yes** — `sha384-...` |
| `googletagmanager.com/gtm.js` | No |
| `js.stripe.com/v3/` | No |
| `stats.wp.com/e-202628.js` | No |
| `google.com/recaptcha/api.js` | No |

Only the Google reCAPTCHA release script carries an SRI hash; GTM, GA, Stripe.js, and the WordPress.com stats script do not. Stripe.js and GTM/GA are widely accepted as impractical to pin with SRI because their content is expected to change server-side without a corresponding page deploy (this is standard industry guidance from Stripe/Google themselves), so their absence is lower-priority than it would be for a static vendor library.

No CSP is present (§2), so there is no policy-level scoping of what any of these third-party scripts are permitted to do (e.g., restricting `script-src`, `connect-src`, or `frame-src`).

## 9. CMS and Hosting Configuration

- **CMS admin URL:** `/wp-login.php` — default, predictable path.
- **Directory listing:** not directly tested (would require probing a directory path without an index file); no evidence of directory listing encountered incidentally during this audit.
- **Hosting/WAF:** Site is fronted by Cloudflare (`server: cloudflare`, `cf-ray`, `cf-cache-status` headers present; `cdn-cgi/challenge-platform` scripts loaded — Cloudflare's bot/challenge platform is active). `/.env`, `/wp-config.php`, `/.git/config` all blocked with 403, consistent with an active WAF rule set.
- **Exposed CI/CD or deployment artifacts:** `/.git/config` returned 403 (blocked, not confirmed absent). `.github/`, `Dockerfile`, `.travis.yml` were not individually tested in this pass.
- **Sitemap:** `sitemap_index.xml` references `post-sitemap.xml`, `post-sitemap2.xml`, `page-sitemap.xml`, `dei-resource-sitemap.xml`, `team-sitemap.xml`, `resource-sitemap.xml` — all conventional content sitemaps, no internal/admin URLs exposed.
