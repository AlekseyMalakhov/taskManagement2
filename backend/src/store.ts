import type { Task, Tag } from "@task-app/shared";

export const tags: Tag[] = [
  { id: "tag-1", name: "work" },
  { id: "tag-2", name: "personal" },
  { id: "tag-3", name: "urgent" },
  { id: "tag-4", name: "learning" },
];

const now = new Date().toISOString();

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Set up CI pipeline",
    description: "Configure GitHub Actions for automated testing and deployment",
    status: "inProgress",
    priority: "high",
    deadline: "2026-05-01",
    tags: ["tag-1", "tag-3"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-2",
    title: "Read TypeScript handbook",
    status: "todo",
    priority: "medium",
    deadline: "2026-05-15",
    tags: ["tag-4"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-3",
    title: "Grocery shopping",
    description: "Milk, bread, vegetables",
    status: "done",
    priority: "low",
    deadline: "2026-04-20",
    tags: ["tag-2"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-4",
    title: "Fix critical production bug",
    description: "Users cannot log in on Safari",
    status: "todo",
    priority: "high",
    deadline: "2026-04-25",
    tags: ["tag-1", "tag-3"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "task-5",
    title: "Write unit tests",
    description: "Add tests for the authentication module",
    status: "todo",
    priority: "medium",
    deadline: "2026-05-10",
    tags: ["tag-1", "tag-4"],
    createdAt: now,
    updatedAt: now,
  },
];
