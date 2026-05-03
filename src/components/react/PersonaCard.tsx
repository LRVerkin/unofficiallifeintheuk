import type { Persona } from "@/data/personas";
import { Card } from "./Card";

interface PersonaCardProps {
  persona: Persona;
  score: number;
  total: number;
}

export function PersonaCard({ persona, score, total }: PersonaCardProps) {
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

  return (
    <Card aria-label={`Result: ${persona.name}`} className="flex flex-col gap-4 sm:flex-row">
      <img
        src={persona.image.light}
        alt={persona.image.alt}
        width={160}
        height={160}
        className="h-40 w-40 flex-shrink-0 bg-[var(--color-surface-muted)] object-cover"
        style={{ borderColor: persona.badgeColor, borderWidth: 4, borderStyle: "solid" }}
      />
      <div className="flex flex-col gap-2">
        <p
          className="text-sm font-bold uppercase tracking-[0.2rem]"
          style={{ color: persona.badgeColor }}
        >
          {percentage}% — {score} / {total}
        </p>
        <h2 className="text-2xl font-bold sm:text-3xl">{persona.name}</h2>
        <p className="text-lg italic">{persona.headline}</p>
        <p className="text-sm text-[var(--color-muted-foreground)]">{persona.description}</p>
      </div>
    </Card>
  );
}
