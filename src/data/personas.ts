import { z } from "zod";

const personaSchema = z.object({
  id: z.string(),
  name: z.string(),
  headline: z.string(),
  description: z.string(),
  minPercentage: z.number().min(0).max(100),
  badgeColor: z.string(),
  image: z.object({
    light: z.string(),
    dark: z.string(),
    alt: z.string(),
  }),
});

const personaListSchema = z
  .array(personaSchema)
  .superRefine((list, ctx) => {
    const sorted = [...list].sort((a, b) => a.minPercentage - b.minPercentage);
    if (sorted[0]?.minPercentage !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Persona ranges must start at 0%",
      });
    }
    for (let index = 1; index < sorted.length; index += 1) {
      if (sorted[index].minPercentage <= sorted[index - 1].minPercentage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Persona minPercentage values must be strictly ascending",
        });
      }
    }
    if (sorted[sorted.length - 1]?.minPercentage > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Persona ranges cannot exceed 100%",
      });
    }
  });

const personaSeed = personaListSchema.parse([
  {
    id: "ROYAL_STANDARD",
    name: "The Royal Standard Bearer",
    headline: "You bleed Earl Grey.",
    description:
      "You recite the shipping forecast by heart, own commemorative dishware, and can assemble a proper Sunday roast in 45 minutes flat.",
    minPercentage: 90,
    badgeColor: "#D4003C",
    image: {
      light: "/personas/royal.svg",
      dark: "/personas/royal-dark.svg",
      alt: "Illustration of a royal figure waving a Union Jack.",
    },
  },
  {
    id: "PUB_QUIZ_CAPTAIN",
    name: "Pub Quiz Captain",
    headline: "Your team owes you a pint.",
    description:
      "You can quote half of Blackadder, always know the capital of obscure Commonwealth islands, and file strongly worded noise complaints.",
    minPercentage: 75,
    badgeColor: "#012169",
    image: {
      light: "/personas/quiz.svg",
      dark: "/personas/quiz-dark.svg",
      alt: "Person triumphantly holding a pub quiz trophy.",
    },
  },
  {
    id: "COMMUTER_ORACLE",
    name: "Commuter Oracle",
    headline: "You can smell a signal failure a mile off.",
    description:
      "You instinctively stand on the right, tut on behalf of the group, and keep a just-in-case brolly in every bag.",
    minPercentage: 55,
    badgeColor: "#0F8B8D",
    image: {
      light: "/personas/commuter.svg",
      dark: "/personas/commuter-dark.svg",
      alt: "Person balancing tea, umbrella, and tube map at once.",
    },
  },
  {
    id: "BISCUIT_DIPPER",
    name: "Biscuit Dipper",
    headline: "Solid showing with room to dunk.",
    description:
      "You can taste the difference between a Hobnob and a Digestive, but you still pronounce Leicester incorrectly under pressure.",
    minPercentage: 35,
    badgeColor: "#FFB81C",
    image: {
      light: "/personas/biscuit.svg",
      dark: "/personas/biscuit-dark.svg",
      alt: "Friendly figure dunking a biscuit into a cuppa.",
    },
  },
  {
    id: "RAIN_SOAKED_ROOKIE",
    name: "Rain-Soaked Rookie",
    headline: "You brought sunglasses but forgot the brolly.",
    description:
      "You are welcome here, but please spend a weekend in a Midlands Wetherspoons before reapplying for citizenship.",
    minPercentage: 0,
    badgeColor: "#6C757D",
    image: {
      light: "/personas/rookie.svg",
      dark: "/personas/rookie-dark.svg",
      alt: "Cheerful newcomer being rained on while holding a tiny flag.",
    },
  },
]);

export type Persona = z.infer<typeof personaSchema>;
export const personas: Persona[] = personaSeed.sort(
  (a, b) => b.minPercentage - a.minPercentage,
);
