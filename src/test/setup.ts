import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom (v31) has <dialog> and its `open` property, but not showModal(), show() or
// close(). This minimal polyfill lets dialog-based components run in tests.
// It doesn't emulate the browser's focus trapping, inert background or the
// Escape key: tests for Escape should fire a "cancel" or "keydown" event directly.
if (
  typeof HTMLDialogElement !== "undefined" &&
  !HTMLDialogElement.prototype.showModal
) {
  HTMLDialogElement.prototype.show = function (this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.close = function (
    this: HTMLDialogElement,
    returnValue?: string
  ) {
    if (!this.open) return;
    if (returnValue !== undefined) this.returnValue = returnValue;
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}
