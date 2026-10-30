import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

function ModalTestWrapper({
  onClose = vi.fn(),
}: {
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  return (
    <>
      <button type="button">Background action</button>

      <Modal
        open={open}
        onClose={handleClose}
        title="Confirm changes"
        description="Review your changes before continuing."
      >
        <p>Are you sure you want to continue?</p>
        <button type="button" onClick={handleClose}>
          Confirm
        </button>
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("renders its title and content when open", () => {
    render(<ModalTestWrapper />);

    expect(
      screen.getByRole("dialog", { name: "Confirm changes" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Are you sure you want to continue?"),
    ).toBeInTheDocument();
  });

  it("renders its description", () => {
    render(<ModalTestWrapper />);

    expect(
      screen.getByText("Review your changes before continuing."),
    ).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ModalTestWrapper onClose={onClose} />);

    await user.click(
      screen.getByRole("button", { name: "Close dialog" }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();

    render(
      <Modal
        open
        onClose={onClose}
        title="Escape test"
      >
        Modal content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");

    // jsdom doesn't turn the Escape key into a "cancel" event like a browser does,
    // so fire the event the browser would send. Testing Library has no
    // fireEvent.cancel shortcut, so build the event directly.
    const cancelEvent = new Event("cancel", { cancelable: true });
    fireEvent(dialog, cancelEvent);

    expect(onClose).toHaveBeenCalledTimes(1);
    // The Modal cancels the browser's own close, so the parent stays in control.
    expect(cancelEvent.defaultPrevented).toBe(true);
  });

  // Backdrop tests use user.click, which sends pointerdown + click like a real mouse.
  // The Modal only treats a click as a backdrop click if the press started there too.

  it("calls onClose when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal
        open
        onClose={onClose}
        title="Backdrop test"
      >
        Modal content
      </Modal>,
    );

    await user.click(screen.getByRole("dialog"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when backdrop closing is disabled", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal
        open
        onClose={onClose}
        title="No backdrop close"
        closeOnBackdropClick={false}
      >
        Modal content
      </Modal>,
    );

    await user.click(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close when a text selection is dragged out onto the backdrop", () => {
    const onClose = vi.fn();

    render(
      <Modal open onClose={onClose} title="Drag test">
        <p>Selectable text</p>
      </Modal>,
    );

    // The press starts on the text inside the modal, but the browser targets the
    // resulting click at the <dialog> because the mouse was released outside.
    fireEvent.pointerDown(screen.getByText("Selectable text"));
    fireEvent.click(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close when clicking content inside the modal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal open onClose={onClose} title="Inside click test">
        <p>Modal body text</p>
      </Modal>,
    );

    await user.click(screen.getByText("Modal body text"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose if the browser closes the dialog while it should be open", () => {
    const onClose = vi.fn();

    render(
      <Modal open onClose={onClose} title="Native close test">
        Modal content
      </Modal>,
    );

    // e.g. Chrome closing the dialog on a repeated Escape without a cancel event.
    fireEvent(screen.getByRole("dialog"), new Event("close"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose again when the parent closes it", () => {
    const onClose = vi.fn();

    const { rerender } = render(
      <Modal open onClose={onClose} title="Parent close test">
        Modal content
      </Modal>,
    );

    rerender(
      <Modal open={false} onClose={onClose} title="Parent close test">
        Modal content
      </Modal>,
    );

    expect(onClose).not.toHaveBeenCalled();
  });

  it("can hide the close button", () => {
    render(
      <Modal
        open
        onClose={vi.fn()}
        title="No close button"
        showCloseButton={false}
      >
        Modal content
      </Modal>,
    );

    expect(
      screen.queryByRole("button", { name: "Close dialog" }),
    ).not.toBeInTheDocument();
  });

  it("does not render a description when one is not provided", () => {
    render(
      <Modal open onClose={vi.fn()} title="Simple modal">
        Modal content
      </Modal>,
    );

    expect(screen.getByRole("dialog")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("has no automated accessibility violations", async () => {
    const { container } = render(
      <Modal
        open
        onClose={vi.fn()}
        title="Accessible modal"
        description="An accessible dialog example."
      >
        <p>Modal content</p>
      </Modal>,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
