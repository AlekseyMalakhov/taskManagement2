import {
  isOverdue,
  STATUS_LABEL,
  STATUS_CLASS,
  PRIORITY_LABEL,
  PRIORITY_CLASS,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from "./taskConstants";

// Mock Date so "today" is always 2026-04-29
const FIXED_TODAY = "2026-04-29";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(FIXED_TODAY + "T12:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("isOverdue", () => {
  it("returns false when status is 'done', regardless of deadline", () => {
    expect(isOverdue("2020-01-01", "done")).toBe(false);
    expect(isOverdue("2000-01-01", "done")).toBe(false);
  });

  it("returns true when deadline is before today and status is 'todo'", () => {
    expect(isOverdue("2026-04-28", "todo")).toBe(true);
  });

  it("returns true when deadline is before today and status is 'inProgress'", () => {
    expect(isOverdue("2026-04-28", "inProgress")).toBe(true);
  });

  it("returns false when deadline is today", () => {
    expect(isOverdue(FIXED_TODAY, "todo")).toBe(false);
  });

  it("returns false when deadline is in the future", () => {
    expect(isOverdue("2026-04-30", "todo")).toBe(false);
    expect(isOverdue("2030-12-31", "inProgress")).toBe(false);
  });

  it("returns false when deadline is today and status is 'inProgress'", () => {
    expect(isOverdue(FIXED_TODAY, "inProgress")).toBe(false);
  });

  it("returns true for a far past deadline with 'todo' status", () => {
    expect(isOverdue("2000-01-01", "todo")).toBe(true);
  });
});

describe("STATUS_LABEL", () => {
  it("has correct label for 'todo'", () => {
    expect(STATUS_LABEL.todo).toBe("To Do");
  });

  it("has correct label for 'inProgress'", () => {
    expect(STATUS_LABEL.inProgress).toBe("In Progress");
  });

  it("has correct label for 'done'", () => {
    expect(STATUS_LABEL.done).toBe("Done");
  });
});

describe("PRIORITY_LABEL", () => {
  it("has correct label for 'low'", () => {
    expect(PRIORITY_LABEL.low).toBe("Low");
  });

  it("has correct label for 'medium'", () => {
    expect(PRIORITY_LABEL.medium).toBe("Medium");
  });

  it("has correct label for 'high'", () => {
    expect(PRIORITY_LABEL.high).toBe("High");
  });
});

describe("STATUS_OPTIONS", () => {
  it("has three items", () => {
    expect(STATUS_OPTIONS).toHaveLength(3);
  });

  it("each item has value and label", () => {
    for (const opt of STATUS_OPTIONS) {
      expect(opt).toHaveProperty("value");
      expect(opt).toHaveProperty("label");
    }
  });

  it("contains todo, inProgress, done values", () => {
    const values = STATUS_OPTIONS.map((o) => o.value);
    expect(values).toContain("todo");
    expect(values).toContain("inProgress");
    expect(values).toContain("done");
  });

  it("labels match STATUS_LABEL", () => {
    for (const opt of STATUS_OPTIONS) {
      expect(opt.label).toBe(STATUS_LABEL[opt.value]);
    }
  });
});

describe("PRIORITY_OPTIONS", () => {
  it("has three items", () => {
    expect(PRIORITY_OPTIONS).toHaveLength(3);
  });

  it("each item has value and label", () => {
    for (const opt of PRIORITY_OPTIONS) {
      expect(opt).toHaveProperty("value");
      expect(opt).toHaveProperty("label");
    }
  });

  it("contains low, medium, high values", () => {
    const values = PRIORITY_OPTIONS.map((o) => o.value);
    expect(values).toContain("low");
    expect(values).toContain("medium");
    expect(values).toContain("high");
  });

  it("labels match PRIORITY_LABEL", () => {
    for (const opt of PRIORITY_OPTIONS) {
      expect(opt.label).toBe(PRIORITY_LABEL[opt.value]);
    }
  });
});

describe("STATUS_CLASS", () => {
  it("has a CSS class string for 'todo'", () => {
    expect(STATUS_CLASS.todo).toContain("bg-slate-100");
    expect(STATUS_CLASS.todo).toContain("text-slate-700");
  });

  it("has a CSS class string for 'inProgress'", () => {
    expect(STATUS_CLASS.inProgress).toContain("bg-blue-100");
    expect(STATUS_CLASS.inProgress).toContain("text-blue-700");
  });

  it("has a CSS class string for 'done'", () => {
    expect(STATUS_CLASS.done).toContain("bg-green-100");
    expect(STATUS_CLASS.done).toContain("text-green-700");
  });
});

describe("PRIORITY_CLASS", () => {
  it("has a CSS class string for 'low'", () => {
    expect(PRIORITY_CLASS.low).toContain("bg-green-100");
    expect(PRIORITY_CLASS.low).toContain("text-green-700");
  });

  it("has a CSS class string for 'medium'", () => {
    expect(PRIORITY_CLASS.medium).toContain("bg-amber-100");
    expect(PRIORITY_CLASS.medium).toContain("text-amber-700");
  });

  it("has a CSS class string for 'high'", () => {
    expect(PRIORITY_CLASS.high).toContain("bg-red-100");
    expect(PRIORITY_CLASS.high).toContain("text-red-700");
  });
});
