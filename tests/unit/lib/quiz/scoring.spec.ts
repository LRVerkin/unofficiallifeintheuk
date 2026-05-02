import { describe, expect, it } from "vitest";
import { isResponseCorrect } from "@/lib/quiz/scoring";
import type { QuizQuestion } from "@/lib/quiz/types";

const singleQuestion: QuizQuestion = {
  id: "Q001",
  type: "single",
  prompt: "Pick",
  required: true,
  tags: ["test"],
  specialRules: [],
  credits: [],
  options: [
    { id: 1, label: "A" },
    { id: 2, label: "B" },
  ],
  correct: [1, 2],
};

const textQuestion: QuizQuestion = {
  id: "Q002",
  type: "text",
  prompt: "Say sorted",
  required: true,
  tags: ["test"],
  specialRules: [],
  credits: [],
  acceptableAnswers: ["sorted"],
  textValidation: {
    strategy: "exact",
    normalizeCase: true,
    trimWhitespace: true,
    fuzzyThreshold: 0.85,
  },
};

const failOnHintQuestion: QuizQuestion = {
  id: "Q007",
  type: "single",
  prompt: "Cuppa",
  required: true,
  tags: ["test"],
  specialRules: [{ kind: "fail_on_hint", hintId: "cuppa" }],
  credits: [],
  options: [
    { id: 1, label: "Morning" },
    { id: 2, label: "Always" },
  ],
  correct: [2],
};

const mustIncludeQuestion: QuizQuestion = {
  id: "Q019",
  type: "multiple",
  prompt: "Bring all of",
  required: true,
  tags: ["test"],
  specialRules: [{ kind: "must_include", optionIds: [4] }],
  credits: [],
  options: [
    { id: 1, label: "Sunglasses" },
    { id: 2, label: "Sunscreen" },
    { id: 3, label: "Light jacket" },
    { id: 4, label: "Umbrella" },
  ],
  correct: [1, 2, 3, 4],
};

const autoPassQuestion: QuizQuestion = {
  id: "Q099",
  type: "single",
  prompt: "Anything goes",
  required: true,
  tags: ["test"],
  specialRules: [{ kind: "auto_pass", reason: "joke question" }],
  credits: [],
  options: [
    { id: 1, label: "A" },
    { id: 2, label: "B" },
  ],
  correct: [1],
};

describe("scoring", () => {
  it("accepts any allowed single-choice answer", () => {
    expect(
      isResponseCorrect(singleQuestion, {
        questionId: "Q001",
        type: "single",
        value: 2,
        status: "answered",
      }),
    ).toBe(true);
  });

  it("applies fuzzy matching for text answers", () => {
    expect(
      isResponseCorrect(textQuestion, {
        questionId: "Q002",
        type: "text",
        value: "sorrted",
        status: "answered",
      }),
    ).toBe(true);
    expect(
      isResponseCorrect(textQuestion, {
        questionId: "Q002",
        type: "text",
        value: "sort",
        status: "answered",
      }),
    ).toBe(false);
  });

  it("fails when a fail_on_hint rule's hint was used", () => {
    expect(
      isResponseCorrect(failOnHintQuestion, {
        questionId: "Q007",
        type: "single",
        value: 2,
        status: "answered",
        hintsUsed: ["cuppa"],
      }),
    ).toBe(false);
  });

  it("passes when fail_on_hint hint was not triggered", () => {
    expect(
      isResponseCorrect(failOnHintQuestion, {
        questionId: "Q007",
        type: "single",
        value: 2,
        status: "answered",
      }),
    ).toBe(true);
  });

  it("must_include rule fails when required option is missing", () => {
    expect(
      isResponseCorrect(mustIncludeQuestion, {
        questionId: "Q019",
        type: "multiple",
        value: [1, 2, 3],
        status: "answered",
      }),
    ).toBe(false);
  });

  it("must_include rule passes when all required options are included", () => {
    expect(
      isResponseCorrect(mustIncludeQuestion, {
        questionId: "Q019",
        type: "multiple",
        value: [1, 2, 3, 4],
        status: "answered",
      }),
    ).toBe(true);
  });

  it("auto_pass rule marks any answered response correct", () => {
    expect(
      isResponseCorrect(autoPassQuestion, {
        questionId: "Q099",
        type: "single",
        value: 2,
        status: "answered",
      }),
    ).toBe(true);
  });
});
