# Accessibility Findings — Firefly Tutoring

## Data Sources

| Section | Tool Used | Date | Notes |
|---|---|---|---|
| Pass 1: Code-Level Audit | N/A — No local site path | 2026-07-18 | Site is hosted on Wix; no local codebase available. Code-level checks performed via Playwright JS evaluation on live DOM. |
| Screenshots | Playwright MCP `browser_take_screenshot` | 2026-07-18 | Screenshots were taken and viewed during the session (homepage, contact, inquiries, programs, team, focus states, form validation) but were not persisted to disk due to Playwright MCP sandbox path restrictions. Findings are documented from accessibility tree snapshots and JS evaluation results. |
| Homepage live audit | Playwright MCP (`browser_navigate`, `browser_snapshot`, `browser_evaluate`, `browser_press_key`) | 2026-07-18 | URL: https://www.fireflytutoring.com |
| Contact page live audit | Playwright MCP | 2026-07-18 | URL: https://www.fireflytutoring.com/contact |
| Inquiries form live audit | Playwright MCP | 2026-07-18 | URL: https://www.fireflytutoring.com/inquiries — form validation tested by clicking Submit with empty required field |
| Programs (Math) page | Playwright MCP | 2026-07-18 | URL redirected to https://www.fireflytutoring.com/math |
| Approach page | Playwright MCP | 2026-07-18 | URL: https://www.fireflytutoring.com/approach |
| Team page | Playwright MCP | 2026-07-18 | URL: https://www.fireflytutoring.com/team |
| Keyboard navigation | Playwright MCP (`browser_press_key`, `browser_evaluate`) | 2026-07-18 | Tab order and focus visibility tested on homepage |
| Automated Lighthouse audit | DataForSEO `on_page_lighthouse` | 2026-07-18 | Desktop Lighthouse. Score: 91/100. Many a11y checks returned N/A due to Wix JS rendering. |
| Color contrast | Not collected | 2026-07-18 | Lighthouse `color-contrast` returned N/A. Manual contrast testing not performed in this session. |

---

## 1. Perceivable

### F-P1 — No H1 element on most pages

- **WCAG criterion:** 1.3.1 Info and Relationships, 2.4.6 Headings and Labels
- **Severity:** Critical
- **Source:** Live (JS evaluation on all pages)
- **Location:**
  - https://www.fireflytutoring.com — first heading is H3 ("K-12 one-on-one tutoring…")
  - https://www.fireflytutoring.com/contact — first heading is H4 ("Contact Firefly Tutoring")
  - https://www.fireflytutoring.com/math — first heading is H2 ("Firefly Tutoring Math Program")
  - https://www.fireflytutoring.com/approach — first heading is H2 ("The Firefly Tutoring Approach")
  - https://www.fireflytutoring.com/inquiries — first heading is H5 ("Contact Us")
- **Description:** No page has an H1 at the top of content. Screen reader users rely on H1 to identify the page topic; assistive technology users who navigate by headings land in confusing or disorienting structure.
- **Recommended fix:** In Wix editor, change the primary page title element on each page to H1. For the homepage this is the "Our Mission…" paragraph or the banner heading; for subpages it is the first content heading.

---

### F-P2 — Broken heading hierarchy across all pages

- **WCAG criterion:** 1.3.1 Info and Relationships
- **Severity:** Critical
- **Source:** Live (JS evaluation)
- **Location:** All audited pages
- **Description:** Heading levels skip, reverse, and repeat across every page. Detail by page:

  | Page | Heading sequence observed |
  |---|---|
  | Homepage | H3 → H6 → H6 → H4 → H2 → H6 |
  | Contact | H4 → H6 |
  | Inquiries | H5 → H6 |
  | Programs/Math | H2 → H3 → H5 → H5 → H5 → H6 |
  | Approach | H2 → H3 → H3 → H3 → H3 → H3 → H6 → H5 → H5 → H5 → H5 → H4 → H6 |
  | Team | H6 → H2 → H4 × 12 → H1 → H1 → H6 |

  The footer contains `<h6>123-456-7890</h6>` on every page — a placeholder phone number styled as a heading for visual effect. The team page has two H1 elements placed at the bottom of the page, after twelve H4 elements and one H6.
- **Recommended fix:** In Wix, re-assign heading levels to follow a strict hierarchy: one H1 per page (page title), H2 for major sections, H3 for subsections, etc. Do not use heading elements for visual styling — use paragraph + bold/custom styling instead.

