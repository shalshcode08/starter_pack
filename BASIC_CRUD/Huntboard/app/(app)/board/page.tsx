import Link from "next/link";

import { KanbanBoard } from "@/components/board/kanban-board";
import { listApplications } from "@/lib/data/applications";
import { requireUser } from "@/lib/session";

export default async function BoardPage() {
  const user = await requireUser();
  const applications = await listApplications(user.id);

  const cards = applications.map((app) => ({
    id: app.id,
    company: app.company,
    role: app.role,
    status: app.status,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Board</h1>
        <Link
          href="/applications/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          New application
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-slate-600">No applications yet. Add one to see it on the board.</p>
        </div>
      ) : (
        <div className="mt-6">
          <KanbanBoard applications={cards} />
        </div>
      )}
    </div>
  );
}
