import { useSearchParams } from "react-router-dom";
import type { TaskStatus, TaskPriority } from "@task-app/shared";
import { STATUS_LABEL, PRIORITY_LABEL } from "../../lib/taskConstants";

export default function FilterPanel() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") ?? "";
  const statusFilter = searchParams.get("status") as TaskStatus | null;
  const priorityFilter = searchParams.get("priority") as TaskPriority | null;
  const sortParam = searchParams.get("sort") ?? "createdAt_desc";

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => updateParam("search", e.target.value)}
        placeholder="Search tasks…"
        className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground ml-2">Filter:</span>
        <select
          value={statusFilter ?? ""}
          onChange={(e) => updateParam("status", e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter ?? ""}
          onChange={(e) => updateParam("priority", e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
        >
          <option value="">All priorities</option>
          {(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground ml-2">Sort by:</span>
        <select
          value={sortParam}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
        >
          <option value="createdAt_desc">Created: newest first</option>
          <option value="createdAt_asc">Created: oldest first</option>
          <option value="deadline_asc">Deadline: soonest first</option>
          <option value="deadline_desc">Deadline: latest first</option>
        </select>
      </div>
    </div>
  );
}
