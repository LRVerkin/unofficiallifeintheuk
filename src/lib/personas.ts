import { personas } from "@/data/personas";
import type { Persona } from "@/data/personas";

// Relies on `personas` being sorted by `minPercentage` descending — see the
// final `.sort()` in `src/data/personas.ts`. The find-and-take-first below
// breaks if anyone re-sorts that list.
export function getPersonaForPercentage(percentage: number): Persona {
  const clamped = Math.max(0, Math.min(1, percentage));
  const target = clamped * 100;
  const match =
    personas.find((persona) => target >= persona.minPercentage) ?? personas[personas.length - 1];
  return match;
}
