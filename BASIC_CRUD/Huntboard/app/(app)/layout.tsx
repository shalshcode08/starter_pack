import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <span className="text-lg font-semibold tracking-tight text-slate-900">Huntboard</span>
            <nav className="flex items-center gap-3 text-sm font-medium text-slate-600 sm:gap-4">
              <Link href="/board" className="transition hover:text-slate-900">
                Board
              </Link>
              <Link href="/applications" className="transition hover:text-slate-900">
                Applications
              </Link>
              <Link href="/dashboard" className="transition hover:text-slate-900">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <span className="hidden max-w-[180px] truncate text-sm text-slate-600 md:block lg:max-w-[260px]">
              {session.user.name ?? session.user.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {session.user.isGuest && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-1 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-sm text-amber-800">
              You are exploring a demo. Data is temporary.
            </p>
            <Link
              href="/signup"
              className="shrink-0 text-sm font-medium text-amber-900 underline underline-offset-4"
            >
              Create an account to keep it
            </Link>
          </div>
        </div>
      )}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
