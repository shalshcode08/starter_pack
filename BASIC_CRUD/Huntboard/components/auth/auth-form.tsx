"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { FormState } from "@/lib/actions/auth";

type Mode = "login" | "signup";

type AuthFormProps = {
  mode: Mode;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

const copy = {
  login: {
    title: "Welcome back",
    submit: "Sign in",
    altText: "New here?",
    altHref: "/signup",
    altLabel: "Create an account",
  },
  signup: {
    title: "Create your account",
    submit: "Sign up",
    altText: "Already have an account?",
    altHref: "/login",
    altLabel: "Sign in",
  },
} satisfies Record<Mode, unknown>;

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900";

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const t = copy[mode];

  return (
    <div className="w-full max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">{t.title}</h1>

      <form action={formAction} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input id="name" name="name" type="text" autoComplete="name" required className={inputClass} />
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={8}
            className={inputClass}
          />
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}

        <SubmitButton label={t.submit} />
      </form>

      <p className="mt-6 text-sm text-slate-600">
        {t.altText}{" "}
        <Link href={t.altHref} className="font-medium text-slate-900 underline underline-offset-4">
          {t.altLabel}
        </Link>
      </p>
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "Please wait..." : label}
    </button>
  );
}
