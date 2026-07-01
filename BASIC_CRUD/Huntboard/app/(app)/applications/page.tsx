import Link from "next/link";

import { DeleteButton } from "@/components/applications/delete-button";
import { StatusBadge } from "@/components/applications/status-badge";
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/constants/application";
import { listApplications } from "@/lib/data/applications";
import { requireUser } from "@/lib/session";

function parseStatus(value?: string): ApplicationStatus | undefined {
  return APPLICATION_STATUSES.find((status) => status === value);
}

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { status } = await searchParams;
  const activeStatus = parseStatus(status);
  const applications = await listApplications(user.id, activeStatus);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Applications</h1>
        <Link
          href="/applications/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          New application
        </Link>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2">
        <FilterLink label="All" href="/applications" active={!activeStatus} />
        {APPLICATION_STATUSES.map((s) => (
          <FilterLink
            key={s}
            label={STATUS_LABELS[s]}
            href={`/applications?status=${s}`}
            active={activeStatus === s}
          />
        ))}
      </nav>

      {applications.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-slate-600">
            {activeStatus
              ? "No applications with this status yet."
              : "No applications yet. Add your first one to start tracking."}
          </p>
          <Link
            href="/applications/new"
            className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            New application
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Applied</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/applications/${app.id}`} className="hover:underline">
                      {app.company}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{app.role}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(app.appliedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/applications/${app.id}/edit`}
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={app.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-sm font-medium transition ${
        active ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}
