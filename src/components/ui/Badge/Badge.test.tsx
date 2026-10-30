import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it.each(["success", "info", "warning", "error", "neutral"] as const)(
    "supports the %s variant",
    (variant) => {
      render(<Badge variant={variant}>Status</Badge>);
      expect(screen.getByText("Status")).toHaveClass(`forma-badge--${variant}`);
    }
  );

  it.each(["sm", "md", "lg"] as const)(
    "supports the %s size",
    (size) => {
      render(<Badge size={size}>Status</Badge>);
      expect(screen.getByText("Status")).toHaveClass(`forma-badge--${size}`);
    }
  );

  it("renders a decorative dot when requested", () => {
    const { container } = render(<Badge dot>Active</Badge>);
    expect(container.querySelector(".forma-badge-dot")).toBeInTheDocument();
    expect(container.querySelector(".forma-badge-dot")).toHaveAttribute("aria-hidden", "true");
  });

  it("does not render a dot by default", () => {
    const { container } = render(<Badge>Active</Badge>);
    expect(container.querySelector(".forma-badge-dot")).not.toBeInTheDocument();
  });

  it("supports custom class names", () => {
    render(<Badge className="custom-badge">Active</Badge>);
    expect(screen.getByText("Active")).toHaveClass("custom-badge");
  });

  it("has no basic accessibility violations", async () => {
    const { container } = render(<Badge>Active</Badge>);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
