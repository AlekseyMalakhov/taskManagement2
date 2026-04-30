import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import PriorityRadioGroup from "@/components/TaskForm/PriorityRadioGroup";

const meta = {
  title: "Form/PriorityRadioGroup",
  component: PriorityRadioGroup,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    defaultValue: "medium",
    onValueChange: fn(),
  },
} satisfies Meta<typeof PriorityRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMedium: Story = {};
export const DefaultLow: Story = { args: { defaultValue: "low" } };
export const DefaultHigh: Story = { args: { defaultValue: "high" } };
