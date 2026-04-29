import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import type { Tag } from "@task-app/shared";
import { createTaskSchema } from "@task-app/shared";

import { Button } from "./ui/button";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { useCreateTaskMutation } from "../store/api";
import TagsSelector from "./TagsSelector";
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import StatusSelect from "./StatusSelect";
import PriorityRadioGroup from "./PriorityRadioGroup";
import DeadlineInput from "./DeadlineInput";

type FormValues = z.infer<typeof createTaskSchema>;

interface Props {
  tags: Tag[];
  onSuccess: () => void;
}

export default function CreateTaskForm({ tags, onSuccess }: Props) {
  const [createTask, { isLoading, isError }] = useCreateTaskMutation();
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
  });

  const selectedTagIds = useWatch({
    control,
    name: "tagIds",
  });

  async function onSubmit(values: FormValues) {
    await createTask(values).unwrap();
    reset();
    onSuccess();
  }

  function toggleTag(tagId: string, checked: boolean) {
    const next = checked
      ? [...selectedTagIds, tagId]
      : selectedTagIds.filter((id) => id !== tagId);

    setValue("tagIds", next, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <TitleInput
        id="title"
        error={errors.title?.message}
        {...register("title")}
      />
      <DescriptionInput id="description" {...register("description")} />
      <StatusSelect id="status" {...register("status")} />
      <PriorityRadioGroup
        defaultValue="medium"
        idPrefix="priority"
        onValueChange={(value) =>
          setValue("priority", value as FormValues["priority"], {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      />
      <DeadlineInput
        id="deadline"
        error={errors.deadline?.message}
        {...register("deadline")}
      />
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
  );
}
