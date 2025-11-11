# Unofficial Life in the UK

A fast, tongue-in-cheek Life in the UK quiz built with Next.js 16, TypeScript, Tailwind CSS, and an automated content pipeline.

## Requirements

- **Node.js**: v20.11 or newer (LTS recommended). Install via [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).
  ```bash
  node -v  # should print >= v20.11.0
  ```
- **pnpm**: v10.x. Enable through Corepack or install globally once Node is available.
  ```bash
  corepack enable pnpm   # preferred
  pnpm -v                # should print >= 10
  ```
- **Git hooks**: After installing dependencies run `git config core.hooksPath .husky` (or `pnpm prepare`) so Husky can run pre-commit checks.

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   pnpm install
   ```
2. Copy environment variables and fill in secrets:
   ```bash
   cp .env.example .env
   ```
3. Run the dev server:
   ```bash
   pnpm dev
   ```
   Visit http://localhost:3000 to verify the placeholder marketing page renders.

## Scripts

| Script                  | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| `pnpm dev`              | Start Next.js in development mode.                              |
| `pnpm build`            | Create a production build.                                      |
| `pnpm start`            | Serve the production build locally.                             |
| `pnpm lint`             | Run ESLint with the shared config.                              |
| `pnpm lint:styles`      | Lint CSS with Stylelint.                                        |
| `pnpm typecheck`        | Run TypeScript in no-emit mode.                                 |
| `pnpm test:unit`        | Execute Vitest (jsdom environment) with coverage configuration. |
| `pnpm test:integration` | Reserved for future Vitest integration suites.                  |
| `pnpm test:e2e`         | Placeholder until Playwright lands (Step 9).                    |
| `pnpm format`           | Format files with Prettier.                                     |

Husky + lint-staged run ESLint, Stylelint, and Prettier on staged files before commits once hooks are enabled.

## Project Structure

```
app/              # App Router entries, layout, global styles
components/       # Shared UI, layout, and CTA components
lib/              # Domain utilities (quiz engine will live here)
data/             # Generated question/persona modules
scripts/          # Build-time utilities (e.g., question generator)
tests/            # Vitest suites (unit/integration placeholders)
docs/             # PRD, architecture, workplans
```

## Environment Variables (`.env`)

| Name                    | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| `RESEND_API_KEY`        | API key for outbound feedback emails (server only).              |
| `PLAUSIBLE_DOMAIN`      | Domain used by Plausible analytics script.                       |
| `KO_FI_URL`             | Server-only Ko-fi configuration (e.g., for API calls if needed). |
| `NEXT_PUBLIC_KO_FI_URL` | Public Ko-fi link used by CTA components.                        |
| `NEXT_PUBLIC_SITE_URL`  | Canonical site URL for metadata.                                 |

## Next Steps

- Step 2 will introduce the Markdown-driven question generator under `scripts/`.
- Step 3 builds the quiz engine modules in `lib/quiz` using the new testing stack.
- Step 4 layers on the shared design system and production-ready UI primitives.
