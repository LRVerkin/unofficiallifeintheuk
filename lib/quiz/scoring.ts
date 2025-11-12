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

export function isResponseCorrect(
  question: QuizQuestion,
  response?: QuestionResponse,
): boolean {
  if (!response || response.status !== "answered") return false;
  switch (question.type) {
    case "single":
      return question.correct.includes(response.value ?? NaN);
    case "multiple":
      return compareSets(question.correct, response.value);
    case "rank":
      return compareSets(question.correct, response.value, true);
    case "text":
      return matchTextAnswer(question, response.value);
    default:
      return false;
  }
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
