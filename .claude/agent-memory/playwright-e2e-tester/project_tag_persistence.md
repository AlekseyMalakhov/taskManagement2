---
name: Tag persistence quirk and workaround
description: Tags persist across test runs (no delete API) — createTag helper uses get-or-create pattern; unique names needed for "create tag" UI tests
type: project
---

The backend has no DELETE /tags endpoint. Tags created during tests accumulate and persist as long as the backend process is running.

**Why this matters:**
1. `createTag` API helper: Updated to be idempotent — on 400 duplicate it fetches all tags and returns the existing one.
2. "Create tag via UI" tests: The TagSelectorPopup shows a "Create …" button only when there is NO exact match. If a tag from a prior run already exists, the button won't appear. Use `uniqueTagName()` helper (in `e2e/tags.spec.ts`) to generate a name not yet present on the server.

**How to apply:** When any test needs to verify the "create new tag" UI flow, always generate a unique name via `uniqueTagName(request, "base-name")`. For regular tag assignment tests, the idempotent `createTag` helper is sufficient.
