# SEO Baseline Data — Firefly Tutoring

**Domain:** fireflytutoring.com  
**Collected:** 2026-07-18  
**Auditor:** Claude Code (DataForSEO MCP, GSC MCP)

---

## Data Sources

| Section | Tool Used | Date | Notes |
|---|---|---|---|
| Domain rank overview | `dataforseo_labs_google_domain_rank_overview` | 2026-07-18 | US/EN, status 20000 |
| Ranked keywords (top 100 by volume) | `dataforseo_labs_google_ranked_keywords` | 2026-07-18 | Returned 38 items — full universe at this tier |
| Full keyword inventory (limit 1000) | `dataforseo_labs_google_ranked_keywords` | 2026-07-18 | Returned 29 items — API returned fewer than limit; see full-keyword-inventory.md |
| Top-10 rankings filter | `dataforseo_labs_google_ranked_keywords` (filter rank_group ≤ 10) | 2026-07-18 | 1 keyword returned |
| Backlink summary | `backlinks_summary` | 2026-07-18 | Status 20000 |
| Referring domains | `backlinks_referring_domains` | 2026-07-18 | Status 20000, 38 domains returned (full universe) |
| Anchor text | `backlinks_anchors` | 2026-07-18 | Status 20000, 16 anchor entries returned |
| AI/LLM mentions — top domains | `ai_opt_llm_ment_top_domains` | 2026-07-18 | Status 20000, empty result |
| AI/LLM mentions — top pages | `ai_opt_llm_ment_top_pages` | 2026-07-18 | Status 20000, empty result |
| On-page audit — 5 pages | `on_page_instant_pages` | 2026-07-18 | Status 20000 all pages |
| Lighthouse — homepage | `on_page_lighthouse` | 2026-07-18 | Lighthouse 13.4.0 |
| Lighthouse — /test-prep | `on_page_lighthouse` | 2026-07-18 | Lighthouse 13.4.0 |
| Google Search Console | `mcp-gsc list_properties` | 2026-07-18 | Not collected — fireflytutoring.com not in verified GSC properties for this account |
| Competitor gap — domain list | `dataforseo_labs_google_competitors_domain` | 2026-07-18 | Status 20000, 9 competitors returned |
| Competitor gap — vs. varsitytutors.com | `dataforseo_labs_google_domain_intersection` | 2026-07-18 | 50 gap keywords returned |
| Competitor gap — vs. sylvanlearning.com | `dataforseo_labs_google_domain_intersection` | 2026-07-18 | 50 gap keywords returned |

---

## 1. Domain Rank Overview

Source: `dataforseo_labs_google_domain_rank_overview` | US/EN | 2026-07-18

| Metric | Value |
|---|---|
| Total ranked keywords (organic) | 14 |
| Estimated traffic value (ETV) | 79.16 clicks/mo |
| Estimated paid traffic equivalent | $791.43/mo |
| Positions 2–3 | 1 |
| Positions 11–20 | 1 |
| Positions 21–30 | 1 |
| Positions 31–40 | 4 |
| Positions 41–50 | 4 |
| Positions 61–70 | 3 |
| Keywords trending up | 6 |
| Keywords trending down | 2 |
| New keywords | 3 |

**Note:** Domain rank overview shows 14 keywords; the ranked keywords endpoint returned 38 across both calls. The overview figure reflects DataForSEO's domain-level index count; individual keyword calls capture a broader set including lower-confidence rankings.

---

## 2. Ranked Keywords — Top 100 by Volume

Source: `dataforseo_labs_google_ranked_keywords` limit 100, sorted by volume desc | US/EN | 2026-07-18

Full list in `data/full-keyword-inventory.md`. Summary of top entries:

