import { useParams } from 'react-router-dom'

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div>
      <h1 className="text-2xl font-bold">Task Details</h1>
      <p className="text-muted-foreground mt-1">Task ID: {id}</p>
    </div>
  )
}
