# SEO Technical Baseline — Firefly Tutoring

**Domain:** fireflytutoring.com  
**Platform:** Wix (Thunderbolt renderer)  
**Audit date:** 2026-07-18  
**Data source:** `data/baseline-data.md`

---

## Executive Summary

- The site is technically sound in the basics (HTTPS, canonical tags, no indexation blocks) and scores 100/100 on Lighthouse SEO — but that score measures crawlability, not ranking potential.
- Four of five audited pages have no H1 tag. No pages have structured data. Both are significant omissions for a local service business.
- Homepage Core Web Vitals: LCP at 1.6 s (needs improvement), driven by a 4,562 KiB page weight and 604 KiB of unoptimized image delivery.
- All pages carry render-blocking resources (3 scripts, 19–26 stylesheets) — a Wix platform constraint with limited client-side remediation.
- Two broken pages confirmed in backlink data; one URL has a baked-in typo in its canonical.

---

## Core Web Vitals

Source: `on_page_lighthouse` | Lighthouse 13.4.0 | desktop mode

| Metric | Homepage | /test-prep | Threshold |
|---|---|---|---|
| LCP | 1.6 s | 0.8 s | Good: ≤2.5 s / NI: ≤4.0 s |
| CLS | 0.018 | 0.009 | Good: ≤0.1 |
| TBT (INP proxy) | 10 ms | 0 ms | Good: ≤200 ms |
| Performance score | 90 | 99 | — |
| Accessibility score | 91 | 95 | — |
| SEO score | 100 | 100 | — |

**Homepage LCP of 1.6 s is currently in "Needs Improvement" territory.** The primary cause is total page weight (4,562 KiB) with 604 KiB savings potential from image optimization. The test-prep page (99 perf) demonstrates what the site is capable of on lighter pages.

**Accessibility failures on both pages (platform-generated):**
- Color contrast: 7 Wix navigation elements — Wix dropdown menu rendering; not directly editable without a Wix theme-level change.
- Heading order: H6 in footer — Wix footer component.

**One fixable accessibility issue:** An icon-only link to `/contact` on the homepage (anchor `a.IT88M3` in component `comp-kaon1dlv`) has no text and no `aria-label`. This is a Wix-editable component — adding visible text or an aria-label to that link resolves the failure.

**Best practices failures (both pages):** Wix chat widget (`engage.wixapps.net`) sets 2 third-party cookies (`bSession`, `XSRF-TOKEN`). Not removable without disabling the Wix chat widget entirely.

---

## On-Page SEO Audit

Source: `on_page_instant_pages` | 2026-07-18

### Title Tags

| URL | Title | Length | Issues |
|---|---|---|---|
| / | TUTORING \| Firefly Tutoring \| Seattle | 37 chars | Leading word "TUTORING" is generic; no primary keyword |
| /test-prep | TEST PREP \| Firefly Tutoring | 28 chars | **Too short** — below recommended 30–60 chars |
| /team | TEAM \| Firefly Tutoring | 23 chars | **Too short** — below recommended minimum |
| /typing-club-registraion | Typing Club Summer Camp \| Firefly Tutoring \| Seattle | 52 chars | OK length; URL typo not reflected in title |
| /online-tutoring | ONLINE TUTORING \| Firefly Tutoring | 34 chars | Acceptable |

All-caps keyword prefix pattern is stylistic (Wix default), not technically harmful, but reduces click appeal in SERPs.

### Meta Descriptions

| URL | Length | Issues |
|---|---|---|
| / | 286 chars | Slightly long but acceptable |
| /test-prep | 186 chars | OK |
| /team | 245 chars | OK |
| /typing-club-registraion | 94 chars | **Too short** — recommended 120–160 chars |
| /online-tutoring | 300+ chars (truncated) | **Likely over-length** — Google truncates at ~155–160 chars |

### Heading Structure

