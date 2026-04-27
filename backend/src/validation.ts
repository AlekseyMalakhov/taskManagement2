import { z } from "zod";

const statusSchema = z.enum(["todo", "inProgress", "done"]);
const prioritySchema = z.enum(["low", "medium", "high"]);
const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const deadlineSchema = z
  .string()
  .regex(dateOnlyRegex, "Must be a valid date (YYYY-MM-DD)")
  .transform((value, ctx) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
      ctx.issues.push({
        code: "custom",
        message: "Must be a valid date (YYYY-MM-DD)",
        input: value,
      });
      return z.NEVER;
    }
    return date;
  });

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: statusSchema,
  priority: prioritySchema,
  deadline: deadlineSchema,
  tagIds: z.array(z.string()),
});

export const updateTaskSchema = createTaskSchema.partial();

export const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});
