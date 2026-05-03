// `astro:schema` re-exports the zod version Astro Actions ships with (currently
// v3). Using it here keeps the schema directly assignable to `defineAction`'s
// `input` parameter — the project's top-level `zod` dep is v4 and resolves to a
// different identity, which `defineAction`'s typings reject.
import { z } from "astro:schema";
import { formatFeedbackEmail } from "@/lib/feedback/format";

export const submitFeedbackInputSchema = z.object({
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

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackInputSchema>;

export type SubmitFeedbackErrorCode = "MISCONFIGURED" | "SEND_FAILED";

export class SubmitFeedbackError extends Error {
  constructor(public code: SubmitFeedbackErrorCode, message: string) {
    super(message);
    this.name = "SubmitFeedbackError";
  }
}

export interface SendEmailParams {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}

export type SendEmail = (params: SendEmailParams) => Promise<{
  error?: { message?: string } | null;
}>;

export interface SubmitFeedbackOptions {
  apiKey: string | undefined;
  to: string | undefined;
  from: string | undefined;
  send: SendEmail;
}

const GENERIC_SEND_FAILURE = "Send failed. Try the mailto fallback.";
const MISCONFIGURED_MESSAGE = "Feedback isn't wired up — try the mailto fallback.";

export async function submitFeedback(
  input: SubmitFeedbackInput,
  options: SubmitFeedbackOptions,
): Promise<{ ok: true }> {
  const { apiKey, to, from, send } = options;
  if (!apiKey || !to || !from) {
    throw new SubmitFeedbackError("MISCONFIGURED", MISCONFIGURED_MESSAGE);
  }

  const { subject, text, replyTo } = formatFeedbackEmail({
    message: input.message,
    email: input.email,
  });

  const { error } = await send({ from, to, replyTo, subject, text });
  if (error) {
    // Log the real error server-side; surface a generic message to the client.
    console.error("[submitFeedback] Resend send failed:", error.message ?? error);
    throw new SubmitFeedbackError("SEND_FAILED", GENERIC_SEND_FAILURE);
  }

  return { ok: true };
}
