import { ActionError, defineAction } from "astro:actions";
import { Resend } from "resend";
import {
  submitFeedback,
  submitFeedbackInputSchema,
  SubmitFeedbackError,
  type SendEmail,
} from "./submit-feedback";

const DEFAULT_FROM_EMAIL = "feedback@unofficiallifeinthe.uk";

export const server = {
  submitFeedback: defineAction({
    accept: "form",
    input: submitFeedbackInputSchema,
    handler: async (input) => {
      const apiKey = import.meta.env.RESEND_API_KEY as string | undefined;
      const to = import.meta.env.FEEDBACK_TO_EMAIL as string | undefined;
      const from =
        (import.meta.env.FEEDBACK_FROM_EMAIL as string | undefined) ?? DEFAULT_FROM_EMAIL;

      const send: SendEmail = async (params) => {
        const resend = new Resend(apiKey ?? "");
        const { error } = await resend.emails.send(params);
        return { error };
      };

      try {
        return await submitFeedback(input, { apiKey, to, from, send });
      } catch (err) {
        if (err instanceof SubmitFeedbackError) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: err.message,
          });
        }
        throw err;
      }
    },
  }),
};
