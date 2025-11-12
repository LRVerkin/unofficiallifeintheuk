# Architecture: Unofficial Life in the UK

Comprehensive blueprint for implementing the MVP web experience described in the PRD. It captures technology choices, project organisation, data contracts, runtime behaviour, and the Test-Driven Development (TDD) methodology that will guide implementation.

---

## 1. Objectives & Constraints

- Deliver a mobile-first, humour-driven quiz that loads fast (<1s on 4G) and meets WCAG AA.
- Keep the MVP serverless and stateless: no user accounts, minimal persistence, no PII collection.
- Support multiple question types (single, multiple, rank, text) and special scoring rules.
- Make sharing simple (link with score summary, diploma card, persona reveal); publish-friendly SEO and social cards.
- Provide a lightweight feedback loop for question suggestions via a single form that forwards to email.
- Require TDD for all application logic and UI flows.

---

## 2. System Overview

- **Presentation**: Next.js 15 (App Router) + React 18, pre-rendered marketing pages with client-side quiz experience.
- **Data**: Static question bank (TypeScript module generated from `QuestionBank.md`) plus persona metadata (`data/personas.ts`) and Ko-fi/feedback configuration. Quiz session state lives in browser memory with optional `sessionStorage` for reload resilience.
- **Business Logic**: Client-side quiz engine handles sampling, validation, scoring (including text normalisation), persona mapping, and result aggregation. Feedback form calls a server action/API route that forwards submissions.
- **Integrations**: Plausible Analytics (script embed) for privacy-friendly telemetry; transactional email provider (e.g., Resend) used by the feedback endpoint; Ko-fi is a static outbound link.
- **Deployment**: Vercel hosting (supports static generation + edge/serverless functions if needed later).

---

## 3. Technology Stack Decisions

- All primary tooling/services must be free/open-source or operate on a free tier for the MVP (e.g., pnpm, Next.js, Tailwind, Plausible’s free analytics plan); any future paid upgrade requires explicit approval.
- **Language**: TypeScript everywhere for type safety and clear domain contracts.
- **Framework**: Next.js 15 App Router for hybrid SSG/SSR, route conventions, React 18+ features, and incremental adoption of the latest stable APIs.
- **Styling**: Tailwind CSS with `@tailwindcss/typography` + CSS custom properties for theme; use Radix UI primitives for accessibility where helpful (e.g., dialogs, tooltips).
- **State Management**: React hooks; `useReducer` + context for quiz session state, co-located component state for UI details.
- **Forms & Validation**: Controlled inputs with custom hooks per question type; text answers normalised (trim, case-fold, punctuation strip) with optional fuzzy matching; feedback form validated with Zod before submission.
- **Email Delivery**: Resend (or Postmark) SDK invoked from a Next.js route handler using API key stored in environment variables.
- **Testing**:
  - Unit: Vitest + React Testing Library + Testing Library user-event.
  - Integration: Component tests with Playwright Component Testing (optional) or RTL.
  - E2E: Playwright (runs against Next dev server / preview build).
- **Tooling**: pnpm as package manager; ESLint (Next config + custom rules), Prettier, Commitlint (optional).
- **Component Workbench**: Storybook intentionally deferred for MVP; preview components via local Next routes and reevaluate once the component library grows (post-Step 5).
- **CI/CD**: GitHub Actions (lint, typecheck, unit, component, e2e on preview build) + Vercel preview deployments.

---

## 4. Project Structure

