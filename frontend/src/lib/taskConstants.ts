import type { TaskStatus, TaskPriority } from "@task-app/shared";

export function isOverdue(deadline: string, status: TaskStatus): boolean {
  if (status === "done") return false;
  return deadline < new Date().toISOString().slice(0, 10);
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

export const STATUS_CLASS: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700",
  inProgress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_CLASS: Record<TaskPriority, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "To Do" },
  { value: "inProgress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
