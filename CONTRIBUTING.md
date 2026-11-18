# Contributing to FormaUI

## Development

1. Use Node.js 24 (see `.nvmrc`) and install dependencies with `npm install`.
2. Create a feature branch from `main`.
3. Implement the component or improvement.
4. Add or update unit tests.
5. Add or update Storybook stories.
6. Run the checks below.
7. Open a pull request to `main`. CI and Chromatic run automatically.

## Checks

Run these before opening a pull request. CI runs the same commands.

```bash
npm run lint
npm run type-check
npm run test:run
npm run test:a11y
npm run build
npm run build-storybook
```

`npm run test:a11y` needs Playwright's Chromium once: `npx playwright install chromium`.

## Adding a component

Create a folder in `src/components/ui/` named after the component:

```
MyComponent/
  MyComponent.tsx
  MyComponent.css
  MyComponent.stories.tsx
  MyComponent.test.tsx
  index.ts
```

- Export the component and its prop types from `index.ts`.
- Prefix every CSS class with `forma-` (for example `forma-mycomponent--large`).
- Add a story for each variant and state, including disabled and error states.
- If the component only appears after interaction (an overlay, for example), give
  its stories a `play` function that opens it, so it can be reviewed and captured
  by Chromatic.

## Component Standards

- Use TypeScript, and export the types consumers need.
- Prefer semantic, native HTML. Add ARIA only when no native element fits.
- Support keyboard interaction, with a visible focus indicator.
- Use semantic theme tokens (`--text-primary`, `--border-control`, `--focus-ring`)
  instead of raw colours, so the component works in both themes.
- Give every control an accessible name, and link hints and errors with
  `aria-describedby`.
- Keep text at 4.5:1 contrast and control boundaries at 3:1, in both themes.
- Respect `prefers-reduced-motion`.
- Document variants and examples in Storybook.

## Tests

Each component test file should cover:

- Rendering and each prop that changes behaviour or appearance
- Keyboard interaction and focus management
- ARIA attributes and accessible names
- An axe check, as in the existing tests:

  ```tsx
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  ```

If the component appears on the dashboard, the Playwright tests in `tests/` scan and
keyboard-test it automatically. Add a test there for any state that only appears
after interaction.

## Visual changes

Chromatic compares every story with its approved baseline. If your pull request
changes how a component looks, review the changes in Chromatic and accept only the
intentional ones. See [docs/visual-testing.md](docs/visual-testing.md).

## Accessibility issues

Record accessibility issues and their fixes in
[docs/accessibility-audit.md](docs/accessibility-audit.md), with the WCAG criterion
and how the fix was verified.
