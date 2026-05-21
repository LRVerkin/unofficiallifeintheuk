# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                                    # Astro dev server on :4321
pnpm typecheck                              # astro check && tsc --noEmit
pnpm lint                                   # ESLint (zero-warning policy)
pnpm test:unit                              # Vitest, jsdom env
pnpm exec vitest run path/to/file.spec.ts   # single test file
pnpm exec vitest run -t "match by name"     # single test by name pattern
pnpm build                                  # production build → dist/
```

Husky + lint-staged run ESLint, Stylelint, and Prettier on staged files pre-commit. Tests live under `tests/**/*.{test,spec}.{ts,tsx}`; the `@/` alias resolves to `./src/`.

## Architecture

### Framework boundary

The quiz engine in `src/lib/quiz/` is **pure and framework-free** — no React, no Astro imports. `session.ts` exposes pure reducers (`createSession`, `startSession`, `answerQuestion`, `goToNextQuestion`, `completeSession`, etc.) over the `QuizSession` type in `types.ts`. `scoring.ts`, `sampler.ts` (Mulberry32-seeded Fisher-Yates), `validators.ts`, and `persistence.ts` are all pure. When changing quiz behaviour, change the pure functions and call them from the UI; do not put logic in the React layer.

`src/components/react/QuizApp.tsx` wraps these helpers in a `useReducer`. Reducer actions map almost 1:1 to the pure functions: `answer`, `use_hint`, `next`, `force_next`, `prev`, `complete`, `reset`.

### Page-rendering model

`astro.config.mjs` sets `output: "server"`, but **every page sets `export const prerender = true`**. The server mode exists only so the feedback Astro Action endpoint can run. Marketing pages ship zero JS; only `/quiz`, `/results`, and `/feedback` mount React islands (`client:load` or `client:only="react"`).

### Quiz submission flow

Each question is submitted **individually** — not at the end. After `Submit answer`, the input locks (`disabled` propagates into the input primitive), an `Alert` shows correct/incorrect + per-option feedback, and the primary button advances to Next/Finish. Clicking a hint on a `fail_on_hint` question **auto-submits** and marks it wrong. The submitted set is tracked in React state (`submitted: Set<string>`) and persisted under its **own** sessionStorage key (`ulituk:quiz-submitted:v1`), independent of the session JSON (`ulituk:quiz-session:v1`). Don't merge these — they have different lifecycles (Restart clears submitted; reload preserves both).

### Question authoring

`src/data/questions.ts` is the **source of truth** for the 24 questions, validated at module load by Zod (`question-schema.ts`). Broken data fails the build. `docs/QuestionBank.md` is human-readable documentation only — the markdown is not parsed. A drift test (`tests/unit/data/question-drift.spec.ts`) enforces `Q\d{3}` ID parity between the two files; when adding or removing a question, update both.

### Special rules

Defined as a discriminated union in `src/data/question-schema.ts`, applied on top of base scoring in `src/lib/quiz/scoring.ts`:

- `auto_pass` — always counts correct
- `fail_on_hint` — correctness flips off when `hintsUsed` contains the hint id (UI auto-submits)
- `must_include` — multiple-choice question must include the listed option ids
- `note` — documentation-only, no runtime effect

### Persona lookup is sort-order-dependent

`src/lib/personas.ts:getPersonaForPercentage` does a `find` and takes the first match — it requires `personas` in `src/data/personas.ts` to stay **sorted descending by `minPercentage`**. Re-sorting that array silently breaks results. The lookup file has an inline comment; preserve the invariant.

### Analytics

`src/lib/analytics.ts` has a pluggable sink (default no-op). `BaseLayout.astro` runs `installPlausibleSink()` in a small inline script, so React islands' `trackEvent` calls forward through `window.plausible(...)` in production. Tests run against the default no-op sink — don't assert on Plausible globals.

### Feedback action

`src/actions/submit-feedback.ts` is an Astro Action: Zod validates input (10–2000 char message, optional email, required-empty `hp` honeypot), `src/lib/feedback/format.ts` composes the email, Resend sends it. There is no rate limiter — this is deliberate (Workers' per-isolate `Map` isn't a real limiter; a KV/Upstash token bucket is tracked as a Phase 9 follow-up in [docs/Roadmap.md](docs/Roadmap.md)).

### Vitest stubs

`vitest.config.ts` aliases `astro:actions` and `astro:schema` to `tests/stubs/` so component tests can import (or lazy-import) the feedback action without needing the Astro runtime. When adding tests that touch action code, use these stubs rather than mocking Astro internals.

### Styling

Tailwind 4 CSS-first: tokens live as `@theme` blocks in `src/styles/global.css`. Components frequently consume them via `var(--color-*)` directly (see `Card.tsx`) rather than through generated utilities. No `dark:` utilities ship today — dark mode is deferred (see [docs/Roadmap.md](docs/Roadmap.md) Phase 9).

## Conventions worth respecting

- **Deliberately not adopted** (see [docs/Architecture.md](docs/Architecture.md) §2): Next.js, Radix, drag-and-drop libraries, Storybook, Sentry, Lighthouse CI, Dependabot, a markdown-based content pipeline. Don't reintroduce them without raising the trade-off.
- **No PII, no cookies, no server-side persistence.** The feedback action forwards a message via email and discards it.
- **No dark mode** in MVP — keep Tailwind utilities light-mode-only.

## Where docs live

- [README.md](README.md) — setup, scripts, env vars, deploy
- [docs/Architecture.md](docs/Architecture.md) — domain model, page architecture, engine behaviour
- [docs/Project_PRD.md](docs/Project_PRD.md) — product spec
- [docs/Roadmap.md](docs/Roadmap.md) — shipped phases and remaining work
- [docs/DesignSystem.md](docs/DesignSystem.md) — React primitive components only
- [docs/QuestionBank.md](docs/QuestionBank.md) — human-readable question reference (drift-tested)