---

### F-P3 — Staff headshots use filenames as alt text

- **WCAG criterion:** 1.1.1 Non-text Content
- **Severity:** Major
- **Source:** Live (JS evaluation on team page)
- **Location:** https://www.fireflytutoring.com/team — all staff portrait images
- **Description:** Every staff photo has a filename as its `alt` attribute rather than a descriptive name. Examples observed:
  - `alt="mona.jpg"`
  - `alt="Professional Headshot_IWILLIAMS.jpg"`
  - `alt="Jarrad Tutor.jpg"`
  - `alt="PXL_20220730_185844586_edited.jpg"`
  - `alt="amina.png"`, `alt="IMG_6583_edited.jpg"`, `alt="paul.jpg"`, `alt="PXL_20220112_225510649_edited.jpg"`, `alt="PXL_20230203_230415070_edited.jpg"`, `alt="Batu's Photo for Website.jpeg"`, `alt="IMG_8193.JPG"`

  Screen readers will read the full filename string, which is meaningless or disruptive to a visually impaired user.
- **Recommended fix:** In Wix media manager, update the alt text for each staff photo to a descriptive name: e.g., `"Mona, tutor at Firefly Tutoring"`. Each name should match the adjacent H4 team member name.

---

### F-P4 — Images missing alt text or using empty `alt=""`

- **WCAG criterion:** 1.1.1 Non-text Content
- **Severity:** Major
- **Source:** Live (JS evaluation)
- **Location:**
  - https://www.fireflytutoring.com — `alt="IMG_6390_edited.jpg"` on a photo of a tutoring session
  - https://www.fireflytutoring.com/math — one `<img>` with no alt attribute at all
  - https://www.fireflytutoring.com/approach — one image with `alt=""`
  - https://www.fireflytutoring.com/team — three images with `alt=""` (two may be decorative layout images; one may be a staff photo)
- **Description:** The homepage tutoring photo uses a filename as alt text (same pattern as F-P3). The programs/math page has an image missing the `alt` attribute entirely — this causes screen readers to announce the full URL. Images with `alt=""` are treated as decorative and skipped; if any of those are informational team photos, this is a violation.
- **Recommended fix:** In Wix editor, set descriptive alt text on the homepage photo (e.g., "A student working one-on-one with a tutor at Firefly Tutoring") and the math page image. Verify the team page `alt=""` images are genuinely decorative; if not, add descriptive alt text.

---

## 2. Operable

### F-O1 — Skip button focus indicator not visible

- **WCAG criterion:** 2.4.7 Focus Visible, 2.4.11 Focus Appearance (AA in WCAG 2.2)
- **Severity:** Major
- **Source:** Live (keyboard test + JS evaluation)
- **Location:** https://www.fireflytutoring.com — "Skip to Main Content" button, Tab stop 2
- **Description:** The Skip to Main Content button receives keyboard focus (confirmed: `document.activeElement` shows the button after 2 Tab presses), but its computed outline style is `rgb(17, 109, 255) none 3px` — the `none` value means no visible outline is rendered. The button is not visually distinguishable when focused.

  Separately, the first Tab stop is a `<div role="region" aria-label="top of page">` element — a non-interactive container that should not be in the Tab sequence at all.
- **Recommended fix:** In Wix, add a visible `:focus` style to the skip button (solid 2px+ outline, high-contrast color). The region div receiving focus is a Wix platform behavior and may not be directly editable; flag to Wix support if it cannot be resolved.

---

### F-O2 — Skip link is a `<button>`, not an `<a>` — and its functionality should be confirmed by screen reader

- **WCAG criterion:** 2.4.1 Bypass Blocks
- **Severity:** Minor
- **Source:** Live
- **Location:** https://www.fireflytutoring.com — "Skip to Main Content"
- **Description:** The skip mechanism is implemented as a `<button>` rather than an `<a href="#main">`. Testing confirmed it does move focus to `<main id="PAGES_CONTAINER">` when activated (Enter key). The button is present and functional, but the invisible focus indicator (F-O1) severely undermines its usability. A button-based skip is non-standard and may not be announced correctly by all screen reader + browser combinations.
- **Recommended fix:** Ensure the button-based skip mechanism is tested with NVDA+Chrome and VoiceOver+Safari. Consider switching to a standard `<a href="#mainContent">` skip link if Wix allows custom HTML injection.

