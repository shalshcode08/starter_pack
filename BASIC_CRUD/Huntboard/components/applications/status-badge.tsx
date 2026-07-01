import {
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/constants/application";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE_CLASS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
