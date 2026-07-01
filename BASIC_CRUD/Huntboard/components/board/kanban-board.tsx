"use client";

import { startTransition, useOptimistic } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import { KanbanCard } from "@/components/board/kanban-card";
import { KanbanColumn } from "@/components/board/kanban-column";
import { updateApplicationStatus } from "@/lib/actions/applications";
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/constants/application";

export type KanbanApplication = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
};

type Move = { id: string; status: ApplicationStatus };

export function KanbanBoard({ applications }: { applications: KanbanApplication[] }) {
  const [optimistic, applyMove] = useOptimistic(
    applications,
    (state, move: Move) => state.map((app) => (app.id === move.id ? { ...app, status: move.status } : app)),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(event: DragEndEvent) {
    const id = String(event.active.id);
    const status = event.over?.id as ApplicationStatus | undefined;
    if (!status) return;

    const card = optimistic.find((app) => app.id === id);
    if (!card || card.status === status) return;

    startTransition(async () => {
      applyMove({ id, status });
      await updateApplicationStatus(id, status);
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {APPLICATION_STATUSES.map((status) => {
          const cards = optimistic.filter((app) => app.status === status);
          return (
            <KanbanColumn key={status} status={status} label={STATUS_LABELS[status]} count={cards.length}>
              {cards.map((card) => (
                <KanbanCard key={card.id} id={card.id} company={card.company} role={card.role} />
              ))}
              {cards.length === 0 && (
                <p className="px-1 py-6 text-center text-xs text-slate-400">Drop here</p>
              )}
            </KanbanColumn>
          );
        })}
      </div>
    </DndContext>
  );
}