| Keyword | Volume | Rank (group) | Rank (absolute) | URL | ETV | Intent |
|---|---|---|---|---|---|---|
| firefly tutors | 480 | 2 | 6 | / | 77.76 | Navigational |
| firefly testing | 390 | 26 | 31 | /test-prep | 0.82 | Informational (not brand-relevant) |
| shiery tutoring | 390 | 35 | 39 | / | 0.82 | Informational |
| seattle tutoring jobs | 210 | 39 | 43 | / | 0.44 | Informational/Commercial |
| tutor jobs seattle | 210 | 58 | 65 | / | 0.44 | Informational |
| tutoring jobs in seattle | 210 | 44 | 50 | / | 0.44 | Informational |
| tutoring jobs seattle | 210 | 49 | 55 | / | 0.44 | Informational |
| seattle tutoring | 170 | 15 | 21 | / | 0.87 | Commercial |
| tutor in seattle | 170 | 13 | 19 | / | 1.00 | Commercial |
| fairfax tutoring | 140 | 59 | 65 | / | 0.29 | Navigational (VA — not relevant) |
| math tutoring seattle | 110 | 26 | 33 | / | 0.23 | Commercial |
| tutoring for tomorrow | 70 | 36 | 40 | / | 0.15 | Informational |
| bellevue tutoring | 50 | 61 | 71 | / | 0.11 | Navigational |
| firefly seattle | 50 | 19 | 23 | /team | 0.14 | Navigational |
| in person typing classes near me | 50 | 70 | 81 | /typing-club-registraion | 0.11 | Commercial |
| typing camp | 40 | 22 | 24 | /typing-club-registraion | 0.09 | Informational |
| university tutoring seattle | 40 | 51 | 57 | / | 0.08 | Navigational |
| tutoring lancaster pa | 40 | 41 | 46 | /online-tutoring | 0.08 | Informational (PA — not relevant) |
| seattle tutoring services | 30 | 21 | 28 | / | 0.07 | Commercial |
| sat tutor seattle | 20 | 32 | 36 | / | 0.04 | Navigational/Commercial |
| sat tutoring seattle | 20 | 34 | 42 | / | 0.04 | Informational |
| seattle sat tutoring | 20 | 38 | 45 | / | 0.04 | Informational |

**Top-10 rankings (rank_group ≤ 10):** 1 keyword only — "firefly tutors" at rank_group 2.

**Keyword quality note:** Several ranked keywords are not brand-relevant to Firefly Tutoring (Seattle): "firefly testing" (software testing tool), "fairfax tutoring" (Fairfax VA), "tutoring fort collins/bellingham/bellevue/lancaster pa/rockwall/santa fe" (other cities), "shiery tutoring" (competitor brand), "student firefly" (likely a software product). These represent low-value incidental rankings. The authentic organic footprint for Firefly's actual service area is approximately 10–12 keywords.

---

## 3. Backlink Profile

Source: `backlinks_summary`, `backlinks_referring_domains`, `backlinks_anchors` | 2026-07-18

### Summary

| Metric | Value |
|---|---|
| Total backlinks | 58 |
| Referring domains | 38 |
| Referring main domains | 35 |
| Referring pages | 50 |
| Dofollow backlinks | 39 |
| Nofollow referring domains | 12 |
| Broken pages (site-side) | 2 |
| Domain spam score | 12 |
| Backlinks spam score | 27 |
| Domain rank | 69 |
| First seen | 2019-05-24 |

### TLD Distribution

| TLD | Count |
|---|---|
| .com | 17 |
| .org | 9 |
| .info | 7 |
| .com.au | 5 |
| .pages.dev | 2 |
| .net | 1 |
| .org.in | 1 |
| .pro | 1 |
| .io | 1 |
| .cv | 1 |

No .edu or .gov links.

### Notable Referring Domains

