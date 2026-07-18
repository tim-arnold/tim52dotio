# Performance Baseline Data — Firefly Tutoring

**Domain:** fireflytutoring.com  
**CMS/Platform:** Wix (Thunderbolt renderer, Pepyaka server)  
**Collected:** 2026-07-18  

---

## Data Sources

| Section | Tool Used | Date | Notes |
|---|---|---|---|
| PSI scores + lab CWV — homepage mobile | PageSpeed Insights UI (pagespeed.web.dev, Playwright) | 2026-07-18 | Lighthouse 13.4.0, Moto G Power, Slow 4G |
| PSI scores + lab CWV — homepage desktop | PageSpeed Insights UI (pagespeed.web.dev, Playwright) | 2026-07-18 | Lighthouse 13.4.0, desktop emulation |
| PSI scores + lab CWV — /test-prep mobile | PageSpeed Insights UI (pagespeed.web.dev, Playwright) | 2026-07-18 | Lighthouse 13.4.0, Moto G Power, Slow 4G |
| PSI scores + lab CWV — /test-prep desktop | PageSpeed Insights UI (pagespeed.web.dev, Playwright) | 2026-07-18 | Lighthouse 13.4.0, desktop emulation |
| Field data (CrUX 28-day) | PageSpeed Insights UI | 2026-07-18 | Not collected — origin has no CrUX data (insufficient real-user traffic) |
| Asset inventory + script list | `mcp__dfs-mcp__on_page_lighthouse` (desktop supplemental) | 2026-07-18 | Used for asset data only, not baseline scores |
| Response headers + caching | Playwright browser_network_requests | 2026-07-18 | Captured from live page load |
| PSI API (unauthenticated) | Attempted, not used | 2026-07-18 | API quota exhausted — daily limit hit; switched to browser UI |

---

## 1. PageSpeed Insights Scores

Source: pagespeed.web.dev UI | Lighthouse 13.4.0 | 2026-07-18

### Homepage (`https://www.fireflytutoring.com/`)

| Category | Mobile | Desktop |
|---|---|---|
| **Performance** | **70** | **92** |
| Accessibility | 95 | 91 |
| Best Practices | 73 | 54 |
| SEO | 100 | 100 |

### /test-prep (`https://www.fireflytutoring.com/test-prep`)

| Category | Mobile | Desktop |
|---|---|---|
| **Performance** | **83** | **99** |
| Accessibility | 100 | 95 |
| Best Practices | 73 | 73 |
| SEO | 100 | 100 |

**Note on Best Practices desktop — homepage (54):** Caused by a "Uses deprecated APIs" warning appearing in the desktop run but not mobile. This is distinct from the cross-browser Best Practices score gap.

---

## 2. Core Web Vitals — Lab Data

Source: PSI / Lighthouse 13.4.0 | 2026-07-18  
Mobile: Moto G Power emulation, Slow 4G throttling  
Desktop: Custom desktop throttling

### Homepage

| Metric | Mobile | Status | Desktop | Status |
|---|---|---|---|---|
| FCP | 3.3 s | Needs Improvement | 0.7 s | Good |
| LCP | 3.8 s | **FAIL** (>2.5 s) | 1.4 s | Good |
| TBT | 250 ms | Needs Improvement | 140 ms | Moderate |
| CLS | 0.105 | **FAIL** (>0.1) | 0.019 | Good |
| Speed Index | 5.7 s | — | 1.2 s | — |
| TTI | 21.5 s | Very slow | 4.0 s | — |

### /test-prep

| Metric | Mobile | Status | Desktop | Status |
|---|---|---|---|---|
| FCP | 2.6 s | Needs Improvement | 0.7 s | Good |
| LCP | 2.7 s | Needs Improvement (close) | 0.8 s | Good |
| TBT | 320 ms | **Needs Improvement** | 40 ms | Good |
| CLS | 0.044 | Good | 0.035 | Good |
| Speed Index | 4.2 s | — | 0.9 s | — |
| TTI | 16.4 s | Very slow | 3.1 s | — |

---

## 3. Core Web Vitals — Field Data (CrUX)

Source: PageSpeed Insights | 2026-07-18

**Not collected.** Both pages returned "No Data" in the field data section. The origin (`fireflytutoring.com`) does not have sufficient real-user traffic in Google's 28-day Chrome User Experience Report dataset to populate CrUX metrics.

