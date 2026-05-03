import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";
import { formatFeedbackEmail } from "@/lib/feedback/format";

const inputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, { message: "Tell us a bit more — at least 10 characters." })
    .max(2000, { message: "Cap that at 2000 characters." }),
  email: z
    .string()
    .max(200)
    .optional()
    .transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined))
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      { message: "That doesn't look like a valid email." },
    ),
  // Honeypot — bots tend to fill every input. Real users leave it empty.
  hp: z.string().max(0).optional(),
});

export const server = {
  submitFeedback: defineAction({
    accept: "form",
    input: inputSchema,
    handler: async (input) => {
      const apiKey = import.meta.env.RESEND_API_KEY;
      const to = import.meta.env.FEEDBACK_TO_EMAIL;
      if (!apiKey || !to) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Feedback isn't wired up — try the mailto fallback.",
        });
      }

      const { subject, text, replyTo } = formatFeedbackEmail({
        message: input.message,
        email: input.email,
      });

      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: "feedback@unofficiallifeinthe.uk",
        to,
        replyTo,
        subject,
        text,
      });

      if (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message ?? "Send failed. Try the mailto fallback.",
        });
      }

      return { ok: true as const };
    },
  }),
};