| Domain | Backlinks | Spam Score | Notes |
|---|---|---|---|
| wallyhood.org | 6 | — | Wallingford neighborhood blog (Seattle) — legitimate local mention, oldest link (2019) |
| parentmap.com | 1 | — | Seattle-area parenting publication — recent (2026-06-24), nofollow |
| marketlister.com | 4 | 2 | Business directory |
| willettonuniforms.com.au | 5 | — | Australian uniform company — all nofollow; likely spam/scraped data |
| reputablebusinesses.com | 4 | — | Business directory, nofollow |
| businessesup.com | 4 | — | Business directory, nofollow |
| highscores.ai | 1 | — | AI/tutoring tool (tutor listing), nofollow |
| seolium.com | 3 | — | SEO tool (site screenshot/thumbnail), nofollow |
| wheretobuybest.link | 1 | 80 | Spam |
| rankvanceseo.info | 1 | 70 | Spam |
| australianwebdirectory.shop | 1 | 70 | Spam |
| thebestbacklinksavailable.click | 1 | 65 | Spam |
| mundotecnologia.info | 1 | 65 | Spam |
| booksreadr.org | 1 | 60 | Spam |
| globalecommerce.org | 1 | 60 | Spam |
| musweb.org | 1 | 60 | Spam |
| read.org.in | 1 | 60 | Spam |
| sergechel.info | 1 | 60 | Spam |
| jobsapp.info | 1 | 60 | Spam |
| way2check.cv | 1 | 60 | Spam |
| alljobs.info | 2 | 50 | Spam |
| getwebsiteworth.com | 3 | 56 | Website valuation scraper |
| bye.fyi | 1 | 50 | Spam |
| pagesearch.net | 1 | 50 | Spam |
| indexaward.com | 1 | 50 | Spam |
| ycm.info | 1 | 50 | Spam |
| wallpapers.pro | 1 | 50 | Spam |

Roughly 15–18 of 38 referring domains appear to be spam or low-quality scrapers. Legitimate quality links: wallyhood.org, parentmap.com, highscores.ai, marketlister.com.

### Anchor Text Distribution

| Anchor | Backlinks | Spam Score | Notes |
|---|---|---|---|
| fireflytutoring.com | 27 | 50 | Bare URL — majority of link profile; mostly spam domains |
| Fire Fly Tutoring | 8 | — | Misspelled brand name; from businessesup.com and reputablebusinesses.com (nofollow) |
| Firefly Tutoring | 6 | 5 | Clean brand anchor; wallyhood.org + legitimate sources |
| Our Website | 4 | 2 | Generic — marketlister.com |
| HOURS Firefly Tutoring | 1 | — | Scraped nav text — willettonuniforms.com.au |
| TEAM Firefly Tutoring | 1 | — | Scraped nav text — willettonuniforms.com.au |
| summer math review | 1 | — | Topical anchor — wallyhood.org |
| Firefly | 1 | — | Partial brand — wallyhood.org (oldest) |
| http://fireflytutoring.com/Schedule | 1 | — | Old URL (no www, /Schedule path — possible redirect) |
| paulschurr | 1 | — | Personal name anchor — wallyhood.org |
| null (image links) | 2 | — | Image links from seolium.com, no alt text |
| Visit Website | 1 | — | Generic — hihopscotch.com |

---

## 4. AI / LLM Mentions

Source: `ai_opt_llm_ment_top_domains`, `ai_opt_llm_ment_top_pages` | US/EN | 2026-07-18

Both calls returned `status_code: 20000` with empty `items` arrays.

**Result:** fireflytutoring.com does not appear in DataForSEO's AI Overview / LLM response citation dataset for the US/English market as of 2026-07-18.

---

## 5. On-Page Audit

Source: `on_page_instant_pages` | 2026-07-18 | All pages returned HTTP 200

### Summary Table

| URL | On-Page Score | H1 | Title | Title Length | Meta Desc Length | Structured Data | Load Time (DOM) |
|---|---|---|---|---|---|---|---|
| / | 95.24 | None | TUTORING \| Firefly Tutoring \| Seattle | 37 chars | 286 chars | None | 1,803 ms |
| /test-prep | 85.27 | None | TEST PREP \| Firefly Tutoring | 28 chars | 186 chars | None | 5,029 ms |
| /team | 88.19 | Yes (2x, wrong content) | TEAM \| Firefly Tutoring | 23 chars | 245 chars | None | 3,694 ms |
| /typing-club-registraion | 87.10 | None | Typing Club Summer Camp \| Firefly Tutoring \| Seattle | 52 chars | 94 chars | None | 4,465 ms |
| /online-tutoring | 94.15 | None | ONLINE TUTORING \| Firefly Tutoring | 34 chars | 300 chars (truncated) | None | 1,115 ms |

### Page-by-Page Detail

