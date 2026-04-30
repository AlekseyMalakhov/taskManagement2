import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { children: "Field label" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PairedWithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Label htmlFor="demo-input">Email address</Label>
      <input id="demo-input" type="email" className="rounded-md border px-2 py-1 text-sm" />
    </div>
  ),
};
