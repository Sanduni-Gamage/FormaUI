import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders its label", () => {
    render(<Input label="Email address" />);

    expect(
      screen.getByRole("textbox", { name: "Email address" })
    ).toBeInTheDocument();
  });

  it("renders hint text", () => {
    render(
      <Input label="Email" hint="Enter your work email." />
    );

    expect(
      screen.getByText("Enter your work email.")
    ).toBeInTheDocument();
  });

  it("renders an error message", () => {
    render(
      <Input label="Email" error="Invalid email address." />
    );

    expect(
      screen.getByText("Invalid email address.")
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("associates hint and error descriptions with the input", () => {
    render(
      <Input
        label="Email"
        hint="Enter your email."
        error="Email is invalid."
      />
    );

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("-error")
    );
  });

  it("does not reference the hidden hint while an error is shown", () => {
    render(
      <Input
        label="Email"
        hint="Enter your email."
        error="Email is invalid."
      />
    );

    expect(screen.queryByText("Enter your email.")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "Email is invalid."
    );
  });

  it("supports required and disabled states", () => {
    render(
      <Input label="Email" required disabled />
    );

    expect(screen.getByRole("textbox")).toBeRequired();
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Input label="Email" hint="Enter your email." />
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
