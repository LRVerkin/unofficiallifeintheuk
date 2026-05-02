# Unofficial Life in the UK

**Could you become a UK citizen?**
Take the [ACTUAL Life in the UK](https://lifeintheuktestweb.co.uk/) test and find out!

_Life in the UK_ is an official test you must pass to gain British citizenship.
It's famous for having nothing to do with real life in the UK — most of your British friends couldn’t pass it without studying.

Our **ACTUAL Life in the UK** test has no 1988 Olympics, no Tower of London construction: only REAL classics from the REAL United Kingdom!

## Stack

- **Astro 5** — static-first, with Cloudflare Pages adapter for the feedback POST
- **React 19** — single hydrated island for the quiz; everything else is zero JS
- **Tailwind CSS 4** — CSS-first config in `src/styles/global.css`
- **Zod** — schema validation for questions, personas, and the feedback form
- **Vitest + @testing-library** — unit tests for the engine and (later) UI islands

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

## Getting started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy the example env file and fill in any secrets you need locally:
   ```bash
   cp .env.example .env
   ```
3. Run the dev server:
   ```bash
   pnpm dev
   ```
   Visit http://localhost:4321 to see the site.

## Scripts

| Script             | Description                                        |
| ------------------ | -------------------------------------------------- |
| `pnpm dev`         | Start Astro in development mode.                   |
| `pnpm build`       | Create a production build (output in `dist/`).     |
| `pnpm preview`     | Serve the production build locally.                |
| `pnpm typecheck`   | Run `astro check` and `tsc --noEmit`.              |
| `pnpm lint`        | Run ESLint with the Astro plugin.                  |
| `pnpm lint:styles` | Lint CSS with Stylelint.                           |
| `pnpm test:unit`   | Execute Vitest (jsdom environment).                |
| `pnpm test:e2e`    | Placeholder — Playwright lands in a later session. |
| `pnpm format`      | Format files with Prettier.                        |

Husky + lint-staged run ESLint, Stylelint, and Prettier on staged files before commits.

## Content workflow

Questions live in [`src/data/questions.ts`](src/data/questions.ts) as a hand-authored TypeScript module, validated at module load by Zod.

[`docs/QuestionBank.md`](docs/QuestionBank.md) is the human-readable reference; if you edit it, propagate the change to `src/data/questions.ts` (and vice-versa). The Markdown file is no longer parsed at build time.

Persona metadata lives in [`src/data/personas.ts`](src/data/personas.ts). Placeholder artwork is in [`public/personas/`](public/personas/) — see the README in that folder for replacement instructions.

## Project structure

```
astro.config.mjs        # Astro + integrations + Cloudflare adapter
src/
├── pages/              # / quiz / results / feedback / 404
├── layouts/            # BaseLayout.astro
├── components/
│   ├── astro/          # Static Astro components (header, footer, KoFi)
│   └── react/          # React island components (built next session)
├── lib/                # Framework-free quiz engine + helpers
├── data/               # Hand-authored questions + personas + Zod schemas
├── actions/            # Astro Actions (feedback handler — built next session)
└── styles/global.css   # Tailwind 4 CSS-first config
public/                 # Static assets (favicon, persona placeholders)
tests/unit/             # Vitest suites
docs/                   # PRD, Architecture, QuestionBank, Roadmap
```

## Environment variables

| Name                      | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `RESEND_API_KEY`          | API key for outbound feedback emails (server-only).        |
| `FEEDBACK_TO_EMAIL`       | Inbox that receives forwarded feedback messages.           |
| `PUBLIC_KO_FI_URL`        | Public Ko-fi link used by the donation CTA.                |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Domain registered with Plausible for the analytics script. |

`PUBLIC_*` values are exposed to the browser; everything else is server-only.

## Roadmap

See [`docs/Roadmap.md`](docs/Roadmap.md) for the prioritised list of remaining work (quiz UI, results, feedback form, analytics, persona artwork, CI, etc.).
