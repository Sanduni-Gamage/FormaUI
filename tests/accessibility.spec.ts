import { test, expect } from "@playwright/test";
import { dashboardPages, openPage, scan, themes } from "./helpers";

// Browser accessibility checks. Axe can't verify every keyboard, screen-reader or
// usability requirement; those are checked manually (see docs/accessibility-audit.md).
// Pages are scanned in their initial state; open overlays and other interactive
// states are covered by interactive-accessibility.spec.ts.

test.describe("FormaUI accessibility", () => {
  for (const theme of themes) {
    for (const name of dashboardPages) {
      test(`${name} page has no axe violations (${theme} theme)`, async ({ page }) => {
        await openPage(page, name, theme);

        expect(await scan(page)).toEqual([]);
      });
    }
  }

  test("dashboard supports keyboard navigation", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");

    const focusedElement = page.locator(":focus");

    await expect(focusedElement).toBeVisible();
  });

  test("theme toggle switches between light and dark", async ({ page }) => {
    await page.goto("/");

    const shell = page.locator(".app-shell");
    await expect(shell).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(shell).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(shell).toHaveAttribute("data-theme", "light");
  });
});
