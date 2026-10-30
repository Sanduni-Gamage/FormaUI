import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import "./Tabs.css";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  ariaLabel: string;
  className?: string;
}

export function Tabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  activationMode = "automatic",
  ariaLabel,
  className = "",
}: TabsProps) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // True while keyboard focus is inside a tab panel.
  const focusInPanelRef = useRef(false);

  const firstEnabled = tabs.find((tab) => !tab.disabled)?.id ?? "";

  const [internalValue, setInternalValue] = useState(
    defaultValue && tabs.some(
      (tab) => tab.id === defaultValue && !tab.disabled,
    )
      ? defaultValue
      : firstEnabled,
  );

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const selectedIndex = tabs.findIndex(
    (tab) => tab.id === selectedValue && !tab.disabled,
  );

  // If the requested tab is disabled or missing, fall back to the first enabled tab.
  const activeIndex =
    selectedIndex >= 0
      ? selectedIndex
      : tabs.findIndex((tab) => !tab.disabled);

  // Everything renders from the effective selection, so a disabled or missing
  // `value` never shows as selected.
  const activeValue = tabs[activeIndex]?.id;

  // Only set while keyboard focus is inside the tab list (for manual activation,
  // where focus and selection can differ). Otherwise the selected tab is the one
  // reached with Tab, so it stays in sync when a parent changes `value`.
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const focusedTabIsUsable =
    focusedIndex !== null && tabs[focusedIndex] && !tabs[focusedIndex].disabled;
  const tabbableIndex = focusedTabIsUsable ? focusedIndex : activeIndex;

  const selectTab = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  const focusTab = (index: number) => {
    const tab = tabs[index];

    if (!tab || tab.disabled) return;

    setFocusedIndex(index);
    tabRefs.current[index]?.focus();

    if (activationMode === "automatic") {
      selectTab(tab.id);
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const enabledIndexes = tabs
      .map((tab, tabIndex) => (!tab.disabled ? tabIndex : -1))
      .filter((tabIndex) => tabIndex >= 0);

    if (enabledIndexes.length === 0) return;

    const currentPosition = enabledIndexes.indexOf(index);
    let nextPosition: number;

    if (orientation === "horizontal" && event.key === "ArrowRight") {
      nextPosition = (currentPosition + 1) % enabledIndexes.length;
    } else if (
      orientation === "horizontal" &&
      event.key === "ArrowLeft"
    ) {
      nextPosition =
        (currentPosition - 1 + enabledIndexes.length) %
        enabledIndexes.length;
    } else if (orientation === "vertical" && event.key === "ArrowDown") {
      nextPosition = (currentPosition + 1) % enabledIndexes.length;
    } else if (orientation === "vertical" && event.key === "ArrowUp") {
      nextPosition =
        (currentPosition - 1 + enabledIndexes.length) %
        enabledIndexes.length;
    } else if (event.key === "Home") {
      nextPosition = 0;
    } else if (event.key === "End") {
      nextPosition = enabledIndexes.length - 1;
    } else if (
      activationMode === "manual" &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      selectTab(tabs[index].id);
      return;
    } else {
      return;
    }

    event.preventDefault();
    focusTab(enabledIndexes[nextPosition]);
  };

  // A11Y-003: if the selection changes from outside (a controlled `value`) while
  // focus is inside the panel that's now hidden, focus would drop to the page body.
  // Move it to the newly selected tab instead.
  useEffect(() => {
    if (!focusInPanelRef.current || activeIndex < 0) return;

    const active = document.activeElement;
    const focusLost =
      !active ||
      active === document.body ||
      Boolean(
        rootRef.current?.contains(active) &&
          active.closest('[role="tabpanel"][hidden]'),
      );

    if (focusLost) {
      focusInPanelRef.current = false;
      tabRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  const handlePanelFocus = () => {
    focusInPanelRef.current = true;
  };

  // A null relatedTarget usually means the focused panel was hidden, so keep the flag
  // for the effect above. Focus moving somewhere else clears it.
  const handlePanelBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;

    if (next && !event.currentTarget.contains(next)) {
      focusInPanelRef.current = false;
    }
  };

  // When focus leaves the tab list, forget the roving position so Tab returns to
  // the selected tab next time.
  const handleListBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocusedIndex(null);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`forma-tabs ${className}`.trim()}
      data-orientation={orientation}
    >
      <div
        className="forma-tabs-list"
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        data-orientation={orientation}
        onBlur={handleListBlur}
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === activeValue;
          const tabId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId}
              type="button"
              role="tab"
              className="forma-tab"
              aria-selected={selected}
              aria-controls={panelId}
              disabled={tab.disabled}
              tabIndex={tabbableIndex === index ? 0 : -1}
              onFocus={() => setFocusedIndex(index)}
              // Only onFocus records the focused tab. A click doesn't always move
              // focus (Safari doesn't focus buttons on click), and recording it here
              // left a stale tab as the Tab stop after the parent changed `value`.
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, index) => {
        const selected = tab.id === activeValue;

        return (
          <div
            key={tab.id}
            id={`${baseId}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${index}`}
            hidden={!selected}
            tabIndex={0}
            className="forma-tab-panel"
            onFocus={handlePanelFocus}
            onBlur={handlePanelBlur}
          >
            {selected && tab.content}
          </div>
        );
      })}
    </div>
  );
}
