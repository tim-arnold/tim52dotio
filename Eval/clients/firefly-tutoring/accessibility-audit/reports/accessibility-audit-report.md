# Accessibility Audit Report — Firefly Tutoring

**Domain:** fireflytutoring.com  
**Platform:** Wix (Thunderbolt renderer)  
**Audit date:** 2026-07-18  
**Data source:** `data/accessibility-findings.md`  
**Standard:** WCAG 2.2 Level AA  

---

## Executive Summary

- The site scores 91/100 on automated Lighthouse, but automated tooling misses the majority of issues here because Wix's JavaScript rendering causes most accessibility checks to return N/A. Manual live-DOM testing reveals significant barriers across every page.
- **Five critical issues** were identified — any one of which substantially blocks access for screen reader or keyboard-only users: missing H1 elements, severely broken heading hierarchy, form fields with no labels, form errors not announced to AT, and focusable elements hidden from the accessibility tree.
- Every page lacks a top-level H1 element. The Team page has two H1s — placed at the bottom, after all content. Heading levels across all pages skip, reverse, and mix decorative and semantic usage.
- The inquiry form is effectively inaccessible to screen reader users: four of five fields have no label, the fifth has an empty label, required fields are not indicated, and validation errors are not announced via any ARIA live mechanism.
- Staff headshots on the Team page all use raw filenames as alt text (`mona.jpg`, `PXL_20230203_230415070_edited.jpg`, etc.), which screen readers read verbatim.
- The skip-to-main-content button works functionally but lacks a visible focus indicator, undermining keyboard-only navigation.
- Most issues are Wix content-editor problems (heading levels, alt text, form labels) fixable without code. A smaller number are Wix platform behaviors that may require Velo scripting or a support ticket.

---

## 1. WCAG 2.2 Compliance Summary

Tests marked **Not Tested** were not auditable in this session (color contrast, media/video captions, animation). Tests marked **Partial** passed some criteria but failed others.

| # | Criterion | Level | Status | Notes |
|---|---|---|---|---|
| 1.1.1 | Non-text Content | A | **Fail** | Filename alt on staff photos; missing alt on images |
| 1.2.1 | Audio-only / Video-only | A | Not Tested | No audio/video content identified |
| 1.2.2 | Captions (Prerecorded) | A | Not Tested | No video identified |
| 1.2.3 | Audio Description | A | Not Tested | |
| 1.2.4 | Captions (Live) | AA | Not Tested | |
| 1.2.5 | Audio Description (Prerecorded) | AA | Not Tested | |
| 1.3.1 | Info and Relationships | A | **Fail** | No H1; broken heading hierarchy; unlabeled form fields |
| 1.3.2 | Meaningful Sequence | A | Pass | DOM order appears logical |
| 1.3.3 | Sensory Characteristics | A | Pass | No sensory-only instructions observed |
| 1.3.4 | Orientation | AA | Pass | No orientation lock observed |
| 1.3.5 | Identify Input Purpose | AA | Partial | Email/phone input types correct; no autocomplete attributes |
| 1.4.1 | Use of Color | A | Not Tested | No color-only indicators confirmed; contrast not tested |
| 1.4.2 | Audio Control | A | Pass | No auto-playing audio |
| 1.4.3 | Contrast (Minimum) | AA | Not Tested | Lighthouse color-contrast returned N/A |
| 1.4.4 | Resize Text | AA | Pass | Viewport meta allows scaling |
| 1.4.5 | Images of Text | AA | Not Tested | |
| 1.4.10 | Reflow | AA | Not Tested | |
| 1.4.11 | Non-text Contrast | AA | Not Tested | |
| 1.4.12 | Text Spacing | AA | Not Tested | |
| 1.4.13 | Content on Hover/Focus | AA | Not Tested | |
| 2.1.1 | Keyboard | A | Partial | Skip link and nav keyboard-accessible; aria-hidden focus issue |
| 2.1.2 | No Keyboard Trap | A | Pass | No traps observed |
| 2.4.1 | Bypass Blocks | A | Partial | Skip button present and functional; non-standard implementation |
| 2.4.2 | Page Titled | A | Pass | All pages have descriptive `<title>` |
| 2.4.3 | Focus Order | A | Partial | First tab stop is non-interactive region div |
| 2.4.4 | Link Purpose (In Context) | A | Pass | Links have descriptive text |
| 2.4.5 | Multiple Ways | AA | Pass | Navigation + footer links present |
| 2.4.6 | Headings and Labels | AA | **Fail** | No H1; heading levels non-sequential |
| 2.4.7 | Focus Visible | AA | **Fail** | Skip button focus indicator not visible |
| 2.4.11 | Focus Appearance | AA | **Fail** | Skip button outline: none |
| 2.5.3 | Label in Name | A | Not Tested | |
| 2.5.8 | Target Size (Minimum) | AA | Pass | Lighthouse target-size: pass |
| 3.1.1 | Language of Page | A | Pass | `<html lang="en">` present |
| 3.1.2 | Language of Parts | AA | Pass | No foreign-language passages identified |
| 3.2.1 | On Focus | A | Pass | |
| 3.2.2 | On Input | A | Pass | |
| 3.2.3 | Consistent Navigation | AA | Pass | Navigation consistent across all pages |
| 3.2.4 | Consistent Identification | AA | Pass | |
| 3.3.1 | Error Identification | A | **Fail** | Form errors not announced via ARIA |
| 3.3.2 | Labels or Instructions | A | **Fail** | Form fields unlabeled; no required field indicators |
| 3.3.3 | Error Suggestion | AA | **Fail** | No error suggestion text linked to invalid field |
| 3.3.4 | Error Prevention | AA | Not Tested | |
| 4.1.1 | Parsing | A | Pass | Lighthouse reports no parsing errors |
| 4.1.2 | Name, Role, Value | A | **Fail** | aria-hidden focusable elements; empty role; nameless buttons |
| 4.1.3 | Status Messages | AA | Partial | No status message pattern observed post-submit |

