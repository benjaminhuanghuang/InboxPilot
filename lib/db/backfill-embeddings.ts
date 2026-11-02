import { getEmailsWithoutEmbedding, setEmailEmbedding } from "./queries";
import { embedBatch } from "../ai/embedding";

async function main() {
  const pending = await getEmailsWithoutEmbedding();
  if (pending.length === 0) {
    console.log("All emails already have embeddings.");
    return;
  }

  const embeddings = await embedBatch(
    pending.map((e) => `${e.subject}\n\n${e.body}`),
    "RETRIEVAL_DOCUMENT",
  );

  for (let i = 0; i < pending.length; i++) {
    await setEmailEmbedding(pending[i].id, embeddings[i]);
  }

  console.log(`Backfilled embeddings for ${pending.length} emails.`);
}

main().then(() => process.exit(0));
