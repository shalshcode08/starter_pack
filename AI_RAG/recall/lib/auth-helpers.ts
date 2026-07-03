import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Returns the authenticated user's session, redirecting to /login if absent.
 * Use in server components and route handlers as the single source of identity.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}
