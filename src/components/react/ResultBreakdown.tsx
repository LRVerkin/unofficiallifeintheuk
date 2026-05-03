import type { Question } from "@/data/question-schema";
import { correctAnswerComment, correctAnswerText } from "@/lib/quiz/feedback";
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

export function ResultBreakdown({ session }: ResultBreakdownProps) {
  return (
    <Card aria-label="Question breakdown">
      <h2 className="font-display text-2xl font-semibold">How you did</h2>
      <ol className="mt-4 flex flex-col gap-4">
        {session.questions.map((question, index) => {
          const response = session.answers[question.id];
          const correct = isResponseCorrect(question, response);
          const userAnswer = describeUserAnswer(question, response);
          const correctAnswer = correctAnswerText(question);
          const correctComment = correctAnswerComment(question);
          return (
            <li
              key={question.id}
              className={`rounded-2xl border-l-4 border-y border-r px-4 py-3 ${
                correct
                  ? "border-l-[var(--color-success)] border-y-[var(--color-border)] border-r-[var(--color-border)] bg-[var(--color-surface-muted)]"
                  : "border-l-[var(--color-error)] border-y-[var(--color-border)] border-r-[var(--color-border)] bg-[var(--color-surface-muted)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.2rem] text-brand-secondary">
                  Q{String(index + 1).padStart(2, "0")}
                </p>
                <span
                  className={`text-xs font-bold uppercase ${
                    correct ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                  }`}
                >
                  {correct ? "Correct" : "Incorrect"}
                </span>
              </div>
              <p className="mt-2 text-lg font-semibold">{question.prompt}</p>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                <span className="font-semibold">Your answer:</span> {userAnswer}
              </p>
              {!correct && (
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                  <span className="font-semibold">Correct answer:</span>{" "}
                  {correctAnswer}
                </p>
              )}
              {correctComment && <p className="mt-2 text-sm">{correctComment}</p>}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
