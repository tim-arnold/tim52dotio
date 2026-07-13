# Security Audit (Pre-Redesign)

## Context

You are conducting a security audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL, platform, local path, and any relevant context.

The goal is to document the security posture of the existing site so the dev team knows what vulnerabilities to avoid replicating, what to fix before decommissioning, and what secure patterns to carry forward into the rebuild.

If a local path is available in `../CLAUDE.md`, use it as the primary source. If not, infer what you can from the live site and flag gaps clearly.

**Do NOT modify any files, exploit any vulnerabilities, or attempt authentication bypass.** Read and observe only. This is a passive audit.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Recommended Tools

The following specialized tools are worth considering depending on what's available and authorized:

| Tool | Type | What it provides |
|---|---|---|
| **Mozilla Observatory** | Free / API | HTTP headers, HTTPS config, CSP, cookies, redirects — structured score |
| **SSL Labs (Qualys)** | Free / API | TLS configuration, cipher suites, certificate chain, HSTS |
| **securityheaders.com** | Free | HTTP security headers scan with graded report |
| **Google Safe Browsing** | Free / API | Checks if the domain is flagged for malware or phishing |
| **Snyk** | Free tier / CLI | Dependency vulnerability scanning against CVE databases — integrates with `npm`, `composer`, etc. |
| **npm audit / composer audit** | Built-in CLI | First-pass dependency CVE scan; no external account needed |
| **retire.js** | CLI / browser ext | Detects known-vulnerable JS libraries loaded on the live page |
| **OWASP ZAP** (passive mode) | Free / local | Passive crawl of the live site — flags headers, cookies, information disclosure without active probing |
| **Playwright MCP** | Available | Browser automation for live inspection: headers, cookies, forms, JS errors, mixed content |
| **DataForSEO MCP** | Available | Lighthouse audit includes some security-relevant checks (HTTPS, mixed content) |

> For most audits, Mozilla Observatory + SSL Labs + `npm audit` + a Playwright pass covers 80% of findings without requiring additional tool setup. Add Snyk or OWASP ZAP for higher-risk clients or when the dependency tree is large.

## Deliverables

- `data/security-findings.md` — structured findings from all passes
- `reports/security-audit-report.md` — dev-team report with prioritized issue list and pre-launch security checklist

---

## What to Audit

### 1. Transport and TLS

- Is HTTPS enforced on all pages? Any HTTP → HTTPS redirect gaps?
- TLS version — is TLS 1.0 or 1.1 still supported? (Should be TLS 1.2+ only)
- Certificate validity, issuer, and expiry date
- HSTS — is `Strict-Transport-Security` set? Is `max-age` sufficient (≥ 1 year)? Is it preloaded?
- Mixed content — any HTTP resources loaded on HTTPS pages?

### 2. HTTP Security Headers

Check response headers on the homepage and at least one interior page. Flag any that are absent or misconfigured:

