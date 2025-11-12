# Project Plan: Unofficial Life in the UK

## Overview

- Step 1 – Environment & Tooling Foundations
- Step 2 – Content Pipeline & Domain Modeling
- Step 3 – Core Quiz Engine Services
- Step 4 – UI Framework & Design System
- Step 5 – Quiz Experience Implementation
- Step 6 – Results & Sharing Flow
- Step 7 – Feedback & Email Integration
- Step 8 – Analytics, SEO & Compliance
- Step 9 – Testing & Quality Automation
- Step 10 – Deployment, Observability & Operations
- Step 11 – Launch Readiness & Continuous Improvement

---

## Step 1 – Environment & Tooling Foundations

**Goal**: Establish a maintainable Next.js 15 + TypeScript workspace with shared conventions, automation, and DX tooling that enable TDD.

**Key Tasks**

1. Confirm Node.js LTS (≥20) and install pnpm; document prerequisites in `README.md`.
2. Scaffold Next.js App Router project structure aligned to the Architecture doc (app/, components/, data/, lib/, tests/).
3. Enable strict TypeScript settings, path aliases (`@/lib`, `@/components`, etc.), and configure `tsconfig.json` for tests.
4. Install and configure Tailwind CSS, PostCSS, and autoprefixer; create `tailwind.config.ts` with design tokens placeholders.
5. Add linting and formatting stack: ESLint with Next + custom rules, Prettier, Stylelint (optional), and `lint-staged` + Husky pre-commit hooks.
6. Define package scripts (`dev`, `build`, `lint`, `typecheck`, `test:unit`, `test:integration`, `test:e2e`, `prepare`).
7. Create `.env.example` and document required runtime variables (`RESEND_API_KEY`, `PLAUSIBLE_DOMAIN`, etc.).
8. Set up VSCode workspace settings (recommended extensions, formatting on save) to keep contributors aligned.

**Deliverables**

- Bootstrapped repository with repeatable setup instructions and automated checks.
- Verified local dev server (`pnpm dev`) with placeholder routes responding.

**Dependencies**: None.

---

## Step 2 – Content Pipeline & Domain Modeling

**Goal**: Implement the authoritative question and persona data pipeline with validation and build-time generation that reflect the PRD and Architecture contracts.

**Key Tasks**

1. Finalise TypeScript domain types and Zod schemas in `data/question-schema.ts` for questions, answers, special rules, and personas.
2. Design `scripts/generate-question-bank.ts` to parse `docs/QuestionBank.md`, validate with Zod, and emit `data/questions.ts`.
3. Integrate the generator into `pnpm build`, `pnpm prepare`, and a dedicated `pnpm generate:questions` script; fail builds on validation errors.
4. Add snapshot tests to ensure generator output stability and example-driven parsing edge cases (multi-select, rank, text fuzzy rules).
5. Author `data/personas.ts` with metadata, score brackets, and asset references; include schema validation to prevent gaps or overlaps.
6. Document the content editing workflow (update Markdown → run generator → run tests) in `docs/README.md` or `CONTRIBUTING.md`, including a note that the launch bank currently matches the 24-question run but the tooling already supports larger pools.

**Deliverables**

- Typed `data/questions.ts` generated from Markdown with automated validation.
- Persona metadata module with passing tests confirming bracket coverage.
- Maintained documentation describing how to add or update questions.

**Dependencies**: Step 1 (project tooling).

---

## Step 3 – Core Quiz Engine Services

**Goal**: Build the functional quiz logic layer (sampling, state, scoring, persona selection) as reusable, fully tested modules.

**Key Tasks**

1. Implement `lib/quiz/session.ts` with state types, reducer, and session lifecycle helpers (start, answer, progress, complete, reset).
2. Create `lib/quiz/sampler.ts` for seeded shuffling and selection; ensure deterministic output via `seedrandom` or native crypto with tests.
3. Develop `lib/quiz/scoring.ts` covering single, multi, rank, and text questions; include special rule handlers (`allowPartial`, `acceptRange`, `mustInclude`, `failOnHint`).
4. Write `lib/quiz/validators.ts` to enforce required questions, multi-select minimums, rank completeness, and text normalization configuration.
5. Implement persona lookup logic in `lib/personas.ts`, mapping percentage thresholds to persona metadata and diploma assets.
6. Provide utility modules for analytics event helpers and share payload shaping (`lib/analytics.ts`, `lib/seo.ts` scaffolding).
7. Follow TDD: create comprehensive unit tests in `tests/unit` for each module, covering edge cases and failure modes.

**Deliverables**

- Reusable quiz engine modules with ≥90% unit test coverage.
- Clear API surface for UI hooks to consume quiz state and computed results.

**Dependencies**: Steps 1–2.

---

## Step 4 – UI Framework & Design System