```
.
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # "/" marketing page
│   ├── feedback/
│   │   ├── page.tsx             # "/feedback" suggestions form
│   │   └── components/
│   │       └── FeedbackForm.tsx
│   ├── quiz/
│   │   ├── page.tsx             # quiz flow entry
│   │   ├── components/
│   │   │   ├── QuizShell.tsx
│   │   │   ├── QuestionRenderer.tsx
│   │   │   ├── controls/...
│   │   │   └── ProgressBar.tsx
│   │   └── hooks/
│   ├── results/
│   │   ├── page.tsx             # shareable summary
│   │   └── components/
│   │       ├── DiplomaCard.tsx
│   │       └── SharePersona.tsx
│   └── api/
│       ├── feedback/route.ts    # submit feedback email
│       └── share/route.ts       # optional signed share tokens (future)
├── components/
│   ├── layout/
│   ├── ui/                      # generic design system atoms
│   └── cta/KoFiLink.tsx
├── data/
│   ├── questions.ts             # typed question bank
│   ├── personas.ts              # persona metadata for success screen
│   └── question-schema.ts       # Zod schemas + TypeScript types
├── lib/
│   ├── quiz/
│   │   ├── sampler.ts           # random selection logic
│   │   ├── scoring.ts
│   │   ├── validators.ts
│   │   └── session.ts           # state transitions
│   ├── personas.ts              # persona lookup helpers
│   ├── feedback/
│   │   ├── send-feedback.ts     # server-side email invoker
│   │   └── rate-limit.ts        # simple in-memory limiter
│   ├── analytics.ts
│   └── seo.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── playwright.config.ts
├── vitest.config.ts
├── tailwind.config.ts
└── package.json / pnpm-workspace.yaml
```

---

## 5. Domain Model & Interfaces

TypeScript contracts underpin domain logic and component props. Generated question data must conform to these interfaces to keep runtime safe.

```ts
// data/question-schema.ts
export type QuestionType = "single" | "multiple" | "rank" | "text";

export type QuestionId = `Q${number}`;

export interface BaseQuestion<T extends QuestionType, Correct> {
  id: QuestionId;
  type: T;
  prompt: string;
  required: boolean;
  tags: string[];
  feedback?: Record<string, string> & {
    correct?: string;
    incorrect?: string;
    overall_correct?: string;
  };
  specialRules?: SpecialRule[];
  correct: Correct;
}

export type SingleChoiceQuestion = BaseQuestion<"single", number[]>;
export type MultipleChoiceQuestion = BaseQuestion<"multiple", number[]>;
export type RankQuestion = BaseQuestion<"rank", number[]>;
export interface TextQuestion extends BaseQuestion<"text", string[]> {
  textConfig?: {
    ignoreCase?: boolean; // default true
    trimWhitespace?: boolean; // default true
    collapseWhitespace?: boolean; // default true
    stripPunctuation?: boolean; // default true
    fuzzyThreshold?: number; // optional Levenshtein ratio 0-1
  };
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | RankQuestion
  | TextQuestion;

export interface SpecialRule {
  kind: "allowPartial" | "mustInclude" | "acceptRange" | "failOnHint";
  params: Record<string, unknown>;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  minPercentage: number; // inclusive boundary
  imageSrc: string; // Next Image static asset
}

export interface FeedbackSubmission {
  message: string;
  contactEmail?: string;
  metadata: {
    sessionId?: string;
    userAgent?: string;
    path: string;
  };
}
```

**Session state**

```ts
// lib/quiz/session.ts
export interface QuizConfig {
  questionCount: number; // e.g., 24 in MVP
  passThreshold: number; // e.g., 0.75
  seed?: string; // deterministic seed persisted per session
}

export interface Answer {
  questionId: QuestionId;
  response: number[] | string;
  status: "unanswered" | "answered";
}

export interface QuizSession {
  id: string; // uuid
  status: "not-started" | "in-progress" | "completed";
  config: QuizConfig;
  seed: string; // required once session starts for reproducibility
  questions: Question[];
  answers: Record<QuestionId, Answer>;
  startedAt?: number;
  completedAt?: number;
  result?: QuizResult;
}

export interface QuizResult {
  correctCount: number;
  totalCount: number;
  percentage: number;
  passed: boolean;
  persona: Persona;
  diplomaAsset: string; // static asset path used in celebration card
  shareCard: {
    headline: string;
    description: string;
    imageSrc: string;
  };
  breakdown: Array<{
    questionId: QuestionId;
    isCorrect: boolean;
    feedback: string | null;
  }>;
}
```

---

## 6. Data Pipeline

