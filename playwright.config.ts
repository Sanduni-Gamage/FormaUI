import { defineConfig, devices } from "@playwright/test";

// Browser-based accessibility tests. Playwright starts its own dev server on a fixed
// port, so the tests don't depend on whichever port a developer's server landed on.
const PORT = 5199;

export default defineConfig({
  testDir: "./tests",
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
