"use client";

import { deleteEvent } from "@/lib/actions/events";

export function DeleteEventButton({
  eventId,
  applicationId,
}: {
  eventId: string;
  applicationId: string;
}) {
  const action = deleteEvent.bind(null, eventId, applicationId);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm("Remove this event?")) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-xs font-medium text-slate-400 transition hover:text-rose-600">
        Remove
      </button>
    </form>
  );
}
