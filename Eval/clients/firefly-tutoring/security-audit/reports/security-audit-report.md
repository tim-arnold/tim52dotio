# Security Audit Report — Firefly Tutoring

**Domain:** fireflytutoring.com  
**Platform:** Wix (Thunderbolt renderer)  
**Audit date:** 2026-07-18  
**Data source:** `data/security-findings.md`  
**Audit type:** Passive — read and observe only. No active exploitation, no authentication bypass.

---

## Executive Summary

- **TLS configuration is strong** — SSL Labs A+, TLS 1.2/1.3 only, HSTS at ~1 year. The certificate (Let's Encrypt, expires 2026-09-15) has ~59 days remaining; Wix should auto-renew but this is worth confirming.
- **Four standard security headers are absent** across all pages: `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`. These are controlled by the Wix platform and cannot be set by the site owner without Wix Velo code — but their absence leaves the site exposed to clickjacking and makes any XSS easier to exploit.
- **No CAPTCHA is present** on the inquiry or scheduling request forms. The scheduling form collects sensitive minor PII (student name, grade, home address, health/developmental concerns), making spam abuse against it a meaningful risk.
- **`bSession` (Wix visitor session cookie) is accessible via JavaScript** — no `HttpOnly` flag. If any XSS were to occur, session tokens could be exfiltrated.
- **SmartTarget**, a third-party AI personalization service, loads a JSON settings file from a DigitalOcean Spaces bucket. If that bucket or service were compromised, arbitrary JS injection into the site would be trivial.
- No exposed credentials, accessible admin interfaces, or sensitive file disclosures were found. The platform-level security posture (CDN, DDoS protection, TLS, redirect enforcement) is solid.

---

## Remediation Checklist

### Critical — Fix Immediately

No Critical-tier findings. No exploitable credentials, no exposed admin interface, no known-exploited CVEs with active exploitation paths were found.

---

### High — Fix Soon

#### H1: Missing `Content-Security-Policy` header

**What:** No `Content-Security-Policy` header on any page.  
**Risk:** Without a CSP, any successful cross-site scripting (XSS) attack — whether through a compromised third-party script, a stored XSS in user-submitted content, or a DOM injection — has no browser-enforced sandbox. All scripts on the page (including from Instagram, SmartTarget, Sentry, Firebase, and Wix's own CDN) operate without origin restrictions.  
**Fix:** Wix does not expose HTTP header controls in the standard dashboard. Options:
1. **Wix Velo (Wix Code):** Implement a Velo backend `http-functions.js` that returns responses with CSP headers, or use Wix's `wix-http-functions` module. This requires activating Wix Developer Mode.
2. **Cloudflare proxy** (if DNS is moved to Cloudflare): Apply CSP as a Cloudflare Transform Rule header — no code changes needed.
3. When the site migrates off Wix, CSP implementation should be a launch blocker.  
**Effort:** 2–4 hours with Velo or Cloudflare; 30 minutes on a configurable platform.

#### H2: Missing `X-Frame-Options` header

**What:** No `X-Frame-Options` header. Pages can be embedded in `<iframe>` elements on any domain.  
**Risk:** Clickjacking — an attacker can overlay the site inside a transparent iframe on a malicious page, tricking users into clicking buttons (e.g., submitting forms, initiating chat) while they believe they are interacting with a different site.  
**Fix:** Same mechanism as H1. Add `X-Frame-Options: SAMEORIGIN` via Velo or Cloudflare. Alternatively, a CSP `frame-ancestors 'self'` directive (from H1) achieves the same protection in modern browsers.  
**Effort:** Solved alongside H1 at no additional effort.

#### H3: No CAPTCHA or spam protection on forms collecting minor PII

**What:** The scheduling request form at `/get-started-at-firefly-tutoring` collects student name, grade, home address, parent names, phone, email, and health/developmental/learning concerns — with no CAPTCHA, honeypot, or visible rate limiting. The inquiry form at `/inquiries` also lacks CAPTCHA.  
**Risk:** Automated spam submissions can fill inboxes with junk, and — more specifically for the scheduling form — the detailed PII fields provide a rich template for social engineering lures if an attacker scrapes the form structure. The site serves minors; spam protection on child data collection forms is a basic duty of care.  
**Fix:** In Wix, add a Google reCAPTCHA or hCaptcha widget to both forms. Wix supports reCAPTCHA natively via the Wix Forms settings panel (no Velo required). Enable "Verify you're human" in form settings.  
**Effort:** 30 minutes per form in Wix dashboard.

---

### Medium — Planned Work

#### M1: Missing `Referrer-Policy` header

**What:** No `Referrer-Policy` header set. The browser's default behavior (varies by browser, but commonly `strict-origin-when-cross-origin` in modern browsers) is used.  
**Risk:** When users navigate from the Firefly Tutoring site to external services (Acuity Scheduling, Instagram, etc.), the full page URL (including any path containing PII or session data) may be sent in the `Referer` HTTP header to the destination. Without an explicit policy, this relies on browser defaults and is inconsistent across older browsers.  
**Fix:** Add `Referrer-Policy: strict-origin-when-cross-origin` via Velo or Cloudflare. Same effort as H1/H2.  
**Effort:** Solved alongside H1 at no additional effort.

#### M2: Missing `Permissions-Policy` header

**What:** No `Permissions-Policy` header. Browser APIs (camera, microphone, geolocation, payment, USB, etc.) are not restricted.  
**Risk:** A compromised third-party script (e.g., SmartTarget, Sentry, Instagram) could in theory request camera or microphone access without the site owner's intent. The policy does not block the actual browser permission prompt, but restricts which origins can even invoke the API.  
**Fix:** Add `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` (or the scope appropriate to the site's features) via the same Velo/Cloudflare approach.  
**Effort:** Solved alongside H1 at no additional effort.

#### M3: `bSession` cookie missing `HttpOnly` flag

**What:** Wix's visitor session cookie (`bSession`) is readable from JavaScript (`document.cookie`). All other Wix session/auth tokens are similarly JS-accessible.  
**Risk:** If any XSS vulnerability exists (even in a third-party script), session tokens can be exfiltrated. Combined with the missing CSP (H1), the blast radius of a successful XSS is larger than it would otherwise be.  
**Fix:** This is a Wix platform decision. Report it to Wix via their support channel. The practical mitigation is resolving H1 (CSP), which eliminates the XSS vector that would make cookie theft possible.  
**Effort:** Cannot be fixed by the site owner directly; resolve H1 to reduce risk.

#### M4: HSTS missing `includeSubDomains`

**What:** The `Strict-Transport-Security` header is present (`max-age=31556952`) but does not include `includeSubDomains`.  
**Risk:** Subdomains of `fireflytutoring.com` (e.g., `mail.fireflytutoring.com`, any Wix-subdomain apps) are not covered by HSTS. An attacker could intercept a subdomain connection to serve a HTTP response before HTTPS is established.  
**Fix:** Wix-controlled; cannot be directly modified. When migrating off Wix, ensure the HSTS header includes `includeSubDomains; preload` and the domain is submitted to the HSTS preload list.  
**Effort:** N/A until platform migration.

#### M5: SmartTarget loads from a DigitalOcean Spaces bucket

**What:** A configuration file is loaded at runtime from `smartarget-sp-cache.fra1.digitaloceanspaces.com`. This is an S3-compatible object storage bucket owned by the SmartTarget service.  
**Risk:** If the SmartTarget service is compromised, misconfigures their bucket permissions, or is discontinued, arbitrary content (including JS payloads) could be served to every visitor. There is no SRI hash to validate the loaded content.  
**Fix:** Evaluate whether SmartTarget is actively providing value. If not, remove it from the site. If retained, no technical mitigation is available within Wix's architecture — the risk is inherent to using the service.  
**Effort:** 30 minutes to evaluate and remove if unused.

---

### Low — Backlog

#### L1: `ssr-caching` cookie missing `Secure` and `SameSite` flags

**What:** The `ssr-caching` cookie (a Wix internal cache diagnostic, `max-age=20`) is set without `Secure` or `SameSite` attributes.  
**Risk:** Minimal — this cookie has a 20-second TTL and carries only cache diagnostic data. On an HTTPS-only site the Secure flag matters less, but it is still a gap.  
**Fix:** Platform-controlled by Wix. Cannot be modified by the site owner.  
**Effort:** N/A.

#### L2: No SRI hashes on third-party scripts

**What:** Scripts loaded from Wix CDNs, Google, Instagram, SmartTarget, and Sentry lack Subresource Integrity (`integrity` attributes).  
**Risk:** If any CDN were compromised, malicious script versions could be served without detection. In practice, Wix controls its own CDN (parastorage.com, wixstatic.com) and SRI is impractical for dynamic scripts with version-stamped URLs.  
**Fix:** Not actionable within Wix's architecture. On a rebuild onto a configurable platform, add SRI for stable third-party scripts (e.g., fonts, analytics).  
**Effort:** N/A on Wix.

#### L3: `server: Pepyaka` reveals internal server identifier

**What:** The `Server` response header exposes `Pepyaka`, Wix's internal server name.  
**Risk:** Minimal. Pepyaka is publicly documented as Wix's CDN server. No version number is disclosed. An attacker who knows it's a Wix site would already know the stack.  
**Fix:** Platform-controlled. Not actionable by site owner.  
**Effort:** N/A.

#### L4: HSTS not in browser preload lists

**What:** `www.fireflytutoring.com` is not in the Chrome, Firefox, Edge, or IE HSTS preload lists.  
**Risk:** On a user's very first request (before any HSTS policy has been cached), HTTP could theoretically be intercepted. In practice, the 301 redirect enforcement means exposure is minimal.  
**Fix:** Add the `preload` directive to HSTS (needs `includeSubDomains` first) and submit to hstspreload.org. Not actionable without platform migration since Wix controls the HSTS header.  
**Effort:** N/A until platform migration; 15 minutes post-migration.

#### L5: `Server-Timing` header discloses CDN topology

**What:** `server-timing: cache;desc=miss, varnish;desc=miss_hit_stale, dc;desc=fastly_virginia-phy_g` reveals the internal CDN routing chain (Fastly + Varnish).  
**Risk:** Very low. Reveals CDN layer stack but no sensitive configuration.  
**Fix:** Platform-controlled.  
**Effort:** N/A.

---

## Platform Constraints Note

Because the site runs on Wix, many of the above findings (H1, H2, M1, M2, M4, L1–L5) are controlled by Wix's infrastructure and cannot be resolved by the site owner directly without:

1. **Wix Velo (Developer Mode):** Enables custom server-side code and HTTP header manipulation. Unlocking Velo is free but changes the site's development model.
2. **Cloudflare proxy:** Place Cloudflare in front of the Wix site. Cloudflare Transform Rules allow injecting arbitrary response headers — including CSP, X-Frame-Options, Referrer-Policy, and Permissions-Policy — without any code changes to Wix.

**The highest ROI fix on the current platform:** Enable Cloudflare as a proxy and add security headers via Transform Rules. This resolves H1, H2, M1, M2 in a single configuration step. Estimated effort: 1–2 hours.

The **CAPTCHA gap (H3)** is independently actionable in the Wix dashboard right now.

---

## Summary Table

| ID | Finding | Severity | Actionable on Wix? | Effort |
|---|---|---|---|---|
| H1 | Missing Content-Security-Policy | High | Via Velo or Cloudflare | 2–4 hrs |
| H2 | Missing X-Frame-Options | High | Via Velo or Cloudflare | Alongside H1 |
| H3 | No CAPTCHA on PII forms | High | Yes — Wix dashboard | 30 min each |
| M1 | Missing Referrer-Policy | Medium | Via Velo or Cloudflare | Alongside H1 |
| M2 | Missing Permissions-Policy | Medium | Via Velo or Cloudflare | Alongside H1 |
| M3 | bSession cookie no HttpOnly | Medium | No (Wix platform) | Mitigated by H1 |
| M4 | HSTS no includeSubDomains | Medium | No (Wix platform) | Post-migration |
| M5 | SmartTarget from S3 bucket | Medium | Remove service | 30 min |
| L1 | ssr-caching cookie flags | Low | No (Wix platform) | N/A |
| L2 | No SRI on third-party scripts | Low | No (Wix platform) | Post-migration |
| L3 | Server header info disclosure | Low | No (Wix platform) | N/A |
| L4 | HSTS not preloaded | Low | No (Wix platform) | Post-migration |
| L5 | Server-Timing CDN disclosure | Low | No (Wix platform) | N/A |
