# Security Audit Report — Independent Sector

**Site:** https://independentsector.org
**Scope:** Passive, unauthenticated audit of the live production site (WordPress on WP Engine, fronted by Cloudflare). No local repository was available, no exploitation or authentication bypass was attempted. Full data and sourcing in `data/security-findings.md`.
**Audience:** Dev team maintaining the existing site (no rebuild planned).

## Executive Summary

- **No `Content-Security-Policy` header is set anywhere on the site**, despite loading a large number of first- and third-party scripts (GTM, Google Ads, Stripe, reCAPTCHA, WordPress.com stats). This is the single biggest gap found.
- TLS configuration is strong: **SSL Labs grade A**, TLS 1.2/1.3 only, valid Let's Encrypt certificate, HTTPS enforced site-wide.
- **HSTS `max-age` is only 30 days** (2,592,000s), well below the recommended 1-year minimum, and has no `preload` or `includeSubDomains` directive.
- Core security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are present and reasonably configured.
- WordPress REST API user enumeration (`/wp-json/wp/v2/users`) is correctly blocked (401) — a common default WordPress weakness that has already been addressed here.
- `/.env`, `/wp-config.php`, and `/.git/config` all return 403 (blocked at the edge) rather than being exposed — good, though this reflects a WAF rule rather than confirmed filesystem hardening.
- Several plugin versions were identified from live `readme.txt` files (GiveWP 4.14.6, Elementor 4.0.5, Akismet 5.7, CookieYes 3.4.2); **no CVE database lookup tool was available in this session**, so these must be checked against WPScan or an equivalent vulnerability database before prioritizing patch work.
- Analytics/ad cookies (`_ga`, `_ga_77523ET3D4`, `_gcl_au`) and the cookie-consent preference cookies are missing the `Secure` flag on an HTTPS-only site.
- A Stripe **publishable** key (`pk_live_...`) is visible in page HTML — this is expected/by-design for Stripe and is not a vulnerability; no secret key or other credential was found exposed.

---

## Remediation Checklist

### Critical (fix immediately)
*None identified in this pass.* No exposed credentials, no missing HTTPS, no confirmed publicly-accessible admin interface beyond the standard login form, and no confirmed-exploited CVEs (dependency versions were identified but not cross-referenced against a CVE database — see High, below).

### High (fix soon)

| What | Risk | Fix | Effort |
|---|---|---|---|
| No `Content-Security-Policy` header on any page | With 12+ third-party script origins loaded (GTM, Stripe, Google Ads, reCAPTCHA, WP.com stats) and no CSP, a successful XSS or a compromised third-party script has no policy-level containment — it can exfiltrate data, inject further scripts, or pivot to other origins unchecked | Add a `Content-Security-Policy` header (via Cloudflare Transform Rules or a WordPress security plugin/mu-plugin) starting in `Content-Security-Policy-Report-Only` mode, scoped to the actual script/style/connect origins in use (see §8 of the data file for the full list), then move to enforcing mode once validated | 1–2 days (needs a monitoring period in report-only mode before enforcing) |
| Cross-reference GiveWP 4.14.6, Elementor 4.0.5, Akismet 5.7, CookieYes 3.4.2 against a CVE database | Unconfirmed — could not be checked in this session (no WPScan/Snyk access) | Run WPScan (or the WPScan API/CLI) or Snyk against these exact versions; patch any Critical/High CVEs found | 1–2 hours to run, effort for any patches depends on findings |
| HSTS `max-age` is 2,592,000s (30 days), no `preload`/`includeSubDomains` | A 30-day window means a downgrade/interception attack window reopens if the header is ever missed on a single response within that period; no HSTS preload means the very first visit from a new browser isn't protected | Raise `max-age` to at least `31536000` (1 year), add `includeSubDomains`, and submit to the HSTS preload list once confirmed stable across all subdomains | 1 hour (config change) + verification |

### Medium (planned work)

