# FormaUI

### A Scalable, Accessible React Design System

[![FormaUI CI](https://github.com/Sanduni-Gamage/FormaUI/actions/workflows/ci.yml/badge.svg)](https://github.com/Sanduni-Gamage/FormaUI/actions/workflows/ci.yml)
[![Chromatic Visual Tests](https://github.com/Sanduni-Gamage/FormaUI/actions/workflows/chromatic.yml/badge.svg)](https://github.com/Sanduni-Gamage/FormaUI/actions/workflows/chromatic.yml)

FormaUI is a reusable React component library built with TypeScript. It demonstrates
design-system architecture, accessibility, reusable UI patterns and modern frontend
engineering practice: 13 typed components on a shared token and theme layer,
documented in Storybook, tested in jsdom and in a real browser, and checked on every
push by GitHub Actions and Chromatic.

## Features

- 13 reusable, typed React components
- Centralised design tokens, with semantic theme tokens on top
- Light and dark themes
- Keyboard support and ARIA patterns for every interactive component
- Responsive layouts that reflow down to 320px wide and at 200% zoom
- Storybook documentation for every component, in both themes
- Unit, component and browser accessibility tests
- Visual regression testing with Chromatic
- Automated CI using GitHub Actions
- A documented accessibility audit against WCAG 2.2 AA

## Tech Stack

| Area | Tools |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite |
| Styling | CSS custom properties (design tokens), plain CSS per component, Tailwind CSS v4 for its base reset |
| Documentation | Storybook 10 with the a11y and docs addons |
| Unit and component tests | Vitest, React Testing Library, jest-axe |
| Browser tests | Playwright with axe-core |
| Visual regression | Chromatic |
| CI | GitHub Actions |

## Components

### Foundations

- **Colour tokens:** primary, neutral and status palettes
- **Typography:** font family, size and weight scales
- **Spacing:** a 4px-based spacing scale
- **Radii:** small to full border radius scale
- **Theme system:** 30 semantic tokens (surfaces, text, borders, actions, controls, focus ring) mapped to the palette for light and dark

### Actions and forms

| Component | Highlights |
| --- | --- |
| Button | `primary`, `secondary`, `outline`, `danger` variants; `sm`, `md`, `lg` sizes; loading state with visible loading text and `aria-busy`, which also blocks repeat clicks; `type="button"` by default so it never submits a form by accident |
| Input | Visible label, hint and error text linked with `aria-describedby`; `aria-invalid` on error; three sizes |
| Checkbox | Native checkbox with a custom look; hint and error support |
| RadioGroup | `fieldset` and `legend`; arrow-key selection; vertical or horizontal; disabled options |
| Select | Native select for full keyboard and screen-reader support; placeholder, hint, error, three sizes |
| Switch | `role="switch"` on a native checkbox; Space toggles; the whole label is clickable |

### Feedback

| Component | Highlights |
| --- | --- |
| Alert | `success`, `info`, `warning`, `error`; `status` or `alert` role to match urgency; optional title with a configurable heading level; dismissible |
| Badge | `success`, `info`, `warning`, `error`, `neutral`; three sizes; optional decorative dot |
| Toast | Polite live region (`role="status"`); named dismiss button |

### Overlays and navigation

| Component | Highlights |
| --- | --- |
| Modal | Native `<dialog>` with `showModal()`: focus moves in, the page behind is inert, Escape closes, focus returns to the trigger |
| Tooltip | Shows on hover and keyboard focus; hoverable; Escape hides it; linked with `aria-describedby`; stays inside the viewport |
| Popover | Non-modal dialog with an accessible name; Escape closes and returns focus; closes when focus leaves; stays inside the viewport |
| Tabs | Roving tabindex; arrow keys, Home and End; automatic or manual activation; horizontal or vertical; disabled tabs skipped |

Each component lives in `src/components/ui/<Name>/` with its styles, stories, tests
and an `index.ts` that exports the component and its prop types:

```tsx
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";

<Input label="Email address" type="email" hint="We'll never share it." required />
<Button variant="primary" isLoading={saving}>Save changes</Button>
```

## Getting Started

Requirements: Node.js 24 (see `.nvmrc`) and npm.

```bash
git clone https://github.com/Sanduni-Gamage/FormaUI.git
cd FormaUI
npm install
npm run dev
```

The dashboard opens at `http://localhost:5173`. To browse the component documentation:

```bash
npm run storybook
```

To run the browser tests for the first time, install Playwright's Chromium:

```bash
npx playwright install chromium
```

## Development Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dashboard development server |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Type-check the app, the configs, the browser tests and Storybook |
| `npm test` | Run unit tests in watch mode |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run unit tests with a coverage report |
| `npm run test:a11y` | Run the Playwright accessibility and keyboard tests |
| `npm run build` | Type-check and build the dashboard |
| `npm run build-storybook` | Build the static Storybook |
| `npm run chromatic` | Publish Storybook to Chromatic (needs a project token in `.env`) |

## Testing

FormaUI is tested at three levels:

| Level | Tools | What it covers |
| --- | --- | --- |
| Unit and component | Vitest, React Testing Library, jest-axe | 175 tests: rendering, props, keyboard behaviour, focus management, ARIA wiring, and an axe check for every component |
| Browser | Playwright, axe-core | 78 tests in Chromium: axe scans of every dashboard page in both themes, open overlay states, a keyboard sweep of every page, responsive layout at four viewports and 200% zoom, target size, reduced motion |
| Visual | Storybook, Chromatic | 86 stories captured in light and dark, compared against approved baselines |

GitHub Actions runs lint, type-check, unit tests, both builds and the browser tests
on every push and pull request to `main`. Chromatic runs in its own workflow. See
[docs/visual-testing.md](docs/visual-testing.md) for how visual changes are reviewed.

## Architecture

The project separates design tokens, theme styles, reusable UI components, component
documentation and the showcase dashboard that uses them.

```
src/
  tokens/            Raw design tokens: colour, spacing, typography, radii
  styles/themes.css  Semantic theme tokens with light and dark values
  components/
    ui/              The component library: one folder per component
    layout/          Dashboard shell: sidebar and header
    dashboard/       Showcase pages built from the library
  test/              Vitest setup
tests/               Playwright browser tests
.storybook/          Storybook config, theme toolbar and Chromatic modes
docs/                Architecture, accessibility audit, visual testing
```

Components use only semantic tokens such as `--text-primary`, `--action-primary-bg`
or `--border-control`, never raw palette colours, so setting `data-theme="dark"`
restyles every component without component changes. See
[docs/architecture.md](docs/architecture.md) for details, including the gaps still
to close.

## Accessibility

Accessibility is designed in, not added afterwards:

- Semantic, native HTML first (`button`, `dialog`, `fieldset`, `select`)
- Full keyboard support, with visible focus indicators that meet 3:1 contrast
- ARIA only where native HTML isn't enough (Tabs, Switch, live regions)
- Every control has an accessible name; hints and errors are linked to their fields
- Text contrast checked in both themes, including hover and open states
- Reduced-motion support
- Automated checks in unit tests, the browser and Storybook

The [accessibility audit](docs/accessibility-audit.md) records every issue found and
fixed, the test results and a WCAG 2.2 AA checklist: 14 of the 15 assessed criteria
are verified, and 4.1.3 Status Messages is partially verified. FormaUI targets WCAG
2.2 AA but **doesn't claim full conformance** yet: it hasn't been tested with a
screen reader, and browser tests run in Chromium only. The audit lists what's left.

## Project Goals

FormaUI demonstrates practical experience in building and maintaining reusable
component libraries, establishing consistent design foundations, and validating UI
quality through automated testing, from unit tests to accessibility checks and visual
regression.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
