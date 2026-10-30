import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Button } from "./Button";

describe("FormaUI Button", () => {
  it("renders button content", () => {
    render(<Button>Save changes</Button>);

    expect(
      screen.getByRole("button", { name: "Save changes" })
    ).toBeInTheDocument();
  });

  it("uses the primary variant by default", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button"))
      .toHaveClass("forma-button--primary");
  });

  it("supports different variants", () => {
    render(<Button variant="danger">Delete</Button>);

    expect(screen.getByRole("button"))
      .toHaveClass("forma-button--danger");
  });

  it("supports different sizes", () => {
    render(<Button size="lg">Continue</Button>);

    expect(screen.getByRole("button"))
      .toHaveClass("forma-button--lg");
  });

  it("disables the button when disabled", () => {
    render(<Button disabled>Submit</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables the button while loading", () => {
    render(<Button isLoading>Save</Button>);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveTextContent("Loading...");
  });

  it("supports custom loading text", () => {
    render(
      <Button isLoading loadingText="Saving changes...">
        Save
      </Button>
    );

    expect(
      screen.getByRole("button", { name: "Saving changes..." })
    ).toBeInTheDocument();
  });

  it("calls the click handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not trigger click handler when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Button>Accessible button</Button>
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
