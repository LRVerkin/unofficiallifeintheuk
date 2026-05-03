import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ResultBreakdown } from "@/components/react/ResultBreakdown";
import type { Question } from "@/data/question-schema";
import type { QuizSession } from "@/lib/quiz/types";

const supermarketsQ: Question = {
  id: "Q001",
  type: "rank",
  prompt: "Rank by poshness",
  required: true,
  tags: ["shopping"],
  specialRules: [],
  credits: [],
  options: [
    { id: 1, label: "Waitrose" },
    { id: 2, label: "M&S" },
    { id: 3, label: "Tesco" },
  ],
  correct: [1, 2, 3],
};

const dessertQ: Question = {
  id: "Q002",
  type: "single",
  prompt: "Which is a famous UK dessert?",
  required: true,
  tags: ["food"],
  specialRules: [],
  credits: [],
  feedback: {
    "1": "limpdick is not a dessert.",
    "3": "Correct! Spotted dick.",
    incorrect: "Wrong, the answer is spotted dick.",
  },
  options: [
    { id: 1, label: "limpdick" },
    { id: 2, label: "dickhead" },
    { id: 3, label: "spotted dick" },
  ],
  correct: [3],
};

function makeSession(answers: QuizSession["answers"]): QuizSession {
  return {
    id: "session-results",
    status: "completed",
    config: { questionCount: 2, passThreshold: 0.5, seed: "x" },
    questions: [supermarketsQ, dessertQ],
    currentIndex: 1,
    answers,
    startedAt: 1,
    completedAt: 2,
    result: { correctCount: 1, totalCount: 2, percentage: 0.5, passed: true },
  };
}

describe("<ResultBreakdown />", () => {
  it("lists every question with its correctness badge", () => {
    const session = makeSession({
      Q001: {
        questionId: "Q001",
        type: "rank",
        value: [1, 2, 3],
        status: "answered",
      },
      Q002: {
        questionId: "Q002",
        type: "single",
        value: 1,
        status: "answered",
      },
    });
    render(<ResultBreakdown session={session} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText("Correct")).toBeInTheDocument();
    expect(within(items[1]).getByText("Incorrect")).toBeInTheDocument();
  });

  it("formats the user's rank answer as a chevron-separated path", () => {
    const session = makeSession({
      Q001: {
        questionId: "Q001",
        type: "rank",
        value: [3, 1, 2],
        status: "answered",
      },
      Q002: {
        questionId: "Q002",
        type: "single",
        value: 3,
        status: "answered",
      },
    });
    render(<ResultBreakdown session={session} />);
    expect(screen.getByText(/Tesco › Waitrose › M&S/)).toBeInTheDocument();
  });

  it("uses per-option feedback for an incorrect single-choice pick when available", () => {
    const session = makeSession({
      Q001: {
        questionId: "Q001",
        type: "rank",
        value: [1, 2, 3],
        status: "answered",
      },
      Q002: {
        questionId: "Q002",
        type: "single",
        value: 1,
        status: "answered",
      },
    });
    render(<ResultBreakdown session={session} />);
    expect(screen.getByText("limpdick is not a dessert.")).toBeInTheDocument();
  });

  it("falls back to the bank's general feedback.correct when per-option is missing", () => {
    const session = makeSession({
      Q001: {
        questionId: "Q001",
        type: "rank",
        value: [1, 2, 3],
        status: "answered",
      },
      Q002: {
        questionId: "Q002",
        type: "single",
        value: 3,
        status: "answered",
      },
    });
    render(<ResultBreakdown session={session} />);
    expect(screen.getByText("Correct! Spotted dick.")).toBeInTheDocument();
  });

  it("shows 'No answer.' for unanswered questions", () => {
    const session = makeSession({
      Q001: {
        questionId: "Q001",
        type: "rank",
        value: [1, 2, 3],
        status: "answered",
      },
      Q002: {
        questionId: "Q002",
        type: "single",
        value: null,
        status: "unanswered",
      },
    });
    render(<ResultBreakdown session={session} />);
    expect(screen.getByText("No answer.")).toBeInTheDocument();
  });
});
