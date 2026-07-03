"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "idle" | "uploading" | "processing" | "error";

export function DocumentUpload({ studySetId }: { studySetId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPhase("uploading");

    try {
      const form = new FormData();
      form.append("file", file);

      const uploadRes = await fetch(
        `/api/study-sets/${studySetId}/documents`,
        { method: "POST", body: form },
      );
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      const { documentId, totalChunks } = uploadData as {
        documentId: string;
        totalChunks: number;
      };

      setPhase("processing");
      setProgress({ done: 0, total: totalChunks });

      // Poll the process endpoint until every chunk is embedded.
      const maxIterations = Math.ceil(totalChunks / 20) + 10;
      let remaining = totalChunks;
      for (let i = 0; i < maxIterations && remaining > 0; i++) {
        const res = await fetch(`/api/documents/${documentId}/process`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok || data.status === "failed") {
          throw new Error(data.error ?? "Processing failed");
        }
        remaining = data.remaining ?? 0;
        setProgress({ done: totalChunks - remaining, total: totalChunks });
        if (data.status === "ready") break;
      }

      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("error");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function reset() {
    setPhase("idle");
    setProgress({ done: 0, total: 0 });
    if (inputRef.current) inputRef.current.value = "";
  }

  const busy = phase === "uploading" || phase === "processing";
  const pct =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="w-full sm:w-auto">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        disabled={busy}
        className="hidden"
        id="pdf-upload"
      />
      <label
        htmlFor="pdf-upload"
        aria-disabled={busy}
        className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:w-auto ${
          busy
            ? "cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
            : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        }`}
      >
        {phase === "uploading"
          ? "Uploading..."
          : phase === "processing"
            ? "Processing..."
            : "Upload PDF"}
      </label>

      {phase === "processing" && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            Embedding {progress.done} of {progress.total} passages ({pct}%)
          </p>
        </div>
      )}

      {phase === "error" && error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