- Source of truth remains `QuestionBank.md`.
- Implement a dev-time script (`scripts/generate-question-bank.ts`) that parses Markdown and outputs `data/questions.ts` typed module. Script runs on `pnpm build` and `pnpm prepare`.
- Validate generated data against Zod schemas; fail build if discrepancies.
- Persona metadata maintained manually in `data/personas.ts` with Zod validation to ensure non-overlapping score ranges and existing image assets.
- During runtime, import `questions.ts` (tree-shaken static data). Generate and persist a deterministic seed per session (e.g., uuid → hash -> seedrandom) so that we can reproduce the question order later and eventually ship “share the exact quiz” links.

---

## 7. Quiz Engine Behaviour

1. **Sampling**: `sampler.ts` shuffles the full bank with Fisher-Yates and slices to `quizConfig.questionCount`, seeded using the session’s stored seed so the same seed yields identical sets. Launch data contains 24 total questions, so every session currently yields the same set; keeping the sampling infrastructure ensures future question-bank expansions work without code changes. Ensure rank/multiple questions still included evenly by weighting tags if required later.
2. **Answer capture**: Each renderer emits canonical `Answer` objects. Controlled inputs provide validation feedback (e.g., multi-select requires at least one option).
3. **Progression**: `useQuizSession` reducer tracks current index, visited questions, and enforces required answers before allowing submission; persists `answers` + last visited question to `sessionStorage`.
4. **Scoring** (`scoring.ts`):
   - Single choice: correct if `response[0]` matches.
   - Multiple: ensure sorted equality; optional partial scoring if `allowPartial`.
   - Rank: deep equality of array order unless rule overrides.
   - Text: normalise according to `textConfig` (trim, lower, collapse whitespace, strip punctuation). Expand `correct` array with synonyms and optionally compute a Levenshtein ratio when `fuzzyThreshold` is present.
   - Special rules evaluated per question; they can override correctness (e.g., `acceptRange` for arrival times).
5. **Results**: Calculated result stored in session and passed via router state to `/results`. Map `percentage` to a `Persona` (from `data/personas.ts`), derive `diplomaAsset` + share card content, and persist with the result payload. Include the `seed` in router state so that future features can recreate the exact quiz. Query param fallback (e.g., `?score=18&total=24&seed=abc123`) for share links; sanitise inputs when hydrating results page.
6. **Feedback submissions**: Standalone hook posts to `/api/feedback` with `FeedbackSubmission`. Route validates payload (including optional email), checks honeypot/rate-limit guard, and invokes the email provider to deliver the message to `feedback@unofficiallifeintheuk.com` with the email noted or “anonymous” when omitted. Return JSON success/error for optimistic UI updates.
7. **Session exit tracking**: `useQuizSession` registers `visibilitychange`/`beforeunload` listeners to fire a `question_exit` analytics event with the last viewed question id and elapsed time when users abandon mid-quiz (debounced to avoid duplicate firing).

---

## 8. Page & Component Architecture

- **`/` (Home)**: Static page, `generateMetadata()` for SEO/social; hero section presents the ACTUAL Life in the UK pitch excerpt (from `docs/Unofficial Life in the UK - Pitch.md`) with CTA button linking to `/quiz`. Footer includes `KoFiLink` component and prominent link to `/feedback`.
- **`/about`**:
  - Lightweight introduction to the creators (Louise & Quentin) with optional social link placeholders.
  - Includes CTA pointing users to `/feedback` for suggestions/questions.
- **`/quiz`**:
  - `QuizShell`: wraps header/footer, orchestrates session.
  - `QuestionRenderer`: delegates to type-specific components (`SingleChoiceQuestion`, `MultipleChoiceQuestion`, `RankQuestion` with accessible drag-and-drop via `@dnd-kit/core`, `TextQuestion`).
  - `QuizNav`: Next/Previous, finish button disabled until validation passes.
  - `ProgressBar`: shows current index out of total, accessible text.
- **`/results`**:
  - Accepts router state or query params.
  - Displays score, pass/fail banner, `DiplomaCard` with persona artwork, breakdown accordion with user answer vs correct, witty feedback.
  - `ShareResult` component composes share card metadata, copies URL (using `navigator.clipboard`), and offers download/Share API options.
  - Secondary CTAs: `RetakeButton`, `KoFiLink`, and `FeedbackButton` linking to `/feedback`.
