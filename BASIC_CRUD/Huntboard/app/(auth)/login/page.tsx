import { AuthForm } from "@/components/auth/auth-form";
import { GuestButton } from "@/components/guest-button";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <div>
      <AuthForm mode="login" action={login} />

      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-6">
        <GuestButton
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          label="Explore the demo"
        />
      </div>
    </div>
  );
}
