# Security Audit — Raw Findings — Firefly Tutoring

Collected: 2026-07-18  
URL audited: https://www.fireflytutoring.com  
Platform: Wix (Thunderbolt / Pepyaka CDN)  
Local repo: Not available

---

## Data Sources

| Section | Tool Used | Date | Notes |
|---|---|---|---|
| Transport & TLS — redirect | `curl -sI http://www.fireflytutoring.com` | 2026-07-18 | |
| Transport & TLS — SSL Labs grade | Qualys SSL Labs API v3 (`/analyze`) | 2026-07-18 | Scan triggered fresh; result READY at 83% runtime |
| Transport & TLS — certificate | `openssl s_client` + `openssl x509` | 2026-07-18 | |
| Transport & TLS — protocol list | Qualys SSL Labs API v3 (`all=done`) | 2026-07-18 | |
| HTTP Security Headers — homepage | `curl -sI https://www.fireflytutoring.com` | 2026-07-18 | |
| HTTP Security Headers — contact page | `curl -sI https://www.fireflytutoring.com/contact` | 2026-07-18 | |
| Cookie flags | Playwright `browser_evaluate` → `document.cookie`; curl response headers | 2026-07-18 | HttpOnly cookies not visible via JS (by design) |
| Information disclosure | `curl -sI` response headers; Playwright `browser_network_requests` | 2026-07-18 | |
| Sensitive file exposure | `curl -sI` on `/.env`, `/.git/`, `/admin` | 2026-07-18 | |
| Third-party scripts | Playwright `browser_network_requests` | 2026-07-18 | 202 static requests not shown in output |
| Forms | Playwright `browser_navigate` + `browser_snapshot` on `/inquiries`, `/get-started-at-firefly-tutoring` | 2026-07-18 | |
| Authentication & access control | `curl -sI https://manage.wix.com/dashboard/<siteId>/home` | 2026-07-18 | |
| Dependency vulnerabilities | N/A — no local repo | — | Wix-managed platform; npm audit not applicable |
| robots.txt | `curl -s https://www.fireflytutoring.com/robots.txt` | 2026-07-18 | |
| HSTS preload status | Qualys SSL Labs API (`hstsPreloads` field) | 2026-07-18 | |

---

## 1. Transport and TLS

### HTTP → HTTPS Redirect

```
HTTP/1.1 301 Moved Permanently
location: https://www.fireflytutoring.com/
```

- HTTP redirects to HTTPS with 301. ✓
- Non-www (`https://fireflytutoring.com`) also redirects 301 → `https://www.fireflytutoring.com/`. ✓

### SSL Labs Result

| Field | Value |
|---|---|
| Grade | **A+** |
| hasWarnings | false |
| isExceptional | true |
| TLS protocols | TLS 1.2, TLS 1.3 |
| TLS 1.0 / 1.1 | Not supported ✓ |
| Forward Secrecy | 4 (supported) ✓ |
| Heartbleed | false ✓ |
| RC4 | false ✓ |
| POODLE TLS | 1 (not vulnerable) ✓ |
| DROWN | null (not tested / not applicable) |

### Certificate

| Field | Value |
|---|---|
| Issuer | Let's Encrypt (YR2) |
| Subject | CN=fireflytutoring.com |
| SANs | fireflytutoring.com, www.fireflytutoring.com |
| Not Before | 2026-06-17 |
| Not After | **2026-09-15** (~59 days remaining as of audit date) |

Note: Wix auto-renews Let's Encrypt certificates; this is managed by the platform.

### HSTS

From homepage response header:
```
strict-transport-security: max-age=31556952
```

| Check | Result |
|---|---|
| Present | Yes ✓ |
| max-age | 31,556,952 seconds (~1 year) ✓ |
| `includeSubDomains` | **Absent** ✗ |
| `preload` directive | **Absent** ✗ |
| HSTS preload list (Chrome/Edge/Firefox) | **absent** — site is not in browser preload lists ✗ |

---

## 2. HTTP Security Headers

Captured from homepage and `/contact` response headers. Both pages returned identical security-relevant headers.

### Homepage headers (`curl -sI https://www.fireflytutoring.com`)

```
content-type: text/html; charset=UTF-8
strict-transport-security: max-age=31556952
x-content-type-options: nosniff
cache-control: public,max-age=0,must-revalidate
server: Pepyaka
content-language: en
```

### Security header audit

| Header | Value / Status | Finding |
|---|---|---|
| `Content-Security-Policy` | **ABSENT** | ✗ Missing — no CSP configured |
| `X-Frame-Options` | **ABSENT** | ✗ Missing — clickjacking not blocked |
| `X-Content-Type-Options` | `nosniff` | ✓ Present |
| `Referrer-Policy` | **ABSENT** | ✗ Missing — full URL sent in Referer header to third parties |
| `Permissions-Policy` | **ABSENT** | ✗ Missing — camera, mic, geolocation not restricted |
| `Strict-Transport-Security` | `max-age=31556952` | ✓ Present (but no includeSubDomains) |
| `Server` | `Pepyaka` | ⚠ Reveals Wix's internal server name |
| `Cache-Control` (pages) | `public,max-age=0,must-revalidate` | ✓ No long-lived public caching of page content |

