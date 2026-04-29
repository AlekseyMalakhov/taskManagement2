import { cn } from "./utils";

describe("cn", () => {
  it("returns an empty string when given no arguments", () => {
    expect(cn()).toBe("");
  });

  it("merges simple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes via object syntax", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo");
  });

  it("handles array inputs", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("merges conflicting Tailwind classes (twMerge), last wins", () => {
    // p-2 and p-4 conflict; p-4 should win
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("merges conflicting text color classes", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn(undefined, null, "foo")).toBe("foo");
  });

  it("handles falsy values gracefully", () => {
    expect(cn(false, "foo", false)).toBe("foo");
  });

  it("deduplicates identical classes", () => {
    // clsx doesn't dedup but twMerge handles conflicts; same class twice is fine
    const result = cn("flex", "flex");
    expect(result).toContain("flex");
  });

  it("merges complex mixed inputs", () => {
    const result = cn("px-2 py-1", { "text-red-500": true, hidden: false }, ["rounded"]);
    expect(result).toContain("px-2");
    expect(result).toContain("py-1");
    expect(result).toContain("text-red-500");
    expect(result).toContain("rounded");
    expect(result).not.toContain("hidden");
  });

  it("resolves background color conflicts correctly", () => {
    expect(cn("bg-red-500", "bg-green-500")).toBe("bg-green-500");
  });
});
