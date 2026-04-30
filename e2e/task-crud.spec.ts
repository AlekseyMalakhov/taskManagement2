import { test, expect } from "@playwright/test";
import {
  createTag,
  createTask,
  cleanupAllTasks,
} from "./fixtures/api-helpers";
import {
  FUTURE_DEADLINE,
  FUTURE_DEADLINE_DISPLAY,
  taskData,
} from "./fixtures/test-data";

test.describe("Task CRUD", () => {
  test.beforeEach(async ({ request }) => {
    await cleanupAllTasks(request);
  });

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  test("should create a task via the modal form and show it in the list", async ({
    page,
    request,
  }) => {
    const tag = await createTag(request, "e2e-create");

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();

    // Open the New Task dialog
    await page.getByRole("button", { name: "New Task" }).click();
    await expect(
      page.getByRole("dialog", { name: "New Task" }),
    ).toBeVisible();

    // Fill the form
    await page.getByLabel("Title").fill("My Brand New Task");
    await page.getByLabel("Description").fill("Created from E2E test");
    // Status defaults to "todo" — leave it
    // Priority defaults to "medium" — leave it

    // Set deadline via the date input
    const deadlineInput = page
      .getByRole("dialog")
      .locator('input[type="date"]');
    await deadlineInput.fill(FUTURE_DEADLINE);

    // Select the tag via the checkbox list
    await page.getByRole("dialog").getByText(tag.name).click();

    // Submit
    await page.getByRole("dialog").getByRole("button", { name: "Create Task" }).click();

    // Dialog should close
    await expect(page.getByRole("dialog")).toBeHidden();

    // Task should appear in the list
    await expect(page.getByRole("heading", { name: "My Brand New Task" })).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Read — navigate to details
  // -----------------------------------------------------------------------
  test("should navigate to task details page when clicking a task card", async ({
    page,
    request,
  }) => {
    const tag = await createTag(request, "e2e-read");
    const task = await createTask(
      request,
      taskData([tag.id], { title: "Detail Navigation Task" }),
    );

    await page.goto("/");
    await page.getByRole("heading", { name: "Detail Navigation Task" }).click();

    await expect(page).toHaveURL(`/task/${task.id}`);
    await expect(
      page.getByRole("heading", { name: "Detail Navigation Task", level: 1 }),
    ).toBeVisible();
    // Deadline shown in DD/MM/YYYY format
    await expect(page.getByText(FUTURE_DEADLINE_DISPLAY)).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Update — edit modal
  // -----------------------------------------------------------------------
  test("should edit a task title via the edit modal and reflect changes on details page", async ({
    page,
    request,
  }) => {
    const tag = await createTag(request, "e2e-edit");
    const task = await createTask(
      request,
      taskData([tag.id], { title: "Original Title" }),
    );

    await page.goto(`/task/${task.id}`);
    await expect(
      page.getByRole("heading", { name: "Original Title", level: 1 }),
    ).toBeVisible();

    // Open edit modal
    await page.getByRole("button", { name: "Edit" }).click();
    await expect(
      page.getByRole("dialog", { name: "Edit Task" }),
    ).toBeVisible();

    // The title input should be pre-filled
    const titleInput = page.getByRole("dialog").getByLabel("Title");
    await expect(titleInput).toHaveValue("Original Title");

    // Update the title
    await titleInput.clear();
    await titleInput.fill("Updated Title After Edit");

    // Save
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Save Changes" })
      .click();

    // Dialog should close
    await expect(page.getByRole("dialog")).toBeHidden();

    // Updated title should be visible on the details page
    await expect(
      page.getByRole("heading", { name: "Updated Title After Edit", level: 1 }),
    ).toBeVisible();
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  test("should delete a task and redirect to home with task removed", async ({
    page,
    request,
  }) => {
    const tag = await createTag(request, "e2e-delete");
    const task = await createTask(
      request,
      taskData([tag.id], { title: "Task To Delete" }),
    );

    await page.goto(`/task/${task.id}`);
    await expect(
      page.getByRole("heading", { name: "Task To Delete", level: 1 }),
    ).toBeVisible();

    // Click Delete to open confirmation modal
    await page.getByRole("button", { name: "Delete" }).click();

    // Confirmation modal should appear — title is "Delete task?"
    await expect(
      page.getByRole("heading", { name: "Delete task?" }),
    ).toBeVisible();

    // Confirm deletion — the modal's "Delete" button is the last one on the page
    // (the footer "Delete" button opened the modal; the modal confirm is the last)
    await page.getByRole("button", { name: "Delete" }).last().click();

    // Should navigate back to home
    await expect(page).toHaveURL("/");

    // Task should no longer appear in the list
    await expect(
      page.getByRole("heading", { name: "Task To Delete" }),
    ).toBeHidden();
  });

  // -----------------------------------------------------------------------
  // Inline status update — TaskCard on HomePage
  // -----------------------------------------------------------------------
  test("should update task status via the inline dropdown on the HomePage card", async ({
    page,
    request,
  }) => {
    const tag = await createTag(request, "e2e-status-home");
    await createTask(
      request,
      taskData([tag.id], { title: "Status Update Home Task", status: "todo" }),
    );

    await page.goto("/");

    // Find the task card and the status select within it
    const card = page
      .getByRole("link", { name: /Status Update Home Task/ });
    await expect(card).toBeVisible();

    const statusSelect = card.locator("select");
    await expect(statusSelect).toHaveValue("todo");

    // Change status to "In Progress"
    await statusSelect.selectOption("inProgress");

    // Wait for the optimistic/network update — select should reflect new value
    await expect(statusSelect).toHaveValue("inProgress");
  });

  // -----------------------------------------------------------------------
  // Inline status update — TaskDetailsPage
  // -----------------------------------------------------------------------
  test("should update task status via the inline dropdown on the TaskDetailsPage", async ({
    page,
    request,
  }) => {
    const tag = await createTag(request, "e2e-status-details");
    const task = await createTask(
      request,
      taskData([tag.id], {
        title: "Status Update Details Task",
        status: "todo",
      }),
    );

    await page.goto(`/task/${task.id}`);
    await expect(
      page.getByRole("heading", { name: "Status Update Details Task", level: 1 }),
    ).toBeVisible();

    // The status select on the details page
    const statusSelect = page.locator("select").first();
    await expect(statusSelect).toHaveValue("todo");

    // Change to "Done"
    await statusSelect.selectOption("done");

    // Should reflect new value after API response
    await expect(statusSelect).toHaveValue("done");
  });
});
