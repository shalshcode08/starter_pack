import Link from "next/link";
import { notFound } from "next/navigation";

import { AddEventForm } from "@/components/applications/add-event-form";
import { DeleteButton } from "@/components/applications/delete-button";
import { EventTimeline } from "@/components/applications/event-timeline";
import { StatusBadge } from "@/components/applications/status-badge";
import { addEvent } from "@/lib/actions/events";
import { getApplicationDetail } from "@/lib/data/applications";
import { requireUser } from "@/lib/session";

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const application = await getApplicationDetail(user.id, id);

  if (!application) {
    notFound();
  }

  const addEventAction = addEvent.bind(null, application.id);

  const meta: { label: string; value: React.ReactNode }[] = [];
  if (application.location) meta.push({ label: "Location", value: application.location });
  if (application.salaryRange) meta.push({ label: "Salary", value: application.salaryRange });
  if (application.source) meta.push({ label: "Source", value: application.source });
  if (application.appliedAt) meta.push({ label: "Applied", value: formatDate(application.appliedAt) });
  if (application.jobUrl) {
    meta.push({
      label: "Posting",
      value: (
        <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          View
        </a>
      ),
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/applications" className="text-sm text-slate-500 hover:text-slate-900">
        &larr; Applications
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{application.company}</h1>
          <p className="mt-1 text-slate-600">{application.role}</p>
          <div className="mt-2">
            <StatusBadge status={application.status} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/applications/${application.id}/edit`}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </Link>
          <DeleteButton id={application.id} />
        </div>
      </div>

      {meta.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="text-xs uppercase tracking-wide text-slate-400">{item.label}</dt>
              <dd className="mt-0.5 text-sm text-slate-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Timeline</h2>
        <div className="mt-4">
          <AddEventForm action={addEventAction} />
        </div>
        <div className="mt-6">
          <EventTimeline events={application.events} applicationId={application.id} />
        </div>
      </section>
    </div>
  );
}
