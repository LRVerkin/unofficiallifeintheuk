# Design System Notes

This lightweight guide captures component usage and accessibility considerations for the dependency-free **primitive** components in [`src/components/react/`](../src/components/react/) — Button, Card, RadioGroup, CheckboxGroup, RankList, TextAnswer, ProgressBar, Alert. Expand it as new primitives emerge.

The **composite** components that build the app — `QuizApp`, `QuestionCard`, `ResultsView`, `ResultBreakdown`, `PersonaCard`, `FeedbackForm` — are described in [`Architecture.md`](Architecture.md): §6 covers page-level mounts and the quiz flow, §5 covers the underlying engine.

## Tokens & Foundations

- Colors: `brand.primary`, `brand.secondary`, `surface.*`, `muted.foreground`. Maintain AA contrast.
- Typography: `--font-display` for headings, `--font-body` for body copy, `--font-mono` for code. Use `font-display` utility classes where appropriate.
- Motion: honor `prefers-reduced-motion`; avoid large animations.

## Core Components

- **Button**: variants `primary`, `secondary`, `ghost`; sizes `sm`, `md`. Visible focus outline.
- **Card**: generic surface wrapper rendering a semantic `<section>` by default; the `as` prop overrides the tag. Border + `--color-surface` background + padding via CSS variables.
- **RadioGroup**: `<fieldset>` + `<legend>` + native radios, single-select.
- **CheckboxGroup**: same pattern as `RadioGroup`; selection is returned sorted ascending.
- **RankList**: up/down buttons (boundary-disabled), `aria-live` reorder announcements, no drag-and-drop dependency.
- **TextAnswer**: `<label>` paired via `htmlFor`; sets `aria-invalid` + `aria-describedby` when an error is supplied.
- **ProgressBar**: `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`; `current` clamped to `[0, total]`.
- **Alert**: `role="status"` + `aria-live="polite"` for info; `role="alert"` + `aria-live="assertive"` for success/error.

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
