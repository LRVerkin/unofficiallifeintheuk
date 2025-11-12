# Workplan – Special Rules Schema & Enforcement

**Task ID**: FEAT-SpecialRules

## Problem Statement

`specialRules` in `docs/QuestionBank.md` are currently free-form strings, making them useful for copy but unenforceable in code. Features like “fail on hint” (Q007) or future partial-scoring rules require structured metadata so the generator and quiz engine can apply behaviours automatically.

## Proposed Implementation

- Introduce a typed special-rules schema (e.g., `{ kind: "fail_on_hint", hintId: "cuppa" }`) in the question bank.
- Update the question generator + Zod schemas to parse/validate these objects.
- Extend quiz engine modules (validators/scoring/session) and UI renderers to honour structured rules where relevant.
- Provide fallbacks for existing descriptive strings to avoid breaking content authors until migration is complete.

## Components Involved

- `docs/QuestionBank.md`
- `data/question-schema.ts`, `scripts/lib/questionParser.ts`, `data/questions.ts`
- `lib/quiz/scoring.ts`, `lib/quiz/validators.ts`, `lib/quiz/session.ts`
- `components/quiz/*` (particularly tooltip/hint behaviour)
- Docs explaining how to author rules

## Dependencies

- Step 2 content pipeline (needs extension).
- Step 3 quiz engine (logic hooks).
- Step 5 quiz UI (consumes structured rules).

## Implementation Checklist

- [ ] Define supported rule kinds (initially: `fail_on_hint`, `allow_partial`, `must_include`, `accept_range`) with associated parameters and document them.
- [ ] Update `docs/QuestionBank.md` format to allow YAML/JSON-like rule entries and migrate existing questions (starting with Q007).
- [ ] Extend `data/question-schema.ts` and parser to validate structured rules while gracefully handling legacy strings (emit warnings).
- [ ] Wire structured rules into quiz engine: e.g., `fail_on_hint` marks answer incorrect when hint interaction occurs; `allow_partial` adjusts scoring logic; `must_include` influences validators.
- [ ] Expose rule metadata to UI renderers (e.g., hint tooltip component receives `fail_on_hint` flag + message).
- [ ] Backfill tests covering parser behaviour, scoring adjustments, and UI interactions triggered by these rules.
- [ ] Update docs (`docs/README.md` or `CONTRIBUTING.md`) explaining how to author/edit rules and what behaviours they trigger.

## Verification Steps

- `pnpm generate:questions` (succeeds with new schema)
- `pnpm test:unit --filter specialRules` (covering parser + engine changes)
- `pnpm test:integration --filter QuizShell` (ensuring UI respects rule-driven interactions)

## Decision Authority

- Independent: exact rule schema shape, naming conventions, and how aggressively to fail on malformed rules (warn vs error).
- Requires user input: introducing additional rule types, deprecating legacy strings entirely, or applying rules that materially alter gameplay.

## Questions / Uncertainties

- **Blocking**: None currently.
- **Non-blocking**:
  - Should special rules support localisation-ready copy (e.g., hint text) now? (Assume we store raw copy fields per rule for MVP.)
  - Do we need analytics events when rules fire (e.g., hint clicked)? (Default: yes, log via `lib/analytics`.)

## Acceptable Tradeoffs

- Migration can happen incrementally—support both string + object formats temporarily, emitting console warnings until all questions convert.
- Partial scoring logic can remain simple (e.g., fraction-based) to ship quickly; refine once we have more rule use cases.

## Status

- Not Started

## Notes

- Coordinate with content authors before changing Markdown format; provide examples in `docs/QuestionBank.md` to avoid confusion.
