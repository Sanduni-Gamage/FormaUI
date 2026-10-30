import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    // Playwright's browser tests live in tests/ and run with `npm run test:a11y`.
    exclude: ["**/node_modules/**", "**/dist/**", "tests/**"],
    css: true,
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
