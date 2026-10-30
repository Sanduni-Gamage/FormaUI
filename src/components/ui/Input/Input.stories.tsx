import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Components/Forms/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    label: "Email address",
    placeholder: "you@example.com",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const WithHint: Story = {
  args: {
    hint: "We will use this address for account updates.",
  },
};

export const WithError: Story = {
  args: {
    error: "Please enter a valid email address.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "user@example.com",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};