| URL | H1 | H2 | H3 | Issue |
|---|---|---|---|---|
| / | **None** | Blank whitespace | "K-12 one-on-one tutoring…" | No H1; H3 is doing H1's job |
| /test-prep | **None** | "Test Prep" | — | No H1; H2 is only 2 words |
| /team | "Online ANd In-Person tutoring Available NOw!" (×2) | "Team" | — | H1 is wrong content (off-topic CTA), duplicated |
| /typing-club-registraion | **None** | — | — | H5 is doing all work |
| /online-tutoring | **None** | — | — | H5s only |

**Root cause:** Wix assigns heading levels visually, not semantically. Editors chose H3/H4/H5 for visual size, leaving H1 unused. This is a content editing task, not a platform limitation — every heading level is available in Wix's editor.

### Structured Data

**None detected on any page.** For a local service business, missing schema types include:

| Schema Type | Value |
|---|---|
| `LocalBusiness` / `EducationalOrganization` | Name, address, phone, hours, geo coordinates |
| `Service` | Individual service types (tutoring, test prep, etc.) |
| `FAQPage` | Common parent questions about tutoring services |
| `Person` | Individual tutor profiles on /team |
| `BreadcrumbList` | Site navigation |

Wix does not auto-generate structured data for service businesses. This requires manual addition via Wix's custom JSON-LD tool or a third-party app.

### Canonical Tags

All five audited pages have correct self-referencing canonical tags. **One issue:** `/typing-club-registraion` has a typo baked into its canonical (`registraion` instead of `registration`). The canonical must be updated when the URL is corrected, or the redirect chain will canonicalize to the wrong URL.

### Internal Link Structure

All pages show 17–18 internal links (sitewide navigation). No page-specific contextual internal links were detected beyond navigation. The site does not appear to link between content pages (e.g., /test-prep does not link to /online-tutoring).

### Mixed Content

`/team` page has HTTPS-to-HTTP links flagged (`https_to_http_links: true`). These are likely external resource links or outdated hardcoded URLs in Wix components. Should be audited and corrected.

---

## Page Load Performance

Source: `on_page_instant_pages` page_timing data | 2026-07-18

| URL | DOM Complete | TTI | Notes |
|---|---|---|---|
| / | 1,803 ms | 1,576 ms | Acceptable |
| /test-prep | 5,029 ms | 2,888 ms | **Slow — high loading time flag** |
| /team | 3,694 ms | 1,403 ms | Slow — large DOM (752 KB) |
| /typing-club-registraion | 4,465 ms | 1,802 ms | **Slow** |
| /online-tutoring | 1,115 ms | 1,102 ms | Fast |

Three of five pages have `high_loading_time` flagged. Wix's render-blocking resource count (3 scripts, 19–26 stylesheets per page) is the primary driver. This is a platform constraint; options are limited to image optimization and Wix Performance settings (lazy loading, speed optimization).

---

## Image Optimization

- No `alt` text on any image across all five audited pages.
- No `title` attributes on images.
- Homepage: 13 images, 604 KiB savings potential (Lighthouse).
- All other pages: 1–2 images.

Alt text absence is both an accessibility failure and an SEO gap — images cannot be indexed with descriptive keywords.

---

## Security and Hosting

| Check | Status |
|---|---|
| HTTPS | ✓ All pages |
| Mixed content | ⚠ /team page has HTTP links |
| Third-party cookies | Wix chat widget (engage.wixapps.net) |
| CMS | Wix.com (Pepyaka server) |
| IP | 34.149.87.45 (Google Cloud / Wix infrastructure) |
| Cache | All pages marked cacheable |

---

## Broken Pages

Backlink summary reports 2 broken pages on the domain. Specific URLs not returned by this tool — a full site crawl (via Wix's built-in SEO tools or a third-party crawler) is needed to identify them. One likely candidate: the old `/Schedule` path referenced in a 2019 backlink anchor (`http://fireflytutoring.com/Schedule`) — this URL no longer exists and likely returns a 404.

---

## Mobile Readiness

Not directly tested in this audit (Lighthouse ran in desktop mode via DataForSEO's `on_page_lighthouse`). Wix sites are responsive by default. The render-blocking resource counts are the same on mobile, and the 4,562 KiB homepage weight would be more impactful on mobile connections. A separate mobile Lighthouse run is recommended.
