import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetTasksQuery } from "@/store/api";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/lib/taskConstants";

const VALID_STATUSES = new Set<string>(STATUS_OPTIONS.map((o) => o.value));
const VALID_PRIORITIES = new Set<string>(PRIORITY_OPTIONS.map((o) => o.value));
const VALID_SORTS = new Set([
  "createdAt_desc",
  "createdAt_asc",
  "deadline_asc",
  "deadline_desc",
]);

export const PAGE_SIZE = 10;

export function useFilteredTasks() {
  const [searchParams] = useSearchParams();
  const { data: tasks, isLoading, isError } = useGetTasksQuery();

  const selectedTagIds = useMemo(
    () => new Set(searchParams.getAll("tag")),
    [searchParams],
  );
  const rawStatus = searchParams.get("status");
  const statusFilter = rawStatus && VALID_STATUSES.has(rawStatus) ? rawStatus : null;

  const rawPriority = searchParams.get("priority");
  const priorityFilter = rawPriority && VALID_PRIORITIES.has(rawPriority) ? rawPriority : null;

  const searchQuery = searchParams.get("search") ?? "";

  const rawSort = searchParams.get("sort");
  const sortParam = rawSort && VALID_SORTS.has(rawSort) ? rawSort : "createdAt_desc";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);

  const filteredTasks = useMemo(() => {
    if (!tasks) return;
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
