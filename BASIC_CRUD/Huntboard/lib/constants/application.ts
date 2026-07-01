export const APPLICATION_STATUSES = [
  "WISHLIST",
  "APPLIED",
  "OA",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  OA: "OA",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
  WISHLIST: "bg-slate-100 text-slate-700 ring-slate-200",
  APPLIED: "bg-blue-50 text-blue-700 ring-blue-200",
  OA: "bg-amber-50 text-amber-700 ring-amber-200",
  INTERVIEW: "bg-violet-50 text-violet-700 ring-violet-200",
  OFFER: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
};
