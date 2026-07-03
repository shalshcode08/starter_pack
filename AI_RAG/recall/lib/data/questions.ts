import { prisma } from "@/lib/db";
import type { QuestionType } from "@/app/generated/prisma/enums";

export type GenerationChunk = {
  id: string;
  content: string;
  page: number;
  documentTitle: string;
};

/** Chunks from a study set's ready documents, used as source material for generation. */
export function getChunksForGeneration(
  userId: string,
  studySetId: string,
  limit: number,
) {
  return prisma.$queryRawUnsafe<GenerationChunk[]>(
    `SELECT c.id, c.content, c.page, d.title AS "documentTitle"
     FROM "Chunk" c
     JOIN "Document" d ON d.id = c."documentId"
     JOIN "StudySet" s ON s.id = d."studySetId"
     WHERE s."userId" = $1 AND s.id = $2 AND d.status = 'ready'
     ORDER BY d."createdAt" ASC, c."chunkIndex" ASC
     LIMIT $3`,
    userId,
    studySetId,
    limit,
  );
}

/** Replaces all questions of a given type for a study set with a fresh set. */
export async function replaceQuestions(
  studySetId: string,
  type: QuestionType,
  items: { prompt: string; answer: string; sourceChunkId: string }[],
) {
  await prisma.$transaction([
    prisma.question.deleteMany({ where: { studySetId, type } }),
    prisma.question.createMany({
      data: items.map((i) => ({
        studySetId,
        type,
        prompt: i.prompt,
        answer: i.answer,
        sourceChunkId: i.sourceChunkId,
      })),
    }),
  ]);
}

export function listQuestions(userId: string, studySetId: string) {
  return prisma.question.findMany({
    where: { studySetId, studySet: { userId } },
    orderBy: { id: "asc" },
    include: {
      sourceChunk: {
        select: { page: true, document: { select: { title: true } } },
      },
    },
  });
}
