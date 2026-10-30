import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const classes = [
    "forma-button",
    `forma-button--${variant}`,
    `forma-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {isLoading && (
        <span
          className="forma-button__spinner"
          aria-hidden="true"
        />
      )}

      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
}
