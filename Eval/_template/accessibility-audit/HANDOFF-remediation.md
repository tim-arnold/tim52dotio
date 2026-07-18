# Accessibility Audit

## Context

You are conducting a WCAG 2.2 Level AA accessibility audit for the client described in `../CLAUDE.md`. Read that file first — it has the public URL, local site path, CMS, and any prior audit findings to be aware of.

The goal is to document accessibility issues and produce a prioritized remediation plan for fixing them on the current site. The site is not being rebuilt — findings should be actionable against the existing codebase.

**Do NOT modify any files** in the site installation or on the live site. Read and observe only.

## ⚠️ Data Integrity — Non-Negotiable

Every data point in this audit must come from a live tool call made in this session. Full rules are in `../CLAUDE.md`.

- Did not call a tool for it? Do not write it.
- Tool failed or returned nothing? Write "Not collected — [tool name] returned [error / no data]". Never estimate or infer.
- Open the data file with a Data Sources table before writing any findings.
- Use the exact tool named in each step. Do not substitute a different tool that appears similar.

## Deliverables

- `data/accessibility-findings.md` — structured findings from both passes
- `reports/accessibility-audit-report.md` — dev-team report with prioritized fix list
- `screenshots/` — visual evidence from the live audit

---

## Two-Pass Approach

Run both passes. They can run in parallel since they use different tools.

---

## Pass 1: Code-Level Audit (Filesystem)

Read the templates at the local site path in `../CLAUDE.md`. If no local path is available, note it and proceed with Pass 2 only.

Check for:

### 1. Semantic HTML Structure
- **Heading hierarchy** — H1 → H2 → H3 with no skips. Every page must have exactly one H1.
- **Landmark elements** — `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`. Multiple `<nav>` elements must have `aria-label` to distinguish them.
- **List markup** — navigation and repeated items should use `<ul>`/`<ol>`

### 2. Images and Media
- `alt` attributes on all `<img>` tags — check both hardcoded and dynamic (CMS image fields rendered in templates)
- Decorative images must have `alt=""`
- `<noscript>` image fallbacks — do they propagate the alt value or default to empty?
- `<video>` and `<iframe>` embeds — captions, transcripts, or accessible fallbacks
- SVG accessibility — `<title>` and `role="img"` for informative SVGs

### 3. Forms
- Label/input associations (`for`/`id` pairing)
- Error message handling and ARIA live regions
- Required field indicators

### 4. Interactive Elements
- Navigation menus — keyboard accessibility, ARIA attributes, mobile menu toggle
- Accordions, tabs, modals, dropdowns — ARIA roles, keyboard handlers (`Enter` AND `Space`), focus management, `aria-expanded`
- Links vs buttons — `<a>` tags should navigate; `<button>` elements should trigger actions. Flag any `<div>`/`<span>`/`<a>` used as interactive controls.
- Carousels — named prev/next controls, pause mechanism

### 5. Color and Contrast
- Check CSS for color values. Flag text/background combinations that look potentially low-contrast for live testing.
- Color-only state indicators (hover, active, error states)

### 6. Focus Management
- `outline: none` or `outline: 0` without replacement focus styles
- `:focus` and `:focus-visible` styles — are they visible and high-contrast?
- `tabindex` values greater than 0

### 7. ARIA Usage
- All `aria-*` and `role` attributes in templates
- Flag misuse: `aria-hidden="true"` on focusable elements, redundant roles, `aria-expanded` on wrong element

### 8. Page Structure
- Skip-to-content link present and functional?
- `<html lang>` attribute set?
- Viewport meta tag — `user-scalable=no` or `maximum-scale=1` are WCAG violations

---

## Pass 2: Live Audit (Playwright)

Use the Playwright MCP to test the live site. Test at minimum:
- Homepage
- The highest-traffic content page (from SEO audit, or the most representative page)
- A content detail page (article, product, profile, etc.)
- A page with a form
- A page with interactive components (accordion, tabs, modal)

For each page:

1. **Screenshot** (`browser_take_screenshot`) — visual evidence, save to `screenshots/`
2. **Accessibility tree snapshot** (`browser_snapshot`) — heading structure, landmark regions, image alt text
3. **Keyboard navigation** — press Tab repeatedly, take screenshots at key stops. Verify:
   - Focus indicator is visible at every stop
   - Focus order is logical (top-to-bottom, left-to-right)
   - Skip link appears and works
4. **Heading structure** — extract all headings from the snapshot and verify hierarchy
5. **Landmark regions** — confirm `main`, `nav`, `header`, `footer` are present
6. **Image alt text** — check all `figure` and `img` elements in the snapshot for accessible names
7. **Interactive elements** — click/activate any accordions, modals, or dropdowns. Then test keyboard activation (Tab to focus, Enter and Space to activate). Take screenshots.
8. **Console errors** — note any JS errors that could affect AT functionality

If any page is inaccessible or errors out, note it and move on.

---

## Findings File: `data/accessibility-findings.md`

Organize by WCAG 2.2 principle:

**1. Perceivable** — text alternatives, captions, contrast, text resize
**2. Operable** — keyboard, timing, seizures, navigation
**3. Understandable** — readable, predictable, input assistance
**4. Robust** — parsing, name/role/value

For each finding:
- WCAG criterion (e.g., `1.1.1 Non-text Content`)
- Severity: Critical / Major / Minor
- Source: Code / Live / Code + Live
- Location: file path and/or URL + element
- Description
- Recommended fix (specific to the existing codebase — what file or component to change)

Include a summary table at the end.

---

## Report: `reports/accessibility-audit-report.md`

Structure:

**Executive Summary** — 5-7 bullets: overall posture, most critical issues, quick wins available

**1. WCAG 2.2 Compliance Summary**
Table: each WCAG 2.2 Level A and AA criterion — Pass / Fail / Partial / Not Tested

**2. Critical Issues** — must fix; block or severely impair access

**3. Major Issues** — should fix; degrade experience significantly

**4. Minor Issues** — nice to fix; best-practice violations

**5. Component-Specific Findings**
Tables per component: navigation, primary content template(s), forms, any maps or complex widgets, footer

**6. Remediation Recommendations**
- Prioritized fix list: what to address first for the greatest accessibility impact
- For each fix: affected file/component, effort estimate, WCAG criterion resolved
- Quick wins that can be addressed without a large refactor
- Issues that require more structural changes — scope and approach notes
- Testing process to verify fixes: automated (axe/Lighthouse in CI), keyboard walk, screen reader testing

---

## Formatting Notes

- **Report header:** `Domain` → `Platform` → `Audit date` → `Data source` → `**Standard:** WCAG 2.2 Level AA`. See `Eval/CLAUDE.md` Conventions for the full spec.
- Include WCAG criterion numbers — the dev team will use these as acceptance criteria
- Be specific: file paths, line numbers, CSS selectors, URLs
- Severity ratings should be consistent and defensible
- Cross-reference SEO audit findings where they overlap (heading structure, page titles, structured data)
