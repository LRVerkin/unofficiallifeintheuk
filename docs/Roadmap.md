# Roadmap

Single source of truth for what's done and what remains. This file replaces the per-step `docs/workplans/*` notes.

Statuses: ✅ done · 🟡 in progress · ⬜ not started

---

## ✅ Phase 0 — Foundation (complete)

- ✅ pnpm, ESLint, Prettier, Stylelint, Husky pre-commit, Vitest set up.
- ✅ Question schema (Zod), persona schema, sampler, scoring (Levenshtein + set), session reducer, validators.
- ✅ Stub helpers: `lib/analytics.ts` configurable sink, `lib/seo.ts` `buildShareMetadata`.

## ✅ Phase 1 — Astro migration (complete)

Replaced Next.js 16 / React 19 with Astro 5 + React island + Tailwind 4. The migration commit also fixed several pre-existing bugs.

- ✅ Removed Next, App Router, the markdown question parser, `next/font`, `next/link`, `next/image`.
- ✅ Moved `lib/` → `src/lib/`, `data/` → `src/data/`. The engine was framework-free already, so it ported verbatim.
- ✅ Astro project structure with `BaseLayout.astro`, `SiteHeader.astro`, `SiteFooter.astro`, `KoFiLink.astro`.
- ✅ Routes: `/`, `/quiz` (stub), `/results` (stub), `/feedback` (stub), `/404`.
- ✅ Tailwind 4 CSS-first config in `src/styles/global.css`. Stripped `dark:` utilities for MVP.
- ✅ `specialRules` reshaped from `string[]` to a typed discriminated union (`must_include`, `fail_on_hint`, `auto_pass`, `note`).
- ✅ Hand-authored `src/data/questions.ts`. Q011 station bug fixed; Q011 options corrected ("1.30pm", "1pm", "1.15pm", "Lord only knows"); Q011 station set to **London Euston**; Q015 tags corrected to `[housing, safety]`; Q012 “contributed by Jess & Simona” moved into a typed `credits` field.
- ✅ Persona placeholder SVGs in `public/personas/` plus a README describing replacement.
- ✅ `.env.example` documenting `RESEND_API_KEY`, `FEEDBACK_TO_EMAIL`, `PUBLIC_KO_FI_URL`, `PUBLIC_PLAUSIBLE_DOMAIN`.
- ✅ Cloudflare adapter scaffolded in `astro.config.mjs` (configured but inert — `output: "static"` produces a `_worker.js` shell with no server routes; the adapter only takes effect once we flip to `output: "hybrid"` in Phase 5).
- ✅ Docs refreshed: `Architecture.md`, this `Roadmap.md` (replacing `docs/workplans/`), `README.md`.

### Known small follow-ups (carry into the next session)

- ⬜ Replace deprecated `z.ZodIssueCode.custom` with the string literal `code: "custom"` in `src/data/personas.ts` (3 sites) and `src/data/question-schema.ts` (5 sites). 8 hints today; cosmetic in Zod 4 but loud in `astro check`.
- ⬜ Add a comment on `src/lib/personas.ts` explaining that `getPersonaForPercentage` relies on `personas` being sorted descending in `src/data/personas.ts:117`. The find-and-take-first is fragile if anyone re-sorts.
- ⬜ Make scoring's `selectedOptionIds` switch exhaustive (`default: assertNever(...)` or similar) so adding a new response type is a TS error, not silent fall-through.

---

## ⬜ Phase 2 — Design system primitives

Small, dependency-free components that the quiz UI will consume.

- ⬜ `src/components/react/Button.tsx` — primary, secondary, ghost variants.
- ⬜ `src/components/react/Card.tsx`.
- ⬜ `src/components/react/RadioGroup.tsx` — wraps native `<input type="radio">` with `<fieldset>` + `<legend>` for a11y.
- ⬜ `src/components/react/CheckboxGroup.tsx`.
- ⬜ `src/components/react/RankList.tsx` — up/down buttons, no `@dnd-kit`.
- ⬜ `src/components/react/TextAnswer.tsx`.
- ⬜ `src/components/react/ProgressBar.tsx`.
- ⬜ `src/components/react/Alert.tsx` — `aria-live="polite"`.

## ⬜ Phase 3 — Quiz UI

