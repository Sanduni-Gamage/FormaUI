import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders with its accessible label", () => {
    render(<Checkbox label="Accept terms" />);

    expect(
      screen.getByRole("checkbox", { name: "Accept terms" })
    ).toBeInTheDocument();
  });

  it("supports uncontrolled checked state", () => {
    render(
      <Checkbox label="Accept terms" defaultChecked />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("supports controlled checked state", () => {
    render(
      <Checkbox label="Accept terms" checked onChange={() => {}} />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("allows the user to toggle the checkbox", async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Accept terms" />);

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("renders helper text", () => {
    render(
      <Checkbox
        label="Notifications"
        hint="Receive product updates."
      />
    );

    expect(
      screen.getByText("Receive product updates.")
    ).toBeInTheDocument();
  });

  it("renders an accessible validation error", () => {
    render(
      <Checkbox
        label="Accept terms"
        error="You must accept the terms."
      />
    );

    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(
      screen.getByText("You must accept the terms.")
    ).toBeInTheDocument();
  });

  it("does not reference the hidden hint while an error is shown", () => {
    render(
      <Checkbox
        label="Accept terms"
        hint="Please review the terms."
        error="You must accept the terms."
      />
    );

    expect(
      screen.queryByText("Please review the terms.")
    ).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toHaveAccessibleDescription(
      "You must accept the terms."
    );
  });

  it("supports required and disabled states", () => {
    render(
      <Checkbox label="Accept terms" required disabled />
    );

    expect(screen.getByRole("checkbox")).toBeRequired();
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Checkbox
        label="Accept terms"
        hint="Please review the terms."
      />
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
