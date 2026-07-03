"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type ChatSource = { documentTitle: string; page: number };
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: ChatSource[];
};

// Hide the trailing "SOURCES: ..." bookkeeping line while streaming.
function stripSources(text: string): string {
  return text.replace(/\n?\s*SOURCES:[\s\S]*$/i, "").trimEnd();
}

function SourceChips({ sources }: { sources: ChatSource[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {sources.map((s, i) => (
        <span
          key={i}
          className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
        >
          {s.documentTitle} &middot; p.{s.page}
        </span>
      ))}
    </div>
  );
}

export function Chat({
  studySetId,
  initialMessages,
  canAsk,
}: {
  studySetId: string;
  initialMessages: ChatMessage[];
  canAsk: boolean;
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<{ question: string; answer: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // When the server sends refreshed history, clear the optimistic pending pair.
  useEffect(() => {
    setPending(null);
  }, [initialMessages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages, pending]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || busy) return;

    setInput("");
    setBusy(true);
    setPending({ question, answer: "" });

    try {
      const res = await fetch(`/api/study-sets/${studySetId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        setPending({ question, answer: stripSources(raw) });
      }

      router.refresh();
    } catch (err) {
      setPending({
        question,
        answer:
          err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  }

  const isEmpty = initialMessages.length === 0 && !pending;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="max-h-[28rem] space-y-5 overflow-y-auto p-5">
        {isEmpty && (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Ask a question and get an answer grounded in this study set, with
            citations to the exact page.
          </p>
        )}

        {initialMessages.map((m) =>
          m.role === "user" ? (
            <UserBubble key={m.id} content={m.content} />
          ) : (
            <AssistantBubble key={m.id} content={m.content} sources={m.sources} />
          ),
        )}

        {pending && (
          <>
            <UserBubble content={pending.question} />
            <AssistantBubble
              content={pending.answer || (busy ? "Thinking..." : "")}
              sources={[]}
              muted={!pending.answer}
            />
          </>
        )}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="flex gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!canAsk || busy}
          placeholder={
            canAsk
              ? "Ask about your notes..."
              : "Upload and process a PDF to start asking"
          }
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
        />
        <button
          type="submit"
          disabled={!canAsk || busy || !input.trim()}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {busy ? "..." : "Ask"}
        </button>
      </form>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-zinc-900 px-4 py-2.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
        {content}
      </div>
    </div>
  );
}

function AssistantBubble({
  content,
  sources,
  muted,
}: {
  content: string;
  sources: ChatSource[];
  muted?: boolean;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <div
          className={`whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 ${
            muted
              ? "text-zinc-400 dark:text-zinc-500"
              : "text-zinc-800 dark:text-zinc-100"
          }`}
        >
          {content}
        </div>
        <SourceChips sources={sources} />
      </div>
    </div>
  );
}
