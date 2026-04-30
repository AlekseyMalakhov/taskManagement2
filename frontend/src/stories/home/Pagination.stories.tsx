import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Pagination from "@/components/Home/Pagination";

const meta = {
  title: "Home/Pagination",
  component: Pagination,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: { page: 1, totalPages: 5 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {};
export const MiddlePage: Story = { args: { page: 3, totalPages: 5 } };
export const LastPage: Story = { args: { page: 5, totalPages: 5 } };
export const ManyPages: Story = { args: { page: 5, totalPages: 20 } };
export const TwoPages: Story = { args: { page: 1, totalPages: 2 } };
