export type TaskStatus = "todo" | "inProgress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Tag {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string; // ISO 8601 date
  tags: string[]; // tag IDs
  createdAt: string;
  updatedAt: string;
}
