import type { CreateTaskInput } from "./api-helpers";

/** A deadline safely in the future relative to today (2026-04-30). */
export const FUTURE_DEADLINE = "2026-05-15";
export const FUTURE_DEADLINE_2 = "2026-06-01";
export const FUTURE_DEADLINE_3 = "2026-07-10";

/** Displayed form: DD/MM/YYYY */
export const FUTURE_DEADLINE_DISPLAY = "15/05/2026";
export const FUTURE_DEADLINE_2_DISPLAY = "01/06/2026";
export const FUTURE_DEADLINE_3_DISPLAY = "10/07/2026";

export function taskData(
  tagIds: string[],
  overrides: Partial<CreateTaskInput> = {},
): CreateTaskInput {
  return {
    title: "Test Task Alpha",
    description: "A task for testing",
    status: "todo",
    priority: "medium",
    deadline: FUTURE_DEADLINE,
    tagIds,
    ...overrides,
  };
}
