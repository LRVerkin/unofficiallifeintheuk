import { describe, expect, it } from "vitest";
import { getPersonaForPercentage } from "@/lib/personas";

describe("persona resolver", () => {
  it("returns personas for score percentage", () => {
    const topPersona = getPersonaForPercentage(0.95);
    expect(topPersona.minPercentage).toBeGreaterThanOrEqual(90);
    const bottomPersona = getPersonaForPercentage(0.1);
    expect(bottomPersona.minPercentage).toBe(0);
  });
});
