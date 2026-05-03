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

## ✅ Phase 2 — Design system primitives (complete)

Eight dependency-free React primitives in `src/components/react/`, each with a co-located Vitest + RTL spec under `tests/unit/components/react/`. 37 new tests (54 total).

- ✅ `Button.tsx` — primary / secondary / ghost variants, sm/md sizes.
- ✅ `Card.tsx` — generic surface wrapper with `as` prop for semantic overrides.
- ✅ `RadioGroup.tsx` — `<fieldset>` + `<legend>` + native radios, single-select.
- ✅ `CheckboxGroup.tsx` — same pattern, returns the selection sorted ascending.
- ✅ `RankList.tsx` — up/down buttons (boundary-disabled), `aria-live` reorder announcements, no DnD dep.
- ✅ `TextAnswer.tsx` — `<label>`/`htmlFor` linkage, `aria-invalid` + `aria-describedby` for errors.
- ✅ `ProgressBar.tsx` — `role="progressbar"`, full ARIA value attrs, current clamped to `[0, total]`.
- ✅ `Alert.tsx` — `role="status"` + `aria-live="polite"` for info; `role="alert"` + `aria-live="assertive"` for success/error.

Also fixed in this phase: `vitest.setup.ts` now imports `@testing-library/jest-dom/vitest` (Vitest matcher type augmentation) and `tsconfig.json` includes the setup file so the augmentation reaches test files.

## ✅ Phase 3 — Quiz UI (complete)

A working `<QuizApp />` React island lives on `/quiz`. Marketing pages still ship 0 KB JS; only `/quiz` hydrates.

- ✅ `src/lib/quiz/persistence.ts` — schema-versioned `sessionStorage` round-trip with quota-safe writes.
- ✅ `QuestionCard.tsx` — switches on `question.type`, drops to the matching primitive (RadioGroup/CheckboxGroup/RankList/TextAnswer).
- ✅ Hint UI for `fail_on_hint` rules — Q007 surfaces a "What is a cuppa?" button; clicking it records `hintsUsed: ["cuppa"]` in the response and disables the button. `cuppa` → "What is a cuppa?" lives in a small label map; new hints can be added without code.
- ✅ `QuizApp.tsx` — `useReducer` wrapping the existing pure session helpers, persists every state change to `sessionStorage`, hydrates on mount, ignores already-completed sessions on reload, and supports a Restart button.
- ✅ `quiz.astro` mounts `<QuizApp client:load />` and replaces the placeholder.
- ✅ Resume mid-quiz on reload (verified by test).
- ✅ Quiz analytics — `quiz_start` fires once when the user lands `in_progress`, `quiz_complete` fires after `completeSession()`. The sink is still a no-op until Phase 6 wires Plausible.
- ✅ On completion the island redirects to `/results` (placeholder for now; Phase 4 reads the persisted session from sessionStorage).

Tests added: persistence (5), QuestionCard (6), QuizApp (7) — 18 new specs, **72 tests / 18 files** total.

## ✅ Phase 4 — Results (complete)

- ✅ `PersonaCard.tsx` — renders the persona's name, headline, description, and `image.light`; shows percentage + raw "X / Y" score; safe against zero-total inputs.
- ✅ `ResultBreakdown.tsx` — per-question list with correct/incorrect badges, formats user answers per question type (rank uses chevron-separated path), uses per-option feedback when keyed to the user's pick (works for both "correct, here's why" and "wrong, here's why" messages), falls back to `feedback.overall_correct` / `feedback.correct` / `feedback.incorrect` otherwise.
- ✅ `ResultsView.tsx` — `client:only="react"` island. Reads sessionStorage; falls back to `?score=&total=` query (sanitised — rejects NaN, non-positive total, out-of-range score). Three-state UI: completed-session view (persona + breakdown), shared view (persona only with a "take it yourself" nudge), empty view (CTA to `/quiz`).
- ✅ Share button: copies `${origin}/results?score=N&total=M` via `navigator.clipboard.writeText`, falls back to a visible "Copy this link" message if clipboard is unavailable. Fires `share_click` with `{ score, total, source }`.
- ✅ Retake button: `clearSession()` then `window.location.assign("/quiz")`.
- ✅ `results.astro` mounts `<ResultsView client:only="react" />`.

