import '../src/index.css';
import './preview.css';
import type { Preview } from '@storybook/react-vite'

type Theme = 'light' | 'dark';

const preview: Preview = {
  // A toolbar switch for the light and dark themes. Chromatic uses the same
  // global to capture every story in both themes (see `chromatic.modes`).
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme: Theme = context.globals.theme === 'dark' ? 'dark' : 'light';
      // On <html>, like the app's theme attribute, so overlays in the top layer
      // (Modal) and the page background pick it up too.
      document.documentElement.setAttribute('data-theme', theme);
      return <Story />;
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Components', ['Button', 'Forms', 'Feedback', 'Overlays', 'Navigation']],
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    chromatic: {
      // Every story is captured once per theme.
      modes: {
        light: { theme: 'light' },
        dark: { theme: 'dark' },
      },
      // Snapshot the final, still state: overlays skip their entrance animation
      // and the loading spinner stops, so screenshots don't vary between runs.
      prefersReducedMotion: 'reduce',
      pauseAnimationAtEnd: true,
    },
  },
};

export default preview;
