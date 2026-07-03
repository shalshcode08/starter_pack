import { prisma } from "@/lib/db";

export type RetrievedChunk = {
  id: string;
  content: string;
  page: number;
  documentTitle: string;
  distance: number;
};

/**
 * Nearest chunks to a query vector, scoped strictly to the user AND study set.
 * Cosine distance (<=>) ascending; only embedded chunks are considered.
 */
export function retrieveChunks(
  userId: string,
  studySetId: string,
  queryLiteral: string,
  k: number,
) {
  return prisma.$queryRawUnsafe<RetrievedChunk[]>(
    `SELECT c.id, c.content, c.page, d.title AS "documentTitle",
            (c.embedding <=> $1::vector) AS distance
     FROM "Chunk" c
     JOIN "Document" d ON d.id = c."documentId"
     JOIN "StudySet" s ON s.id = d."studySetId"
     WHERE s."userId" = $2 AND s.id = $3 AND c.embedding IS NOT NULL
     ORDER BY c.embedding <=> $1::vector
     LIMIT $4`,
    queryLiteral,
    userId,
    studySetId,
    k,
  );
}
