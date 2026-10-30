import type { HTMLAttributes, ReactNode } from "react";
import "./Alert.css";

export type AlertVariant = "success" | "info" | "warning" | "error";

export type AlertHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  /** Heading level for the title, to fit the page's heading hierarchy. Appearance is the same at every level. */
  titleAs?: AlertHeadingLevel;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const icons: Record<AlertVariant, string> = {
  success: "✓",
  info: "i",
  warning: "!",
  error: "×",
};

export function Alert({
  variant = "info",
  title,
  titleAs,
  children,
  dismissible = false,
  onDismiss,
  className = "",
  role,
  ...props
}: AlertProps) {
  const classes = [
    "forma-alert",
    `forma-alert--${variant}`,
    className,
  ].filter(Boolean).join(" ");

  // Urgent variants interrupt screen readers; the rest are announced politely.
  // Callers can override this, e.g. for an error that is already on screen at page load.
  const defaultRole =
    variant === "error" || variant === "warning" ? "alert" : "status";

  const TitleTag = titleAs ?? "h3";

  return (
    <div
      {...props}
      className={classes}
      role={role ?? defaultRole}
    >
      <span className="forma-alert-icon" aria-hidden="true">
        {icons[variant]}
      </span>

      <div className="forma-alert-content">
        {title && (
          <TitleTag className="forma-alert-title">
            {title}
          </TitleTag>
        )}
        <div className="forma-alert-message">{children}</div>
      </div>

      {dismissible && (
        <button
          type="button"
          className="forma-alert-dismiss"
          aria-label="Dismiss alert"
          onClick={() => onDismiss?.()}
        >
          {/* The × is a visual symbol only; the button is named by aria-label. */}
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}
