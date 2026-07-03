"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { studySetTitleSchema } from "@/lib/validation";
import {
  createStudySet,
  renameStudySet,
  deleteStudySet,
} from "@/lib/data/study-sets";

export type ActionState = { error?: string } | undefined;

export async function createStudySetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = studySetTitleSchema.safeParse(formData.get("title"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid title" };
  }

  const set = await createStudySet(user.id, parsed.data);
  revalidatePath("/dashboard");
  redirect(`/study-sets/${set.id}`);
}

export async function renameStudySetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id"));

  const parsed = studySetTitleSchema.safeParse(formData.get("title"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid title" };
  }

  const { count } = await renameStudySet(user.id, id, parsed.data);
  if (count === 0) return { error: "Study set not found" };

  revalidatePath("/dashboard");
  revalidatePath(`/study-sets/${id}`);
  return undefined;
}

export async function deleteStudySetAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id"));

  await deleteStudySet(user.id, id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
