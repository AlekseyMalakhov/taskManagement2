---
name: Task app implementation plan
overview: Implement the task management SPA end-to-end with a mocked Express API, then finish with testing as the final step.
---

# Task Management SPA Implementation Plan

## Goal

Build a single-page task management app from the defined scope in [project-scope.md](project-scope.md) using the stack in [tech-stack.md](tech-stack.md), with a mock backend and no database.

## Step-by-Step Plan

1. Initialize project structure and tooling

- Set up a monorepo (or two top-level folders) for `frontend` and `backend` using Bun.
- Configure TypeScript, shared ESLint/Prettier settings, and scripts for dev/build/typecheck.
- Add core dependencies from the stack: React, React Router, Tailwind, shadcn/ui, react-hook-form, zod, RTK Query, Express.

2. Define shared domain model and API contract

- Document core types: `Task`, `Tag`, `TaskStatus` (`TODO`, `In Progress`, `Done`), `TaskPriority` (`Low`, `Medium`, `High`).
- Define REST endpoints for listing/filtering tasks, creating/updating tasks, and listing/creating tags.
- Decide mock persistence behavior (in-memory with seed data) and document restart behavior.

3. Build the mock backend API

- Implement Express server with in-memory stores for tasks and tags.
- Add endpoints needed by the UI: task list/detail/create/update-status/update-task, tag list/create.
- Add validation (zod or middleware) and consistent error responses.
- Enable CORS and stable response formats for frontend integration.

4. Scaffold frontend app shell and routing

- Create base layout, global styles, and route structure with React Router.
- Add routes for main task list page and task details page.
- Set up RTK Query API slice and provider wiring.

5. Implement main task list and card UI

- Build task cards with required fields: title, description, status, priority, deadline, tags.
- Implement overdue highlighting logic based on deadline and status.
- Add status quick-change dropdown on each card and wire to API mutation.

6. Implement task creation flow (modal form)

- Build create-task modal using shadcn/ui components.
- Use react-hook-form + zod for validation and user-friendly errors.
- Support selecting existing tags and assigning them during task creation.

7. Implement task details page and tag filtering

- Build details page opened from card click.
- Implement tag-click behavior to filter tasks on the main page.
- Ensure filter state is reflected in URL query params for shareable state.

8. Implement tag management UX

- Add UI to create new tags.
- Integrate new tags into form options and filters without full page reload.
- Handle duplicate/invalid tag names gracefully.

9. Final integration pass, polish, and edge-case handling

- Improve loading/empty/error states across pages and mutations.
- Verify accessibility basics (labels, keyboard navigation, focus in modal).
- Confirm consistent date formatting and overdue behavior.

10. Testing (final step)

- Add frontend component/integration tests for task list rendering, modal validation, status update, and tag filtering.
- Add backend API tests for core endpoints and validation failures.
- Run a manual end-to-end checklist covering all scope features before submission.

## Implementation Notes

- Keep backend intentionally simple and deterministic (mock data only).
- Prefer small, incremental commits per step to reduce review risk.
- If time is limited, prioritize correctness of required features over advanced UI polish.
