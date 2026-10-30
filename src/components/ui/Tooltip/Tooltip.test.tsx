import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { axe } from "jest-axe";
import { Tooltip } from "./Tooltip";

// Only the delay test uses fake timers; everything else uses delay={0} on real time
// and waits for the tooltip with findByRole. Mixing real elapsed time with fake
// timers let the show timer fire outside act() under load, which made tests flaky.
//
// The delay test needs `shouldAdvanceTime: true`: Testing Library waits on a
// zero-length setTimeout after each interaction and only knows how to advance
// Jest's fake timers, so with Vitest's plain fake timers every user event hangs.

describe("Tooltip", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the tooltip after hovering over the trigger", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <Tooltip content="Helpful information" delay={300}>
        <button type="button">Save</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Save" }));

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Helpful information",
    );
  });

  it("shows the tooltip when the trigger receives keyboard focus", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Save your changes" delay={0}>
        <button type="button">Save</button>
      </Tooltip>,
    );

    await user.tab();

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Save your changes",
    );
  });

  it("hides the tooltip when the trigger loses focus", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Tooltip content="Helpful information" delay={0}>
          <button type="button">Save</button>
        </Tooltip>
        <button type="button">Cancel</button>
      </>,
    );

    await user.tab();

    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await user.tab();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("dismisses the tooltip when Escape is pressed", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Helpful information" delay={0}>
        <button type="button">Save</button>
      </Tooltip>,
    );

    await user.tab();

    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("does not show when disabled", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Helpful information" disabled>
        <button type="button">Save</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Save" }));

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("uses the requested placement", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Helpful information" placement="right" delay={0}>
        <button type="button">Save</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("tooltip")).toHaveAttribute(
      "data-placement",
      "right",
    );
  });

  // The following cover FormaUI's changes to the base implementation.

  it("links the description before the tooltip appears, keeping the trigger's own", () => {
    render(
      <Tooltip content="Helpful information">
        <button type="button" aria-describedby="save-note">
          Save
        </button>
      </Tooltip>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    const ids = button.getAttribute("aria-describedby")?.split(" ") ?? [];

    // Screen readers can read the tooltip as soon as the trigger is focused,
    // rather than only after the show delay.
    expect(ids[0]).toBe("save-note");
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[1])).toHaveTextContent(
      "Helpful information",
    );
  });

  it("does not link a description when disabled", () => {
    render(
      <Tooltip content="Helpful information" disabled>
        <button type="button">Save</button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("dismisses a hover tooltip with Escape even when focus is elsewhere", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Helpful information" delay={0}>
        <button type="button">Save</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    // WCAG 1.4.13: dismissible without moving the pointer or focus. The listener is
    // attached in an effect after the tooltip shows, so retry until it's in place.
    let escape!: KeyboardEvent;
    await waitFor(() => {
      escape = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      });
      fireEvent(document.body, escape);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    // Blocking the default stops an enclosing dialog closing on the same press.
    expect(escape.defaultPrevented).toBe(true);
  });

  it("stays visible when the pointer moves onto the tooltip", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Helpful information" delay={0}>
        <button type="button">Save</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Save" }));

    // WCAG 1.4.13: hoverable.
    await user.hover(await screen.findByRole("tooltip"));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("keeps the trigger's own event handlers", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onKeyDown = vi.fn();

    render(
      <Tooltip content="Helpful information">
        <button type="button" onFocus={onFocus} onKeyDown={onKeyDown}>
          Save
        </button>
      </Tooltip>,
    );

    await user.tab();
    await user.keyboard("a");

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("has no automated accessibility violations", async () => {
    const { container } = render(
      <Tooltip content="Save your changes" delay={0}>
        <button type="button">Save</button>
      </Tooltip>,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
