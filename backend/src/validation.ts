import { z } from "zod";

const statusSchema = z.enum(["todo", "inProgress", "done"]);
const prioritySchema = z.enum(["low", "medium", "high"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: statusSchema,
  priority: prioritySchema,
  deadline: z.date("Must be a valid date (YYYY-MM-DD)"),
  tagIds: z.array(z.string()),
});

export const updateTaskSchema = createTaskSchema.partial();

export const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});
