import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useGetTasksQuery, useGetTagsQuery } from '../store/api'
import TaskCard from '../components/TaskCard'
import type { Tag, TaskStatus, TaskPriority } from '@task-app/shared'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import CreateTaskForm from '../components/CreateTaskForm'
import { STATUS_LABEL, PRIORITY_LABEL } from '../lib/taskConstants'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTagIds = useMemo(() => new Set(searchParams.getAll('tag')), [searchParams])
  const statusFilter = searchParams.get('status') as TaskStatus | null
  const priorityFilter = searchParams.get('priority') as TaskPriority | null
  const searchQuery = searchParams.get('search') ?? ''

  const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useGetTasksQuery()
  const { data: tags } = useGetTagsQuery()
  const [open, setOpen] = useState(false)

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  function handleTagClick(tagId: string) {
    const next = new URLSearchParams(searchParams)
    const current = next.getAll('tag')
    next.delete('tag')
    const updated = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId]
    updated.forEach((id) => next.append('tag', id))
    setSearchParams(next, { replace: true })
  }

  const tagsById = useMemo(() => {
    const map = new Map<string, Tag>()
    tags?.forEach((tag) => map.set(tag.id, tag))
    return map
  }, [tags])

  const filteredTasks = useMemo(() => {
    if (!tasks) return tasks
    const q = searchQuery.toLowerCase()
    return tasks.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false
      if (priorityFilter && t.priority !== priorityFilter) return false
      if (selectedTagIds.size > 0 && ![...selectedTagIds].every((id) => t.tags.includes(id))) return false
      if (q && !t.title.toLowerCase().includes(q)) return false
      return true
    })
  }, [tasks, statusFilter, priorityFilter, selectedTagIds, searchQuery])

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

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => updateParam('search', e.target.value)}
          placeholder="Search tasks…"
          className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
        />
        <select
          value={statusFilter ?? ''}
          onChange={(e) => updateParam('status', e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>

        <select
          value={priorityFilter ?? ''}
          onChange={(e) => updateParam('priority', e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none"
        >
          <option value="">All priorities</option>
          {(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map((p) => (
            <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
          ))}
        </select>
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
