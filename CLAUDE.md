# Task Management App

## Monorepo structure

Bun workspace with three packages:

- `shared/` — `@task-app/shared`: types, DTOs, and Zod validation schemas
- `backend/` — Express API (in-memory store, non-persistent)
- `frontend/` — React + Vite app

Root scripts: `dev:frontend`, `dev:backend`, `typecheck`

## Shared package (`@task-app/shared`)

**Types** (`shared/src/types.ts`):
- `TaskStatus` — `"todo" | "inProgress" | "done"`
- `TaskPriority` — `"low" | "medium" | "high"`
- `Task` — `{ id, title, description?, status, priority, deadline, tags: string[], createdAt, updatedAt }`
- `Tag` — `{ id, name }`

**DTOs** (`shared/src/dto.ts`): `CreateTaskDto`, `PatchTaskStatusDto`, `PatchTaskTagsDto`, `CreateTagDto`

- `CreateTaskDto` is used for both create and update — there is no separate `UpdateTaskDto`
- `PatchTaskStatusDto` — `{ status: TaskStatus }` — used for the status-only patch endpoint
- `PatchTaskTagsDto` — `{ tagIds: string[] }` — used for the tags-only patch endpoint

**Validation** (`shared/src/validation.ts`): `createTaskSchema`, `updateTaskSchema`, `patchTaskStatusSchema`, `patchTaskTagsSchema`, `createTagSchema`

All Zod schemas live in `shared/src/validation.ts` and are exported from `shared/src/index.ts`. Both backend and frontend import from `@task-app/shared` — never define duplicate schemas locally.

`createTaskSchema` rules:
- `title` — required, min 5 characters
- `description` — optional, max 500 characters
- `status` — required enum: `"todo" | "inProgress" | "done"`
- `priority` — required enum: `"low" | "medium" | "high"`
- `deadline` — required `YYYY-MM-DD`, must be today or in the future
- `tagIds` — required array, min 1 item

`updateTaskSchema = createTaskSchema.extend({ deadline })` — identical to `createTaskSchema` except `deadline` only validates format (`YYYY-MM-DD`), **not** that it is in the future. This allows editing tasks that already have a past deadline.

`patchTaskStatusSchema` — `{ status: z.enum([...]) }` — used for the status-only PATCH endpoint.

`patchTaskTagsSchema` — `{ tagIds: z.array(z.string()).min(1) }` — used for the tags-only PATCH endpoint.

## Backend

- Express on `process.env.PORT` (default 3000), CORS for `http://localhost:5173`
- In-memory store in `backend/src/store.ts` — resets on restart
- All responses: `{ data: T }` on success, `{ error: string }` on failure

**Tasks** (`/tasks`):
- `GET /tasks` — all tasks
- `GET /tasks/:id` — single task (404 if missing)
- `POST /tasks` — create; validates with `createTaskSchema`; returns 201
- `PUT /tasks/:id` — full replace; validates with `updateTaskSchema`; preserves `id` and `createdAt`
- `PATCH /tasks/:id/status` — status-only update; validates with `patchTaskStatusSchema`; returns updated task
- `PATCH /tasks/:id/tags` — tags-only update; validates with `patchTaskTagsSchema`; returns updated task
- `DELETE /tasks/:id` — 204 No Content

**Tags** (`/tags`):
- `GET /tags` — all tags
- `POST /tags` — create; case-insensitive duplicate check (400); ID generated with `randomUUID()`

**Test utilities** (`/test`):
- `POST /test/reset` — resets in-memory store to empty state; used by E2E tests only

## Frontend

**Stack**: React 19, React Router v6, Redux Toolkit + RTK Query, React Hook Form + Zod, Tailwind CSS v4, Radix UI, Lucide React

### State management

- Redux store: `frontend/src/store/store.ts`
- RTK Query API: `frontend/src/store/api.ts` — endpoints: `getTasks`, `getTask`, `getTags`, `createTask`, `updateTask`, `patchTaskStatus`, `patchTaskTags`, `deleteTask`, `createTag`
- RTK Query's `baseQuery` unwraps the `{ data }` envelope automatically
- Filtering and pagination are **client-side** — `getTasks` fetches all tasks, `useFilteredTasks` does the rest

