import type { QuizQuestion, QuizSession, QuizConfig, QuestionResponse } from "./types";
import { ensureSeed, pickQuestions } from "./sampler";
import { validateResponse, canAdvance } from "./validators";
import { scoreSession } from "./scoring";

const DEFAULT_PASS_THRESHOLD = 0.75;

export function createSession(
  allQuestions: QuizQuestion[],
  config: QuizConfig,
): QuizSession {
  const seed = ensureSeed(config.seed);
  const passThreshold = config.passThreshold ?? DEFAULT_PASS_THRESHOLD;
  const selected = pickQuestions(allQuestions, config.questionCount, seed);
  const answers = Object.fromEntries(
    selected.map((question) => [question.id, createEmptyResponse(question)]),
  );

  return {
    id: createSessionId(),
    status: "not_started",
    config: { ...config, passThreshold, seed },
    questions: selected,
    currentIndex: 0,
    answers,
  };
}

export function startSession(session: QuizSession): QuizSession {
  if (session.status !== "not_started") return session;
  return {
    ...session,
    status: "in_progress",
    startedAt: Date.now(),
  };
}

export function answerQuestion(
  session: QuizSession,
  response: QuestionResponse,
): QuizSession {
  const question = session.questions.find((item) => item.id === response.questionId);
  if (!question) return session;
  const sanitized = validateResponse(question, response);
  return {
    ...session,
    answers: {
      ...session.answers,
      [question.id]: sanitized,
    },
  };
}

export function goToNextQuestion(session: QuizSession): QuizSession {
  const question = session.questions[session.currentIndex];
  const response = session.answers[question.id];
  if (!canAdvance(question, response)) return session;
  return {
    ...session,
    currentIndex: Math.min(session.currentIndex + 1, session.questions.length - 1),
  };
}

export function goToPreviousQuestion(session: QuizSession): QuizSession {
  return {
    ...session,
    currentIndex: Math.max(session.currentIndex - 1, 0),
  };
}

export function completeSession(session: QuizSession): QuizSession {
  if (session.status === "completed") return session;
  const result = scoreSession(session);
  return {
    ...session,
    status: "completed",
    completedAt: Date.now(),
    result,
  };
}

export function resetSession(
  session: QuizSession,
  allQuestions: QuizQuestion[],
): QuizSession {
  return createSession(allQuestions, session.config);
}

function createEmptyResponse(question: QuizQuestion): QuestionResponse {
  switch (question.type) {
    case "single":
      return {
        questionId: question.id,
        type: "single",
        value: null,
        status: "unanswered",
      };
    case "multiple":
      return {
        questionId: question.id,
        type: "multiple",
        value: [],
        status: "unanswered",
      };
    case "rank":
      return {
        questionId: question.id,
        type: "rank",
        value: [],
        status: "unanswered",
      };
    case "text":
    default:
      return {
        questionId: question.id,
        type: "text",
        value: "",
        status: "unanswered",
      };
  }
}

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `session-${Math.random().toString(36).slice(2)}`;
}
