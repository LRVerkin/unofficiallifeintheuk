# Documentation Guide

| File                                   | Purpose                                                             |
| -------------------------------------- | ------------------------------------------------------------------- |
| `Project_PRD.md`                       | Product requirements and acceptance criteria.                       |
| `Architecture.md`                      | Technical blueprint — stack, structure, domain model, runtime flow. |
| `Roadmap.md`                           | Tracked checklist of remaining work, organised by phase.            |
| `QuestionBank.md`                      | Human-readable reference for the 24 launch questions.               |
| `Unofficial Life in the UK - Pitch.md` | Original pitch deck and source notes.                               |
| `DesignSystem.md`                      | Colour, type, and tone tokens.                                      |

## Editing the Question Bank

The runtime question bank is now hand-authored in [`src/data/questions.ts`](../src/data/questions.ts). `docs/QuestionBank.md` is a human-readable mirror — when you change one, mirror the change to the other.

`src/data/questions.ts` is parsed by Zod (`questionListSchema`) at module load, so a malformed entry surfaces immediately when you run `pnpm dev` or `pnpm test:unit`.

## Personas

Persona metadata lives in [`src/data/personas.ts`](../src/data/personas.ts):

- `minPercentage` values must start at `0` and strictly ascend (Zod enforces it).
- Each persona references both a `light` and `dark` SVG. Placeholders ship in [`public/personas/`](../public/personas/) — see the README there for replacement instructions.
- Update headlines/descriptions in the PRD if you change the user-facing copy here.
