import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PriorityRadioGroup from "./PriorityRadioGroup";

describe("PriorityRadioGroup", () => {
  it("renders the 'Priority' heading", () => {
    render(<PriorityRadioGroup defaultValue="low" onValueChange={vi.fn()} />);
    expect(screen.getByText("Priority")).toBeInTheDocument();
  });

  it("renders 'Low' option", () => {
    render(<PriorityRadioGroup defaultValue="low" onValueChange={vi.fn()} />);
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  it("renders 'Medium' option", () => {
    render(<PriorityRadioGroup defaultValue="low" onValueChange={vi.fn()} />);
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders 'High' option", () => {
    render(<PriorityRadioGroup defaultValue="low" onValueChange={vi.fn()} />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders exactly three radio inputs", () => {
    render(<PriorityRadioGroup defaultValue="low" onValueChange={vi.fn()} />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
  });

  it("pre-selects 'low' when defaultValue is 'low'", () => {
    render(<PriorityRadioGroup defaultValue="low" onValueChange={vi.fn()} />);
    const lowRadio = screen.getByRole("radio", { name: "Low" });
    expect(lowRadio).toHaveAttribute("data-state", "checked");
  });

  it("pre-selects 'medium' when defaultValue is 'medium'", () => {
    render(<PriorityRadioGroup defaultValue="medium" onValueChange={vi.fn()} />);
    const mediumRadio = screen.getByRole("radio", { name: "Medium" });
    expect(mediumRadio).toHaveAttribute("data-state", "checked");
  });

  it("pre-selects 'high' when defaultValue is 'high'", () => {
    render(<PriorityRadioGroup defaultValue="high" onValueChange={vi.fn()} />);
    const highRadio = screen.getByRole("radio", { name: "High" });
    expect(highRadio).toHaveAttribute("data-state", "checked");
  });

  it("calls onValueChange with 'medium' when Medium radio is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PriorityRadioGroup defaultValue="low" onValueChange={onValueChange} />);
    const mediumRadio = screen.getByRole("radio", { name: "Medium" });
    await user.click(mediumRadio);
    expect(onValueChange).toHaveBeenCalledWith("medium");
  });

  it("calls onValueChange with 'high' when High radio is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PriorityRadioGroup defaultValue="low" onValueChange={onValueChange} />);
    const highRadio = screen.getByRole("radio", { name: "High" });
    await user.click(highRadio);
    expect(onValueChange).toHaveBeenCalledWith("high");
  });

  it("calls onValueChange with 'low' when Low radio is clicked from another selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PriorityRadioGroup defaultValue="high" onValueChange={onValueChange} />);
    const lowRadio = screen.getByRole("radio", { name: "Low" });
    await user.click(lowRadio);
    expect(onValueChange).toHaveBeenCalledWith("low");
  });
});
