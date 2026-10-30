import { useId, type SelectHTMLAttributes } from "react";
import "./Select.css";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
  size?: SelectSize;
  fullWidth?: boolean;
}

export function Select({
  label,
  options,
  placeholder = "Select an option",
  hint,
  error,
  size = "md",
  fullWidth = true,
  id,
  className = "",
  required,
  disabled,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;

  // The hint is hidden while an error is shown, so only reference it when it is on the page.
  const showHint = Boolean(hint) && !error;

  // Browsers skip disabled options when choosing what to show first, so without this
  // an empty select would display the first real option instead of the placeholder.
  const isUncontrolled =
    props.value === undefined && props.defaultValue === undefined;

  const describedBy = [
    props["aria-describedby"],
    showHint ? hintId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const classes = [
    "forma-select",
    `forma-select--${size}`,
    error ? "forma-select--error" : "",
    fullWidth ? "forma-select--full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="forma-select-field">
      <label className="forma-select-label" htmlFor={selectId}>
        {label}
        {required && (
          <span className="forma-select-required" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>

      <select
        {...(isUncontrolled ? { defaultValue: "" } : {})}
        {...props}
        id={selectId}
        className={classes}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {showHint && (
        <p id={hintId} className="forma-select-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="forma-select-error">
          {error}
        </p>
      )}
    </div>
  );
}
