import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextAnswer } from "@/components/react/TextAnswer";

describe("<TextAnswer />", () => {
  it("links the label to the input via htmlFor/id", () => {
    render(
      <TextAnswer label="Say sorted" name="q6" value="" onChange={() => {}} />,
    );
    const input = screen.getByLabelText("Say sorted");
    expect(input).toHaveAttribute("id", "q6");
    expect(input.tagName.toLowerCase()).toBe("input");
  });

  it("fires onChange with the typed value", async () => {
    const onChange = vi.fn();
    render(<TextAnswer label="Say" name="q6" value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Say"), "sorted");
    expect(onChange).toHaveBeenCalled();
    // userEvent.type fires onChange per character; check the last call argument
    expect(onChange.mock.calls.at(-1)?.[0]).toBe("d");
  });

  it("renders the hint and links it via aria-describedby", () => {
    render(
      <TextAnswer
        label="Say"
        name="q6"
        value=""
        onChange={() => {}}
        hint="Case-insensitive, typos welcome."
      />,
    );
    const input = screen.getByLabelText("Say");
    const hint = screen.getByText("Case-insensitive, typos welcome.");
    expect(input.getAttribute("aria-describedby")).toContain(hint.getAttribute("id"));
  });

  it("marks the input as invalid and shows an alert when error is set", () => {
    render(
      <TextAnswer
        label="Say"
        name="q6"
        value="x"
        onChange={() => {}}
        error="Must be at least one word."
      />,
    );
    const input = screen.getByLabelText("Say");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Must be at least one word.");
  });

  it("respects maxLength", async () => {
    const onChange = vi.fn();
    render(
      <TextAnswer
        label="Say"
        name="q6"
        value=""
        onChange={onChange}
        maxLength={3}
      />,
    );
    expect(screen.getByLabelText("Say")).toHaveAttribute("maxLength", "3");
  });
});
