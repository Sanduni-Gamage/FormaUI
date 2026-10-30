import type { HTMLAttributes } from "react";
import "./Badge.css";

export type BadgeVariant =
  | "success"
  | "info"
  | "warning"
  | "error"
  | "neutral";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export function Badge({
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const classes = [
    "forma-badge",
    `forma-badge--${variant}`,
    `forma-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {dot && <span className="forma-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
