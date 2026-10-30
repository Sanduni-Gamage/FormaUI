import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup } from "./RadioGroup";

const options = [
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "SMS", value: "sms" },
];

describe("RadioGroup", () => {
  it("renders the group label and options", () => {
    render(
      <RadioGroup label="Contact method" options={options} />
    );

    expect(
      screen.getByRole("group", { name: "Contact method" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("SMS")).toBeInTheDocument();
  });

  it("supports an uncontrolled default selection", () => {
    render(
      <RadioGroup
        label="Contact method"
        options={options}
        defaultValue="email"
      />
    );

    expect(screen.getByLabelText("Email")).toBeChecked();
  });

  it("supports controlled selection", () => {
    render(
      <RadioGroup
        label="Contact method"
        options={options}
        value="phone"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Phone")).toBeChecked();
  });

  it("allows only one option to be selected", async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup label="Contact method" options={options} />
    );

    await user.click(screen.getByLabelText("Email"));
    expect(screen.getByLabelText("Email")).toBeChecked();

    await user.click(screen.getByLabelText("Phone"));
    expect(screen.getByLabelText("Phone")).toBeChecked();
    expect(screen.getByLabelText("Email")).not.toBeChecked();
  });

  it("calls onChange with the selected value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup
        label="Contact method"
        options={options}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByLabelText("SMS"));

    expect(handleChange).toHaveBeenCalledWith("sms");
  });

  it("renders helper text", () => {
    render(
      <RadioGroup
        label="Contact method"
        options={options}
        hint="Choose your preferred contact method."
      />
    );

    expect(
      screen.getByText("Choose your preferred contact method.")
    ).toBeInTheDocument();
  });

  it("renders an accessible error state", () => {
    render(
      <RadioGroup
        label="Contact method"
        options={options}
        error="Please select a contact method."
      />
    );

    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(
      screen.getByText("Please select a contact method.")
    ).toBeInTheDocument();
  });

  it("does not reference the hidden hint while an error is shown", () => {
    render(
      <RadioGroup
        label="Contact method"
        options={options}
        hint="Choose one option."
        error="Please select a contact method."
      />
    );

    expect(screen.queryByText("Choose one option.")).not.toBeInTheDocument();
    expect(screen.getByRole("group")).toHaveAccessibleDescription(
      "Please select a contact method."
    );
  });

  it("supports required and disabled states", () => {
    render(
      <RadioGroup
        label="Contact method"
        options={options}
        required
        disabled
      />
    );

    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeRequired();
  });

  it("supports individually disabled options", () => {
    render(
      <RadioGroup
        label="Contact method"
        options={[
          { label: "Email", value: "email" },
          { label: "Phone", value: "phone", disabled: true },
        ]}
      />
    );

    expect(screen.getByLabelText("Email")).toBeEnabled();
    expect(screen.getByLabelText("Phone")).toBeDisabled();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <RadioGroup
        label="Contact method"
        options={options}
        hint="Choose one option."
      />
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
