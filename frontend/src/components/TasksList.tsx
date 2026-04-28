import type { Tag } from "@task-app/shared";
import { useFilteredTasks } from "../hooks/useFilteredTasks";
import Pagination from "./Pagination";
import TaskCard from "./TaskCard";

interface Props {
  tagsById: Map<string, Tag>;
  selectedTagIds: Set<string>;
  onTagClick: (tagId: string) => void;
}

export default function TasksList({
  tagsById,
  selectedTagIds,
  onTagClick,
}: Props) {
  const { filteredTasks, paginatedTasks, page, totalPages, isLoading, isError } =
    useFilteredTasks();

  if (isLoading) return <p className="text-muted-foreground">Loading tasks…</p>;
  if (isError)
    return (
      <p className="text-destructive">
        Failed to load tasks. Is the backend running?
      </p>
    );
  if (!filteredTasks?.length)
    return <p className="text-muted-foreground">No tasks yet.</p>;

  return (
    <div className="grid gap-3">
      {paginatedTasks!.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          tagsById={tagsById}
          onTagClick={onTagClick}
          selectedTagIds={selectedTagIds}
        />
      ))}

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