---

## 2. Critical Issues

These issues must be fixed — they block or severely impair access for screen reader and keyboard-only users.

---

### CRIT-1: No H1 on any page (F-P1)

**WCAG:** 1.3.1, 2.4.6 | **Affects:** All pages

Every page is missing a top-level H1 element. Screen reader users navigating by headings (a common strategy) have no landmark to identify the page topic. The Team page has two H1 elements — both placed at the bottom of the page after all content, and both containing identical text.

| Page | First Heading Found |
|---|---|
| Homepage | H3: "K-12 one-on-one tutoring…" |
| Contact | H4: "Contact Firefly Tutoring" |
| Programs/Math | H2: "Firefly Tutoring Math Program" |
| Approach | H2: "The Firefly Tutoring Approach" |
| Inquiries | H5: "Contact Us" |
| Team | H6: "What Makes Firefly Tutoring Unique?" (H1s appear at bottom) |

**Fix:** In Wix editor, change the primary heading on each page to H1. Every page should have exactly one H1 at the top of its content area.

---

### CRIT-2: Broken heading hierarchy across all pages (F-P2)

**WCAG:** 1.3.1 | **Affects:** All pages

Heading levels skip, reverse, and are used decoratively (e.g., `<h6>123-456-7890</h6>` in the footer, `<h6>CONNECT</h6>` / `<h6>WITH US</h6>` as styled labels). A typical example from the homepage:

```
H3 → H6 → H6 → H4 → H2 → H6
```

This pattern repeats on every page. Heading hierarchy is the primary navigation mechanism for screen reader users and for users with cognitive disabilities who rely on page structure.

**Fix:** Audit all headings in Wix editor and reassign levels to follow a strict descending hierarchy from H1. Use paragraph + bold/custom styling for decorative text that is not a semantic section heading.

---

### CRIT-3: Form fields have no labels (F-U1)

**WCAG:** 1.3.1, 3.3.2 | **Affects:** https://www.fireflytutoring.com/inquiries

