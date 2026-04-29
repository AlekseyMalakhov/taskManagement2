import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetTasksQuery } from "@/store/api";
import type { TaskStatus, TaskPriority } from "@task-app/shared";

export const PAGE_SIZE = 10;

export function useFilteredTasks() {
  const [searchParams] = useSearchParams();
  const { data: tasks, isLoading, isError } = useGetTasksQuery();

  const selectedTagIds = useMemo(
    () => new Set(searchParams.getAll("tag")),
    [searchParams],
  );
  const statusFilter = searchParams.get("status") as TaskStatus | null;
  const priorityFilter = searchParams.get("priority") as TaskPriority | null;
  const searchQuery = searchParams.get("search") ?? "";
  const sortParam = searchParams.get("sort") ?? "createdAt_desc";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);

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

  const totalPages = Math.max(
    1,
    Math.ceil((filteredTasks?.length ?? 0) / PAGE_SIZE),
  );
  const page = Math.min(
    Math.max(1, isNaN(pageParam) ? 1 : pageParam),
    totalPages,
  );
  const paginatedTasks = filteredTasks?.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return {
    filteredTasks,
    paginatedTasks,
    page,
    totalPages,
    isLoading,
    isError,
  };
}
