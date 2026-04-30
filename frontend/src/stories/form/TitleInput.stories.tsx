import type { Meta, StoryObj } from "@storybook/react";
import TitleInput from "@/components/TaskForm/TitleInput";

const meta = {
  title: "Form/TitleInput",
  component: TitleInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { placeholder: "Enter task title…" },
} satisfies Meta<typeof TitleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "Fix login bug" } };
export const WithError: Story = { args: { error: "Title is required." } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "Disabled input" } };
