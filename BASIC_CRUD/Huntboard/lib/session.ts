import { redirect } from "next/navigation";

import { auth } from "@/auth";

/**
 * Returns the authenticated user or redirects to /login.
 * Use this in every protected server component and action so no
 * query can run without a user to scope it to.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user;
}
