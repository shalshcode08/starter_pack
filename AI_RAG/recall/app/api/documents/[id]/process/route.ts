import { auth } from "@/auth";
import { embed, toVectorLiteral } from "@/lib/gemini";
import {
  getOwnedDocument,
  getUnembeddedChunks,
  setChunkEmbeddings,
  countUnembeddedChunks,
  setDocumentStatus,
} from "@/lib/data/documents";

// Chunks embedded per request. Kept small so a single call stays well within
// the serverless function timeout; the client polls until nothing remains.
const BATCH_SIZE = 20;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const doc = await getOwnedDocument(session.user.id, id);
  if (!doc) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }
  if (doc.status === "ready") {
    return Response.json({ status: "ready", remaining: 0 });
  }

  try {
    const batch = await getUnembeddedChunks(id, BATCH_SIZE);

    if (batch.length > 0) {
      const vectors = await embed(
        batch.map((c) => c.content),
        "RETRIEVAL_DOCUMENT",
      );
      await setChunkEmbeddings(
        batch.map((c, i) => ({ id: c.id, literal: toVectorLiteral(vectors[i]) })),
      );
    }

    const remaining = await countUnembeddedChunks(id);
    if (remaining === 0) {
      await setDocumentStatus(id, "ready");
      return Response.json({ status: "ready", remaining: 0 });
    }

    return Response.json({ status: "processing", remaining });
  } catch {
    await setDocumentStatus(id, "failed");
    return Response.json(
      { status: "failed", error: "Embedding failed" },
      { status: 500 },
    );
  }
}
