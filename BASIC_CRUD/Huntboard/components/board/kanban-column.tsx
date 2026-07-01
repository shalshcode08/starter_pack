"use client";

import { useDroppable } from "@dnd-kit/core";

import { STATUS_DOT_CLASS, type ApplicationStatus } from "@/lib/constants/application";

export function KanbanColumn({
  status,
  label,
  count,
  children,
}: {
  status: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className={`h-2 w-2 rounded-full ${STATUS_DOT_CLASS[status as ApplicationStatus]}`} />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="ml-auto rounded-full bg-slate-200/70 px-2 py-0.5 text-xs font-medium text-slate-500">
          {count}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 rounded-xl border p-2 transition-colors ${
          isOver
            ? "border-slate-400 bg-slate-100 ring-2 ring-slate-300"
            : "border-slate-200/80 bg-slate-100/60"
        }`}
        style={{ minHeight: "60vh" }}
      >
        {children}
      </div>
    </div>
  );
}
