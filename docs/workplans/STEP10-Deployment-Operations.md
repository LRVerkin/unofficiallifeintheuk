# Workplan – Step 10: Deployment, Observability & Operations

**Task ID**: STEP-10-Deployment

## Problem Statement

To launch and maintain the product, we must establish Vercel deployments, environment management, monitoring, and rollback procedures. Without this operational backbone, releases will be risky and difficult to diagnose.

## Proposed Implementation

- Configure Vercel project linking to the repository with production + preview environments.
- Set required environment variables (`RESEND_API_KEY`, `PLAUSIBLE_DOMAIN`, `KO_FI_URL`, etc.) via Vercel dashboard or CLI.
- Add `vercel.json` or Next config overrides for headers (security, caching) and image domains.
- Define monitoring/alerting (Plausible dashboards, uptime pings, error logging e.g., Vercel Web Analytics or Sentry if needed).
- Draft release/rollback playbooks and document deployment steps.

## Components Involved

- `vercel.json` (if needed) / Next config updates
- Deployment scripts/docs (`docs/README.md`, `docs/Architecture.md`)
- Monitoring config (Plausible, uptime service)

## Dependencies

- Steps 1–9 (app + tests).

## Implementation Checklist

- [ ] Create Vercel project, connect repo, enable preview deployments for branches.
- [ ] Set environment variables per environment (prod/preview) and document them; verify `.env.example` matches.
- [ ] Configure security headers (Content-Security-Policy, Referrer-Policy, etc.) via Next middleware or `next.config.ts`.
- [ ] Enable image domains and caching policies as needed for persona assets.
- [ ] Set up uptime monitoring (Vercel checks, Pingdom, etc.) and log where alerts go.
- [ ] Establish release checklist (run generator, tests, build, manual smoke) stored in `docs/README.md` or `/docs/Release.md`.
- [ ] Document rollback procedure (e.g., revert commit, redeploy previous build) and incident response contacts.
- [ ] Validate deployments by running preview + prod smoke tests and ensuring environment secrets are loaded.

## Verification Steps

- Trigger Vercel preview build from PR and confirm success.
- Deploy to production and run smoke test (quiz completion, results, feedback).
- Confirm monitoring/analytics dashboards receive traffic.

## Decision Authority

- Independent: choice of uptime/alerting tool (as long as free tier), header configuration, release checklist format.
- Requires user input: adding paid observability (e.g., Sentry Pro), or introducing multi-region infra.

## Questions / Uncertainties

- **Blocking**: None.
- **Non-blocking**:
  - Do we need password-protected previews pre-launch? (Assume optional; implement if requested.)
  - Will there be a staging domain separate from preview links? (Clarify when needed.)

## Acceptable Tradeoffs

- Minimal logging (relying on Vercel serverless logs) is fine for MVP; adopt more robust logging later.
- If advanced CSP policies block necessary scripts temporarily, allow-lists can be tuned iteratively.

## Status

- Not Started

## Notes

- Keep a checklist entry for updating `docs/QuestionBank.md` before releases so content stays synced with generated data.
