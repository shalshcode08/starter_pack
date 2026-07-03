import { auth } from "@/auth";
import { extractPages, chunkPages } from "@/lib/ingest/chunk";
import { createDocumentWithChunks } from "@/lib/data/documents";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: studySetId } = await params;
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return Response.json({ error: "Only PDF files are supported" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File exceeds 15 MB limit" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  let chunks;
  try {
    const pages = await extractPages(bytes);
    chunks = chunkPages(pages);
  } catch {
    return Response.json({ error: "Could not read this PDF" }, { status: 422 });
  }

  if (chunks.length === 0) {
    return Response.json(
      { error: "No extractable text found (scanned PDFs are not supported yet)" },
      { status: 422 },
    );
  }

  const title = file.name.replace(/\.pdf$/i, "");
  const doc = await createDocumentWithChunks(
    session.user.id,
    studySetId,
    { title, filename: file.name },
    chunks,
  );

  if (!doc) {
    return Response.json({ error: "Study set not found" }, { status: 404 });
  }

  return Response.json({ documentId: doc.id, totalChunks: chunks.length });
}
