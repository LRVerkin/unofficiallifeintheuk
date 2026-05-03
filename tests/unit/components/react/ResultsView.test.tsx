import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsView } from "@/components/react/ResultsView";
import { configureAnalytics } from "@/lib/analytics";
import { saveSession } from "@/lib/quiz/persistence";
import type { QuizSession } from "@/lib/quiz/types";

function makeCompletedSession(): QuizSession {
  return {
    id: "completed-session",
    status: "completed",
    config: { questionCount: 2, passThreshold: 0.5, seed: "x" },
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
      {
        id: "Q002",
        type: "single",
        prompt: "Other",
        required: true,
        tags: ["test"],
        specialRules: [],
        credits: [],
        options: [
          { id: 1, label: "A" },
          { id: 2, label: "B" },
        ],
        correct: [2],
      },
    ],
    currentIndex: 1,
    answers: {
      Q001: { questionId: "Q001", type: "single", value: 1, status: "answered" },
      Q002: { questionId: "Q002", type: "single", value: 1, status: "answered" },
    },
    startedAt: 1,
    completedAt: 2,
    result: { correctCount: 1, totalCount: 2, percentage: 0.5, passed: true },
  };
}

describe("<ResultsView />", () => {
  beforeEach(() => {
    sessionStorage.clear();
    configureAnalytics(() => {});
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("shows an empty state when there is no session and no query", async () => {
    render(<ResultsView initialSearch="" initialOrigin="https://example.test" />);
    expect(await screen.findByText(/No results yet/)).toBeInTheDocument();
  });

  it("renders a persona card and breakdown for a completed session", async () => {
    saveSession(makeCompletedSession());
    render(<ResultsView initialSearch="" initialOrigin="https://example.test" />);
    expect(await screen.findByRole("region", { name: /Result:/ })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Question breakdown" })).toBeInTheDocument();
  });

  it("renders a persona-only view when a valid query string is present but no session", async () => {
    render(
      <ResultsView
        initialSearch="?score=18&total=24"
        initialOrigin="https://example.test"
      />,
    );
    expect(await screen.findByRole("region", { name: /Result:/ })).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Question breakdown" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/Take the test yourself to see the per-question breakdown/),
    ).toBeInTheDocument();
  });

  it("ignores malformed query strings and falls back to the empty state", async () => {
    render(
      <ResultsView
        initialSearch="?score=abc&total=24"
        initialOrigin="https://example.test"
      />,
    );
    expect(await screen.findByText(/No results yet/)).toBeInTheDocument();
  });

  it("ignores out-of-range scores", async () => {
    render(
      <ResultsView
        initialSearch="?score=50&total=24"
        initialOrigin="https://example.test"
      />,
    );
    expect(await screen.findByText(/No results yet/)).toBeInTheDocument();
  });

  it("copies the share URL to the clipboard and fires share_click", async () => {
    saveSession(makeCompletedSession());
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    const sink = vi.fn();
    configureAnalytics(sink);

    render(<ResultsView initialSearch="" initialOrigin="https://example.test" />);
    await screen.findByRole("region", { name: /Result:/ });
    await userEvent.click(screen.getByRole("button", { name: "Share your result" }));

    expect(writeText).toHaveBeenCalledExactlyOnceWith(
      "https://example.test/results?score=1&total=2",
    );
    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "share_click",
        payload: expect.objectContaining({ score: 1, total: 2, source: "session" }),
      }),
    );
    expect(await screen.findByText("Link copied — paste away.")).toBeInTheDocument();
  });
});
