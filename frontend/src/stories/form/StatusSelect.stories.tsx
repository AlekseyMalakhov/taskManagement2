import type { Meta, StoryObj } from "@storybook/react";
import StatusSelect from "@/components/TaskForm/StatusSelect";

const meta = {
  title: "Form/StatusSelect",
  component: StatusSelect,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DefaultValueInProgress: Story = { args: { defaultValue: "inProgress" } };
export const Disabled: Story = { args: { disabled: true } };
