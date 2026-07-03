import { prisma } from "@/lib/db";
import type { DocumentStatus } from "@/app/generated/prisma/enums";
import type { RawChunk } from "@/lib/ingest/chunk";

/**
 * Creates a Document (status: processing) with all its chunks inserted but not
 * yet embedded. Returns null if the study set is not owned by the user.
 */
export async function createDocumentWithChunks(
  userId: string,
  studySetId: string,
  meta: { title: string; filename: string },
  chunks: RawChunk[],
) {
  const owns = await prisma.studySet.findFirst({
    where: { id: studySetId, userId },
    select: { id: true },
  });
  if (!owns) return null;

  return prisma.document.create({
    data: {
      studySetId,
      title: meta.title,
      filename: meta.filename,
      status: "processing",
      chunks: {
        createMany: {
          data: chunks.map((c) => ({
            content: c.content,
            page: c.page,
            chunkIndex: c.chunkIndex,
            tokenCount: c.tokenCount,
          })),
        },
      },
    },
  });
}

/** Fetches a document only if it belongs to the given user (via its study set). */
export function getOwnedDocument(userId: string, documentId: string) {
  return prisma.document.findFirst({
    where: { id: documentId, studySet: { userId } },
  });
}

/** Chunks still awaiting an embedding, oldest first. Raw SQL: embedding is Unsupported. */
export function getUnembeddedChunks(documentId: string, limit: number) {
  return prisma.$queryRaw<{ id: string; content: string }[]>`
    SELECT id, content
    FROM "Chunk"
    WHERE "documentId" = ${documentId} AND embedding IS NULL
    ORDER BY "chunkIndex" ASC
    LIMIT ${limit}
  `;
}

/** Writes embeddings for a batch of chunks. Each literal is a pgvector string. */
export async function setChunkEmbeddings(
  rows: { id: string; literal: string }[],
) {
  await prisma.$transaction(
    rows.map(
      (r) =>
        prisma.$executeRaw`UPDATE "Chunk" SET embedding = ${r.literal}::vector WHERE id = ${r.id}`,
    ),
  );
}

export async function countUnembeddedChunks(documentId: string) {
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM "Chunk"
    WHERE "documentId" = ${documentId} AND embedding IS NULL
  `;
  return rows[0]?.count ?? 0;
}

export async function setDocumentStatus(
  documentId: string,
  status: DocumentStatus,
) {
  await prisma.document.update({ where: { id: documentId }, data: { status } });
}
