# Workplan – Step 2: Content Pipeline & Domain Modeling

**Task ID**: STEP-2-ContentPipeline

## Problem Statement

Question and persona content currently live only in Markdown/PRD form, making it error-prone to consume within the app. We need a repeatable generator with schemas and validation to convert the authoritative Markdown source into typed modules consumed at build time.

## Proposed Implementation

- Define comprehensive TypeScript types and Zod schemas that encode every question shape, answer metadata, special rule, and persona bracket described in the PRD/Architecture.
- Build a `scripts/generate-question-bank.ts` CLI that ingests `docs/QuestionBank.md`, parses sections into structured JSON, validates via Zod, and writes a generated `data/questions.ts`.
- Integrate the generator into `pnpm build`, `pnpm prepare`, and an explicit `pnpm generate:questions` script so CI and developers cannot forget to run it.
- Create `data/personas.ts` with schema validation ensuring persona ranges cover 0–100% without gaps/overlap and include asset references.
- Write snapshot/unit tests around the generator to lock parsing behaviour (single, multi, rank, text, and fuzzy matching cases).
- Document the full content editing workflow so non-dev contributors can safely update the bank.

## Components Involved

- `docs/QuestionBank.md`
- `scripts/generate-question-bank.ts`
- `data/question-schema.ts`, `data/questions.ts`, `data/personas.ts`
- Test suites under `tests/unit/scripts` (or similar)
- Documentation (`docs/README.md` or `CONTRIBUTING.md`)

## Dependencies

- Step 1 (tooling, TypeScript, test harness, scripts infrastructure)

## Implementation Checklist

- [x] Audit `docs/QuestionBank.md` structure to confirm parsing patterns (headings, numbering, persona metadata).
- [x] Define/implement `data/question-schema.ts` including Zod schemas for all question/answer/special rule shapes.
- [x] Create `data/persona-schema.ts` (inline in `data/personas.ts`) to validate persona definitions, score brackets, and asset references.
- [x] Implement `scripts/generate-question-bank.ts` with helpful error output and Prettier formatting.
- [x] Ensure generator normalises markdown inputs (smart quotes, inline comments, multi-line feedback).
- [x] Wire generator execution into `package.json` scripts: `generate:questions`, `prepare`, and `prebuild`.
- [x] Add Vitest coverage for the parser + persona metadata (acts as snapshot/contract tests).
- [x] Create `data/personas.ts` seeded from PRD-inspired personas; include tests ensuring ranges cover 0–100 without overlap.
- [x] Document the content workflow in `README.md` and `docs/README.md` (update Markdown → `pnpm generate:questions` → tests) and mention persona editing rules.
- [x] Confirm `.gitignore` strategy (generated `data/questions.ts` remains committed for reproducibility).

## Verification Steps

- `pnpm generate:questions` (succeeds and regenerates `data/questions.ts`)
- `pnpm test:unit -- filters scripts/generate-question-bank` (or equivalent)
- `pnpm build` (should run generator and fail on schema violations)

## Decision Authority

- Independent: parsing approach, internal file naming, whether generator outputs `.ts` or `.json`, choice of Zod vs alternative, snapshot file structure.
- Requires user input: changes to Markdown source format, skipping validation to move faster, altering persona definitions from PRD.

## Questions / Uncertainties

- **Blocking**: None currently.
- **Non-blocking**:
  - Should generated data be checked into git or built in CI only? (Default to committing for reproducibility.)
  - Do personas need localisation-ready strings now? (Assume English-only per PRD.)

## Acceptable Tradeoffs

- Snapshot tests can cover representative samples rather than the whole bank to keep fixtures small.
- Generator may rely on Markdown conventions (headings, tables) as long as documented; no need for over-general parser initially.

## Status

- Completed

## Notes

- Markdown parser expects the existing bullet-list structure (`- prompt`, `- options`, etc.); adding new keys is fine as long as they stay in that indentation style.
- Single-choice questions can list multiple accepted answers (e.g., Q009/Q010). Treat this as “any of these answers counts as correct” rather than a multi-select question.
- Q006 now enforces case-insensitive matching on “sorted” with a light typo allowance (`fuzzyThreshold` flag). If we want broader fuzzy logic, expand this pattern later.
- Persona asset paths are placeholders (`/personas/*.svg`). Replace them with final artwork once assets exist, keeping light/dark pairs in sync.
