import { z } from "zod";

export const questionIdSchema = z
  .string()
  .regex(/^Q\d{3}$/, "Question IDs must follow the pattern Q###");

export const optionSchema = z.object({
  id: z.number().int().positive(),
  label: z.string().min(1),
});

const baseQuestionSchema = z.object({
  id: questionIdSchema,
  type: z.enum(["single", "multiple", "rank", "text"]),
  prompt: z.string().min(1),
  required: z.boolean().default(true),
  tags: z.array(z.string()).nonempty(),
  feedback: z
    .record(z.string(), z.string())
    .optional()
    .transform((value) => (value && Object.keys(value).length > 0 ? value : undefined))
    .optional(),
  specialRules: z.array(z.string()).default([]),
});

export const singleChoiceQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal("single"),
    options: z.array(optionSchema).min(2),
    correct: z.array(z.number().int().min(1)).min(1),
  })
  .superRefine((question, ctx) => {
    for (const value of question.correct) {
      if (value > question.options.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Correct option ${value} is out of range for question ${question.id}`,
          path: ["correct"],
        });
      }
    }
  });

export const multipleChoiceQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal("multiple"),
    options: z.array(optionSchema).min(2),
    correct: z.array(z.number().int().min(1)).min(1),
    minRequired: z.number().int().min(1).optional(),
  })
  .superRefine((question, ctx) => {
    const optionCount = question.options.length;
    for (const value of question.correct) {
      if (value > optionCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Correct option ${value} is out of range for question ${question.id}`,
          path: ["correct"],
        });
      }
    }
    if (question.minRequired && question.minRequired > question.correct.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `minRequired cannot exceed number of correct answers for ${question.id}`,
        path: ["minRequired"],
      });
    }
  });

export const rankQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal("rank"),
    options: z.array(optionSchema).min(2),
    correct: z.array(z.number().int().min(1)),
  })
  .superRefine((question, ctx) => {
    if (question.correct.length !== question.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Rank question ${question.id} must specify the same number of answers as options`,
        path: ["correct"],
      });
    }
  });

const textValidationSchema = z.object({
  strategy: z.enum(["exact", "contains"]).default("exact"),
  normalizeCase: z.boolean().default(true),
  trimWhitespace: z.boolean().default(true),
  fuzzyThreshold: z.number().min(0).max(1).optional(),
});

export const textQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("text"),
  acceptableAnswers: z.array(z.string().min(1)).min(1),
  textValidation: textValidationSchema.default({
    strategy: "exact",
    normalizeCase: true,
    trimWhitespace: true,
  }),
});

export const questionSchema = z.discriminatedUnion("type", [
  singleChoiceQuestionSchema,
  multipleChoiceQuestionSchema,
  rankQuestionSchema,
  textQuestionSchema,
]);

export const questionListSchema = z
  .array(questionSchema)
  .superRefine((questions, ctx) => {
    const ids = new Set<string>();
    for (const question of questions) {
      if (ids.has(question.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate question id ${question.id}`,
          path: [question.id],
        });
      }
      ids.add(question.id);
    }
  });

export type Question = z.infer<typeof questionSchema>;
export type QuestionList = z.infer<typeof questionListSchema>;
export type SingleChoiceQuestion = z.infer<typeof singleChoiceQuestionSchema>;
export type MultipleChoiceQuestion = z.infer<typeof multipleChoiceQuestionSchema>;
export type RankQuestion = z.infer<typeof rankQuestionSchema>;
export type TextQuestion = z.infer<typeof textQuestionSchema>;