**Goal**: Establish layout scaffolding, styling primitives, and accessibility foundations consistent with the Architecture guidelines (Storybook deferred; components previewed via local routes for now).

**Key Tasks**

1. Configure global styles (`app/globals.css`) with Tailwind layers, CSS custom properties, typography scale, and `prefers-reduced-motion` support.
2. Implement `app/layout.tsx` with Next fonts, meta defaults, Plausible script placeholder, skip-to-content link, and footer structure.
3. Build base components in `components/ui` (Button, Card, Input, Checkbox, RadioGroup, Progress, Tooltip, Alert) leveraging Tailwind + Radix where needed.
4. Add layout components (`components/layout/SiteHeader.tsx`, `SiteFooter.tsx`) including parody disclaimer, Ko-fi link slot, and navigation anchors.
5. Create CTA components (`components/cta/KoFiLink.tsx`, share buttons) with analytics hooks ready.
6. Document component usage guidelines and accessibility expectations in `docs/Architecture.md` or new `docs/DesignSystem.md`.

**Deliverables**

- Consistent design system primitives ready for page composition.
- Verified responsiveness across mobile-first breakpoints using Storybook or lightweight component previews (optional).

**Dependencies**: Step 1 (Tailwind, project scaffold).

---

## Step 5 – Quiz Experience Implementation

**Goal**: Deliver the `/quiz` route with interactive, accessible question flows backed by the quiz engine.

**Key Tasks**

1. Scaffold `app/quiz/page.tsx` and supporting layout; wire `generateMetadata` stub for share previews.
2. Implement `QuizShell` component to initialise sessions, hydrate questions, persist session state to `sessionStorage`, and expose analytics events.
3. Build `QuestionRenderer` dispatcher with type-specific components:
   - `SingleChoiceQuestion` using radio groups.
   - `MultipleChoiceQuestion` with checkbox groups and selection validation.
   - `RankQuestion` using accessible drag-and-drop (e.g., `@dnd-kit/core`) plus keyboard fallback.
   - `TextQuestion` with normalization hints and validation messaging.
4. Add navigation controls (`QuizNav`, `ProgressBar`) enforcing required completion before finish, including disabled states and screen-reader labels.
5. Integrate error handling and retry UI if question data fails to load; show loading skeleton for initial render.
6. Instrument analytics events (start, question_answered, question_exit) within hooks.
7. Implement component and integration tests (`tests/integration/QuizShell.spec.tsx`, `QuestionRenderer.spec.tsx`) covering navigation, validation, and ARIA roles.

**Deliverables**

- Fully functional quiz route adherent to accessibility and performance requirements.
- Passing unit/integration tests validating user flows and analytics triggers.

**Dependencies**: Steps 2–4.

---

## Step 6 – Results & Sharing Flow

**Goal**: Implement the `/results` experience that communicates outcomes, personas, and sharing options as specified in the PRD.

**Key Tasks**

1. Commission or produce the persona/diploma artwork assets (illustrations, responsive variants, export specs) and document licensing/attribution notes.
2. Create `app/results/page.tsx` consuming router state or query params; sanitize inputs and handle missing session fallbacks.
3. Build `ResultsSummary` component displaying score, pass/fail messaging, elapsed time (if available), and CTAs.
4. Implement `DiplomaCard` with persona artwork, shareable summary, and optional download/print styles.
5. Develop breakdown components to render each question with chosen answer, correctness status, and contextual feedback from the bank.
6. Add `ShareResult` component: copy-to-clipboard, Web Share API integration, and share metadata generation.
7. Provide quick actions (Retake, Feedback, Ko-fi) with analytics events.
8. Write integration tests verifying persona selection, share payloads, and breakdown rendering; add accessibility snapshot for tab order.

**Deliverables**

- Results route matching PRD feature list with tested share functionality.
- Diploma assets wired and responsive.

**Dependencies**: Steps 3–5.

---

## Step 7 – Feedback & Email Integration

**Goal**: Deliver the `/feedback` flow with validation, spam protection, and transactional email delivery.

**Key Tasks**

1. Create `app/feedback/page.tsx` server component shell with context copy and SEO metadata.
2. Implement `FeedbackForm` client component featuring textarea (min length, character counter), optional single-line email input, and honeypot field; flag submissions as anonymous when the email box is left empty.
3. Build `/app/api/feedback/route.ts` (or server action) validating payload with Zod (including optional email), enforcing rate limiting, and invoking Resend/Postmark SDK.
4. Implement `lib/feedback/send-feedback.ts` and `lib/feedback/rate-limit.ts` per architecture, with dependency injection for provider.
5. Add optimistic UI states (pending, success, error) and fallback mailto link for failures.
6. Configure environment handling for API keys; ensure keys excluded from client bundles.
7. Write unit tests for validation and rate limiting, plus integration tests simulating happy path and failure states with mocked provider.

