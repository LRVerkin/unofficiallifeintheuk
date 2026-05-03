import { useEffect, useReducer, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  answerQuestion,
  completeSession,
  createSession,
  goToNextQuestion,
  goToPreviousQuestion,
  startSession,
} from "@/lib/quiz/session";
import { feedbackText } from "@/lib/quiz/feedback";
import { isResponseCorrect } from "@/lib/quiz/scoring";
import { clearSession, loadSession, saveSession } from "@/lib/quiz/persistence";
import type { QuestionResponse, QuizSession } from "@/lib/quiz/types";
import { questions as bank } from "@/data/questions";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";

const QUIZ_CONFIG = { questionCount: bank.length, passThreshold: 0.75 };

type Action =
  | { type: "answer"; response: QuestionResponse }
  | { type: "use_hint"; questionId: string; hintId: string }
  | { type: "next" }
  | { type: "force_next" }
  | { type: "prev" }
  | { type: "complete" }
  | { type: "reset"; session: QuizSession };

function reducer(state: QuizSession, action: Action): QuizSession {
  switch (action.type) {
    case "answer":
      return answerQuestion(state, action.response);
    case "use_hint": {
      const existing = state.answers[action.questionId];
      if (!existing) return state;
      const hintsUsed = existing.hintsUsed?.includes(action.hintId)
        ? existing.hintsUsed
        : [...(existing.hintsUsed ?? []), action.hintId];
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: { ...existing, hintsUsed },
        },
      };
    }
    case "next":
      return goToNextQuestion(state);
    case "force_next":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
      };
    case "prev":
      return goToPreviousQuestion(state);
    case "complete":
      return completeSession(state);
    case "reset":
      return action.session;
    default:
      return state;
  }
}

function freshSession(): QuizSession {
  return startSession(createSession(bank, QUIZ_CONFIG));
}

// Reads persisted session synchronously on first render. Falls back to a fresh
// session when nothing usable is stored. Safe to call from a useReducer lazy
// init because loadSession() is a no-op outside the browser.
function initialSession(): QuizSession {
  const restored = loadSession();
  if (restored && restored.status !== "completed") return restored;
  return freshSession();
}

const SUBMITTED_STORAGE_KEY = "ulituk:quiz-submitted:v1";

function loadSubmitted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(SUBMITTED_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((id) => typeof id === "string")) : new Set();
  } catch {
    return new Set();
  }
}

function saveSubmitted(submitted: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      SUBMITTED_STORAGE_KEY,
      JSON.stringify([...submitted]),
    );
  } catch {
    // Quota / serialisation failure — in-memory state remains authoritative.
  }
}

interface QuizAppProps {
  resultsHref?: string;
  onComplete?: (session: QuizSession) => void;
}

export function QuizApp({
  resultsHref = "/results",
  onComplete,
}: QuizAppProps = {}) {
  const [session, dispatch] = useReducer(reducer, null, initialSession);
  const [submitted, setSubmitted] = useState<Set<string>>(loadSubmitted);
  const startedRef = useRef(false);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    saveSubmitted(submitted);
  }, [submitted]);

  useEffect(() => {
    if (startedRef.current) return;
    if (session.status === "in_progress") {
      startedRef.current = true;
      trackEvent({
        name: "quiz_start",
        payload: { sessionId: session.id, total: session.questions.length },
      });
    }
  }, [session.status, session.id, session.questions.length]);

  useEffect(() => {
    if (session.status !== "completed" || !session.result) return;
    trackEvent({
      name: "quiz_complete",
      payload: {
        sessionId: session.id,
        correctCount: session.result.correctCount,
        totalCount: session.result.totalCount,
        passed: session.result.passed,
      },
    });
    onComplete?.(session);
    if (typeof window !== "undefined" && !onComplete) {
      saveSession(session);
      window.location.assign(resultsHref);
    }
  }, [session, resultsHref, onComplete]);

  if (session.status === "completed") {
    return (
      <Card>
        <h2 className="text-2xl font-bold">You finished!</h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Loading your results…
        </p>
      </Card>
    );
  }

  const current = session.questions[session.currentIndex];
  const response = session.answers[current.id];
  const isLast = session.currentIndex === session.questions.length - 1;
  const isAnswered = response.status === "answered";
  const isSubmitted = submitted.has(current.id);
  const usedHint = (response.hintsUsed?.length ?? 0) > 0;
  const isCorrect = isSubmitted ? isResponseCorrect(current, response) : false;
  const explanation = isSubmitted ? feedbackText(current, response, isCorrect) : null;

  function handleSubmit() {
    setSubmitted((prev) => {
      const next = new Set(prev);
      next.add(current.id);
      return next;
    });
  }

  function handleAnswer(next: QuestionResponse) {
    if (submitted.has(current.id)) return;
    dispatch({ type: "answer", response: next });
  }

  function handleHint(hintId: string) {
    if (submitted.has(current.id)) return;
    dispatch({ type: "use_hint", questionId: current.id, hintId });
    setSubmitted((prev) => {
      const next = new Set(prev);
      next.add(current.id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar
        current={session.currentIndex + 1}
        total={session.questions.length}
      />

      <QuestionCard
        question={current}
        response={response}
        questionNumber={session.currentIndex + 1}
        totalQuestions={session.questions.length}
        onAnswer={handleAnswer}
        onUseHint={handleHint}
        disabled={isSubmitted}
      />

      {isSubmitted && (
        <Alert severity={isCorrect ? "success" : "error"}>
          <p className="font-bold">
            {usedHint
              ? "Question failed — you should know."
              : isCorrect
                ? "Correct!"
                : "Not quite."}
          </p>
          {explanation && <p className="mt-1">{explanation}</p>}
        </Alert>
      )}

      {!isAnswered && current.required && !isSubmitted && (
        <Alert severity="info">Pick an answer to continue.</Alert>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: "prev" })}
          disabled={session.currentIndex === 0}
        >
          ← Previous
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            const ok =
              typeof window === "undefined"
                ? true
                : window.confirm(
                    "Restart the test? Your current answers will be lost.",
                  );
            if (!ok) return;
            clearSession();
            setSubmitted(new Set());
            startedRef.current = false;
            dispatch({ type: "reset", session: freshSession() });
          }}
        >
          Restart
        </Button>
        {!isSubmitted ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isAnswered && current.required}
          >
            Submit answer
          </Button>
        ) : isLast ? (
          <Button variant="primary" onClick={() => dispatch({ type: "complete" })}>
            Finish
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => dispatch({ type: "force_next" })}
          >
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}
