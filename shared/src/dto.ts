import type { TaskStatus, TaskPriority } from "./types";

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  tagIds: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  deadline?: string;
  tagIds?: string[];
}

export interface CreateTagDto {
  name: string;
}
