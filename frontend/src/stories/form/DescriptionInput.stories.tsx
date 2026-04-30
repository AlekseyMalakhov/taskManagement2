import type { Meta, StoryObj } from "@storybook/react";
import DescriptionInput from "@/components/TaskForm/DescriptionInput";

const meta = {
  title: "Form/DescriptionInput",
  component: DescriptionInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { placeholder: "Describe the task…" },
} satisfies Meta<typeof DescriptionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "Investigate the root cause of the timeout." } };
export const Disabled: Story = { args: { disabled: true } };
