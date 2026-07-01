import Link from "next/link";
import { notFound } from "next/navigation";

import { ApplicationForm } from "@/components/applications/application-form";
import { updateApplication } from "@/lib/actions/applications";
import { getApplication } from "@/lib/data/applications";
import { requireUser } from "@/lib/session";

function toDateInput(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : undefined;
}

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const application = await getApplication(user.id, id);

  if (!application) {
    notFound();
  }

  const action = updateApplication.bind(null, application.id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/applications" className="text-sm text-slate-500 hover:text-slate-900">
        &larr; Applications
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Edit application</h1>
      <div className="mt-6">
        <ApplicationForm
          action={action}
          submitLabel="Save changes"
          defaultValues={{
            company: application.company,
            role: application.role,
            status: application.status,
            jobUrl: application.jobUrl ?? undefined,
            location: application.location ?? undefined,
            salaryRange: application.salaryRange ?? undefined,
            source: application.source ?? undefined,
            appliedAt: toDateInput(application.appliedAt),
          }}
        />
      </div>
    </div>
  );
}
