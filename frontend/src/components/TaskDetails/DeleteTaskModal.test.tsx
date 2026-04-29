import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteTaskModal from "./DeleteTaskModal";

function renderModal(overrides: Partial<React.ComponentProps<typeof DeleteTaskModal>> = {}) {
  const props = {
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
    isDeleting: false,
    isError: false,
    ...overrides,
  };
  return { ...render(<DeleteTaskModal {...props} />), props };
}

describe("DeleteTaskModal", () => {
  it("renders the confirmation heading", () => {
    renderModal();
    expect(screen.getByText("Delete task?")).toBeInTheDocument();
  });

  it("renders the warning description text", () => {
    renderModal();
    expect(
      screen.getByText(/This action cannot be undone/i)
    ).toBeInTheDocument();
  });

  it("renders Cancel and Delete buttons", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onCancel when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const { props } = renderModal();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Delete button is clicked", async () => {
    const user = userEvent.setup();
    const { props } = renderModal();
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("shows 'Deleting…' text and disables buttons when isDeleting=true", () => {
    renderModal({ isDeleting: true });
    expect(screen.getByText("Deleting…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Deleting…" })).toBeDisabled();
  });

  it("does not show error message when isError=false", () => {
    renderModal({ isError: false });
    expect(
      screen.queryByText(/Failed to delete task/i)
    ).not.toBeInTheDocument();
  });

  it("shows error message when isError=true", () => {
    renderModal({ isError: true });
    expect(
      screen.getByText(/Failed to delete task/i)
    ).toBeInTheDocument();
  });

  it("Cancel button is enabled by default", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
  });

  it("Delete button is enabled by default", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Delete" })).not.toBeDisabled();
  });

  it("does not call onConfirm when button is disabled (isDeleting=true)", async () => {
    const user = userEvent.setup();
    const { props } = renderModal({ isDeleting: true });
    // Buttons are disabled, user-event should not trigger clicks
    await user.click(screen.getByRole("button", { name: "Deleting…" }));
    expect(props.onConfirm).not.toHaveBeenCalled();
  });
});
