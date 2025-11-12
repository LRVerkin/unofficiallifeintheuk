# Workplan – Step 7: Feedback & Email Integration

**Task ID**: STEP-7-Feedback

## Problem Statement

Players must be able to submit feedback or new question ideas via a `/feedback` flow that validates input, mitigates spam, and forwards messages to an email inbox. Without this, we lose community input and can’t iterate on the content.

## Proposed Implementation

- Build `app/feedback/page.tsx` with server-rendered copy, SEO metadata, and a client form that honours Step 4 UI guidelines.
- Implement a feedback form component with textarea (min length, counter), optional email field, honeypot input, and status messaging.
- Create a backend handler (API route or server action) that validates payloads with Zod, applies rate limiting, and sends email via Resend/Postmark.
- Provide optimistic UI states and a fallback `mailto:` link.
- Add automated tests for validation, rate limiting, and provider invocation.

## Components Involved

- `app/feedback/page.tsx`
- `components/feedback/FeedbackForm.tsx`
- `lib/feedback/send-feedback.ts`
- `lib/feedback/rate-limit.ts`
- `/app/api/feedback/route.ts` or equivalent server action
- Tests under `tests/unit/feedback/*`, `tests/integration/feedback/*`

## Dependencies

- Steps 1–4 (tooling, design system).
- Step 3 analytics helper for event tracking.

## Implementation Checklist

- [ ] Scaffold `app/feedback/page.tsx` with metadata from `lib/seo.ts`, context copy, and linkbacks to quiz/results.
- [ ] Build `FeedbackForm` client component: textarea with min-length validation, optional single-line email input, honeypot field, submit button states, success/error banners.
- [ ] Implement form schema in `lib/feedback/schema.ts` (Zod) capturing message, optional email, metadata (path/session id).
- [ ] Create rate limiter (IP + time window) and spam-deterrent honeypot; integrate into API handler.
- [ ] Implement `lib/feedback/send-feedback.ts` that wraps Resend/Postmark SDK using `RESEND_API_KEY` and ensures keys stay server-only.
- [ ] Add analytics events for feedback form view + submit + error.
- [ ] Write unit tests for schema validation, rate limiter, and send-feedback adapter (mock provider).
- [ ] Author integration test hitting the API route with mocked provider to ensure happy/sad paths.
- [ ] Update documentation (`README.md` or `docs/README.md`) with instructions for configuring feedback provider credentials in .env.

## Verification Steps

- `pnpm test:unit --filter feedback`
- `pnpm test:integration --filter feedback`
- Manual: `pnpm dev` → `/feedback`, submit valid/invalid payloads, ensure rate limit works (simulate by repeated submits), confirm email arrives in staging provider.

## Decision Authority

- Independent: choice of spam controls (honeypot vs CAPTCHA), server action vs API route, UI layout details, provider selection between Resend/Postmark (free tiers).
- Requires user input: adopting a paid provider, storing feedback beyond email, or capturing additional fields (attachments, etc.).

## Questions / Uncertainties

- **Blocking**: None.
- **Non-blocking**:
  - Should we localize validation/error copy now? (Assume English-only.)
  - Do we need attachments/screenshots? (Assume no.)

## Acceptable Tradeoffs

- Rate limiting can be in-memory for MVP; replacing with durable storage can wait until deployment scaling needs arise.
- Provider retry logic can be minimal (single attempt + error display) to keep the flow light.

## Status

- Not Started

## Notes

- Ensure `.env.example` and docs highlight `RESEND_API_KEY` (or equivalent) and make clear that credentials belong in server-only environments.
