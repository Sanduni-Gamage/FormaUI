import type { Decorator } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";

/**
 * Story decorator for overlays (Tooltip, Popover, Modal). Chromatic crops each
 * snapshot to the story's own size, and an overlay is positioned outside its
 * trigger, so it could be cut off. In Chromatic only, this gives the story room
 * around the trigger. In Storybook itself the story renders unchanged.
 */
export function withOverlaySpace(style: { padding?: string; minHeight?: string }): Decorator {
  return (Story) =>
    isChromatic() ? (
      <div style={{ ...style, display: "grid", placeItems: "center" }}>
        <Story />
      </div>
    ) : (
      <Story />
    );
}
