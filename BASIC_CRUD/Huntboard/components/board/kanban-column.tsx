"use client";

import { useDroppable } from "@dnd-kit/core";

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
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs text-slate-400">{count}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 rounded-lg border p-2 transition-colors ${
          isOver ? "border-slate-400 bg-slate-100" : "border-slate-200 bg-slate-50"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
