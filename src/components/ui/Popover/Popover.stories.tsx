import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { Popover } from "./Popover";
import { Button } from "../Button";
import { withOverlaySpace } from "../utils/withOverlaySpace";

// The parent owns `open` here, like a real app would.
function ControlledPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p>Popover is {open ? "open" : "closed"}.</p>
      <Popover
        title="Controlled popover"
        trigger={<Button variant="outline">Toggle popover</Button>}
        open={open}
        onOpenChange={setOpen}
      >
        <p>The parent component controls this popover.</p>
      </Popover>
    </div>
  );
}

const meta = {
  title: "Components/Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [withOverlaySpace({ padding: "240px 360px" })],
  args: {
    title: "Popover information",
    trigger: <Button variant="outline">Open popover</Button>,
    children: (
      <p>
        This is a reusable popover for displaying additional information.
      </p>
    ),
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    titleAs: {
      control: "select",
      options: ["h2", "h3", "h4", "h5", "h6"],
    },
    trigger: { control: false },
    children: { control: false },
    open: { control: false },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

// Opens the popover, so the story page and Chromatic show it open. Docs pages don't
// run play functions, so they still show each story closed.
const openPopover: Story["play"] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { expanded: false }));
  await expect(await canvas.findByRole("dialog")).toBeVisible();
};

export const Default: Story = {
  args: {
    placement: "bottom",
  },
  play: openPopover,
};

export const Top: Story = {
  args: {
    placement: "top",
    title: "Top placement",
  },
  play: openPopover,
};

export const Left: Story = {
  args: {
    placement: "left",
    title: "Left placement",
  },
  play: openPopover,
};

export const Right: Story = {
  args: {
    placement: "right",
    title: "Right placement",
  },
  play: openPopover,
};

export const WithInteractiveContent: Story = {
  args: {
    title: "Account options",
    trigger: <Button variant="outline">Account settings</Button>,
    children: (
      <>
        <p>Manage your account preferences.</p>
        <div style={{ display: "flex", gap: "var(--spacing-2)", flexWrap: "wrap" }}>
          <Button size="sm">Edit profile</Button>
          <Button size="sm" variant="secondary">
            View preferences
          </Button>
        </div>
      </>
    ),
  },
  play: openPopover,
};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
    // No visible heading, so `label` gives the dialog its accessible name.
    label: "More actions",
    trigger: <Button variant="outline">More</Button>,
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        <Button size="sm" variant="secondary">Archive</Button>
        <Button size="sm" variant="danger">Delete</Button>
      </div>
    ),
  },
  play: openPopover,
};

export const Controlled: Story = {
  render: () => <ControlledPopover />,
  play: openPopover,
};
