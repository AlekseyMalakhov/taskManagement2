import type { TaskStatus, TaskPriority } from "@task-app/shared";
import { STATUS_LABEL, PRIORITY_LABEL } from "../lib/taskConstants";

interface FilterPanelProps {
  searchQuery: string;
  statusFilter: TaskStatus | null;
  priorityFilter: TaskPriority | null;
  sortParam: string;
  onParamChange: (key: string, value: string) => void;
}

export default function FilterPanel({
  searchQuery,
  statusFilter,
  priorityFilter,
  sortParam,
  onParamChange,
}: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onParamChange("search", e.target.value)}
        placeholder="Search tasks…"
        className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground ml-2">Filter:</span>
        <select
          value={statusFilter ?? ""}
          onChange={(e) => onParamChange("status", e.target.value)}
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
          onChange={(e) => onParamChange("priority", e.target.value)}
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
          onChange={(e) => onParamChange("sort", e.target.value)}
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
