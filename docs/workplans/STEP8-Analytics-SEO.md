# Workplan – Step 8: Analytics, SEO & Compliance

**Task ID**: STEP-8-Analytics

## Problem Statement

We need privacy-friendly analytics, solid SEO metadata, legal disclaimers, and accessibility audits to ensure the experience is discoverable, observable, and compliant. Without this, we fly blind on usage, risk SEO underperformance, and miss legal disclaimers.

## Proposed Implementation

- Integrate Plausible analytics into `app/layout.tsx`, centralising event helpers in `lib/analytics.ts`.
- Instrument key client events (page view, quiz_start, question_answered, quiz_complete, share_click, feedback_submit, ko_fi_click).
- Build SEO helpers for default metadata, OG/Twitter cards, robots/sitemap/manifest routes, and persona-based share previews.
- Add static pages for disclaimers, privacy, and any required licensing notes.
- Run Lighthouse + axe audits, logging remediation tasks, and ensure disclaimers appear where PRD flagged risks.

## Components Involved

- `app/layout.tsx`, `app/robots.txt/route.ts`, `app/sitemap.ts`, `app/manifest.ts`
- `lib/analytics.ts`, `lib/seo.ts`
- Analytics wiring inside quiz/results/feedback components
- Documentation under `docs/Architecture.md` or `README.md`

## Dependencies

- Steps 4–7 (UI, quiz flow, results, feedback).

## Implementation Checklist

- [ ] Configure Plausible script injection (respecting `PLAUSIBLE_DOMAIN`) and fallback for when env var is missing.
- [ ] Finalise `lib/analytics.ts` event shapes; update quiz/results/feedback components to track events with consistent payloads.
- [ ] Implement helper hooks (e.g., `useAnalytics`) if useful for components.
- [ ] Build `lib/seo.ts` functions for default metadata, persona share metadata, and dynamic OG/Twitter tags.
- [ ] Add Next.js route handlers for `robots.txt`, `sitemap.xml`, `manifest.json` using site config and question URLs.
- [ ] Ensure parody disclaimer + privacy note appear on home and results pages per PRD risk section; document licensing (e.g., tea credit).
- [ ] Run Lighthouse + axe on major routes, document issues, and add remediation tasks or fixes.
- [ ] Update docs with analytics taxonomy, dashboards, and instructions for setting `PLAUSIBLE_DOMAIN`.

## Verification Steps

- `pnpm lint` / `pnpm typecheck`
- Manual: Load pages in dev with Plausible script stub to ensure events fire (use console logging to confirm).
- Run Lighthouse/axe audits and capture scores/screenshots.

## Decision Authority

- Independent: event naming scheme (as long as consistent), final metadata copy, choice of auditing tooling.
- Requires user input: additional analytics providers, storage of personal data, or expansions to legal copy beyond PRD scope.

## Questions / Uncertainties

- **Blocking**: None.
- **Non-blocking**:
  - Should we offer cookie opt-out messaging even though Plausible is cookie-less? (Assume no.)
  - Any jurisdictions requiring extra disclaimers? (Assume standard UK parody notice is enough.)

## Acceptable Tradeoffs

- OG image generation can stay static initially (persona art) until there’s bandwidth for dynamic cards.
- Analytics batching/debouncing can be minimal for MVP; optimize later if events become noisy.

## Status

- Not Started

## Notes

- Document how to disable analytics in local/dev builds to keep developer experience smooth.
