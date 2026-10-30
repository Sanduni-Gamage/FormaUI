import { test, expect } from "@playwright/test";
import { dashboardPages, openPage, themes } from "./helpers";

// Repeatable versions of the Stage 10 manual checks: keyboard sweep (2.1.1, 2.1.2,
// 2.4.3, 2.4.7, 2.4.11, focus-indicator contrast for 1.4.11), responsive layout and
// zoom (1.4.10), and target size (2.5.8).

test.describe("Keyboard sweep", () => {
  for (const theme of themes) {
    for (const name of dashboardPages) {
      test(`${name}: every tab stop is reached, visibly focused and unobscured (${theme})`, async ({ page }) => {
        await openPage(page, name, theme);

        // Expected tab stops: enabled, rendered, tabIndex >= 0; for a radio group,
        // only the checked radio (or the first, if none is checked).
        const expectedCount = await page.evaluate(() => {
          const candidates = [
            ...document.querySelectorAll<HTMLElement>(
              "a[href], button, input, select, textarea, [tabindex]",
            ),
          ];
          const stops = candidates.filter((el) => {
            if (el.matches(":disabled") || el.tabIndex < 0) return false;
            if (el.closest("[hidden]")) return false;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return false;
            if (el instanceof HTMLInputElement && el.type === "radio") {
              const group = [
                ...document.querySelectorAll<HTMLInputElement>(
                  `input[type="radio"][name="${CSS.escape(el.name)}"]`,
                ),
              ].filter((radio) => !radio.matches(":disabled"));
              const checked = group.find((radio) => radio.checked);
              return checked ? checked === el : group[0] === el;
            }
            return true;
          });
          stops.forEach((el, index) => el.setAttribute("data-tabstop", String(index)));
          return stops.length;
        });

        const reached = new Set<string>();
        const problems: string[] = [];
        let first: string | null = null;

        for (let press = 0; press < expectedCount + 10; press += 1) {
          await page.keyboard.press("Tab");

          const info = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null;
            if (!el || el === document.body) return null;

            // Switches draw their focus ring on the visible track, not the input.
            const visual = el.classList.contains("forma-switch-input")
              ? (el.nextElementSibling as HTMLElement)
              : el;
            const cs = getComputedStyle(visual);
            const hasRing =
              (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 1) ||
              cs.boxShadow !== "none";

            // Contrast of the ring against what's behind the element.
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            const ctx = canvas.getContext("2d")!;
            const rgb = (color: string) => {
              ctx.clearRect(0, 0, 1, 1);
              ctx.fillStyle = "#000";
              ctx.fillStyle = color;
              ctx.fillRect(0, 0, 1, 1);
              return [...ctx.getImageData(0, 0, 1, 1).data];
            };
            const lum = ([r, g, b]: number[]) =>
              [r, g, b]
                .map((v) => {
                  const c = v / 255;
                  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
                })
                .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
            let bgEl: HTMLElement | null = visual.parentElement;
            let bg = [255, 255, 255, 255];
            while (bgEl) {
              const c = rgb(getComputedStyle(bgEl).backgroundColor);
              if (c[3] > 0) {
                bg = c;
                break;
              }
              bgEl = bgEl.parentElement;
            }
            const ring = rgb(cs.outlineColor);
            const [hi, lo] = [lum(ring), lum(bg)].sort((a, b) => b - a);
            const ringContrast = (hi + 0.05) / (lo + 0.05);

            // Not obscured: the element itself is what's at its centre.
            const rect = visual.getBoundingClientRect();
            const hit = document.elementFromPoint(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
            );
            const unobscured = Boolean(
              hit && (visual.contains(hit) || el.contains(hit) || hit.contains(visual)),
            );

            const label =
              el.getAttribute("aria-label") ||
              el.textContent?.trim().slice(0, 30) ||
              (el as HTMLInputElement).labels?.[0]?.textContent?.trim().slice(0, 30) ||
              el.tagName;

            return {
              id: el.getAttribute("data-tabstop"),
              label,
              focusVisible: el.matches(":focus-visible"),
              hasRing,
              ringContrast: Math.round(ringContrast * 100) / 100,
              unobscured,
            };
          });

          if (!info) continue; // browser UI between the last and first element

          const key = info.id ?? `untracked:${info.label}`;
          if (first === key) break; // came back round: no keyboard trap
          if (first === null) first = key;
          reached.add(key);

          if (!info.focusVisible || !info.hasRing) problems.push(`no visible focus: ${info.label}`);
          if (info.hasRing && info.ringContrast < 3)
            problems.push(`focus ring ${info.ringContrast}:1: ${info.label}`);
          if (!info.unobscured) problems.push(`obscured when focused: ${info.label}`);
        }

        const expected = Array.from({ length: expectedCount }, (_, i) => String(i));
        const missed = expected.filter((id) => !reached.has(id));
        const unexpected = [...reached].filter((key) => key.startsWith("untracked:"));

        expect(problems, "focus problems").toEqual([]);
        expect(missed, "tab stops never reached").toEqual([]);
        expect(unexpected, "focused elements outside the expected tab stops").toEqual([]);
      });
    }
  }
});

