import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetTaskQuery,
  useGetTagsQuery,
  usePatchTaskStatusMutation,
} from "@/store/api";
import TaskDetailsBody from "@/components/TaskDetails/TaskDetailsBody";
import TaskDetailsFooter from "@/components/TaskDetails/TaskDetailsFooter";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const { data: task, isLoading, isError } = useGetTaskQuery(id ?? skipToken);
  const { data: tags } = useGetTagsQuery();
  const [patchTaskStatus, { isLoading: isUpdating, isError: isPatchError }] =
    usePatchTaskStatusMutation();

  if (!id) return null;

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to tasks
      </Link>

      {isLoading && <p className="text-muted-foreground">Loading task…</p>}
      {isError && <p className="text-destructive">Failed to load task.</p>}

      {task && (
        <>
          <TaskDetailsBody
            task={task}
            tags={tags ?? []}
            isUpdating={isUpdating}
            isPatchError={isPatchError}
            patchTaskStatus={patchTaskStatus}
          />

          <TaskDetailsFooter task={task} tags={tags ?? []} id={id} />
        </>
      )}
    </div>
  );
}