- **`/feedback`**:
  - Server component shell with `FeedbackForm` client component.
  - Form includes textarea, optional single-line email input, character counter, and hidden honeypot. Client validation ensures minimum length before POST and email format checks when provided.
  - On submit, call `/api/feedback`; optimistic success message plus fallback mailto link.
- **Global layout**: `app/layout.tsx` sets fonts (e.g., CSS variable fonts via `next/font`), theme colours, analytics include.
- **Design system primitives**: Buttons, card, alert, progress indicator, tooltip, etc., exported from `components/ui`.

---

## 9. Styling & Theming

- Tailwind configured with custom colour palette (Union Jack accents), spacing scale tuned for mobile-first layout.
- Use logical properties (e.g., `margin-inline`) and clamp-based typography for responsiveness.
- Animations limited to CSS transitions with `prefers-reduced-motion` fallbacks.
- Diploma/Persona artwork rendered inside responsive cards with optional `@media print` styles to support PDF download.
- Dark mode optional later; start with light theme but keep tokens to allow expansion.

---

## 10. Accessibility & Performance

- Semantic HTML: headings, lists, ARIA attributes on interactive controls (especially drag-and-drop ranking).
- Keyboard-first design: `tabIndex` order, focus outlines, skip-to-content link in layout.
- Ensure question components expose accessible names (e.g., use `<fieldset>` + `<legend>` for options).
- Feedback form uses `<label>`/`aria-describedby` for helper text and announces success/failure via `aria-live`.
- Preload question data at build time; avoid large bundles by code-splitting quiz vs marketing routes.
- Use Next Image for optimised assets; lean icon strategy (hero icons or custom inline SVG).

---

## 11. Analytics, Telemetry & SEO

- Integrate Plausible via script in `<head>` with manual events (`plausible('quiz_start')`, `plausible('feedback_submit')`, `plausible('ko_fi_click')`, `plausible('question_exit', { questionId })`, etc.).
- SEO metadata in `lib/seo.ts`; dynamic Open Graph images using Vercel OG (optional) seeded with persona/diploma artwork for richer shares.
- Sitemap and robots generated via Next route handlers (`app/sitemap.ts`).
- No cookies; compliance note in footer.

---

## 12. Configuration & Environment

- `.env.local` for runtime configuration (analytics domain, share secret if using tokenised links, `RESEND_API_KEY`, `FEEDBACK_TO_EMAIL`, `KO_FI_URL` override).
- `next.config.js` to enable `eslint` on build, image domains if we host assets externally.
- Add `app/config.ts` exporting constants: `QUIZ_CONFIG`, `PASS_THRESHOLD`, `ALLOW_RETRO_NAVIGATION`, `KO_FI_URL`, persona asset map, etc. Provide centralised tuning point.

---

## 13. Testing & TDD Strategy

- **Philosophy**: Write failing tests first at the smallest useful scope, implement to pass, refactor while keeping tests green.
- **Unit tests** (`tests/unit`):
  - `sampler.spec.ts`: deterministic question sampling, ensures no duplicates.
  - `scoring.spec.ts`: cover each question type, special rules (`acceptRange`, `mustInclude`), text normalisation + fuzzy thresholds.
  - `validators.spec.ts`: ensures answer validation catches incomplete submissions and enforces text minimums.
  - `analytics.spec.ts`: ensures events triggered with correct payload.
  - `personas.spec.ts`: verifies persona lookup boundaries and ensures no percentage gaps.
  - `feedback/send-feedback.spec.ts`: mocks email provider, asserts rate limit + payload shaping.
- **Component tests** (`tests/integration`):
  - `QuestionRenderer.spec.tsx`: ensures correct component renders per type, ARIA compliance.
  - `QuizShell.spec.tsx`: navigation flow, disabled finish until requirements met.
  - `DiplomaCard.spec.tsx`: renders persona data, alt text, download/share buttons.
  - `FeedbackForm.spec.tsx`: validates field states, honeypot, optimistic success.
