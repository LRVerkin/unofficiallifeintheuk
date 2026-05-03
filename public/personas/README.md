# Persona artwork

Each placeholder here is referenced from [`src/data/personas.ts`](../../src/data/personas.ts) via the `image.light` and `image.dark` fields. The runtime renders only `image.light` until dark mode ships (see `docs/Roadmap.md`), but the dark variants stay in place so the data shape doesn't drift.

## Files

| Persona              | Slug       | Light variant       | Dark variant            |
| -------------------- | ---------- | ------------------- | ----------------------- |
| Royal Standard Bearer | `royal`    | `royal.svg`         | `royal-dark.svg`        |
| Pub Quiz Captain      | `quiz`     | `quiz.svg`          | `quiz-dark.svg`         |
| Commuter Oracle       | `commuter` | `commuter.svg`      | `commuter-dark.svg`     |
| Biscuit Dipper        | `biscuit`  | `biscuit.svg`       | `biscuit-dark.svg`      |
| Rain-Soaked Rookie    | `rookie`   | `rookie.svg`        | `rookie-dark.svg`       |

## Replacing the placeholders

1. Commission or design a 600×600 illustration per persona (square, single subject, breathing room around the figure).
2. Export two variants per persona: a light-mode version with a near-white background and a dark-mode version with a near-black background.
3. Save them to this directory using the exact file names above. SVG is preferred (smaller, scalable). PNG/WebP are fine — update `image.light` / `image.dark` paths in `src/data/personas.ts` if the extension changes.
4. Keep the `alt` text in `src/data/personas.ts` describing the figure for screen readers.
5. Run `pnpm build` and visually check the results page for each persona.

## Licensing

Whatever artwork you ship must be either original or under a licence that permits redistribution and modification (Creative Commons Attribution / Public Domain are safe defaults). Note the source/credit alongside any non-original asset in this README.
