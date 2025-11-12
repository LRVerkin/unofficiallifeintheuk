import type { Question } from "@/data/question-schema";

export type QuizQuestion = Question;

export type QuestionId = QuizQuestion["id"];

export interface QuizConfig {
  questionCount: number;
  passThreshold: number;
  seed?: string;
}

export type QuestionStatus = "unanswered" | "answered";

export type SingleChoiceResponse = {
  questionId: QuestionId;
  type: "single";
  value: number | null;
  status: QuestionStatus;
};

export type MultipleChoiceResponse = {
  questionId: QuestionId;
  type: "multiple";
  value: number[];
  status: QuestionStatus;
};

export type RankResponse = {
  questionId: QuestionId;
  type: "rank";
  value: number[];
  status: QuestionStatus;
};

export type TextResponse = {
  questionId: QuestionId;
  type: "text";
  value: string;
  status: QuestionStatus;
};

export type QuestionResponse =
  | SingleChoiceResponse
  | MultipleChoiceResponse
  | RankResponse
  | TextResponse;

export type AnswerMap = Record<QuestionId, QuestionResponse>;

export type QuizStatus = "not_started" | "in_progress" | "completed";

export interface QuizResult {
  correctCount: number;
  totalCount: number;
  percentage: number;
  passed: boolean;
}

export interface QuizSession {
  id: string;
  status: QuizStatus;
  config: QuizConfig & { seed: string };
  questions: QuizQuestion[];
  currentIndex: number;
  answers: AnswerMap;
  startedAt?: number;
  completedAt?: number;
  result?: QuizResult;
}
