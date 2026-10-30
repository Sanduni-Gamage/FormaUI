import { useId, type InputHTMLAttributes } from "react";
import "./Checkbox.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
  error?: string;
}

export function Checkbox({
  label,
  hint,
  error,
  id,
  className = "",
  disabled,
  required,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const hintId = `${checkboxId}-hint`;
  const errorId = `${checkboxId}-error`;

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
    "forma-checkbox",
    error ? "forma-checkbox--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="forma-checkbox-field">
      <div className="forma-checkbox-control">
        <input
          {...props}
          id={checkboxId}
          type="checkbox"
          className={classes}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />

        <label
          className="forma-checkbox-label"
          htmlFor={checkboxId}
        >
          {label}
          {required && (
            <span
              className="forma-checkbox-required"
              aria-hidden="true"
            >
              {" "}*
            </span>
          )}
        </label>
      </div>

      {showHint && (
        <p id={hintId} className="forma-checkbox-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="forma-checkbox-error">
          {error}
        </p>
      )}
    </div>
  );
}