---

### F-O3 — `aria-expanded` on `<a>` elements without matching role

- **WCAG criterion:** 4.1.2 Name, Role, Value
- **Severity:** Major
- **Source:** Live (JS evaluation on programs page nav)
- **Location:** Navigation dropdown triggers — "PROGRAMS" and "CONTACT" links with sub-menus
- **Description:** The nav dropdown triggers are `<a>` elements with `aria-expanded="false"` but no explicit `role` attribute. The `aria-expanded` attribute is valid on disclosure buttons but its use on an anchor without `role="button"` is semantically inconsistent. Screen readers may announce these as links and not convey the expandable state.
- **Recommended fix:** Add `role="button"` to the dropdown trigger elements, or restructure so the dropdown trigger is a `<button>` and the navigation destination is a sibling `<a>`. This is a Wix platform pattern; flag to Wix if not configurable.

---

## 3. Understandable

### F-U1 — Form fields have no visible or programmatic labels

- **WCAG criterion:** 1.3.1 Info and Relationships, 3.3.2 Labels or Instructions
- **Severity:** Critical
- **Source:** Live (JS evaluation on inquiries page)
- **Location:** https://www.fireflytutoring.com/inquiries — all form fields
- **Description:** The inquiry form has five fields. Four have no associated `<label>` element, no `aria-label`, and no `aria-labelledby`. They rely solely on placeholder text:
  - First Name (input `#input_comp-kbjzh1r5`) — no label
  - Last Name (input `#input_comp-kbjzh1rl`) — no label
  - Email (input `#input_comp-kbjzh1rw`) — no label; this field has `required` set
  - Phone (input `#input_comp-kbjzh1s6`) — no label

  The fifth field (textarea `#textarea_comp-kbjzh1si`) has a `<label for="...">` associated by id, but the label element is empty (zero-length text). This means all five fields are effectively unlabeled for screen reader users. Placeholder text disappears on input and is not a substitute for a label.
- **Recommended fix:** In Wix form editor, enable visible labels for all fields. Wix Corvid/Editor allows adding labels; alternatively, use the "Label" field option in the Wix form widget settings. If labels cannot be shown visually, add `aria-label` attributes via Wix custom HTML/CSS or Velo.

---

### F-U2 — Required field not indicated visually or programmatically (except email)

- **WCAG criterion:** 3.3.2 Labels or Instructions
- **Severity:** Major
- **Source:** Live (JS evaluation on inquiries page)
- **Location:** https://www.fireflytutoring.com/inquiries — Email field
- **Description:** Only the Email field has `required` set. No field has a visible asterisk or "required" label. No `aria-required="true"` is present on the email field; `aria-required="false"` is explicitly set on all other fields. Users cannot determine which fields are mandatory before submitting.
- **Recommended fix:** Add visible required indicators (e.g., asterisk + legend: "* required") and ensure `aria-required="true"` is set on required inputs.

---

### F-U3 — Form error messages not announced to screen readers

- **WCAG criterion:** 3.3.1 Error Identification, 3.3.3 Error Suggestion
- **Severity:** Critical
- **Source:** Live (form submission test + JS evaluation)
- **Location:** https://www.fireflytutoring.com/inquiries — Email field validation
- **Description:** When submitting the form with the required Email field empty, `aria-invalid="true"` is correctly set on the email input. However:
  - `aria-describedby` is `null` — no error message element is programmatically associated with the input
  - No `role="alert"` or `aria-live` region exists on the page
  - No visible error message text was found in the DOM after submission

  Screen reader users receive no notification that submission failed or what field is invalid. The only feedback is browser-native tooltip validation, which is not announced by most screen reader + browser combinations and disappears on next user interaction.
- **Recommended fix:** Wix's built-in form widget should show inline error messages after validation; verify this is enabled in the form settings. If using a custom form, add an `aria-describedby` pointing to an error message element, and add `role="alert"` or `aria-live="assertive"` to that element.

---

### F-U4 — Malformed `tel:` URI on contact page

- **WCAG criterion:** 1.3.1 Info and Relationships (best practices)
- **Severity:** Minor
- **Source:** Live (JS evaluation on contact page)
- **Location:** https://www.fireflytutoring.com/contact — second phone number link
- **Description:** The link `<a href="tel:(979) 900-9460">` uses a malformed tel: URI. The RFC 3966 format requires `tel:+19799009460`. The malformed format may fail to trigger dialing on mobile devices and may be misread by AT.
- **Recommended fix:** Change the href to `tel:+19799009460`.

