import { prisma } from "@/lib/prisma";
import type { ApplicationStatus } from "@/lib/constants/application";

export function listApplications(userId: string, status?: ApplicationStatus) {
  return prisma.application.findMany({
    where: { userId, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
  });
}

export function getApplication(userId: string, id: string) {
  return prisma.application.findFirst({
    where: { id, userId },
  });
}

export function getApplicationDetail(userId: string, id: string) {
  return prisma.application.findFirst({
    where: { id, userId },
    include: {
      events: { orderBy: { createdAt: "desc" } },
    },
  });
}
