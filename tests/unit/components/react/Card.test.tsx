import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/react/Card";

describe("<Card />", () => {
  it("renders children inside a section by default", () => {
    render(
      <Card aria-label="Question card">
        <p>Body</p>
      </Card>,
    );
    const region = screen.getByRole("region", { name: "Question card" });
    expect(region.tagName.toLowerCase()).toBe("section");
    expect(region).toHaveTextContent("Body");
  });

  it("supports the `as` prop for semantic overrides", () => {
    render(
      <Card as="article" aria-label="Result">
        <p>Result body</p>
      </Card>,
    );
    expect(screen.getByRole("article", { name: "Result" })).toBeInTheDocument();
  });

  it("merges a custom className with the base classes", () => {
    const { container } = render(
      <Card className="extra-class" data-testid="card">
        <p>x</p>
      </Card>,
    );
    const section = container.querySelector("section")!;
    expect(section.className).toMatch(/extra-class/);
    expect(section.className).toMatch(/border/);
  });
});
