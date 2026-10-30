import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tabs, type TabItem } from "./Tabs";
import { Button } from "../Button";

const exampleTabs: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    content: <p>Overview of the selected section.</p>,
  },
  {
    id: "details",
    label: "Details",
    content: <p>Additional information and details.</p>,
  },
  {
    id: "settings",
    label: "Settings",
    content: <p>Configure your preferences here.</p>,
  },
];

const meta = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    // Required by the component's types; stories override as needed.
    tabs: exampleTabs,
    ariaLabel: "Example navigation",
  },
  argTypes: {
    tabs: { control: false },
    value: { control: false },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: exampleTabs,
    ariaLabel: "Example navigation",
  },
};

export const Vertical: Story = {
  args: {
    tabs: exampleTabs,
    orientation: "vertical",
    ariaLabel: "Vertical navigation",
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      exampleTabs[0],
      { ...exampleTabs[1], disabled: true },
      exampleTabs[2],
    ],
    ariaLabel: "Navigation with disabled tab",
  },
};

export const ManualActivation: Story = {
  args: {
    tabs: exampleTabs,
    activationMode: "manual",
    ariaLabel: "Manual activation tabs",
  },
};

export const Controlled: Story = {
  render: function ControlledTabs() {
    const [selected, setSelected] = useState("overview");

    return (
      <div>
        <p>Selected tab: {selected}</p>

        {/* The parent can also change the selection itself. */}
        <div style={{ margin: "var(--spacing-3) 0" }}>
          <Button size="sm" variant="outline" onClick={() => setSelected("settings")}>
            Show settings
          </Button>
        </div>

        <Tabs
          tabs={exampleTabs}
          value={selected}
          onValueChange={setSelected}
          ariaLabel="Controlled tabs"
        />
      </div>
    );
  },
};
