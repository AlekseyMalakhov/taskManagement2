import type { Task, Tag } from "@task-app/shared";

export const tags: Tag[] = [
  { id: "work", name: "work" },
  { id: "personal", name: "personal" },
  { id: "urgent", name: "urgent" },
  { id: "learning", name: "learning" },
];

export const tasks: Task[] = [
  {
    id: "e4798ce3-922d-4779-aeb1-d332df9b2cab",
    title: "Set up CI pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment",
    status: "inProgress",
    priority: "high",
    deadline: "2026-05-01",
    tags: ["work", "urgent"],
    createdAt: "2026-01-15T09:23:00.000Z",
    updatedAt: "2026-01-15T09:23:00.000Z",
  },
  {
    id: "7b454e85-8dbb-46c1-afde-8c81a01f54c3",
    title: "Read TypeScript handbook",
    status: "todo",
    priority: "medium",
    deadline: "2026-05-15",
    tags: ["learning"],
    createdAt: "2026-02-03T14:05:00.000Z",
    updatedAt: "2026-02-03T14:05:00.000Z",
  },
  {
    id: "1dd7c949-7a1b-4a60-8329-46edc31adf0e",
    title: "Grocery shopping",
    description: "Milk, bread, vegetables",
    status: "done",
    priority: "low",
    deadline: "2026-04-20",
    tags: ["personal"],
    createdAt: "2026-02-28T08:00:00.000Z",
    updatedAt: "2026-02-28T08:00:00.000Z",
  },
  {
    id: "360fbe1b-e1f0-4e1e-80f1-b4750ab4ec4c",
    title: "Fix critical production bug",
    description: "Users cannot log in on Safari",
    status: "todo",
    priority: "high",
    deadline: "2026-04-25",
    tags: ["work", "urgent"],
    createdAt: "2026-03-20T11:47:00.000Z",
    updatedAt: "2026-03-20T11:47:00.000Z",
  },
  {
    id: "62a875fa-b5a6-4127-aae0-87a15a412f82",
    title: "Write unit tests",
    description: "Add tests for the authentication module",
    status: "todo",
    priority: "medium",
    deadline: "2026-05-10",
    tags: ["work", "urgent"],
    createdAt: "2026-04-07T16:30:00.000Z",
    updatedAt: "2026-04-07T16:30:00.000Z",
  },
];
