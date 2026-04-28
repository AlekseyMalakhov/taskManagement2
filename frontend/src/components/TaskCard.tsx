import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import type { Task, Tag, TaskStatus } from '@task-app/shared'
import { useUpdateTaskMutation } from '../store/api'
import { STATUS_LABEL, STATUS_CLASS, PRIORITY_LABEL, PRIORITY_CLASS, isOverdue } from '../lib/taskConstants'

interface Props {
  task: Task
  tagsById: Map<string, Tag>
}

export default function TaskCard({ task, tagsById }: Props) {
  const overdue = isOverdue(task.deadline, task.status)
  const [updateTask, { isLoading }] = useUpdateTaskMutation()

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateTask({ id: task.id, body: { status: e.target.value as TaskStatus } })
  }

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
          {/* stop click from triggering the Link navigation */}
          <div onClick={(e) => e.preventDefault()} className="relative flex items-center">
            <select
              value={task.status}
              onChange={handleStatusChange}
              disabled={isLoading}
              className={`appearance-none cursor-pointer rounded-md border py-0.5 pl-2.5 pr-6 text-xs font-medium outline-none transition-shadow hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${STATUS_CLASS[task.status]}`}
            >
              {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 h-3 w-3 opacity-50" />
          </div>
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
