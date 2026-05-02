import type { Persona } from "@/data/personas";
import type { QuizResult } from "./quiz/types";

export function buildShareMetadata(result: QuizResult, persona: Persona) {
  const percentage = Math.round(result.percentage * 100);
  const title = `I scored ${percentage}% on the Unofficial Life in the UK test`;
  const description = `${persona.name}: ${persona.headline}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [persona.image.light],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [persona.image.light],
    },
  };
}