const viewports = [
  { label: "320x568 narrow mobile", width: 320, height: 568 },
  { label: "375x667 mobile", width: 375, height: 667 },
  { label: "768x1024 tablet", width: 768, height: 1024 },
  { label: "1440x900 desktop", width: 1440, height: 900 },
  // 200% zoom on a 1440x900 screen gives a 720x450 CSS-pixel viewport.
  { label: "200% zoom (720x450)", width: 720, height: 450 },
];

test.describe("Responsive layout and zoom", () => {
  for (const viewport of viewports) {
    test(`every page is reachable and reflows at ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      const problems: string[] = [];

      for (const name of dashboardPages) {
        await page.goto("/");
        const navButton = page.getByRole("button", { name, exact: true });

        if (!(await navButton.isVisible())) {
          problems.push(`${name}: navigation is not visible, so the page can't be reached`);
          continue;
        }

        await navButton.click();
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);

        const layout = await page.evaluate(() => ({
          pageWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        }));

        if (layout.pageWidth > layout.viewportWidth + 1) {
          problems.push(
            `${name}: horizontal scroll (content ${layout.pageWidth}px in a ${layout.viewportWidth}px viewport)`,
          );
        }

        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      }

      expect(problems).toEqual([]);
    });
  }
});

test.describe("Open overlays stay inside the viewport (A11Y-004)", () => {
  for (const width of [320, 375]) {
    test(`Tooltip and Popover fit at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await openPage(page, "Overlays");

      const bounds = (selector: string) =>
        page.evaluate(async (sel) => {
          // Chrome updates the page's scrollable width a frame after an animated
          // element appears, so wait two frames before reading it.
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          const rect = document.querySelector(sel)!.getBoundingClientRect();
          const viewport = document.documentElement.clientWidth;
          return {
            left: Math.round(rect.left),
            right: Math.round(viewport - rect.right),
            pageScrollsSideways:
              document.documentElement.scrollWidth > window.innerWidth || window.scrollX !== 0,
          };
        }, selector);

      await page.getByRole("button", { name: "Save", exact: true }).focus();
      await expect(page.getByRole("tooltip")).toBeVisible();
      const tooltip = await bounds(".forma-tooltip:not([hidden])");
      await page.keyboard.press("Escape");

      await page.getByRole("button", { name: "Share" }).click();
      await expect(page.getByRole("dialog", { name: "Share this page" })).toBeVisible();
      const popover = await bounds(".forma-popover");

      for (const [name, b] of [["tooltip", tooltip], ["popover", popover]] as const) {
        expect(b.left, `${name} left gap`).toBeGreaterThanOrEqual(8);
        expect(b.right, `${name} right gap`).toBeGreaterThanOrEqual(8);
        expect(b.pageScrollsSideways, `${name} causes horizontal scroll`).toBe(false);
      }
    });
  }
});

test.describe("Target size (WCAG 2.5.8)", () => {
  for (const name of dashboardPages) {
    test(`${name}: targets are at least 24x24 or adequately spaced`, async ({ page }) => {
      await openPage(page, name);

      const failures = await page.evaluate(() => {
        // The thing you actually click. A Switch's whole label row toggles it.
        const targets = [
          ...document.querySelectorAll<HTMLElement>(
            "button, a[href], input:not([type='hidden']), select, textarea, [role='tab'], .forma-switch-label",
          ),
        ].filter((el) => {
          if (el.matches(":disabled") || el.closest("[hidden]")) return false;
          if (el.classList.contains("forma-switch-input")) return false; // counted via its label
          // Inline exception: links within a sentence.
          if (el.tagName === "A" && el.closest("p")) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });

        const boxes = targets.map((el) => ({ el, rect: el.getBoundingClientRect() }));
        const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        const small = (r: DOMRect) => r.width < 24 || r.height < 24;
        const distToRect = (p: { x: number; y: number }, r: DOMRect) => {
          const dx = Math.max(r.left - p.x, 0, p.x - r.right);
          const dy = Math.max(r.top - p.y, 0, p.y - r.bottom);
          return Math.hypot(dx, dy);
        };

        const out: string[] = [];
        for (const a of boxes) {
          if (!small(a.rect)) continue;
          const ca = centre(a.rect);
          // Spacing exception: a 24px circle on this target mustn't touch another
          // target, or the 24px circle of another undersized target.
          const clash = boxes.find((b) => {
            if (b === a) return false;
            // A control and its own label are the same target.
            const labels = (a.el as HTMLInputElement).labels;
            if (labels && [...labels].includes(b.el as HTMLLabelElement)) return false;
            if (b.el.contains(a.el) || a.el.contains(b.el)) return false;
            return small(b.rect)
              ? Math.hypot(ca.x - centre(b.rect).x, ca.y - centre(b.rect).y) < 24
              : distToRect(ca, b.rect) < 12;
          });
          if (clash) {
            const label = (el: HTMLElement) =>
              el.getAttribute("aria-label") || el.textContent?.trim().slice(0, 24) || el.tagName;
            out.push(
              `${label(a.el)} (${Math.round(a.rect.width)}x${Math.round(a.rect.height)}) too close to ${label(clash.el)}`,
            );
          }
        }
        return out;
      });

      expect(failures).toEqual([]);
    });
  }
});
