# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Unofficial Life in the UK is a humorous quiz web application that parodies the official UK citizenship test. Users answer 24 questions about "real" UK life and receive personalized results with witty persona-based feedback. The app is mobile-first, serverless, and requires no user accounts.

## Documentation as Source of Truth

The `docs/` folder contains the authoritative project documentation:

- **Architecture.md** - System design, tech decisions, data contracts
- **ProjectPlan.md** - 11-step implementation roadmap with goals and deliverables
- **Project_PRD.md** - Product requirements and feature specs
- **QuestionBank.md** - Question content (parsed into code at build time)
- **workplans/** - Detailed step-by-step implementation plans

When making changes to architecture, project scope, or high-level decisions, update these documents to keep them in sync. This CLAUDE.md is a summary; the docs/ folder is the ground truth.

## Commands

```bash
# Development
pnpm dev                    # Start Next.js dev server at localhost:3000
pnpm build                  # Production build (auto-runs generate:questions)
pnpm start                  # Serve production build

# Quality checks
pnpm lint                   # ESLint (strict, max-warnings=0)
pnpm lint:styles            # Stylelint for CSS
pnpm typecheck              # TypeScript validation

# Testing
pnpm test:unit              # Run Vitest unit tests
pnpm test:integration       # Integration tests (placeholder)
pnpm test:e2e               # E2E tests (Playwright, pending Step 9)

# Content generation
pnpm generate:questions     # Parse docs/QuestionBank.md → data/questions.ts
```

## Architecture

See `docs/Architecture.md` for comprehensive details on system design and data contracts.

### Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (strict)
- **Styling**: Tailwind CSS 3.4 + Radix UI primitives
- **Testing**: Vitest + React Testing Library (jsdom)
- **Package Manager**: pnpm 10.x (Node ≥20.11 required)

### Key Directories

- `app/` - Next.js App Router pages and layouts
- `components/ui/` - Design system atoms (Button, Card, Input, Checkbox, etc.)
- `components/layout/` - SiteHeader, SiteFooter
- `lib/quiz/` - Core quiz engine (sampler, scoring, session, validators, types)
- `data/` - Generated questions.ts + personas.ts + Zod schemas
- `docs/` - PRD, Architecture.md, ProjectPlan.md, workplans, QuestionBank.md

### Content Pipeline

Questions are authored in `docs/QuestionBank.md` (Markdown) and parsed by `scripts/generate-question-bank.ts` into `data/questions.ts`. The generator validates against Zod schemas and fails fast on errors. Always run `pnpm generate:questions` after editing QuestionBank.md.

### Quiz Engine (`lib/quiz/`)

- **types.ts** - QuizSession, QuestionResponse, QuizResult, QuizConfig interfaces
- **sampler.ts** - Seeded shuffling using mulberry32 PRNG for reproducible sessions
- **scoring.ts** - Per-question scoring (single, multiple, rank, text with fuzzy matching)
- **validators.ts** - Input validation per question type
- **session.ts** - Quiz state management

### Question Types

- `single` - Single choice (radio buttons)
- `multiple` - Multiple choice (checkboxes)
- `rank` - Ordering/ranking
- `text` - Free text with configurable fuzzy matching (Levenshtein)

### State Management

React Context + useReducer for quiz session state. No Redux/external state library. Optional sessionStorage for reload persistence.

## Development Methodology

This project follows TDD - write tests before implementation. All application logic and UI flows require tests. The quiz engine modules target ≥90% coverage.

## Implementation Roadmap

Development follows an 11-step phased plan. See `docs/ProjectPlan.md` for the full roadmap and `docs/workplans/` for detailed step implementations. Current progress is through Step 4 (UI framework). Key remaining steps:

- Step 5: Quiz experience UI
- Step 6: Results/sharing flow
- Step 7: Feedback email integration
- Step 8: Analytics instrumentation
- Step 9: E2E testing with Playwright

## Environment Variables

Required in `.env`:

- `RESEND_API_KEY` - Email service for feedback
- `NEXT_PUBLIC_KO_FI_URL` - Ko-fi donation link
- `NEXT_PUBLIC_SITE_URL` - Canonical site URL
- `PLAUSIBLE_DOMAIN` - Analytics domain
