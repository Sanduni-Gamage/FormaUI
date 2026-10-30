import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { focusIsWithin, openPage, scan, themes } from "./helpers";

// Components in their open or active states, which the page scans can't see.

test.describe("Interactive states pass axe", () => {
  for (const theme of themes) {
    test(`Modal open (${theme} theme)`, async ({ page }) => {
      await openPage(page, "Overlays", theme);
      await page.getByRole("button", { name: "Open modal" }).click();
      await expect(page.getByRole("dialog", { name: "Confirm changes" })).toBeVisible();

      expect(await scan(page)).toEqual([]);
    });

    test(`Popover open (${theme} theme)`, async ({ page }) => {
      await openPage(page, "Overlays", theme);
      await page.getByRole("button", { name: "Share" }).click();
      await expect(page.getByRole("dialog", { name: "Share this page" })).toBeVisible();

      expect(await scan(page)).toEqual([]);
    });

    test(`Tooltip visible (${theme} theme)`, async ({ page }) => {
      await openPage(page, "Overlays", theme);
      await page.getByRole("button", { name: "Save", exact: true }).focus();
      await expect(page.getByRole("tooltip")).toBeVisible();

      expect(await scan(page)).toEqual([]);
    });

    test(`Toast visible (${theme} theme)`, async ({ page }) => {
      await openPage(page, "Feedback", theme);
      await page.getByRole("button", { name: "Show success notification" }).click();
      await expect(
        page.getByRole("status").filter({ hasText: "Saved successfully" }),
      ).toBeVisible();

      expect(await scan(page)).toEqual([]);
    });

    test(`Tabs after keyboard selection (${theme} theme)`, async ({ page }) => {
      await openPage(page, "Navigation", theme);
      await page.getByRole("tab", { name: "Profile" }).first().focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByRole("tab", { name: "Security" }).first()).toHaveAttribute(
        "aria-selected",
        "true",
      );

      expect(await scan(page)).toEqual([]);
    });
  }
});

test.describe("Hover states keep text contrast", () => {
  for (const theme of themes) {
    test(`every enabled button variant on hover (${theme} theme)`, async ({ page }) => {
      await openPage(page, "Buttons", theme);

      const buttons = page.locator(".forma-button:not(:disabled)");
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i += 1) {
        await buttons.nth(i).hover();
        // Let the 150ms background transition finish before measuring.
        await page.waitForTimeout(250);

        const results = await new AxeBuilder({ page })
          .withRules(["color-contrast"])
          .include(".forma-button")
          .analyze();

        expect(
          results.violations.flatMap((v) => v.nodes.map((n) => n.any[0]?.message)),
          `hovering "${await buttons.nth(i).innerText()}"`,
        ).toEqual([]);
      }
    });
  }
});

test.describe("Decorative content and motion", () => {
  test("decorative symbols are hidden from assistive technology", async ({ page }) => {
    await openPage(page, "Feedback");

    const exposed = await page.evaluate(() => {
      const decorative = [
        ".brand-icon",
        ".nav-item > span:first-child",
        ".forma-alert-icon",
        ".forma-badge-dot",
        ".forma-alert-dismiss > span",
      ];
      return decorative.flatMap((selector) =>
        [...document.querySelectorAll(selector)]
          .filter((el) => !el.closest('[aria-hidden="true"]'))
          .map((el) => `${selector}: "${el.textContent}"`),
      );
    });

    expect(exposed).toEqual([]);

    // The version pill's bullet on Overview, and the Toast icon once it's shown.
    await page.getByRole("button", { name: "Show success notification" }).click();
    expect(
      await page.locator(".forma-toast-icon").getAttribute("aria-hidden"),
    ).toBe("true");
    await page.getByRole("button", { name: "Overview", exact: true }).click();
    expect(
      await page.locator(".version-pill [aria-hidden='true']").textContent(),
    ).toBe("●");
  });

  test("reduced-motion preference removes overlay animations and transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "Overlays");

    await page.getByRole("button", { name: "Open modal" }).click();
    const modalAnimation = await page
      .locator("dialog.forma-modal")
      .evaluate((el) => getComputedStyle(el).animationName);
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Share" }).click();
    const popoverAnimation = await page
      .locator(".forma-popover")
      .evaluate((el) => getComputedStyle(el).animationName);
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Save", exact: true }).focus();
    const tooltipAnimation = await page
      .getByRole("tooltip")
      .evaluate((el) => getComputedStyle(el).animationName);

    const buttonTransition = await page
      .getByRole("button", { name: "Open modal" })
      .evaluate((el) => getComputedStyle(el).transitionDuration);

    await openPage(page, "Form Elements");
    const switchTransition = await page
      .locator(".forma-switch-track")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration);

    expect({ modalAnimation, popoverAnimation, tooltipAnimation }).toEqual({
      modalAnimation: "none",
      popoverAnimation: "none",
      tooltipAnimation: "none",
    });
    expect(buttonTransition).toBe("0s");
    expect(switchTransition).toBe("0s");
  });
});

