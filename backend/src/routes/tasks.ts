import { Router } from "express";
import type { Request, Response } from "express";
import type { Task } from "@task-app/shared";
import { tasks, tags } from "../store";
import { createTaskSchema, updateTaskSchema, patchTaskStatusSchema } from "@task-app/shared";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const { tag } = req.query;
  const result = typeof tag === "string" && tag
    ? tasks.filter((t) => t.tags.includes(tag))
    : tasks;
  res.json({ data: result });
});

router.get("/:id", (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json({ data: task });
});

router.post("/", (req: Request, res: Response) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }
  const dto = parsed.data;
  const unknownTags = dto.tagIds.filter((id) => !tags.find((t) => t.id === id));
  if (unknownTags.length > 0) {
    res.status(400).json({ error: `Unknown tag IDs: ${unknownTags.join(", ")}` });
    return;
  }
  const now = new Date().toISOString();
  const task: Task = {
    id: crypto.randomUUID(),
    title: dto.title,
    description: dto.description,
    status: dto.status,
    priority: dto.priority,
    deadline: dto.deadline,
    tags: dto.tagIds,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  res.status(201).json({ data: task });
});

router.put("/:id", (req: Request, res: Response) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }
  const dto = parsed.data;
  const unknownTags = dto.tagIds.filter((id) => !tags.find((t) => t.id === id));
  if (unknownTags.length > 0) {
    res.status(400).json({ error: `Unknown tag IDs: ${unknownTags.join(", ")}` });
    return;
  }
  const existing = tasks[idx];
  tasks[idx] = {
    id: existing.id,
    createdAt: existing.createdAt,
    title: dto.title,
    description: dto.description,
    status: dto.status,
    priority: dto.priority,
    deadline: dto.deadline,
    tags: dto.tagIds,
    updatedAt: new Date().toISOString(),
  };
  res.json({ data: tasks[idx] });
});

router.patch("/:id/status", (req: Request, res: Response) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  const parsed = patchTaskStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }
  tasks[idx] = { ...tasks[idx], status: parsed.data.status, updatedAt: new Date().toISOString() };
  res.json({ data: tasks[idx] });
});

router.delete("/:id", (req: Request, res: Response) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  tasks.splice(idx, 1);
  res.status(204).send();
});

export default router;
