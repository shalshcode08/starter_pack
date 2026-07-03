import Link from "next/link";
import { GuestButton } from "@/app/(auth)/_components/guest-button";

const features = [
  {
    title: "Ask from your notes",
    body: "Recall retrieves the closest passages from your uploaded PDFs, streams an answer, and shows the document and page behind it.",
  },
  {
    title: "Study tools with receipts",
    body: "Quiz questions and flashcards are generated from ready passages, with every item linked back to its source chunk.",
  },
  {
    title: "Private by design",
    body: "Study sets, documents, conversations, citations, and vector searches are all scoped to the signed-in user.",
  },
];

export default function Home() {
  return (
    <main className="min-h-full bg-[#f7f3ea] text-stone-950 dark:bg-[#10100e] dark:text-stone-50">
      <section className="relative overflow-hidden border-b border-stone-300/70 dark:border-stone-800">
        <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]">
          <div className="h-full w-full bg-[linear-gradient(90deg,rgba(28,25,23,0.12)_1px,transparent_1px),linear-gradient(rgba(28,25,23,0.12)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        <div className="relative mx-auto min-h-[92vh] w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-stone-950 dark:text-stone-50"
            >
              Recall
            </Link>
            <nav className="grid grid-cols-2 gap-2 text-sm sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-stone-300 bg-white/70 px-4 font-medium text-stone-700 transition hover:border-stone-500 hover:bg-stone-100 hover:text-stone-950 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-300 dark:hover:border-stone-500 dark:hover:bg-stone-900 dark:hover:text-stone-50"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-stone-950 px-4 font-medium text-white transition hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-stone-200"
              >
                Create account
              </Link>
            </nav>
          </header>

          <div className="mx-auto flex max-w-3xl flex-col items-center py-14 text-center sm:py-18 lg:py-20">
            <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-tight text-stone-950 dark:text-stone-50 sm:text-6xl lg:text-7xl">
              Turn lecture PDFs into cited answers and study drills.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-700 dark:text-stone-300 sm:text-lg">
              Upload course material, ask questions against only that material,
              and generate quiz cards that point back to the exact passage.
              Recall is built for students who need answers they can verify.
            </p>

            <div className="mt-8 grid w-full max-w-sm gap-3 sm:max-w-md sm:grid-cols-2">
              <GuestButton />
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 bg-white/70 px-4 text-sm font-semibold text-stone-800 transition hover:border-stone-500 hover:bg-white dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-100 dark:hover:border-stone-500 dark:hover:bg-stone-900"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-12 w-full max-w-4xl">
              <ProductPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-stone-200 bg-white/70 p-5 dark:border-stone-800 dark:bg-stone-900/60"
            >
              <h2 className="text-lg font-semibold tracking-tight text-stone-950 dark:text-stone-50">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-400">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductPreview() {
  return (
    <div className="w-full rounded-[1.25rem] border border-stone-300 bg-[#fffaf0] p-3 shadow-[0_24px_80px_rgba(28,25,23,0.18)] dark:border-stone-800 dark:bg-stone-950 dark:shadow-black/40">
      <div className="rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 dark:border-stone-800">
          <div>
            <p className="text-sm font-semibold text-stone-950 dark:text-stone-50">
              Photosynthesis chapter
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              1 document - 18 passages ready
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Ready
          </span>
        </div>

        <div className="grid gap-0 md:grid-cols-[0.92fr_1.08fr]">
          <div className="border-b border-stone-200 p-4 dark:border-stone-800 md:border-b-0 md:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
              Source passages
            </p>
            <div className="mt-4 space-y-3">
              {[
                ["p. 4", "Chlorophyll absorbs light energy in the thylakoid membrane."],
                ["p. 6", "Carbon dioxide is fixed into sugars during the Calvin cycle."],
                ["p. 9", "Stomata regulate gas exchange and water loss."],
              ].map(([page, text]) => (
                <div
                  key={page}
                  className="rounded-lg border border-stone-200 bg-[#f7f3ea] p-3 dark:border-stone-800 dark:bg-stone-950"
                >
                  <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                    {page}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-stone-700 dark:text-stone-300">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="rounded-xl bg-stone-950 p-4 text-stone-50 dark:bg-stone-100 dark:text-stone-950">
              <p className="text-xs text-stone-400 dark:text-stone-500">
                Student
              </p>
              <p className="mt-1 text-sm">
                What happens in the Calvin cycle?
              </p>
            </div>
            <div className="mt-3 rounded-xl border border-stone-200 bg-[#fffaf0] p-4 dark:border-stone-800 dark:bg-stone-950">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Recall
              </p>
              <p className="mt-1 text-sm leading-6 text-stone-800 dark:text-stone-200">
                The Calvin cycle fixes carbon dioxide into sugars using energy
                captured during the light reactions.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                  Photosynthesis chapter - p. 6
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Quiz
                </p>
                <p className="mt-1 text-sm text-stone-800 dark:text-stone-200">
                  Which molecule enters carbon fixation?
                </p>
              </div>
              <div className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Flashcard
                </p>
                <p className="mt-1 text-sm text-stone-800 dark:text-stone-200">
                  Chlorophyll - absorbs light energy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
