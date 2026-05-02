import type { Question } from "@/data/question-schema";

export type QuizQuestion = Question;

export type QuestionId = QuizQuestion["id"];

export interface QuizConfig {
  questionCount: number;
  passThreshold: number;
  seed?: string;
}

export type QuestionStatus = "unanswered" | "answered";

interface BaseResponse {
  questionId: QuestionId;
  status: QuestionStatus;
  hintsUsed?: string[];
}

export type SingleChoiceResponse = BaseResponse & {
  type: "single";
  value: number | null;
};

export type MultipleChoiceResponse = BaseResponse & {
  type: "multiple";
  value: number[];
};

export type RankResponse = BaseResponse & {
  type: "rank";
  value: number[];
};

export type TextResponse = BaseResponse & {
  type: "text";
  value: string;
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
