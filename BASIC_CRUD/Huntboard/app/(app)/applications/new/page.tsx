import Link from "next/link";

import { ApplicationForm } from "@/components/applications/application-form";
import { createApplication } from "@/lib/actions/applications";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/applications" className="text-sm text-slate-500 hover:text-slate-900">
        &larr; Applications
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">New application</h1>
      <div className="mt-6">
        <ApplicationForm action={createApplication} submitLabel="Create application" />
      </div>
    </div>
  );
}
