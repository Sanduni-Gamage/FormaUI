import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { useKeepInViewport } from "../utils/useKeepInViewport";
import "./Tooltip.css";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

/** The trigger must be focusable (e.g. a button or link) so keyboard users can reach it. */
type TooltipTriggerProps = {
  "aria-describedby"?: string;
};

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement<TooltipTriggerProps>;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Shows short help text when its trigger is hovered or focused. Escape dismisses it.
 *
 * A tooltip supplements its trigger; it must not contain links, buttons or other
 * interactive content. Use a Popover for that.
 *
 * Known limitation: placement is CSS-only, so a tooltip near the edge of the
 * viewport can overflow it. Viewport-aware positioning (e.g. Floating UI) is a
 * planned improvement.
 */
export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 300,
  disabled = false,
  className = "",
}: TooltipProps) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // Shift the tooltip back inside the viewport near a screen edge (A11Y-004).
  useKeepInViewport(tooltipRef, visible && !disabled);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const showTooltip = () => {
    if (disabled || dismissed) return;

    clearTimer();

    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimer();
    setVisible(false);
    setDismissed(false);
  };

  // Escape on the focused trigger. preventDefault as well as stopPropagation, so a
  // tooltip inside a Modal is dismissed first instead of the dialog closing.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && visible) {
      event.preventDefault();
      event.stopPropagation();
      clearTimer();
      setVisible(false);
      setDismissed(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const close = (dismiss: boolean) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setVisible(false);
      setDismissed(dismiss);
    };

    const handleOutsidePointer = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        close(false);
      }
    };

    // WCAG 1.4.13: a tooltip shown on hover must also be dismissible with Escape,
    // without moving the pointer or focus, so listen on the whole document.
    const handleDocumentEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleDocumentEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleDocumentEscape);
    };
  }, [visible]);

  // The tooltip stays in the DOM (hidden until shown) and is always referenced, so a
  // screen reader announces it as soon as the trigger is focused, not after the delay.
  const describedBy =
    [
      children.props["aria-describedby"],
      disabled ? undefined : tooltipId,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  // Only the description link is added to the trigger. Focus, blur and keydown bubble
  // up to the wrapper in React, so the trigger's own handlers are left untouched.
  const trigger = cloneElement(children, {
    "aria-describedby": describedBy,
  });

  return (
    <span
      ref={wrapperRef}
      className={`forma-tooltip-wrapper ${className}`.trim()}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onKeyDown={handleKeyDown}
    >
      {trigger}

      {!disabled && (
        <span
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className="forma-tooltip"
          data-placement={placement}
          hidden={!visible}
        >
          {content}
        </span>
      )}
    </span>
  );
}
