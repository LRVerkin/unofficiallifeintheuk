import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  submitFeedback,
  submitFeedbackInputSchema,
  SubmitFeedbackError,
  type SendEmail,
} from "@/actions/submit-feedback";

describe("submitFeedbackInputSchema", () => {
  const validBase = { message: "Some sufficiently long feedback." };

  it("accepts a message that is exactly 10 chars after trimming", () => {
    const result = submitFeedbackInputSchema.safeParse({ message: "  1234567890  " });
    expect(result.success).toBe(true);
    expect(result.data?.message).toBe("1234567890");
  });

  it("rejects messages shorter than 10 chars", () => {
    const result = submitFeedbackInputSchema.safeParse({ message: "too short" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/at least 10/);
  });

  it("rejects messages longer than 2000 chars", () => {
    const result = submitFeedbackInputSchema.safeParse({ message: "x".repeat(2001) });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/2000/);
  });

  it("rejects an invalid email", () => {
    const result = submitFeedbackInputSchema.safeParse({
      ...validBase,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/valid email/);
  });

  it("treats whitespace-only email as undefined", () => {
    const result = submitFeedbackInputSchema.safeParse({ ...validBase, email: "   " });
    expect(result.success).toBe(true);
    expect(result.data?.email).toBeUndefined();
  });

  it("trips the honeypot when `hp` is non-empty", () => {
    const result = submitFeedbackInputSchema.safeParse({ ...validBase, hp: "bot" });
    expect(result.success).toBe(false);
  });

  it("accepts an empty honeypot", () => {
    const result = submitFeedbackInputSchema.safeParse({ ...validBase, hp: "" });
    expect(result.success).toBe(true);
  });
});

describe("submitFeedback handler", () => {
  const validInput = {
    message: "A message long enough to clear the floor.",
    email: undefined,
  };
  const validEnv = {
    apiKey: "re_fake_key",
    to: "feedback@example.com",
    from: "noreply@example.com",
  };

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  function makeSend(error: { message?: string } | null = null): SendEmail {
    return vi.fn(async () => ({ error })) as SendEmail;
  }

  it("throws MISCONFIGURED when apiKey is missing", async () => {
    const send = makeSend();
    await expect(
      submitFeedback(validInput, { ...validEnv, apiKey: undefined, send }),
    ).rejects.toMatchObject({
      name: "SubmitFeedbackError",
      code: "MISCONFIGURED",
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("throws MISCONFIGURED when `to` is missing", async () => {
    await expect(
      submitFeedback(validInput, { ...validEnv, to: undefined, send: makeSend() }),
    ).rejects.toBeInstanceOf(SubmitFeedbackError);
  });

  it("throws MISCONFIGURED when `from` is missing", async () => {
    await expect(
      submitFeedback(validInput, { ...validEnv, from: undefined, send: makeSend() }),
    ).rejects.toBeInstanceOf(SubmitFeedbackError);
  });

  it("returns ok and forwards the formatted email when send succeeds", async () => {
    const send = makeSend();
    const result = await submitFeedback(
      { message: "Loved the quiz, here's a suggestion.", email: "user@example.com" },
      { ...validEnv, send },
    );
    expect(result).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    const call = (send as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.from).toBe(validEnv.from);
    expect(call.to).toBe(validEnv.to);
    expect(call.replyTo).toBe("user@example.com");
    expect(call.subject).toMatch(/^\[ULITUK\] Feedback/);
    expect(call.text).toContain("Loved the quiz");
  });

  it("omits replyTo when the user provides no email", async () => {
    const send = makeSend();
    await submitFeedback(validInput, { ...validEnv, send });
    const call = (send as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.replyTo).toBeUndefined();
  });

  it("throws SEND_FAILED with a generic message and logs the real error on Resend failure", async () => {
    const send = makeSend({ message: "Resend internal: rate limit at /api/foo" });
    await expect(
      submitFeedback(validInput, { ...validEnv, send }),
    ).rejects.toMatchObject({
      code: "SEND_FAILED",
      message: "Send failed. Try the mailto fallback.",
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[submitFeedback] Resend send failed:",
      "Resend internal: rate limit at /api/foo",
    );
  });
});