| What | Risk | Fix | Effort |
|---|---|---|---|
| Analytics/ad cookies (`_ga`, `_ga_77523ET3D4`, `_gcl_au`) and CookieYes preference cookies lack `Secure` flag | Low direct risk on an HTTPS-only site (browsers still only transmit cookies set on HTTPS origins over HTTPS in modern browsers), but it's a hardening gap and fails strict cookie-security scans | Set `Secure` on these cookies — typically requires a GTM/GA tag configuration change or a `Set-Cookie` rewrite at the edge, since these are largely set by Google's scripts rather than WordPress directly | 2–4 hours |
| `X-XSS-Protection: 1` (legacy header, no `mode=block`) sent instead of relying solely on CSP | Low — this header is deprecated and ignored by modern browsers, but its presence without `mode=block` provides no protection and can be misleading in header scans | Remove `X-XSS-Protection` once CSP is deployed and enforced (High item above); it's dead weight, not a real control | 15 minutes |
| `Referrer-Policy: origin-when-cross-origin` | Leaks the full path of the referring page to cross-origin destinations (as opposed to only the origin) | Tighten to `strict-origin-when-cross-origin` | 15 minutes |
| SRI missing on GTM, Stripe.js, and WordPress.com stats `<script>` tags (only the reCAPTCHA script has SRI) | If any of these third-party CDNs is compromised, the injected script runs with no integrity check | Add SRI hashes where the vendor supports pinned/versioned URLs. Note: Stripe and Google explicitly recommend against SRI for `js.stripe.com`/`googletagmanager.com` because their content changes without a corresponding SRI-hash update on your side — for those two, CSP `script-src` scoping (High item above) is the correct control instead of SRI | 2–4 hours for scripts that can be pinned |
| `X-Powered-By: WP Engine` header discloses hosting platform | Minor reconnaissance aid for an attacker; not sensitive on its own | Suppress the header at the Cloudflare edge (Transform Rule) if WP Engine's dashboard doesn't offer a toggle | 30 minutes |
| Gravity Forms donation form has no field matching standard CSRF-token naming (`nonce`/`token`/`_wpnonce`) | Gravity Forms uses `gform_unique_id` + `gform_field_values` as its own submission-integrity mechanism rather than a classic WP nonce; whether this is equivalent to CSRF protection could not be verified via passive black-box testing | Confirm with the dev team (or Gravity Forms documentation) that server-side submission validation is enabled and not bypassable; no code change may be needed if Gravity Forms' built-in protection is already active | 1 hour to confirm |

### Low (backlog)

| What | Risk | Fix | Effort |
|---|---|---|---|
| Generator meta tag exposes exact GiveWP version (`Give v4.14.6`) | Minor — gives an attacker a starting point for version-specific CVE lookup, though the same version is independently derivable from the public `readme.txt` anyway | Remove the generator meta tag via `remove_action( 'wp_head', 'wp_generator' )` or an equivalent plugin-specific filter | 30 minutes |
| `/wp-login.php` at default path, no visible rate-limiting confirmed | Standard predictable admin path; a CAPTCHA challenge is present (positive), but brute-force rate limiting was not confirmed (not tested — would require active probing, out of scope) | Confirm a login rate-limiting plugin (e.g., Limit Login Attempts) is active in the admin dashboard; consider 2FA for admin accounts if not already enabled | 1 hour to confirm, more if 2FA needs setup |
| `Cache-Control: max-age=600, must-revalidate` on all HTML pages | Not sensitive-page caching (these are public marketing pages); flagged only for completeness since the HANDOFF specifically calls out cache headers on sensitive pages — no admin/auth endpoints were checked in this pass | No action needed unless an auth/admin endpoint is later found without appropriate `no-store` caching | — |

---

## Gaps in This Audit (tools unavailable or blocked)

- Mozilla HTTP Observatory API returned a 502 and securityheaders.com blocked scripted access (403) — header findings above rely on direct Playwright header capture instead, which covers the same ground but wasn't cross-validated against a second scoring tool.
- No CVE database (WPScan, Snyk) was available — dependency versions were identified but **not yet matched against known CVEs**. This is the most important immediate follow-up: run WPScan against the versions listed in `data/security-findings.md` §4.
- WordPress core version (`/readme.html`) is blocked (403) and could not be determined.
- Gravity Forms and WP Smush Pro versions could not be determined (`readme.txt` 404 on both).
- No active/authenticated testing was performed (login brute-force limits, admin dashboard MFA status, directory listing, XML-RPC `system.multicall` probing) — all out of scope for a passive audit per the HANDOFF instructions.
