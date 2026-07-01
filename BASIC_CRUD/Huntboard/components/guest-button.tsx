"use client";

import { useFormStatus } from "react-dom";

import { guestLogin } from "@/lib/actions/auth";

export function GuestButton({ className, label }: { className: string; label: string }) {
  return (
    <form action={guestLogin}>
      <SubmitButton className={className} label={label} />
    </form>
  );
}

function SubmitButton({ className, label }: { className: string; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Loading demo..." : label}
    </button>
  );
}
