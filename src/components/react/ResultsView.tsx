import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getPersonaForPercentage } from "@/lib/personas";
import { clearSession, loadSession } from "@/lib/quiz/persistence";
import type { QuizSession } from "@/lib/quiz/types";
import type { Persona } from "@/data/personas";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { Card } from "./Card";
import { PersonaCard } from "./PersonaCard";
import { ResultBreakdown } from "./ResultBreakdown";

interface ResultsViewProps {
  retakeHref?: string;
  feedbackHref?: string;
  /** Allows tests to inject a deterministic location. */
  initialSearch?: string;
  initialOrigin?: string;
}

interface ParsedQuery {
  score: number;
  total: number;
}

function parseQuery(search: string): ParsedQuery | null {
  const params = new URLSearchParams(search);
  const score = Number(params.get("score"));
  const total = Number(params.get("total"));
  if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return null;
  if (score < 0 || score > total) return null;
  return { score, total };
}

function buildShareUrl(origin: string, score: number, total: number): string {
  return `${origin}/results?score=${score}&total=${total}`;
}

type Source = "session" | "query" | "empty";

interface InitialState {
  session: QuizSession | null;
  query: ParsedQuery | null;
  origin: string;
}

function readInitial(
  initialSearch?: string,
  initialOrigin?: string,
): InitialState {
  const loaded = loadSession();
  const search =
    initialSearch ?? (typeof window !== "undefined" ? window.location.search : "");
  const origin =
    initialOrigin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return {
    session: loaded && loaded.status === "completed" ? loaded : null,
    query: parseQuery(search),
    origin,
  };
}

export function ResultsView({
  retakeHref = "/quiz",
  feedbackHref = "/feedback",
  initialSearch,
  initialOrigin,
}: ResultsViewProps = {}) {
  const [{ session, query, origin }] = useState(() =>
    readInitial(initialSearch, initialOrigin),
  );
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  let source: Source = "empty";
  let score = 0;
  let total = 0;
  let persona: Persona | null = null;

  if (session?.result) {
    source = "session";
    score = session.result.correctCount;
    total = session.result.totalCount;
    persona = getPersonaForPercentage(session.result.percentage);
  } else if (query) {
    source = "query";
    score = query.score;
    total = query.total;
    persona = getPersonaForPercentage(score / total);
  }

  if (source === "empty") {
    return (
      <Card>
        <h2 className="text-2xl font-bold">No results yet</h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Take the test first — your results land here as soon as you finish.
        </p>
        <div className="mt-6">
          <Button onClick={() => (window.location.href = retakeHref)}>
            Take the test
          </Button>
        </div>
      </Card>
    );
  }

  async function onShare() {
    const url = buildShareUrl(origin, score, total);
    trackEvent({
      name: "share_click",
      payload: { score, total, source },
    });
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied — paste away.");
        return;
      } catch {
        // Fall through to fallback below.
      }
    }
    setShareMessage(`Copy this link: ${url}`);
  }

  function onRetake() {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.assign(retakeHref);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {persona && <PersonaCard persona={persona} score={score} total={total} />}

      <div className="flex flex-wrap gap-3">
        <Button onClick={onShare}>Share your result</Button>
        <Button variant="secondary" onClick={onRetake}>
          Retake the test
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            window.location.href = feedbackHref;
          }}
        >
          Suggest a question
        </Button>
      </div>

      {shareMessage && <Alert severity="success">{shareMessage}</Alert>}

      {source === "session" && session && <ResultBreakdown session={session} />}

      {source === "query" && (
        <Alert severity="info">
          Showing a shared score. Take the test yourself to see the per-question
          breakdown.
        </Alert>
      )}
    </div>
  );
}
