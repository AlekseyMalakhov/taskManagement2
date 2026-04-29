import { render, screen } from "@testing-library/react";
import StatusSelect from "./StatusSelect";

describe("StatusSelect", () => {
  it("renders a label with text 'Status'", () => {
    render(<StatusSelect />);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders a select element", () => {
    render(<StatusSelect />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("associates the label with the select via htmlFor", () => {
    render(<StatusSelect />);
    const select = screen.getByRole("combobox");
    expect(screen.getByLabelText("Status")).toBe(select);
  });

  it("renders the 'To Do' option", () => {
    render(<StatusSelect />);
    expect(screen.getByRole("option", { name: "To Do" })).toBeInTheDocument();
  });

  it("renders the 'In Progress' option", () => {
    render(<StatusSelect />);
    expect(screen.getByRole("option", { name: "In Progress" })).toBeInTheDocument();
  });

  it("renders the 'Done' option", () => {
    render(<StatusSelect />);
    expect(screen.getByRole("option", { name: "Done" })).toBeInTheDocument();
  });

  it("renders exactly three options", () => {
    render(<StatusSelect />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
  });

  it("forwards defaultValue prop to the select", () => {
    render(<StatusSelect defaultValue="inProgress" />);
    expect(screen.getByRole("combobox")).toHaveValue("inProgress");
  });

  it("forwards disabled prop to the select", () => {
    render(<StatusSelect disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("forwards extra props to the select element", () => {
    const onChange = vi.fn();
    render(<StatusSelect onChange={onChange} defaultValue="todo" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("todo");
  });
});
