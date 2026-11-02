import { and, desc, ilike, ne, or } from "drizzle-orm";
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

/** Extracts the bare address from a "Name <addr@host>" header, or returns it as-is. */
function senderAddress(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return (match ? match[1] : from).trim();
}

export interface SearchEmailHistoryParams {
  from: string;
  query?: string;
  excludeId?: string;
  limit?: number;
}

/** Finds past emails from the same sender, optionally filtered by a keyword. */
export async function searchEmailHistory({
  from,
  query,
  excludeId,
  limit = 5,
}: SearchEmailHistoryParams): Promise<Email[]> {
  const conditions = [ilike(emails.from, `%${senderAddress(from)}%`)];
  if (excludeId) conditions.push(ne(emails.id, excludeId));
  if (query) {
    conditions.push(
      or(ilike(emails.subject, `%${query}%`), ilike(emails.body, `%${query}%`))!,
    );
  }

  const rows = await db
    .select()
    .from(emails)
    .where(and(...conditions))
    .orderBy(desc(emails.date))
    .limit(limit);
  return rows.map(toEmail);
}
