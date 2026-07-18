# SEO Remediation Priorities — Firefly Tutoring

**Domain:** fireflytutoring.com  
**Platform:** Wix (Thunderbolt renderer)  
**Audit date:** 2026-07-18  
**Data source:** `data/baseline-data.md`, `reports/01-technical-baseline.md`, `reports/02-strategic-baseline.md`

---

## Executive Summary

- The biggest opportunity by far is Local Pack visibility — the site is not appearing in the map pack for "seattle tutoring" and related queries despite ranking organically nearby. This likely requires Google Business Profile work, not site code changes.
- On-page: every page is missing an H1 tag and structured data — two fixable gaps that signal to Google what each page is about.
- Content: no dedicated pages for math tutoring, SAT/ACT prep, or online tutoring as services. The homepage is doing all the work and being outranked for its own services.
- Link profile: ~15–18 spam referring domains should be disavowed; the two genuine editorial links (wallyhood.org, parentmap.com) show the right acquisition model — local Seattle publications and community sources.
- URL typo (`/typing-club-registraion`) needs a redirect fix before it can rank properly.

---

## Priority 1 — Quick Wins
*High impact, low effort — fix first*

---

### 1.1 — Verify and optimize Google Business Profile

**What's wrong:** The site is not appearing in the Local Pack for "seattle tutoring" and "tutor in seattle" — both queries trigger a map pack. Local Pack visibility is often more impactful than organic position 1–3 for local service searches.

**Why it matters:** Users searching for local tutors frequently use the map pack. If Firefly's GBP is unverified, incomplete, or has no recent reviews, it will not appear — regardless of the site's organic rankings.

**Recommended fix:**
1. Verify Google Business Profile ownership (if not already done)
2. Complete all fields: category (Tutoring Service + Educational Consultant), service area, hours, website, phone, photos
3. Add all services offered (subjects, test prep types, grade levels)
4. Request reviews from current/past clients (target 10+ reviews with responses)

**Effort:** 2–4 hours to complete profile + ongoing review management  
**Impact:** Potentially the highest-traffic move in this entire audit

---

### 1.2 — Add H1 tags to all pages

**What's wrong:** 4 of 5 audited pages have no H1 tag. The `/team` page has two H1s with the wrong content ("Online ANd In-Person tutoring Available NOw!" — a promotional CTA, not a page heading). Search engines use H1 as a primary signal for page topic.

**Why it matters:** Google uses heading structure to understand page content. Missing H1s mean Google is inferring topic from H3/H5 text, which is less reliable.

**Recommended fix:** In the Wix editor, on each page:
- `/` → H1: "K–12 Tutoring in Seattle" (or similar)
- `/test-prep` → H1: "Test Prep Tutoring — SAT, ACT, SSAT/ISEE"
- `/team` → H1: "Our Tutors" (replace the promotional CTA H1s)
- `/typing-club-registraion` → H1: "Typing Club Summer Camp — Seattle"
- `/online-tutoring` → H1: "Online Tutoring for K–12 Students"

**Effort:** 1–2 hours  
**Impact:** Improved keyword-to-page association; cleaner topical signals

---

### 1.3 — Fix the URL typo on `/typing-club-registraion`

**What's wrong:** The page URL contains "registraion" (missing letter) — and the canonical confirms this as the official URL. Any links pointing here (e.g., from social media, parent emails) propagate the typo.

**Why it matters:** The correct URL `/typing-club-registration` is likely what users would type if they searched for the page directly. The current URL also shows up awkwardly in social shares and SERP breadcrumbs.

**Recommended fix:**
1. In Wix: rename the page URL to `/typing-club-registration`
2. Wix will offer to create a redirect from the old URL — accept it
3. Update any links in nav, other pages, or external references

**Effort:** 15 minutes  
**Impact:** Cleaner URL, redirect preserves any link equity

---

### 1.4 — Add alt text to all images sitewide

**What's wrong:** No images on any audited page have alt text or title attributes. 13+ images on the homepage alone.

**Why it matters:** Alt text is an accessibility requirement and an SEO signal. Google Image Search cannot index images without descriptive alt text. For a tutoring company, images of students, sessions, or tutors could rank for relevant image queries.

**Recommended fix:** In Wix's image editor, add descriptive alt text to every image. Examples:
- Tutor with student → "One-on-one tutoring session, Firefly Tutoring Seattle"
- Team headshots → "Firefly Tutoring tutor [Name], Seattle"
- Homepage hero → "K-12 tutoring in Seattle — Firefly Tutoring"

**Effort:** 1–2 hours  
**Impact:** Accessibility compliance + image SEO

---

### 1.5 — Fix short title tags

**What's wrong:** `/test-prep` title is 28 chars and `/team` is 23 chars — both flagged as too short.

**Why it matters:** Short titles miss opportunities to include keywords and look thin in SERPs.

**Recommended fixes:**
- `/test-prep`: "SAT, ACT & Test Prep Tutoring | Firefly Tutoring Seattle" (~55 chars)
- `/team`: "Our Seattle Tutors | Firefly Tutoring" (~37 chars)