---

## 4. Robust

### F-R1 — Focusable elements inside `aria-hidden="true"` containers

- **WCAG criterion:** 4.1.2 Name, Role, Value
- **Severity:** Critical
- **Source:** Live (JS evaluation on homepage)
- **Location:** https://www.fireflytutoring.com — 9 focusable elements (`a`, `button`, `input`) found inside `aria-hidden="true"` containers
- **Description:** Elements inside an `aria-hidden="true"` container are hidden from the accessibility tree, meaning screen readers skip them. However, if those elements are keyboard-focusable, keyboard users (including some AT users) can still Tab to them — but nothing will be announced when they land on these elements. This creates a "phantom focus" situation that is confusing and non-compliant.
- **Recommended fix:** For each `aria-hidden="true"` container containing focusable elements, either: (a) remove `aria-hidden` if the content should be accessible, or (b) add `tabindex="-1"` to all focusable descendants to remove them from the Tab order. This is likely a Wix-generated pattern (e.g., duplicate off-screen carousels or hidden navigation duplicates); may require Wix support.

---

### F-R2 — `role=""` (empty role) on multiple elements

- **WCAG criterion:** 4.1.2 Name, Role, Value
- **Severity:** Minor
- **Source:** Live (JS evaluation on homepage)
- **Location:** https://www.fireflytutoring.com — multiple `<div role="">` elements
- **Description:** Several `<div>` elements have `role=""` (empty string). An empty role attribute is invalid per ARIA specification and may cause unexpected behavior in some screen readers. These are likely Wix platform-generated attributes.
- **Recommended fix:** Remove `role=""` attributes (empty role should not be present). Flag to Wix support if these are platform-generated.

---

### F-R3 — `role="button"` on `<div>` elements with no accessible name

- **WCAG criterion:** 4.1.2 Name, Role, Value
- **Severity:** Major
- **Source:** Live (JS evaluation on homepage)
- **Location:** https://www.fireflytutoring.com — Instagram feed gallery, two `<div role="button">` elements with empty text content
- **Description:** Two `<div role="button">` elements in the Instagram gallery section have no text content and no `aria-label`. Screen readers will announce "button" with no name, giving the user no information about the button's purpose.
- **Recommended fix:** Add `aria-label` to each gallery item button, e.g., `aria-label="View Instagram post: [post description]"`. If these are Wix Pro Gallery items, update via the gallery widget's accessibility settings or Wix Velo.

---

## Summary Table

| ID | WCAG Criterion | Severity | Source | Pages Affected |
|---|---|---|---|---|
| F-P1 | 1.3.1, 2.4.6 — No H1 | Critical | Live | Homepage, Contact, Programs, Approach, Inquiries |
| F-P2 | 1.3.1 — Broken heading hierarchy | Critical | Live | All pages |
| F-P3 | 1.1.1 — Filename alt text on staff photos | Major | Live | Team |
| F-P4 | 1.1.1 — Missing/empty alt text | Major | Live | Homepage, Programs, Approach, Team |
| F-O1 | 2.4.7, 2.4.11 — Skip button no focus indicator | Major | Live | All pages |
| F-O2 | 2.4.1 — Skip link is non-standard button | Minor | Live | All pages |
| F-O3 | 4.1.2 — `aria-expanded` on `<a>` without role | Major | Live | All pages (nav) |
| F-U1 | 1.3.1, 3.3.2 — Form fields no labels | Critical | Live | Inquiries |
| F-U2 | 3.3.2 — Required fields not indicated | Major | Live | Inquiries |
| F-U3 | 3.3.1, 3.3.3 — Form errors not announced | Critical | Live | Inquiries |
| F-U4 | 1.3.1 — Malformed tel: URI | Minor | Live | Contact |
| F-R1 | 4.1.2 — Focusable in aria-hidden | Critical | Live | Homepage |
| F-R2 | 4.1.2 — Empty role attribute | Minor | Live | Homepage |
| F-R3 | 4.1.2 — `role="button"` with no name | Major | Live | Homepage |

**Severity counts:** Critical: 5 · Major: 6 · Minor: 3
