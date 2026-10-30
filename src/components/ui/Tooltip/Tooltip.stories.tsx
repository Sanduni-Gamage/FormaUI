import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button";
import { withOverlaySpace } from "../utils/withOverlaySpace";

const meta = {
  title: "Components/Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [withOverlaySpace({ padding: "96px 240px" })],
  args: {
    // Required by the component's types; each story renders its own trigger.
    children: <Button>Trigger</Button>,
  },
  argTypes: {
    children: { control: false },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    delay: {
      control: { type: "number", min: 0, max: 1500, step: 100 },
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Hovers the trigger, so the story page and Chromatic show the tooltip.
const showTooltip: Story["play"] = async ({ canvas, userEvent }) => {
  await userEvent.hover(canvas.getByRole("button"));
  await waitFor(() => expect(canvas.getByRole("tooltip")).toBeVisible());
};

export const Default: Story = {
  args: {
    content: "Save your changes",
    placement: "top",
    delay: 300,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Save</Button>
    </Tooltip>
  ),
  play: showTooltip,
};

export const Top: Story = {
  args: {
    content: "Tooltip above the trigger",
    placement: "top",
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Top</Button>
    </Tooltip>
  ),
  play: showTooltip,
};

export const Bottom: Story = {
  args: {
    content: "Tooltip below the trigger",
    placement: "bottom",
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Bottom</Button>
    </Tooltip>
  ),
  play: showTooltip,
};

export const Left: Story = {
  args: {
    content: "Tooltip to the left",
    placement: "left",
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Left</Button>
    </Tooltip>
  ),
  play: showTooltip,
};

export const Right: Story = {
  args: {
    content: "Tooltip to the right",
    placement: "right",
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Right</Button>
    </Tooltip>
  ),
  play: showTooltip,
};

export const LongContent: Story = {
  args: {
    content:
      "This tooltip contains a longer explanation to demonstrate text wrapping.",
    placement: "top",
    delay: 0,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>More information</Button>
    </Tooltip>
  ),
  play: showTooltip,
};

export const Disabled: Story = {
  args: {
    content: "This tooltip is disabled",
    disabled: true,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Disabled tooltip</Button>
    </Tooltip>
  ),
};
