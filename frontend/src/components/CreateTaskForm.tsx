import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import type { Tag } from "@task-app/shared"
import { createTaskSchema } from "@task-app/shared"

import { Button } from "./ui/button"
import { DialogClose, DialogFooter } from "./ui/dialog"
import { Field, FieldContent, FieldLabel, FieldTitle } from "./ui/field"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { useCreateTaskMutation } from "../store/api"
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../lib/taskConstants"
import TagsSelector from "./TagsSelector"
import TitleInput from "./TitleInput"
import DescriptionInput from "./DescriptionInput"

type FormValues = z.infer<typeof createTaskSchema>

interface Props {
  tags: Tag[]
  onSuccess: () => void
}

export default function CreateTaskForm({ tags, onSuccess }: Props) {
  const [createTask, { isLoading, isError }] = useCreateTaskMutation()
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      deadline: "",
      tagIds: [],
    },
  })

  const selectedTagIds = useWatch({
    control,
    name: "tagIds",
  })

  async function onSubmit(values: FormValues) {
    await createTask(values).unwrap()
    reset()
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
      <TitleInput id="title" error={errors.title?.message} {...register("title")} />

      <DescriptionInput id="description" {...register("description")} />

      <div className="space-y-1">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
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
          defaultValue="medium"
          onValueChange={(value) => setValue("priority", value as FormValues["priority"], { shouldDirty: true, shouldValidate: true })}
          className="flex gap-2"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <FieldLabel key={option.value} htmlFor={`priority-${option.value}`} className="flex-1">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{option.label}</FieldTitle>
                </FieldContent>
                <RadioGroupItem value={option.value} id={`priority-${option.value}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-1">
        <label htmlFor="deadline" className="text-sm font-medium">
          Deadline
        </label>
        <input
          id="deadline"
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
          Failed to create task. Please try again.
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isLoading}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Task"}
        </Button>
      </DialogFooter>
    </form>
  )
}
