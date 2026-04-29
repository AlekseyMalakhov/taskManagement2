import { ChevronDown } from "lucide-react";
import type { Tag, Task, TaskStatus } from "@task-app/shared";
import {
  STATUS_LABEL,
  STATUS_CLASS,
  PRIORITY_LABEL,
  PRIORITY_CLASS,
  isOverdue,
} from "../lib/taskConstants";
import TagSelectorPopup from "./TagSelectorPopup";

type Props = {
  task: Task;
  tags: Tag[];
  isUpdating: boolean;
  isPatchError: boolean;
  patchTaskStatus: (args: { id: string; status: TaskStatus }) => void;
};

export default function TaskDetailsBody({
  task,
  tags,
  isUpdating,
  isPatchError,
  patchTaskStatus,
}: Props) {
  const overdue = isOverdue(task.deadline, task.status);
  const tagsById = new Map(tags.map((tag) => [tag.id, tag]));
  const taskTags = task.tags
    .map((id) => tagsById.get(id))
    .filter(Boolean) as Tag[];

  return (
    <>
      <div
        className={[
          "rounded-lg border bg-card p-6 shadow-sm",
          overdue ? "border-l-4 border-l-red-500" : "",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-2xl font-bold leading-snug">{task.title}</h1>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <select
                  value={task.status}
                  onChange={(e) =>
                    patchTaskStatus({
                      id: task.id,
                      status: e.target.value as TaskStatus,
                    })
                  }
                  disabled={isUpdating}
                  className={`appearance-none cursor-pointer rounded-md border py-1 pl-3 pr-7 text-sm font-medium outline-none transition-shadow hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${STATUS_CLASS[task.status]}`}
                >
                  {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 size-3.5 opacity-50" />
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${PRIORITY_CLASS[task.priority]}`}
              >
                {PRIORITY_LABEL[task.priority]}
              </span>
            </div>
          </div>
        </div>

        {isPatchError && (
          <p className="mt-1 text-sm text-destructive">
            Failed to update status.
          </p>
        )}

        {task.description && (
          <p className="mt-4 text-muted-foreground whitespace-pre-wrap">
            {task.description}
          </p>
        )}

        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 font-medium">Deadline</span>
            <span className={overdue ? "font-medium text-red-600" : ""}>
              {task.deadline.split("-").reverse().join("/")}
              {overdue && " · Overdue"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 font-medium">Tags</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {taskTags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                >
                  {tag.name}
                </span>
              ))}
              <TagSelectorPopup task={task} />
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-24 shrink-0 font-medium text-foreground">
              Created
            </span>
            {new Date(task.createdAt).toLocaleString("en-GB")}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-24 shrink-0 font-medium text-foreground">
              Updated
            </span>
            {new Date(task.updatedAt).toLocaleString("en-GB")}
          </div>
        </div>
      </div>
    </>
  );
}
