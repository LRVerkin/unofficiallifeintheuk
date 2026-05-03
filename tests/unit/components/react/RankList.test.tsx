import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { RankList } from "@/components/react/RankList";

const supermarkets = [
  { id: 1, label: "Waitrose" },
  { id: 2, label: "M&S" },
  { id: 3, label: "Sainsbury’s" },
  { id: 4, label: "Tesco" },
  { id: 5, label: "Aldi" },
];

function Harness({ initial }: { initial: number[] }) {
  const [value, setValue] = useState(initial);
  return (
    <RankList
      legend="Rank by poshness"
      items={supermarkets}
      value={value}
      onChange={setValue}
    />
  );
}

describe("<RankList />", () => {
  it("renders items in the order specified by `value`", () => {
    render(<Harness initial={[5, 4, 3, 2, 1]} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((node) => node.textContent)).toEqual([
      expect.stringContaining("Aldi"),
      expect.stringContaining("Tesco"),
      expect.stringContaining("Sainsbury"),
      expect.stringContaining("M&S"),
      expect.stringContaining("Waitrose"),
    ]);
  });

  it("disables the first item's up button and the last item's down button", () => {
    render(<Harness initial={[1, 2, 3, 4, 5]} />);
    expect(screen.getByRole("button", { name: "Move Waitrose up" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move Aldi down" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move M&S up" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Move M&S down" })).toBeEnabled();
  });

  it("calls onChange with the swapped order when 'down' is clicked", async () => {
    const onChange = vi.fn();
    render(
      <RankList
        legend="Rank"
        items={supermarkets}
        value={[1, 2, 3, 4, 5]}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Move M&S down" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith([1, 3, 2, 4, 5]);
  });

  it("calls onChange with the swapped order when 'up' is clicked", async () => {
    const onChange = vi.fn();
    render(
      <RankList
        legend="Rank"
        items={supermarkets}
        value={[1, 2, 3, 4, 5]}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Move Tesco up" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith([1, 2, 4, 3, 5]);
  });

  it("announces the new position in a polite live region after a reorder", async () => {
    render(<Harness initial={[1, 2, 3, 4, 5]} />);
    const liveRegion = screen.getByRole("status");
    expect(liveRegion.textContent).toBe("");
    await userEvent.click(screen.getByRole("button", { name: "Move M&S down" }));
    expect(liveRegion.textContent).toBe("Moved M&S to position 3 of 5.");
  });

  it("keeps keyboard focus on the moved item's matching button after reorder", async () => {
    render(<Harness initial={[1, 2, 3, 4, 5]} />);
    await userEvent.click(screen.getByRole("button", { name: "Move M&S down" }));
    // After the move, M&S sits at position 3 — its down button is still enabled
    // and should now hold focus so a follow-up press continues moving it.
    expect(screen.getByRole("button", { name: "Move M&S down" })).toHaveFocus();
  });

  it("falls back to the opposite-direction button when the moved item hits a boundary", async () => {
    render(<Harness initial={[1, 2, 3, 4, 5]} />);
    // Move Tesco (id 4) up twice — second click lands it at index 1, but if we
    // started one row higher we'd land at the top. Walk it to the top:
    await userEvent.click(screen.getByRole("button", { name: "Move Waitrose down" }));
    // Now order is [M&S, Waitrose, Sainsbury's, Tesco, Aldi]; click Waitrose up
    // back to the top — its "up" button becomes disabled, so focus should fall
    // back to the still-enabled "down" button on the same row.
    await userEvent.click(screen.getByRole("button", { name: "Move Waitrose up" }));
    expect(screen.getByRole("button", { name: "Move Waitrose down" })).toHaveFocus();
  });
});
