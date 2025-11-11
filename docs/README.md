# Documentation Guide

## Editing the Question Bank

1. Update `docs/QuestionBank.md` using the existing structure (`## Q###` headings with bullet-list details).
2. Run `pnpm generate:questions` to regenerate `data/questions.ts`. The script validates IDs, required fields, and option indexes through Zod.
3. Run `pnpm test:unit` to exercise the parser snapshot tests.

## Personas

Persona metadata lives in `data/personas.ts`. Keep the following rules in mind:

- `minPercentage` values must start at `0` and increase strictly (the validator enforces this).
- Provide both light/dark asset paths; placeholder SVGs live under `public/personas/` for now.
- Update descriptions/headlines in the PRD if copy changes here.

## Workflow Summary

```
QuestionBank.md → pnpm generate:questions → data/questions.ts → tests ✅
```

Any additions to the docs folder should follow this README-first pattern so contributors know where to look.
