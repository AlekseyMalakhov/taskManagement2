import { Checkbox } from "radix-ui"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import type { Tag, Task } from "@task-app/shared"
import { createTaskSchema } from "@task-app/shared"

import { Button } from "./ui/button"
import { DialogClose, DialogFooter } from "./ui/dialog"
import { useUpdateTaskMutation } from "../store/api"
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../lib/taskConstants"

type FormValues = z.infer<typeof createTaskSchema>

interface Props {
  task: Task
  tags: Tag[]
  onSuccess: () => void
}

export default function EditTaskForm({ task, tags, onSuccess }: Props) {
  const [updateTask, { isLoading, isError }] = useUpdateTaskMutation()
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      deadline: task.deadline,
      tagIds: task.tags,
    },
  })

  const selectedTagIds = useWatch({
    control,
    name: "tagIds",
  })

  async function onSubmit(values: FormValues) {
    await updateTask({ id: task.id, body: values }).unwrap()
    onSuccess()
  }

  function toggleTag(tagId: string, checked: boolean) {
    const next = checked
      ? [...selectedTagIds, tagId]
      : selectedTagIds.filter((id) => id !== tagId)
    setValue("tagIds", next, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-1">
        <label htmlFor="edit-title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="edit-title"
          type="text"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
          {...register("title")}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="edit-description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="edit-description"
          className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
          {...register("description")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="edit-status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="edit-status"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
            {...register("status")}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="edit-priority" className="text-sm font-medium">
            Priority
          </label>
          <select
            id="edit-priority"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
            {...register("priority")}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="edit-deadline" className="text-sm font-medium">
          Deadline
        </label>
        <input
          id="edit-deadline"
          type="date"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/50"
          {...register("deadline")}
        />
        {errors.deadline && <p className="text-xs text-destructive">{errors.deadline.message}</p>}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Tags</p>
        <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border p-3">
          {tags.length ? (
            tags.map((tag) => {
              const checked = selectedTagIds.includes(tag.id)
              return (
                <label key={tag.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox.Root
                    checked={checked}
                    onCheckedChange={(value) => toggleTag(tag.id, value === true)}
                    className="size-4 rounded border bg-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  >
                    <Checkbox.Indicator className="flex items-center justify-center text-xs">
                      ✓
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span>{tag.name}</span>
                </label>
              )
            })
          ) : (
            <p className="text-xs text-muted-foreground">No tags available.</p>
          )}
        </div>
        {errors.tagIds && <p className="text-xs text-destructive">{errors.tagIds.message}</p>}
      </div>

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Failed to update task. Please try again.
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isLoading}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}
