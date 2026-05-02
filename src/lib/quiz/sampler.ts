import type { QuizQuestion } from "./types";

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let m = Math.imul(t ^ (t >>> 15), 1 | t);
    m ^= m + Math.imul(m ^ (m >>> 7), 61 | m);
    return ((m ^ (m >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function ensureSeed(seed?: string): string {
  if (seed && seed.trim().length > 0) return seed;
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `seed-${Math.random().toString(36).slice(2)}`;
}

export function shuffleQuestions<T extends QuizQuestion>(
  questions: T[],
  seed: string,
): T[] {
  const rng = mulberry32(hashSeed(seed));
  const copy = [...questions];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function pickQuestions<T extends QuizQuestion>(
  questions: T[],
  count: number,
  seed: string,
): T[] {
  const shuffled = shuffleQuestions(questions, seed);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
