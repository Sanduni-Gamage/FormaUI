import { useId } from "react";
import type { ChangeEvent } from "react";
import "./RadioGroup.css";

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: string;
  name?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  hint?: string;
  error?: string;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue,
  onChange,
  hint,
  error,
  orientation = "vertical",
  disabled = false,
  required = false,
  className = "",
}: RadioGroupProps) {
  const generatedId = useId();
  const groupName = name ?? generatedId;
  const hintId = `${generatedId}-hint`;
  const errorId = `${generatedId}-error`;

  // The hint is hidden while an error is shown, so only reference it when it is on the page.
  const showHint = Boolean(hint) && !error;

  const describedBy = [
    showHint ? hintId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const classes = [
    "forma-radio-group",
    `forma-radio-group--${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.value);
  }

  return (
    <fieldset
      className="forma-radio-fieldset"
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
    >
      <legend className="forma-radio-legend">
        {label}
        {required && (
          <span className="forma-radio-required" aria-hidden="true">
            {" "}*
          </span>
        )}
      </legend>

      <div className={classes}>
        {options.map((option) => {
          const optionId = `${generatedId}-${option.value}`;

          return (
            <div className="forma-radio-option" key={option.value}>
              <input
                id={optionId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={
                  value !== undefined
                    ? value === option.value
                    : undefined
                }
                defaultChecked={
                  value === undefined
                    ? defaultValue === option.value
                    : undefined
                }
                onChange={handleChange}
                required={required}
                disabled={option.disabled}
                className="forma-radio-input"
              />

              <label
                htmlFor={optionId}
                className="forma-radio-label"
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>

      {showHint && (
        <p id={hintId} className="forma-radio-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="forma-radio-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
