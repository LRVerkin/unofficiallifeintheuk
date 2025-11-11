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
- [ ] Audit `docs/QuestionBank.md` structure to confirm parsing patterns (headings, numbering, persona metadata).
- [ ] Define/implement `data/question-schema.ts` including Zod schemas for all question/answer/special rule shapes.
- [ ] Create `data/persona-schema.ts` (or inline) to validate persona definitions, score brackets, and asset references.
- [ ] Implement `scripts/generate-question-bank.ts` with CLI args (`--out data/questions.ts`) and helpful error messages.
- [ ] Ensure generator normalises markdown inputs (trim, convert smart quotes, handle multi-line answers).
- [ ] Wire generator execution into `package.json` scripts: `generate:questions`, `prepare`, and `build`.
- [ ] Add Vitest snapshot tests covering example markdown blocks and verifying generated output matches expectations.
- [ ] Create `data/personas.ts` seeded from PRD persona definitions; include tests ensuring ranges cover 0–100 without overlap.
- [ ] Document the content workflow in `docs/README.md` (update Markdown → `pnpm generate:questions` → tests) and mention persona editing rules.
- [ ] Update `.gitignore` if generated files should be committed/not committed according to strategy (assume committed for now).

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
- Not Started

## Notes
- Log any Markdown quirks or manual clean-up required so content authors can avoid breaking the parser.
