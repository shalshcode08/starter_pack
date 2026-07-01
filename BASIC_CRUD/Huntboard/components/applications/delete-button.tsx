"use client";

import { deleteApplication } from "@/lib/actions/applications";

export function DeleteButton({ id }: { id: string }) {
  const action = deleteApplication.bind(null, id);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm("Delete this application? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm font-medium text-rose-600 transition hover:text-rose-700"
      >
        Delete
      </button>
    </form>
  );
}
