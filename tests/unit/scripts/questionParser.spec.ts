import { describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { parseQuestionMarkdown } from "../../../scripts/lib/questionParser";

describe("question parser", () => {
  it("converts the markdown bank into typed questions", async () => {
    const markdown = await fs.readFile(
      path.resolve("docs/QuestionBank.md"),
      "utf8",
    );
    const questions = parseQuestionMarkdown(markdown);

    expect(questions).toHaveLength(24);
    const first = questions[0];
    expect(first.id).toBe("Q001");
    expect(first.type).toBe("rank");
    if (first.type !== "rank") {
      throw new Error("First question should be rank");
    }
    expect(first.options).toHaveLength(5);

    const textQuestion = questions.find((question) => question.type === "text");
    expect(textQuestion?.acceptableAnswers).toEqual(["sorted"]);
    if (textQuestion?.type !== "text") throw new Error("Expected text question");
    expect(textQuestion.textValidation.strategy).toBe("exact");
    expect(textQuestion.textValidation.fuzzyThreshold).toBeCloseTo(0.85);
  });
});