**Homepage (`/`)**
- Title: `TUTORING | Firefly Tutoring | Seattle` (37 chars)
- Meta description: "At Firefly Tutoring, our mission is to help young people develop a love of learning…" (286 chars)
- H1: None. H2: blank whitespace. H3: "K-12 one-on-one tutoring — Math, reading, science, Most Ap courses, test prep, and more"
- Canonical: `https://www.fireflytutoring.com/` ✓
- Internal links: 17 | External links: 4
- Images: 13 (no alt text, no title attributes on any)
- Errors: 4x "doctype tag is missing" (sub-resources/iframes); warnings: DOM node >60 children, HTML depth >32
- Checks flagged: no_h1_tag, has_render_blocking_resources, low_content_rate, no_image_alt, no_image_title, frame (iframes present)
- Render-blocking: 3 scripts, 26 stylesheets
- Generator: Wix.com

**`/test-prep`**
- Title: `TEST PREP | Firefly Tutoring` (28 chars — flagged too short)
- Meta description: "Firefly Tutoring has experience with a vast library of acceptance tests…" (186 chars)
- H1: None. H2: "Test Prep"
- Canonical: `https://www.fireflytutoring.com/test-prep` ✓
- Internal links: 18 | External links: 0
- Images: 1 (no alt text)
- Checks flagged: high_loading_time, no_h1_tag, render_blocking, low_content_rate, low_character_count, title_too_short, no_image_alt

**`/team`**
- Title: `TEAM | Firefly Tutoring` (23 chars — flagged too short)
- Meta description: "Firefly Tutoring prides itself on the ability to attract incredible talent…" (245 chars)
- H1: "Online ANd In-Person tutoring Available NOw!" — **duplicated twice; this is a promotional CTA, not a team page heading**
- H4: tutor bio headings (names + paragraphs)
- Canonical: `https://www.fireflytutoring.com/team` ✓
- Internal links: 17 | External links: 2
- Images: 14 (no alt text)
- Checks flagged: high_loading_time, https_to_http_links (mixed content), render_blocking, low_content_rate, title_too_short, no_image_alt
- DOM size: 752,069 bytes (largest of audited pages)

**`/typing-club-registraion`**
- Title: `Typing Club Summer Camp | Firefly Tutoring | Seattle` (52 chars)
- Meta description: "Students learn the foundations of touch-typing to learn to type more fluently and efficiently." (94 chars — too short)
- H1: None. H5: "Firefly TYPing club Registration"
- **URL contains typo: "registraion" (should be "registration") — confirmed in canonical**
- Canonical: `https://www.fireflytutoring.com/typing-club-registraion` (typo baked in)
- Internal links: 17 | External links: 0
- Checks flagged: high_loading_time, no_h1_tag, render_blocking, low_content_rate, low_character_count, no_image_alt

**`/online-tutoring`**
- Title: `ONLINE TUTORING | Firefly Tutoring` (34 chars)
- Meta description: 300 chars (truncated in response — may be over-length)
- H1: None. H5: "Online Tutoring with Firefly", "Are you interested in online tutoring with Firefly?", "HAVING TECHNICAL DIFFICULTIES WITH YOUR ONLINE SESSION?"
- Canonical: `https://www.fireflytutoring.com/online-tutoring` ✓
- OG image present (only page with one set)
- Internal links: 18 | External links: 0
- Checks flagged: no_h1_tag, render_blocking, low_content_rate, low_character_count, no_image_alt

---

## 6. Lighthouse Audit

Source: `on_page_lighthouse` | Lighthouse 13.4.0 | 2026-07-18

### Homepage (`/`)

| Category | Score |
|---|---|
| Performance | 90 |
| Accessibility | 91 |
| Best Practices | 77 |
| SEO | 100 |

| Core Web Vital | Value | Status |
|---|---|---|
| LCP | 1.6 s | Needs Improvement |
| CLS | 0.018 | Good |
| TBT | 10 ms | Good |
| FCP | 1.0 s | — |
| Speed Index | 1.8 s | — |
| TTI | 3.6 s | — |

**Performance failures:**
- Total page weight: 4,562 KiB
- Image delivery: 604 KiB savings potential
- Unused CSS: 19 KiB savings
- Cache efficiency: 221 KiB savings
- TTI: 3.6 s

