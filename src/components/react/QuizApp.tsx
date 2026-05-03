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
  | { type: "hydrate"; session: QuizSession }
  | { type: "answer"; response: QuestionResponse }
  | { type: "use_hint"; questionId: string; hintId: string }
  | { type: "next" }
  | { type: "prev" }
  | { type: "complete" }
  | { type: "reset"; session: QuizSession };

function reducer(state: QuizSession, action: Action): QuizSession {
  switch (action.type) {
    case "hydrate":
      return action.session;
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

interface QuizAppProps {
  resultsHref?: string;
  onComplete?: (session: QuizSession) => void;
}

export function QuizApp({
  resultsHref = "/results",
  onComplete,
}: QuizAppProps = {}) {
  const [hydrated, setHydrated] = useState(false);
  const [session, dispatch] = useReducer(reducer, null, freshSession);
  const startedRef = useRef(false);

  // Hydrate from sessionStorage once on mount.
  useEffect(() => {
    const restored = loadSession();
    if (restored && restored.status !== "completed") {
      dispatch({ type: "hydrate", session: restored });
    }
    setHydrated(true);
  }, []);

  // Persist after every state change once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    saveSession(session);
  }, [session, hydrated]);

  // Fire quiz_start once when the user makes their first move.
  useEffect(() => {
    if (startedRef.current) return;
    if (!hydrated) return;
    if (session.status === "in_progress") {
      startedRef.current = true;
      trackEvent({
        name: "quiz_start",
        payload: { sessionId: session.id, total: session.questions.length },
      });
    }
  }, [hydrated, session.status, session.id, session.questions.length]);

  // On completion: fire analytics, persist, hand off to results, clear storage.
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
      // Keep results data for /results to read; clear after a brief tick.
      saveSession(session);
      window.location.assign(resultsHref);
    }
  }, [session, resultsHref, onComplete]);

  if (!hydrated) {
    return (
      <Card aria-busy="true">
        <p className="text-sm text-[var(--color-muted-foreground)]">Loading quiz…</p>
      </Card>
    );
  }

  if (session.status === "completed") {
    return (
      <Card>
        <h2 className="font-display text-2xl font-semibold">You finished!</h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Redirecting to your results…
        </p>
      </Card>
    );
  }

  const current = session.questions[session.currentIndex];
  const response = session.answers[current.id];
  const isLast = session.currentIndex === session.questions.length - 1;
  const canAdvance = response.status === "answered" || !current.required;

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
        onAnswer={(next) => dispatch({ type: "answer", response: next })}
        onUseHint={(hintId) =>
          dispatch({ type: "use_hint", questionId: current.id, hintId })
        }
      />

      {!canAdvance && current.required && (
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
          variant="secondary"
          onClick={() => {
            clearSession();
            dispatch({ type: "reset", session: freshSession() });
            startedRef.current = false;
          }}
        >
          Restart
        </Button>
        {isLast ? (
          <Button
            variant="primary"
            onClick={() => dispatch({ type: "complete" })}
            disabled={!canAdvance}
          >
            Finish
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => dispatch({ type: "next" })}
            disabled={!canAdvance}
          >
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}