This means:
- No TTFB, LCP, INP, or CLS field readings are available
- The site cannot currently pass or fail the "Core Web Vitals Assessment" (requires field data)
- Google Search Console's CWV report would also show no data for this origin
- All performance assessment in this audit is based on lab data only

---

## 4. Opportunities and Diagnostics

### Homepage — Mobile

| Issue | Est. Savings | Notes |
|---|---|---|
| Reduce unused JavaScript | 630 KiB | Largest single opportunity |
| Use efficient cache lifetimes | 476 KiB | Third-party assets (Instagram, GA) |
| Improve image delivery | 139 KiB | Unoptimized images |
| Minify JavaScript | 47 KiB | — |
| Reduce unused CSS | 107 KiB | — |
| Duplicated JavaScript | 39 KiB | Two copies of React DOM (v16 + v18) |
| Legacy JavaScript | 12 KiB | Transpilation overhead |
| Total page weight | 7,561 KiB | — |
| Main thread work | 3.3 s | — |
| JS execution time | 1.6 s | — |
| Long tasks | 9 | — |

### Homepage — Desktop

| Issue | Est. Savings | Notes |
|---|---|---|
| Reduce unused JavaScript | 569 KiB | — |
| Improve image delivery | 604 KiB | Larger savings on desktop (higher-res images served) |
| Use efficient cache lifetimes | 246 KiB | — |
| Reduce unused CSS | 108 KiB | — |
| Minify JavaScript | 47 KiB | — |
| Duplicated JavaScript | 30 KiB | — |
| Total page weight | 5,142 KiB | — |
| Main thread work | 2.4 s | — |
| Long tasks | 6 | — |

### /test-prep — Mobile

| Issue | Est. Savings | Notes |
|---|---|---|
| Reduce unused JavaScript | 634 KiB | — |
| Reduce unused CSS | 101 KiB | — |
| Use efficient cache lifetimes | 35 KiB | — |
| Duplicated JavaScript | 37 KiB | — |
| Legacy JavaScript | 12 KiB | — |
| Total page weight | 2,668 KiB | — |
| Main thread work | 3.1 s | — |
| JS execution time | 1.7 s | — |
| Long tasks | 9 | — |

**Note:** /test-prep (2,668 KiB) is 65% lighter than homepage (7,561 KiB) primarily because it has no Instagram feed widget.

---

## 5. Asset Inventory

Source: `on_page_lighthouse` (DataForSEO desktop, supplemental) | 2026-07-18

### Resource Summary (homepage)

| Type | Requests | Transfer Size |
|---|---|---|
| script | 119 | 1,458 KB |
| image | 14 | 1,947 KB |
| other | 97 | 597 KB |
| document | 2 | 192 KB |
| font | 5 | 145 KB |
| media | 1 | 128 KB |
| stylesheet | 6 | 97 KB |
| **Total** | **244** | **4,564 KB** |

### Third-Party Entity Summary

| Entity | Main Thread Time | Transfer Size | Controllable? |
|---|---|---|---|
| Instagram | 0 ms | 2,036 KB | Yes — remove/replace feed widget |
| Wix | 299.8 ms | 1,111 KB | No (platform) |
| Google Tag Manager | 69.0 ms | 299 KB | Partially — can remove UA tag |
| Sentry | 6.1 ms | 42 KB | Yes — can disable |
| Google Analytics | 7.3 ms | 23 KB | Partially (via GTM) |
| smartarget.online | 3.9 ms | 11 KB | Yes — unknown purpose |
| digitaloceanspaces.com | 0 ms | 1.5 KB | Unknown |

**Instagram is 44% of total page weight** (2,036 KB) from the homepage's embedded Instagram feed widget. It contributes 0 ms to main thread work (images load async) but adds significant download weight and is a likely contributor to mobile CLS (layout reflow as images load).

### Top Scripts by Transfer Size

| Size (KB) | Script | Controllable? |
|---|---|---|
| 170.1 | googletagmanager.com/gtag/js?id=G-T863WQ5TJ0 (GA4) | Via GTM |
| 129.4 | googletagmanager.com/gtag/js?id=UA-219936643-1 (legacy UA) | **Remove — UA deprecated** |
| 116.3 | parastorage.com … ProGallery_Default bundle | No (Wix) |
| 92.1 | parastorage.com … chat-widget.bundle.min.js | Remove if not used |
| 63.9 | parastorage.com … main bundle | No (Wix) |
| 56.2 | parastorage.com … group_6 chunk | No (Wix) |
| 56.2 | parastorage.com … ProfileCardViewerWidget | No (Wix) |
| 42.3 | parastorage.com … thunderbolt-commons | No (Wix) |
| 42.1 | parastorage.com unpkg/react-dom@18.3.1 | No (Wix) |
| 40.0 | browser.sentry-cdn.com … Sentry bundle | Can disable in Wix |
| 35.4 | parastorage.com unpkg/react-dom@16.14.0 | No (Wix) |

