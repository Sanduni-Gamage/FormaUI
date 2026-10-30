import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Feedback/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Active",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "info", "warning", "error", "neutral"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: { variant: "success", children: "Active" },
};

export const Info: Story = {
  args: { variant: "info", children: "Information" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Pending" },
};

export const Error: Story = {
  args: { variant: "error", children: "Failed" },
};

export const Neutral: Story = {
  args: { variant: "neutral", children: "Draft" },
};

export const WithDot: Story = {
  args: { variant: "success", dot: true, children: "Online" },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};
