import { auth } from "@/auth";

export default async function BoardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Board</h1>
      <p className="mt-2 text-sm text-slate-600">
        Signed in as {session?.user?.name ?? session?.user?.email}. The pipeline lands here in Phase 5.
      </p>
    </div>
  );
}
