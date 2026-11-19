import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

// Brands Storybook's own interface (sidebar, toolbar) as FormaUI.
addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'FormaUI Design System',
    brandUrl: 'https://github.com/Sanduni-Gamage/FormaUI',
    brandTarget: '_blank',

    colorPrimary: '#2563eb',
    colorSecondary: '#2563eb',

    appBg: '#f8fafc',
    appContentBg: '#ffffff',
    appBorderColor: '#e2e8f0',
    appBorderRadius: 8,

    textColor: '#0f172a',
    textMutedColor: '#334155',
    barTextColor: '#334155',
    barSelectedColor: '#2563eb',
    barBg: '#ffffff',

    fontBase: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  }),
});
