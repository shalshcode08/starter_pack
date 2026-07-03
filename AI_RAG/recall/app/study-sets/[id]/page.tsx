import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { getStudySet } from "@/lib/data/study-sets";
import { getConversation } from "@/lib/data/conversations";
import { listQuestions } from "@/lib/data/questions";
import { AppHeader } from "@/app/_components/app-header";
import { ManageStudySet } from "./_components/manage-study-set";
import { DocumentUpload } from "./_components/document-upload";
import { DocumentList } from "./_components/document-list";
import { Chat, type ChatMessage } from "./_components/chat";
import { StudyTools, type QuestionItem } from "./_components/study-tools";

export default async function StudySetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const studySet = await getStudySet(user.id, id);

  if (!studySet) notFound();

  const conversation = await getConversation(user.id, id);
  const messages: ChatMessage[] = (conversation?.messages ?? []).map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    sources: m.citations.map((c) => ({
      documentTitle: c.chunk.document.title,
      page: c.chunk.page,
    })),
  }));
  const canAsk = studySet.documents.some((d) => d.status === "ready");

  const questions = await listQuestions(user.id, id);
  const toItem = (q: (typeof questions)[number]): QuestionItem => ({
    id: q.id,
    prompt: q.prompt,
    answer: q.answer,
    source: { documentTitle: q.sourceChunk.document.title, page: q.sourceChunk.page },
  });
  const quiz = questions.filter((q) => q.type === "quiz").map(toItem);
  const flashcards = questions.filter((q) => q.type === "flashcard").map(toItem);

  return (
    <>
      <AppHeader email={user.email} isGuest={user.isGuest} />
      <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Documents
            </h2>
            <DocumentUpload studySetId={studySet.id} />
          </div>
          <div className="mt-4">
            <DocumentList documents={studySet.documents} />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Ask
          </h2>
          <Chat studySetId={studySet.id} initialMessages={messages} canAsk={canAsk} />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Study tools
          </h2>
          <StudyTools
            studySetId={studySet.id}
            quiz={quiz}
            flashcards={flashcards}
            canGenerate={canAsk}
          />
        </section>
      </main>
    </>
  );
}
