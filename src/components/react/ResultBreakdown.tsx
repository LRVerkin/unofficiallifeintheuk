import type { Question } from "@/data/question-schema";
import { isResponseCorrect } from "@/lib/quiz/scoring";
import type { QuestionResponse, QuizSession } from "@/lib/quiz/types";
import { Card } from "./Card";

interface ResultBreakdownProps {
  session: QuizSession;
}

function describeUserAnswer(question: Question, response: QuestionResponse): string {
  if (response.status !== "answered") return "No answer.";
  switch (question.type) {
    case "single": {
      if (response.type !== "single" || response.value == null) return "No answer.";
      const option = question.options.find((opt) => opt.id === response.value);
      return option?.label ?? "—";
    }
    case "multiple": {
      if (response.type !== "multiple") return "—";
      const labels = response.value
        .map((id) => question.options.find((opt) => opt.id === id)?.label)
        .filter((label): label is string => Boolean(label));
      return labels.join(", ") || "Nothing selected.";
    }
    case "rank": {
      if (response.type !== "rank") return "—";
      const labels = response.value
        .map((id) => question.options.find((opt) => opt.id === id)?.label)
        .filter((label): label is string => Boolean(label));
      return labels.join(" › ");
    }
    case "text": {
      if (response.type !== "text") return "—";
      return response.value || "—";
    }
  }
}

function feedbackText(
  question: Question,
  response: QuestionResponse,
  correct: boolean,
): string | null {
  const fb = question.feedback;
  if (!fb) return null;
  // Per-option feedback (keyed to the user's pick) wins when present, regardless
  // of correctness — the bank uses these for both "correct, here's why" and
  // "wrong, here's why" messages.
  if (question.type === "single" && response.type === "single" && response.value != null) {
    const perOption = fb[String(response.value)];
    if (perOption) return perOption;
  }
  if (correct) {
    return fb.overall_correct ?? fb.correct ?? null;
  }
  return fb.incorrect ?? null;
}

export function ResultBreakdown({ session }: ResultBreakdownProps) {
  return (
    <Card aria-label="Question breakdown">
      <h2 className="font-display text-2xl font-semibold">How you did</h2>
      <ol className="mt-4 flex flex-col gap-4">
        {session.questions.map((question, index) => {
          const response = session.answers[question.id];
          const correct = isResponseCorrect(question, response);
          const userAnswer = describeUserAnswer(question, response);
          const feedback = feedbackText(question, response, correct);
          return (
            <li
              key={question.id}
              className={`rounded-2xl border px-4 py-3 ${
                correct
                  ? "border-brand-secondary/30 bg-brand-secondary/5"
                  : "border-brand-primary/30 bg-brand-primary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.2rem] text-brand-secondary">
                  Q{String(index + 1).padStart(2, "0")}
                </p>
                <span
                  className={`text-xs font-semibold uppercase ${
                    correct ? "text-brand-secondary" : "text-brand-primary"
                  }`}
                >
                  {correct ? "Correct" : "Incorrect"}
                </span>
              </div>
              <p className="mt-2 font-display text-lg">{question.prompt}</p>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                <span className="font-semibold">Your answer:</span> {userAnswer}
              </p>
              {feedback && <p className="mt-2 text-sm">{feedback}</p>}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
