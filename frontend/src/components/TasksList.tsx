import type { Tag } from "@task-app/shared";
import { useFilteredTasks } from "../hooks/useFilteredTasks";
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
  const { filteredTasks, isLoading, isError } = useFilteredTasks();

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
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          tagsById={tagsById}
          onTagClick={onTagClick}
          selectedTagIds={selectedTagIds}
        />
      ))}
    </div>
  );
}
