# Plan: Add "Create New Task" Feature

## Context

The task list is read-only — users can view and update task status, but there's no way to create new tasks from the UI. This adds a "New Task" button to the homepage that opens a modal dialog with a form.

The backend `POST /tasks` endpoint and the `useCreateTaskMutation` RTK Query hook already exist. No backend changes are needed.

---

## Files to Create

### `frontend/src/components/ui/dialog.tsx`

Styled wrapper around Radix Dialog primitives (imported from `'radix-ui'`, same pattern as `button.tsx`).

Exports: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `DialogClose`.

- `DialogOverlay`: fixed inset backdrop with `bg-black/50 backdrop-blur-sm`
- `DialogContent`: renders Portal + Overlay internally; centered with `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-xl shadow-xl border p-6 w-full max-w-lg`
- `DialogHeader` / `DialogFooter`: plain divs with flex layout

### `frontend/src/components/CreateTaskForm.tsx`

Form component using react-hook-form + zod + `useCreateTaskMutation`.

**Props:** `tags: Tag[]`, `onSuccess: () => void`

**Zod schema (frontend-local, not from shared):**
```typescript
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'inProgress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z.string().min(1, 'Deadline is required'),
  tagIds: z.array(z.string()),
})
```
(Keep `deadline` as `string` — HTML date input yields `YYYY-MM-DD` string, matching `CreateTaskDto.deadline: string`.)

**Default values:** `{ status: 'todo', priority: 'medium', tagIds: [] }`

**Fields:**
- `title` — `<input type="text">`
- `description` — `<textarea>`, optional
- `status` — `<select>` with options todo / inProgress / done
- `priority` — `<select>` with options low / medium / high
- `deadline` — `<input type="date">`
- `tagIds` — scrollable checkbox list using `Checkbox` from `'radix-ui'`; managed via `watch('tagIds')` + `setValue`

**Submit flow:**
```typescript
await createTask(values).unwrap()
reset()
onSuccess()   // closes the dialog
```

**Error:** show an error banner (`isError`) between fields and footer buttons.
**Loading:** disable the submit button while `isLoading`.

---

## Files to Modify

### `frontend/src/pages/HomePage.tsx`

**Problem:** Early returns for loading/error/empty states mean the "New Task" button wouldn't render in those states. Restructure so the page shell (header + button) always renders, and only the grid area changes.

**Changes:**
1. Add `useState` import, `useCreateTaskMutation` is NOT needed here (form owns it).
2. Import `Button`, new dialog components, `CreateTaskForm`, and `Plus` from `lucide-react`.
3. Add `const [open, setOpen] = useState(false)`.
4. Replace the three early returns + final return with a single return that always renders the header+button, with conditional content for the grid area:

```tsx
return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button><Plus className="size-4" />New Task</Button>
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
```

---

## Implementation Order

1. `dialog.tsx` — no new dependencies
2. `CreateTaskForm.tsx` — depends on existing `api.ts`, `dialog.tsx` types not needed
3. `HomePage.tsx` — depends on both new files

---

## Verification

1. Start backend (`bun run dev` in `backend/`)
2. Start frontend (`bun run dev` in `frontend/`)
3. Homepage shows "New Task" button top-right of heading
4. Click button → modal opens with all fields
5. Submit with empty title → validation error shown inline
6. Fill all required fields, submit → modal closes, new task appears in list
7. Check empty-state ("No tasks yet") page also shows the "New Task" button
8. Check loading/error states still show the button
