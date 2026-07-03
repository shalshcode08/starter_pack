import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";

// The template account holds the seeded sample material. Guests get an isolated
// clone of it, so no two guests ever share or mutate the same data.
export const DEMO_TEMPLATE_EMAIL = "demo-template@recall.internal";

/**
 * Creates a fresh, isolated guest user by cloning the demo template's study
 * sets, documents, and chunks (embeddings copied directly via SQL - no
 * re-embedding). Returns null if the template has not been seeded.
 */
export async function createGuestUser() {
  const template = await prisma.user.findUnique({
    where: { email: DEMO_TEMPLATE_EMAIL },
    include: { studySets: { include: { documents: true } } },
  });
  if (!template) return null;

  const guest = await prisma.user.create({
    data: {
      email: `guest-${randomUUID()}@recall.guest`,
      name: "Guest",
      isGuest: true,
    },
  });

  for (const set of template.studySets) {
    const clonedSet = await prisma.studySet.create({
      data: { userId: guest.id, title: set.title },
    });

    for (const doc of set.documents) {
      const clonedDoc = await prisma.document.create({
        data: {
          studySetId: clonedSet.id,
          title: doc.title,
          filename: doc.filename,
          status: doc.status,
        },
      });

      // Copy chunks including their vector embeddings. Prisma cannot express the
      // vector column, so this is a raw INSERT ... SELECT.
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Chunk" (id, "documentId", content, embedding, page, "chunkIndex", "tokenCount")
         SELECT gen_random_uuid()::text, $1, content, embedding, page, "chunkIndex", "tokenCount"
         FROM "Chunk" WHERE "documentId" = $2`,
        clonedDoc.id,
        doc.id,
      );
    }
  }

  return guest;
}

/** Deletes guest users older than the given age. For scheduled cleanup. */
export async function deleteStaleGuests(olderThanHours = 24) {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
  const { count } = await prisma.user.deleteMany({
    where: { isGuest: true, createdAt: { lt: cutoff } },
  });
  return count;
}
