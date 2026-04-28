import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useGetTasksQuery, useGetTagsQuery } from '../store/api'
import TaskCard from '../components/TaskCard'
import type { Tag } from '@task-app/shared'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import CreateTaskForm from '../components/CreateTaskForm'

export default function HomePage() {
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set())
  const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useGetTasksQuery()
  const { data: tags } = useGetTagsQuery()
  const [open, setOpen] = useState(false)

  function handleTagClick(tagId: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  const tagsById = useMemo(() => {
    const map = new Map<string, Tag>()
    tags?.forEach((tag) => map.set(tag.id, tag))
    return map
  }, [tags])

  const filteredTasks = useMemo(() => {
    if (!tasks || selectedTagIds.size === 0) return tasks
    return tasks.filter((t) => [...selectedTagIds].every((id) => t.tags.includes(id)))
  }, [tasks, selectedTagIds])

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

      {selectedTagIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filtered by:</span>
          {[...selectedTagIds].map((tagId) => (
            <button
              key={tagId}
              onClick={() => handleTagClick(tagId)}
              className="flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-medium hover:bg-primary/80"
            >
              {tagsById.get(tagId)?.name ?? tagId}
              <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}

      {tasksLoading && <p className="text-muted-foreground">Loading tasks…</p>}
      {tasksError && <p className="text-destructive">Failed to load tasks. Is the backend running?</p>}
      {!tasksLoading && !tasksError && !filteredTasks?.length && (
        <p className="text-muted-foreground">No tasks yet.</p>
      )}
      {filteredTasks?.length ? (
        <div className="grid gap-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} tagsById={tagsById} onTagClick={handleTagClick} selectedTagIds={selectedTagIds} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