**Note:** All four absent headers (`CSP`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) are platform-controlled on Wix. Site owners cannot set arbitrary response headers without using Wix Velo (custom backend code). Wix's platform does not set these by default.

---

## 3. Cookies

### JS-readable cookies (from `document.cookie` via Playwright)

```
bSession=f1b4e2f8-834f-4312-97ee-4706008dfd6f|1
_gid=GA1.2.2033080428.1784391022
_gcl_au=1.1.151544033.1784392361
XSRF-TOKEN=1784393502|6Ii3-GdVNxgN
_gat_gtag_UA_219936643_1=1
_ga_T863WQ5TJ0=GS2.1.s1784391021$o1$g1$t1784393502$j60$l0$h0
_ga=GA1.1.2141154959.1784391022
```

All cookies above are readable from JavaScript (no `HttpOnly` flag).

### Cookies set in response headers

From `curl -sI` (homepage):
```
set-cookie: ssr-caching=cache#desc=miss#varnish=miss_hit_stale#dc#desc=fastly_g; max-age=20
set-cookie: sec-fetch-unsupported=1; Path=/; Secure; SameSite=Lax;
```

From Wix admin redirect:
```
set-cookie: XSRF-TOKEN=...; Domain=.wix.com; Path=/; Secure; SameSite=Lax
```

### Cookie flag audit

| Cookie | Purpose | `Secure` | `HttpOnly` | `SameSite` | Notes |
|---|---|---|---|---|---|
| `bSession` | Wix visitor session identifier | Not confirmed in header | **No** (JS-readable) | Not confirmed | Session ID accessible to JS |
| `XSRF-TOKEN` | Wix CSRF protection (double-submit pattern) | Yes (on wix.com domain) | **No** (intentionally JS-readable) | Lax | By design for double-submit pattern |
| `ssr-caching` | Server-side cache diagnostic | **No** | **No** | **No** | Set without Secure, HttpOnly, or SameSite |
| `sec-fetch-unsupported` | Wix browser capability flag | Yes | No | Lax | ✓ |
| `_ga`, `_gid`, `_ga_*` | Google Analytics | No (standard) | No (standard) | No | GA cookies intentionally JS-readable |
| `_gcl_au` | Google Ads conversion | No | No | No | Standard GA/Ads cookie |

---

## 4. Dependency Vulnerabilities

Not collected — no local repository available. Site is Wix-managed; npm/composer audit not applicable.

Wix maintains the underlying platform dependencies. Third-party scripts loaded by the site (see Section 8) are outside the scope of npm audit.

**Sentry version observed in network request:**  
`browser.sentry-cdn.com/7.120.3/bundle.tracing.es5.min.js` — version disclosed in URL path.

---

## 5. Information Disclosure

### Server header

```
server: Pepyaka
```

Reveals Wix's internal CDN/server name. Not a critical issue (well-known Wix identifier) but constitutes minor information disclosure.

### Internal IDs exposed in network requests

| Identifier | Value | Exposure point |
|---|---|---|
| `metaSiteId` | `f3126f02-da39-40b2-9928-60752b2b5bd3` | Thunderbolt bundle URLs (public network requests) |
| `siteId` | `7241f8ef-965e-434e-903a-395e8c598a69` | Thunderbolt bundle URLs and manage.wix.com dashboard URL |
| GA4 Measurement ID | `G-T863WQ5TJ0` | Google Analytics collect request |
| GA/UA Property ID | `UA-219936643-1` | Google Analytics cookie name |
| Firebase API key | `AIzaSyA0PqQnuuG-272M3BkwKh9Os8Lhd7TidWU` | `identitytoolkit.googleapis.com` network request |
| Sentry version | `7.120.3` | CDN script URL path |

**Note:** `metaSiteId` and `siteId` are standard Wix public identifiers embedded in all Wix sites. Firebase API keys for client-side auth are by design public (restricted by Firebase security rules). GA Measurement IDs are always public. None of these constitute credentials.

### Sensitive file probe results

| Path | HTTP Status | Assessment |
|---|---|---|
| `/.env` | 400 | Not exposed ✓ |
| `/.git/` | 301 (Wix redirect) | Not exposed ✓ |
| `/admin` | 404 | Not exposed ✓ |
| `/booking` | 404 | Not exposed ✓ |

### robots.txt

```
User-agent: *
Allow: /
Disallow: *?lightbox=

User-agent: AdsBot-Google-Mobile
User-agent: AdsBot-Google
Disallow: /_partials*
Disallow: /pro-gallery-webapp/v1/galleries/*

User-agent: PetalBot
Disallow: /

User-agent: dotbot
Crawl-delay: 10
User-agent: AhrefsBot
Crawl-delay: 10
```

