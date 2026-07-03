import { extractText, getDocumentProxy } from "unpdf";

export type RawChunk = {
  content: string;
  page: number;
  chunkIndex: number;
  tokenCount: number;
};

// Rough token estimate: ~4 characters per token is a good heuristic for English.
const CHARS_PER_TOKEN = 4;
const TARGET_TOKENS = 500;
const OVERLAP_TOKENS = 60;
const TARGET_CHARS = TARGET_TOKENS * CHARS_PER_TOKEN;
const OVERLAP_CHARS = OVERLAP_TOKENS * CHARS_PER_TOKEN;

const estimateTokens = (text: string) => Math.ceil(text.length / CHARS_PER_TOKEN);

/** Extracts text from a PDF, one string per page. */
export async function extractPages(bytes: Uint8Array): Promise<string[]> {
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: false });
  return Array.isArray(text) ? text : [text];
}

/**
 * Splits page text into overlapping, token-bounded chunks, keeping each chunk
 * tied to its source page so citations can point to an exact page later.
 */
export function chunkPages(pages: string[]): RawChunk[] {
  const chunks: RawChunk[] = [];
  let chunkIndex = 0;

  pages.forEach((raw, i) => {
    const page = i + 1;
    const text = raw.replace(/\s+/g, " ").trim();
    if (!text) return;

    for (const content of splitText(text)) {
      chunks.push({
        content,
        page,
        chunkIndex: chunkIndex++,
        tokenCount: estimateTokens(content),
      });
    }
  });

  return chunks;
}

/** Greedily packs sentences into ~TARGET_CHARS windows with a small overlap. */
function splitText(text: string): string[] {
  if (text.length <= TARGET_CHARS) return [text];

  const sentences = text.match(/[^.!?]+[.!?]+|\S+$/g) ?? [text];
  const out: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (current && current.length + sentence.length > TARGET_CHARS) {
      out.push(current.trim());
      const tail = current.slice(-OVERLAP_CHARS);
      current = tail + sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) out.push(current.trim());

  return out;
}
