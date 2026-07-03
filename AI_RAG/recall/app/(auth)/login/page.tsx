import Link from "next/link";
import { AuthForm } from "../_components/auth-form";
import { authenticate } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <>
      <AuthForm mode="login" action={authenticate} />
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
