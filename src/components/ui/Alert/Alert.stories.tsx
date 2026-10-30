import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Alert } from "./Alert";

const meta = {
  title: "Components/Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: {
    children: "Your changes have been saved successfully.",
  },
  argTypes: {
    titleAs: {
      control: "select",
      options: ["h2", "h3", "h4", "h5", "h6"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Saved successfully",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Attention required",
    children: "Some information needs your attention.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Something went wrong",
    children: "We couldn't save your changes. Please try again.",
  },
};

export const Dismissible: Story = {
  args: {
    variant: "success",
    title: "Profile updated",
    dismissible: true,
    // Logs each click in the Actions panel. The Alert doesn't hide itself;
    // the parent decides what dismissing means.
    onDismiss: fn(),
  },
};
