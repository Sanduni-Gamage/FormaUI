import { useId, type InputHTMLAttributes } from "react";
import "./Input.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  hint?: string;
  error?: string;
  size?: InputSize;
  fullWidth?: boolean;
}

export function Input({
  label,
  hint,
  error,
  size = "md",
  fullWidth = true,
  id,
  className = "",
  required,
  disabled,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

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
    "forma-input",
    `forma-input--${size}`,
    error ? "forma-input--error" : "",
    fullWidth ? "forma-input--full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="forma-input-field">
      <label className="forma-input-label" htmlFor={inputId}>
        {label}
        {required && (
          <span className="forma-input-required" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>

      <input
        {...props}
        id={inputId}
        className={classes}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />

      {showHint && (
        <p id={hintId} className="forma-input-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="forma-input-error">
          {error}
        </p>
      )}
    </div>
  );
}
