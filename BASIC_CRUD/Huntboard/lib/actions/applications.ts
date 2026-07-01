"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/constants/application";
import { applicationSchema } from "@/lib/validations/application";

export type FormState = { error: string } | undefined;

function parse(formData: FormData) {
  return applicationSchema.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    status: formData.get("status"),
    jobUrl: formData.get("jobUrl"),
    location: formData.get("location"),
    salaryRange: formData.get("salaryRange"),
    source: formData.get("source"),
    appliedAt: formData.get("appliedAt"),
  });
}

export async function createApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  await prisma.application.create({
    data: { ...parsed.data, userId: user.id },
  });

  revalidatePath("/applications");
  redirect("/applications");
}

export async function updateApplication(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  // Scoping by userId means a mismatched owner updates zero rows.
  const result = await prisma.application.updateMany({
    where: { id, userId: user.id },
    data: parsed.data,
  });

  if (result.count === 0) {
    return { error: "Application not found" };
  }

  revalidatePath("/applications");
  redirect("/applications");
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const user = await requireUser();

  if (!APPLICATION_STATUSES.includes(status)) {
    return;
  }

  await prisma.application.updateMany({
    where: { id, userId: user.id },
    data: { status },
  });

  revalidatePath("/board");
  revalidatePath("/applications");
}

export async function deleteApplication(id: string) {
  const user = await requireUser();

  await prisma.application.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/applications");
  redirect("/applications");
}