| Header | What to check |
|---|---|
| `Content-Security-Policy` | Present? Allows `unsafe-inline` or `unsafe-eval`? Permissive wildcards? |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` set? (Prevents clickjacking) |
| `X-Content-Type-Options` | `nosniff` set? |
| `Referrer-Policy` | Set? `strict-origin-when-cross-origin` or stricter preferred |
| `Permissions-Policy` | Restricts camera/mic/geolocation appropriately |
| `Strict-Transport-Security` | Present with sufficient `max-age` |
| `Cache-Control` on sensitive pages | Auth pages, API endpoints — should not be publicly cached |

### 3. Cookie Security

For any cookies set by the site or third-party scripts:
- `Secure` flag — only transmitted over HTTPS?
- `HttpOnly` flag — inaccessible to JavaScript (prevents XSS cookie theft)?
- `SameSite` attribute — `Strict` or `Lax` to prevent CSRF?
- Session cookies — do they expire appropriately?

### 4. Dependency Vulnerabilities

If a local repo is available:
- Run `npm audit` (or `composer audit`) and capture the output
- Identify packages with Critical or High CVEs
- Note any packages that are EOL or abandoned (no releases in 2+ years)
- Flag packages with known security histories that should be reviewed even without active CVEs

If only the live site is available:
- Use retire.js or check the browser DevTools Sources panel to identify JS library versions
- Cross-reference against known CVE databases

### 5. Information Disclosure

Check for unintentional exposure of sensitive information:
- Server version in `Server` response header (e.g., `nginx/1.18.0`)
- Framework or CMS version in response headers or HTML comments
- Stack traces, debug output, or verbose error messages visible on the live site
- API endpoints or internal URLs exposed in HTML source, JS bundles, or robots.txt
- Sensitive file paths exposed in error messages or sitemaps
- `/.env`, `/config`, `/.git`, `/wp-config.php` — are any accidentally accessible?

### 6. Authentication and Access Control

- Are any admin interfaces publicly accessible without authentication? (e.g., `/admin`, `/wp-admin`, CMS dashboards)
- Is there rate limiting on login forms?
- Are password reset flows secure (no username enumeration)?
- Is multi-factor authentication available for admin accounts?
- Review source code for hardcoded credentials, API keys, or tokens — these must be rotated immediately

### 7. Forms and User Input

- Are forms protected against CSRF (token present in POST forms)?
- Are file upload fields present? Do they restrict file types server-side?
- Are there any obvious XSS vectors (user-controlled content rendered without escaping)?
- Is spam protection in place on public forms (CAPTCHA, honeypot, server-side rate limiting)?
- Are form submissions sent over HTTPS?

### 8. Third-Party Scripts

- List all third-party scripts loaded (GTM, analytics, chat, ad pixels, etc.)
- Are third-party scripts loaded from trusted CDNs with Subresource Integrity (SRI) hashes?
- Does CSP appropriately scope what these scripts can do?
- Are any scripts loading other scripts dynamically (GTM tag injection)?

### 9. CMS and Hosting Configuration

- Is the CMS admin URL at a predictable path (`/admin`, `/wp-admin`)?
- Are directory listings disabled on the server?
- Is the hosting platform (Cloudflare, Netlify, Vercel, etc.) security configuration correct? (WAF rules, DDoS protection, bot management)
- Are there any exposed deployment artifacts or CI/CD files (`.github/`, `Dockerfile`, `.travis.yml`)?

---

## Pre-Launch Security Checklist

The report must include this checklist — the dev team should complete it before the rebuilt site goes live:

- [ ] HTTPS enforced on all routes; HTTP redirects to HTTPS
- [ ] HSTS header set with `max-age` ≥ 31536000
- [ ] TLS 1.2+ only; TLS 1.0/1.1 disabled
- [ ] `Content-Security-Policy` configured and tested
- [ ] `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` set
- [ ] All cookies have `Secure`, `HttpOnly`, and `SameSite` attributes
- [ ] No credentials or API keys committed to source control
- [ ] Environment variables used for all secrets; `.env` in `.gitignore`
- [ ] `npm audit` / `composer audit` run; no Critical or High CVEs unaddressed
- [ ] No sensitive files publicly accessible (`.env`, `.git`, debug endpoints)
- [ ] Admin interfaces protected by authentication + ideally 2FA
- [ ] CSRF protection on all state-changing forms
- [ ] File upload validation enforced server-side
- [ ] Third-party scripts reviewed and scoped in CSP
- [ ] Directory listings disabled
- [ ] Error pages do not expose stack traces or server version
- [ ] Security headers verified with Mozilla Observatory score ≥ B

---

## Formatting Notes

- Use markdown tables for headers, cookies, dependencies, and findings
- Executive summary: 5–8 bullets covering the most critical issues
- Be specific: header names and values, package names and CVE numbers, file paths
- Severity tiers: **Critical** (exploitable now), **High** (exploitable with low effort), **Medium** (requires attacker access or chaining), **Low** (best-practice gap, minimal direct risk)
- Cross-reference the technology audit where dependency versions or hosting configuration are mentioned
