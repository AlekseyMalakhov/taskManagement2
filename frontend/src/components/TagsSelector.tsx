import { Checkbox } from "radix-ui"
import type { Tag } from "@task-app/shared"

interface Props {
  tags: Tag[]
  selectedTagIds: string[]
  onToggle: (tagId: string, checked: boolean) => void
  error?: string
}

export default function TagsSelector({ tags, selectedTagIds, onToggle, error }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Tags</p>
      <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border p-3">
        {tags.length ? (
          tags.map((tag) => (
            <label key={tag.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox.Root
                checked={selectedTagIds.includes(tag.id)}
                onCheckedChange={(value) => onToggle(tag.id, value === true)}
                className="size-4 rounded border bg-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              >
                <Checkbox.Indicator className="flex items-center justify-center text-xs">
                  ✓
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span>{tag.name}</span>
            </label>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">No tags available.</p>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
