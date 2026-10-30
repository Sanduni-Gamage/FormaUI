import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Select } from "./Select";

const options = [
  { label: "New Zealand", value: "nz" },
  { label: "Australia", value: "au" },
  { label: "Canada", value: "ca" },
];

describe("Select", () => {
  it("renders with its accessible label", () => {
    render(<Select label="Country" options={options} />);

    expect(
      screen.getByRole("combobox", { name: "Country" })
    ).toBeInTheDocument();
  });

  it("renders the placeholder", () => {
    render(
      <Select
        label="Country"
        options={options}
        placeholder="Choose a country"
      />
    );

    expect(
      screen.getByRole("option", { name: "Choose a country" })
    ).toBeInTheDocument();
  });

  it("shows the placeholder until a choice is made", () => {
    render(
      <Select
        label="Country"
        options={options}
        placeholder="Choose a country"
      />
    );

    expect(screen.getByRole("combobox")).toHaveDisplayValue(
      "Choose a country"
    );
  });

  it("supports uncontrolled default selection", () => {
    render(
      <Select
        label="Country"
        options={options}
        defaultValue="nz"
      />
    );

    expect(screen.getByRole("combobox")).toHaveValue("nz");
  });

  it("supports controlled selection", () => {
    render(
      <Select
        label="Country"
        options={options}
        value="au"
        onChange={() => {}}
      />
    );

    expect(screen.getByRole("combobox")).toHaveValue("au");
  });

  it("allows the user to change the selection", async () => {
    const user = userEvent.setup();

    render(<Select label="Country" options={options} />);

    await user.selectOptions(
      screen.getByRole("combobox"),
      "ca"
    );

    expect(screen.getByRole("combobox")).toHaveValue("ca");
  });

  it("renders helper text", () => {
    render(
      <Select
        label="Country"
        options={options}
        hint="Choose your country."
      />
    );

    expect(
      screen.getByText("Choose your country.")
    ).toBeInTheDocument();
  });

  it("renders an accessible error state", () => {
    render(
      <Select
        label="Country"
        options={options}
        error="Please select a country."
      />
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    expect(
      screen.getByText("Please select a country.")
    ).toBeInTheDocument();
  });

  it("does not reference the hidden hint while an error is shown", () => {
    render(
      <Select
        label="Country"
        options={options}
        hint="Choose your country."
        error="Please select a country."
      />
    );

    expect(screen.queryByText("Choose your country.")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAccessibleDescription(
      "Please select a country."
    );
  });

  it("supports required and disabled states", () => {
    render(
      <Select
        label="Country"
        options={options}
        required
        disabled
      />
    );

    expect(screen.getByRole("combobox")).toBeRequired();
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("supports disabled options", () => {
    render(
      <Select
        label="Country"
        options={[
          { label: "New Zealand", value: "nz" },
          { label: "Australia", value: "au", disabled: true },
        ]}
      />
    );

    expect(
      screen.getByRole("option", { name: "Australia" })
    ).toBeDisabled();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Select
        label="Country"
        options={options}
        hint="Choose your country."
      />
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