**Two React DOM versions loading simultaneously:** react-dom@16.14.0 (35 KB) and react-dom@18.3.1 (42 KB) — Wix's internal versioning issue, not controllable.

### Top Scripts by Unused Bytes

| Wasted (KB) | Total (KB) | Script |
|---|---|---|
| 71.0 | 170.0 | GA4 tag |
| 63.0 | 129.0 | Legacy UA tag |
| 51.4 | 116.1 | ProGallery bundle |
| 36.9 | 56.0 | ProfileCardViewerWidget |
| 34.5 | 56.0 | group_6 chunk |
| 28.7 | 40.0 | Sentry bundle |
| 25.0 | 63.1 | main bundle |
| 24.6 | 29.0 | motion/animation chunk |

### Stylesheets (all 6)

| Size (KB) | Stylesheet |
|---|---|
| 74.8 | chat-widget.min.css (Wix chat) |
| 16.0 | user-site-fonts/v19/languages.css |
| 3.4 | Helvetica/fontFace.css |
| 1.7 | Google Fonts (Lobster, Enriqueta, Josefin Slab) |
| 1.1 | pro-gallery-native-layout-fixer (first-party) |
| 0.4 | main-chat-widget chunk CSS |

### Fonts (5 files)

| Format | Notes |
|---|---|
| Wix-hosted web fonts | 5 files, 145 KB total |
| font-display | Passing (no flash-of-invisible-text issue) |
| LCP discovery | Passing (fetchpriority=high on LCP image) |

### Render-Blocking Resources

Lighthouse reported the render-blocking insight category but returned no itemized URL list (details object had no items array). Wix dynamically defers most of its JS load; the primary blocking happens via the Wix Thunderbolt SSR bootstrap phase rather than traditional parser-blocking `<script>` tags.

---

## 6. Cache and Infrastructure

Source: Playwright browser_network_requests | 2026-07-18

### CDN and Server

| Component | Value |
|---|---|
| Server | Pepyaka (Wix proprietary) |
| CDN | Fastly (via Google infrastructure — `via: 1.1 google`, `x-served-by: cache-iad-*`) |
| Compression | Brotli (`content-encoding: br`) |
| HTTP version | HTTP/3 advertised (`alt-svc: h3=":443"`) |
| TLS | HTTPS with HSTS (`strict-transport-security: max-age=31556952`) |
| Cloudflare | Not present (no CF-Cache-Status header) |

### HTML Document Cache Headers

| Header | Homepage | /test-prep |
|---|---|---|
| cache-control | `public, max-age=0, must-revalidate` | `public, max-age=0, must-revalidate` |
| x-cache | HIT | MISS |
| x-cache-status | MISS (stale-while-revalidate in progress) | MISS |
| age | 1997 s | 0 s |
| server-timing | `varnish;desc=miss_hit_stale, dc;desc=fastly_g` | `varnish;desc=miss_miss` |
| etag | Present (weak) | Present (weak) |

**Pattern:** `max-age=0, must-revalidate` on HTML means every browser request revalidates with the CDN. The CDN itself (Varnish/Fastly) caches the page and serves stale while refreshing — this is a standard Wix CDN configuration. Static assets (JS, CSS, images on parastorage.com) have longer CDN TTLs but are under Wix's control.

### Cache Issues

Instagram CDN images on the homepage have 14-day cache TTLs (Lighthouse recommends ≥1 year for static assets). Google Analytics scripts have 30-min–2-hour TTLs. All third-party — not controllable by the site owner.

---

## 7. Notes on Missing Data

| Item | Status | Reason |
|---|---|---|
| CrUX 28-day field data | Not collected | Insufficient origin traffic in Google's dataset |
| PSI API | Not used | Unauthenticated quota exhausted; browser UI used instead |
| Mobile asset network waterfall | Not collected | DataForSEO Lighthouse runs desktop only |
| Specific render-blocking URLs | Not collected | Lighthouse returned category flag without item list |
| TTFB field measurement | Not collected | No CrUX data available |
