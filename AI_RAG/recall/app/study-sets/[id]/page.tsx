import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { getStudySet } from "@/lib/data/study-sets";
import { AppHeader } from "@/app/_components/app-header";
import { ManageStudySet } from "./_components/manage-study-set";
import { DocumentUpload } from "./_components/document-upload";
import { DocumentList } from "./_components/document-list";

export default async function StudySetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const studySet = await getStudySet(user.id, id);

  if (!studySet) notFound();

  return (
    <>
      <AppHeader email={user.email} />
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          &larr; All study sets
        </Link>

        <div className="mt-4">
          <ManageStudySet id={studySet.id} title={studySet.title} />
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Documents
            </h2>
            <DocumentUpload studySetId={studySet.id} />
          </div>
          <div className="mt-4">
            <DocumentList documents={studySet.documents} />
          </div>
        </section>
      </main>
    </>
  );
}
