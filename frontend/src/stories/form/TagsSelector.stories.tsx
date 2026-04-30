import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import TagsSelector from "@/components/TaskForm/TagsSelector";
import type { Tag } from "@task-app/shared";

const SAMPLE_TAGS: Tag[] = [
  { id: "1", name: "Bug" },
  { id: "2", name: "Feature" },
  { id: "3", name: "Documentation" },
  { id: "4", name: "Refactor" },
];

const meta = {
  title: "Form/TagsSelector",
  component: TagsSelector,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    tags: SAMPLE_TAGS,
    selectedTagIds: [],
    onToggle: fn(),
  },
} satisfies Meta<typeof TagsSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { tags: [] },
};

export const NoSelection: Story = {};

export const WithPreselection: Story = {
  args: { selectedTagIds: ["1", "3"] },
};

function InteractiveTagsSelector(args: React.ComponentProps<typeof TagsSelector>) {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <TagsSelector
      {...args}
      selectedTagIds={selected}
      onToggle={(next) => {
        setSelected(next);
        args.onToggle(next);
      }}
    />
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveTagsSelector {...args} />,
};

export const WithError: Story = {
  args: { error: "At least one tag is required." },
};
