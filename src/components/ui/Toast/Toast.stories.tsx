import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "../Button";
import { Toast } from "./Toast";
import type { ToastVariant } from "./Toast";

const meta = {
  title: "Components/Feedback/Toast",
  component: Toast,
  tags: ["autodocs"],
  args: {
    children: "Your changes have been saved.",
    // Logs each dismiss click in the Actions panel.
    onDismiss: fn(),
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: "success",
    title: "Saved successfully",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "New update",
    children: "A new update is available.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Session expiring",
    children: "Your session will expire soon.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Save failed",
    children: "Please try again.",
  },
};

function InteractiveToastExample({
  variant,
}: {
  variant: ToastVariant;
}) {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const userToggled = useRef(false);

  // The button the user pressed disappears when the view swaps, which would drop
  // keyboard focus to the page body. Move focus to the button that replaced it.
  // Skipped on first render so the story doesn't steal focus when it loads.
  useEffect(() => {
    if (!userToggled.current) return;
    containerRef.current?.querySelector("button")?.focus();
  }, [visible]);

  function toggle(next: boolean) {
    userToggled.current = true;
    setVisible(next);
  }

  return (
    <div ref={containerRef}>
      {visible ? (
        <Toast
          variant={variant}
          title="Notification"
          onDismiss={() => toggle(false)}
        >
          This notification can be dismissed.
        </Toast>
      ) : (
        <Button variant="outline" onClick={() => toggle(true)}>
          Show notification again
        </Button>
      )}
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveToastExample variant="success" />,
};
