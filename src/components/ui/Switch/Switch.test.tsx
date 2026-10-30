import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders with its label", () => {
    render(<Switch label="Enable notifications" />);
    expect(screen.getByRole("switch", { name: "Enable notifications" })).toBeInTheDocument();
  });

  it("starts unchecked by default", () => {
    render(<Switch label="Notifications" />);
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("supports a default checked state", () => {
    render(<Switch label="Notifications" defaultChecked />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("supports controlled state", () => {
    render(<Switch label="Notifications" checked onChange={() => {}} />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("calls onChange when toggled", () => {
    const handleChange = vi.fn();

    render(<Switch label="Notifications" onChange={handleChange} />);

    fireEvent.click(screen.getByRole("switch"));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].target.checked).toBe(true);
  });

  it("renders hint text", () => {
    render(<Switch label="Notifications" hint="Receive updates by email." />);
    expect(screen.getByText("Receive updates by email.")).toBeInTheDocument();
  });

  it("renders error text and marks the switch invalid", () => {
    render(<Switch label="Notifications" error="This setting is unavailable." />);

    expect(screen.getByRole("switch")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("This setting is unavailable.")).toBeInTheDocument();
  });

  it("does not reference the hidden hint while an error is shown", () => {
    render(
      <Switch
        label="Notifications"
        hint="Receive updates by email."
        error="This setting is unavailable."
      />
    );

    expect(screen.queryByText("Receive updates by email.")).not.toBeInTheDocument();
    expect(screen.getByRole("switch")).toHaveAccessibleDescription(
      "This setting is unavailable."
    );
  });

  it("supports disabled state", () => {
    render(<Switch label="Notifications" disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("has no basic accessibility violations", async () => {
    const { container } = render(<Switch label="Notifications" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
