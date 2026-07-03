"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-helpers";
import {
  getChunksForGeneration,
  replaceQuestions,
} from "@/lib/data/questions";
import {
  generateQuestionItems,
  GENERATION_CHUNK_LIMIT,
} from "@/lib/rag/questions";
import type { QuestionType } from "@/app/generated/prisma/enums";

export type GenerateState = { error?: string; ok?: boolean } | undefined;

export async function generateQuestionsAction(
  type: QuestionType,
  studySetId: string,
): Promise<GenerateState> {
  const user = await requireUser();

  const chunks = await getChunksForGeneration(
    user.id,
    studySetId,
    GENERATION_CHUNK_LIMIT,
  );
  if (chunks.length === 0) {
    return { error: "Upload and process a document first." };
  }

  try {
    const items = await generateQuestionItems(chunks, type);
    if (items.length === 0) {
      return { error: "Could not generate items from this material." };
    }
    await replaceQuestions(studySetId, type, items);
  } catch {
    return { error: "Generation failed. Please try again." };
  }

  revalidatePath(`/study-sets/${studySetId}`);
  return { ok: true };
}
