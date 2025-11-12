import { describe, expect, it } from "vitest";
import { validateResponse, canAdvance } from "@/lib/quiz/validators";
import type { QuizQuestion } from "@/lib/quiz/types";

const multiQuestion: QuizQuestion = {
  id: "Q1",
  type: "multiple",
  prompt: "Pick two",
  required: true,
  tags: ["test"],
  specialRules: [],
  options: [
    { id: 1, label: "A" },
    { id: 2, label: "B" },
    { id: 3, label: "C" },
  ],
  correct: [1, 2],
};

describe("validators", () => {
  it("deduplicates multi-select answers", () => {
    const validated = validateResponse(multiQuestion, {
      questionId: "Q1",
      type: "multiple",
      value: [1, 1, 2, 4],
      status: "answered",
    });
    expect(validated.value).toEqual([1, 2]);
    expect(validated.status).toBe("answered");
  });

  it("prevents advancing when required answers are missing", () => {
    const response = validateResponse(multiQuestion, {
      questionId: "Q1",
      type: "multiple",
      value: [],
      status: "unanswered",
    });
    expect(canAdvance(multiQuestion, response)).toBe(false);
  });
});
