# FormaUI Accessibility Audit

Standard: WCAG 2.2 Level AA

Scope: the 13 FormaUI components (Button, Input, Checkbox, RadioGroup, Select, Switch,
Alert, Badge, Toast, Modal, Tooltip, Popover, Tabs) and the 9-page dashboard that
demonstrates them, in the light and dark themes.

## 1. Keyboard Accessibility

- [x] All interactive elements accessible by keyboard (keyboard sweep: every expected tab stop on all 9 pages is reached, both themes)
- [x] Logical tab order (DOM order matches visual order: sidebar, header, then content top to bottom; radio groups are one stop; disabled controls are skipped)
- [x] Visible keyboard focus (every tab stop matches `:focus-visible` and draws a ring with at least 3:1 contrast against its background)
- [x] No keyboard traps (the sweep cycles back to the first stop on every page; Modal: Escape always closes it, and Chrome lets Tab pass through its own browser UI and back, never onto the page behind)
- [x] Escape closes dismissible overlays (Modal, Popover, Tooltip; browser-tested)
- [x] Arrow keys work correctly in Tabs (automatic and manual activation, Home/End, disabled tab skipped; browser-tested)

## 2. Colour and Contrast

- [x] Normal text contrast: at least 4.5:1 (axe on all 9 pages, all open states and all button hover states, both themes)
- [x] Large text contrast: at least 3:1 (same axe runs)
- [x] UI components and focus indicators: at least 3:1 (measured in both themes; see "Non-text contrast" below)
- [x] Information is not communicated by colour alone (manual review; see "Manual checks" below)
- [x] Light theme checked
- [x] Dark theme checked

## 3. Forms

