import { auth } from "@/auth";
import { embed, toVectorLiteral, streamAnswer } from "@/lib/gemini";
import { retrieveChunks } from "@/lib/data/retrieval";
import {
  getOrCreateConversation,
  addMessage,
  addCitations,
} from "@/lib/data/conversations";
import {
  RETRIEVE_K,
  MAX_DISTANCE,
  REFUSAL,
  SYSTEM_PROMPT,
  buildPrompt,
  parseAnswer,
} from "@/lib/rag/prompt";

const encoder = new TextEncoder();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: studySetId } = await params;
  const body = await req.json().catch(() => null);
  const question =
    typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    return Response.json({ error: "Question is required" }, { status: 400 });
  }

  const conversation = await getOrCreateConversation(session.user.id, studySetId);
  if (!conversation) {
    return Response.json({ error: "Study set not found" }, { status: 404 });
  }

  // Embed the question and retrieve the most similar chunks, scoped to the user.
  const [queryVector] = await embed([question], "RETRIEVAL_QUERY");
  const retrieved = await retrieveChunks(
    session.user.id,
    studySetId,
    toVectorLiteral(queryVector),
    RETRIEVE_K,
  );
  const sources = retrieved.filter((r) => r.distance <= MAX_DISTANCE);

  await addMessage(conversation.id, "user", question);

  // Nothing relevant: refuse rather than hallucinate.
  if (sources.length === 0) {
    await addMessage(conversation.id, "assistant", REFUSAL);
    return new Response(REFUSAL, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      try {
        for await (const delta of streamAnswer(
          SYSTEM_PROMPT,
          buildPrompt(question, sources),
        )) {
          full += delta;
          controller.enqueue(encoder.encode(delta));
        }
      } catch {
        const note = "\n\n(Sorry, the answer could not be completed.)";
        full += note;
        controller.enqueue(encoder.encode(note));
      }

      const { display, usedIndices } = parseAnswer(full);
      const usedChunkIds = usedIndices
        .map((i) => sources[i - 1]?.id)
        .filter((id): id is string => Boolean(id));

      const message = await addMessage(
        conversation.id,
        "assistant",
        display || full.trim(),
      );
      await addCitations(message.id, usedChunkIds);

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
