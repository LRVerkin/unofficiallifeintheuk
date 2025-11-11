# Workplan – Step 1: Environment & Tooling Foundations

**Task ID**: STEP-1-Environment

## Problem Statement

We need a reproducible Next.js 15 + TypeScript workspace with all developer tooling (package manager, styling, linting, testing hooks, documentation) so future feature work can be implemented confidently and consistently.

## Proposed Implementation

- Standardise the local toolchain on Node.js LTS (≥20.11) and pnpm; document the exact install commands and verification steps in `README.md`.
- Scaffold a new Next.js App Router project with the directory structure defined in `docs/Architecture.md`, pre-creating placeholder folders (`app`, `components`, `data`, `lib`, `tests`).
- Configure TypeScript (`tsconfig.json`) with `strict` mode, path aliases (`@/*`), and test-specific compiler options to support Vitest/Playwright later.
- Install and configure Tailwind CSS, PostCSS, autoprefixer, and create `tailwind.config.ts` containing tokens/hooks referenced by later steps.
- Add ESLint (Next + custom rules), Prettier, Stylelint (optional), Husky, and `lint-staged`; wire scripts (`dev`, `build`, `lint`, `typecheck`, `test:*`, `prepare`) in `package.json`.
- Create `.env`, `.env.example`, and VS Code workspace recommendations to align environment variables and editor behaviour.
- Smoke-test the dev server (`pnpm dev`) and document the entire setup process in `README.md` to unblock collaborators.

## Components Involved

- Tooling & DX (Node.js, pnpm, Husky, lint-staged)
- Next.js project scaffold (`app`, `components`, `lib`, `tests`)
- Styling stack (Tailwind CSS, PostCSS)
- Linting/formatting (ESLint, Prettier, Stylelint)
- Documentation (`README.md`, workspace settings)

## Dependencies

- None (foundational step).

## Implementation Checklist

### Tasks for You (Local machine setup)

- [x] Install Node.js ≥20.11 (use `nvm`, `fnm`, or installer) and verify via `node -v`.
- [x] Install pnpm globally (`corepack enable` preferred) and verify via `pnpm -v`.
- [x] Confirm you can run `pnpm install` locally once the repo changes land (ensures toolchain permissions).
- [x] Copy `.env.example` → `.env` locally and populate Ko-fi + analytics fields when you have the values; `RESEND_API_KEY` can remain blank until Step 7 wires up feedback email.

### Tasks for Codex (repo scaffolding & config)

- [x] Update `README.md` prerequisites section with Node.js/pnpm install + verification instructions.
- [x] Initialise Next.js App Router project (`pnpm create next-app` or manual scaffold) with TypeScript and App Router enabled.
- [x] Create required directories (`app`, `components`, `data`, `lib`, `tests`) plus placeholder files to keep Git happy.
- [x] Configure `tsconfig.json` with `strict`, `moduleResolution: bundler`, path aliases for `@/components`, `@/lib`, `@/data`, and a testing-focused `tsconfig.test.json`.
- [x] Install Tailwind CSS + PostCSS + autoprefixer; create `postcss.config.js`, `tailwind.config.ts`, and seed `globals.css` with Tailwind layers.
- [x] Add ESLint (Next config), Prettier, Stylelint (optional) plus shared config files; ensure `package.json` scripts `lint`, `typecheck`, `format` exist.
- [x] Configure Husky + lint-staged and add a pre-commit hook running `pnpm lint-staged`.
- [x] Add `.env.example` documenting `RESEND_API_KEY`, `PLAUSIBLE_DOMAIN`, `KO_FI_URL`, etc., and reference it in `README.md`.
- [x] Add `.vscode/extensions.json` and `.vscode/settings.json` (format on save, suggested extensions).

### Shared / Verification

- [x] Run `pnpm install`, `pnpm lint`, `pnpm typecheck`, and `pnpm dev` to confirm the scaffold works; Codex can prep scripts and you can re-run locally as a sanity check.

## Verification Steps

- `node -v` (should be ≥20.11)
- `pnpm -v` (should match latest LTS)
- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm dev` (confirm http://localhost:3000 responds with placeholder page)

## Decision Authority

- Independent: choice of exact Node.js manager, pnpm install method, folder bootstrap commands, lint rule presets, Tailwind plugin selection, Husky/lint-staged configuration.
- Requires user input: introducing paid tooling/services, deviating from Next.js + Tailwind baseline, or skipping any checklist item for schedule reasons.

## Questions / Uncertainties

- **Blocking**: None identified.
- **Non-blocking**:
  - Should Stylelint be included now or deferred until CSS volume increases? (Assume include per plan unless user objects.)
  - Preferred convention for `.nvmrc`? (Default to latest LTS if no guidance.)

## Acceptable Tradeoffs

- Use default Next.js ESLint config as a base even if custom rules are refined later.
- Skip Storybook or other heavy tooling until the design system (Step 4) demands it.
- Placeholder Tailwind tokens may be minimal provided structure is ready for expansion (e.g., define `colors.brand` and `fontFamily.display` entries even if they temporarily map to default Tailwind values so future branding simply swaps the values rather than refactoring config).
- All tooling choices rely on free/open-source options; no paid services are required for this step.

## Status

- Completed

## Notes

- `git config core.hooksPath .husky` (or rerun `pnpm prepare`) must be executed locally to activate Husky because the CLI could not modify `.git/config` inside this environment.
- Resend/Postmark credentials and Plausible domain setup will occur with Step 7–8; the `.env` placeholders exist now so you can populate them once those services are configured.
