import { Router } from "express";
import type { Request, Response } from "express";
import type { Tag } from "@task-app/shared";
import { tags } from "../store";
import { createTagSchema } from "../validation";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ data: tags });
});

router.post("/", (req: Request, res: Response) => {
  const parsed = createTagSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }
  const { name } = parsed.data;
  if (tags.find((t) => t.name.toLowerCase() === name.toLowerCase())) {
    res.status(400).json({ error: "A tag with this name already exists" });
    return;
  }
  const tag: Tag = { id: crypto.randomUUID(), name };
  tags.push(tag);
  res.status(201).json({ data: tag });
});

export default router;
