import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export const dashboardPages = [
  "Overview",
  "Colors",
  "Typography",
  "Spacing",
  "Buttons",
  "Form Elements",
  "Feedback",
  "Overlays",
  "Navigation",
] as const;

export type DashboardPage = (typeof dashboardPages)[number];

export const themes = ["light", "dark"] as const;

export type Theme = (typeof themes)[number];

/** Opens a dashboard page from the sidebar in the given theme. */
export async function openPage(page: Page, name: DashboardPage, theme: Theme = "light") {
  await page.goto("/");

  if (theme === "dark") {
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator(".app-shell")).toHaveAttribute("data-theme", "dark");
  }

  await page.getByRole("button", { name, exact: true }).click();

  // Each page has exactly one main heading: its title (A11Y-006).
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
}

/** Runs axe and returns one readable line per violated rule. */
export async function scan(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();

  return results.violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.nodes
        .map((node) => node.target.join(" "))
        .join(" | ")}`,
  );
}

/** Whether keyboard focus is currently inside the given element. */
export async function focusIsWithin(page: Page, selector: string) {
  return page.evaluate(
    (sel) => Boolean(document.activeElement?.closest(sel)),
    selector,
  );
}
