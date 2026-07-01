"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { FormState } from "@/lib/actions/applications";
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/constants/application";

export type ApplicationFormValues = {
  company?: string;
  role?: string;
  status?: ApplicationStatus;
  jobUrl?: string;
  location?: string;
  salaryRange?: string;
  source?: string;
  appliedAt?: string;
};

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: ApplicationFormValues;
  submitLabel: string;
};

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900";
const labelClass = "text-sm font-medium text-slate-700";

export function ApplicationForm({ action, defaultValues, submitLabel }: Props) {
  const [state, formAction] = useActionState(action, undefined);
  const v = defaultValues ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Company" htmlFor="company">
          <input id="company" name="company" required defaultValue={v.company} className={inputClass} />
        </Field>
        <Field label="Role" htmlFor="role">
          <input id="role" name="role" required defaultValue={v.role} className={inputClass} />
        </Field>
        <Field label="Status" htmlFor="status">
          <select id="status" name="status" defaultValue={v.status ?? "WISHLIST"} className={inputClass}>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Applied on" htmlFor="appliedAt">
          <input id="appliedAt" name="appliedAt" type="date" defaultValue={v.appliedAt} className={inputClass} />
        </Field>
        <Field label="Job URL" htmlFor="jobUrl">
          <input id="jobUrl" name="jobUrl" type="url" placeholder="https://" defaultValue={v.jobUrl} className={inputClass} />
        </Field>
        <Field label="Location" htmlFor="location">
          <input id="location" name="location" defaultValue={v.location} className={inputClass} />
        </Field>
        <Field label="Salary range" htmlFor="salaryRange">
          <input id="salaryRange" name="salaryRange" defaultValue={v.salaryRange} className={inputClass} />
        </Field>
        <Field label="Source" htmlFor="source">
          <input id="source" name="source" placeholder="LinkedIn, referral..." defaultValue={v.source} className={inputClass} />
        </Field>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton label={submitLabel} />
        <Link href="/applications" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}
