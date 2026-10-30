import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { Modal, type ModalProps } from "./Modal";
import { Button } from "../Button";
import isChromatic from "chromatic/isChromatic";
import { withOverlaySpace } from "../utils/withOverlaySpace";

type ModalDemoProps = ModalProps & {
  triggerLabel?: string;
  actionLabel?: string;
};

// The parent owns `open`, as in a real app. Each story starts closed so the Docs
// page doesn't open every modal at once, and so focus can return to the trigger.
function ModalDemo({
  triggerLabel = "Open modal",
  actionLabel,
  children,
  onClose,
  ...args
}: ModalDemoProps) {
  const [open, setOpen] = useState(false);

  const close = () => {
    onClose();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>

      <Modal {...args} open={open} onClose={close}>
        {children}

        {actionLabel && (
          <div>
            <Button onClick={close}>{actionLabel}</Button>
          </div>
        )}
      </Modal>
    </>
  );
}

const meta = {
  title: "Components/Overlays/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    // A modal is centred on the viewport (up to 560px wide and 85% of its height),
    // so in Chromatic the story fills the viewport and the whole dialog is captured.
    layout: isChromatic() ? "fullscreen" : "centered",
  },
  decorators: [withOverlaySpace({ minHeight: "100vh" })],
  args: {
    open: false,
    // Logs each close in the Actions panel.
    onClose: fn(),
    title: "Welcome to FormaUI",
    description: "This is an example of a reusable modal dialog.",
    children: (
      <p>
        Modal content can contain text, forms, buttons,
        and other reusable components.
      </p>
    ),
  },
  argTypes: {
    // Managed by each story's demo, like a parent component would.
    open: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Opens the modal, so the story page and Chromatic show the open dialog. Docs pages
// don't run play functions, so they still show each story closed.
const openModal: Story["play"] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /^Open/ }));
  await expect(await canvas.findByRole("dialog")).toBeVisible();
};

export const Default: Story = {
  render: (args) => <ModalDemo {...args} actionLabel="Continue" />,
  play: openModal,
};

export const WithoutDescription: Story = {
  args: {
    title: "Quick confirmation",
    description: undefined,
    children: <p>Are you sure you want to continue?</p>,
  },
  render: (args) => <ModalDemo {...args} />,
  play: openModal,
};

export const WithoutCloseButton: Story = {
  args: {
    title: "Action required",
    description: undefined,
    showCloseButton: false,
    closeOnBackdropClick: false,
    // Escape still closes it, so keyboard users always have a way out.
    children: (
      <p>
        Clicking outside won't close this dialog. Use the action button
        or press Escape.
      </p>
    ),
  },
  render: (args) => <ModalDemo {...args} actionLabel="Acknowledge" />,
  play: openModal,
};

export const LongContent: Story = {
  args: {
    title: "Terms and conditions",
    description: "An example of a modal containing longer content.",
    children: Array.from({ length: 8 }, (_, index) => (
      <p key={index}>
        Section {index + 1}: This is example content
        demonstrating how the modal handles longer content
        and scrolling.
      </p>
    )),
  },
  render: (args) => (
    <ModalDemo {...args} triggerLabel="Open long modal" actionLabel="Close" />
  ),
  play: openModal,
};