All five form fields on the inquiry form rely on placeholder text instead of labels:

| Field | Has `<label>`? | Has `aria-label`? | Placeholder |
|---|---|---|---|
| First Name | No | No | "First Name" |
| Last Name | No | No | "Last Name" |
| Email | No | No | "Email" |
| Phone | No | No | "Phone" |
| Message (textarea) | Yes — but empty text | No | "Type your message here..." |

Placeholder text is not a label. It disappears as soon as a user starts typing, and it has lower contrast than label text. Screen readers may not announce the placeholder when the field receives focus.

**Fix:** Enable field labels in the Wix form widget settings (each field has a Label option). If labels must remain visually hidden, add `aria-label` via Wix Velo or the field's custom HTML settings.

---

### CRIT-4: Form validation errors not communicated to AT (F-U3)

**WCAG:** 3.3.1, 3.3.3 | **Affects:** https://www.fireflytutoring.com/inquiries

When the form is submitted with the required Email field empty:
- `aria-invalid="true"` is correctly set on the Email input ✓
- `aria-describedby` is `null` — no error message element is linked to the field ✗
- No `role="alert"` or `aria-live` region exists on the page ✗
- No visible error message text appears in the DOM ✗

Screen reader users receive no notification that submission failed. The browser's native validation tooltip (used as the only feedback) is not announced by most screen reader + browser combinations.

**Fix:** In Wix form settings, ensure "Show error messages" is enabled. The error message container should have `role="alert"` or `aria-live="assertive"`. The input's `aria-describedby` should point to the ID of the error message element. If this requires custom implementation, use Wix Velo to inject these attributes after validation fires.

---

### CRIT-5: Focusable elements inside `aria-hidden="true"` containers (F-R1)

**WCAG:** 4.1.2 | **Affects:** https://www.fireflytutoring.com (and likely other pages)

Nine focusable elements (`<a>`, `<button>`, `<input>`) were found inside `aria-hidden="true"` containers on the homepage. These elements are hidden from screen readers but remain in the keyboard Tab order. A keyboard user Tabbing through the page will land on these elements with no announcement — appearing as empty focus stops. This is likely a Wix-generated pattern (duplicate hidden navigation or off-screen gallery controls).

**Fix:** Add `tabindex="-1"` to all focusable descendants inside `aria-hidden="true"` containers. If these are Wix platform elements, open a support ticket — this pattern should be addressed by the platform.

---

## 3. Major Issues

These issues significantly degrade the experience and should be addressed.

---

### MAJ-1: Staff photos use filenames as alt text (F-P3)

**WCAG:** 1.1.1 | **Affects:** Team page

All 11 staff headshots use raw filenames as alt text (`mona.jpg`, `PXL_20220730_185844586_edited.jpg`, etc.). Screen readers will read the full filename. **Fix:** Update each image's alt text in Wix Media Manager to a descriptive name matching the adjacent heading, e.g., `"Mona, tutor at Firefly Tutoring"`.

---

### MAJ-2: Images missing alt text (F-P4)

**WCAG:** 1.1.1 | **Affects:** Homepage, Programs/Math, Approach

- Homepage: `alt="IMG_6390_edited.jpg"` on tutoring photo → change to descriptive text
- Programs/Math: one image with no `alt` attribute → add `alt` (descriptive or `alt=""` if decorative)
- Approach: one image with `alt=""` → verify if decorative; if not, add descriptive text

---

### MAJ-3: Skip button focus not visible (F-O1)

**WCAG:** 2.4.7, 2.4.11 | **Affects:** All pages

The Skip to Main Content button receives keyboard focus (confirmed by testing) but shows no visible focus indicator — computed outline is `none`. Additionally, the first Tab stop on every page is a `<div role="region" aria-label="top of page">` — a non-interactive container that should not receive Tab focus. **Fix:** Add a high-contrast `:focus` style to the skip button (e.g., `outline: 2px solid #000; outline-offset: 2px`). File a Wix support ticket for the unexpected region div focus stop.

---

