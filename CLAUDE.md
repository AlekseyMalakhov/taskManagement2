# Task Management App

## Monorepo structure

- `shared/` — `@task-app/shared` workspace package: types, DTOs, and Zod validation schemas
- `backend/` — Express API
- `frontend/` — React + Vite app

## Validation schemas

All Zod schemas live in `shared/src/validation.ts` and are exported from `shared/src/index.ts`.

Both backend and frontend import schemas directly from `@task-app/shared`:

```ts
import { createTaskSchema, updateTaskSchema, createTagSchema } from "@task-app/shared"
```

When adding or modifying validation logic, always update the shared schema — never define duplicate schemas locally in backend or frontend.

The `deadline` field is validated as a `YYYY-MM-DD` string that must be today or in the future.
