import Link from "next/link";
import { AuthForm } from "../_components/auth-form";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  return (
    <>
      <AuthForm mode="register" action={registerUser} />
      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
