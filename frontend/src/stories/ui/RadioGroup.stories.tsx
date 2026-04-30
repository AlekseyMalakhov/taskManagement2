import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" className="flex flex-col gap-2">
      {["Option 1", "Option 2", "Option 3"].map((label, i) => {
        const id = `radio-${i + 1}`;
        return (
          <div key={id} className="flex items-center gap-2">
            <RadioGroupItem value={`option-${i + 1}`} id={id} />
            <Label htmlFor={id}>{label}</Label>
          </div>
        );
      })}
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="r-d-1" disabled />
        <Label htmlFor="r-d-1">Disabled checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="r-d-2" disabled />
        <Label htmlFor="r-d-2">Disabled unchecked</Label>
      </div>
    </RadioGroup>
  ),
};
