import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import { listStudySets } from "@/lib/data/study-sets";
import { AppHeader } from "@/app/_components/app-header";
import { CreateStudySet } from "./_components/create-study-set";

export default async function DashboardPage() {
  const user = await requireUser();
  const studySets = await listStudySets(user.id);

  return (
    <>
      <AppHeader email={user.email} isGuest={user.isGuest} />
      <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your study sets
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Group your documents by subject or topic, then ask questions grounded
          in your own material.
        </p>

        <div className="mt-6">
          <CreateStudySet />
        </div>

        {studySets.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No study sets yet. Create your first one above to get started.
            </p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {studySets.map((set) => (
              <li key={set.id}>
                <Link
                  href={`/study-sets/${set.id}`}
                  className="block rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                >
                  <h2 className="break-words font-medium text-zinc-900 dark:text-zinc-50">
                    {set.title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {set._count.documents}{" "}
                    {set._count.documents === 1 ? "document" : "documents"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
