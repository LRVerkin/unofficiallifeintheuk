import type { Question } from "@/data/question-schema";
import type { QuestionResponse } from "./types";

// Returns the per-option or fallback explanation string for a given response.
// Per-option feedback (keyed to the user's pick) wins when present so the bank
// can carry both "correct, here's why" and "wrong, here's why" messages.
export function feedbackText(
  question: Question,
  response: QuestionResponse,
  correct: boolean,
): string | null {
  const fb = question.feedback;
  if (!fb) return null;
  if (
    question.type === "single" &&
    response.type === "single" &&
    response.value != null
  ) {
    const perOption = fb[String(response.value)];
    if (perOption) return perOption;
  }
  if (correct) {
    return fb.overall_correct ?? fb.correct ?? null;
  }
  return fb.incorrect ?? null;
}

// Human-readable description of the correct answer for any question type.
export function correctAnswerText(question: Question): string {
  switch (question.type) {
    case "single": {
      const id = question.correct[0];
      return question.options.find((opt) => opt.id === id)?.label ?? "—";
    }
    case "multiple": {
      const labels = question.correct
        .map((id) => question.options.find((opt) => opt.id === id)?.label)
        .filter((label): label is string => Boolean(label));
      return labels.join(", ") || "—";
    }
    case "rank": {
      const labels = question.correct
        .map((id) => question.options.find((opt) => opt.id === id)?.label)
        .filter((label): label is string => Boolean(label));
      return labels.join(" › ") || "—";
    }
    case "text":
      return question.acceptableAnswers[0] ?? "—";
  }
}

// Returns the bank's "this is why the correct answer is correct" message, if
// any. Looks first at per-option feedback keyed to the correct option (single
// choice), then falls back to overall_correct / correct.
export function correctAnswerComment(question: Question): string | null {
  const fb = question.feedback;
  if (!fb) return null;
  if (question.type === "single") {
    const perOption = fb[String(question.correct[0])];
    if (perOption) return perOption;
  }
  return fb.overall_correct ?? fb.correct ?? null;
}
