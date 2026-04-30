import { useState } from "react";
import { Plus } from "lucide-react";
import type { Task } from "@task-app/shared";
import {
  useGetTagsQuery,
  useCreateTagMutation,
  usePatchTaskTagsMutation,
} from "@/store/api";

interface Props {
  task: Task;
}

export default function TagSelectorPopup({ task }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: allTags = [] } = useGetTagsQuery();
  const [createTag, { isError: createError, reset: resetCreate }] =
    useCreateTagMutation();
  const [patchTaskTags, { isError: patchError, reset: resetPatch }] =
    usePatchTaskTagsMutation();

  const filtered = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  );
  const exactMatch = allTags.some(
    (tag) => tag.name.toLowerCase() === search.trim().toLowerCase(),
  );

  function close() {
    setIsOpen(false);
    setSearch("");
  }

  function toggle(e: React.MouseEvent, tagId: string) {
    e.preventDefault();
    e.stopPropagation();
    resetPatch();
    const next = new Set(task.tags);
    if (next.has(tagId)) next.delete(tagId);
    else next.add(tagId);
    if (next.size === 0) return;
    patchTaskTags({ id: task.id, tagIds: [...next] });
  }

  function handleCreate(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const name = search.trim();
    if (!name) return;
    createTag({ name })
      .unwrap()
      .then((newTag) => {
        patchTaskTags({ id: task.id, tagIds: [...task.tags, newTag.id] });
        setSearch("");
      })
      .catch(console.error);
  }

  function stopAll(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className="relative" onClick={stopAll}>
      <button
        onClick={(e) => {
          stopAll(e);
          setIsOpen((v) => !v);
        }}
        title="Add tag"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/70"
      >
        <Plus className="h-3 w-3" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              close();
            }}
          />
          <div className="absolute bottom-full left-0 z-50 mb-1.5 w-52 rounded-lg border bg-popover p-2 shadow-md">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => {
                resetCreate();
                resetPatch();
                setSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim() && !exactMatch)
                  handleCreate(e as unknown as React.MouseEvent);
                if (e.key === "Escape") close();
              }}
              placeholder="Search or create…"
              className="mb-2 w-full rounded border px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
            />
            <div className="max-h-36 space-y-0.5 overflow-y-auto">
              {filtered.map((tag) => {
                const selected = task.tags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={(e) => toggle(e, tag.id)}
                    className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs transition-colors hover:bg-secondary"
                  >
                    <span
                      className={[
                        "h-2.5 w-2.5 flex-shrink-0 rounded-full border",
                        selected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/40 bg-transparent",
                      ].join(" ")}
                    />
                    <span className={selected ? "font-medium" : ""}>
                      {tag.name}
                    </span>
                  </button>
                );
              })}

              {search.trim() && !exactMatch && (
                <button
                  onClick={handleCreate}
                  className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <Plus className="h-3 w-3 flex-shrink-0" />
                  Create &ldquo;{search.trim()}&rdquo;
                </button>
              )}

              {filtered.length === 0 && !search.trim() && (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  No tags yet
                </p>
              )}
            </div>
            {(createError || patchError) && (
              <p className="mt-1.5 px-1 text-xs text-destructive">
                {createError
                  ? "Failed to create tag."
                  : "Failed to update tags."}{" "}
                Please try again.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