- **E2E tests** (`tests/e2e/quiz.spec.ts` via Playwright):
  - Full run: start quiz, answer sample questions, submit, see pass/fail message.
  - Accessibility smoke: check keyboard navigation, focus trap.
  - Share flow: copy link, open results page with query params, verify diploma card render.
  - Feedback flow: navigate to `/feedback` from results, submit form (mock API) and confirm success toast.
  - Ko-fi CTA: visible on home footer and results page, opens donation link in new tab.
- **Mocking**: Stub `clipboard` and `analytics` modules; deterministic RNG via seed injection.
- **Automation**:
  - `pnpm test:unit` (Vitest watch).
  - `pnpm test:integration` (Vitest jsdom env).
  - `pnpm test:e2e` (Playwright against `pnpm next dev` or preview build).
  - CI matrix runs lint, typecheck, unit, integration, e2e in parallel jobs.
- **Coverage**: Enforce ≥90% statements on domain logic (`lib/quiz`), ≥80% overall. Coverage thresholds enforced in Vitest config.

---

## 14. Local Development Workflow

1. `pnpm install`
2. `pnpm generate:questions` (parses markdown -> typed data; runs automatically on dev/start).
3. `pnpm dev` launches Next dev server + Playwright component viewer (optional separate command).
4. TDD loop: write failing test → implement → run `pnpm test:unit --watch`.
5. Before commit: `pnpm lint`, `pnpm typecheck`, `pnpm test`.
6. Pre-commit hook (Husky) runs lint + unit tests on staged files.

---

## 15. CI/CD Pipeline

- GitHub Actions workflows:
  - `ci.yml`: triggered on PR/push.
    - Install (pnpm cache).
    - Generate data + run `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, `pnpm test:integration`.
    - Build Next app (`pnpm build`).
    - Run Playwright e2e against production build (`pnpm test:e2e --project=chromium`).
    - Upload Playwright traces on failure.
  - `release.yml` (optional): tag main branch to create production deployment in Vercel.
- Vercel previews for each PR; automated Lighthouse CI can run against preview (optional).

---

## 16. Observability & Logging

- Client-side logging via lightweight wrapper (`lib/logger.ts`) that no-ops in production except for warnings/errors (sends to `console` in dev).
- Track custom analytics events for funnel metrics (start, finish, share).
- Optionally send anonymised result data to edge function later (not MVP).
- Feedback route logs envelope metadata (timestamp, user agent) to server console for troubleshooting; ensure logs exclude message body to avoid PII retention.
- Store last-question data in memory/session for `question_exit` analytics so content team can spot high-abandon items.

---

## 17. Security & Privacy Considerations

- No storage of personal data; results only in browser session.
- CSP headers via Next middleware: script-src includes Plausible, self.
- Validate all query parameters on `/results` to prevent XSS; never render untrusted strings without escaping.
- Feedback endpoint enforces honeypot, rate limiting, and input sanitisation; it forwards the optional user email alongside the message body (flagged as anonymous when omitted), strips script tags, and caps length before emailing so nothing is persisted server-side.
- Dependabot (or Renovate) to keep dependencies updated.

---

## 18. Future Enhancements (Post-MVP Hooks)

- Serverless endpoint to persist anonymised stats (score distribution) for admin dashboard.
- Question authoring CMS (e.g., Sanity) replacing static markdown.
- Localisation and additional quiz banks.
- User opt-in to store history via Supabase / Auth if feature requests demand.

---

## 19. Open Questions

- Do we need deterministic seeding for share links (so viewers can replay the exact quiz)? Default is no; can add later.
- Should ranking questions expose keyboard controls via buttons or roving tabindex? Proposed solution uses DnD kit with `@dnd-kit/accessibility`, but confirm UX.
- Confirm analytics domain (plausible.io vs self-host) before deployment.
- Finalise persona roster (names, descriptions, image licensing) and confirm we are comfortable shipping them in MVP.
- Decide on transactional email provider (Resend vs Postmark) and ensure environment variables available in hosting platform.

With these decisions, the team can begin implementation immediately using a TDD workflow, confident that the architecture aligns with the PRD, performance targets, and humour-first product vision.
