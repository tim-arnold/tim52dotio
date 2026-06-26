# Accessibility Audit — tim52.io

**Date:** June 26, 2026  
**Pages tested:** `/` · `/portfolio` · `/code-samples`  
**Standard:** WCAG 2.1 AA  
**Method:** Automated + manual inspection via Playwright  

---

## Summary

| | Count |
|---|---|
| Errors | 1 |
| Warnings | 2 |
| Passes | 14 |
| Pages tested | 3 |

---

## Errors

### 1. Tab panels reference IDs that don't exist
**Rule:** `aria-labelledby` / WCAG 4.1.2  
**File:** `src/components/AIInterface.tsx:21,30,44,53`

Both `chat-panel` and `fit-panel` have `aria-labelledby="chat-tab"` and `aria-labelledby="fit-tab"` respectively, but neither tab `<button>` has an `id` attribute. Screen readers announce the panel as unlabelled — the tab's text ("Ask AI About Me", "Fit Assessment") is silently lost when a user navigates into the panel.

**Fix:** Add matching `id` attributes to the tab buttons:

```tsx
<button
  id="chat-tab"          // ← add this
  role="tab"
  aria-selected={activeTab === 'chat'}
  aria-controls="chat-panel"
  …>Ask AI About Me</button>

<button
  id="fit-tab"           // ← add this
  role="tab"
  aria-selected={activeTab === 'fit'}
  aria-controls="fit-panel"
  …>Fit Assessment</button>
```

---

## Warnings

### 1. Six buttons are missing `type="button"`
**Rule:** HTML button type spec  
**Files:** `src/components/Navigation.tsx:280`, `src/components/AIInterface.tsx:21,30`, `src/components/AskAI.tsx:125`

The HTML default for `<button>` is `type="submit"`. Six buttons — "Close Menu", "Ask AI About Me", "Fit Assessment", and the three suggested-question chips — have no explicit type and are not inside a `<form>`. They don't accidentally submit anything today, but the implicit submit type is semantically incorrect and can confuse assistive technology.

**Fix:** Add `type="button"` to each:

```tsx
// Navigation.tsx:280
<button type="button" className={styles.closeMenuButton} …>

// AIInterface.tsx:21, 30
<button type="button" role="tab" …>

// AskAI.tsx:125 — suggested question chips
<button type="button" className={styles.suggestedButton} …>
```

### 2. AI chat responses are not announced to screen readers
**Rule:** `aria-live` / WCAG 4.1.3  
**File:** `src/components/AskAI.tsx:118`

When the AI replies, the message renders into the chat container but there is no `aria-live` region. Screen reader users receive no announcement that a response has arrived. (The error state correctly uses `role="alert"`, but successful responses have no equivalent.)

**Fix:** Add `aria-live="polite"` to the chat container:

```tsx
<div
  ref={chatContainerRef}
  className={styles.chatContainer}
  aria-live="polite"
  aria-atomic="false"
  aria-label="Conversation"
>
```

Use `aria-atomic="false"` so only newly added messages are read, not the full history on each update.

---

## Passes

The site is in very good shape. The following were explicitly verified across all three pages:

- **Skip link** — present, functional, correctly targets `#main-content` on `<main>`
- **Language attribute** — `<html lang="en">` on all pages
- **Page titles** — descriptive, unique titles on all 3 pages
- **Focus styles** — `focus-visible` with 3px solid indicator; no outline suppression without replacement
- **High contrast mode** — `prefers-contrast: more` handled with 4px `currentColor` outline
- **Reduced motion** — global `prefers-reduced-motion` rule disables all animation/transitions site-wide
- **Image alt text** — all images across all pages carry descriptive alt attributes
- **Icon link** — LinkedIn icon-only link has `aria-label="LinkedIn Profile"`
- **Contact form labels** — all inputs (name, email, message) have associated `<label>` elements
- **Hamburger menu** — `aria-expanded`, `aria-controls`, and `aria-label` all correct
- **Nav when closed** — all menu links and the close button use `tabindex="-1"` when collapsed; keyboard users can't accidentally tab into a hidden menu
- **Heading hierarchy** — single H1 on each page, clean H1→H2→H3 descent, no skipped levels
- **Landmark structure** — `<nav>`, `<main>`, and `<footer>` present on all pages
- **Error announcements** — AI chat error state uses `role="alert"` for immediate screen reader announcement

---

## Note on color contrast

Color contrast ratios require precise measurement at specific viewport sizes and color schemes. This audit found no obvious contrast red flags based on the defined CSS custom properties, but a tool like [axe DevTools](https://www.deque.com/axe/devtools/) or [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) is recommended for a full WCAG 1.4.3 contrast check, especially for hero text-on-background and overlay states.
