import { prisma } from "@/lib/db";

/**
 * Data-access layer for study sets. Every function takes the owner's userId and
 * scopes on it, so a caller can never read or mutate another user's data.
 */

export function listStudySets(userId: string) {
  return prisma.studySet.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { documents: true } } },
  });
}

export function getStudySet(userId: string, id: string) {
  return prisma.studySet.findFirst({
    where: { id, userId },
    include: {
      documents: { orderBy: { createdAt: "desc" } },
      _count: { select: { documents: true, questions: true } },
    },
  });
}

export function createStudySet(userId: string, title: string) {
  return prisma.studySet.create({ data: { userId, title } });
}

/** Updates scoped by userId; count of 0 means "not yours / not found". */
export function renameStudySet(userId: string, id: string, title: string) {
  return prisma.studySet.updateMany({ where: { id, userId }, data: { title } });
}

export function deleteStudySet(userId: string, id: string) {
  return prisma.studySet.deleteMany({ where: { id, userId } });
}
