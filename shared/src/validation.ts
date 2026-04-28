import { z } from "zod";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const deadlineSchema = z
  .string()
  .min(1, "Deadline is required")
  .regex(dateOnlyRegex, "Must be a valid date (YYYY-MM-DD)")
  .refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(val) >= today;
  }, "Deadline must be today or in the future");

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "inProgress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  deadline: deadlineSchema,
  tagIds: z.array(z.string()),
});

export const updateTaskSchema = createTaskSchema.partial();

export const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});
