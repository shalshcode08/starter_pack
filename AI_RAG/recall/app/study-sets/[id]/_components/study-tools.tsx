"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateQuestionsAction } from "@/lib/actions/questions";

export type QuestionItem = {
  id: string;
  prompt: string;
  answer: string;
  source: { documentTitle: string; page: number };
};

type Tab = "quiz" | "flashcard";

function SourceChip({ source }: { source: QuestionItem["source"] }) {
  return (
    <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      {source.documentTitle} &middot; p.{source.page}
    </span>
  );
}

function QuizCard({ item, index }: { item: QuestionItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-left transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
    >
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {index + 1}. {item.prompt}
      </p>
      {open ? (
        <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{item.answer}</p>
          <div className="mt-2">
            <SourceChip source={item.source} />
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
          Click to reveal answer
        </p>
      )}
    </button>
  );
}

function Flashcard({ item }: { item: QuestionItem }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((v) => !v)}
      className="flex min-h-[9rem] w-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 text-left transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
    >
      <div>
        <p className="text-[0.65rem] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          {flipped ? "Answer" : "Term"}
        </p>
        <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
          {flipped ? item.answer : item.prompt}
        </p>
      </div>
      {flipped ? (
        <div className="mt-3">
          <SourceChip source={item.source} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">Click to flip</p>
      )}
    </button>
  );
}

export function StudyTools({
  studySetId,
  quiz,
  flashcards,
  canGenerate,
}: {
  studySetId: string;
  quiz: QuestionItem[];
  flashcards: QuestionItem[];
  canGenerate: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("quiz");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const items = tab === "quiz" ? quiz : flashcards;

  function generate() {
    setError(null);
    startTransition(async () => {
      const res = await generateQuestionsAction(tab, studySetId);
      if (res?.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-800">
          {(["quiz", "flashcard"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === t
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {t === "quiz" ? "Quiz" : "Flashcards"}
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          disabled={!canGenerate || isPending}
          className="shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          {isPending
            ? "Generating..."
            : items.length > 0
              ? "Regenerate"
              : `Generate ${tab === "quiz" ? "quiz" : "flashcards"}`}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {canGenerate
                ? `No ${tab === "quiz" ? "quiz questions" : "flashcards"} yet. Generate a set from this study set's material.`
                : "Upload and process a PDF to generate study material."}
            </p>
          </div>
        ) : tab === "quiz" ? (
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <QuizCard key={item.id} item={item} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <Flashcard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
