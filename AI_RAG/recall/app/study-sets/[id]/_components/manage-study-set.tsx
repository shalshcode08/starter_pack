"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  renameStudySetAction,
  deleteStudySetAction,
  type ActionState,
} from "@/lib/actions/study-sets";

function RenameSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export function ManageStudySet({ id, title }: { id: string; title: string }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      const result = await renameStudySetAction(prev, formData);
      if (!result?.error) setEditing(false);
      return result;
    },
    undefined,
  );

  if (editing) {
    return (
      <div>
        <form action={formAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <input
            name="title"
            defaultValue={title}
            autoFocus
            required
            maxLength={100}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-lg font-semibold text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <RenameSubmit />
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            Cancel
          </button>
        </form>
        {state?.error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Rename
        </button>
        <form
          action={deleteStudySetAction}
          onSubmit={(e) => {
            if (
              !confirm(
                "Delete this study set? Its documents and chunks will be removed permanently.",
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