### URL search params (single source of truth for UI state)

| Param | Values | Notes |
|---|---|---|
| `?tag=` | tag ID (repeatable) | AND logic — task must have all selected tags |
| `?status=` | `todo \| inProgress \| done` | |
| `?priority=` | `low \| medium \| high` | |
| `?search=` | string | case-insensitive title match |
| `?sort=` | `createdAt_desc` (default), `createdAt_asc`, `deadline_asc`, `deadline_desc` | |
| `?page=` | number (1-indexed) | reset to 1 whenever any filter changes |

### `useFilteredTasks` hook

`frontend/src/hooks/useFilteredTasks.ts` — reads all URL params above, filters + sorts + paginates the RTK Query result.

Returns: `{ filteredTasks, paginatedTasks, page, totalPages, isLoading, isError }`

`PAGE_SIZE = 10` (exported constant)

Invalid URL param values are silently ignored: unknown `?status=` / `?priority=` values are treated as "no filter" (full list shown); unknown `?sort=` values fall back to `createdAt_desc`.

### Pages

- **`HomePage`** (`/`) — filter panel, tag filter panel, task list with pagination. `handleTagClick` toggles `?tag=` and resets `?page=`.
- **`TaskDetailsPage`** (`/task/:id`) — full task view composed of `TaskDetailsBody` + `TaskDetailsFooter`; uses `usePatchTaskStatusMutation` for inline status changes.

### Components

Components are organized into subfolders by domain:

```
src/
  pages/          — route-level page components (HomePage, TaskDetailsPage)
  components/
    Home/           — HomePage-specific components
    TaskDetails/    — TaskDetailsPage-specific components
    TaskForm/       — shared form field components + create/edit forms
    ui/             — generic UI primitives
    Layout.tsx      — app shell
    TagSelectorPopup.tsx — shared, used in TaskDetails
  hooks/          — custom hooks (useFilteredTasks)
  store/          — Redux store + RTK Query API slice
  lib/            — utilities and constants
  test/           — global test setup (setup.ts)
```

**`Home/`**

| Component | Responsibility |
|---|---|
| `TasksList` | Fetches via `useFilteredTasks`, renders `TaskCard` list + `Pagination` |
| `TaskCard` | Task preview card; link to detail page; inline status dropdown; priority badge; tag chips; overdue indicator |
| `Pagination` | Previous/Next + smart page numbers with ellipsis; manages `?page=` param internally; renders `null` when `totalPages ≤ 1` |
| `FilterPanel` | Search, status, priority, sort dropdowns; resets `?page=` on change |
| `SelectedTagsPanel` | Active tag filter chips; hidden when no tags selected |

**`TaskDetails/`**

| Component | Responsibility |
|---|---|
| `TaskDetailsBody` | Task detail card: title, inline status dropdown (`patchTaskStatus`), priority badge, description, deadline, tags via `TagSelectorPopup`, created/updated timestamps |
| `TaskDetailsFooter` | Edit/Delete button bar; owns edit modal (`EditTaskForm`) and delete modal (`DeleteTaskModal`); navigates to `/` after successful delete |
| `DeleteTaskModal` | Confirmation modal for task deletion; shows error state; props: `onCancel`, `onConfirm`, `isDeleting`, `isError` |

**Shared components** (root `components/`):

| Component | Responsibility |
|---|---|
| `TagSelectorPopup` | Inline tag editor popup; props: `{ task: Task }`; uses `useGetTagsQuery`, `useCreateTagMutation`, `usePatchTaskTagsMutation`; supports creating new tags and toggling existing ones; used in `TaskCard` and `TaskDetailsBody` |

**`TaskForm/`**

