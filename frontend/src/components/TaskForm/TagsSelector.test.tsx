import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagsSelector from "./TagsSelector";
import type { Tag } from "@task-app/shared";

const tags: Tag[] = [
  { id: "tag-1", name: "Frontend" },
  { id: "tag-2", name: "Backend" },
  { id: "tag-3", name: "Bug" },
];

describe("TagsSelector", () => {
  it("renders the 'Tags' heading", () => {
    render(
      <TagsSelector tags={tags} selectedTagIds={[]} onToggle={vi.fn()} />
    );
    expect(screen.getByText("Tags")).toBeInTheDocument();
  });

  it("renders a checkbox for each tag", () => {
    render(
      <TagsSelector tags={tags} selectedTagIds={[]} onToggle={vi.fn()} />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });

  it("renders tag names as labels", () => {
    render(
      <TagsSelector tags={tags} selectedTagIds={[]} onToggle={vi.fn()} />
    );
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Bug")).toBeInTheDocument();
  });

  it("shows 'No tags available.' when tags array is empty", () => {
    render(
      <TagsSelector tags={[]} selectedTagIds={[]} onToggle={vi.fn()} />
    );
    expect(screen.getByText("No tags available.")).toBeInTheDocument();
  });

  it("does not show 'No tags available.' when tags exist", () => {
    render(
      <TagsSelector tags={tags} selectedTagIds={[]} onToggle={vi.fn()} />
    );
    expect(screen.queryByText("No tags available.")).not.toBeInTheDocument();
  });

  it("marks selected tags as checked", () => {
    render(
      <TagsSelector tags={tags} selectedTagIds={["tag-1", "tag-3"]} onToggle={vi.fn()} />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    // Find by data-state since Radix uses data-state="checked"
    const frontendCb = checkboxes.find((cb) => {
      return cb.closest("label")?.textContent?.includes("Frontend");
    });
    const bugCb = checkboxes.find((cb) => {
      return cb.closest("label")?.textContent?.includes("Bug");
    });
    expect(frontendCb).toHaveAttribute("data-state", "checked");
    expect(bugCb).toHaveAttribute("data-state", "checked");
  });

  it("marks unselected tags as unchecked", () => {
    render(
      <TagsSelector tags={tags} selectedTagIds={["tag-1"]} onToggle={vi.fn()} />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    const backendCb = checkboxes.find((cb) => {
      return cb.closest("label")?.textContent?.includes("Backend");
    });
    expect(backendCb).toHaveAttribute("data-state", "unchecked");
  });

  it("calls onToggle with updated ids when an unchecked tag is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TagsSelector tags={tags} selectedTagIds={["tag-1"]} onToggle={onToggle} />
    );
    // Click "Backend" to add it
    const checkboxes = screen.getAllByRole("checkbox");
    const backendCb = checkboxes.find((cb) => {
      return cb.closest("label")?.textContent?.includes("Backend");
    })!;
    await user.click(backendCb);
    expect(onToggle).toHaveBeenCalledWith(["tag-1", "tag-2"]);
  });

  it("calls onToggle without the tag id when a checked tag is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TagsSelector tags={tags} selectedTagIds={["tag-1", "tag-2"]} onToggle={onToggle} />
    );
    // Click "Frontend" to remove it
    const checkboxes = screen.getAllByRole("checkbox");
    const frontendCb = checkboxes.find((cb) => {
      return cb.closest("label")?.textContent?.includes("Frontend");
    })!;
    await user.click(frontendCb);
    expect(onToggle).toHaveBeenCalledWith(["tag-2"]);
  });

  it("does not render an error element when error prop is absent", () => {
    render(
      <TagsSelector tags={tags} selectedTagIds={[]} onToggle={vi.fn()} />
    );
    const destructive = document.querySelector(".text-destructive");
    expect(destructive).toBeNull();
  });

  it("shows error message when error prop is provided", () => {
    render(
      <TagsSelector
        tags={tags}
        selectedTagIds={[]}
        onToggle={vi.fn()}
        error="At least one tag is required"
      />
    );
    expect(screen.getByText("At least one tag is required")).toBeInTheDocument();
  });

  it("renders no checkboxes when tags array is empty", () => {
    render(
      <TagsSelector tags={[]} selectedTagIds={[]} onToggle={vi.fn()} />
    );
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });
});
