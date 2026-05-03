import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PersonaCard } from "@/components/react/PersonaCard";
import type { Persona } from "@/data/personas";

const persona: Persona = {
  id: "ROYAL_STANDARD",
  name: "The Royal Standard Bearer",
  headline: "You bleed Earl Grey.",
  description: "You recite the shipping forecast by heart.",
  minPercentage: 90,
  badgeColor: "#D4003C",
  image: {
    light: "/personas/royal.svg",
    dark: "/personas/royal-dark.svg",
    alt: "Illustration of a royal figure",
  },
};

describe("<PersonaCard />", () => {
  it("renders the persona's name, headline, and description", () => {
    render(<PersonaCard persona={persona} score={22} total={24} />);
    expect(
      screen.getByRole("region", { name: "Result: The Royal Standard Bearer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "The Royal Standard Bearer" }),
    ).toBeInTheDocument();
    expect(screen.getByText("You bleed Earl Grey.")).toBeInTheDocument();
    expect(screen.getByText(/recite the shipping forecast/)).toBeInTheDocument();
  });

  it("renders the light image with alt text", () => {
    render(<PersonaCard persona={persona} score={22} total={24} />);
    const img = screen.getByAltText("Illustration of a royal figure");
    expect(img).toHaveAttribute("src", "/personas/royal.svg");
  });

  it("displays the percentage score and raw total", () => {
    render(<PersonaCard persona={persona} score={18} total={24} />);
    expect(screen.getByText("75% — 18 / 24")).toBeInTheDocument();
  });

  it("handles a zero-total without dividing by zero", () => {
    render(<PersonaCard persona={persona} score={0} total={0} />);
    expect(screen.getByText("0% — 0 / 0")).toBeInTheDocument();
  });
});
