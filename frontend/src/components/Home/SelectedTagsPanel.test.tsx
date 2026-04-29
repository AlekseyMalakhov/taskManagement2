import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SelectedTagsPanel from "./SelectedTagsPanel";
import type { Tag } from "@task-app/shared";

const tags: Tag[] = [
  { id: "tag-1", name: "Frontend" },
  { id: "tag-2", name: "Backend" },
  { id: "tag-3", name: "Bug" },
];

const tagsById = new Map(tags.map((t) => [t.id, t]));

function renderPanel(
  selectedTagIds: Set<string>,
  onTagClick = vi.fn()
) {
  return render(
    <MemoryRouter>
      <SelectedTagsPanel
        selectedTagIds={selectedTagIds}
        tagsById={tagsById}
        onTagClick={onTagClick}
      />
    </MemoryRouter>
  );
}

describe("SelectedTagsPanel", () => {
  it("renders nothing when no tags are selected", () => {
    const { container } = renderPanel(new Set());
    expect(container.firstChild).toBeNull();
  });

  it("renders the 'Filtered by:' label when tags are selected", () => {
    renderPanel(new Set(["tag-1"]));
    expect(screen.getByText("Filtered by:")).toBeInTheDocument();
  });

  it("shows a chip for each selected tag", () => {
    renderPanel(new Set(["tag-1", "tag-2"]));
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("does not show chips for unselected tags", () => {
    renderPanel(new Set(["tag-1"]));
    expect(screen.queryByText("Backend")).not.toBeInTheDocument();
    expect(screen.queryByText("Bug")).not.toBeInTheDocument();
  });

  it("calls onTagClick with correct tagId when chip is clicked", async () => {
    const user = userEvent.setup();
    const onTagClick = vi.fn();
    renderPanel(new Set(["tag-1", "tag-2"]), onTagClick);

    const frontendChip = screen.getByText("Frontend").closest("button")!;
    await user.click(frontendChip);
    expect(onTagClick).toHaveBeenCalledWith("tag-1");
    expect(onTagClick).toHaveBeenCalledTimes(1);
  });

  it("calls onTagClick with correct tagId when second chip is clicked", async () => {
    const user = userEvent.setup();
    const onTagClick = vi.fn();
    renderPanel(new Set(["tag-1", "tag-2"]), onTagClick);

    const backendChip = screen.getByText("Backend").closest("button")!;
    await user.click(backendChip);
    expect(onTagClick).toHaveBeenCalledWith("tag-2");
  });

  it("falls back to tagId as chip label when tag not found in tagsById", () => {
    const partialTagsById = new Map<string, Tag>(); // empty map
    render(
      <MemoryRouter>
        <SelectedTagsPanel
          selectedTagIds={new Set(["unknown-tag"])}
          tagsById={partialTagsById}
          onTagClick={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("unknown-tag")).toBeInTheDocument();
  });

  it("renders all three tag chips when all three are selected", () => {
    renderPanel(new Set(["tag-1", "tag-2", "tag-3"]));
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Bug")).toBeInTheDocument();
  });
});
