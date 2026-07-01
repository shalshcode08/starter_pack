import Link from "next/link";

import { auth } from "@/auth";
import { GuestButton } from "@/components/guest-button";

const features = [
  {
    title: "Pipeline board",
    body: "Drag applications across Wishlist, Applied, OA, Interview, Offer, and Rejected.",
  },
  {
    title: "Event timeline",
    body: "Log every step of each application and keep the full history in one place.",
  },
  {
    title: "Insight dashboard",
    body: "See your response rate, stage conversion, and activity over time at a glance.",
  },
];

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <main className="flex flex-1 flex-col bg-white">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight text-slate-900">Huntboard</span>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {isLoggedIn ? (
            <Link href="/board" className="text-slate-700 hover:text-slate-900">
              Go to board
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-slate-700 hover:text-slate-900">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-white transition hover:bg-slate-800"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Run your job search like a pipeline.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate-600">
          Track every application through its stages, keep a timeline of what happened, and see what
          is actually working.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <GuestButton
            className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            label="Try the live demo"
          />
          {!isLoggedIn && (
            <Link
              href="/signup"
              className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Create an account
            </Link>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-400">The demo loads a sample board instantly. No signup needed.</p>
      </section>

      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-6 py-14 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title}>
              <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
