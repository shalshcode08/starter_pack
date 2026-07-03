import type { RetrievedChunk } from "@/lib/data/retrieval";

// How many chunks to retrieve, and the maximum cosine distance we still trust.
// The distance guard is coarse (Gemini's space is compressed): beyond it we
// refuse outright; within it, the model is the fine judge and emits
// "SOURCES: none" when the passages do not actually answer the question.
export const RETRIEVE_K = 6;
export const MAX_DISTANCE = 0.6;

export const REFUSAL =
  "I couldn't find anything about that in this study set's material. Try rephrasing your question, or upload notes that cover it.";

export const SYSTEM_PROMPT = `You are Recall, a study assistant that answers strictly from a student's own uploaded notes.

Rules:
- Answer ONLY using the numbered sources provided. Never use outside knowledge.
- If the sources do not contain enough information to answer, say so plainly and briefly. Do not guess.
- Be clear and concise. Use the student's material faithfully.
- On the final line, list the source numbers you actually used, in this exact format: SOURCES: 1, 3
- If you could not answer from the sources, the final line must be: SOURCES: none`;

export function buildPrompt(question: string, sources: RetrievedChunk[]): string {
  const context = sources
    .map(
      (s, i) =>
        `[${i + 1}] (from "${s.documentTitle}", page ${s.page})\n${s.content}`,
    )
    .join("\n\n");

  return `Question: ${question}\n\nSources:\n${context}`;
}

/**
 * Splits a model response into the display text and the source numbers it used.
 * Strips the trailing "SOURCES: ..." line so the user never sees it.
 */
export function parseAnswer(raw: string): {
  display: string;
  usedIndices: number[];
} {
  const match = raw.match(/^\s*SOURCES:\s*(.*)$/im);
  if (!match) return { display: raw.trim(), usedIndices: [] };

  const display = raw.slice(0, match.index).trim();
  const list = match[1].trim();
  if (/^none$/i.test(list)) return { display, usedIndices: [] };

  const usedIndices = [
    ...new Set(
      list
        .split(/[,\s]+/)
        .map((n) => parseInt(n, 10))
        .filter((n) => Number.isInteger(n) && n > 0),
    ),
  ];
  return { display, usedIndices };
}
