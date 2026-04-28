import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useGetTasksQuery, useGetTagsQuery } from '../store/api'
import TaskCard from '../components/TaskCard'
import type { Tag } from '@task-app/shared'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import CreateTaskForm from '../components/CreateTaskForm'

export default function HomePage() {
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(undefined)
  const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useGetTasksQuery(
    selectedTagId ? { tag: selectedTagId } : undefined
  )
  const { data: tags } = useGetTagsQuery()
  const [open, setOpen] = useState(false)

  function handleTagClick(tagId: string) {
    setSelectedTagId((prev) => (prev === tagId ? undefined : tagId))
  }

  const tagsById = useMemo(() => {
    const map = new Map<string, Tag>()
    tags?.forEach((tag) => map.set(tag.id, tag))
    return map
  }, [tags])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Task</DialogTitle>
            </DialogHeader>
            <CreateTaskForm tags={tags ?? []} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {selectedTagId && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filtered by:</span>
          <button
            onClick={() => setSelectedTagId(undefined)}
            className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium hover:bg-secondary/70"
          >
            {tagsById.get(selectedTagId)?.name ?? selectedTagId}
            <span aria-hidden>×</span>
          </button>
        </div>
      )}

      {tasksLoading && <p className="text-muted-foreground">Loading tasks…</p>}
      {tasksError && <p className="text-destructive">Failed to load tasks. Is the backend running?</p>}
      {!tasksLoading && !tasksError && !tasks?.length && (
        <p className="text-muted-foreground">No tasks yet.</p>
      )}
      {tasks?.length ? (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} tagsById={tagsById} onTagClick={handleTagClick} selectedTagId={selectedTagId} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
