import { describe, expect, it } from "vitest";
import { formatFeedbackEmail } from "@/lib/feedback/format";

describe("formatFeedbackEmail", () => {
  it("uses 'anonymous' when the email is missing or empty", () => {
    const a = formatFeedbackEmail({ message: "Loving the quiz." });
    const b = formatFeedbackEmail({ message: "Loving the quiz.", email: "" });
    const c = formatFeedbackEmail({ message: "Loving the quiz.", email: "   " });
    for (const result of [a, b, c]) {
      expect(result.replyTo).toBeUndefined();
      expect(result.text).toContain("From: anonymous");
    }
  });

  it("trims and uses the provided email as replyTo", () => {
    const result = formatFeedbackEmail({
      message: "Add a question about scones.",
      email: "  user@example.com  ",
    });
    expect(result.replyTo).toBe("user@example.com");
    expect(result.text).toContain("From: user@example.com");
  });

  it("compresses long messages into the subject preview", () => {
    const long = "x".repeat(200);
    const result = formatFeedbackEmail({ message: long });
    expect(result.subject.length).toBeLessThanOrEqual(85);
    expect(result.subject.endsWith("…")).toBe(true);
  });

  it("includes the full message body", () => {
    const result = formatFeedbackEmail({ message: "Why no question about Greggs?" });
    expect(result.text).toContain("Why no question about Greggs?");
  });
});
