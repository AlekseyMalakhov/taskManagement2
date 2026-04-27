import { useMemo } from 'react'
import { useGetTasksQuery, useGetTagsQuery } from '../store/api'
import TaskCard from '../components/TaskCard'
import type { Tag } from '@task-app/shared'

export default function HomePage() {
  const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useGetTasksQuery()
  const { data: tags } = useGetTagsQuery()

  const tagsById = useMemo(() => {
    const map = new Map<string, Tag>()
    tags?.forEach((tag) => map.set(tag.id, tag))
    return map
  }, [tags])

  if (tasksLoading) {
    return <p className="text-muted-foreground">Loading tasks…</p>
  }

  if (tasksError) {
    return <p className="text-destructive">Failed to load tasks. Is the backend running?</p>
  }

  if (!tasks?.length) {
    return <p className="text-muted-foreground">No tasks yet.</p>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <div className="grid gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} tagsById={tagsById} />
        ))}
      </div>
    </div>
  )
}
