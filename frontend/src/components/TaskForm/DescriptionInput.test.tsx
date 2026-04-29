import { render, screen } from "@testing-library/react";
import DescriptionInput from "./DescriptionInput";

describe("DescriptionInput", () => {
  it("renders a label with text 'Description'", () => {
    render(<DescriptionInput />);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders a textarea element", () => {
    render(<DescriptionInput />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("associates the label with the textarea via htmlFor", () => {
    render(<DescriptionInput />);
    const textarea = screen.getByRole("textbox");
    expect(screen.getByLabelText("Description")).toBe(textarea);
  });

  it("forwards extra props to the textarea element", () => {
    render(<DescriptionInput placeholder="Enter description" defaultValue="Some text" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("placeholder", "Enter description");
    expect(textarea).toHaveValue("Some text");
  });

  it("does not render an error element when error prop is absent", () => {
    render(<DescriptionInput />);
    // No error paragraph should be present
    const paras = document.querySelectorAll("p");
    paras.forEach((p) => {
      expect(p).not.toHaveClass("text-destructive");
    });
  });

  it("does not show an error message when error prop is not provided", () => {
    render(<DescriptionInput />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("renders the textarea inside a wrapper div", () => {
    render(<DescriptionInput />);
    const textarea = screen.getByRole("textbox");
    expect(textarea.closest("div")).toBeInTheDocument();
  });

  it("forwards disabled prop to the textarea", () => {
    render(<DescriptionInput disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("forwards maxLength prop to the textarea", () => {
    render(<DescriptionInput maxLength={500} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "500");
  });
});
