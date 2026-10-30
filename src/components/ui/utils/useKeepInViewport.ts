import { useLayoutEffect, type RefObject } from "react";

/** Minimum gap kept between an overlay and the edge of the viewport. */
const EDGE_MARGIN = 8;

/**
 * Keeps an open overlay (Tooltip, Popover) horizontally inside the viewport, so it
 * never makes the page scroll sideways on narrow screens (WCAG 1.4.10 Reflow).
 *
 * It measures the element and sets `--forma-viewport-shift` on it. The overlay's
 * CSS applies that with the `translate` property, which composes with any
 * `transform` used for positioning or animation instead of replacing it.
 *
 * Horizontal only: flipping to the opposite side when there's no room above or
 * below is a possible future enhancement.
 */
export function useKeepInViewport(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!active || !element) return;

    const update = () => {
      const viewportWidth = document.documentElement.clientWidth;
      if (viewportWidth === 0) return; // no layout (e.g. jsdom)

      element.style.setProperty("--forma-viewport-shift", "0px");
      const rect = element.getBoundingClientRect();

      let shift = 0;
      if (rect.right > viewportWidth - EDGE_MARGIN) {
        shift = viewportWidth - EDGE_MARGIN - rect.right;
      }
      if (rect.left + shift < EDGE_MARGIN) {
        shift = EDGE_MARGIN - rect.left;
      }

      element.style.setProperty("--forma-viewport-shift", `${Math.round(shift)}px`);
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [ref, active]);
}
