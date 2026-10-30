import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders its message", () => {
    render(<Alert>Changes saved.</Alert>);
    expect(screen.getByText("Changes saved.")).toBeInTheDocument();
  });

  it("renders an optional title", () => {
    render(<Alert title="Success">Your changes were saved.</Alert>);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders the title as an h3 by default", () => {
    render(<Alert title="Saved">Your changes were saved.</Alert>);
    expect(
      screen.getByRole("heading", { level: 3, name: "Saved" })
    ).toBeInTheDocument();
  });

  it.each([2, 4, 6] as const)(
    "renders the title at heading level %i with titleAs",
    (level) => {
      render(
        <Alert title="Saved" titleAs={`h${level}`}>
          Your changes were saved.
        </Alert>
      );

      expect(
        screen.getByRole("heading", { level, name: "Saved" })
      ).toHaveClass("forma-alert-title");
    }
  );

  it.each(["success", "info", "warning", "error"] as const)(
    "supports the %s variant",
    (variant) => {
      render(<Alert variant={variant}>Message</Alert>);
      expect(screen.getByText("Message").parentElement?.parentElement)
        .toHaveClass(`forma-alert--${variant}`);
    }
  );

  it("uses an alert role for warning and error", () => {
    const { rerender } = render(<Alert variant="warning">Warning</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    rerender(<Alert variant="error">Error</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses a status role for success and info", () => {
    render(<Alert variant="success">Saved</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("lets the caller override the role", () => {
    render(
      <Alert variant="error" role="region" aria-label="Form errors">
        Please fix the highlighted fields.
      </Alert>
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Form errors" })
    ).toBeInTheDocument();
  });

  it("calls onDismiss when dismissed", () => {
    const onDismiss = vi.fn();

    render(
      <Alert dismissible onDismiss={onDismiss}>
        Dismiss me
      </Alert>
    );

    fireEvent.click(screen.getByRole("button", { name: "Dismiss alert" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("has no basic accessibility violations", async () => {
    const { container } = render(<Alert title="Information">Details</Alert>);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
