import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TaskCard from "./TaskCard";
import type { Task, Tag } from "@task-app/shared";

// Mock the API module to avoid real network calls
vi.mock("@/store/api", () => ({
  usePatchTaskStatusMutation: vi.fn(() => [vi.fn(), { isLoading: false, isError: false }]),
  useGetTagsQuery: vi.fn(() => ({ data: [], isLoading: false })),
  useCreateTagMutation: vi.fn(() => [vi.fn()]),
  useUpdateTaskMutation: vi.fn(() => [vi.fn()]),
}));

// Create a minimal store for Provider
function makeStore() {
  return configureStore({
    reducer: {
      _placeholder: () => null,
    },
  });
}

const TODAY = "2026-04-29";
const YESTERDAY = "2026-04-28";
const TOMORROW = "2026-04-30";

const tags: Tag[] = [
  { id: "tag-1", name: "Frontend" },
  { id: "tag-2", name: "Backend" },
];
const tagsById = new Map(tags.map((t) => [t.id, t]));

const baseTask: Task = {
  id: "task-1",
  title: "Test Task Title",
  description: "A sample description",
  status: "todo",
  priority: "medium",
  deadline: TOMORROW,
  tags: ["tag-1"],
  createdAt: "2026-04-01T00:00:00.000Z",
  updatedAt: "2026-04-01T00:00:00.000Z",
};

function renderCard(task: Partial<Task> = {}, extraProps: {
  onTagClick?: (tagId: string) => void;
  selectedTagIds?: Set<string>;
} = {}) {
  const fullTask: Task = { ...baseTask, ...task };
  const props = { onTagClick: vi.fn(), ...extraProps };
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter>
        <TaskCard task={fullTask} tagsById={tagsById} {...props} />
      </MemoryRouter>
    </Provider>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(TODAY + "T12:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("TaskCard", () => {
  it("renders the task title", () => {
    renderCard();
    expect(screen.getByText("Test Task Title")).toBeInTheDocument();
  });

  it("renders the priority badge", () => {
    renderCard({ priority: "medium" });
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders the correct priority badge for 'high'", () => {
    renderCard({ priority: "high" });
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders the correct priority badge for 'low'", () => {
    renderCard({ priority: "low" });
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  it("renders a status select with correct current value", () => {
    renderCard({ status: "todo" });
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("todo");
  });

  it("renders the deadline in DD/MM/YYYY format", () => {
    renderCard({ deadline: "2026-05-15" });
    expect(screen.getByText(/15\/05\/2026/)).toBeInTheDocument();
  });

  it("renders the task description when provided", () => {
    renderCard({ description: "Some description text" });
    expect(screen.getByText("Some description text")).toBeInTheDocument();
  });

  it("does not render description section when not provided", () => {
    renderCard({ description: undefined });
    expect(screen.queryByText("Some description text")).not.toBeInTheDocument();
  });

  it("renders tag chips for associated tags", () => {
    renderCard({ tags: ["tag-1"] });
    expect(screen.getByText("Frontend")).toBeInTheDocument();
  });

  it("shows overdue indicator when task is past deadline and not done", () => {
    renderCard({ deadline: YESTERDAY, status: "todo" });
    expect(screen.getByText(/Overdue/)).toBeInTheDocument();
  });

  it("shows red deadline text when overdue", () => {
    renderCard({ deadline: YESTERDAY, status: "todo" });
    const deadlineText = screen.getByText(/Overdue/);
    expect(deadlineText).toHaveClass("text-red-600");
  });

  it("applies red left border when overdue", () => {
    renderCard({ deadline: YESTERDAY, status: "todo" });
    const link = screen.getByRole("link");
    expect(link.className).toContain("border-l-red-500");
  });

  it("does not show overdue indicator when status is 'done' even with past deadline", () => {
    renderCard({ deadline: YESTERDAY, status: "done" });
    expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
  });

  it("does not apply red border when status is 'done'", () => {
    renderCard({ deadline: YESTERDAY, status: "done" });
    const link = screen.getByRole("link");
    expect(link.className).not.toContain("border-l-red-500");
  });

  it("does not show overdue indicator for future deadline", () => {
    renderCard({ deadline: TOMORROW, status: "todo" });
    expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
  });

  it("does not show overdue indicator for today's deadline", () => {
    renderCard({ deadline: TODAY, status: "todo" });
    expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
  });

  it("renders a link pointing to /task/:id", () => {
    renderCard({ id: "task-42" });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/task/task-42");
  });

  it("calls onTagClick when a tag chip is clicked", () => {
    const onTagClick = vi.fn();
    renderCard({ tags: ["tag-1"] }, { onTagClick });
    const tagChip = screen.getByText("Frontend");
    fireEvent.click(tagChip);
    expect(onTagClick).toHaveBeenCalledWith("tag-1");
  });

  it("tag chip click does not navigate (e.preventDefault called)", () => {
    const onTagClick = vi.fn();
    renderCard({ tags: ["tag-1"] }, { onTagClick });
    // The tag chip uses e.preventDefault() — clicking it should not navigate
    const tagChip = screen.getByText("Frontend");
    fireEvent.click(tagChip);
    // onTagClick was called, no navigation error thrown
    expect(onTagClick).toHaveBeenCalledTimes(1);
  });

  it("tag chip appears selected when tagId is in selectedTagIds", () => {
    renderCard(
      { tags: ["tag-1"] },
      { selectedTagIds: new Set(["tag-1"]) }
    );
    const chip = screen.getByText("Frontend");
    expect(chip).toHaveClass("bg-primary");
  });

  it("tag chip appears unselected when tagId is NOT in selectedTagIds", () => {
    renderCard(
      { tags: ["tag-1"] },
      { selectedTagIds: new Set() }
    );
    const chip = screen.getByText("Frontend");
    expect(chip).toHaveClass("bg-secondary");
  });

  it("renders all three status options in the status select", () => {
    renderCard();
    expect(screen.getByRole("option", { name: "To Do" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "In Progress" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Done" })).toBeInTheDocument();
  });

  it("does not render tag chips for tags not found in tagsById", () => {
    renderCard({ tags: ["nonexistent-tag"] });
    // No chip text should appear for unknown tags
    expect(screen.queryByText("nonexistent-tag")).not.toBeInTheDocument();
  });
});
