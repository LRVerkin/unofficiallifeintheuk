import type { Question } from "@/data/question-schema";
import type { QuestionResponse } from "@/lib/quiz/types";
import { Card } from "./Card";
import { CheckboxGroup } from "./CheckboxGroup";
import { RadioGroup } from "./RadioGroup";
import { RankList } from "./RankList";
import { TextAnswer } from "./TextAnswer";

interface QuestionCardProps {
  question: Question;
  response: QuestionResponse;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (response: QuestionResponse) => void;
  onUseHint: (hintId: string) => void;
}

const HINT_LABELS: Record<string, string> = {
  cuppa: "What is a cuppa?",
};

function hintLabel(hintId: string): string {
  return HINT_LABELS[hintId] ?? `Hint: ${hintId}`;
}

export function QuestionCard({
  question,
  response,
  questionNumber,
  totalQuestions,
  onAnswer,
  onUseHint,
}: QuestionCardProps) {
  const hintRules = question.specialRules.filter(
    (rule): rule is { kind: "fail_on_hint"; hintId: string } =>
      rule.kind === "fail_on_hint",
  );

  return (
    <Card aria-label={`Question ${questionNumber} of ${totalQuestions}`}>
      <p className="text-sm uppercase tracking-[0.2rem] text-brand-secondary">
        Q{String(questionNumber).padStart(2, "0")}
      </p>

      {question.type === "single" && response.type === "single" && (
        <div className="mt-4">
          <RadioGroup
            legend={question.prompt}
            name={question.id}
            options={question.options}
            value={response.value}
            onChange={(id) =>
              onAnswer({
                ...response,
                value: id,
                status: "answered",
              })
            }
          />
        </div>
      )}

      {question.type === "multiple" && response.type === "multiple" && (
        <div className="mt-4">
          <CheckboxGroup
            legend={question.prompt}
            name={question.id}
            options={question.options}
            value={response.value}
            onChange={(next) =>
              onAnswer({
                ...response,
                value: next,
                status: next.length > 0 ? "answered" : "unanswered",
              })
            }
          />
        </div>
      )}

      {question.type === "rank" && response.type === "rank" && (
        <div className="mt-4">
          <RankList
            legend={question.prompt}
            items={question.options}
            value={
              response.value.length === question.options.length
                ? response.value
                : question.options.map((option) => option.id)
            }
            onChange={(next) =>
              onAnswer({
                ...response,
                value: next,
                status: "answered",
              })
            }
          />
        </div>
      )}

      {question.type === "text" && response.type === "text" && (
        <div className="mt-4">
          <TextAnswer
            label={question.prompt}
            name={question.id}
            value={response.value}
            onChange={(next) =>
              onAnswer({
                ...response,
                value: next,
                status: next.trim().length > 0 ? "answered" : "unanswered",
              })
            }
          />
        </div>
      )}

      {hintRules.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {hintRules.map((rule) => {
            const used = response.hintsUsed?.includes(rule.hintId) ?? false;
            return (
              <button
                key={rule.hintId}
                type="button"
                onClick={() => onUseHint(rule.hintId)}
                disabled={used}
                className="inline-flex items-center gap-2 rounded-full border border-dashed border-brand-secondary/60 px-3 py-1 text-sm text-brand-secondary hover:bg-brand-secondary/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span aria-hidden="true">💡</span>
                {hintLabel(rule.hintId)}
                {used && <span className="text-xs">(viewed)</span>}
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
