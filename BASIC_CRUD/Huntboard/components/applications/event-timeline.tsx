import { DeleteEventButton } from "@/components/applications/delete-event-button";
import {
  EVENT_DOT_CLASS,
  EVENT_TYPE_LABELS,
  type EventType,
} from "@/lib/constants/event";

type TimelineEvent = {
  id: string;
  type: EventType;
  notes: string | null;
  scheduledAt: Date | null;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export function EventTimeline({
  events,
  applicationId,
}: {
  events: TimelineEvent[];
  applicationId: string;
}) {
  if (events.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
        No events yet. Log the first step of this application above.
      </p>
    );
  }

  return (
    <ol className="relative border-l border-slate-200 pl-6">
      {events.map((event) => (
        <li key={event.id} className="relative pb-6 last:pb-0">
          <span
            className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-slate-50 ${EVENT_DOT_CLASS[event.type]}`}
          />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{EVENT_TYPE_LABELS[event.type]}</p>
              <p className="text-xs text-slate-500">
                {event.scheduledAt
                  ? `Scheduled ${formatDate(event.scheduledAt)}`
                  : `Logged ${formatDate(event.createdAt)}`}
              </p>
              {event.notes && <p className="mt-1 text-sm text-slate-600">{event.notes}</p>}
            </div>
            <DeleteEventButton eventId={event.id} applicationId={applicationId} />
          </div>
        </li>
      ))}
    </ol>
  );
}
