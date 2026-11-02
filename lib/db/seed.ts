import { db } from "./index";
import { emails } from "./schema";
import { EMAILS } from "../emails";
import { embedBatch } from "../ai/embedding";

async function main() {
  const embeddings = await embedBatch(
    EMAILS.map((e) => `${e.subject}\n\n${e.body}`),
    "RETRIEVAL_DOCUMENT",
  );

  await db
    .insert(emails)
    .values(
      EMAILS.map((e, i) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        subject: e.subject,
        date: new Date(e.date),
        body: e.body,
        labels: e.labels,
        read: e.read,
        embedding: embeddings[i],
      })),
    )
    .onConflictDoNothing();

  console.log(`Seeded ${EMAILS.length} emails.`);
}

main().then(() => process.exit(0));
