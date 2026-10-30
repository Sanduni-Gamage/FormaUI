import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const options = [
  { label: "New Zealand", value: "nz" },
  { label: "Australia", value: "au" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
  { label: "China", value: "cn" },
  { label: "United States", value: "us" },
  { label: "India", value: "in" },
];

const meta = {
  title: "Components/Forms/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "Country",
    options,
    placeholder: "Choose a country",
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
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const countryOptions = [
  { label: "New Zealand", value: "nz" },
  { label: "Australia", value: "au" },
  { label: "Sri Lanka", value: "lk" },
  { label: "China", value: "cn" },
  { label: "United States", value: "us" },
  { label: "India", value: "in" },
];

export const Placeholder: Story = {
  args: {
    label: "Country",
    placeholder: "Choose a country",
    options: countryOptions,
  },
};

export const WithSelection: Story = {
  args: {
    label: "Country",
    defaultValue: "nz",
    options: countryOptions,
  },
};

export const WithHint: Story = {
  args: {
    hint: "Choose your country of residence.",
  },
};

export const WithError: Story = {
  args: {
    error: "Please select a country.",
    required: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "nz",
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: "New Zealand", value: "nz" },
      { label: "Australia", value: "au", disabled: true },
      { label: "United Kingdom", value: "uk" },
      { label: "China", value: "cn" },
      { label: "United States", value: "us" },
      { label: "India", value: "in" },
    ],
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
