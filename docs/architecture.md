# FormaUI Architecture

## Overview

FormaUI is organised in layers. Raw design tokens define the palette and scales;
semantic theme tokens give those values a purpose and a dark-mode value; components
are styled with those tokens; Storybook documents the components; and tests plus CI
check every layer.

```
Design tokens  (src/tokens)        --color-primary-600, --spacing-4, --radius-md
      |
Theme tokens   (src/styles)        --text-primary, --border-control, --focus-ring
      |                            light values on :root, dark on [data-theme="dark"]
UI components  (src/components/ui) Button, Input, Modal, Tabs, ...
      |
   Storybook stories   Dashboard showcase   Tests (Vitest, Playwright, Chromatic)
```

## Main Layers

### Design tokens

CSS custom properties in `src/tokens/`, imported once by `src/index.css`:

| File | Tokens |
| --- | --- |
| `colors.css` | Primary scale (`--color-primary-50` to `-900`), neutral scale (`--color-neutral-0` to `-900`), status colours with `-dark` variants for small text on light tints and `-light` variants for dark surfaces |
| `spacing.css` | 4px-based spacing scale (`--spacing-1` to `--spacing-12`) and border radii (`--radius-sm` to `--radius-full`) |
| `typography.css` | Font family, sizes (`--font-size-xs` to `--font-size-4xl`) and weights |

Raw tokens describe *what* a value is, not where it's used, and they don't change
between themes. In total there are 57 raw tokens and 30 semantic tokens; a unit test
(`src/App.test.tsx`) keeps the dashboard's count in step with the files.

### Theme system

`src/styles/themes.css` maps raw tokens to semantic tokens that describe a role.
Components use only these, never the raw palette:

| Group | Tokens |
| --- | --- |
| Surfaces | `--surface-primary`, `--surface-secondary`, `--surface-accent` |
| Text | `--text-primary`, `--text-secondary`, `--text-accent`, `--text-accent-hover`, `--text-on-accent`, `--text-danger`, `--text-success`, `--text-warning`, `--text-info` |
| Borders | `--border-default`, `--border-control`, `--border-danger`, `--border-success`, `--border-warning`, `--border-info` |
| Actions | `--action-primary-bg`, `--action-primary-bg-hover`, `--action-primary-text`, and the same three for `secondary` and `danger` |
| Controls | `--control-checked`, `--control-mark` |
| Focus | `--focus-ring` |

Every value in `themes.css` references the raw palette; there are no hex literals.
Light values sit on `:root` and `[data-theme="light"]`; dark values on
`[data-theme="dark"]`. The attribute can be set on any element and applies to
everything inside it: the dashboard sets it on its `.app-shell`, Storybook on
`<html>`, and the Colors page uses both inside one table to show each token's light
and dark value side by side. Several tokens exist for an accessibility reason, documented in the file.
For example, `--border-control` is darker than `--border-default` so form controls
reach 3:1 against their background (WCAG 1.4.11), and the status text tokens are a
step darker than the status colours so small text reaches 4.5:1 on tinted
backgrounds.

### UI components

Each component is a self-contained folder in `src/components/ui/`:

```
Button/
  Button.tsx          Component and its exported types
  Button.css          Styles, using tokens
  Button.stories.tsx  Storybook stories
  Button.test.tsx     Vitest and Testing Library tests, including an axe check
  index.ts            Public exports: the component and its prop types
```

Conventions shared by every component:

- **Native first.** Components render the native element that already has the right
  semantics and keyboard behaviour: `<button>`, `<input type="checkbox">`,
  `<select>`, `<fieldset>`, `<dialog>`. ARIA is added only where HTML has no
  equivalent (Tabs, the Switch role, live regions).
