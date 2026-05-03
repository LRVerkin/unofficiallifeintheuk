import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxGroup } from "@/components/react/CheckboxGroup";

const options = [
  { id: 1, label: "Sunglasses" },
  { id: 2, label: "Sunscreen" },
  { id: 3, label: "Light jacket" },
  { id: 4, label: "Umbrella" },
];

describe("<CheckboxGroup />", () => {
  it("uses a fieldset/legend pair", () => {
    render(
      <CheckboxGroup
        legend="What must you bring?"
        name="q19"
        options={options}
        value={[]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("group", { name: "What must you bring?" })).toBeInTheDocument();
  });

  it("renders pre-checked items from `value`", () => {
    render(
      <CheckboxGroup
        legend="What must you bring?"
        name="q19"
        options={options}
        value={[2, 4]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Sunscreen")).toBeChecked();
    expect(screen.getByLabelText("Umbrella")).toBeChecked();
    expect(screen.getByLabelText("Sunglasses")).not.toBeChecked();
  });

  it("adds an option to the selection when checked", async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup
        legend="What"
        name="q19"
        options={options}
        value={[1]}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByLabelText("Umbrella"));
    expect(onChange).toHaveBeenCalledExactlyOnceWith([1, 4]);
  });

  it("removes an option from the selection when unchecked", async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup
        legend="What"
        name="q19"
        options={options}
        value={[2, 4]}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByLabelText("Sunscreen"));
    expect(onChange).toHaveBeenCalledExactlyOnceWith([4]);
  });

  it("returns the selection in ascending order", async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup
        legend="What"
        name="q19"
        options={options}
        value={[3]}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByLabelText("Sunglasses"));
    expect(onChange).toHaveBeenCalledExactlyOnceWith([1, 3]);
  });
});
