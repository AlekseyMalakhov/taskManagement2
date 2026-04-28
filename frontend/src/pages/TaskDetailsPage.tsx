import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Pencil, Trash2 } from "lucide-react";
import {
  useGetTaskQuery,
  useGetTagsQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../store/api";
import type { Tag, TaskStatus } from "@task-app/shared";
import {
  STATUS_LABEL,
  STATUS_CLASS,
  PRIORITY_LABEL,
  PRIORITY_CLASS,
  isOverdue,
} from "../lib/taskConstants";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import EditTaskForm from "../components/EditTaskForm";

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, isError } = useGetTaskQuery(id!);
  const { data: tags } = useGetTagsQuery();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  async function handleDelete() {
    await deleteTask(id!);
    navigate("/");
  }

  const tagsById = useMemo(() => {
    const map = new Map<string, Tag>();
    tags?.forEach((tag) => map.set(tag.id, tag));
    return map;
  }, [tags]);

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

      {task &&
        (() => {
          const overdue = isOverdue(task.deadline, task.status);
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
                  <h1 className="text-2xl font-bold leading-snug">
                    {task.title}
                  </h1>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <div className="relative flex items-center">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTask({
                            id: task.id,
                            body: { status: e.target.value as TaskStatus },
                          })
                        }
                        disabled={isUpdating}
                        className={`appearance-none cursor-pointer rounded-md border py-1 pl-3 pr-7 text-sm font-medium outline-none transition-shadow hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${STATUS_CLASS[task.status]}`}
                      >
                        {(Object.keys(STATUS_LABEL) as TaskStatus[]).map(
                          (s) => (
                            <option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </option>
                          ),
                        )}
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

                {task.description && (
                  <p className="mt-4 text-muted-foreground whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}

                <div className="mt-6 grid gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-24 shrink-0 font-medium">Deadline</span>
                    <span className={overdue ? "font-medium text-red-600" : ""}>
                      {task.deadline}
                      {overdue && " · Overdue"}
                    </span>
                  </div>

                  {taskTags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-24 shrink-0 font-medium">Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {taskTags.map((tag) => (
                          <span
                            key={tag.id}
                            className="rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-24 shrink-0 font-medium text-foreground">
                      Created
                    </span>
                    {new Date(task.createdAt).toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-24 shrink-0 font-medium text-foreground">
                      Updated
                    </span>
                    {new Date(task.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive px-3 py-1 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>

              <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <EditTaskForm
                    task={task}
                    tags={tags ?? []}
                    onSuccess={() => setShowEditModal(false)}
                  />
                </DialogContent>
              </Dialog>
            </>
          );
        })()}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Delete task?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone. The task will be permanently
              deleted.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
