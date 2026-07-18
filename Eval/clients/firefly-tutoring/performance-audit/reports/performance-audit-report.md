# Performance Audit Report — Firefly Tutoring

**Domain:** fireflytutoring.com  
**Platform:** Wix (Thunderbolt renderer)  
**Audit date:** 2026-07-18  
**Data source:** `data/performance-baseline.md`  
**Lighthouse version:** 13.4.0

---

## Executive Summary

- Mobile performance is **70/100** on the homepage and **83/100** on the test-prep page — meaningfully below where a local service business should be for search and conversion.
- **No CrUX field data exists** for this origin. The site has too little traffic for Google's 28-day dataset to populate real-user Core Web Vitals. This means no Core Web Vitals Assessment pass/fail is available, and no field data will appear in Google Search Console either.
- **LCP fails on mobile** (3.8 s homepage, 2.7 s test-prep) against the 2.5 s Good threshold. **CLS also fails on mobile** (0.105 homepage) against the 0.1 Good threshold. Both are driven by specific, fixable causes.
- **The single largest weight item** is the embedded Instagram feed (2,036 KB, 44% of homepage weight). Removing or replacing it with static images would be the highest-impact change available to the client.
- **A legacy Universal Analytics tag is still loading** alongside GA4 — 129 KB of script for a deprecated property that stopped processing data in July 2023.
- Desktop performance is strong (92 homepage, 99 test-prep) — the delta between mobile and desktop is almost entirely explained by the slow 4G + CPU throttling that PSI applies to the mobile emulation, amplifying JavaScript parsing time and Instagram download weight.
- Most of the JS load (119 of 244 requests, 1,458 KB) is Wix platform code that cannot be changed from the outside. The actionable surface is smaller than the raw numbers suggest.

---

## Architecture of the Problem

### Field vs. Lab

There is no field (CrUX) data for this origin — all metrics in this report are lab measurements. Lab runs Lighthouse with emulated Moto G Power hardware, Slow 4G throttling (1.6 Mbps download, 750 Kbps upload, 150 ms RTT), and a cold cache. This is a worst-case simulation — it measures a first-time visitor on a mid-range phone on a congested mobile network.

Real visitors using fast WiFi or 5G will experience substantially better performance than the lab scores suggest. The desktop scores (92–99) are a closer approximation of what a typical WiFi visitor actually sees.

That said, lab scores matter because: (a) Google uses them as a proxy for real-world performance when field data is absent, and (b) actual mobile visitors on average connections do experience something closer to the lab than to desktop.

### Why Mobile Is 22 Points Behind Desktop

The gap is not mysterious — it has two specific causes:

**1. Instagram feed (2,036 KB of images).** On Slow 4G, downloading 2 MB of images before layout stabilizes is the primary driver of high LCP, high Speed Index, and the CLS failure. On desktop, the same images download faster and the layout impact is smaller.

**2. JavaScript execution on emulated CPU.** PSI mobile emulates a slow CPU (4x CPU throttle). Wix loads 119 script chunks. Parsing and executing ~1.5 MB of JS on a throttled CPU produces 250 ms of Total Blocking Time and 21.5 s TTI. The same JS on desktop CPU runs in 140 ms TBT and 4.0 s TTI.

Neither cause is a mystery about the Wix platform in general — Wix's Thunderbolt architecture is well-engineered for what it is. The problem is the weight of content loaded on the homepage (Instagram feed) and the fact that slow 4G amplifies every byte.

---

## What's Working Well