test.describe("Keyboard behaviour", () => {
  test("Radio, Checkbox and Switch follow native keyboard patterns", async ({ page }) => {
    await openPage(page, "Form Elements");

    // Radio group: arrow keys move and select within the group.
    const email = page.getByRole("radio", { name: "Email" });
    await email.focus();
    await expect(email).toBeChecked();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("radio", { name: "Phone" })).toBeFocused();
    await expect(page.getByRole("radio", { name: "Phone" })).toBeChecked();
    await expect(email).not.toBeChecked();

    // A disabled group (disabled on its fieldset) can't be focused or changed. The
    // keyboard sweep confirms Tab skips it.
    await expect(page.getByRole("radio", { name: "Available", exact: true })).toBeDisabled();
    await expect(page.getByRole("radio", { name: "Unavailable" })).toBeDisabled();

    // Checkbox: Space toggles.
    const terms = page.getByRole("checkbox", { name: "Accept terms and conditions" });
    await terms.focus();
    await page.keyboard.press("Space");
    await expect(terms).toBeChecked();
    await page.keyboard.press("Space");
    await expect(terms).not.toBeChecked();

    // Switch: Space toggles, and it's exposed as a switch.
    const sms = page.getByRole("switch", { name: "SMS notifications" });
    await sms.focus();
    await expect(sms).not.toBeChecked();
    await page.keyboard.press("Space");
    await expect(sms).toBeChecked();
  });

  test("Modal: focus enters, stays inside, Escape closes, focus returns", async ({ page }) => {
    await openPage(page, "Overlays");

    const trigger = page.getByRole("button", { name: "Open modal" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "Confirm changes" });
    await expect(dialog).toBeVisible();
    expect(await focusIsWithin(page, "dialog")).toBe(true);

    // Tab several times: focus must never reach the page behind the dialog. Chrome
    // lets focus pass through its own browser UI between the last and first
    // element (reported as <body>); that's native behaviour, not a keyboard trap.
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press("Tab");
      const onPageBehind = await page.evaluate(
        () =>
          document.activeElement !== document.body &&
          !document.activeElement?.closest("dialog"),
      );
      expect(onPageBehind).toBe(false);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Popover: focus moves inside, Escape closes, focus returns", async ({ page }) => {
    await openPage(page, "Overlays");

    const trigger = page.getByRole("button", { name: "Share" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("dialog", { name: "Share this page" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy link" })).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Share this page" })).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Tooltip: appears on keyboard focus, is linked, Escape hides it", async ({ page }) => {
    await openPage(page, "Overlays");

    // Reach the trigger with the keyboard from the button before it.
    await page.getByRole("button", { name: "Open modal" }).focus();
    await page.keyboard.press("Tab");

    const trigger = page.getByRole("button", { name: "Save", exact: true });
    await expect(trigger).toBeFocused();

    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText("Save your changes");

    const tooltipId = await tooltip.getAttribute("id");
    await expect(trigger).toHaveAttribute("aria-describedby", tooltipId ?? "");

    await page.keyboard.press("Escape");
    await expect(tooltip).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Toast: announced as status, dismiss button is named and keyboard-operable", async ({ page }) => {
    await openPage(page, "Feedback");

    const trigger = page.getByRole("button", { name: "Show success notification" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const toast = page.getByRole("status").filter({ hasText: "Saved successfully" });
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute("aria-live", "polite");
    await expect(toast).toContainText("Your changes have been saved.");

    await page.keyboard.press("Tab");
    const dismiss = page.getByRole("button", { name: "Dismiss notification" });
    await expect(dismiss).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(toast).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Tabs: automatic activation follows the arrow keys and skips disabled tabs", async ({ page }) => {
    await openPage(page, "Navigation");

    const list = page.getByRole("tablist", { name: "Account settings", exact: true });
    await list.getByRole("tab", { name: "Profile" }).focus();

    await page.keyboard.press("ArrowRight");
    await expect(list.getByRole("tab", { name: "Security" })).toBeFocused();
    await expect(list.getByRole("tab", { name: "Security" })).toHaveAttribute("aria-selected", "true");

    // Billing is disabled, so the next arrow skips it.
    await page.keyboard.press("ArrowRight");
    await expect(list.getByRole("tab", { name: "Notifications" })).toBeFocused();

    await page.keyboard.press("Home");
    await expect(list.getByRole("tab", { name: "Profile" })).toBeFocused();
    await page.keyboard.press("End");
    await expect(list.getByRole("tab", { name: "Notifications" })).toBeFocused();
  });

  test("Popover: title fits the outline, and tabbing out closes it (A11Y-002, A11Y-005)", async ({ page }) => {
    await openPage(page, "Overlays");

    const trigger = page.getByRole("button", { name: "Share" });
    await trigger.click();

    // The popover sits in the "Popover" h2 section, so its title is an h3.
    await expect(page.getByRole("heading", { level: 3, name: "Share this page" })).toBeVisible();

    // Focus starts on "Copy link". Shift+Tab goes to the trigger: still inside, so
    // the popover stays open.
    await expect(page.getByRole("button", { name: "Copy link" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(trigger).toBeFocused();
    await expect(page.getByRole("dialog", { name: "Share this page" })).toBeVisible();

    // Shift+Tab again leaves for the "Save" button outside: the popover closes and
    // focus stays where it went. (Tabbing off the end of the page into the browser's
    // own UI leaves it open: nothing on the page can be covered then.)
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("button", { name: "Save", exact: true })).toBeFocused();
    await expect(page.getByRole("dialog", { name: "Share this page" })).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Alerts: urgent variants use role alert, the rest role status", async ({ page }) => {
    await openPage(page, "Feedback");

    const roleOf = (title: string) =>
      page.locator(".forma-alert", { hasText: title }).first().getAttribute("role");

    expect(await roleOf("Success")).toBe("status");
    expect(await roleOf("Information")).toBe("status");
    expect(await roleOf("Warning")).toBe("alert");
    expect(await roleOf("Error")).toBe("alert");
  });

  test("Tabs: every tab and panel are linked both ways", async ({ page }) => {
    await openPage(page, "Navigation");

    const pairs = await page.evaluate(() =>
      [...document.querySelectorAll('[role="tab"]')].map((tab) => {
        const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
        return {
          tab: tab.textContent,
          panelExists: Boolean(panel),
          panelLabelledByTab: panel?.getAttribute("aria-labelledby") === tab.id,
          selectedMatchesVisible:
            (tab.getAttribute("aria-selected") === "true") === !panel?.hidden,
        };
      }),
    );

    expect(pairs.length).toBe(8);
    for (const pair of pairs) {
      expect(pair, pair.tab ?? "").toMatchObject({
        panelExists: true,
        panelLabelledByTab: true,
        selectedMatchesVisible: true,
      });
    }
  });

  test("Tabs: manual activation moves focus without selecting until Enter", async ({ page }) => {
    await openPage(page, "Navigation");

    const list = page.getByRole("tablist", { name: "Account settings, manual activation" });
    await list.getByRole("tab", { name: "Profile" }).focus();

    await page.keyboard.press("ArrowRight");
    await expect(list.getByRole("tab", { name: "Security" })).toBeFocused();
    await expect(list.getByRole("tab", { name: "Security" })).toHaveAttribute("aria-selected", "false");

    await page.keyboard.press("Enter");
    await expect(list.getByRole("tab", { name: "Security" })).toHaveAttribute("aria-selected", "true");
  });
});
