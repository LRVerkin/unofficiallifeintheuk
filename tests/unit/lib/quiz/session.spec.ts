import { describe, expect, it } from "vitest";
import { createSession, startSession, answerQuestion, goToNextQuestion, completeSession } from "@/lib/quiz/session";
import type { QuizQuestion } from "@/lib/quiz/types";

const questions: QuizQuestion[] = [
  {
    id: "Q1",
    type: "single",
    prompt: "Pick one",
    required: true,
    tags: ["test"],
    specialRules: [],
    options: [
      { id: 1, label: "One" },
      { id: 2, label: "Two" },
    ],
    correct: [1],
  },
];

describe("session helpers", () => {
  it("creates and starts sessions", () => {
    const session = createSession(questions, { questionCount: 1, passThreshold: 0.5 });
    expect(session.questions).toHaveLength(1);
    expect(session.status).toBe("not_started");
    const started = startSession(session);
    expect(started.status).toBe("in_progress");
  });

  it("records answers and advances when valid", () => {
    const session = startSession(createSession(questions, { questionCount: 1, passThreshold: 0.5 }));
    const answered = answerQuestion(session, {
      questionId: "Q1",
      type: "single",
      value: 1,
      status: "answered",
    });
    expect(answered.answers.Q1.value).toBe(1);
    const advanced = goToNextQuestion(answered);
    expect(advanced.currentIndex).toBe(0); // only one question
  });

  it("completes a session and stores the result", () => {
    let session = startSession(createSession(questions, { questionCount: 1, passThreshold: 0.5 }));
    session = answerQuestion(session, {
      questionId: "Q1",
      type: "single",
      value: 1,
      status: "answered",
    });
    const completed = completeSession(session);
    expect(completed.status).toBe("completed");
    expect(completed.result?.passed).toBe(true);
  });
});