- **Desktop performance is excellent.** 92/100 homepage, 99/100 test-prep on desktop. For users on modern devices and fast connections, the site performs well.
- **Brotli compression** is active on all responses — HTML transfers at ~175 KB compressed (vs. raw size).
- **HTTP/3** is advertised and supported on the Wix/Fastly CDN stack.
- **Wix CDN (Fastly) is functioning** — homepage HTML was served as a stale cache hit (age: 1997 s) with revalidation in progress. Static assets on parastorage.com are CDN-cached.
- **Font loading is clean.** Lighthouse reports no font-display issues and no FOIT (flash of invisible text). Wix handles font serving well.
- **LCP image is properly prioritized.** The LCP element has `fetchpriority=high` set, and Lighthouse's LCP discovery audit passes — the image is in the initial document, not lazy-loaded.
- **CLS is good on all desktop views** (0.019 homepage, 0.035 test-prep) and on mobile /test-prep (0.044).
- **HTTPS with HSTS** and **SEO score 100** on all pages.

---

## Key Issues

### Issue 1: Instagram Feed Widget — 2,036 KB, CLS Failure

**What the problem is:** The homepage embeds an Instagram feed widget (via a Wix Instagram app) that loads 14+ images from Instagram's CDN (`scontent-*.cdninstagram.com`). These images total 2,036 KB — 44% of the entire homepage weight on desktop, and an even larger fraction on the slower mobile connection measured in this audit.

This widget is the primary driver of:
- **LCP 3.8 s mobile** (LCP element is likely within or behind the Instagram grid)
- **CLS 0.105 mobile** (images trigger layout reflow as they load and dimensions are resolved)
- **Cache issues** (Instagram CDN uses 14-day TTLs; Lighthouse recommends ≥1 year)

**What we can directly change:** Remove the Instagram widget and replace with static images that link to the Firefly Instagram profile. Static images are compressed to appropriate sizes, have defined dimensions (eliminating CLS), and load from parastorage.com with longer cache lifetimes.

**What we have limited control over:** If the feed must remain live and auto-updating, there is no good option within Wix to lazy-load only the below-fold portion of an Instagram widget. The widget loads all images on page load.

**Estimated impact:** Removing the Instagram widget would likely reduce mobile LCP from 3.8 s to ~2.0–2.5 s, eliminate the CLS failure, and reduce total page weight from 7,561 KB to ~5,500 KB on mobile. Mobile performance score could move from 70 to approximately 82–88 depending on what replaces it.

**Client decision needed:** The Instagram feed provides social proof content. Replacing with static images means manual updates when photos change. Client should decide whether the live feed is worth the performance cost.

---

### Issue 2: Legacy Universal Analytics Tag — 129 KB of Dead Script

**What the problem is:** Two Google Analytics tags are loading simultaneously:
- `gtag/js?id=G-T863WQ5TJ0` (GA4, 170 KB) — active
- `gtag/js?id=UA-219936643-1` (Universal Analytics, 129 KB) — **deprecated; UA stopped processing data July 2023**

The UA tag downloads 129 KB of JavaScript, executes it, and the data goes nowhere. Lighthouse flags 63 KB of it as unused.

**What we can directly change:** Remove the UA measurement ID from the Google Tag Manager container. This requires no theme code changes — it is a GTM configuration edit.

**Estimated impact:** -129 KB JS download, -63 KB unused JS, minor reduction in main thread blocking. Small but zero-risk.

---

### Issue 3: Mobile LCP 3.8 s — Threshold Failure

**What the problem is:** LCP (Largest Contentful Paint) is 3.8 s on mobile, against a "Good" threshold of ≤2.5 s. Lab data only — no field data available.

**Root causes (in order of impact):**
1. Instagram feed images adding 2+ MB of download weight before the page stabilizes (see Issue 1)
2. 119 JS chunks loading on Wix's async schedule, delaying rendering
3. Slow 4G bandwidth constraint (1.6 Mbps download under PSI emulation)

**What we can directly change:** Issue 1 is the primary lever. The JS chunk count is a Wix platform characteristic.

**What we have limited control over:** Wix's Thunderbolt JS loading sequence cannot be customized. Wix does its own code-splitting and deferred loading that is not configurable.

---

### Issue 4: CLS 0.105 Mobile Homepage — Threshold Failure

