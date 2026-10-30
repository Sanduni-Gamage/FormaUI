import type { HTMLAttributes, ReactNode } from "react";
import "./Toast.css";

export type ToastVariant = "success" | "info" | "warning" | "error";

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title?: string;
  children: ReactNode;
  onDismiss: () => void;
}

const icons: Record<ToastVariant, string> = {
  success: "✓",
  info: "i",
  warning: "!",
  error: "×",
};

export function Toast({
  variant = "success",
  title,
  children,
  onDismiss,
  className = "",
  role,
  ...props
}: ToastProps) {
  const classes = [
    "forma-toast",
    `forma-toast--${variant}`,
    className,
  ].filter(Boolean).join(" ");

  const isUrgent = variant === "error";

  return (
    <div
      aria-live={isUrgent ? "assertive" : "polite"}
      {...props}
      className={classes}
      role={role ?? (isUrgent ? "alert" : "status")}
    >
      <span className="forma-toast-icon" aria-hidden="true">
        {icons[variant]}
      </span>

      <div className="forma-toast-content">
        {title && <p className="forma-toast-title">{title}</p>}
        <div className="forma-toast-message">{children}</div>
      </div>

      <button
        type="button"
        className="forma-toast-dismiss"
        onClick={() => onDismiss()}
        aria-label="Dismiss notification"
      >
        {/* The × is a visual symbol only; the button is named by aria-label. */}
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
