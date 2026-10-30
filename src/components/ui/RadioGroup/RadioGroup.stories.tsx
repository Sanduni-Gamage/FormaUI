import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./RadioGroup";

const options = [
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "SMS", value: "sms" },
];

const meta = {
  title: "Components/Forms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    label: "Preferred contact method",
    options,
    orientation: "vertical",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    defaultValue: "email",
  },
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
};

export const WithHint: Story = {
  args: {
    hint: "Choose how you would like us to contact you.",
  },
};

export const WithError: Story = {
  args: {
    error: "Please select a contact method.",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "email",
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone", disabled: true },
      { label: "SMS", value: "sms" },
    ],
  },
};
