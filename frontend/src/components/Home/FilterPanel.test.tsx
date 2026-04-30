import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { MemoryRouter, Route, Routes, useSearchParams } from "react-router-dom";
import FilterPanel from "./FilterPanel";

// Helper to capture the current search params for assertions
let capturedParams: URLSearchParams;
function ParamCapture() {
  const [params] = useSearchParams();
  useEffect(() => {
    capturedParams = params;
  });
  return null;
}

function renderFilterPanel(initialSearch = "") {
  const entry = initialSearch ? `/?${initialSearch}` : "/";
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <FilterPanel />
              <ParamCapture />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("FilterPanel", () => {
  it("renders the search text input", () => {
    renderFilterPanel();
    expect(screen.getByPlaceholderText("Search tasks…")).toBeInTheDocument();
  });

  it("renders a status select", () => {
    renderFilterPanel();
    expect(screen.getByDisplayValue("All statuses")).toBeInTheDocument();
  });

  it("renders a priority select", () => {
    renderFilterPanel();
    expect(screen.getByDisplayValue("All priorities")).toBeInTheDocument();
  });

  it("renders a sort select", () => {
    renderFilterPanel();
    expect(screen.getByDisplayValue("Created: newest first")).toBeInTheDocument();
  });

  it("status select contains all status options", () => {
    renderFilterPanel();
    expect(screen.getByRole("option", { name: "To Do" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "In Progress" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Done" })).toBeInTheDocument();
  });

  it("priority select contains all priority options", () => {
    renderFilterPanel();
    expect(screen.getByRole("option", { name: "Low" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Medium" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "High" })).toBeInTheDocument();
  });

  it("reflects initial search param in the search input", () => {
    renderFilterPanel("search=hello");
    expect(screen.getByPlaceholderText("Search tasks…")).toHaveValue("hello");
  });

  it("reflects initial status param in the status select", () => {
    renderFilterPanel("status=todo");
    expect(screen.getByDisplayValue("To Do")).toBeInTheDocument();
  });

  it("reflects initial priority param in the priority select", () => {
    renderFilterPanel("priority=high");
    expect(screen.getByDisplayValue("High")).toBeInTheDocument();
  });

  it("typing in search input updates ?search= param and removes ?page=", async () => {
    const user = userEvent.setup();
    renderFilterPanel("page=3");
    const input = screen.getByPlaceholderText("Search tasks…");
    await user.clear(input);
    await user.type(input, "my task");
    expect(capturedParams.get("search")).toBe("my task");
    expect(capturedParams.get("page")).toBeNull();
  });

  it("selecting a status updates ?status= param and removes ?page=", async () => {
    const user = userEvent.setup();
    renderFilterPanel("page=2");
    const statusSelect = screen.getByDisplayValue("All statuses");
    await user.selectOptions(statusSelect, "inProgress");
    expect(capturedParams.get("status")).toBe("inProgress");
    expect(capturedParams.get("page")).toBeNull();
  });

  it("selecting 'All statuses' removes ?status= param", async () => {
    const user = userEvent.setup();
    renderFilterPanel("status=todo");
    const statusSelect = screen.getByDisplayValue("To Do");
    await user.selectOptions(statusSelect, "");
    expect(capturedParams.get("status")).toBeNull();
  });

  it("selecting a priority updates ?priority= param and removes ?page=", async () => {
    const user = userEvent.setup();
    renderFilterPanel("page=5");
    const prioritySelect = screen.getByDisplayValue("All priorities");
    await user.selectOptions(prioritySelect, "high");
    expect(capturedParams.get("priority")).toBe("high");
    expect(capturedParams.get("page")).toBeNull();
  });

  it("selecting a sort option updates ?sort= param and removes ?page=", async () => {
    const user = userEvent.setup();
    renderFilterPanel("page=2");
    const sortSelect = screen.getByDisplayValue("Created: newest first");
    await user.selectOptions(sortSelect, "deadline_asc");
    expect(capturedParams.get("sort")).toBe("deadline_asc");
    expect(capturedParams.get("page")).toBeNull();
  });

  it("sort select has all sort options", () => {
    renderFilterPanel();
    expect(screen.getByRole("option", { name: "Created: newest first" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Created: oldest first" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Deadline: soonest first" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Deadline: latest first" })).toBeInTheDocument();
  });
});
