import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionCard } from "@/components/react/QuestionCard";
import type { Question } from "@/data/question-schema";

const singleQuestion: Question = {
  id: "Q002",
  type: "single",
  prompt: "Which of these is a famous UK dessert?",
  required: true,
  tags: ["food"],
  specialRules: [],
  credits: [],
  options: [
    { id: 1, label: "limpdick" },
    { id: 2, label: "spotted dick" },
  ],
  correct: [2],
};

const multipleQuestion: Question = {
  id: "Q019",
  type: "multiple",
  prompt: "What must you bring?",
  required: true,
  tags: ["weather"],
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

const rankQuestion: Question = {
  id: "Q001",
  type: "rank",
  prompt: "Rank by poshness",
  required: true,
  tags: ["shopping"],
  specialRules: [],
  credits: [],
  options: [
    { id: 1, label: "Waitrose" },
    { id: 2, label: "Aldi" },
  ],
  correct: [1, 2],
};

const textQuestion: Question = {
  id: "Q006",
  type: "text",
  prompt: "Complete: see it, say it,",
  required: true,
  tags: ["transport"],
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

const cuppaQuestion: Question = {
  id: "Q007",
  type: "single",
  prompt: "When is it appropriate to offer someone a cuppa?",
  required: true,
  tags: ["tea"],
  specialRules: [{ kind: "fail_on_hint", hintId: "cuppa" }],
  credits: [],
  options: [
    { id: 1, label: "Morning" },
    { id: 2, label: "Always" },
  ],
  correct: [2],
};

describe("<QuestionCard />", () => {
  it("renders a RadioGroup for single-type questions", async () => {
    const onAnswer = vi.fn();
    render(
      <QuestionCard
        question={singleQuestion}
        response={{ questionId: "Q002", type: "single", value: null, status: "unanswered" }}
        questionNumber={2}
        totalQuestions={24}
        onAnswer={onAnswer}
        onUseHint={() => {}}
      />,
    );
    expect(
      screen.getByRole("region", { name: "Question 2 of 24" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: singleQuestion.prompt })).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("spotted dick"));
    expect(onAnswer).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ type: "single", value: 2, status: "answered" }),
    );
  });

  it("renders a CheckboxGroup for multiple-type questions and emits the new selection", async () => {
    const onAnswer = vi.fn();
    render(
      <QuestionCard
        question={multipleQuestion}
        response={{ questionId: "Q019", type: "multiple", value: [], status: "unanswered" }}
        questionNumber={19}
        totalQuestions={24}
        onAnswer={onAnswer}
        onUseHint={() => {}}
      />,
    );
    await userEvent.click(screen.getByLabelText("Umbrella"));
    expect(onAnswer).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ type: "multiple", value: [4], status: "answered" }),
    );
  });

  it("renders a RankList for rank-type questions", () => {
    render(
      <QuestionCard
        question={rankQuestion}
        response={{ questionId: "Q001", type: "rank", value: [], status: "unanswered" }}
        questionNumber={1}
        totalQuestions={24}
        onAnswer={() => {}}
        onUseHint={() => {}}
      />,
    );
    expect(screen.getByRole("list", { name: rankQuestion.prompt })).toBeInTheDocument();
    expect(screen.getByText("Waitrose")).toBeInTheDocument();
  });

  it("renders a TextAnswer for text-type questions", async () => {
    const onAnswer = vi.fn();
    render(
      <QuestionCard
        question={textQuestion}
        response={{ questionId: "Q006", type: "text", value: "", status: "unanswered" }}
        questionNumber={6}
        totalQuestions={24}
        onAnswer={onAnswer}
        onUseHint={() => {}}
      />,
    );
    await userEvent.type(screen.getByLabelText(textQuestion.prompt), "x");
    expect(onAnswer.mock.calls.at(-1)?.[0]).toMatchObject({
      type: "text",
      value: "x",
      status: "answered",
    });
  });

  it("shows a hint button for fail_on_hint rules and emits the hintId when clicked", async () => {
    const onUseHint = vi.fn();
    render(
      <QuestionCard
        question={cuppaQuestion}
        response={{ questionId: "Q007", type: "single", value: null, status: "unanswered" }}
        questionNumber={7}
        totalQuestions={24}
        onAnswer={() => {}}
        onUseHint={onUseHint}
      />,
    );
    const hintButton = screen.getByRole("button", { name: /What is a cuppa\?/ });
    await userEvent.click(hintButton);
    expect(onUseHint).toHaveBeenCalledExactlyOnceWith("cuppa");
  });

  it("disables the hint button once the hint has been used", () => {
    render(
      <QuestionCard
        question={cuppaQuestion}
        response={{
          questionId: "Q007",
          type: "single",
          value: null,
          status: "unanswered",
          hintsUsed: ["cuppa"],
        }}
        questionNumber={7}
        totalQuestions={24}
        onAnswer={() => {}}
        onUseHint={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /What is a cuppa\?/ })).toBeDisabled();
  });
});