**Effort:** 15 minutes  
**Impact:** Better keyword coverage in SERP titles

---

## Priority 2 — High Impact
*Meaningful improvement, higher effort*

---

### 2.1 — Add LocalBusiness structured data

**What's wrong:** No structured data on any page. Google cannot pull verified business details (name, address, phone, hours, service area) from the site.

**Why it matters:** Structured data directly feeds Knowledge Panels, rich results, and AI citation. A `LocalBusiness` / `EducationalOrganization` schema with complete information improves Google's confidence in the business's identity and legitimacy.

**Recommended fix:** Add JSON-LD to the homepage via Wix's Custom Code tool (Settings → Custom Code → Add Code → Head):

```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EducationalOrganization"],
  "name": "Firefly Tutoring",
  "url": "https://www.fireflytutoring.com",
  "telephone": "[phone number]",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Seattle",
    "addressRegion": "WA",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[lat]",
    "longitude": "[lng]"
  },
  "priceRange": "$$",
  "servesCuisine": null,
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Tutoring Services",
    "itemListElement": [
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "K-12 One-on-One Tutoring"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "SAT/ACT Test Prep"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Online Tutoring"}}
    ]
  }
}
```

Also add `Person` schema to each tutor bio on `/team`.

**Effort:** 3–5 hours (schema authoring + Wix custom code entry)  
**Impact:** Eligibility for rich results, Knowledge Panel, AI citation inclusion

---

### 2.2 — Create dedicated service landing pages with SEO-targeted content

**What's wrong:** The homepage ranks for every service keyword ("math tutoring seattle," "SAT tutoring seattle," "online tutoring") because there's no dedicated page to send those signals to. A single homepage cannot rank simultaneously for all service variants.

**Why it matters:** Dedicated pages allow Google to match specific user intent to specific pages. They also give the site more total ranking surface area.

**Recommended pages to create:**

| Page | Target Keywords | Volume |
|---|---|---|
| /math-tutoring-seattle | "math tutoring seattle," "math tutoring near me" | 110 + 27,100 |
| /sat-act-test-prep-seattle | "SAT tutoring seattle," "ACT prep" variants | 20 + 18,100 |
| /online-tutoring (expand existing) | "online tutoring services," "tutoring near me" (virtual) | 9,900 |

Each page should include: H1 with keyword, meta description with location, service description with subject specifics, tutor bios relevant to that subject, CTA, and FAQ section (eligible for FAQPage schema).

**Effort:** 8–16 hours (writing + Wix page creation for 3 pages)  
**Impact:** New ranking surface for high-volume commercial keywords; high conversion potential

---

### 2.3 — Build local citations and backlinks

**What's wrong:** Only 2 legitimate editorial links in the entire profile (wallyhood.org, parentmap.com). The profile is dominated by spam backlinks. No .edu or .gov links.

**Why it matters:** Referring domain count from quality sources is one of the strongest ranking factors for local businesses. Seattle tutoring competitors likely have more local citations.

**Recommended actions:**

1. **Local directory citations** (consistent NAP: Name, Address, Phone):
   - Yelp, Google Business Profile, Bing Places, Apple Maps, Facebook
   - Seattle-specific: Seattle Business Journal listings, Seattle Met directory
   - Education directories: GreatSchools.org, Niche.com tutor listings

2. **Community/editorial outreach:**
   - Submit to parentmap.com as a service listing (already linked — formalize it)
   - Pitch to Seattle neighborhood blogs (Wallyhood, Capitol Hill Seattle, Eastlake Ave Blog) with community angles (tutoring resources, back-to-school features)
   - Reach out to local PTAs or school district parent networks

3. **Partner links:** Link exchanges or mentions with complementary local services (enrichment programs, private schools, after-school programs)

**Effort:** 10–20 hours (citation building + outreach)  
**Impact:** Authority growth, local signal strengthening, spam dilution

---

### 2.4 — Disavow spam backlinks

**What's wrong:** Approximately 15–18 referring domains are spam with scores of 50–80.

**Why it matters:** While Google claims to ignore most spam links, high spam concentrations can suppress a domain's authority signals. The current 27 backlinks spam score (moderate) could improve.

**Recommended disavow list (domains with spam score ≥ 60):**
- wheretobuybest.link, rankvanceseo.info, australianwebdirectory.shop, thebestbacklinksavailable.click, mundotecnologia.info, booksreadr.org, globalecommerce.org, musweb.org, read.org.in, sergechel.info, jobsapp.info, way2check.cv

Submit via Google Search Console Disavow Tool once GSC access is established.

**Effort:** 1–2 hours (compile list, submit to GSC)  
**Impact:** Cleaner link profile; moderate risk reduction

---

### 2.5 — Optimize homepage image delivery

**What's wrong:** Homepage has 4,562 KiB total page weight with 604 KiB image optimization savings identified by Lighthouse. LCP is 1.6 s (Needs Improvement).

**Why it matters:** LCP is a Core Web Vitals metric — a Google ranking signal. 1.6 s is close to the 2.5 s Good threshold and could push past it on slower connections.

