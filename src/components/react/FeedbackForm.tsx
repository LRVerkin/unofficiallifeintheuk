import { useState } from "react";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { Card } from "./Card";
import { TextAnswer } from "./TextAnswer";

export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string };

export type FeedbackSubmitter = (formData: FormData) => Promise<SubmitResult>;

const MAILTO_FALLBACK = "mailto:feedback@unofficiallifeinthe.uk";
const MIN_LENGTH = 10;
const MAX_LENGTH = 2000;

interface FeedbackFormProps {
  /** Test seam — pass a stub to bypass the Astro Actions runtime. */
  submitter?: FeedbackSubmitter;
}

const defaultSubmitter: FeedbackSubmitter = async (formData) => {
  // Lazy-import so test runs (which never reach this branch) don't try to load
  // the Astro virtual module.
  const { actions } = await import("astro:actions");
  const { data, error } = await actions.submitFeedback(formData);
  if (error) {
    return { ok: false, message: error.message ?? "Submission failed." };
  }
  return data?.ok ? { ok: true } : { ok: false, message: "Submission failed." };
};

export function FeedbackForm({ submitter = defaultSubmitter }: FeedbackFormProps = {}) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const trimmedLength = message.trim().length;
  const tooShort = trimmedLength > 0 && trimmedLength < MIN_LENGTH;
  const canSubmit = trimmedLength >= MIN_LENGTH && status !== "submitting";

  type FormSubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

  async function onSubmit(event: FormSubmitEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await submitter(formData);
    if (result.ok) {
      setStatus("success");
      setMessage("");
      setEmail("");
      trackEvent({
        name: "feedback_submit",
        payload: { hasEmail: email.trim().length > 0 },
      });
    } else {
      setStatus("error");
      setError(result.message);
    }
  }

  return (
    <Card aria-label="Feedback form">
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <TextAnswer
          label="Your feedback or new question idea"
          name="message"
          value={message}
          onChange={setMessage}
          hint={`At least ${MIN_LENGTH} characters; up to ${MAX_LENGTH}.`}
          error={tooShort ? `Add a bit more — ${MIN_LENGTH - trimmedLength} more character(s).` : undefined}
          maxLength={MAX_LENGTH}
        />
        <TextAnswer
          label="Email (optional)"
          name="email"
          value={email}
          onChange={setEmail}
          hint="Only used so we can reply if you want one — discarded after that."
          maxLength={200}
        />
        <input
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          defaultValue=""
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={!canSubmit}>
            {status === "submitting" ? "Sending…" : "Send feedback"}
          </Button>
          <a
            href={MAILTO_FALLBACK}
            className="text-sm text-brand-secondary underline-offset-2 hover:underline"
          >
            Or just email us
          </a>
        </div>

        {status === "success" && (
          <Alert severity="success">
            Got it, thanks. We&apos;ll read every one.
          </Alert>
        )}

        {status === "error" && error && (
          <Alert severity="error">
            {error} <a className="underline" href={MAILTO_FALLBACK}>Email instead?</a>
          </Alert>
        )}
      </form>
    </Card>
  );
}
