import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { useKeepInViewport } from "../utils/useKeepInViewport";
import "./Popover.css";

export type PopoverPlacement = "top" | "bottom" | "left" | "right";

export type PopoverHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

/** Props the Popover reads from and adds to its trigger, which should be a button. */
type PopoverTriggerProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  "data-forma-popover-trigger"?: string;
  "aria-haspopup"?: "dialog";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

export interface PopoverProps {
  trigger: ReactElement<PopoverTriggerProps>;
  children: ReactNode;
  placement?: PopoverPlacement;
  /** Visible heading. Also names the dialog for screen readers. */
  title?: string;
  /** Heading level for the title, to fit the page's heading hierarchy. Appearance is the same at every level. */
  titleAs?: PopoverHeadingLevel;
  /**
   * Accessible name when there's no visible title. Every popover needs a name, so
   * provide either `title` or `label`.
   */
  label?: string;
  /** Controlled open state. Pair with onOpenChange. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A non-modal popover for interactive content. It doesn't trap focus or block the
 * rest of the page; use Modal for that. It closes when keyboard focus moves out of
 * it, so it can't be left covering whatever receives focus next (WCAG 2.4.11).
 */
export function Popover({
  trigger,
  children,
  placement = "bottom",
  title,
  titleAs = "h2",
  label,
  open,
  defaultOpen = false,
  onOpenChange,
  className = "",
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const popoverId = useId();
  const titleId = useId();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const wasOpenRef = useRef(isOpen);
  // Shift the panel back inside the viewport near a screen edge (A11Y-004).
  useKeepInViewport(panelRef, isOpen);

  // Set when the popover closes because the user moved elsewhere (outside click or
  // focus leaving), so focus isn't pulled back to the trigger.
  const closedByOutsideClickRef = useRef(false);

  const updateOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    // Don't move focus on first render, so a popover that starts open
    // (defaultOpen, or open={true}) doesn't steal focus when the page loads.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      wasOpenRef.current = isOpen;
      return;
    }

    if (isOpen && !wasOpenRef.current) {
      const panel = panelRef.current;

      if (panel) {
        const firstFocusable = panel.querySelector<HTMLElement>(FOCUSABLE);
        (firstFocusable ?? panel).focus();
      }
    } else if (!isOpen && wasOpenRef.current) {
      // Return focus to the trigger, unless the user closed the popover by clicking
      // somewhere else. Focus then follows their click anyway, and calling focus() on
      // the trigger first would scroll the page back to it (checked in a browser: a
      // click far down the page jumped back to the top).
      if (!closedByOutsideClickRef.current) {
        wrapperRef.current
          ?.querySelector<HTMLElement>("[data-forma-popover-trigger]")
          ?.focus();
      }
    }

    closedByOutsideClickRef.current = false;
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        closedByOutsideClickRef.current = true;
        if (!isControlled) setInternalOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isOpen, isControlled, onOpenChange]);

  const handleTriggerClick = (event: MouseEvent<HTMLElement>) => {
    trigger.props.onClick?.(event);
    updateOpen(!isOpen);
  };

  // Escape is handled on the wrapper, so it works from the trigger and from anything
  // inside the popover. preventDefault stops an enclosing Modal closing on the same
  // key press. The focus effect above returns focus to the trigger.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      updateOpen(false);
    }
  };

  // Close when keyboard focus moves somewhere outside the popover and its trigger
  // (A11Y-005), so it can't be left covering the next focused element (WCAG 2.4.11).
  // Focus has already moved on, so it isn't pulled back to the trigger. A null
  // relatedTarget (e.g. clicking a non-focusable area) is left to the outside-click
  // handler.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;

    if (isOpen && next && !event.currentTarget.contains(next)) {
      closedByOutsideClickRef.current = true;
      updateOpen(false);
    }
  };

  const TitleTag = titleAs;

  // The trigger's own onKeyDown is left untouched; its key presses bubble up to the
  // wrapper's handler.
  const triggerElement = cloneElement(trigger, {
    "data-forma-popover-trigger": "",
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    "aria-controls": popoverId,
    onClick: handleTriggerClick,
  });

  return (
    <div
      ref={wrapperRef}
      className={`forma-popover-wrapper ${className}`.trim()}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {triggerElement}

      {isOpen && (
        <div
          ref={panelRef}
          id={popoverId}
          className="forma-popover"
          data-placement={placement}
          role="dialog"
          aria-modal="false"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : label}
          tabIndex={-1}
        >
          {title && (
            <TitleTag id={titleId} className="forma-popover-title">
              {title}
            </TitleTag>
          )}

          <div className="forma-popover-content">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
