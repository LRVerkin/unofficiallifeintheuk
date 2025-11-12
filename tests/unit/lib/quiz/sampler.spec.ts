import { describe, expect, it } from "vitest";
import { pickQuestions, shuffleQuestions, ensureSeed } from "@/lib/quiz/sampler";

const mockQuestions = Array.from({ length: 5 }, (_, index) => ({
  id: `Q${index}`,
  type: "single",
  prompt: "mock",
  required: true,
  tags: ["test"],
  specialRules: [],
  options: [
    { id: 1, label: "One" },
    { id: 2, label: "Two" },
  ],
  correct: [1],
}));

describe("sampler", () => {
  it("produces deterministic shuffles given identical seeds", () => {
    const seed = ensureSeed("demo-seed");
    const first = shuffleQuestions(mockQuestions, seed);
    const second = shuffleQuestions(mockQuestions, seed);
    expect(second).toEqual(first);
  });

  it("samples up to the requested number of questions", () => {
    const sample = pickQuestions(mockQuestions, 3, "demo");
    expect(sample).toHaveLength(3);
    const limited = pickQuestions(mockQuestions, 10, "demo");
    expect(limited).toHaveLength(5);
  });
});
