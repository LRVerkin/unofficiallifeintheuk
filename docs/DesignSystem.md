# Design System Notes

This lightweight guide captures component usage and accessibility considerations introduced in Step 4. Expand it as new primitives emerge.

## Tokens & Foundations

- Colors: `brand.primary`, `brand.secondary`, `surface.*`, `muted.foreground`. Maintain AA contrast.
- Typography: `--font-display` for headings, `--font-body` for body copy, `--font-mono` for code. Use `font-display` utility classes where appropriate.
- Motion: honor `prefers-reduced-motion`; avoid large animations.

## Core Components

- **Button**: variants (`primary`, `secondary`, `ghost`, `link`) + sizes (`sm`, `md`, `lg`). Use `asChild` when wrapping Next `Link`; built-in focus styles cover accessibility.
- **Card**: rounded container with subtle border/shadow; wrap hero, feature, or settings blocks.
- **Input**: general text input. Pair with `<label>`; apply `aria-invalid` on errors.
- **Checkbox / RadioGroup**: Radix-backed controls; keep labels clickable and group radios with legends for quiz prompts.
- **Progress**: `role="progressbar"` + `aria-valuenow` for announcing quiz progress.
- **Tooltip**: Radix provider; triggers must be focusable and reference content via `aria-describedby`.
- **Alert**: use for success/warning/error messaging; keep copy concise.
- **ShareButtons**: copy/Web Share pair triggering analytics events; summary text should be short.

## Layout Components

- **SiteHeader**: includes skip link anchor, navigation, Ko-fi CTA. Keep it sticky with backdrop blur; update links as new sections exist.
- **SiteFooter**: always display parody disclaimer plus Ko-fi/feedback links.

- **KoFiLink**: two variants (`link`, `button`). Always set `rel="noreferrer"` for external links and read `NEXT_PUBLIC_KO_FI_URL` at runtime.
- **ShareButtons**: uses clipboard + Web Share API; call from results or marketing sections when share copy available.

## Accessibility Checklist

- Always include `focus-outline` on interactive elements.
- Provide `aria-live` regions only where necessary to avoid chatter.
- Use semantic HTML (`button`, `nav`, `header`, `footer`) before turning to divs.

Update this document as components evolve or new primitives land.
