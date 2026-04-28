import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetTagsQuery } from "../store/api";
import { useFilteredTasks } from "../hooks/useFilteredTasks";
import TaskCard from "../components/TaskCard";
import type { Tag } from "@task-app/shared";
import CreateTaskDialog from "../components/CreateTaskDialog";
import FilterPanel from "../components/FilterPanel";
import SelectedTagsPanel from "../components/SelectedTagsPanel";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTagIds = useMemo(
    () => new Set(searchParams.getAll("tag")),
    [searchParams],
  );
  const { filteredTasks, isLoading, isError } = useFilteredTasks();
  const { data: tags } = useGetTagsQuery();

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <CreateTaskDialog tags={tags ?? []} />
      </div>

      <FilterPanel />

      <SelectedTagsPanel
        selectedTagIds={selectedTagIds}
        tagsById={tagsById}
        onTagClick={handleTagClick}
      />

      {isLoading && <p className="text-muted-foreground">Loading tasks…</p>}
      {isError && (
        <p className="text-destructive">
          Failed to load tasks. Is the backend running?
        </p>
      )}
      {!isLoading && !isError && !filteredTasks?.length && (
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
