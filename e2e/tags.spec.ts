import { test, expect } from "@playwright/test";
import {
  createTag,
  createTask,
  cleanupAllTasks,
  getAllTags,
} from "./fixtures/api-helpers";
import { taskData } from "./fixtures/test-data";

/**
 * Generate a tag name that does not yet exist on the server.
 * Tags cannot be deleted via the API, so we append a timestamp to avoid
 * "duplicate tag" errors on repeated runs against the same running backend.
 */
async function uniqueTagName(
  request: Parameters<typeof getAllTags>[0],
  base: string,
): Promise<string> {
  const existing = await getAllTags(request);
  const names = new Set(existing.map((t) => t.name.toLowerCase()));
  let candidate = base;
  let i = 1;
  while (names.has(candidate.toLowerCase())) {
    candidate = `${base}-${i++}`;
  }
  return candidate;
}

test.describe("Tags", () => {
  test.beforeEach(async ({ request }) => {
    await cleanupAllTasks(request);
  });

  // -----------------------------------------------------------------------
  // Create a tag via the TagSelectorPopup on TaskDetailsPage
  // -----------------------------------------------------------------------
  test("should create a new tag via the TagSelectorPopup and see it on the task", async ({
    page,
    request,
  }) => {
    // The CreateTaskForm uses a static checkbox list (TagsSelector) without
    // the ability to create new tags on the fly. Tag creation is exposed via
    // the TagSelectorPopup shown on the TaskDetailsPage.
    //
    // Steps:
    // 1. Create a task with an existing anchor tag (via API).
    // 2. Open the task's detail page.
    // 3. Open TagSelectorPopup → type a brand-new name → click "Create …".
    // 4. Verify the new tag chip appears on the page.

    const anchorTag = await createTag(request, "e2e-anchor");
    const newTagName = await uniqueTagName(request, "e2e-fresh-tag");

    const task = await createTask(
      request,
      taskData([anchorTag.id], { title: "Tag Creation Test Task" }),
    );

    await page.goto(`/task/${task.id}`);
    await expect(
      page.getByRole("heading", { name: "Tag Creation Test Task", level: 1 }),
    ).toBeVisible();

    // Open the TagSelectorPopup via the "+" button next to the tag list
    await page.getByTitle("Add tag").click();

    const searchInput = page.getByPlaceholder("Search or create…");
    await expect(searchInput).toBeVisible();

    // Type the new tag name
    await searchInput.fill(newTagName);

    // The "Create" option should appear — the component renders curly quotes
    // via &ldquo; / &rdquo; HTML entities which render as " / "
    const createButton = page.getByText(new RegExp(`Create “${newTagName}”`));
    await expect(createButton).toBeVisible();
    await createButton.click();

    // After creating, the popup stays open but the search clears.
    // Close by clicking the backdrop and then verify the new tag chip appears.
    await page.mouse.click(10, 10);
    await expect(searchInput).toBeHidden();
    await expect(page.getByText(newTagName)).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Assign an existing tag via the TagSelectorPopup on TaskDetailsPage
  // -----------------------------------------------------------------------
  test("should assign an existing tag to a task via TagSelectorPopup", async ({
    page,
    request,
  }) => {
    const initialTag = await createTag(request, "e2e-initial-tag");
    const assignTag = await createTag(request, "e2e-assign-tag");

    const task = await createTask(
      request,
      taskData([initialTag.id], { title: "Tag Assignment Test Task" }),
    );

    await page.goto(`/task/${task.id}`);
    await expect(
      page.getByRole("heading", { name: "Tag Assignment Test Task", level: 1 }),
    ).toBeVisible();

    // The initial tag chip should already be visible in the tags row
    await expect(page.getByText(initialTag.name)).toBeVisible();

    // Open the TagSelectorPopup
    await page.getByTitle("Add tag").click();

    const searchInput = page.getByPlaceholder("Search or create…");
    await expect(searchInput).toBeVisible();

    // The assign-tag button should be in the list — click to toggle it on
    await page.getByRole("button", { name: assignTag.name }).click();

    // Close the popup by clicking the fixed backdrop (outside the popup)
    await page.mouse.click(10, 10);
    await expect(searchInput).toBeHidden();

    // The newly assigned tag chip should now appear in the task details
    await expect(page.getByText(assignTag.name)).toBeVisible();
  });
});
