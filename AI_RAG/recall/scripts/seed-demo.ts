import "dotenv/config";
import { prisma } from "../lib/db";
import { createDocumentWithChunks, getUnembeddedChunks, setChunkEmbeddings } from "../lib/data/documents";
import { embed, toVectorLiteral } from "../lib/gemini";
import { DEMO_TEMPLATE_EMAIL } from "../lib/demo";
import type { RawChunk } from "../lib/ingest/chunk";

// A short, self-contained sample chapter used for the one-click guest demo.
const PARAGRAPHS: string[] = [
  "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. It uses carbon dioxide and water as raw materials and releases oxygen as a by-product. This process is the foundation of nearly all food chains on Earth.",
  "Photosynthesis takes place mainly in the leaves, inside organelles called chloroplasts. Chloroplasts contain stacks of flattened sacs called thylakoids, and the fluid surrounding them is the stroma. The green pigment chlorophyll is embedded in the thylakoid membranes.",
  "Chlorophyll absorbs light most strongly in the blue and red parts of the spectrum and reflects green light, which is why leaves appear green. The absorbed light energy excites electrons in chlorophyll, and this energised state drives the reactions of photosynthesis.",
  "Photosynthesis occurs in two main stages: the light-dependent reactions and the light-independent reactions, also called the Calvin cycle. The light-dependent reactions happen in the thylakoid membranes, while the Calvin cycle takes place in the stroma.",
  "In the light-dependent reactions, light energy is used to split water molecules in a process called photolysis. This releases oxygen gas, protons, and electrons. The energy captured is used to produce two energy-carrying molecules: ATP and NADPH.",
  "ATP stores energy in its phosphate bonds, while NADPH is a carrier of high-energy electrons. Together, ATP and NADPH provide the energy and reducing power needed by the Calvin cycle to build sugars. Oxygen produced here diffuses out of the leaf.",
  "The Calvin cycle uses the ATP and NADPH from the light reactions to convert carbon dioxide into glucose. Because it does not use light directly, it is called the light-independent stage, though it still depends on the products of the light reactions.",
  "The first step of the Calvin cycle is carbon fixation, in which carbon dioxide is attached to a five-carbon molecule called RuBP. This reaction is catalysed by the enzyme RuBisCO, the most abundant enzyme on Earth.",
  "After fixation, the resulting molecules are reduced using energy from ATP and electrons from NADPH to form a three-carbon sugar called G3P. Some G3P leaves the cycle to form glucose, while the rest is used to regenerate RuBP so the cycle can continue.",
  "The rate of photosynthesis is affected by three main factors: light intensity, carbon dioxide concentration, and temperature. If any one of these is in short supply, it becomes the limiting factor that caps the overall rate.",
  "At low light, increasing light intensity speeds up photosynthesis, but beyond a certain point the rate levels off as other factors become limiting. Similarly, raising carbon dioxide concentration increases the rate until another factor limits it.",
  "Temperature affects the enzymes that drive photosynthesis. The rate rises with temperature up to an optimum, then falls sharply as high temperatures denature the enzymes, including RuBisCO, and damage the photosynthetic machinery.",
];

async function main() {
  // Refresh idempotently: remove any existing template and rebuild it.
  await prisma.user.deleteMany({ where: { email: DEMO_TEMPLATE_EMAIL } });

  const template = await prisma.user.create({
    data: { email: DEMO_TEMPLATE_EMAIL, name: "Recall Demo" },
  });
  const studySet = await prisma.studySet.create({
    data: { userId: template.id, title: "Sample: Photosynthesis" },
  });

  const chunks: RawChunk[] = PARAGRAPHS.map((content, i) => ({
    content,
    page: Math.floor(i / 2) + 1,
    chunkIndex: i,
    tokenCount: Math.ceil(content.length / 4),
  }));

  const doc = await createDocumentWithChunks(
    template.id,
    studySet.id,
    { title: "Photosynthesis - Chapter 8", filename: "photosynthesis.pdf" },
    chunks,
  );
  if (!doc) throw new Error("Failed to create demo document");

  const pending = await getUnembeddedChunks(doc.id, 100);
  const vectors = await embed(pending.map((c) => c.content), "RETRIEVAL_DOCUMENT");
  await setChunkEmbeddings(
    pending.map((c, i) => ({ id: c.id, literal: toVectorLiteral(vectors[i]) })),
  );
  await prisma.document.update({ where: { id: doc.id }, data: { status: "ready" } });

  console.log(`Seeded demo template with ${chunks.length} embedded chunks.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
