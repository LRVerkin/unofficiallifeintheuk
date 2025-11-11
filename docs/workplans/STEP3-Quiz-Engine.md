# Workplan – Step 3: Core Quiz Engine Services

**Task ID**: STEP-3-QuizEngine

## Problem Statement
To power the interactive quiz, we need deterministic, testable logic for sampling questions, tracking session state, scoring varied question types, validating answers, and mapping final scores to personas. Without these modules, UI layers cannot function or be tested reliably.

## Proposed Implementation
- Implement modular services under `lib/quiz` for session state, sampler logic, scoring, and validation strictly following the domain contracts defined in Step 2.
- Add persona lookup utilities under `lib/personas.ts` to translate score percentages into persona metadata and assets.
- Provide supporting helpers for analytics and SEO payload shaping so later steps can reuse consistent events/share data.
- Develop comprehensive unit tests (Vitest) with ≥90% coverage, using deterministic seeds for reproducibility.
- Expose clear TypeScript interfaces for consumption by React hooks/components in future steps.

## Components Involved
- `lib/quiz/session.ts`
- `lib/quiz/sampler.ts`
- `lib/quiz/scoring.ts`
- `lib/quiz/validators.ts`
- `lib/personas.ts`
- `lib/analytics.ts`, `lib/seo.ts` scaffolds
- `tests/unit/lib/quiz/*`, `tests/unit/lib/personas.spec.ts`, etc.

## Dependencies
- Steps 1–2 (tooling + generated data contracts)

## Implementation Checklist
- [ ] Design TypeScript interfaces for quiz session state, actions, reducers, and events.
- [ ] Implement `lib/quiz/session.ts` with functions: `createSession`, `answerQuestion`, `nextQuestion`, `previousQuestion`, `completeSession`, `resetSession`.
- [ ] Build `lib/quiz/sampler.ts` supporting deterministic sampling (seed input) and question ordering logic with tests verifying reproducibility.
- [ ] Implement `lib/quiz/scoring.ts` covering single, multiple, rank, and text question scoring plus special rules (`allowPartial`, `acceptRange`, `mustInclude`, `failOnHint`).
- [ ] Create `lib/quiz/validators.ts` enforcing completion requirements (multi-select minimums, rank completeness, text normalization).
- [ ] Implement persona resolution in `lib/personas.ts`, mapping percentage ranges to persona metadata + diploma assets; handle edge cases (rounding, boundaries).
- [ ] Add analytics helper stubs (`lib/analytics.ts`) capturing event names/payload types; add `lib/seo.ts` placeholders for share metadata.
- [ ] Write Vitest unit tests covering every module, including failure modes (invalid state transitions, invalid answers, persona gaps).
- [ ] Generate coverage report ensuring ≥90% coverage for the quiz engine namespace.

## Verification Steps
- `pnpm test:unit -- runInBand --coverage --include \"lib/quiz/**\"`
- `pnpm test:unit lib/personas.spec.ts`
- Optional: `pnpm test:unit lib/analytics.spec.ts` once helpers exist.

## Decision Authority
- Independent: internal module boundaries, naming of helper functions, deterministic RNG choice (`seedrandom` vs Web Crypto polyfill), analytics event schema (as long as Step 8 can extend).
- Requires user input: any deviation from PRD scoring rules, persona definitions, or analytics taxonomy.

## Questions / Uncertainties
- **Blocking**: None currently.
- **Non-blocking**:
  - Should session state persist to storage here or only in UI step? (Assume logic remains stateless; persistence handled in Step 5.)
  - Are there time limits/elapsed time tracking baked into session? (Assume not until required.)

## Acceptable Tradeoffs
- Internal helper modules may live in same file initially for speed, provided exports are clean.
- Coverage target set to ≥90% but not 100% if certain defensive branches are hard to hit.

## Status
- Not Started

## Notes
- Record any assumptions about text normalization (case folding, diacritics) to ensure UI matches engine behaviour later.