**Deliverables**

- Accessible feedback form with reliable email forwarding.
- Documented instructions for configuring provider credentials in deployment environments.

**Dependencies**: Steps 1, 3–4.

---

## Step 8 – Analytics, SEO & Compliance

**Goal**: Instrument telemetry, ensure search readiness, and surface required disclaimers/legal copy.

**Key Tasks**

1. Integrate Plausible analytics script in `app/layout.tsx`; create `lib/analytics.ts` helpers for named events used across the app.
2. Wire key events (page view, quiz_start, question_answered, quiz_complete, share_click, feedback_submit, ko_fi_click, question_exit).
3. Implement SEO helpers (`lib/seo.ts`) to centralise defaults, OG tags, and persona-based share card metadata.
4. Add static routes for `robots.txt`, `sitemap.xml`, and `manifest.json` with accurate metadata.
5. Ensure parody disclaimer and privacy note appear on home and results pages per PRD risks.
6. Perform Lighthouse + axe accessibility audits; capture remediation tasks.
7. Document analytics taxonomy and dashboard expectations for stakeholders.

**Deliverables**

- Verified analytics events visible in Plausible test environment.
- SEO metadata and legal messaging compliant with PRD requirements.

**Dependencies**: Steps 4–7.

---

## Step 9 – Testing & Quality Automation

**Goal**: Operationalise the TDD mandate with comprehensive unit, integration, and end-to-end coverage plus automated quality gates.

**Key Tasks**

1. Configure Vitest for unit/integration suites with jsdom environment and module path aliases; ensure coverage reporting.
2. Set up Playwright for E2E tests with shared fixtures (seeded question bank) and screenshot/trace collection.
3. Author critical test suites:
   - Unit: sampler, scoring, validators, personas, analytics, feedback utilities.
   - Integration: question renderer, quiz shell, results breakdown, feedback form.
   - E2E: full quiz completion, share link verification, feedback submission, accessibility smoke.
4. Implement CI scripts (`pnpm test:unit`, `pnpm test:integration`, `pnpm test:e2e -- --headed=false`) and gating thresholds (coverage ≥85%, ESLint clean).
5. Add GitHub Actions workflow running lint, typecheck, tests, Playwright (with caching), and uploading artifacts on failure.
6. Document TDD workflow and how to run suites locally; include troubleshooting tips for flaky tests.

**Deliverables**

- Automated testing pipeline guarding regressions.
- Playwright baseline results proving core journeys.

**Dependencies**: Steps 1–8.

---

## Step 10 – Deployment, Observability & Operations

**Goal**: Prepare stable deployments on Vercel with environment management, monitoring, and recovery processes.

**Key Tasks**

1. Configure Vercel project, connect Git repository, and set production/preview environment variables (`RESEND_API_KEY`, `PLAUSIBLE_DOMAIN`, `KO_FI_URL`, etc.).
2. Set up branch-based preview deployments with password protection if required pre-launch.
3. Add `vercel.json` or Next config overrides for headers (security, caching) and image domains.
4. Define monitoring strategy: Plausible dashboards, uptime checks (e.g., Vercel checks or Pingdom), and error logging (consider Sentry or Vercel Web Analytics).
5. Create release checklist including generator run, tests, build, and manual smoke test steps.
6. Document rollback procedure and incident response contacts.

**Deliverables**

- Automated CI → Vercel deployment flow with documented release steps.
- Observability tooling configured and tested in staging environment.

**Dependencies**: Steps 1–9.

---

## Step 11 – Launch Readiness & Continuous Improvement

**Goal**: Ensure the MVP meets quality bars, content expectations, and has a roadmap for future enhancements.

**Key Tasks**

1. Conduct final QA sweep: cross-browser/device testing, accessibility review (keyboard, screen reader), performance budget validation (<1s TTI, bundle size checks).
2. Run content proofreading for humour tone, correctness, and persona descriptions; confirm assets meet licensing requirements.
3. Verify the “proper way to brew tea” credit/permission requirement (George McGowan attribution) is satisfied before publishing.
4. Validate analytics tracking end-to-end in staging and production-like environments.
5. Prepare launch assets: social preview screenshots, announcement copy, FAQs.
6. Establish backlog triage process for post-launch feedback, bug tracking, and prioritisation of enhancements (e.g., share tokens, dark mode).
7. Schedule post-launch monitoring window with on-call coverage and metrics review.

**Deliverables**

- Signed-off MVP ready for public release with supporting documentation.
- Prioritised backlog for iteration and future feature waves.

**Dependencies**: Steps 1–10.

---

## Next Actions

1. Review and refine this plan with stakeholders to confirm scope and sequencing.
2. Create task tickets aligned with each step’s key tasks for backlog tracking.
3. Kick off Step 1 to establish the development environment and baseline tooling.
