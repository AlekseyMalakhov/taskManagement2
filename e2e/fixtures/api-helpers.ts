import type { APIRequestContext } from "@playwright/test";

const API_BASE = "http://localhost:3000";

export interface Tag {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  deadline: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: "todo" | "inProgress" | "done";
  priority: "low" | "medium" | "high";
  deadline: string;
  tagIds: string[];
}

export async function getAllTags(request: APIRequestContext): Promise<Tag[]> {
  const res = await request.get(`${API_BASE}/tags`);
  const body = await res.json();
  return body.data as Tag[];
}

/**
 * Create a tag or return the existing tag if one with the same name already
 * exists. Tags cannot be deleted via the API so this gracefully handles
 * repeated test runs against the same running backend.
 */
export async function createTag(
  request: APIRequestContext,
  name: string,
): Promise<Tag> {
  const res = await request.post(`${API_BASE}/tags`, { data: { name } });
  const body = await res.json();
  if (res.ok()) return body.data as Tag;

  // 400 duplicate — find and return the existing tag
  if (res.status() === 400) {
    const allTags = await getAllTags(request);
    const existing = allTags.find(
      (t) => t.name.toLowerCase() === name.toLowerCase(),
    );
    if (existing) return existing;
  }

  throw new Error(`Failed to create tag "${name}": ${JSON.stringify(body)}`);
}

export async function createTask(
  request: APIRequestContext,
  data: CreateTaskInput,
): Promise<Task> {
  const res = await request.post(`${API_BASE}/tasks`, { data });
  const body = await res.json();
  if (!res.ok()) {
    throw new Error(
      `Failed to create task "${data.title}": ${JSON.stringify(body)}`,
    );
  }
  return body.data as Task;
}

export async function deleteTask(
  request: APIRequestContext,
  id: string,
): Promise<void> {
  await request.delete(`${API_BASE}/tasks/${id}`);
}

export async function getAllTasks(request: APIRequestContext): Promise<Task[]> {
  const res = await request.get(`${API_BASE}/tasks`);
  const body = await res.json();
  return body.data as Task[];
}

export async function cleanupAllTasks(
  request: APIRequestContext,
): Promise<void> {
  const tasks = await getAllTasks(request);
  await Promise.all(tasks.map((t) => deleteTask(request, t.id)));
}
