import { useId, type InputHTMLAttributes } from "react";
import "./Switch.css";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: string;
  hint?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Switch({
  label,
  hint,
  error,
  size = "md",
  fullWidth = false,
  id,
  className = "",
  disabled,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const hintId = `${switchId}-hint`;
  const errorId = `${switchId}-error`;

  // The hint is hidden while an error is shown, so only reference it when it is on the page.
  const showHint = Boolean(hint) && !error;

  const describedBy = [
    props["aria-describedby"],
    showHint ? hintId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const classes = [
    "forma-switch",
    `forma-switch--${size}`,
    error ? "forma-switch--error" : "",
    fullWidth ? "forma-switch--full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <label className="forma-switch-label" htmlFor={switchId}>
        <input
          {...props}
          id={switchId}
          type="checkbox"
          role="switch"
          className="forma-switch-input"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />

        <span className="forma-switch-track" aria-hidden="true">
          <span className="forma-switch-thumb" />
        </span>

        <span className="forma-switch-text">{label}</span>
      </label>

      {showHint && (
        <p id={hintId} className="forma-switch-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="forma-switch-error">
          {error}
        </p>
      )}
    </div>
  );
}
