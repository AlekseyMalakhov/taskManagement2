import { render, screen } from "@testing-library/react";
import DeadlineInput from "./DeadlineInput";

describe("DeadlineInput", () => {
  it("renders a label with text 'Deadline'", () => {
    render(<DeadlineInput />);
    expect(screen.getByText("Deadline")).toBeInTheDocument();
  });

  it("renders a date input element", () => {
    render(<DeadlineInput />);
    const input = screen.getByLabelText("Deadline");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "date");
  });

  it("associates the label with the input via htmlFor", () => {
    render(<DeadlineInput />);
    const input = document.querySelector("input[type='date']")!;
    expect(screen.getByLabelText("Deadline")).toBe(input);
  });

  it("does not render an error element when error prop is absent", () => {
    render(<DeadlineInput />);
    const paras = document.querySelectorAll("p");
    paras.forEach((p) => {
      expect(p.textContent).not.toBeTruthy();
    });
    // Nothing with text-destructive should be present
    const destructive = document.querySelector(".text-destructive");
    expect(destructive).toBeNull();
  });

  it("shows an error message when error prop is provided", () => {
    render(<DeadlineInput error="Deadline is required" />);
    expect(screen.getByText("Deadline is required")).toBeInTheDocument();
  });

  it("error message is not shown when error prop is undefined", () => {
    render(<DeadlineInput error={undefined} />);
    expect(screen.queryByText(/deadline/i)?.tagName).not.toBe("P");
  });

  it("forwards defaultValue prop to the input", () => {
    render(<DeadlineInput defaultValue="2026-05-01" />);
    const input = document.querySelector("input[type='date']") as HTMLInputElement;
    expect(input.value).toBe("2026-05-01");
  });

  it("forwards disabled prop to the input", () => {
    render(<DeadlineInput disabled />);
    const input = document.querySelector("input[type='date']")!;
    expect(input).toBeDisabled();
  });

  it("forwards min prop to the input", () => {
    render(<DeadlineInput min="2026-04-29" />);
    const input = document.querySelector("input[type='date']")!;
    expect(input).toHaveAttribute("min", "2026-04-29");
  });
});