### MAJ-4: `aria-expanded` on `<a>` elements without role (F-O3)

**WCAG:** 4.1.2 | **Affects:** Nav dropdowns on all pages (PROGRAMS, CONTACT)

The nav dropdown triggers are `<a>` elements with `aria-expanded="false/true"` but no `role="button"`. The `aria-expanded` state is not semantically valid on a plain link. Screen readers may not announce the expanded/collapsed state correctly. **Fix:** Add `role="button"` to these trigger elements, or restructure the dropdown so the trigger is a `<button>` and the link navigates to the top-level page.

---

### MAJ-5: Required fields not indicated (F-U2)

**WCAG:** 3.3.2 | **Affects:** Inquiries form

Only Email is required, but no visual or programmatic required indicator exists. `aria-required="false"` is explicitly set on all non-required fields (correct), but the required Email field lacks `aria-required="true"`. No asterisk or "required" legend is visible. **Fix:** Add `aria-required="true"` to the email input and a visible required indicator in the form design.

---

### MAJ-6: Gallery buttons have no accessible name (F-R3)

**WCAG:** 4.1.2 | **Affects:** Homepage Instagram feed

Two `<div role="button">` elements in the Instagram gallery have no accessible name (empty text, no `aria-label`). Screen readers announce "button" with no purpose. **Fix:** Add descriptive `aria-label` attributes to each gallery button via the Wix Pro Gallery accessibility settings or Velo.

---

## 4. Minor Issues

---

### MIN-1: Skip link is a `<button>`, not an `<a>` (F-O2)

The skip mechanism uses `<button>` instead of `<a href="#content">`. Functionally works; non-standard implementation. Test with NVDA+Chrome and VoiceOver+Safari to confirm consistent behavior. Consider switching to standard anchor if Wix allows HTML injection.

---

### MIN-2: Malformed `tel:` URI (F-U4)

Contact page: `href="tel:(979) 900-9460"` should be `href="tel:+19799009460"`. The malformed format may fail on mobile devices.

---

### MIN-3: Empty `role=""` attributes (F-R2)

Multiple `<div role="">` elements found on the homepage (Wix-generated). Empty role is invalid per ARIA spec. Low practical impact but should be removed; file Wix support ticket.

---

## 5. Component-Specific Findings

### Navigation

| Issue | Severity | WCAG |
|---|---|---|
| `aria-expanded` on `<a>` without `role="button"` | Major | 4.1.2 |
| First Tab stop is non-interactive `role="region"` div | Major | 2.4.3 |
| Skip button has no visible focus indicator | Major | 2.4.7 |
| Skip button is `<button>` not `<a>` | Minor | 2.4.1 |

### Homepage

| Issue | Severity | WCAG |
|---|---|---|
| No H1 | Critical | 1.3.1 |
| Heading order: H3 → H6 → H6 → H4 → H2 → H6 | Critical | 1.3.1 |
| `alt="IMG_6390_edited.jpg"` on tutoring photo | Major | 1.1.1 |
| 9 focusable elements inside `aria-hidden` | Critical | 4.1.2 |
| 2 nameless `role="button"` gallery divs | Major | 4.1.2 |
| `role=""` on multiple elements | Minor | 4.1.2 |

### Inquiry Form (Inquiries page)

| Issue | Severity | WCAG |
|---|---|---|
| 4 fields with no label | Critical | 1.3.1 |
| Textarea with empty label | Critical | 4.1.2 |
| No required indicator | Major | 3.3.2 |
| Form errors not announced | Critical | 3.3.1 |
| No `aria-describedby` for error messages | Critical | 3.3.3 |

### Team Page

| Issue | Severity | WCAG |
|---|---|---|
| Two H1 elements (at bottom of page) | Critical | 1.3.1 |
| Heading order: H6 → H2 → H4×12 → H1 → H1 | Critical | 1.3.1 |
| 11 staff photos with filename alt text | Major | 1.1.1 |
| 3 images with empty alt="" (possibly informational) | Major | 1.1.1 |