- **HTML props pass through.** Where a component wraps one element, its props extend
  that element's attributes (for example `ButtonProps extends
  ButtonHTMLAttributes<HTMLButtonElement>`), so `name`, `onChange`, `aria-*` and
  so on work as expected.
- **Typed variants.** Visual options are string unions exported with the component,
  such as `ButtonVariant` and `TooltipPlacement`.
- **Controlled or uncontrolled.** Stateful components accept `value` / `defaultValue`
  (RadioGroup, Tabs) or `open` / `defaultOpen` (Popover), with a change callback, so
  they work on their own or driven by a parent. Modal is controlled only, like the
  native dialog it wraps.
- **Heading level is configurable.** Components with a title (Alert, Popover) take
  `titleAs` so the heading fits the page's outline.
- **Prefixed CSS classes.** Every class starts with `forma-` (`forma-button`,
  `forma-button--primary`, `forma-button__spinner`), so library styles don't clash
  with an application's own classes.
- **Reduced motion.** Animations only run under `prefers-reduced-motion:
  no-preference`, and transitions are removed under `reduce`.

Shared helpers in `src/components/ui/utils/`:

- `useKeepInViewport`: measures an open Tooltip or Popover and shifts it back inside
  the viewport near a screen edge.
- `withOverlaySpace`: a Storybook decorator that gives overlay stories room in
  Chromatic snapshots.

### Dashboard

`src/App.tsx`, `src/components/layout/` and `src/components/dashboard/` form a
showcase app with 9 pages (Overview, Colors, Typography, Spacing, Buttons, Form
Elements, Feedback, Overlays, Navigation). It uses the library the way a product
would, and it is what the Playwright tests run against.

### Storybook

`.storybook/` configures Storybook with the accessibility and docs addons. Each
component has an autodocs page generated from its types, plus stories for every
variant and state (86 in total). A toolbar switches between the light and dark
themes. Overlay stories open themselves with a `play` function so their open state
can be seen and captured.

### Testing

| Layer | Location | Purpose |
| --- | --- | --- |
| Unit and component | `src/components/ui/*/*.test.tsx` | Behaviour, props, keyboard, focus and ARIA in jsdom; an axe check per component |
| Browser | `tests/` | Playwright in Chromium against the dashboard: axe scans, keyboard sweep, responsive layout, target size, reduced motion |
| Visual | Storybook and Chromatic | Snapshots of every story in both themes, compared with approved baselines |

`src/test/setup.ts` adds jest-dom and jest-axe matchers and a small polyfill for
`HTMLDialogElement.showModal()`, which jsdom doesn't implement.

### CI/CD

Two GitHub Actions workflows run on pushes and pull requests to `main`:

- `.github/workflows/ci.yml`: lint, type-check, unit tests, the app build and the
  Storybook build in one job, and the Playwright accessibility tests in a parallel
  job.
- `.github/workflows/chromatic.yml`: publishes Storybook to Chromatic and fails when
  there are unreviewed visual changes.

Both use the Node version in `.nvmrc`.

## Design Principles

- **Reusability:** components are generic and configured through props, not
  copied per use.
- **Consistency:** shared tokens for colour, spacing, type and radius.
- **Accessibility:** native semantics, keyboard support and contrast are part of
  each component's definition of done, and are tested.
- **Type safety:** strict TypeScript across the app, the tests and the configs.
- **Maintainability:** one folder per component, prefixed class names, documented
  decisions in comments where the reason isn't obvious.
- **Testability:** every component has unit tests and stories; the dashboard has
  browser tests.

## Known Gaps

Closed in Stage 14: components used to reference raw brand colours directly, and
Button and the dashboard kept their own dark-theme hex overrides (the dashboard even
redefined raw palette tokens in dark mode, so `--color-primary-700` meant a
different colour in the app than in Storybook). These now go through the action,
control and accent tokens above. Before and after the change, the computed colours
of every element on all 9 dashboard pages and all 86 Storybook stories, in both
themes and including hover states, were compared: 23,298 values, no differences.

Still open:

- **Not a published package.** Components are imported by path inside this
  repository. Publishing to npm would need a library build and a single entry point.
- **Overlay positioning is horizontal only.** Tooltip and Popover are kept inside
  the viewport sideways but don't flip vertically.
- **The dashboard shell has a few raw colours.** The showcase app's own CSS
  (`src/index.css`, not the component library) still sets the page background, the
  logo tile, the status dot and the spacing bars with palette colours or hex values.