Tests added (15): PersonaCard (4), ResultBreakdown (5), ResultsView (6) — **87 tests / 21 files** total.

## ✅ Phase 5 — Feedback form (complete)

- ✅ `src/lib/feedback/format.ts` — pure helper that builds the email subject/body from `{ message, email? }`. Easily testable; no Resend dependency in the tests.
- ✅ Astro Action `submitFeedback` in `src/actions/index.ts` — Zod-validated form input (10–2000 char message, optional email, required-empty `hp` honeypot), composes the email via `formatFeedbackEmail`, sends via Resend, throws `ActionError` with a friendly message on misconfiguration or send failure.
- ✅ `FeedbackForm.tsx` — controlled inputs (re-uses Phase 2 primitives), honeypot, submit-disabled until 10 chars, surfaces server errors with a mailto fallback link, fires `feedback_submit` on success. Accepts a `submitter` prop as a test seam so unit tests don't need the Astro runtime.
- ✅ `feedback.astro` mounts `<FeedbackForm client:load />` and replaces the placeholder.
- ✅ Astro `output` flipped to `"server"` (Astro 5 dropped `"hybrid"`); all 5 page files now carry `export const prerender = true`, so HTML output is identical to before — only the action endpoint is server-rendered.
- ✅ `astro:actions` aliased to a small stub in `vitest.config.ts` so component tests can lazy-import the virtual module without erroring during transform.
- ⬜ Rate limiter — deliberately deferred. Cloudflare Workers' in-memory state is per-isolate and per-cold-start, so a `Map`-based limiter doesn't actually rate-limit. Track as a Phase 9 follow-up: per-IP token bucket in Cloudflare KV or Upstash.

Tests added (10): `formatFeedbackEmail` (4), FeedbackForm (6) — **97 tests / 23 files** total.

## ✅ Phase 6 — Analytics & SEO (complete)

- ✅ Plausible script embedded in `BaseLayout` when `PUBLIC_PLAUSIBLE_DOMAIN` is set; absent in local dev. Includes the standard queue shim so `window.plausible(...)` calls placed before the script loads still get flushed.
- ✅ `src/lib/analytics.ts` extended: `plausibleSink` forwards events as `window.plausible(name, { props })` (no-op when the script hasn't loaded), `installPlausibleSink()` swaps the configured sink. `BaseLayout` calls the installer on every page so the React islands' `trackEvent` calls automatically forward to Plausible in production.
- ✅ `src/components/astro/Seo.astro` — single helper for `<title>`, `<meta description>`, canonical link, OG, and Twitter tags. Derives the canonical URL from `Astro.site` + the current pathname; supports an optional `image` for richer share cards.
- ✅ `@astrojs/sitemap` filter excludes `/404`. `sitemap-index.xml` continues to generate at build.
- ✅ `public/robots.txt` allows everything and points crawlers at the sitemap.
- ⬜ `ko_fi_click` event — tracked as a small follow-up; needs a small client component for the footer's KoFi link.

Side fix: the analytics installer is a tiny inline `<script>` (~234 B raw), so every page ships at least 1 `<script>` tag now (was 0 for marketing pages). Acceptable trade for unified analytics.

Tests added (4): plausibleSink forwards / no-ops / handles empty payload, sink configuration round-trip — **101 tests / 24 files** total.

## ✅ Phase 7 — Quality gates (mostly complete)

- ✅ Vitest + RTL coverage shipped alongside Phases 2–6 (104 tests across 25 files).
- ✅ Bidirectional drift test (`tests/unit/data/question-drift.spec.ts`) — every `Q\d{3}` ID in `docs/QuestionBank.md` exists in `src/data/questions.ts` and vice versa, plus a duplicate guard on the markdown side. Cheap regex scan, no parser needed.
- ✅ GitHub Actions `ci.yml` — install (frozen lockfile) → eslint → stylelint → astro check + tsc → vitest → build, on every PR and push to main. Concurrency group cancels in-flight runs on the same ref.
- ⬜ Playwright happy-path e2e: start → answer all → results → share → feedback. Deferred to Phase 9 — the unit suite already covers the engine and components, and a meaningful e2e wants a deployed preview to run against.

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
