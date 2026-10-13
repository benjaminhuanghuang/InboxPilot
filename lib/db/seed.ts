import { db } from "./index";
import { emails } from "./schema";
import { EMAILS } from "../emails";

async function main() {
  await db
    .insert(emails)
    .values(
      EMAILS.map((e) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        subject: e.subject,
        date: new Date(e.date),
        body: e.body,
        labels: e.labels,
        read: e.read,
      })),
    )
    .onConflictDoNothing();

  console.log(`Seeded ${EMAILS.length} emails.`);
}

main().then(() => process.exit(0));
