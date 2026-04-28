import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useGetTagsQuery, useCreateTagMutation, useUpdateTaskMutation } from '../store/api'

interface Props {
  taskId: string
  taskTagIds: string[]
}

export default function TagSelectorPopup({ taskId, taskTagIds }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: allTags = [] } = useGetTagsQuery()
  const [createTag] = useCreateTagMutation()
  const [updateTask] = useUpdateTaskMutation()

  useEffect(() => {
    if (!isOpen) return
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [isOpen])

  const filtered = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  )
  const exactMatch = allTags.some(
    (tag) => tag.name.toLowerCase() === search.trim().toLowerCase(),
  )

  function toggle(e: React.MouseEvent, tagId: string) {
    e.preventDefault()
    e.stopPropagation()
    const next = new Set(taskTagIds)
    if (next.has(tagId)) next.delete(tagId)
    else next.add(tagId)
    updateTask({ id: taskId, body: { tagIds: [...next] } })
  }

  async function handleCreate(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const name = search.trim()
    if (!name) return
    const newTag = await createTag({ name }).unwrap()
    updateTask({ id: taskId, body: { tagIds: [...taskTagIds, newTag.id] } })
    setSearch('')
  }

  function stopAll(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div ref={containerRef} className="relative" onClick={stopAll}>
      <button
        onClick={(e) => {
          stopAll(e)
          setIsOpen((v) => !v)
        }}
        title="Add tag"
        className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/70"
      >
        <Plus className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-1.5 w-52 rounded-lg border bg-popover p-2 shadow-md">
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim() && !exactMatch) handleCreate(e as unknown as React.MouseEvent)
              if (e.key === 'Escape') { setIsOpen(false); setSearch('') }
            }}
            placeholder="Search or create…"
            className="mb-2 w-full rounded border px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
            onClick={stopAll}
          />
          <div className="max-h-36 space-y-0.5 overflow-y-auto">
            {filtered.map((tag) => {
              const selected = taskTagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  onClick={(e) => toggle(e, tag.id)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs transition-colors hover:bg-secondary"
                >
                  <span
                    className={[
                      'h-2.5 w-2.5 flex-shrink-0 rounded-full border',
                      selected
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/40 bg-transparent',
                    ].join(' ')}
                  />
                  <span className={selected ? 'font-medium' : ''}>{tag.name}</span>
                </button>
              )
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
              <p className="px-2 py-1 text-xs text-muted-foreground">No tags yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
