import { personas } from "@/data/personas";
import type { Persona } from "@/data/personas";

export function getPersonaForPercentage(percentage: number): Persona {
  const clamped = Math.max(0, Math.min(1, percentage));
  const target = clamped * 100;
  const match =
    personas.find((persona) => target >= persona.minPercentage) ?? personas[personas.length - 1];
  return match;
}
