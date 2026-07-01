"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { eventSchema } from "@/lib/validations/event";

export type FormState = { error: string } | undefined;

export async function addEvent(
  applicationId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const parsed = eventSchema.safeParse({
    type: formData.get("type"),
    notes: formData.get("notes"),
    scheduledAt: formData.get("scheduledAt"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid event" };
  }

  // Confirm the application belongs to this user before adding to it.
  const owned = await prisma.application.findFirst({
    where: { id: applicationId, userId: user.id },
    select: { id: true },
  });
  if (!owned) {
    return { error: "Application not found" };
  }

  await prisma.event.create({
    data: { ...parsed.data, applicationId },
  });

  revalidatePath(`/applications/${applicationId}`);
}

export async function deleteEvent(eventId: string, applicationId: string) {
  const user = await requireUser();

  // Relation filter: only delete if the event's application is owned by the user.
  await prisma.event.deleteMany({
    where: { id: eventId, application: { userId: user.id } },
  });

  revalidatePath(`/applications/${applicationId}`);
}
