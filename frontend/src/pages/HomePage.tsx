import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useGetTasksQuery, useGetTagsQuery } from "../store/api";
import TaskCard from "../components/TaskCard";
import type { Tag, TaskStatus, TaskPriority } from "@task-app/shared";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import CreateTaskForm from "../components/CreateTaskForm";
import FilterPanel from "../components/FilterPanel";
import SelectedTagsPanel from "../components/SelectedTagsPanel";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTagIds = useMemo(
    () => new Set(searchParams.getAll("tag")),
    [searchParams],
  );
  const statusFilter = searchParams.get("status") as TaskStatus | null;
  const priorityFilter = searchParams.get("priority") as TaskPriority | null;
  const searchQuery = searchParams.get("search") ?? "";
  const sortParam = searchParams.get("sort") ?? "createdAt_desc";

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery();
  const { data: tags } = useGetTagsQuery();
  const [open, setOpen] = useState(false);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function handleTagClick(tagId: string) {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll("tag");
    next.delete("tag");
    const updated = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    updated.forEach((id) => next.append("tag", id));
    setSearchParams(next, { replace: true });
  }

  const tagsById = useMemo(() => {
    const map = new Map<string, Tag>();
    tags?.forEach((tag) => map.set(tag.id, tag));
    return map;
  }, [tags]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return tasks;
    const q = searchQuery.toLowerCase();
    const filtered = tasks.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (
        selectedTagIds.size > 0 &&
        ![...selectedTagIds].every((id) => t.tags.includes(id))
      )
        return false;
      if (q && !t.title.toLowerCase().includes(q)) return false;
      return true;
    });
    if (!sortParam) return filtered;
    return [...filtered].sort((a, b) => {
      if (sortParam === "createdAt_asc")
        return a.createdAt.localeCompare(b.createdAt);
      if (sortParam === "createdAt_desc")
        return b.createdAt.localeCompare(a.createdAt);
      if (sortParam === "deadline_asc")
        return a.deadline.localeCompare(b.deadline);
      if (sortParam === "deadline_desc")
        return b.deadline.localeCompare(a.deadline);
      return 0;
    });
  }, [
    tasks,
    statusFilter,
    priorityFilter,
    selectedTagIds,
    searchQuery,
    sortParam,
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Task</DialogTitle>
            </DialogHeader>
            <CreateTaskForm
              tags={tags ?? []}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <FilterPanel
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        sortParam={sortParam}
        onParamChange={updateParam}
      />

      <SelectedTagsPanel
        selectedTagIds={selectedTagIds}
        tagsById={tagsById}
        onTagClick={handleTagClick}
      />

      {tasksLoading && <p className="text-muted-foreground">Loading tasks…</p>}
      {tasksError && (
        <p className="text-destructive">
          Failed to load tasks. Is the backend running?
        </p>
      )}
      {!tasksLoading && !tasksError && !filteredTasks?.length && (
        <p className="text-muted-foreground">No tasks yet.</p>
      )}
      {filteredTasks?.length ? (
        <div className="grid gap-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              tagsById={tagsById}
              onTagClick={handleTagClick}
              selectedTagIds={selectedTagIds}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
