import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import type { Tag, Task } from "@task-app/shared"
import { createTaskSchema } from "@task-app/shared"

import { Button } from "./ui/button"
import { DialogClose, DialogFooter } from "./ui/dialog"
import { Field, FieldContent, FieldLabel, FieldTitle } from "./ui/field"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { useUpdateTaskMutation } from "../store/api"
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../lib/taskConstants"
import TagsSelector from "./TagsSelector"
import TitleInput from "./TitleInput"
import DescriptionInput from "./DescriptionInput"

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
      <TitleInput id="edit-title" error={errors.title?.message} {...register("title")} />

      <DescriptionInput id="edit-description" {...register("description")} />

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

      <div className="space-y-2">
        <p className="text-sm font-medium">Priority</p>
        <RadioGroup
          defaultValue={task.priority}
          onValueChange={(value) => setValue("priority", value as FormValues["priority"], { shouldDirty: true, shouldValidate: true })}
          className="flex gap-2"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <FieldLabel key={option.value} htmlFor={`edit-priority-${option.value}`} className="flex-1">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{option.label}</FieldTitle>
                </FieldContent>
                <RadioGroupItem value={option.value} id={`edit-priority-${option.value}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
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

      <TagsSelector
        tags={tags}
        selectedTagIds={selectedTagIds}
        onToggle={toggleTag}
        error={errors.tagIds?.message}
      />

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
