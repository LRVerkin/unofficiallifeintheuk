import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuizApp } from "@/components/react/QuizApp";
import { questions as bank } from "@/data/questions";
import { configureAnalytics } from "@/lib/analytics";
import { loadSession, saveSession } from "@/lib/quiz/persistence";
import type { QuizSession } from "@/lib/quiz/types";

function makeAnsweredSession(): QuizSession {
  return {
    id: "session-resume",
    status: "in_progress",
    config: { questionCount: bank.length, passThreshold: 0.75, seed: "resume-seed" },
    questions: bank,
    currentIndex: 5,
    answers: Object.fromEntries(
      bank.map((question) => [
        question.id,
        question.type === "single"
          ? {
              questionId: question.id,
              type: "single" as const,
              value: null,
              status: "unanswered" as const,
            }
          : question.type === "multiple"
            ? {
                questionId: question.id,
                type: "multiple" as const,
                value: [],
                status: "unanswered" as const,
              }
            : question.type === "rank"
              ? {
                  questionId: question.id,
                  type: "rank" as const,
                  value: [],
                  status: "unanswered" as const,
                }
              : {
                  questionId: question.id,
                  type: "text" as const,
                  value: "",
                  status: "unanswered" as const,
                },
      ]),
    ),
    startedAt: 1,
  };
}

describe("<QuizApp />", () => {
  beforeEach(() => {
    sessionStorage.clear();
    configureAnalytics(() => {});
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("renders the first question after hydration", async () => {
    render(<QuizApp />);
    expect(await screen.findByText(/Question 1 of/)).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Quiz progress" }),
    ).toHaveAttribute("aria-valuenow", "1");
  });

  it("disables Next until the current required question is answered", async () => {
    render(<QuizApp />);
    await screen.findByText(/Question 1 of/);
    const next = screen.getByRole("button", { name: /Next/ });
    expect(next).toBeDisabled();
  });

  it("emits a quiz_start event the first time the user lands in_progress", async () => {
    const sink = vi.fn();
    configureAnalytics(sink);
    render(<QuizApp />);
    await screen.findByText(/Question 1 of/);
    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "quiz_start",
        payload: expect.objectContaining({ total: bank.length }),
      }),
    );
  });

  it("persists state to sessionStorage as the user answers", async () => {
    // Seed a deterministic session pointing at a known single-type question so the
    // test doesn't depend on the sampler's shuffle order.
    const singleIdx = bank.findIndex((q) => q.type === "single");
    const targetId = bank[singleIdx].id;
    saveSession({ ...makeAnsweredSession(), currentIndex: singleIdx });
    render(<QuizApp />);
    await screen.findByText(`Question ${singleIdx + 1} of 24`);
    // Click any radio option; first option works regardless of question.
    const firstOption = bank[singleIdx].type === "single" ? bank[singleIdx].options[0] : null;
    if (!firstOption) throw new Error("expected single-type question");
    await userEvent.click(screen.getByLabelText(firstOption.label));
    const stored = loadSession();
    expect(stored).not.toBeNull();
    expect(stored?.answers[targetId]?.status).toBe("answered");
  });

  it("hydrates from a previously saved session", async () => {
    saveSession(makeAnsweredSession());
    render(<QuizApp />);
    expect(await screen.findByText(/Question 6 of 24/)).toBeInTheDocument();
  });

  it("Restart wipes storage and returns to question 1", async () => {
    saveSession(makeAnsweredSession());
    render(<QuizApp />);
    await screen.findByText(/Question 6 of 24/);
    await userEvent.click(screen.getByRole("button", { name: /Restart/ }));
    expect(await screen.findByText(/Question 1 of 24/)).toBeInTheDocument();
    // Storage was cleared, then immediately re-saved with a fresh session.
    const stored = loadSession();
    expect(stored?.currentIndex).toBe(0);
  });

  it("records a hint click on the current question's response", async () => {
    // Find the Q007 (cuppa) question's index in the bank.
    const cuppaIndex = bank.findIndex((q) => q.id === "Q007");
    saveSession({
      ...makeAnsweredSession(),
      currentIndex: cuppaIndex,
    });
    render(<QuizApp />);
    await screen.findByText(`Question ${cuppaIndex + 1} of 24`);
    await userEvent.click(
      screen.getByRole("button", { name: /What is a cuppa\?/ }),
    );
    const stored = loadSession();
    expect(stored?.answers.Q007?.hintsUsed).toEqual(["cuppa"]);
  });
});
