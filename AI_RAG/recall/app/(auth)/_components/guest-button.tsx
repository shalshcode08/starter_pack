"use client";

import { useFormStatus } from "react-dom";
import { signInAsGuest } from "@/lib/actions/auth";

function Button() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
    >
      {pending ? "Setting up your demo..." : "Try a live demo, no signup"}
    </button>
  );
}

export function GuestButton() {
  return (
    <form action={signInAsGuest}>
      <Button />
    </form>
  );
}
