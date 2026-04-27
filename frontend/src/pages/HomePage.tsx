import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useGetTasksQuery, useGetTagsQuery } from '../store/api'
import TaskCard from '../components/TaskCard'
import type { Tag } from '@task-app/shared'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import CreateTaskForm from '../components/CreateTaskForm'

export default function HomePage() {
  const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useGetTasksQuery()
  const { data: tags } = useGetTagsQuery()
  const [open, setOpen] = useState(false)

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

      {tasksLoading && <p className="text-muted-foreground">Loading tasks…</p>}
      {tasksError && <p className="text-destructive">Failed to load tasks. Is the backend running?</p>}
      {!tasksLoading && !tasksError && !tasks?.length && (
        <p className="text-muted-foreground">No tasks yet.</p>
      )}
      {tasks?.length ? (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} tagsById={tagsById} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
