import { Link } from 'react-router-dom'
import type { Task, Tag } from '@task-app/shared'

const STATUS_LABEL: Record<Task['status'], string> = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done',
}

const STATUS_CLASS: Record<Task['status'], string> = {
  todo: 'bg-slate-100 text-slate-700',
  inProgress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

const PRIORITY_LABEL: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const PRIORITY_CLASS: Record<Task['priority'], string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
}

function isOverdue(task: Task): boolean {
  if (task.status === 'done') return false
  return task.deadline < new Date().toISOString().slice(0, 10)
}

interface Props {
  task: Task
  tagsById: Map<string, Tag>
}

export default function TaskCard({ task, tagsById }: Props) {
  const overdue = isOverdue(task)

  return (
    <Link
      to={`/tasks/${task.id}`}
      className={[
        'block rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        overdue ? 'border-l-4 border-l-red-500' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold leading-snug">{task.title}</h2>
        <div className="flex shrink-0 gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[task.status]}`}>
            {STATUS_LABEL[task.status]}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_CLASS[task.priority]}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className={overdue ? 'font-medium text-red-600' : ''}>
          Due {task.deadline}
          {overdue && ' · Overdue'}
        </span>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tagId) => {
              const tag = tagsById.get(tagId)
              return tag ? (
                <span key={tagId} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                  {tag.name}
                </span>
              ) : null
            })}
          </div>
        )}
      </div>
    </Link>
  )
}
