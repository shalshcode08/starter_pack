"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function KanbanCard({
  id,
  company,
  role,
}: {
  id: string;
  company: string;
  role: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <Link href={`/applications/${id}`} className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">{company}</p>
        <p className="truncate text-xs text-slate-500">{role}</p>
      </Link>
      <button
        type="button"
        {...listeners}
        {...attributes}
        aria-label="Drag card"
        className="mt-0.5 cursor-grab touch-none text-slate-300 transition hover:text-slate-500 active:cursor-grabbing"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <circle cx="7" cy="5" r="1.6" />
          <circle cx="13" cy="5" r="1.6" />
          <circle cx="7" cy="10" r="1.6" />
          <circle cx="13" cy="10" r="1.6" />
          <circle cx="7" cy="15" r="1.6" />
          <circle cx="13" cy="15" r="1.6" />
        </svg>
      </button>
    </div>
  );
}
