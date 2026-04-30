import { z } from "zod";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const deadlineSchema = z
  .string()
  .min(1, "Deadline is required")
  .regex(dateOnlyRegex, "Must be a valid date (YYYY-MM-DD)")
  .refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(`${val}T00:00:00`) >= today;
  }, "Deadline must be today or in the future");

const updateDeadlineSchema = z
  .string()
  .min(1, "Deadline is required")
  .regex(dateOnlyRegex, "Must be a valid date (YYYY-MM-DD)");

export const createTaskSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional(),
  status: z.enum(["todo", "inProgress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  deadline: deadlineSchema,
  tagIds: z.array(z.string()).min(1, "At least one tag is required"),
});

export const updateTaskSchema = createTaskSchema.extend({
  deadline: updateDeadlineSchema,
});

export const patchTaskStatusSchema = z.object({
  status: z.enum(["todo", "inProgress", "done"]),
});

export const patchTaskTagsSchema = z.object({
  tagIds: z.array(z.string()).min(1, "At least one tag is required"),
});

export const createTagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required"),
});
