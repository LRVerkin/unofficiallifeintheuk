import type { SpecialRule } from "@/data/question-schema";
import type {
  QuestionResponse,
  QuizQuestion,
  QuizResult,
  QuizSession,
} from "./types";

function normalizeText(value: string, normalizeCase = true, trim = true) {
  let result = value;
  if (trim) result = result.trim();
  if (normalizeCase) result = result.toLowerCase();
  return result;
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

function similarity(a: string, b: string) {
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - distance / maxLen;
}

function selectedOptionIds(response: QuestionResponse): number[] {
  switch (response.type) {
    case "single":
      return response.value == null ? [] : [response.value];
    case "multiple":
    case "rank":
      return response.value;
    case "text":
      return [];
  }
}

function applySpecialRules(
  rules: readonly SpecialRule[],
  response: QuestionResponse,
  baseCorrect: boolean,
): boolean {
  let correct = baseCorrect;
  for (const rule of rules) {
    switch (rule.kind) {
      case "auto_pass":
        correct = true;
        break;
      case "fail_on_hint":
        if (response.hintsUsed?.includes(rule.hintId)) {
          return false;
        }
        break;
      case "must_include": {
        const selected = new Set(selectedOptionIds(response));
        const hasAll = rule.optionIds.every((id) => selected.has(id));
        if (!hasAll) return false;
        break;
      }
      case "note":
        break;
    }
  }
  return correct;
}

export function isResponseCorrect(
  question: QuizQuestion,
  response?: QuestionResponse,
): boolean {
  if (!response || response.status !== "answered") return false;
  let baseCorrect = false;
  switch (question.type) {
    case "single":
      if (response.type === "single") {
        baseCorrect = question.correct.includes(response.value ?? NaN);
      }
      break;
    case "multiple":
      if (response.type === "multiple") {
        baseCorrect = compareSets(question.correct, response.value);
      }
      break;
    case "rank":
      if (response.type === "rank") {
        baseCorrect = compareSets(question.correct, response.value, true);
      }
      break;
    case "text":
      if (response.type === "text") {
        baseCorrect = matchTextAnswer(question, response.value);
      }
      break;
  }
  return applySpecialRules(question.specialRules ?? [], response, baseCorrect);
}

function compareSets(
  correct: number[],
  provided: number[],
  ordered = false,
): boolean {
  if (correct.length !== provided.length) return false;
  if (ordered) {
    return correct.every((value, index) => value === provided[index]);
  }
  const correctSet = new Set(correct);
  return provided.every((value) => correctSet.has(value));
}

function matchTextAnswer(question: QuizQuestion, value: string): boolean {
  if (question.type !== "text") return false;
  const {
    strategy,
    normalizeCase = true,
    trimWhitespace = true,
    fuzzyThreshold,
  } = question.textValidation;
  const answer = normalizeText(value, normalizeCase, trimWhitespace);
  return question.acceptableAnswers.some((expected) => {
    const normExpected = normalizeText(expected, normalizeCase, trimWhitespace);
    if (strategy === "contains") {
      const contains =
        answer.includes(normExpected) || normExpected.includes(answer);
      if (!contains && fuzzyThreshold) {
        return similarity(answer, normExpected) >= fuzzyThreshold;
      }
      return contains;
    }
    if (fuzzyThreshold) {
      return similarity(answer, normExpected) >= fuzzyThreshold;
    }
    return answer === normExpected;
  });
}

export function scoreSession(session: QuizSession): QuizResult {
  const correctCount = session.questions.reduce((count, question) => {
    const response = session.answers[question.id];
    return count + (isResponseCorrect(question, response) ? 1 : 0);
  }, 0);

  const totalCount = session.questions.length;
  const percentage = totalCount === 0 ? 0 : correctCount / totalCount;
  return {
    correctCount,
    totalCount,
    percentage,
    passed: percentage >= session.config.passThreshold,
  };
}