**What the problem is:** Cumulative Layout Shift (CLS) is 0.105 on mobile, just above the 0.1 "Good" threshold. Desktop CLS is 0.019 (Good). The discrepancy suggests the layout shift happens under the slower network conditions where images arrive later and cause more visible reflow.

**Root cause:** Instagram images loading without explicit width/height dimensions. When the browser doesn't know an image's dimensions before it loads, it allocates 0 height and then shifts the page down when the image appears.

**What we can directly change:** If the Instagram widget stays, check whether Wix's Instagram app sets explicit image dimensions. If not, replacing with static images with defined dimensions (or using a `aspect-ratio` CSS approach) eliminates the shift.

---

### Issue 5: High TTI (21.5 s Mobile) — JS Parsing Cost

**What the problem is:** Time to Interactive is 21.5 s on mobile, meaning the page takes over 21 seconds before it responds reliably to user input on a throttled mobile connection. This is primarily a JS parsing/execution cost on a slow CPU.

**Contributing scripts:**
- Wix platform JS (299 ms main thread cost, 1,111 KB) — not controllable
- GTM (69 ms, 299 KB) — partially controllable
- Sentry error monitoring (42 KB) — can be removed
- smartarget.online widget (11 KB, 3.9 ms) — purpose unknown; can likely be removed

**What we can directly change:** Remove the Sentry integration (Wix has its own error monitoring; a third-party Sentry bundle adds 42 KB for a feature Wix already provides). Investigate and remove `smartarget.online` if it is no longer in use.

**What we have limited control over:** The 21.5 s TTI is dominated by Wix's own JS. The TTI will not reach competitive levels on slow 4G regardless of cleanup — this is a Wix platform characteristic on mobile.

---

### Issue 6: Best Practices 54 Desktop — Deprecated API

**What the problem is:** Desktop Best Practices score is 54 (vs. 73 mobile) due to a "Uses deprecated APIs" warning appearing only in the desktop run. This is likely the legacy UA analytics tag calling `document.write()` or another deprecated browser API.

**Fix:** Removing the UA tag (Issue 2) will likely resolve this.

---

### Issue 7: Duplicate React DOM Versions

**What the problem is:** Wix loads both `react-dom@16.14.0` (35 KB) and `react-dom@18.3.1` (42 KB) on the same page — two full copies of React's DOM implementation.

**What we can do:** Nothing. This is Wix's internal versioning transition artifact and is not configurable by site owners.

**Note for future:** This is worth flagging if Wix provides any console or support channel — it wastes ~77 KB of JS that should collapse to a single version.

---

## Tradeoffs and Risks

| Change | Risk / Tradeoff |
|---|---|
| Remove Instagram feed | Loses live social proof content. Manual update required for new photos. Lower performance benefit if client insists on keeping it. |
| Replace with static images | Static images need periodic replacement as Instagram content changes. Client ownership of this process is required. |
| Remove UA tag from GTM | Zero risk. UA data was already unavailable since July 2023. Verify in GTM before removing that nothing else depends on the UA container variable. |
| Remove Sentry | Slightly reduces error visibility, but Wix's built-in error logging covers Wix-side errors. Only matters if a developer is actively monitoring a Sentry project for this site. |
| Remove smartarget.online | Unknown function — audit what this widget does before removing. If it provides a feature the client values (e.g., social sharing buttons, chat, reviews), confirm with client before removal. |

---

## Phased Roadmap

### Phase 1 — Quick Wins (Wix content changes, no code)

| Task | Type | Effort | Impact |
|---|---|---|---|
| Remove legacy UA tag from GTM | GTM config | Low | Low-Medium (removes 129 KB, fixes Best Practices desktop) |
| Remove/investigate smartarget.online widget | Wix app settings | Low | Low |
| Remove Instagram feed widget | Wix app settings | Low | **High** — removes 2 MB, fixes CLS, improves LCP |
| Add static Instagram images to replace feed | Wix editor | Medium | Preserves social proof content |

