import type { Tag } from "@task-app/shared";

interface Props {
  selectedTagIds: Set<string>;
  tagsById: Map<string, Tag>;
  onTagClick: (tagId: string) => void;
}

export default function SelectedTagsPanel({
  selectedTagIds,
  tagsById,
  onTagClick,
}: Props) {
  if (selectedTagIds.size === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">Filtered by:</span>
      {[...selectedTagIds].map((tagId) => (
        <button
          key={tagId}
          onClick={() => onTagClick(tagId)}
          className="flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-medium hover:bg-primary/80"
        >
          {tagsById.get(tagId)?.name ?? tagId}
          <span aria-hidden>×</span>
        </button>
      ))}
    </div>
  );
}
