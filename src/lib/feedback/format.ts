export interface FeedbackEmail {
  subject: string;
  text: string;
  replyTo?: string;
}

export interface FormatFeedbackInput {
  message: string;
  email?: string;
}

const MAX_PREVIEW = 60;

function previewLine(message: string): string {
  const oneLine = message.replace(/\s+/g, " ").trim();
  if (oneLine.length <= MAX_PREVIEW) return oneLine;
  return `${oneLine.slice(0, MAX_PREVIEW - 1)}…`;
}

export function formatFeedbackEmail({ message, email }: FormatFeedbackInput): FeedbackEmail {
  const trimmedEmail = email?.trim();
  const replyTo = trimmedEmail && trimmedEmail.length > 0 ? trimmedEmail : undefined;
  const sender = replyTo ?? "anonymous";
  const subject = `[ULITUK] Feedback — ${previewLine(message)}`;
  const text = [
    message.trim(),
    "",
    "---",
    `From: ${sender}`,
  ].join("\n");
  return { subject, text, replyTo };
}
