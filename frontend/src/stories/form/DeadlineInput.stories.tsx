import type { Meta, StoryObj } from "@storybook/react";
import DeadlineInput from "@/components/TaskForm/DeadlineInput";

const meta = {
  title: "Form/DeadlineInput",
  component: DeadlineInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof DeadlineInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "2026-06-30" } };
export const WithError: Story = { args: { error: "Deadline is required." } };
export const Disabled: Story = { args: { disabled: true } };
