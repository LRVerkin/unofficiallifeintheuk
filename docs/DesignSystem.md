# Design System Notes

This lightweight guide captures component usage and accessibility considerations introduced in Step 4. Expand it as new primitives emerge.

## Tokens & Foundations

- Colors: `brand.primary`, `brand.secondary`, `surface.*`, `muted.foreground`. Maintain AA contrast.
- Typography: `--font-display` for headings, `--font-body` for body copy, `--font-mono` for code. Use `font-display` utility classes where appropriate.
- Motion: honor `prefers-reduced-motion`; avoid large animations.

## Core Components

- **Button**: variants (`primary`, `secondary`, `ghost`, `link`). Always include visible focus outline (`focus-outline` class). Use `aria-live` sparingly for loading states.
- **Card**: wraps content sections with `shadow-card` and `rounded-3xl`. Use semantic headings inside.
- **Input/Field**: pair `label` + `id`, include helper/error text and `aria-invalid` when needed.
- **Checkbox/Radio**: ensure labels are clickable; group radios within `fieldset` + `legend` for question prompts.
- **ProgressBar**: use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- **Tooltip**: rely on Radix primitives; ensure keyboard trigger works and `aria-describedby` links to content.

## Layout Components

- **SiteHeader**: site title on the left, "Take the test" CTA on the right (hidden on /quiz). Black background with a gov.uk-blue accent strip below.
- **SiteFooter**: links to "Suggest a question" and "Support us on Ko-fi". No parody disclaimer in the UI.

## CTA Helpers

- **KoFiLink**: two variants (`link`, `button`). Always set `rel="noreferrer"` for external links and read `PUBLIC_KO_FI_URL` at runtime.

## Accessibility Checklist

- Always include `focus-outline` on interactive elements.
- Provide `aria-live` regions only where necessary to avoid chatter.
- Use semantic HTML (`button`, `nav`, `header`, `footer`) before turning to divs.

Update this document as components evolve or new primitives land.