**Recommended fix:** In Wix:
- Enable Wix's Site Speed optimization settings (Dashboard → Settings → Performance)
- Use Wix Image Editor to resize/compress hero images before upload
- Replace full-resolution photos with web-optimized versions (WebP format, appropriate dimensions)

**Effort:** 2–4 hours  
**Impact:** Improved LCP; may cross from "Needs Improvement" into "Good" range

---

## Priority 3 — Ongoing
*Process or content recommendations — no single fix*

---

### 3.1 — Set up and share Google Search Console access

**What's wrong:** GSC data was not accessible in this audit — the site is not verified on the connected account.

**Why it matters:** GSC is the authoritative source for actual clicks, impressions, CTR, and indexation issues. DataForSEO estimates are proxies. All future SEO work should be informed by real traffic data.

**Action:** Site owner adds the auditor's Google account (`tim.arnold@unruledmasses.org`) as a GSC user, or provides a data export. Minimum: "Restricted" access. After GSC is connected, run `check_indexing_issues` to surface any coverage errors.

---

### 3.2 — Build topical content for AI citation eligibility

**What's wrong:** Zero AI/LLM presence. When parents ask AI tools for Seattle tutoring recommendations, Firefly doesn't appear.

**Why it matters:** AI-generated answers are becoming a primary discovery channel, especially for "best [service] in [city]" queries. Sites with substantive, authoritative content on their specialty are more likely to be cited.

**Recommended content strategy:**
- Blog or resources section with articles on: "How to choose a tutor in Seattle," "When does your child need a math tutor?", "SAT prep timeline for Seattle students," "Differences between SSAT and ISEE"
- Tutor bio pages with educational credentials (supports E-E-A-T)
- Parent testimonials with specifics (subject helped, outcome, grade level)

Content should be 600+ words per piece, internally linked from relevant service pages, and include structured data where applicable.

**Effort:** Ongoing — 1–2 articles/month  
**Impact:** Gradual authority build; AI citation eligibility; long-tail keyword rankings

---

### 3.3 — Acquire legitimate local reviews

**What's wrong:** Review count and recency were not directly audited (GSC/GBP not accessible), but low local citation presence suggests reviews are likely sparse.

**Why it matters:** Reviews are a direct input to Local Pack rankings and AI citation. They also drive conversions — parents hiring tutors read reviews carefully.

**Recommended process:**
- After each successful tutoring engagement, send a follow-up email with a direct link to the Google review form
- Respond to every review (builds trust signal)
- Target: 15+ Google reviews, 4.5+ average rating

**Effort:** Ongoing — process takes ~10 minutes per review request

---

### 3.4 — Fix mixed content on `/team`

**What's wrong:** The `/team` page has HTTP links in an HTTPS context (flagged as `https_to_http_links`).

**Why it matters:** Mixed content warnings can trigger browser security flags and undermine trust signals.

**Action:** Identify and update any HTTP-protocol links on the /team page (likely external links or embedded resources) to HTTPS equivalents.

**Effort:** 30 minutes

---

### 3.5 — Add a careers/jobs page

**What's wrong:** The site ranks for multiple "tutoring jobs seattle" queries (210 searches/month each) on the homepage — but there is no dedicated careers page to serve that intent.

**Why it matters:** These queries bring in potential tutors, not clients. Serving them with a real page (with application process, requirements, what it's like to work at Firefly) improves conversion from that traffic and removes the mismatch of landing job seekers on a client-focused homepage.

**Effort:** 2–3 hours  
**Impact:** Better experience for tutor applicants; potentially faster hiring

---

## Summary Action List

| Priority | Action | Effort | Expected Impact |
|---|---|---|---|
| P1 | Verify/optimize Google Business Profile | 2–4 hrs | Local Pack visibility — highest potential |
| P1 | Add H1 tags to all pages | 1–2 hrs | Improved topical signals |
| P1 | Fix /typing-club-registraion URL typo | 15 min | Clean URL + redirect |
| P1 | Add image alt text sitewide | 1–2 hrs | Accessibility + image SEO |
| P1 | Fix short title tags (/test-prep, /team) | 15 min | Better SERP click signals |
| P2 | Add LocalBusiness structured data | 3–5 hrs | Rich results + AI citation eligibility |
| P2 | Create dedicated service pages (math, SAT/ACT, online) | 8–16 hrs | New keyword rankings, conversion uplift |
| P2 | Build local citations + editorial links | 10–20 hrs | Authority growth |
| P2 | Disavow spam backlinks (after GSC access) | 1–2 hrs | Cleaner link profile |
| P2 | Optimize homepage image delivery | 2–4 hrs | LCP improvement |
| P3 | Connect Google Search Console | 1 hr | Real traffic data |
| P3 | Content strategy for AI citation | Ongoing | Long-term authority |
| P3 | Review acquisition process | Ongoing | Local Pack + conversions |
| P3 | Fix mixed content on /team | 30 min | Security hygiene |
| P3 | Add careers/jobs page | 2–3 hrs | Better tutor applicant experience |
