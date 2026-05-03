import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/components/react/ProgressBar";

describe("<ProgressBar />", () => {
  it("renders the progressbar role with correct ARIA values", () => {
    render(<ProgressBar current={7} total={24} />);
    const bar = screen.getByRole("progressbar", { name: "Quiz progress" });
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "24");
    expect(bar).toHaveAttribute("aria-valuenow", "7");
    expect(bar).toHaveAttribute("aria-valuetext", "Question 7 of 24");
  });

  it("displays the visible 'Question N of M' text and rounded percentage", () => {
    render(<ProgressBar current={6} total={24} />);
    expect(screen.getByText("Question 6 of 24")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("clamps current to [0, total]", () => {
    render(<ProgressBar current={50} total={24} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "24");
  });

  it("clamps negative current to 0", () => {
    render(<ProgressBar current={-3} total={24} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("supports a custom accessible label", () => {
    render(<ProgressBar current={1} total={5} label="Section progress" />);
    expect(screen.getByRole("progressbar", { name: "Section progress" })).toBeInTheDocument();
  });
});
