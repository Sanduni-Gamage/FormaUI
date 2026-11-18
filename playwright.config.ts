import { defineConfig, devices } from "@playwright/test";

// Browser-based accessibility tests. Playwright starts its own dev server on a fixed
// port, so the tests don't depend on whichever port a developer's server landed on.
const PORT = 5199;

export default defineConfig({
  testDir: "./tests",
  // A stray test.only would silently skip the rest of the suite in CI.
  forbidOnly: !!process.env.CI,
  // In CI, also write an HTML report; the workflow uploads it when a test fails.
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
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
