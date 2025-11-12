# Workplan – Step 6: Results & Sharing Flow

**Task ID**: STEP-6-Results

## Problem Statement

After completing the quiz, users need a `/results` experience that communicates their score, selected persona, per-question breakdown, and sharing options. Without this flow, the experience has no payoff, there’s no way to share wins, and we can’t guide players toward retakes, feedback, or Ko‑fi.

## Proposed Implementation

- Build a dedicated Next.js route (`app/results/page.tsx`) that consumes quiz session data (router state or query params fallback) and gracefully handles missing/invalid payloads.
- Compose focused components for score summary, persona diploma, breakdown, and share actions. Each should lean on the Step 4 design system primitives and Step 3 quiz/persona APIs.
- Support shareability: copy-to-clipboard, Web Share API, and metadata derived from `lib/seo.ts`.
- Surface key CTAs (Retake, Feedback, Ko‑fi) with analytics hooks and ensure accessibility (keyboard navigation, aria-live updates).
- Write integration tests verifying persona logic, share payloads, and breakdown accuracy.

## Components Involved

- `app/results/page.tsx`
- `components/results/ResultsSummary.tsx`
- `components/results/DiplomaCard.tsx`
- `components/results/QuestionBreakdown.tsx`
- `components/results/ShareResult.tsx`
- `lib/seo.ts`, `lib/analytics.ts`
- Tests under `tests/integration/results/*`

## Dependencies

- Step 3 quiz engine services for scoring/personas.
- Step 4 design system components.
- Step 5 quiz session hand-off mechanics.

## Implementation Checklist

- [ ] Define data contract for transferring session result into `/results` (router state + query param fallback); sanitize inputs server-side.
- [ ] Create `app/results/page.tsx` with loading/error boundaries and metadata hook leveraging `buildShareMetadata`.
- [ ] Implement `ResultsSummary` (score, pass/fail messaging, time if available) with analytics events for retake/share clicks.
- [ ] Build `DiplomaCard` pulling persona art, headline, and CTA to download/print; ensure responsive layouts and alt text.
- [ ] Implement `QuestionBreakdown` listing each question, player answers, correctness, and witty feedback from the bank.
- [ ] Create `ShareResult` component supporting copy-to-clipboard, Web Share API, and fallback instructions; ensure share payload uses `lib/analytics`.
- [ ] Add CTA cluster (Retake quiz, Provide feedback, Support on Ko‑fi) reusing Step 4 CTA components.
- [ ] Write integration tests covering persona selection, share payload accuracy, breakdown rendering, and accessibility snapshot (tab order/ARIA).
- [ ] Document the result hand-off protocol in `docs/Architecture.md` or `docs/README.md`.

## Verification Steps

- `pnpm test:integration --filter results`
- `pnpm lint` & `pnpm typecheck`
- Manual QA: complete quiz → `/results`, verify persona card, share flows, and CTAs on desktop + mobile widths.

## Decision Authority

- Independent: layout arrangement, animation polish, share UI microcopy, fallback strategy for missing session data (as long as user isn’t stuck).
- Requires user input: new persona artwork requirements, additional share targets beyond copy/Web Share, or changes to CTA priority.

## Questions / Uncertainties

- **Blocking**: None identified.
- **Non-blocking**:
  - Should we store results server-side for shareable permalinks, or stick to client-side payloads for MVP? (Default: client-only.)
  - Any additional share copy requirements (hashtags, etc.)? (Assume none until marketing provides specifics.)

## Acceptable Tradeoffs

- Diploma download can be CSS-based “print to PDF” for MVP; dedicated image generation can wait.
- Share component can defer OG image generation to Step 8 (SEO) as long as metadata hooks exist.

## Status

- Not Started

## Notes

- Ensure persona assets used here align with licensing/attribution expectations captured in the PRD.
