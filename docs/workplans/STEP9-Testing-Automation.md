# Workplan – Step 9: Testing & Quality Automation

**Task ID**: STEP-9-Testing

## Problem Statement

To uphold the TDD mandate and prevent regressions, we need comprehensive unit, integration, and end-to-end coverage plus automated CI gating. Without this, new content or features could break core flows unnoticed.

## Proposed Implementation

- Configure Vitest for unit/integration with JSDOM, path aliases, and coverage reporting hooked into CI.
- Set up Playwright for E2E tests (quiz completion, share, feedback) with deterministic fixtures.
- Author critical test suites across engine, UI, API, and E2E flows; ensure coverage thresholds are enforced.
- Create a GitHub Actions workflow running lint, typecheck, unit/integration, and Playwright suites on PRs.
- Document testing workflows and troubleshooting guides.

## Components Involved

- `vitest.config.ts`, `playwright.config.ts`
- `tests/unit/**/*`, `tests/integration/**/*`, `tests/e2e/**/*`
- `.github/workflows/ci.yml` (or similar)
- Docs (`README.md`, `docs/README.md`)

## Dependencies

- Steps 1–8 (feature implementations).

## Implementation Checklist

- [ ] Finalise Vitest config (coverage reporters, alias updates) and ensure `pnpm test:unit`/`test:integration` capture new suites.
- [ ] Add Playwright config with browser matrix, recording (screenshots/traces), fixtures for seeded quiz data, and environment setup.
- [ ] Write unit tests for remaining modules (quiz UI hooks, analytics, feedback utilities) to reach ≥85% coverage repo-wide.
- [ ] Author integration tests for quiz shell, question renderer, results page, and feedback flow using React Testing Library or Playwright component testing.
- [ ] Create E2E specs: full quiz run-through, share link copy, feedback submission, accessibility smoke (tab order).
- [ ] Set up GitHub Actions workflow running lint, typecheck, tests, and Playwright; cache pnpm + Playwright browsers to speed builds.
- [ ] Define coverage thresholds (e.g., 85% lines) and enforce via Vitest config + CI failure.
- [ ] Update README/docs with testing commands, environment requirements, and troubleshooting tips for headless browsers.

## Verification Steps

- `pnpm test:unit --coverage`
- `pnpm test:integration`
- `pnpm test:e2e`
- GitHub Actions run showing green pipeline with artifacts (screenshots/traces) where relevant.

## Decision Authority

- Independent: testing frameworks (Vitest/Playwright already chosen), coverage targets, CI provider specifics.
- Requires user input: paid CI services, dramatically higher coverage goals, or adding visual regression tooling.

## Questions / Uncertainties

- **Blocking**: None.
- **Non-blocking**:
  - Do we need snapshot baselines for diploma card visuals? (Default: optional, add later.)
  - Should Playwright run on every push or PR only? (Default: PRs + main merges.)

## Acceptable Tradeoffs

- Integration vs E2E responsibilities can overlap; prioritize meaningful coverage over strict taxonomy.
- If Playwright flakes initially, mark tests as retry-once while we stabilise.

## Status

- Not Started

## Notes

- Remember to document how to run Playwright in headed mode for debugging (`pnpm test:e2e -- --headed`).
