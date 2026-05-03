import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/react/Button";

describe("<Button />", () => {
  it("renders its children as the label", () => {
    render(<Button>Take the test</Button>);
    expect(screen.getByRole("button", { name: "Take the test" })).toBeInTheDocument();
  });

  it("defaults to type=button so it doesn't submit forms accidentally", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("fires onClick when activated", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies the variant class for secondary", () => {
    render(<Button variant="secondary">Go</Button>);
    expect(screen.getByRole("button").className).toMatch(/border-2/);
  });

  it("forwards arbitrary aria attributes", () => {
    render(<Button aria-label="Submit answers">OK</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Submit answers");
  });
});
