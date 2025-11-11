import fs from "node:fs/promises";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import type { List, ListItem, Paragraph, Root } from "mdast";
import { questionListSchema, Question } from "../../data/question-schema";

type RawQuestion = {
  id: string;
  type?: string;
  prompt?: string;
  required?: boolean;
  tags?: string[];
  feedback?: Record<string, string>;
  specialRules?: string[];
  options?: string[];
  correctNumbers?: number[];
  acceptableAnswers?: string[];
  textComment?: string;
};

const QUESTION_BANK_PATH = path.resolve(process.cwd(), "docs/QuestionBank.md");

export async function loadQuestionsFromMarkdown(
  filePath = QUESTION_BANK_PATH,
): Promise<Question[]> {
  const markdown = await fs.readFile(filePath, "utf8");
  return parseQuestionMarkdown(markdown);
}

export function parseQuestionMarkdown(markdown: string): Question[] {
  const root = unified().use(remarkParse).parse(markdown) as Root;
  const questions: RawQuestion[] = [];

  for (let index = 0; index < root.children.length; index += 1) {
    const node = root.children[index];
    if (node.type !== "heading" || node.depth !== 2) continue;
    const id = toString(node).trim();
    const nextNode = root.children[index + 1];
    if (!nextNode || nextNode.type !== "list") {
      throw new Error(`Missing details list for question ${id}`);
    }

    const raw = parseQuestionList(id, nextNode);
    questions.push(raw);
  }

  return questionListSchema.parse(questions.map(normaliseQuestion));
}

function parseQuestionList(id: string, listNode: List): RawQuestion {
  const draft: RawQuestion = { id };

  for (const item of listNode.children) {
    const paragraph = item.children.find(
      (child): child is Paragraph => child.type === "paragraph",
    );
    if (!paragraph) continue;
    const rawText = toString(paragraph).trim();
    const { key, value } = splitKeyValue(rawText);

    switch (key) {
      case "type":
        draft.type = value.toLowerCase();
        break;
      case "prompt":
        draft.prompt = value;
        break;
      case "options":
        draft.options = extractOptions(item);
        break;
      case "correct":
        if (value.startsWith("[")) {
          const { cleaned, comment } = stripInlineComment(value);
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed)) {
            if (parsed.every((entry) => typeof entry === "number")) {
              draft.correctNumbers = parsed as number[];
            } else if (parsed.every((entry) => typeof entry === "string")) {
              draft.acceptableAnswers = parsed as string[];
            }
          }
          draft.textComment = comment ?? draft.textComment;
        }
        break;
      case "feedback":
        draft.feedback = extractFeedback(rawText);
        break;
      case "required":
        draft.required = value === "true";
        break;
      case "tags":
        draft.tags = value
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        break;
      case "special_rules":
        if (value.toLowerCase() !== "none") {
          draft.specialRules = splitSpecialRules(value);
        } else {
          draft.specialRules = [];
        }
        break;
      default:
        break;
    }
  }

  return draft;
}

function splitKeyValue(line: string): { key: string; value: string } {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) {
    return { key: line.trim(), value: "" };
  }
  const key = line.slice(0, colonIndex).replace(/^-/, "").trim();
  const value = line.slice(colonIndex + 1).trim();
  return { key, value };
}

function extractOptions(item: ListItem): string[] {
  const nestedList = item.children.find(
    (child): child is List => child.type === "list",
  );
  if (!nestedList) {
    const paragraph = item.children.find(
      (child): child is Paragraph => child.type === "paragraph",
    );
    const rawText = paragraph ? toString(paragraph) : "";
    const value = rawText.split(":")[1]?.trim();
    if (value?.startsWith("[") && value.endsWith("]")) {
      return JSON.parse(value);
    }
    return [];
  }

  return nestedList.children.map((child, idx) => {
    const raw = toString(child).trim();
    return raw.replace(/^\d+\.\s*/, "") || `Option ${idx + 1}`;
  });
}

function extractFeedback(text: string): Record<string, string> | undefined {
  const [, ...lines] = text.split("\n").map((line) => line.trim());
  if (!lines.length) return undefined;

  const feedback: Record<string, string> = {};
  let currentKey: string | null = null;
  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1].trim();
      feedback[currentKey] = match[2].trim();
    } else if (currentKey) {
      feedback[currentKey] = `${feedback[currentKey]} ${line}`.trim();
    }
  }
  return Object.keys(feedback).length ? feedback : undefined;
}

function splitSpecialRules(value: string): string[] {
  return value
    .split(/;|\./)
    .map((rule) => rule.trim())
    .filter(Boolean);
}

function stripInlineComment(value: string): { cleaned: string; comment?: string } {
  const [data, comment] = value.split("//").map((segment) => segment.trim());
  return { cleaned: data, comment };
}

function normaliseQuestion(raw: RawQuestion): Question {
  if (!raw.type) {
    throw new Error(`Question ${raw.id} is missing a type`);
  }
  if (!raw.prompt) {
    throw new Error(`Question ${raw.id} is missing a prompt`);
  }
  if (!raw.tags || raw.tags.length === 0) {
    throw new Error(`Question ${raw.id} requires at least one tag`);
  }

  const mergedSpecialRules = Array.from(
    new Set([...(raw.specialRules ?? []), ...(raw.textComment ? [raw.textComment] : [])]),
  );

  const common = {
    id: raw.id,
    prompt: raw.prompt,
    required: raw.required ?? true,
    tags: raw.tags,
    feedback: raw.feedback,
    specialRules: mergedSpecialRules,
  };

  switch (raw.type) {
    case "single":
      if (!raw.correctNumbers?.length) {
        throw new Error(`Question ${raw.id} missing correct answers`);
      }
      return {
        ...common,
        type: "single",
        options: buildOptions(raw),
        correct: raw.correctNumbers,
      };
    case "multiple":
      if (!raw.correctNumbers?.length) {
        throw new Error(`Question ${raw.id} missing correct answers`);
      }
      return {
        ...common,
        type: "multiple",
        options: buildOptions(raw),
        correct: raw.correctNumbers,
      };
    case "rank":
      if (!raw.correctNumbers?.length) {
        throw new Error(`Question ${raw.id} missing correct answers`);
      }
      return {
        ...common,
        type: "rank",
        options: buildOptions(raw),
        correct: raw.correctNumbers,
      };
    case "text":
      if (!raw.acceptableAnswers?.length) {
        throw new Error(`Text question ${raw.id} missing acceptable answers`);
      }
      const strategy =
        raw.textComment?.toLowerCase().includes("contain") ||
        raw.specialRules?.some((rule) => rule.toLowerCase().includes("contain"))
          ? "contains"
          : "exact";
      const fuzzyThreshold =
        raw.textComment?.toLowerCase().includes("typo") ||
        raw.specialRules?.some((rule) => rule.toLowerCase().includes("typo"))
          ? 0.85
          : undefined;
      return {
        ...common,
        type: "text",
        acceptableAnswers: raw.acceptableAnswers,
        textValidation: {
          strategy,
          normalizeCase: true,
          trimWhitespace: true,
          fuzzyThreshold,
        },
      };
    default:
      throw new Error(`Unknown question type ${raw.type} for ${raw.id}`);
  }
}

function buildOptions(raw: RawQuestion) {
  if (!raw.options?.length) {
    throw new Error(`Question ${raw.id} is missing options`);
  }
  return raw.options.map((label, index) => ({
    id: index + 1,
    label,
  }));
}
