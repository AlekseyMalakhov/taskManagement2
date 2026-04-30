---
name: Reliable selectors and UI quirks for this app
description: Tested selector strategies for key UI elements: task cards, status dropdowns, modals, TagSelectorPopup
type: project
---

**Task card on HomePage:**
- `page.getByRole("link", { name: /Task Title/ })` — each card is a `<Link>` (renders as `<a>`)
- Status select inside card: `card.locator("select")` — only one select per card
- The status select sits inside a `div onClick={e.preventDefault()}` wrapper to prevent navigation

**Status select on TaskDetailsPage:**
- `page.locator("select").first()` — the first select on the page is the status dropdown

**Filter panel selects (FilterPanel):**
- Status filter: `page.locator('select').filter({ hasText: "All statuses" })`
- Priority filter: `page.locator('select').filter({ hasText: "All priorities" })`
- Sort select: `page.locator('select').filter({ hasText: "Created: newest first" })`

**Create Task dialog:**
- Open: `page.getByRole("button", { name: "New Task" }).click()`
- Target within dialog: scope with `page.getByRole("dialog", { name: "New Task" })`
- Date input: `page.getByRole("dialog").locator('input[type="date"]')`
- Tag checkbox: `page.getByRole("dialog").getByText(tag.name).click()` — clicks the label which triggers Radix Checkbox

**Edit Task dialog:**
- Open: `page.getByRole("button", { name: "Edit" }).click()`
- Save button text: "Save Changes"
- Title input: `page.getByRole("dialog").getByLabel("Title")`

**Delete Task modal (DeleteTaskModal — NOT a Radix Dialog, it's a raw div):**
- Heading: `page.getByRole("heading", { name: "Delete task?" })`
- Both the footer "Delete" button and the modal confirm "Delete" button exist simultaneously
- Confirm: `page.getByRole("button", { name: "Delete" }).last()` — modal confirm is the last one

**TagSelectorPopup:**
- Open: `page.getByTitle("Add tag").click()`
- Search input: `page.getByPlaceholder("Search or create…")`
- Existing tag buttons: `page.getByRole("button", { name: tagName })`
- Create new tag button: uses `&ldquo;`/`&rdquo;` HTML entities → renders as curly quotes `"…"`
  - Selector: `page.getByText(new RegExp('Create "tagName"'))` (curly quote regex)
- After clicking Create: popup stays OPEN (`handleCreate` calls `setSearch("")` but not `close()`)
  - Must click backdrop to close: `page.mouse.click(10, 10)`
- Close popup (assign flow): `page.mouse.click(10, 10)` — clicks the fixed `z-40` backdrop overlay

**How to apply:** Use these patterns to avoid guessing selectors when writing new tests.