**Accessibility failures:**
- Color contrast: 7 nav elements (Wix dropdown menu — not directly editable)
- Heading order: H6 out-of-sequence in footer (Wix platform)
- Unnamed link: icon-only `/contact` anchor (a.IT88M3 in comp-kaon1dlv) — no text, no aria-label. **This is fixable.**

**Best Practices failures:**
- Third-party cookies: 2 from `engage.wixapps.net` (Wix chat widget — `bSession`, `XSRF-TOKEN`)
- Inspector issues: same Wix chat widget

---

### `/test-prep`

| Category | Score |
|---|---|
| Performance | 99 |
| Accessibility | 95 |
| Best Practices | 77 |
| SEO | 100 |

| Core Web Vital | Value | Status |
|---|---|---|
| LCP | 0.8 s | Good |
| CLS | 0.009 | Good |
| TBT | 0 ms | Good |
| FCP | 0.8 s | — |
| Speed Index | 1.0 s | — |
| TTI | 0.8 s | — |

**Performance failures:**
- Unused CSS: 11 KiB
- Unused JavaScript: 356 KiB
- Cache efficiency: 33 KiB

**Accessibility failures:**
- Color contrast: same 7 nav elements (Wix platform)
- Heading order: footer H6 (Wix platform)

**Best Practices failures:** Same Wix chat widget cookies as homepage.

**Note:** test-prep page performance (99) is substantially better than homepage (90), driven by homepage's larger image payload and heavier DOM.

---

## 7. Google Search Console

Not collected — `fireflytutoring.com` is not in the verified GSC properties for the connected Google account. The only verified property in this account is `sc-domain:unruledmasses.org`.

To access: Firefly Tutoring site owner must grant GSC access to the auditor's Google account, or provide a GSC data export.

---

## 8. Competitor Gap Analysis

Source: `dataforseo_labs_google_competitors_domain`, `dataforseo_labs_google_domain_intersection` | US/EN | 2026-07-18

### Competitor List (from `competitors_domain`)

| Domain | Keyword Intersections | Avg Position | Total Organic KWs |
|---|---|---|---|
| care.com | 11 | 10.6 | 285,074 |
| wyzant.com | 10 | 11.8 | 163,523 |
| varsitytutors.com | 9 | 22.3 | 170,115 |
| sylvanlearning.com | 9 | 24.4 | 5,363 |
| tutors.com | 9 | 19.2 | 37,341 |
| indeed.com | 9 | 10.8 | 3,711,163 |
| clubztutoring.com | 8 | 20.1 | 33,398 |
| mathnasium.com | 8 | 16.5 | 66,800 |
| superprof.com | 7 | 13.1 | 72,639 |

No local Seattle-scale competitors appeared. All are national chains or marketplaces.

Gap analysis run against `varsitytutors.com` and `sylvanlearning.com` (most actionable for a local tutoring business after excluding large marketplaces).

### Gap Keywords — vs. Sylvan Learning (actionable)

| Keyword | Volume | Sylvan Position |
|---|---|---|
| tutoring near me | 27,100 | 2 |
| math tutoring | 27,100 | 14 |
| learning center | 27,100 | 2 |
| math tutoring near me | 18,100 | 13 |
| SAT prep | 33,100 | 36 |
| SAT prep courses | 40,500 | 21–32 |
| SAT study courses/classes | 40,500 | 19–24 |
| ACT prep | 18,100 | 34 |
| ACT prep courses/classes | 12,100 | 28–32 |
| tutoring services | 9,900 | 8 |
| online tutoring services | 9,900 | 14 |
| accuplacer / accuplacer test prep | 60,500 / 27,100 | 35 / 14 |
| math for 9th graders | 9,900 | 15 |

### Gap Keywords — vs. Varsity Tutors (lower priority for local business)

High-volume terms are primarily college name lookups and math reference content (quadratic formula, distance formula, midpoint formula, Fibonacci sequence, rhombus). Varsity Tutors ranks for these via study-guide content. These are high-volume but represent a content strategy inappropriate for a local one-on-one tutoring company.
