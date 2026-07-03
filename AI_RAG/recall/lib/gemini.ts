import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const EMBED_MODEL = "gemini-embedding-001";
export const EMBED_DIMS = 768;
export const GEN_MODEL = "gemini-flash-lite-latest";

type TaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

/** L2-normalize so cosine and dot product agree; recommended for sub-3072 dims. */
function normalize(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
  return norm === 0 ? v : v.map((x) => x / norm);
}

/** Embeds one or more texts, returning a unit-length 768-dim vector for each. */
export async function embed(
  texts: string[],
  taskType: TaskType,
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const res = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: texts,
    config: { outputDimensionality: EMBED_DIMS, taskType },
  });

  const embeddings = res.embeddings ?? [];
  if (embeddings.length !== texts.length) {
    throw new Error(
      `Gemini returned ${embeddings.length} embeddings for ${texts.length} inputs`,
    );
  }

  return embeddings.map((e) => normalize(e.values ?? []));
}

/** Formats a numeric vector as a pgvector literal, e.g. "[0.1,0.2,...]". */
export function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

/** Streams a grounded answer token by token, given a system instruction and prompt. */
export async function* streamAnswer(
  system: string,
  prompt: string,
): AsyncGenerator<string> {
  const stream = await ai.models.generateContentStream({
    model: GEN_MODEL,
    contents: prompt,
    config: { systemInstruction: system, temperature: 0.2 },
  });

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) yield text;
  }
}
