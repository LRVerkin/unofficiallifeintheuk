# Workplan – Step 5: Quiz Experience Implementation

**Task ID**: STEP-5-QuizExperience

## Problem Statement

With the quiz engine ready, we must deliver the `/quiz` route that orchestrates sessions, renders every question type accessibly, persists progress, and emits analytics events. Without this UI, users cannot interact with the generated content or progress toward results.

## Proposed Implementation

- Scaffold the `/quiz` route (`app/quiz/page.tsx`) and supporting layout, including a `generateMetadata` stub for future sharing previews.
- Implement a `QuizShell` component that initialises sessions from Step 3 services, loads question data, writes progress to `sessionStorage`, handles loading/error states, and exposes analytics hooks.
- Build a polymorphic `QuestionRenderer` with specific components for single choice, multi choice, ranking (with keyboard-friendly drag/drop), and text responses, reusing Step 4 UI primitives.
- Add navigation controls (`QuizNav`, `ProgressBar`) enforcing validation requirements before advancing/finishing, plus accessible labels/states.
- Handle offline/errors gracefully with retry UI and skeleton placeholders for initial load.
- Instrument analytics events (quiz_start, question_answered, question_exit) leveraging `lib/analytics.ts`.
- Write integration tests (React Testing Library/Vitest) covering navigation, validation, persistence, and ARIA roles.

## Components Involved

- `app/quiz/page.tsx`
- `components/quiz/QuizShell.tsx`
- `components/quiz/QuestionRenderer.tsx` + subcomponents (`SingleChoiceQuestion`, `MultipleChoiceQuestion`, `RankQuestion`, `TextQuestion`)
- `components/quiz/QuizNav.tsx`, `ProgressBar`
- `lib/quiz/*` services from Step 3
- Tests (`tests/integration/QuizShell.spec.tsx`, `QuestionRenderer.spec.tsx`)

## Dependencies

- Steps 2–4 (generated content, quiz engine, UI primitives)

## Implementation Checklist

- [ ] Create route file `app/quiz/page.tsx` with `generateMetadata` stub referencing share defaults.
- [ ] Implement `QuizShell` hook/state management: ingest question bank, call session creator, persist to `sessionStorage`, and hydrate on mount.
- [ ] Add loading skeleton and error fallback for question data fetch/generation issues.
- [ ] Build `QuestionRenderer` dispatcher selecting the appropriate question component based on schema type.
- [ ] Implement `SingleChoiceQuestion` using radio group primitive with keyboard navigation and validation messaging.
- [ ] Implement `MultipleChoiceQuestion` using checkbox components, enforcing min/max selections defined in schema, and surfacing errors inline.
- [ ] Implement `RankQuestion` using accessible drag-and-drop (`@dnd-kit/core` or similar) plus keyboard reordering fallback.
- [ ] Implement `TextQuestion` with normalization hints, input debouncing, and validation errors for required responses.
- [ ] Add `QuizNav` (Back/Next/Finish) and `ProgressBar`, disabling controls until validation passes; include aria-live updates for screen readers.
- [ ] Wire analytics events (`quiz_start`, `question_answered`, `question_exit`) inside QuizShell/hooks.
- [ ] Honor question-level special rules (e.g., Q007’s “What is a cuppa?” tooltip that immediately marks the question incorrect if clicked) via renderer-specific affordances.
- [ ] Persist session completion state and redirect/prepare results handoff (even if Step 6 finalises UI later).
- [ ] Write integration tests (`tests/integration/QuizShell.spec.tsx`, `QuestionRenderer.spec.tsx`) covering navigation, validation, persistence, analytics hook calls, and ARIA roles.

## Verification Steps

- `pnpm test:integration --filter QuizShell` (or equivalent)
- `pnpm test:integration --filter QuestionRenderer`
- `pnpm lint` and `pnpm typecheck`
- Manual run: `pnpm dev` → navigate to `/quiz`, complete a sample session ensuring persistence/analytics logs.

## Decision Authority

- Independent: choice of state management hooks, drag-and-drop library, persistence strategy (sessionStorage vs localStorage) as long as requirements met.
- Requires user input: significant UX deviations (e.g., removing Rank question drag/drop), or skipping persistence/analytics due to time.

## Questions / Uncertainties

- **Blocking**: None currently.
- **Non-blocking**:
  - Should we prefetch results route upon completion for snappier transition? (Default to no prefetch until Step 6 work.)
  - Are there specific copy requirements for validation errors? (Use PRD tone; adjust later.)

## Acceptable Tradeoffs

- Rank question keyboard fallback can be simplified (move up/down buttons) if drag/drop proves too heavy initially; document if implemented.
- sessionStorage persistence can be minimal (entire session JSON) even if later optimised for partial updates.

## Status

- Not Started

## Notes

- Capture analytics event schemas used here so Step 8 can wire them to Plausible consistently.