### Footer (all pages)

| Issue | Severity | WCAG |
|---|---|---|
| `<h6>123-456-7890</h6>` — placeholder phone in heading element | Minor | 1.3.1 |

### Contact Page

| Issue | Severity | WCAG |
|---|---|---|
| No H1 | Critical | 1.3.1 |
| Malformed `tel:` URI for second phone number | Minor | — |

---

## 6. Remediation Recommendations

### Priority 1 — Highest Impact, Low-to-Medium Effort (Content Editor Changes)

These fixes require only Wix editor changes — no code.

| Fix | Affected Pages | Effort | WCAG Resolved |
|---|---|---|---|
| Add H1 to every page (change top heading level) | All | 1–2 hrs | 1.3.1, 2.4.6 |
| Reassign heading levels to proper hierarchy | All | 2–4 hrs | 1.3.1 |
| Update staff photo alt text in Media Manager | Team | 1 hr | 1.1.1 |
| Update other image alt text (homepage, math, approach) | 3 pages | 30 min | 1.1.1 |
| Enable visible labels in Wix form widget | Inquiries | 30 min | 1.3.1, 3.3.2 |
| Fix malformed `tel:` URI on Contact page | Contact | 5 min | — |

### Priority 2 — Medium Impact, Wix Settings or Velo Required

| Fix | Affected Pages | Effort | WCAG Resolved |
|---|---|---|---|
| Enable form inline error messages (Wix form settings) | Inquiries | 30 min | 3.3.1 |
| Add `aria-required="true"` to required field (Velo or form settings) | Inquiries | 1 hr | 3.3.2 |
| Add `aria-label` to gallery buttons (Velo or Pro Gallery settings) | Homepage | 1 hr | 4.1.2 |
| Add visible `:focus` style to skip button (Wix CSS) | All | 1 hr | 2.4.7 |

### Priority 3 — Platform-Level Issues (Wix Support Required)

| Fix | Affected Pages | Effort | WCAG Resolved |
|---|---|---|---|
| Fix `aria-hidden` containers with focusable children | Homepage | Wix ticket | 4.1.2 |
| Fix `role="button"` on dropdown `<a>` triggers | All (nav) | Wix ticket or Velo | 4.1.2 |
| Remove empty `role=""` attributes | Homepage | Wix ticket | 4.1.2 |
| Fix non-interactive region div receiving first Tab focus | All | Wix ticket | 2.4.3 |

---

### Quick Wins (< 30 minutes total, done in Wix editor today)

1. **Fix H1 on all pages** — Open each page in Wix editor, click the top heading, change Text Theme to Heading 1
2. **Update 11 staff photo alt texts** — Media Manager → click each image → edit Alt Text
3. **Fix malformed tel: link** — Edit the Contact page and fix the second phone number href
4. **Add form field labels** — In the form widget, enable "Show labels" for each field

These four changes address CRIT-1, MAJ-1, MIN-2, and CRIT-3 — the four highest-visibility issues.

---

### Testing Process to Verify Fixes

**Automated (after each deploy):**
- Run Lighthouse accessibility audit: target score ≥ 95
- Run `axe-core` browser extension on all 6 audited pages
- Confirm `heading-order`, `label`, `image-alt`, `color-contrast` return Pass (not N/A)

**Manual keyboard walk (30 minutes):**
1. Open each page in Chrome, Tab through from top — every interactive element should show a visible focus ring
2. Confirm Skip to Main Content is first focusable element and moves focus to `<main>` on Enter
3. Navigate headings with screen reader heading shortcuts (H key in NVDA, VoiceOver rotor) — confirm logical flow from H1 → H2 → H3
4. On Inquiries form: submit empty → confirm error message appears visually and is announced by screen reader; confirm required email field is announced as required

**Screen reader testing (1 hour):**
- NVDA + Chrome (Windows) — test all critical paths: navigation, form submission, team page
- VoiceOver + Safari (macOS/iOS) — same paths
- Confirm staff photo alt texts are read as names (not filenames)
