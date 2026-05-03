import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { questions } from "@/data/questions";

const QUESTION_BANK_PATH = resolve(__dirname, "../../../docs/QuestionBank.md");
const ID_PATTERN = /^## (Q\d{3})\b/gm;

function idsInMarkdown(): string[] {
  const text = readFileSync(QUESTION_BANK_PATH, "utf8");
  const ids: string[] = [];
  for (const match of text.matchAll(ID_PATTERN)) {
    ids.push(match[1]);
  }
  return ids;
}

describe("docs/QuestionBank.md ↔ src/data/questions.ts", () => {
  it("every Q### in the markdown also exists in the runtime bank", () => {
    const markdown = idsInMarkdown();
    const runtime = new Set(questions.map((q) => q.id));
    const missing = markdown.filter((id) => !runtime.has(id));
    expect(
      missing,
      `Documented but missing from runtime: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("every Q### in the runtime bank also exists in the markdown", () => {
    const markdownSet = new Set(idsInMarkdown());
    const missing = questions
      .map((q) => q.id)
      .filter((id) => !markdownSet.has(id));
    expect(
      missing,
      `Runtime but missing from QuestionBank.md: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("the markdown lists each question exactly once", () => {
    const ids = idsInMarkdown();
    const duplicates = ids.filter(
      (id, index, all) => all.indexOf(id) !== index,
    );
    expect(duplicates).toEqual([]);
  });
});
