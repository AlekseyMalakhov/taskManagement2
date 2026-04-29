import { render, screen } from "@testing-library/react"
import TitleInput from "./TitleInput"

describe("TitleInput", () => {
  it("renders a label with text 'Title'", () => {
    render(<TitleInput />)
    expect(screen.getByText("Title")).toBeInTheDocument()
  })

  it("renders a text input", () => {
    render(<TitleInput />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("associates label with input via htmlFor", () => {
    render(<TitleInput />)
    const input = screen.getByRole("textbox")
    expect(screen.getByLabelText("Title")).toBe(input)
  })

  it("shows error message when error prop is provided", () => {
    render(<TitleInput error="Title is required" />)
    expect(screen.getByText("Title is required")).toBeInTheDocument()
  })

  it("does not show error element when error prop is absent", () => {
    render(<TitleInput />)
    expect(screen.queryByText(/./)).not.toHaveClass("text-destructive")
  })

  it("forwards extra props to the input element", () => {
    render(<TitleInput placeholder="Enter title" defaultValue="My task" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("placeholder", "Enter title")
    expect(input).toHaveValue("My task")
  })
})
