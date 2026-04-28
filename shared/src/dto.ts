import type { TaskStatus, TaskPriority } from "./types";

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  tagIds: string[];
}

export interface PatchTaskStatusDto {
  status: TaskStatus;
}

export interface CreateTagDto {
  name: string;
}
