import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta = {
  title: "Components/Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: {
    label: "Enable notifications",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Enabled: Story = {
  args: {
    defaultChecked: true,
  },
};

export const WithHint: Story = {
  args: {
    hint: "Receive important updates and notifications.",
  },
};

export const WithError: Story = {
  args: {
    error: "This setting could not be saved.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const FullWidth: Story = {
  args: {
    label: "Full-width notification setting",
    hint: "The switch row occupies the full available width.",
    fullWidth: true,
  },
  render: (args) => (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "var(--spacing-4)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <Switch {...args} />
    </div>
  ),
};
