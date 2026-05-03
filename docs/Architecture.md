# Architecture: Unofficial Life in the UK

Reference for the MVP web experience described in [`Project_PRD.md`](Project_PRD.md). This doc captures the technology choices, data contracts, and runtime behaviour. The remaining work (UI, analytics, deploy) is tracked in [`Roadmap.md`](Roadmap.md).

---

## 1. Objectives & constraints

- Mobile-first, humour-driven quiz that loads fast (<1s on 4G) and meets WCAG AA.
- Static-first runtime: zero JS on marketing pages, a single hydrated React island for `/quiz`, a single server endpoint for the feedback form. No accounts, no PII, no DB.
- Support four question types — `single`, `multiple`, `rank`, `text` — each with optional structured special rules.
- Sharing is a static-friendly URL (e.g. `?score=18&total=24`). No signed share tokens for MVP.
- Feedback is forwarded by email — no persistence.
- All primary tooling/services on free tiers (Astro, Cloudflare Pages, Resend free, Plausible free).

---

## 2. Stack

| Concern        | Choice                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Framework      | **Astro 5** (SSG-first, server endpoints when needed)                                                    |
| Interactivity  | **React 19** as a single island via `@astrojs/react`                                                     |
| Styling        | **Tailwind CSS 4** via `@tailwindcss/vite` (CSS-first config in `src/styles/global.css`)                 |
| Forms / server | **Astro Actions** for the feedback handler                                                               |
| Email          | **Resend** (`fetch`-based, works on Workers)                                                             |
| Validation     | **Zod** for questions, personas, and form input                                                          |
| Analytics      | **Plausible** (cookieless, free tier)                                                                    |
| Hosting        | **Cloudflare Pages** + Workers via `@astrojs/cloudflare`                                                 |
| Tests          | **Vitest** (jsdom) + **@testing-library/react**, plus **Playwright** for one happy-path e2e (deferred)   |
| Tooling        | pnpm, ESLint (`eslint-plugin-astro`), Prettier (`prettier-plugin-astro`), Stylelint, Husky + lint-staged |

What was deliberately **not** chosen:

- Next.js (over-spec'd for a static quiz with one form POST)
- Radix / @dnd-kit (defer; native `<input>`s + up/down buttons handle accessibility cheaper)
- Storybook (deferred — preview components via the dev server)
- Sentry, Lighthouse CI, Dependabot (post-launch)
- Markdown-based content pipeline (`docs/QuestionBank.md` is now documentation only; questions live in `src/data/questions.ts`)

---

## 3. Project structure

```
astro.config.mjs         # Astro + integrations + Cloudflare adapter
src/
├── pages/
│   ├── index.astro      # marketing page (zero JS)
│   ├── quiz.astro       # inline <script> manually mounts QuizApp via createRoot
│   ├── results.astro    # inline <script> manually mounts ResultsView via createRoot
│   ├── feedback.astro   # inline <script> manually mounts FeedbackForm via createRoot
│   └── 404.astro
├── layouts/BaseLayout.astro
├── components/
│   ├── astro/           # SiteHeader, SiteFooter, KoFiLink, Seo helpers
│   └── react/           # QuizApp, ResultsView, FeedbackForm, primitives (built incrementally)
├── lib/
│   ├── quiz/            # sampler, scoring, validators, session, types
│   ├── personas.ts      # persona lookup helpers
│   ├── analytics.ts     # pluggable sink (configureAnalytics)
│   └── seo.ts           # buildShareMetadata
├── data/
│   ├── questions.ts     # hand-authored, validated by Zod at module load
│   ├── question-schema.ts
│   └── personas.ts
├── actions/index.ts     # Astro Actions (submitFeedback)
└── styles/global.css    # Tailwind 4 @import + @theme tokens

public/
├── union-jack.svg       # site favicon + home hero CTA background
├── favicon.ico          # legacy fallback
└── personas/            # placeholder SVGs + replacement README

tests/unit/              # Vitest suites against src/lib/* and src/data/*
docs/                    # PRD, Architecture, QuestionBank (reference), Roadmap, DesignSystem, Pitch
```

---

## 4. Domain model

```ts
// src/data/question-schema.ts
export type SpecialRule =
  | { kind: "must_include"; optionIds: number[] } // e.g. Q019 umbrella
  | { kind: "fail_on_hint"; hintId: string } // e.g. Q007 cuppa hint
  | { kind: "auto_pass"; reason: string }
  | { kind: "note"; text: string }; // documentation-only

export type Question =
  | SingleChoiceQuestion // type: "single" — pick one; multiple values in `correct` are all acceptable
  | MultipleChoiceQuestion // type: "multiple" — pick all that apply
  | RankQuestion // type: "rank" — order all options
  | TextQuestion; // type: "text" — short text with optional fuzzy match

interface BaseQuestion {
  id: `Q${number}`;
  prompt: string;
  required: boolean;
  tags: string[];
  feedback?: Record<string, string>;
  specialRules: SpecialRule[];
  credits: string[]; // e.g. Q012 ["Jess", "Simona"]
}
```

### Question type semantics

| Type       | UI                               | Correctness                                                                                                                     |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `single`   | Radio group (one selection)      | Correct if the selection appears in `correct[]`. Multiple values in `correct` mean any of them counts (Q009, Q010, Q011, Q015). |
| `multiple` | Checkbox group (any subset)      | Correct if the selected set equals `correct[]`. `must_include` rule can require specific options (Q019).                        |
| `rank`     | Ordered list (drag or up/down)   | Correct only if order matches `correct[]` exactly.                                                                              |
| `text`     | Text input with `textValidation` | Correct if the normalised input matches any `acceptableAnswers[]` (with optional `fuzzyThreshold`).                             |

### Session state

```ts
export interface QuizSession {
  id: string;
  status: "not_started" | "in_progress" | "completed";
  config: { questionCount: number; passThreshold: number; seed: string };
  questions: Question[];
  currentIndex: number;
  answers: Record<QuestionId, QuestionResponse>;
  startedAt?: number;
  completedAt?: number;
  result?: QuizResult;
}
```

`QuestionResponse` carries an optional `hintsUsed?: string[]` for the `fail_on_hint` rule.

---

## 5. Quiz engine behaviour

1. **Sampling** — `lib/quiz/sampler.ts` uses Fisher–Yates with a `mulberry32` PRNG, seeded by hashing the session seed string with a small 32-bit folding hash (`(hash << 5) - hash + charCode`). Session seeds default to `crypto.randomUUID()`. Deterministic for the same seed; today the bank holds 24 questions and `questionCount` is 24, so every session sees the full set.
2. **Answer capture** — pure reducer in `lib/quiz/session.ts`. Validators in `lib/quiz/validators.ts` deduplicate selections and enforce the `required` flag.
3. **Scoring** — `lib/quiz/scoring.ts`:
   - `single`: correct if response in `question.correct`.
   - `multiple`: set equality with `question.correct`.
   - `rank`: ordered equality.
   - `text`: trim + lowercase + optional Levenshtein similarity.
   - Special rules applied on top: `must_include` requires the listed option IDs, `fail_on_hint` flips correctness off when `hintsUsed` matches, `auto_pass` always returns true, `note` is documentation-only.
4. **Persistence** — session JSON serialised to `sessionStorage` keyed by session id; reload mid-quiz restores state.
5. **Persona** — `lib/personas.ts` looks up the highest-`minPercentage` persona at-or-below the score percentage.
6. **Results** — `/results` reads sessionStorage; falls back to `?score=&total=` query params for shared URLs (sanitised before render).
7. **Feedback** — Astro Action in `src/actions/index.ts` validates input with Zod, runs a honeypot + simple rate limit, and forwards via Resend.

---

## 6. Page architecture

- **`/`** — Static Astro page. Hero with the gov.uk-style blue accent bar, framed copy, and a Union Jack CTA linking to `/quiz`. Zero JS.
- **`/quiz`** — Astro page with a `<div id="quiz-mount" />` and an inline `<script>` that calls `createRoot(...).render(<QuizApp />)`. Per-question Submit + verdict + locked inputs after submit; submitted set persisted in `sessionStorage` (`ulituk:quiz-submitted:v1`). Restart guarded by `window.confirm`. Hint click instantly fails the question.
- **`/results`** — Same manual-mount pattern (`#results-mount`). Shows score, persona, per-question breakdown (with `Correct answer:` line and the bank's correct-answer comment), share + retake CTAs. Falls back to `?score=&total=` query params for shared URLs.
- **`/feedback`** — Same manual-mount pattern (`#feedback-mount`). Form submits via the `submitFeedback` Astro Action.
- **`/404`** — Static not-found page.

### Why manual `createRoot` instead of `client:*` directives

`@astrojs/react@4.4.2` + Astro 5.18 + React 19 hits a renderer bug where the island reports `client-render-time` but never commits any DOM children. We sidestep it by skipping the directive: each interactive page renders an empty mount div and an inline `<script>` that imports the component and calls `createRoot(...).render(...)`. In dev, `BaseLayout.astro` injects the Vite React Refresh preamble (`window.__vite_plugin_react_preamble_installed__ = true`) before any island module loads, since our scripts aren't picked up by the plugin's normal preamble injection.

---

## 7. Styling & accessibility

- Tailwind 4 CSS-first: brand colours and font stacks live as `@theme` tokens in `src/styles/global.css` and are consumed via `var(--color-*)` or generated utilities.
- Mobile-first; `clamp()` typography for scaling.
- Semantic HTML throughout: `<fieldset>`/`<legend>` for option groups, `<output>` for live score, `aria-live` for form feedback.
- Skip-to-content link in `BaseLayout`.
- Dark mode is **not** shipped in MVP (see Roadmap). All Tailwind utilities are light-mode only.
- `prefers-reduced-motion` respected in transitions.

---

## 8. Analytics, SEO, privacy

- **Plausible** script embedded in `BaseLayout` (only when `PUBLIC_PLAUSIBLE_DOMAIN` is set). Events fired today: `quiz_start`, `quiz_complete`, `feedback_submit`, `share_click`, `ko_fi_click` (the last via click delegation in `BaseLayout` matching `[data-ko-fi-link]`).
- **SEO** — `<Seo>` Astro helper composes title/description/OG tags. `@astrojs/sitemap` generates `/sitemap-index.xml`. `public/robots.txt` allows everything.
- **Privacy** — no cookies, no localStorage of PII, no server-side persistence. The optional feedback email is forwarded inside the email body and discarded immediately.

---

## 9. Configuration & environment

`.env.example` documents the variables. `PUBLIC_*` are exposed to the browser; the rest are server-only.

| Variable                  | Surface | Purpose                                              |
| ------------------------- | ------- | ---------------------------------------------------- |
| `RESEND_API_KEY`          | server  | Outbound feedback email                              |
| `FEEDBACK_TO_EMAIL`       | server  | Inbox that receives forwarded feedback               |
| `FEEDBACK_FROM_EMAIL`     | server  | Sender for feedback emails (must be Resend-verified) |
| `PUBLIC_KO_FI_URL`        | client  | Ko-fi destination for donation CTAs                  |
| `PUBLIC_PLAUSIBLE_DOMAIN` | client  | Domain registered with Plausible                     |

---

## 10. Testing strategy

- **Unit** (Vitest, jsdom): `lib/quiz/*`, `lib/personas`, `data/personas`, `data/questions` (Zod parse). Coverage target: meaningful tests on the engine, not arbitrary thresholds.
- **Component**: React Testing Library for the quiz primitives once they exist.
- **E2E**: One Playwright happy-path covering start → finish → results → share → feedback. Deferred.
- **Mocks**: deterministic seed for sampler tests; mock `Resend` client in feedback tests.

---

## 11. Deployment

- Cloudflare Pages with `@astrojs/cloudflare` adapter. `output: "server"`; every page sets `export const prerender = true` so HTML output is identical to a static build, with only the feedback Action endpoint server-rendered.
- One GitHub Actions workflow (`.github/workflows/ci.yml`): install → lint → lint:styles → typecheck → unit tests → build.
- Security headers configured via Cloudflare Pages settings (CSP, Referrer-Policy, X-Content-Type-Options).
- No middleware, no edge functions beyond the feedback POST.

---

## 12. Open questions

- **Persona artwork** — placeholders ship with the migration; final illustrations need commissioning. Slugs in `src/data/personas.ts`.
- **Plausible domain** — confirm before launch.
- **Q012 credit attribution** — “Jess & Simona” currently in the `credits` field; confirm names before public launch.
