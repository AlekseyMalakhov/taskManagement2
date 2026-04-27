import { Router } from "express";
import type { Request, Response } from "express";
import type { Task } from "@task-app/shared";
import { tasks, tags } from "../store";
import { createTaskSchema, updateTaskSchema } from "../validation";

const router = Router();
const formatDateOnly = (date: Date) => date.toISOString().slice(0, 10);

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
    deadline: formatDateOnly(dto.deadline),
    tags: dto.tagIds,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  res.status(201).json({ data: task });
});

router.patch("/:id", (req: Request, res: Response) => {
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
  if (dto.tagIds) {
    const unknownTags = dto.tagIds.filter((id) => !tags.find((t) => t.id === id));
    if (unknownTags.length > 0) {
      res.status(400).json({ error: `Unknown tag IDs: ${unknownTags.join(", ")}` });
      return;
    }
  }
  const existing = tasks[idx];
  tasks[idx] = {
    ...existing,
    ...(dto.title !== undefined && { title: dto.title }),
    ...(dto.description !== undefined && { description: dto.description }),
    ...(dto.status !== undefined && { status: dto.status }),
    ...(dto.priority !== undefined && { priority: dto.priority }),
    ...(dto.deadline !== undefined && { deadline: formatDateOnly(dto.deadline) }),
    ...(dto.tagIds !== undefined && { tags: dto.tagIds }),
    updatedAt: new Date().toISOString(),
  };
  res.json({ data: tasks[idx] });
});

export default router;
