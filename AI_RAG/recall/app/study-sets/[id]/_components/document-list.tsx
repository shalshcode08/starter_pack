import type { DocumentStatus } from "@/app/generated/prisma/enums";

type DocItem = {
  id: string;
  title: string;
  status: DocumentStatus;
  _count: { chunks: number };
};

const badge: Record<DocumentStatus, { label: string; className: string }> = {
  processing: {
    label: "Processing",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  },
  ready: {
    label: "Ready",
    className:
      "bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
};

export function DocumentList({ documents }: { documents: DocItem[] }) {
  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No documents yet. Upload a PDF to build this study set.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {documents.map((doc) => {
        const b = badge[doc.status];
        return (
          <li
            key={doc.id}
            className="flex items-center justify-between gap-4 bg-white px-5 py-4 dark:bg-zinc-950"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                {doc.title}
              </p>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                {doc._count.chunks}{" "}
                {doc._count.chunks === 1 ? "passage" : "passages"}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${b.className}`}
            >
              {b.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
