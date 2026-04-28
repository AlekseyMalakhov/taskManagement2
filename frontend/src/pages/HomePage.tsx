import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetTagsQuery } from "../store/api";
import type { Tag } from "@task-app/shared";
import CreateTaskDialog from "../components/CreateTaskDialog";
import FilterPanel from "../components/FilterPanel";
import SelectedTagsPanel from "../components/SelectedTagsPanel";
import TasksList from "../components/TasksList";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTagIds = useMemo(
    () => new Set(searchParams.getAll("tag")),
    [searchParams],
  );
  const { data: tags } = useGetTagsQuery();

  function handleTagClick(tagId: string) {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll("tag");
    next.delete("tag");
    const updated = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    updated.forEach((id) => next.append("tag", id));
    next.delete("page");
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

      <TasksList
        tagsById={tagsById}
        selectedTagIds={selectedTagIds}
        onTagClick={handleTagClick}
      />
    </div>
  );
}
