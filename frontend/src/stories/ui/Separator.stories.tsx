import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@/components/ui/separator";
import { FieldSeparator } from "@/components/ui/field";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <p className="text-sm">Above</p>
      <Separator />
      <p className="text-sm">Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-64">
      <FieldSeparator>or</FieldSeparator>
    </div>
  ),
};
