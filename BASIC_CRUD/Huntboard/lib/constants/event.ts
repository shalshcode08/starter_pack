export const EVENT_TYPES = [
  "APPLIED",
  "OA",
  "INTERVIEW",
  "FOLLOW_UP",
  "OFFER",
  "REJECTED",
  "NOTE",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  APPLIED: "Applied",
  OA: "Online Assessment",
  INTERVIEW: "Interview",
  FOLLOW_UP: "Follow-up",
  OFFER: "Offer",
  REJECTED: "Rejected",
  NOTE: "Note",
};

export const EVENT_DOT_CLASS: Record<EventType, string> = {
  APPLIED: "bg-blue-500",
  OA: "bg-amber-500",
  INTERVIEW: "bg-violet-500",
  FOLLOW_UP: "bg-sky-500",
  OFFER: "bg-emerald-500",
  REJECTED: "bg-rose-500",
  NOTE: "bg-slate-400",
};
