import type {
  MultipleChoiceResponse,
  QuestionResponse,
  QuizQuestion,
  RankResponse,
  SingleChoiceResponse,
  TextResponse,
} from "./types";

export function validateResponse(
  question: QuizQuestion,
  response: QuestionResponse,
): QuestionResponse {
  switch (response.type) {
    case "single":
      return validateSingle(question, response);
    case "multiple":
      return validateMultiple(question, response);
    case "rank":
      return validateRank(question, response);
    case "text":
      return validateText(response);
    default:
      return response;
  }
}

function validateSingle(
  question: QuizQuestion,
  response: SingleChoiceResponse,
): SingleChoiceResponse {
  if (question.type !== "single") return response;
  const validIds = new Set(question.options.map((option) => option.id));
  if (response.value === null || !validIds.has(response.value)) {
    return { ...response, value: null, status: "unanswered" };
  }
  return { ...response, status: "answered" };
}

function validateMultiple(
  question: QuizQuestion,
  response: MultipleChoiceResponse,
): MultipleChoiceResponse {
  if (question.type !== "multiple") return response;
  const validIds = new Set(question.options.map((option) => option.id));
  const sanitized = response.value.filter((value) => validIds.has(value));
  const unique = Array.from(new Set(sanitized));
  return {
    ...response,
    value: unique,
    status: unique.length > 0 ? "answered" : "unanswered",
  };
}

function validateRank(
  question: QuizQuestion,
  response: RankResponse,
): RankResponse {
  if (question.type !== "rank") return response;
  const validIds = new Set(question.options.map((option) => option.id));
  const sanitized = response.value.filter((value) => validIds.has(value));
  return {
    ...response,
    value: sanitized,
    status: sanitized.length === question.options.length ? "answered" : "unanswered",
  };
}

function validateText(response: TextResponse): TextResponse {
  const trimmed = response.value.trim();
  return {
    ...response,
    value: trimmed,
    status: trimmed.length > 0 ? "answered" : "unanswered",
  };
}

export function canAdvance(question: QuizQuestion, response?: QuestionResponse) {
  if (!question.required) return true;
  return response?.status === "answered";
}
