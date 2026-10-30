import { useState } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Popover } from "./Popover";

function PopoverTestWrapper({
  onOpenChange = vi.fn(),
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <>
      <button type="button">Outside action</button>

      <Popover
        trigger={<button type="button">Open options</button>}
        title="Popover options"
        onOpenChange={onOpenChange}
      >
        <p>Choose an action.</p>
        <button type="button">Edit</button>
      </Popover>
    </>
  );
}

describe("Popover", () => {
  it("opens when the trigger is clicked", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    await user.click(screen.getByRole("button", { name: "Open options" }));

    expect(screen.getByRole("dialog", { name: "Popover options" }))
      .toBeInTheDocument();
  });

  it("closes when the trigger is clicked again", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    const trigger = screen.getByRole("button", { name: "Open options" });

    await user.click(trigger);
    await user.click(trigger);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when clicking outside", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    await user.click(screen.getByRole("button", { name: "Open options" }));

    await user.click(screen.getByRole("button", { name: "Outside action" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    await user.click(screen.getByRole("button", { name: "Open options" }));

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders interactive content", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    await user.click(screen.getByRole("button", { name: "Open options" }));

    expect(screen.getByRole("button", { name: "Edit" }))
      .toBeInTheDocument();
  });

  it("sets the requested placement", async () => {
    const user = userEvent.setup();

    render(
      <Popover
        trigger={<button type="button">Open</button>}
        placement="right"
      >
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-placement",
      "right",
    );
  });

  it("updates aria-expanded on the trigger", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    const trigger = screen.getByRole("button", { name: "Open options" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onOpenChange when the popover opens and closes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(<PopoverTestWrapper onOpenChange={onOpenChange} />);

    const trigger = screen.getByRole("button", { name: "Open options" });

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("supports defaultOpen", () => {
    render(
      <Popover
        trigger={<button type="button">Open</button>}
        defaultOpen
      >
        Initial content
      </Popover>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // The following cover FormaUI's changes to the base implementation.

  it("closes on Escape from inside the popover and returns focus to the trigger", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    const trigger = screen.getByRole("button", { name: "Open options" });
    await user.click(trigger);

    // Opening moves focus to the first interactive element inside.
    expect(screen.getByRole("button", { name: "Edit" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("focuses the panel itself when it has no interactive content", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button type="button">Info</button>} title="Details">
        <p>Read-only information.</p>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Info" }));

    expect(screen.getByRole("dialog", { name: "Details" })).toHaveFocus();
  });

  it("does not take focus when it starts open", () => {
    render(
      <>
        <button type="button">Elsewhere</button>
        <Popover
          trigger={<button type="button">Open</button>}
          defaultOpen
        >
          <button type="button">Inner action</button>
        </Popover>
      </>,
    );

    expect(screen.getByRole("button", { name: "Inner action" })).not.toHaveFocus();
  });

  it("leaves focus where the user clicked when closed by an outside click", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    const trigger = screen.getByRole("button", { name: "Open options" });
    await user.click(trigger);

    const outside = screen.getByRole("button", { name: "Outside action" });
    await user.click(outside);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(outside).toHaveFocus();
  });

  it("exposes aria-haspopup on the trigger", () => {
    render(<PopoverTestWrapper />);

    expect(
      screen.getByRole("button", { name: "Open options" }),
    ).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();

    function ControlledPopover() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <span data-testid="state">{open ? "open" : "closed"}</span>
          <Popover
            open={open}
            onOpenChange={setOpen}
            title="Controlled"
            trigger={<button type="button">Toggle</button>}
          >
            <button type="button" onClick={() => setOpen(false)}>
              Done
            </button>
          </Popover>
        </>
      );
    }

    render(<ControlledPopover />);

    const trigger = screen.getByRole("button", { name: "Toggle" });

    await user.click(trigger);
    expect(screen.getByTestId("state")).toHaveTextContent("open");
    expect(screen.getByRole("button", { name: "Done" })).toHaveFocus();

    // The parent closes it from inside: focus returns to the trigger.
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("stays open when controlled open is true and the parent ignores onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Popover
        open
        onOpenChange={onOpenChange}
        trigger={<button type="button">Open</button>}
      >
        Pinned content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("blocks the browser's default Escape action so an enclosing dialog stays open", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    await user.click(screen.getByRole("button", { name: "Open options" }));

    const escape = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    fireEvent(screen.getByRole("button", { name: "Edit" }), escape);

    expect(escape.defaultPrevented).toBe(true);
  });

  it("links the trigger to the popover with aria-controls", async () => {
    const user = userEvent.setup();

    render(<PopoverTestWrapper />);

    const trigger = screen.getByRole("button", { name: "Open options" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute(
      "aria-controls",
      screen.getByRole("dialog").id,
    );
  });

  it("keeps the trigger's own event handlers", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onKeyDown = vi.fn();

    render(
      <Popover
        trigger={
          <button type="button" onClick={onClick} onKeyDown={onKeyDown}>
            Open
          </button>
        }
      >
        Content
      </Popover>,
    );

    // Type on the focused trigger first: opening moves focus into the popover.
    await user.tab();
    await user.keyboard("a");
    expect(onKeyDown).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders the title as an h2 by default and at the level given by titleAs", () => {
    const { rerender } = render(
      <Popover trigger={<button type="button">Open</button>} title="Share" defaultOpen>
        Content
      </Popover>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Share" })).toBeInTheDocument();

    rerender(
      <Popover
        trigger={<button type="button">Open</button>}
        title="Share"
        titleAs="h3"
        defaultOpen
      >
        Content
      </Popover>,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Share" })).toHaveClass(
      "forma-popover-title",
    );
    // The dialog is still named by the title at any level.
    expect(screen.getByRole("dialog", { name: "Share" })).toBeInTheDocument();
  });

  it("closes when keyboard focus moves out of it, leaving focus where it went", async () => {
    const user = userEvent.setup();

    render(
      <>
        <PopoverTestWrapper />
        <button type="button">After</button>
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Open options" });
    await user.click(trigger);
    expect(screen.getByRole("button", { name: "Edit" })).toHaveFocus();

    // Tab past the last element inside the popover.
    await user.tab();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("stays open while focus moves between its own elements", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button type="button">Open</button>} title="Actions">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.tab();

    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("is named by its title", () => {
    render(
      <Popover
        trigger={<button type="button">Open</button>}
        title="Share settings"
        label="Ignored when there is a title"
        defaultOpen
      >
        Content
      </Popover>,
    );

    expect(screen.getByRole("dialog", { name: "Share settings" }))
      .toBeInTheDocument();
  });

  it("is named by label when there is no title", async () => {
    const { container } = render(
      <Popover
        trigger={<button type="button">More</button>}
        label="More actions"
        defaultOpen
      >
        <button type="button">Archive</button>
      </Popover>,
    );

    expect(screen.getByRole("dialog", { name: "More actions" }))
      .toBeInTheDocument();
    expect((await axe(container)).violations).toHaveLength(0);
  });

  it("has no automated accessibility violations", async () => {
    const { container } = render(
      <Popover
        trigger={<button type="button">Open options</button>}
        title="Accessible options"
        defaultOpen
      >
        <p>Choose an action.</p>
        <button type="button">Edit</button>
      </Popover>,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
