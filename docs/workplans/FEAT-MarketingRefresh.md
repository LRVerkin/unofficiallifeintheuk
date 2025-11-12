# Workplan – Hero/Header/Footer Refresh

**Task ID**: FEAT-MarketingRefresh

## Problem Statement

The current marketing layout does not match the desired tone: header text lacks contrast and contains links we no longer want, the hero copy should mirror the ACTUAL Life in the UK pitch, and the footer needs different CTAs (Ko-fi + feedback). We need a cohesive refresh before building the next feature steps.

## Proposed Implementation

- Increase text contrast for header + hero typography.
- Update the header to only include the site title/logo placeholder (linking home), a new “About” link, and a “Take the Test” button.
- Create a minimal `/about` page with copy about Louise & Quentin, optional social placeholders, and a link to the feedback page.
- Replace hero content with the provided pitch excerpt, ensuring fonts are legible and bold/blockquote formatting works.
- Style the hero “Take the Test” button with a British flag-inspired background.
- Move the Ko-fi CTA into the footer alongside a “Suggest more questions / leave feedback” link pointing to `/feedback`.
- Remove the three feature cards from the hero section entirely.

## Components Involved

- `components/layout/SiteHeader.tsx`
- `components/layout/SiteFooter.tsx`
- `app/page.tsx` (hero)
- `app/about/page.tsx` (new)
- `components/cta/KoFiLink.tsx`
- `app/globals.css` (contrast tweaks, button styling)

## Dependencies

- Step 4 design system primitives (already available).

## Implementation Checklist

- [x] Adjust color tokens / CSS so header + hero text meet contrast requirements.
- [x] Update `SiteHeader` to contain only: placeholder logo/title linking to `/`, new “About” link, and `Button` labeled “Take the Test”.
- [x] Add `app/about/page.tsx` with brief copy about the creators, social link placeholders, and a link to `/feedback`.
- [x] Replace hero copy with the supplied pitch text, with adapted formatting from `docs/Unofficial Life in the UK - Pitch.md`. The part from "Could you become a UK citizen?" to "classics from the REAL United Kingdom!".
- [x] Style the hero “Take the Test” button with a British-flag background (CSS gradient or inline asset) while keeping text accessible.
- [x] Remove the Ko-fi CTA from the hero section and place it inside the footer next to a “Suggest more questions / leave feedback” link.
- [x] Delete the feature cards grid from the home page.
- [x] Verify layout responsiveness after changes (mobile/tablet/desktop).

## Verification Steps

- `pnpm lint`
- `pnpm typecheck`
- Manual QA via `pnpm dev`: check header/hero/footer on multiple viewport sizes, test About and feedback links, ensure button styling renders correctly.

## Decision Authority

- Independent: exact styling of the flag-inspired button, placeholder copy on the About page, placement/order of footer links.
- Requires user input: real logo asset when available, final social links once ready.

## Questions / Uncertainties

- **Blocking**: None.
- **Non-blocking**:
  - Preferred social networks to link on About? (Default: placeholder text.)
  - Should About include more narrative content later? (Assume yes; this MVP version stays minimal.)

## Acceptable Tradeoffs

- About page can remain text-only with placeholders until assets exist.
- British flag treatment can use CSS gradients rather than a full SVG if quicker, as long as contrast remains sufficient.

## Status

- Completed

## Notes

- Ensure hero copy stays in sync with `docs/Unofficial Life in the UK - Pitch.md`; consider referencing that doc for future updates.
