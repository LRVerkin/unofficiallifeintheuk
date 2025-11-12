# Workplan – Step 4: UI Framework & Design System

**Task ID**: STEP-4-UIFramework

## Problem Statement

The app needs shared layout primitives, typography, form controls, and accessibility scaffolding before feature routes can be built. Without a cohesive design system, later quiz and results experiences will be inconsistent and harder to maintain.

## Proposed Implementation

- Configure global styles (`app/globals.css`) using Tailwind layers, CSS custom properties, typography scale, and reduced-motion support per Architecture guidelines.
- Implement `app/layout.tsx` handling fonts, metadata defaults, Plausible placeholder script, skip link, header/footer shells, and root providers.
- Build reusable UI primitives in `components/ui` (Button, Card, Input, Checkbox, RadioGroup, Progress, Tooltip, Alert) leveraging Tailwind + Radix UI for accessibility.
- Create layout components (`components/layout/SiteHeader.tsx`, `SiteFooter.tsx`) that include parody disclaimer, Ko-fi CTA slot, and navigation anchors.
- Implement CTA helpers (`components/cta/KoFiLink.tsx`, share button shells) with analytics hook integration.
- Document component usage conventions either within `docs/Architecture.md` or a new `docs/DesignSystem.md`.
- Optionally stand up Storybook or lightweight preview route to visually verify components across breakpoints.

## Components Involved

- Global styles (`app/globals.css`, `tailwind.config.ts`)
- `app/layout.tsx`
- `components/ui/*` primitives
- `components/layout/*`
- `components/cta/*`
- Documentation under `docs/`

## Dependencies

- Step 1 tooling + Tailwind configuration.

## Implementation Checklist

- [x] Finalise Tailwind config tokens (colors, spacing, typography scale, motion preferences) referenced by design system.
- [x] Update `app/globals.css` with Tailwind base/components/utilities layers plus custom properties and accessibility resets.
- [x] Implement `app/layout.tsx` with Next fonts, metadata defaults, skip-to-content link, header/footer slots, and Plausible script placeholder.
- [x] Build `SiteHeader` (logo, navigation anchors, Ko-fi link slot) following accessibility requirements.
- [x] Build `SiteFooter` including parody disclaimer, privacy note placeholder, and social/legal links per PRD.
- [x] Implement UI primitives: Button variants, Card, Input, Checkbox, RadioGroup, ProgressBar, Tooltip, Alert; include story/demo or MDX docs.
- [x] Create CTA helpers (KoFiLink, ShareButtons) with prop-driven analytics event triggers.
- [ ] Add unit/visual regression tests where practical (e.g., Storybook stories with Chromatic optional later).
- [x] Document component guidelines (usage, accessibility notes) in `docs/DesignSystem.md` (create dedicated file now for easier future edits).

## Verification Steps

- `pnpm lint`
- `pnpm typecheck`
- Default preview approach: use local Next routes or test pages (`pnpm dev`); Storybook intentionally deferred for now.

## Decision Authority

- Independent: choice of Radix vs headless UI, exact Tailwind token names, whether to add Storybook now or later, header/footer layout specifics consistent with Architecture.
- Requires user input: large scope reductions (e.g., omitting entire component families), major visual departures from Architecture doc.

## Questions / Uncertainties

- **Blocking**: None known.
- **Non-blocking**:
  - Should Storybook be introduced now or deferred? (Default to deferring unless needed.)
  - Any brand assets (logo, icons) available yet? (Use placeholders until provided.)

## Acceptable Tradeoffs

- Placeholder copy/assets acceptable while waiting on final branding.
- Tooltip/alert implementations can rely on Radix primitives to save time instead of bespoke solutions.
- Storybook is intentionally deferred; preview components via local Next routes for now and only introduce Storybook later if the component library outgrows simple test pages.

## Status

- Completed

## Notes

- Capture any accessibility decisions (focus outlines, keyboard handling) for reference when building quiz UI.
