# Visual Regression Testing

FormaUI uses Storybook and Chromatic to detect unintended visual changes.

## How it works

1. Components are documented using Storybook stories.
2. Chromatic captures visual snapshots of each story, in the light and dark themes.
3. New builds are compared against approved baselines.
4. Visual differences are reviewed before approval.
5. GitHub Actions runs Chromatic automatically on pushes and pull requests to `main`.

## Running locally

1. Copy `.env.example` to `.env` and add your Chromatic project token. `.env` is
   ignored by Git.
2. Run:

```bash
npm run build-storybook
npm run chromatic
```

The Chromatic CLI doesn't read `.env` files itself, so the `chromatic` script starts
it with Node's `--env-file-if-exists=.env` flag. If `CHROMATIC_PROJECT_TOKEN` is
already set in your shell, that works too.

Chromatic needs a Git repository: it uses the current commit and branch to choose
the baseline to compare against.

## Coverage

86 stories across 13 components, each captured in two modes (light and dark), so
172 snapshots per build.

| Component | Stories |
| --- | --- |
| Button | Primary, Secondary, Outline, Danger, Disabled, Loading, Sizes |
| Input | Default, Required, With hint, With error, Disabled, Large |
| Checkbox | Default (unchecked), Checked, With hint, With error, Required, Disabled, Disabled checked |
| RadioGroup | Default, Selected, Horizontal, With hint, With error, Disabled, With disabled option |
| Select | Default, Placeholder, With selection, With hint, With error, Required, Disabled, With disabled option, Small, Large |
| Switch | Default (off), Enabled (on), With hint, With error, Disabled, Small, Large, Full width |
| Alert | Info, Success, Warning, Error, Dismissible |
| Badge | Default, Success, Info, Warning, Error, Neutral, With dot, Sizes |
| Toast | Success, Info, Warning, Error, Interactive |
| Modal | Default, Without description, Without close button, Long content (all captured open) |
| Tooltip | Default, Top, Bottom, Left, Right, Long content (captured visible), Disabled |
| Popover | Default (bottom), Top, Left, Right, With interactive content, Without title, Controlled (all captured open) |
| Tabs | Default, Vertical, With disabled tab, Manual activation, Controlled |

### How the snapshots are kept reliable

- **Both themes.** Storybook has a Theme toolbar (Light and Dark). Chromatic's
  `modes` in `.storybook/preview.tsx` use the same setting to capture every story
  twice. The preview background follows the theme (`.storybook/preview.css`).
- **Open overlays.** Modal, Tooltip and Popover only appear after interaction, so
  their stories have a `play` function that opens them. Chromatic waits for it to
  finish before taking the snapshot. Docs pages don't run `play`, so they still show
  each overlay closed.
- **Nothing cut off.** Chromatic crops a snapshot to the story's size, and overlays
  sit outside their trigger. `withOverlaySpace` adds room around overlay stories in
  Chromatic only (it checks `isChromatic()`), so local Storybook is unchanged.
- **No motion.** Snapshots use `prefersReducedMotion: "reduce"`, so entrance
  animations and the loading spinner don't make screenshots differ between runs.
- **Deterministic data.** No random values, dates, timers or network requests in any
  story, and no story depends on another having been opened first.

## Reviewing changes

When a visual difference is detected, Chromatic marks the build as having changes
and shows a before and after comparison for each affected story. Review the affected
component and decide whether the change is intentional.

- **Intentional:** accept it. It becomes the new baseline.
- **Not intentional:** deny it and fix the code. The next build is compared against
  the original baseline again.

Approve only intentional visual updates.

In GitHub Actions, a build with unreviewed changes fails the workflow, so a pull
request shows that it needs visual review. After a pull request is merged, the
`main` build accepts the changes automatically (`autoAcceptChanges: main`), because
they were already reviewed on the pull request.

## Proving detection works

To check the visual tests themselves:

1. Temporarily change a visible style, for example the Button's border radius.
2. Run `npm run chromatic` and confirm Chromatic flags the Button stories as changed.
   Don't accept the change.
3. Restore the original style and run Chromatic again. The stories match the
   baseline.

## Snapshot budget

Each build uses 172 snapshots. Chromatic's free plan has a monthly snapshot limit,
and every push and pull request update runs a build. If that becomes a problem,
enable TurboSnap (`onlyChanged: true` in the workflow), which only captures stories
affected by the files that changed.

## Security

The Chromatic project token is stored in a local `.env` file (ignored by Git) and in
the `CHROMATIC_PROJECT_TOKEN` GitHub Actions repository secret in CI. It never
appears in the source code.

Pull requests from forks don't receive repository secrets, so Chromatic can't run on
them. Test the workflow from a branch in the main repository.
