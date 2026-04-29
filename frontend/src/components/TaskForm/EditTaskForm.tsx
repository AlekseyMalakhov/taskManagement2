import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import type { Tag, Task } from "@task-app/shared";
import { createTaskSchema } from "@task-app/shared";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useUpdateTaskMutation } from "@/store/api";
import TagsSelector from "./TagsSelector";
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import StatusSelect from "./StatusSelect";
import PriorityRadioGroup from "./PriorityRadioGroup";
import DeadlineInput from "./DeadlineInput";

type FormValues = z.infer<typeof createTaskSchema>;

interface Props {
  task: Task;
  tags: Tag[];
  onSuccess: () => void;
}

export default function EditTaskForm({ task, tags, onSuccess }: Props) {
  const [updateTask, { isLoading, isError }] = useUpdateTaskMutation();
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
  });

  const selectedTagIds = useWatch({
    control,
    name: "tagIds",
  });

  async function onSubmit(values: FormValues) {
    await updateTask({ id: task.id, body: values }).unwrap();
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <TitleInput error={errors.title?.message} {...register("title")} />
      <DescriptionInput {...register("description")} />
      <StatusSelect {...register("status")} />
      <PriorityRadioGroup
        defaultValue={task.priority}
        onValueChange={(value) =>
          setValue("priority", value as FormValues["priority"], {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      />
      <DeadlineInput
        error={errors.deadline?.message}
        {...register("deadline")}
      />
      <TagsSelector
        tags={tags}
        selectedTagIds={selectedTagIds}
        onToggle={(next) =>
          setValue("tagIds", next, { shouldDirty: true, shouldValidate: true })
        }
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
  );
}