| Component | Responsibility |
|---|---|
| `CreateTaskDialog` | "New Task" button + modal wrapping `CreateTaskForm` |
| `CreateTaskForm` | React Hook Form + Zod; composes field components below; submits `POST` with `createTaskSchema` resolver |
| `EditTaskForm` | Same as `CreateTaskForm`; pre-filled with current task values; submits full `PUT` with `updateTaskSchema` resolver |
| `TitleInput` | Labeled text input with error display; extends `ComponentPropsWithoutRef<"input">` |
| `DescriptionInput` | Labeled textarea; extends `ComponentPropsWithoutRef<"textarea">` |
| `StatusSelect` | Labeled select populated from `STATUS_OPTIONS`; extends `ComponentPropsWithoutRef<"select">` |
| `PriorityRadioGroup` | Radix `RadioGroup` of priority options; props: `defaultValue`, `idPrefix`, `onValueChange` |
| `DeadlineInput` | Labeled date input with error display; extends `ComponentPropsWithoutRef<"input">` |
| `TagsSelector` | Scrollable checkbox list of tags; props: `tags`, `selectedTagIds`, `onToggle`, `error` |

**UI primitives** (`frontend/src/components/ui/`): `button.tsx` (CVA variants: default, outline, secondary, ghost, destructive, link), `dialog.tsx` (Radix UI wrapper), `label.tsx`, `separator.tsx`, `radio-group.tsx`, `field.tsx` (field composition: `Field`, `FieldLabel`, `FieldError`, `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldContent`, `FieldTitle`, `FieldDescription`, `FieldSeparator`)

### Utilities (`frontend/src/lib/`)

- `utils.ts` — `cn()` (clsx + twMerge)
- `taskConstants.ts`:
  - `isOverdue(deadline, status)` — `deadline < today && status !== "done"`
  - `STATUS_LABEL`, `STATUS_CLASS`, `STATUS_OPTIONS`
  - `PRIORITY_LABEL`, `PRIORITY_CLASS`, `PRIORITY_OPTIONS`

### Conventions

- Props interfaces/types are always named `Props`
- Overdue tasks: red left border + red deadline text
- Deadline display format: `DD/MM/YYYY` (split on `-`, reverse, join `/`)
- Click handlers on tags inside `<Link>` elements use `e.stopPropagation()` to prevent navigation

### Storybook

- **Version**: Storybook 10 (`storybook@10`, `@storybook/react-vite@10`, `@storybook/addon-a11y@10`)
- **Run**: `bun storybook` from `frontend/` — dev server on port 6006
- **Build**: `bun build-storybook` — outputs to `frontend/storybook-static/`
- **Config**: `frontend/.storybook/main.ts` + `frontend/.storybook/preview.ts`
- **Tailwind**: injected via `@tailwindcss/vite` plugin in `viteFinal` (not PostCSS); `preview.ts` imports `../src/index.css`
- **`@` alias**: wired in `viteFinal` → `resolve.alias`
- **`__dirname`**: config uses `fileURLToPath(new URL(".", import.meta.url))` — required because `"type": "module"` in `package.json`
- **`fn()` spy**: import from `storybook/test` (not `@storybook/test` — that package no longer exists in v10)
- **Story files**: `frontend/src/stories/` — `ui/`, `form/`, `home/` subdirectories; 13 stories total
- **What has stories**: all UI primitives, all standalone form fields, `Pagination` (wrapped in `MemoryRouter`)
- **What does NOT have stories**: components with Redux/RTK Query hooks (`TaskCard`, `TasksList`, `FilterPanel`, etc.) — require store mocking not yet set up
- **Story format**: CSF3 — `satisfies Meta<typeof Component>`, `StoryObj<typeof meta>`; all type-only imports use `import type` (required by `verbatimModuleSyntax`)
- **`Pagination` stories**: decorated with `MemoryRouter` (component calls `useSearchParams`)

### Testing

- Always use the `frontend-test-runner` agent to create and run frontend unit tests — never write or execute them directly.
- **Runner**: Vitest 4.1.5, jsdom environment, globals enabled
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- **Setup file**: `frontend/src/test/setup.ts` — imports `@testing-library/jest-dom`
- **Config**: `vite.config.ts` imports `defineConfig` from `vitest/config` (not `vite`) to support the `test` field
- **Run**: `bun run test` from `frontend/` (script: `vitest run`)
- **Test file convention**: co-located with source — `ComponentName.test.tsx` / `util.test.ts`
- **tsconfig types**: includes `vitest/globals` and `@testing-library/jest-dom`
