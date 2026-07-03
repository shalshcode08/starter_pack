import Link from "next/link";
import { signOut } from "@/auth";

export function AppHeader({
  email,
  isGuest,
}: {
  email?: string | null;
  isGuest?: boolean;
}) {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Recall
          </Link>
          {isGuest && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
              Guest mode
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {email && !isGuest && (
            <span className="hidden text-sm text-zinc-500 sm:inline dark:text-zinc-400">
              {email}
            </span>
          )}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
