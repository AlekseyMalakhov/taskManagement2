import type { CreateTaskInput } from "./api-helpers";

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toDisplay(iso: string): string {
  const [y, m, day] = iso.split("-");
  return `${day}/${m}/${y}`;
}

const _today = new Date();
_today.setHours(0, 0, 0, 0);

export const FUTURE_DEADLINE = toIso(addDays(_today, 15));
export const FUTURE_DEADLINE_2 = toIso(addDays(_today, 32));
export const FUTURE_DEADLINE_3 = toIso(addDays(_today, 71));

/** Displayed form: DD/MM/YYYY */
export const FUTURE_DEADLINE_DISPLAY = toDisplay(FUTURE_DEADLINE);
export const FUTURE_DEADLINE_2_DISPLAY = toDisplay(FUTURE_DEADLINE_2);
export const FUTURE_DEADLINE_3_DISPLAY = toDisplay(FUTURE_DEADLINE_3);

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
