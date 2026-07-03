import { prisma } from "@/lib/db";
import type { MessageRole } from "@/app/generated/prisma/enums";

/** Returns the study set's conversation, creating it on first use. Null if not owned. */
export async function getOrCreateConversation(
  userId: string,
  studySetId: string,
) {
  const existing = await prisma.conversation.findFirst({
    where: { userId, studySetId },
  });
  if (existing) return existing;

  const studySet = await prisma.studySet.findFirst({
    where: { id: studySetId, userId },
    select: { title: true },
  });
  if (!studySet) return null;

  return prisma.conversation.create({
    data: { userId, studySetId, title: studySet.title },
  });
}

/** Full message history for a study set's conversation, with citation sources. */
export async function getConversation(userId: string, studySetId: string) {
  return prisma.conversation.findFirst({
    where: { userId, studySetId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          citations: {
            include: {
              chunk: {
                select: { page: true, document: { select: { title: true } } },
              },
            },
          },
        },
      },
    },
  });
}

export function addMessage(
  conversationId: string,
  role: MessageRole,
  content: string,
) {
  return prisma.message.create({ data: { conversationId, role, content } });
}

export async function addCitations(messageId: string, chunkIds: string[]) {
  if (chunkIds.length === 0) return;
  await prisma.citation.createMany({
    data: chunkIds.map((chunkId) => ({ messageId, chunkId })),
  });
}
