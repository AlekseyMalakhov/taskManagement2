import { test, expect } from "@playwright/test";
import {
  createTag,
  createTask,
  cleanupAllTasks,
} from "./fixtures/api-helpers";
import {
  FUTURE_DEADLINE,
  FUTURE_DEADLINE_2,
  FUTURE_DEADLINE_3,
  FUTURE_DEADLINE_DISPLAY,
  FUTURE_DEADLINE_2_DISPLAY,
  taskData,
} from "./fixtures/test-data";

test.describe("Filtering & Sorting", () => {
  test.beforeEach(async ({ request }) => {
    await cleanupAllTasks(request);
  });

  // -----------------------------------------------------------------------
  // Search by title (case-insensitive)
  // -----------------------------------------------------------------------
  test("should filter tasks by title search (case-insensitive)", async ({
    page,
    request,
  }) => {
    const tag = await createTag(request, "e2e-search");

    await createTask(
      request,
      taskData([tag.id], { title: "Alpha Widget Task" }),
    );
    await createTask(
      request,
      taskData([tag.id], { title: "Beta Gadget Task" }),
    );
    await createTask(
      request,
      taskData([tag.id], { title: "Gamma Widget Task" }),
    );

    await page.goto("/");

    // Type a lowercase search term that matches two tasks
    const searchInput = page.getByPlaceholder("Search tasks…");
    await searchInput.fill("widget");

    // Only the two "Widget" tasks should be visible
    await expect(
      page.getByRole("heading", { name: "Alpha Widget Task" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Gamma Widget Task" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Beta Gadget Task" }),
    ).toBeHidden();

    // URL should reflect the search param
    await expect(page).toHaveURL(/search=widget/);
  });

  // -----------------------------------------------------------------------
  // Filter by status
  // -----------------------------------------------------------------------
  test("should filter tasks by status", async ({ page, request }) => {
    const tag = await createTag(request, "e2e-status-filter");

    await createTask(
      request,
      taskData([tag.id], { title: "Todo Task", status: "todo" }),
    );
    await createTask(
      request,
      taskData([tag.id], {
        title: "In Progress Task",
        status: "inProgress",
      }),
    );
    await createTask(
      request,
      taskData([tag.id], { title: "Done Task", status: "done" }),
    );

    await page.goto("/");

    // Select "In Progress" from the status filter
    const statusSelect = page.locator('select').filter({ hasText: "All statuses" });
    await statusSelect.selectOption("inProgress");

    // Only the in-progress task should be visible
    await expect(
      page.getByRole("heading", { name: "In Progress Task" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Todo Task" }),
    ).toBeHidden();
    await expect(
      page.getByRole("heading", { name: "Done Task" }),
    ).toBeHidden();

    // URL should reflect the status param
    await expect(page).toHaveURL(/status=inProgress/);
  });

  // -----------------------------------------------------------------------
  // Filter by priority
  // -----------------------------------------------------------------------
  test("should filter tasks by priority", async ({ page, request }) => {
    const tag = await createTag(request, "e2e-priority-filter");

    await createTask(
      request,
      taskData([tag.id], { title: "Low Priority Task", priority: "low" }),
    );
    await createTask(
      request,
      taskData([tag.id], { title: "High Priority Task", priority: "high" }),
    );

    await page.goto("/");

    // Select "High" from the priority filter
    const prioritySelect = page.locator('select').filter({ hasText: "All priorities" });
    await prioritySelect.selectOption("high");

    // Only the high-priority task should be visible
    await expect(
      page.getByRole("heading", { name: "High Priority Task" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Low Priority Task" }),
    ).toBeHidden();

    // URL should reflect the priority param
    await expect(page).toHaveURL(/priority=high/);
  });

  // -----------------------------------------------------------------------
  // Sort by deadline ascending
  // -----------------------------------------------------------------------
  test("should sort tasks by deadline ascending", async ({
    page,
    request,
  }) => {
    const tag = await createTag(request, "e2e-sort");

    // Create tasks in reverse deadline order
    await createTask(
      request,
      taskData([tag.id], {
        title: "Far Future Task",
        deadline: FUTURE_DEADLINE_3,
      }),
    );
    await createTask(
      request,
      taskData([tag.id], {
        title: "Near Future Task",
        deadline: FUTURE_DEADLINE,
      }),
    );
    await createTask(
      request,
      taskData([tag.id], {
        title: "Mid Future Task",
        deadline: FUTURE_DEADLINE_2,
      }),
    );

    await page.goto("/");

    // Select "Deadline: soonest first"
    const sortSelect = page.locator('select').filter({ hasText: "Created: newest first" });
    await sortSelect.selectOption("deadline_asc");

    await expect(page).toHaveURL(/sort=deadline_asc/);

    // Verify order: Near (15/05) → Mid (01/06) → Far (10/07)
    const headings = page.getByRole("heading", {
      name: /Near Future Task|Mid Future Task|Far Future Task/,
    });
    const allHeadings = await headings.allTextContents();
    expect(allHeadings).toEqual([
      "Near Future Task",
      "Mid Future Task",
      "Far Future Task",
    ]);
  });
});