- [x] Every input has an accessible label (axe `label` passes on Form Elements in both themes; unit tests query every control by its label)
- [x] Required fields are identified (native `required`, exposed to assistive technology; a visual asterisk marked `aria-hidden`)
- [x] Errors are associated with inputs (`aria-invalid` plus `aria-describedby` pointing at the error text; unit-tested for Input, Checkbox, RadioGroup, Select and Switch)
- [x] Hints are associated with inputs (`aria-describedby`; unit-tested for the same five components)
- [x] Disabled states are distinguishable (reduced opacity, `not-allowed` cursor and a secondary surface, and the native `disabled` attribute)
- [x] Checkbox and radio keyboard behaviour works (browser-tested: arrow keys move and select within a radio group, Space toggles a Checkbox and a Switch, the disabled group can't be focused)

## 4. Overlays

- [x] Modal receives focus when opened
- [x] Modal keeps focus within its boundary (focus never reaches the page behind)
- [x] Modal returns focus appropriately (to the trigger on Escape)
- [x] Tooltip works with keyboard and pointer (keyboard: browser-tested; pointer and hoverable content: browser-checked in Stage 9.2)
- [x] Popover has an accessible name (title, or `label` when untitled)
- [x] Popover supports Escape (focus returns to the trigger)
- [x] Popover closes when focus moves out of it (A11Y-005)
- [x] Background interaction is appropriate (Modal blocks the page; Popover and Tooltip are non-modal by design)

## 5. Screen Reader Support

- [x] Buttons have meaningful accessible names (axe `button-name` passes everywhere; icon-only dismiss buttons use `aria-label`)
- [x] Headings follow a logical hierarchy (A11Y-006, A11Y-007; Popover `titleAs`, A11Y-002)
- [x] Alerts use appropriate live regions (Toast: `role="status"`, `aria-live="polite"`, browser-tested; Alert: Success and Information use `status`, Warning and Error use `alert`, browser-tested)
- [x] Tabs expose correct ARIA relationships (`tablist`/`tab`/`tabpanel`, `aria-controls`, `aria-labelledby`, `aria-selected`; all 8 dashboard tabs checked both ways)
- [x] Decorative icons are hidden from assistive technology (browser test covers sidebar icons, brand tile, Alert and Toast icons, badge dots, dismiss symbols and the version bullet)
- [ ] Verified with a real screen reader (not done; see "Remaining limitations")

## 6. Responsive and Motion

- [x] Layout works at 320px viewport width (all 9 pages reachable, no horizontal scroll; A11Y-009)
- [x] Content works at 200% zoom (720x450 CSS viewport, the equivalent of 200% on a 1440x900 screen)
- [x] Interactive targets meet WCAG 2.2 target-size requirements (2.5.8: every target is at least 24x24 or meets the spacing exception)
- [x] Reduced-motion preference is respected (browser-tested: Modal, Popover and Tooltip have no animation and Button and Switch have no transition when `prefers-reduced-motion: reduce`)

## 7. Automated Testing

- [x] Vitest suite passes (175 tests, 14 files)
- [x] jest-axe checks pass (every component has an axe test)
- [x] Storybook stories render (85 stories across 13 components; `build-storybook` passes)
- [x] Production build passes
- [x] Lint passes
- [x] Playwright browser suite passes (78 tests, Chromium)

## WCAG 2.2 AA Verification

Status values: **Verified** means automated tests and manual checks agree and nothing
is outstanding. **Partial** means what was tested passes, but part of the criterion
still needs a check that hasn't been done.

| Criterion | Status | Evidence | Still to review |
| --- | --- | --- | --- |
| 1.1.1 Non-text Content | Verified | axe `image-alt`, `svg-img-alt`, `button-name` on all pages; decorative symbols `aria-hidden` (browser test); icon-only buttons named with `aria-label` | |
| 1.3.1 Info and Relationships | Verified | One `h1` per page and a logical outline (A11Y-006, 007); Popover `titleAs` (A11Y-002); labels, hints and errors linked by `for`/`aria-describedby`; radio groups in `fieldset`/`legend`; Tabs ARIA pairs | Screen-reader confirmation of how the outline and form relationships are announced |
| 1.4.3 Contrast (Minimum) | Verified | axe on 9 pages x 2 themes, every open overlay state, and every button variant while hovered (A11Y-001, A11Y-008 fixed) | Pressed (`:active`) states aren't scanned |
| 1.4.10 Reflow | Verified | No horizontal scroll on any page at 320, 375, 768, 1440 and 720x450 (200% zoom); Tooltip and Popover stay inside the viewport at 320 and 375 (A11Y-004, A11Y-009 fixed) | Overlays are clamped horizontally only; there's no vertical flip |
| 1.4.11 Non-text Contrast | Verified | Measured in both themes: control borders and selected-state indicators all at least 3.45:1; focus rings at least 3:1 on every tab stop (keyboard sweep). See "Non-text contrast" | |
| 2.1.1 Keyboard | Verified | Keyboard sweep reaches every tab stop on every page; Modal, Popover, Tooltip, Toast, Tabs, radio, checkbox and switch operated by keyboard in tests | |
| 2.1.2 No Keyboard Trap | Verified | Sweep cycles back to its first stop on all 18 page and theme runs; Modal closes with Escape; Popover closes on focus-out | |
| 2.4.3 Focus Order | Verified | DOM order matches visual order; focus moves into Modal and Popover on open and returns to the trigger on close; Tabs keep focus when the selected panel is replaced (A11Y-003) | |
| 2.4.7 Focus Visible | Verified | Every tab stop matches `:focus-visible` with an outline or ring (sweep, both themes) | |
| 2.4.11 Focus Not Obscured (Minimum) | Verified | Every focused element is the topmost element at its centre (sweep); Popover closes when focus leaves so it can't cover the next stop (A11Y-005) | No sticky headers exist today; recheck if one is added |
| 2.5.8 Target Size (Minimum) | Verified | Every target on all 9 pages is at least 24x24 or meets the spacing exception; links inside sentences use the inline exception | |
| 3.3.1 Error Identification | Verified | Errors are shown as text, set `aria-invalid` and are linked with `aria-describedby` (unit tests on all five form controls) | Error announcement timing with a real screen reader |
| 3.3.2 Labels or Instructions | Verified | Every control has a visible label (axe `label`); hints give instructions; required fields use native `required` plus a visual asterisk | The dashboard doesn't explain the asterisk in text; consuming forms should |
| 4.1.2 Name, Role, Value | Verified | axe on all pages and open states; native elements throughout; Switch exposes `role="switch"` and its checked state; Tabs, Popover, Modal and Toast roles and states checked in the browser | |
| 4.1.3 Status Messages | Partial | Toast uses `role="status"` and `aria-live="polite"`; Alert roles match urgency (browser-tested) | Not checked with a screen reader. A live region inserted together with its content isn't reliably announced by every screen reader, so whether a new Toast or Alert is read aloud needs NVDA and VoiceOver testing |

Conformance: 14 of the 15 listed criteria are verified within the scope above; 4.1.3
is partial. This audit **does not claim full WCAG 2.2 AA compliance**: the remaining
AA criteria weren't all individually assessed, testing was in Chromium only, and no
screen reader has been used yet.

## Automated Results

Final run, 2026-11-19 (rerun after the Stage 14 token refactor and new foundation pages):

| Check | Command | Result |
| --- | --- | --- |
| Unit and component tests (with jest-axe) | `npm run test:run` | 175 passed, 14 files |
| Lint | `npm run lint` | No problems |
| Production build | `npm run build` | Passes |
| Storybook build | `npm run build-storybook` | Passes; 85 stories render |
| Browser accessibility tests | `npm run test:a11y` (`npx playwright test`) | 78 passed |

Browser tests by file:

| File | Tests | Covers |
| --- | --- | --- |
| `tests/accessibility.spec.ts` | 20 | axe scan of 9 pages x 2 themes, a basic keyboard check, the theme toggle |
| `tests/interactive-accessibility.spec.ts` | 24 | Open-state scans, hover contrast, Modal / Popover / Tooltip / Toast / Tabs keyboard behaviour, Alert roles, Tabs ARIA pairs, form keyboard patterns, decorative symbols, reduced motion |
| `tests/keyboard-and-layout.spec.ts` | 34 | Keyboard sweep (18), responsive and zoom (5), overlays inside the viewport (2), target size (9) |

Page scans (axe, WCAG 2.0 to 2.2 A and AA tags plus best practice):

| Page | Light | Dark | Heading outline |
| --- | --- | --- | --- |
| Overview | Pass | Pass | h1 Overview, h2 Color palette, h2 Button components |
| Colors | Pass | Pass | h1 Colors, h2 Brand palette / Neutral palette / Status palette / Semantic tokens |
| Typography | Pass | Pass | h1 Typography, h2 Typography foundations / Font sizes / Font weights |
| Spacing | Pass | Pass | h1 Spacing, h2 Spacing foundations / Border radius |
| Buttons | Pass | Pass | h1 Buttons, h2 Button components |
| Form Elements | Pass | Pass | h1 Form Elements, h2 Input / Checkbox / Radio Group / Select / Switch |
| Feedback | Pass | Pass | h1 Feedback, h2 Alerts (h3 for each Alert title), h2 Badges, h2 Toasts |
| Overlays | Pass | Pass | h1 Overlays, h2 Modal, h2 Tooltip, h2 Popover (h3 popover title) |
| Navigation | Pass | Pass | h1 Navigation, h2 Tabs, h2 Tabs with manual activation |

Each scan also asserts the page has exactly one `<h1>`, matching its title.

Interactive states. The page scans can't see content that only appears after
interaction, so these open each component first:

| State | Light | Dark |
| --- | --- | --- |
| Modal open | Pass | Pass |
| Popover open | Pass | Pass |
| Tooltip visible (via keyboard focus) | Pass | Pass |
| Toast visible | Pass | Pass (failed before the A11Y-008 fix) |
| Tabs after keyboard selection | Pass | Pass |
| Every enabled button variant while hovered (colour contrast) | Pass | Pass (added for A11Y-008) |

### Non-text contrast (1.4.11)

Measured in the browser against the surface behind each element:

| Element | Light | Dark |
| --- | --- | --- |
| Input, Select, Checkbox border | 4.76:1 | 6.96:1 |
| Radio border (unchecked / checked) | 4.76:1 / 5.17:1 | 6.96:1 / 3.45:1 |
| Switch track border (off) | 4.76:1 | 6.96:1 |
| Switch track fill (on) | 5.17:1 | 3.45:1 |
| Switch thumb against track (off / on) | 9.90:1 / 5.17:1 | 9.85:1 / 5.17:1 |
| Selected Tab indicator | 5.17:1 | 9.90:1 |
| Focus ring (every tab stop) | at least 3:1 | at least 3:1 |

Button fills and outlines are below 3:1 in places (for example the Outline border is
1.23:1 in light and the Danger fill 2.76:1 in dark). This isn't a 1.4.11 failure: a
button is identified by its text label, which passes 4.5:1, so its boundary isn't
required to meet 3:1. It is a visual design point to revisit if icon-only buttons
are added.

## Manual Results

These were checked by hand first, then turned into repeatable Playwright tests where
possible. "Automated" in the last column means a test now guards it.

### Keyboard

| Check | Result | Automated |
| --- | --- | --- |
| Every interactive element reachable with Tab, on every page, both themes | Pass | Yes (sweep) |
| Focus visible on every stop, ring at least 3:1 | Pass | Yes (sweep) |
| Focused element never covered by other content | Pass | Yes (sweep) |
| Tab order follows the visual layout | Pass | Manual review |
| No keyboard trap: Tab cycles back to the start | Pass | Yes (sweep) |
| Modal: focus enters on open; Tab never reaches the page behind; Escape closes; focus returns to the trigger | Pass | Yes |
| Popover: Enter opens; focus moves to "Copy link"; `aria-expanded` updates; Escape closes and returns focus; Shift+Tab out closes it | Pass | Yes |
| Tooltip: shows on Tab focus; linked by `aria-describedby`; Escape hides it and focus stays | Pass | Yes |
| Toast: `role="status"` with `aria-live="polite"`; dismiss button named "Dismiss notification"; Tab then Enter dismisses; focus returns to the trigger | Pass | Yes |
| Tabs (automatic): arrows move focus and selection, skip the disabled tab; Home/End | Pass | Yes |
| Tabs (manual): arrows move focus only; Enter selects | Pass | Yes |
| Tabs: focus inside a panel isn't lost when the selected tab changes (A11Y-003) | Pass | Yes |
| Radio group: one tab stop; arrow keys move and select; disabled group skipped | Pass | Yes |
| Checkbox and Switch: Space toggles | Pass | Yes |

### Responsive and zoom

| Viewport | Navigation reachable | No horizontal scroll | Overlays inside viewport |
| --- | --- | --- | --- |
| 320x568 | Pass | Pass (9/9 pages) | Pass |
| 375x667 | Pass | Pass (9/9 pages) | Pass |
| 768x1024 | Pass | Pass (9/9 pages) | Not tested (no edge overflow at this width) |
| 1440x900 | Pass | Pass (9/9 pages) | Not tested |
| 200% zoom (720x450) | Pass | Pass (9/9 pages) | Not tested |

Target size: all 9 pages pass 2.5.8.

### Other manual checks

- **Colour alone:** Alerts and Toasts pair colour with an icon and a text title;
  form errors are text messages; the selected Tab has an underline indicator; the
  active sidebar item is bold as well as tinted, and sets `aria-current="page"`; the
  Switch thumb changes position; Badges carry a text label; links are underlined.
- **Reduced motion:** with the operating system's reduced-motion setting, no overlay
  animates and Button, Switch and other control transitions are removed (now also an
  automated test). Toast, Alert and the dashboard have no animation.
- **Disabled states:** reduced opacity, `not-allowed` cursor and the native
  `disabled` attribute, so they're both visible and announced.

## Audit Results

Status: Complete, with documented limitations

Date: 2026-11-17

Issues found:

| ID | Severity | WCAG | Where | Issue | Status |
| --- | --- | --- | --- | --- | --- |
| A11Y-001 | Serious | 1.4.3 Contrast (Minimum) | Dashboard, dark theme | `.eyebrow` (2.83:1 on #1e293b) and both `.panel-link` labels (3.45:1 on #0f172a) use `--color-primary-600` (#2563eb) as text with no dark-theme value. Needs 4.5:1. | Resolved |
| A11Y-002 | Moderate | 1.3.1 Info and Relationships | Popover | Title is always an `<h2>`, which may not fit the page's heading hierarchy (Alert solved this with `titleAs`). | Resolved |
| A11Y-003 | Minor | 2.4.3 Focus Order | Tabs | If focus is on a tab panel and the parent changes the selected tab, that panel is hidden and focus falls to the page body. | Resolved |
| A11Y-004 | Minor | 1.4.10 Reflow | Tooltip, Popover | CSS-only positioning: near a viewport edge they can overflow it. Confirmed: the dashboard Popover ran 7px past the right edge at 320px. | Resolved |
| A11Y-005 | Decision | 2.4.3 Focus Order, 2.4.11 Focus Not Obscured | Popover | Not yet decided whether tabbing out of a non-modal Popover should close it. Left open, it can cover the next focused element. | Resolved: closes on focus-out |
| A11Y-006 | Moderate | Best practice (supports 1.3.1, 2.4.6) | Dashboard: Colors, Spacing, Buttons, Form Elements, Feedback, Overlays | No `<h1>` on the page (axe `page-has-heading-one`). The page title only appears as plain text in the header breadcrumb, so screen-reader users can't jump to a main heading. | Resolved |
| A11Y-007 | Moderate | 1.3.1 Info and Relationships | Dashboard, all pages | Heading outline found by manual inspection: (a) the sidebar brand "FormaUI" is an `<h2>` and comes first on every page; (b) on Overview the four StatCard values ("30+", "12", "2", "AA") are `<h2>` headings; (c) on Typography the sample text "Heading 1/2/3: ..." is real `<h1>`-`<h3>` markup, so demo text becomes the page's main heading. Overview and Typography pass `page-has-heading-one` only because of (b) and (c). | Resolved |
| A11Y-008 | Serious | 1.4.3 Contrast (Minimum) | Button (primary), dark theme, hover | Hovered primary Button had white text on `--color-primary-500` (#3b82f6): 3.67:1, needs 4.5:1. Introduced in Stage 6 when fixing the dark hover turning near-white; contrast wasn't measured then. Found by the Toast scan (the trigger was still hovered). | Resolved |
| A11Y-009 | Serious | 1.4.10 Reflow, 2.1.1 Keyboard | Dashboard, 600px wide and below | The sidebar was `display: none` on small screens with no replacement, so only Overview could be reached on a phone or at high zoom. Found by the responsive check. The Navigation page also scrolled sideways at 320 and 375px (the tab list was 427px wide). | Resolved |
| A11Y-010 | Minor | 1.1.1 Non-text Content | Dashboard | The sidebar "F" logo tile and the "●" in "● Version 1.0" were exposed, so the brand was read as "F FormaUI Design System" and the bullet as "black circle". | Resolved |

Issues resolved:

| ID | Fix | Verified |
| --- | --- | --- |
| A11Y-001 | New semantic token `--text-accent` in `themes.css` (light: `--color-primary-600`, dark: #93c5fd). Used for every brand-blue text: `.eyebrow`, `.panel-link`, links and the selected Tab (text and indicator). Links and Tabs previously hard-coded #93c5fd for dark mode; they now share the token, so brand-blue text can't miss a dark value again. | Browser axe run passes in both themes. Measured: eyebrow 4.94:1 light / 8.11:1 dark; panel link 5.17:1 / 9.90:1; link 5.17:1 / 9.90:1. Selected Tab text and indicator resolve to #2563eb light / #93c5fd dark. |
| A11Y-002 | New `titleAs` prop on Popover (`"h2"` to `"h6"`, default `"h2"`), exported as `PopoverHeadingLevel`, matching Alert's API. Appearance is the same at every level. The dashboard Popover uses `titleAs="h3"` under its `h2` section. Storybook has a `titleAs` control. | Unit tests for the default and a custom level. Browser test: the title is an `h3` and the dialog is still named by it. |
| A11Y-003 | Tabs track whether focus is inside a panel. When the selected tab changes and focus would be lost (on `body`, or inside a now-hidden panel), focus moves to the newly selected tab. | Unit test for a controlled change while a panel has focus. Confirmed in Chromium: with the fix focus lands on the new tab; with the fix removed it falls to `body`, and the test fails. |
| A11Y-004 | New `useKeepInViewport` hook measures the open Tooltip or Popover and sets a `--forma-viewport-shift` custom property, applied with CSS `translate`, to keep it 8px inside the viewport. It recalculates on resize. | Browser test opens both at 320 and 375px and checks an 8px gap on each side and no horizontal scroll. Fails with the hook removed. |
| A11Y-005 | Decision: a non-modal Popover closes when keyboard focus moves outside it and its trigger, and focus stays where the user moved it. Escape still returns focus to the trigger. | Unit tests for focus-out and Escape. Browser test: Shift+Tab out of the open Popover closes it. Fails with the change removed. |
| A11Y-006 | Added a meaningful page-level `<h1>`: the page title in the header (`Header.tsx`) is now `<h1 class="header-page-title">`, styled as the bold end of the breadcrumb. Overview's tagline "Design with consistency.", previously a second `<h1>`, is now a styled paragraph, so every page has exactly one `<h1>`. | `page-has-heading-one` passes on all 9 pages in both themes; the browser test asserts exactly one `<h1>` matching the page title. |
| A11Y-007 | Corrected sidebar, statistics and typography heading semantics: the brand is a `<div class="sidebar-brand">`; StatCard values are `<p class="stat-card-value">`; Typography samples are `<div class="type-sample type-sample-h1/h2/h3">`. Section headings moved from `<h3>` to `<h2>` (and Feedback's Alert titles from `h4` to `h3`), so levels don't skip once the brand `<h2>` was gone (axe `heading-order`). | Heading outlines above, checked on every page. Visual styling preserved: 12 of 13 measured elements are identical in size, weight, colour, margins, line height and position; the header title's box starts 3px later because the leading space moved outside it, and its text doesn't move. |
| A11Y-008 | Dark-theme primary hover in `Button.css` changed to #1d4ed8: white text 6.70:1, matching the light theme's hover. | A browser test hovers every enabled button variant on the Buttons page in both themes and checks colour contrast. With the old value restored it fails with exactly the 3.67:1 message; with the fix it passes. |
| A11Y-009 | At 600px and below the sidebar now becomes a wrapping row of navigation buttons above the content instead of being hidden. The Tabs list wraps (`flex-wrap: wrap`) so it never forces sideways scrolling. | Responsive browser test at five viewports: every page reachable through the navigation, its `h1` shown, no horizontal scroll. Failed before the fix. |
| A11Y-010 | `aria-hidden="true"` on the brand tile and on the bullet inside the version pill. | Browser test checks every decorative symbol across the dashboard is hidden. Fails with the brand-tile fix removed. |

Mutation checks: for A11Y-003, 004, 005, 008, 010 and the Tabs Safari click fix, the
fix was temporarily reverted and the matching test was confirmed to fail, then the
fix was restored.

## Remaining Limitations

- **No screen-reader testing yet.** NVDA with Firefox or Chrome, and VoiceOver with
  Safari, haven't been used. This matters most for 4.1.3: a live region that is added
  to the page together with its message (as a Toast is) isn't reliably announced by
  every screen reader. A fix, if needed, is a persistent live region that receives
  the message text after it exists.
- **Chromium only.** Firefox and Safari (WebKit) aren't run in Playwright yet. Native
  `<dialog>` focus behaviour differs slightly between browsers (for example whether
  Tab passes through browser UI).
- **Overlay positioning is horizontal only.** Tooltip and Popover are shifted back
  inside the viewport sideways, but don't flip vertically if there's no room below or
  above.
- **Initial states and selected interactions.** Page scans see each page as it loads;
  open states are covered by the interactive tests. Pressed (`:active`) states and
  every possible combination of states aren't scanned.
- **Required-field asterisk isn't explained** on the dashboard. Product forms built
  with FormaUI should include a short "* required" note.
- **Not every AA criterion was assessed individually.** Only the 15 criteria in the
  table above were. Criteria such as 1.4.4 Resize Text, 1.4.12 Text Spacing, 1.4.13
  Content on Hover or Focus, 2.4.6 Headings and Labels and 3.2.x Predictable have
  supporting evidence (zoom test, hoverable and dismissible Tooltip, heading work)
  but weren't checked against their full success criteria.
- Axe can't verify every keyboard, screen-reader or usability requirement, and these
  results don't replace testing with disabled users.
- A11Y-006 is an axe best-practice finding (`page-has-heading-one`), not a WCAG AA
  failure in itself. A11Y-007 is about heading semantics representing the real page
  structure, which supports WCAG 1.3.1 Info and Relationships.

## WCAG Items Still Needing Review

1. 4.1.3 Status Messages: Toast and Alert announcements with NVDA and VoiceOver.
2. 1.3.1 and 3.3.1: how headings, form relationships and errors are announced, with a
   screen reader.
3. Cross-browser: rerun the full Playwright suite in Firefox and WebKit.
4. 1.4.12 Text Spacing and 1.4.13 Content on Hover or Focus: formal checks.
5. Vertical overlay placement near the top and bottom of the viewport.
