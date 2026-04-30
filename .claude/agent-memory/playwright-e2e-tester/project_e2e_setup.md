---
name: E2E test setup and file locations
description: Playwright config location, test file layout, fixture helpers, and webServer setup for this monorepo
type: project
---

Playwright is configured at `playwright.config.ts` (repo root). `@playwright/test` v1.59.1 is in the root `package.json` devDependencies.

**Why:** Set up from scratch as part of initial E2E work. Single worker, 30s timeout, `baseURL: http://localhost:5173`.

**webServer config:** Both servers use `reuseExistingServer: true` (backend on :3000, frontend on :5173). The backend health-check URL is `http://localhost:3000/tasks`.

**Test files in `e2e/`:**
- `e2e/task-crud.spec.ts` — Create/Read/Update/Delete tasks, inline status updates (HomePage card + TaskDetailsPage)
- `e2e/filtering.spec.ts` — Search by title, filter by status/priority, sort by deadline asc
- `e2e/tags.spec.ts` — Create new tag via TagSelectorPopup, assign existing tag via TagSelectorPopup

**Fixtures in `e2e/fixtures/`:**
- `api-helpers.ts` — `createTag`, `createTask`, `deleteTask`, `getAllTasks`, `getAllTags`, `cleanupAllTasks`
- `test-data.ts` — `FUTURE_DEADLINE` (`2026-05-15`), `taskData()` factory

**How to apply:** When writing new tests, import from these fixtures; `cleanupAllTasks` in `beforeEach` gives a clean task slate. Chromium only, single worker for in-memory backend stability.
