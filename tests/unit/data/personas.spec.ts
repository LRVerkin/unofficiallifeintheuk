import { describe, expect, it } from "vitest";
import { personas } from "@/data/personas";

describe("persona metadata", () => {
  it("covers 0-100% with non-overlapping thresholds", () => {
    expect(personas.length).toBeGreaterThan(0);
    const sorted = [...personas].sort(
      (a, b) => a.minPercentage - b.minPercentage,
    );
    expect(sorted[0]?.minPercentage).toBe(0);
    for (let index = 1; index < sorted.length; index += 1) {
      expect(sorted[index].minPercentage).toBeGreaterThan(
        sorted[index - 1].minPercentage,
      );
    }
    expect(sorted[sorted.length - 1]?.minPercentage).toBeGreaterThanOrEqual(90);
  });
});
