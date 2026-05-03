import { afterEach, describe, expect, it } from "vitest";
import { clearSession, loadSession, saveSession } from "@/lib/quiz/persistence";
import type { QuizSession } from "@/lib/quiz/types";

const sampleSession: QuizSession = {
  id: "session-test",
  status: "in_progress",
  config: { questionCount: 1, passThreshold: 0.5, seed: "test-seed" },
  questions: [
    {
      id: "Q001",
      type: "single",
      prompt: "Pick",
      required: true,
      tags: ["test"],
      specialRules: [],
      credits: [],
      options: [
        { id: 1, label: "One" },
        { id: 2, label: "Two" },
      ],
      correct: [1],
    },
  ],
  currentIndex: 0,
  answers: {
    Q001: {
      questionId: "Q001",
      type: "single",
      value: 1,
      status: "answered",
    },
  },
  startedAt: 123,
};

describe("quiz persistence", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("returns null when nothing has been saved", () => {
    expect(loadSession()).toBeNull();
  });

  it("round-trips a session through sessionStorage", () => {
    saveSession(sampleSession);
    expect(loadSession()).toEqual(sampleSession);
  });

  it("clears the saved session", () => {
    saveSession(sampleSession);
    clearSession();
    expect(loadSession()).toBeNull();
  });

  it("ignores payloads with the wrong schema version", () => {
    sessionStorage.setItem(
      "ulituk:quiz-session:v1",
      JSON.stringify({ schema: 999, session: sampleSession }),
    );
    expect(loadSession()).toBeNull();
  });

  it("ignores corrupted JSON", () => {
    sessionStorage.setItem("ulituk:quiz-session:v1", "{not valid json");
    expect(loadSession()).toBeNull();
  });
});
