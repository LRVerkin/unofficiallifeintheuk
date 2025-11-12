import { describe, expect, it } from "vitest";
import { isResponseCorrect } from "@/lib/quiz/scoring";
import type { QuizQuestion } from "@/lib/quiz/types";

const singleQuestion: QuizQuestion = {
  id: "Q1",
  type: "single",
  prompt: "Pick",
  required: true,
  tags: ["test"],
  specialRules: [],
  options: [
    { id: 1, label: "A" },
    { id: 2, label: "B" },
  ],
  correct: [1, 2],
};

const textQuestion: QuizQuestion = {
  id: "Q2",
  type: "text",
  prompt: "Say sorted",
  required: true,
  tags: ["test"],
  specialRules: [],
  acceptableAnswers: ["sorted"],
  textValidation: {
    strategy: "exact",
    normalizeCase: true,
    trimWhitespace: true,
    fuzzyThreshold: 0.85,
  },
};

describe("scoring", () => {
  it("accepts any allowed single-choice answer", () => {
    expect(
      isResponseCorrect(singleQuestion, {
        questionId: "Q1",
        type: "single",
        value: 2,
        status: "answered",
      }),
    ).toBe(true);
  });

  it("applies fuzzy matching for text answers", () => {
    expect(
      isResponseCorrect(textQuestion, {
        questionId: "Q2",
        type: "text",
        value: "sorrted",
        status: "answered",
      }),
    ).toBe(true);
    expect(
      isResponseCorrect(textQuestion, {
        questionId: "Q2",
        type: "text",
        value: "sort",
        status: "answered",
      }),
    ).toBe(false);
  });
});
