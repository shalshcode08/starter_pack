import { Type, type Schema } from "@google/genai";
import { generateJson } from "@/lib/gemini";
import type { GenerationChunk } from "@/lib/data/questions";
import type { QuestionType } from "@/app/generated/prisma/enums";

export const GENERATION_CHUNK_LIMIT = 24;
export const ITEMS_PER_TYPE = 8;

type GeneratedItem = { sourceIndex: number; prompt: string; answer: string };

const itemsSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      sourceIndex: { type: Type.INTEGER },
      prompt: { type: Type.STRING },
      answer: { type: Type.STRING },
    },
    required: ["sourceIndex", "prompt", "answer"],
  },
};

function systemPrompt(type: QuestionType): string {
  const shape =
    type === "quiz"
      ? "Each item is a quiz question: `prompt` is a clear question, `answer` is the correct, concise answer."
      : "Each item is a flashcard: `prompt` is a key term or concept, `answer` is its definition or explanation.";

  return `You are Recall, a study assistant. Generate exactly ${ITEMS_PER_TYPE} study items from the numbered sources.

${shape}

Rules:
- Use ONLY the information in the provided sources. Do not invent facts.
- Each item must be answerable from a SINGLE source; set "sourceIndex" to that source's number.
- Prefer the most important, testable ideas. Avoid trivial or duplicate items.`;
}

function buildPrompt(chunks: GenerationChunk[]): string {
  const sources = chunks
    .map((c, i) => `[${i + 1}] (from "${c.documentTitle}", page ${c.page})\n${c.content}`)
    .join("\n\n");
  return `Sources:\n${sources}`;
}

/** Generates study items and maps each back to the chunk it came from. */
export async function generateQuestionItems(
  chunks: GenerationChunk[],
  type: QuestionType,
): Promise<{ prompt: string; answer: string; sourceChunkId: string }[]> {
  const raw = await generateJson<GeneratedItem[]>(
    systemPrompt(type),
    buildPrompt(chunks),
    itemsSchema,
  );

  return raw
    .map((item) => {
      const chunk = chunks[item.sourceIndex - 1];
      if (!chunk || !item.prompt?.trim() || !item.answer?.trim()) return null;
      return {
        prompt: item.prompt.trim(),
        answer: item.answer.trim(),
        sourceChunkId: chunk.id,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}
