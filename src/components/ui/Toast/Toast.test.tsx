import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("renders its message", () => {
    render(<Toast onDismiss={() => {}}>Profile saved.</Toast>);
    expect(screen.getByText("Profile saved.")).toBeInTheDocument();
  });

  it("renders an optional title", () => {
    render(
      <Toast title="Success" onDismiss={() => {}}>
        Your changes were saved.
      </Toast>
    );

    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it.each(["success", "info", "warning", "error"] as const)(
    "supports the %s variant",
    (variant) => {
      render(
        <Toast variant={variant} onDismiss={() => {}}>
          Notification
        </Toast>
      );

      expect(screen.getByText("Notification").parentElement?.parentElement)
        .toHaveClass(`forma-toast--${variant}`);
    }
  );

  it("uses an alert role for errors", () => {
    render(
      <Toast variant="error" onDismiss={() => {}}>
        Something went wrong.
      </Toast>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses a status role for other variants", () => {
    render(
      <Toast variant="success" onDismiss={() => {}}>
        Saved successfully.
      </Toast>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("calls onDismiss when the dismiss button is clicked", () => {
    const onDismiss = vi.fn();

    render(<Toast onDismiss={onDismiss}>Saved</Toast>);

    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" })
    );

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith();
  });

  it("has no basic accessibility violations", async () => {
    const { container } = render(
      <Toast onDismiss={() => {}}>Saved successfully.</Toast>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
