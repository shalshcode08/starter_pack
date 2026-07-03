import Link from "next/link";
import { AuthForm } from "../_components/auth-form";
import { GuestButton } from "../_components/guest-button";
import { authenticate } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <>
      <AuthForm mode="login" action={authenticate} />

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs text-zinc-400 dark:text-zinc-500">or</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <GuestButton />

      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No account?{" "}
        <Link
          href="/register"
          className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