**Expected score after Phase 1:** Mobile ~82–88 (homepage), CLS from 0.105 → ~0.01, LCP from 3.8 s → ~2.0–2.5 s.

---

### Phase 2 — Image Optimization

| Task | Type | Effort | Impact |
|---|---|---|---|
| Re-upload all Wix images at web-appropriate dimensions | Wix editor | Medium | Medium — reduces image transfer by 139–604 KB |
| Enable Wix's built-in image optimization (WebP, lazy loading) | Wix settings | Low | Medium — Wix serves WebP where supported |
| Add explicit width/height to all images in Wix editor | Wix editor | Medium | Low-Medium — eliminates residual CLS |

**Expected score after Phase 2:** Mobile ~85–90 (homepage), desktop maintains 92+.

---

### Phase 3 — Third-Party Script Cleanup

| Task | Type | Effort | Impact |
|---|---|---|---|
| Disable Wix Chat widget if not actively monitored | Wix app settings | Low | Medium — removes 92 KB JS + 75 KB CSS |
| Disable Sentry integration if not actively used | Wix app settings or GTM | Low | Low — removes 42 KB |
| Audit GTM container for unused tags/triggers | GTM | Medium | Low-Medium — reduces GTM execution time |

**Client decision needed:** Wix Chat and Sentry provide value only if someone is actively monitoring them. If no one is watching the chat inbox or a Sentry project, these are pure cost with no benefit.

**Expected score after Phase 3:** Mobile ~87–92 (depending on which widgets are removed).

---

### Phase 4 — Ongoing Governance

| Task | Type | Effort | Impact |
|---|---|---|---|
| Review any new Wix apps before installing | Process | Low | Ongoing — prevents performance regression |
| Periodically audit GTM container for orphaned tags | Process | Low | Ongoing |
| Re-run PSI mobile after each major content change | Process | Low | Enables monitoring without GSC field data |

---

## Score Expectations

### Current (2026-07-18)

| Page | Mobile | Desktop |
|---|---|---|
| Homepage | 70 | 92 |
| /test-prep | 83 | 99 |

### After Phase 1 (Instagram feed removed + UA tag removed)

| Page | Mobile | Desktop |
|---|---|---|
| Homepage | ~82–88 | ~93–95 |
| /test-prep | 83–85 | 99 |

### After Phase 2 (Image optimization)

| Page | Mobile | Desktop |
|---|---|---|
| Homepage | ~85–90 | ~94–96 |
| /test-prep | 84–87 | 99 |

### After Phase 3 (Script cleanup)

| Page | Mobile | Desktop |
|---|---|---|
| Homepage | ~87–92 | ~95–97 |
| /test-prep | 85–90 | 99 |

### Ceiling

**Mobile performance on a Wix site with active third-party integrations realistically tops out around 88–92** on the homepage. The Wix Thunderbolt platform's JS footprint (~300 ms main thread, 1,100 KB) creates a floor below which no site-level optimization can go. The HTTP Archive Web Almanac puts the median Wix site's mobile performance score at approximately 60–65 — these pages are already above median, and Phase 1 alone would move them well above.

The /test-prep page's desktop 99 and relatively strong mobile 83 show what Wix pages without heavy widget loads can achieve. That's the target state for the homepage after the Instagram feed is removed.

---

## CrUX / Field Data Gap

A significant ongoing constraint: **no field data will appear in PSI or Google Search Console** until the site receives enough traffic for Google to populate CrUX. The threshold is approximately 500–1,000 unique users per 28-day period for a URL, and somewhat higher for origin-level data.

Until field data is available:
- Lab scores (PSI) are the only available performance signal
- Google's Core Web Vitals "Assessment" in Search Console will show "Not enough data"
- Performance improvements cannot be verified against real-user impact

The SEO audit identified that nearly all organic traffic comes from branded searches — approximately 79 estimated clicks/month. At that traffic level, CrUX data will not populate. As organic traffic grows (the primary goal of the SEO remediation work), CrUX data should eventually become available.