- ⬜ `QuizApp.tsx` — reducer over `lib/quiz/session.ts`, persists to `sessionStorage`.
- ⬜ `QuestionCard.tsx` — switches by `question.type`.
- ⬜ Hint UI for Q007 — clicking the “What is a cuppa?” hint records `hintsUsed: ["cuppa"]` in the response.
- ⬜ `quiz.astro` mounts `<QuizApp client:load />` and replaces the placeholder.
- ⬜ Resume mid-quiz on reload.
- ⬜ Quiz analytics: `quiz_start`, `quiz_complete` events.

## ⬜ Phase 4 — Results

- ⬜ `ResultsView.tsx` — reads sessionStorage with `client:only="react"`; falls back to `?score=&total=` query.
- ⬜ `PersonaCard.tsx` — uses `image.light` from `src/data/personas.ts`.
- ⬜ Breakdown list with per-question feedback from the bank.
- ⬜ Share + Retake CTAs; share copies a clean URL with score query.
- ⬜ `share_click` analytics event.

## ⬜ Phase 5 — Feedback form

- ⬜ `FeedbackForm.tsx` — controlled inputs + honeypot.
- ⬜ Astro Action `submitFeedback` in `src/actions/index.ts` validating with Zod.
- ⬜ Resend integration with `RESEND_API_KEY` + `FEEDBACK_TO_EMAIL` (`feedback@unofficiallifeinthe.uk`).
- ⬜ In-memory rate limit (per-IP token bucket) — upgrade to Cloudflare KV if abuse appears.
- ⬜ Flip `output: "static"` → `"hybrid"` in `astro.config.mjs` (NOT `"server"` — we want most pages prerendered with only the Action endpoint server-rendered) and mark the static pages with `export const prerender = true` if needed.
- ⬜ `feedback_submit` analytics event.

## ⬜ Phase 6 — Analytics & SEO

- ⬜ Plausible script embedded in `BaseLayout` driven by `PUBLIC_PLAUSIBLE_DOMAIN`.
- ⬜ `lib/analytics.ts` wired to `plausible(...)` calls.
- ⬜ `Seo.astro` helper: title/description/OG/twitter, dynamic per page.
- ⬜ Tighten `@astrojs/sitemap` config — `sitemap-index.xml` is already generated each build, but exclude `/404` and dedupe `/feedback` once routes settle (`sitemap({ filter: page => !page.endsWith('/404') })`).
- ⬜ `public/robots.txt`.

## ⬜ Phase 7 — Quality gates

- ⬜ Vitest + RTL coverage for the new React components.
- ⬜ Playwright happy-path e2e: start → answer all → results → share → feedback.
- ⬜ Bidirectional drift test: every `Q\d{3}` ID in `docs/QuestionBank.md` must appear in `src/data/questions.ts` AND vice versa. Cheap regex scan, no parser needed.
- ⬜ GitHub Actions `ci.yml` — install, lint, typecheck, unit tests, build.

## ⬜ Phase 8 — Deploy

- ⬜ Cloudflare Pages connected to GitHub.
- ⬜ Production env vars set (`RESEND_API_KEY`, `FEEDBACK_TO_EMAIL`, `PUBLIC_KO_FI_URL`, `PUBLIC_PLAUSIBLE_DOMAIN`).
- ⬜ Add `wrangler.toml` (or `wrangler.jsonc`) with at minimum a `name` and any KV bindings the rate limiter ends up using. Today's build emits a warning: _"Enabling sessions with Cloudflare KV with the 'SESSION' KV binding... you need to add the binding to your wrangler config file."_ — silence it by either declaring the `SESSION` binding or disabling sessions on the adapter.
- ⬜ Security headers (CSP, X-Content-Type-Options, Referrer-Policy) via Cloudflare Pages dashboard or a `_headers` file in `public/`.
- ⬜ Lighthouse audit on the deployed site (target ≥ 95 perf / a11y / best practices).
- ⬜ Final persona artwork commissioned and dropped into `public/personas/`.

## ⬜ Phase 9 — Post-launch

- ⬜ Dark mode (re-introduce `dark:` utilities, finish palette, light/dark persona variants).
- ⬜ Dynamic OG card generation if traffic justifies it.
- ⬜ More questions / wider tag balancing.
- ⬜ Storybook (or similar) once the component library grows.

---

## Deferred ideas (post-MVP)

- Signed share-link tokens that recreate the exact quiz seed.
- `question_exit` analytics with `visibilitychange`/`beforeunload` listeners.
- Sentry / uptime monitoring / Lighthouse CI.
- Anonymised score-distribution dashboard.
- Question authoring CMS replacing the hand-authored TS file.
