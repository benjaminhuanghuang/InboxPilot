import { desc } from "drizzle-orm";
import { db } from "./index";
import { emails } from "./schema";
import type { Email } from "../emails";

function toEmail(row: typeof emails.$inferSelect): Email {
  return {
    id: row.id,
    from: row.from,
    to: row.to,
    subject: row.subject,
    date: row.date.toISOString(),
    body: row.body,
    labels: row.labels,
    read: row.read,
  };
}

export async function getEmails(): Promise<Email[]> {
  const rows = await db.select().from(emails).orderBy(desc(emails.date));
  return rows.map(toEmail);
}