No sensitive internal paths exposed via robots.txt. Wix-generated.

---

## 6. Authentication and Access Control

| Check | Finding |
|---|---|
| Wix admin (`manage.wix.com/dashboard/<siteId>/home`) | 302 redirect to login ✓ — not publicly accessible |
| `/admin` on primary domain | 404 ✓ |
| Wix admin URL guessability | siteId is publicly visible in network requests (Wix standard) |
| Hardcoded credentials in HTML/JS | None found in observable network requests |

Wix manages authentication for the CMS. No direct admin interface is exposed on the primary domain.

---

## 7. Forms and User Input

### `/inquiries` — Contact / Inquiry Form

Fields: First Name, Last Name, Email, Phone, Message (freetext)  
Submission: Wix-managed form handler  
CSRF: `XSRF-TOKEN` cookie present (double-submit cookie pattern, Wix built-in)  
CAPTCHA: **Not observed** in DOM snapshot  
Spam protection: Not visible in DOM  

### `/get-started-at-firefly-tutoring` — Scheduling Request Form

Fields: Primary Phone, Primary Email, Primary Address, Parent/Guardian Name(s), Student's Name, Grade (numeric), Subject checkboxes, Additional information (health/developmental/learning differences), Day/time preference checkboxes.

**This form collects sensitive minor PII:** student name, grade, physical/health/developmental concerns.

CSRF: `XSRF-TOKEN` cookie present (Wix built-in)  
CAPTCHA: **Not observed** in DOM snapshot  
File upload: Not present  

### External scheduling link (Acuity Scheduling)

`https://fireflytutoring.as.me/schedule.php?appointmentType=424435` — external third-party service (Acuity Scheduling / Squarespace). HTTPS enforced.

---

## 8. Third-Party Scripts

Network requests captured via Playwright `browser_network_requests`. Static script requests listed where identifiable.

| Service | Domain | Purpose | SRI | Notes |
|---|---|---|---|---|
| Google Analytics 4 | `analytics.google.com` | Analytics | No | Measurement ID: `G-T863WQ5TJ0` |
| Google Ads conversion | `analytics.google.com` | Conversion tracking | No | UA: `UA-219936643-1` |
| Wix Analytics / Telemetry | `panorama.wixapps.net`, `frog.wix.com` | Wix internal analytics | No | Wix platform |
| Wix Chat (Inbox) | `engage.wixapps.net` | Live chat widget | No | Firebase-backed |
| Firebase (Wix Chat auth) | `identitytoolkit.googleapis.com`, `wix-engage-visitors-prod-0.firebaseio.com` | Auth for chat | No | Firebase API key in requests |
| Instagram embed | `scontent-den2-1.cdninstagram.com` | Instagram feed widget | No | Media content |
| SmartTarget | `smartarget-sp-cache.fra1.digitaloceanspaces.com` | AI personalization / marketing | No | Loads JSON from DigitalOcean Spaces |
| Sentry | `browser.sentry-cdn.com` | Error monitoring | No | Version 7.120.3 disclosed in URL |
| Wix static assets | `static.parastorage.com`, `static.wixstatic.com`, `siteassets.parastorage.com` | Platform JS/CSS | No | Wix CDN |
| Wix profile/members | `static.parastorage.com/services/profile-card-tpa-ooi/` | Member features | No | Wix platform |

**SRI:** No `integrity` attributes observed on any loaded scripts. All scripts rely on CDN integrity without cryptographic verification.

**SmartTarget note:** Settings are loaded from `smartarget-sp-cache.fra1.digitaloceanspaces.com` — a DigitalOcean Spaces bucket. If this bucket were misconfigured or the service were compromised, arbitrary JS could be injected. This is a third-party dependency outside Wix's CDN.

---

## 9. CMS and Hosting Configuration

| Check | Finding |
|---|---|
| CMS admin URL | `manage.wix.com` — predictable but standard for Wix; requires authentication |
| Directory listing | Not applicable (Wix managed, no directory browsing) |
| Hosting platform | Wix (Pepyaka CDN / Fastly) |
| WAF / DDoS | Wix manages at platform level (Fastly CDN + Google GLB) |
| Exposed CI/CD files | None — no `.github/`, `Dockerfile`, etc. (Wix has no repo concept on the live domain) |
| Server-Timing header | `cache;desc=miss, varnish;desc=miss_hit_stale, dc;desc=fastly_g` — minor internal cache topology disclosure |

---

## Console Warnings (Playwright)

| Message | Page | Significance |
|---|---|---|
| `Allow attribute will take precedence over 'allowfullscreen'` | Homepage | Minor HTML warning in embedded iframe |
| `Unrecognized feature: 'vr'` | Homepage | Deprecated feature in `allow` attribute of iframe |
| `` `srcdoc` attribute is not allowed to be set `` (Sentry) | All pages | Sentry trying to set srcdoc on an iframe — browser blocked it |
| Firebase duplicate initialization warning | All pages | Wix Chat loads Firebase twice (Wix platform issue) |
