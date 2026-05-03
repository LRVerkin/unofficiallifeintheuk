import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup } from "@/components/react/RadioGroup";

const options = [
  { id: 1, label: "Waitrose" },
  { id: 2, label: "M&S" },
  { id: 3, label: "Tesco" },
];

describe("<RadioGroup />", () => {
  it("uses a fieldset/legend pair for the question prompt", () => {
    render(
      <RadioGroup
        legend="Pick the poshest"
        name="q1"
        options={options}
        value={null}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("group", { name: "Pick the poshest" })).toBeInTheDocument();
  });

  it("marks the option matching `value` as checked", () => {
    render(
      <RadioGroup
        legend="Pick the poshest"
        name="q1"
        options={options}
        value={2}
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Waitrose")).not.toBeChecked();
    expect(screen.getByLabelText("M&S")).toBeChecked();
    expect(screen.getByLabelText("Tesco")).not.toBeChecked();
  });

  it("calls onChange with the selected option id when a radio is clicked", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        legend="Pick"
        name="q1"
        options={options}
        value={null}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByLabelText("Tesco"));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(3);
  });

  it("forwards aria-describedby to the fieldset", () => {
    render(
      <RadioGroup
        legend="Pick"
        name="q1"
        options={options}
        value={null}
        onChange={() => {}}
        describedBy="hint-1"
      />,
    );
    expect(screen.getByRole("group")).toHaveAttribute("aria-describedby", "hint-1");
  });
});
