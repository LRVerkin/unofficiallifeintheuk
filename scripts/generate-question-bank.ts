#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { loadQuestionsFromMarkdown } from "./lib/questionParser";

const OUTPUT_PATH = path.resolve(process.cwd(), "data/questions.ts");

async function main() {
  const questions = await loadQuestionsFromMarkdown();

  const banner = `/**
 * THIS FILE IS AUTO-GENERATED.
 * Run \`pnpm generate:questions\` after editing docs/QuestionBank.md.
 */`;

  const payload = `${banner}
import type { Question } from "./question-schema";

export const questions: Question[] = ${JSON.stringify(questions, null, 2)} as const;
`;

  const formatted = await prettier.format(payload, { parser: "typescript" });
  await fs.writeFile(OUTPUT_PATH, formatted, "utf8");
  console.log(`question bank updated → ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

main().catch((error) => {
  console.error("Failed to generate question bank");
  console.error(error);
  process.exit(1);
});
