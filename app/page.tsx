import Link from "next/link";
import { KoFiLink } from "@/components/cta/KoFiLink";

const FEATURES = [
  {
    title: "24 spicy questions",
    body: "Single choice, multiple choice, drag-to-rank, and short text answers that actually reflect life in the UK.",
  },
  {
    title: "Instant personas",
    body: "Results unlock a bespoke British persona, witty diploma, and tasteful share card.",
  },
  {
    title: "Accessible & fast",
    body: "Built mobile-first with WCAG AA color contrast, keyboard support, and <1s loads.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="rounded-3xl border border-[var(--color-border)] bg-white px-6 py-10 shadow-card dark:bg-surface">
        <p className="text-sm uppercase tracking-[0.25rem] text-brand-secondary">
          Unofficial Life in the UK
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-snug sm:text-5xl">
          The only Life in the UK test that asks important things like the
          correct way to queue.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Take 24 satirical-yet-accurate questions, hit submit, and unlock a
          bespoke British persona with shareable diploma. No logins, no data
          capture, just vibes.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/quiz"
            className="rounded-full bg-brand-primary px-6 py-3 text-base font-semibold text-white shadow-card transition hover:bg-brand-secondary"
          >
            Take the Test
          </Link>
          <KoFiLink variant="button" />
        </div>
      </section>

      <section
        id="quiz"
        className="grid gap-6 md:grid-cols-3"
        aria-label="Quiz highlights"
      >
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-5 backdrop-blur"
          >
            <h3 className="font-display text-xl">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
          </article>
        ))}
      </section>

      <section
        id="results"
        className="rounded-3xl border border-dashed border-brand-secondary/40 p-6"
      >
        <h2 className="font-display text-2xl">Results in one tap</h2>
        <p className="mt-3 text-base text-muted-foreground">
          Every quiz session calculates pass/fail, highlights misunderstood
          questions, and reveals a persona like “Tea Sommelier” or “Tube
          Oracle.” The `/results` route will eventually show breakdowns, share
          cards, and download options.
        </p>
      </section>
    </div>
  );
}
