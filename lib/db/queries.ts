import { and, cosineDistance, desc, eq, ilike, isNotNull, isNull, ne, or, sql } from "drizzle-orm";
import { db } from "./index";
import { attachments, emails } from "./schema";
import type { Email } from "../emails";

interface EmailRow {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: Date;
  body: string;
  labels: string[];
  read: boolean;
}

function toEmail(row: EmailRow): Email {
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

/** Emails that have no embedding yet, for backfilling. */
export async function getEmailsWithoutEmbedding(): Promise<Email[]> {
  const rows = await db.select().from(emails).where(isNull(emails.embedding));
  return rows.map(toEmail);
}

export async function setEmailEmbedding(
  id: string,
  embedding: number[],
): Promise<void> {
  await db.update(emails).set({ embedding }).where(eq(emails.id, id));
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

export interface EmailSearchResult extends Email {
  similarity: number;
}

/** Semantic search: finds emails whose embedding is closest to the query embedding. */
export async function searchEmailsBySimilarity(
  queryEmbedding: number[],
  limit = 10,
): Promise<EmailSearchResult[]> {
  const distance = sql<number>`${cosineDistance(emails.embedding, queryEmbedding)}`;
  const rows = await db
    .select({
      id: emails.id,
      from: emails.from,
      to: emails.to,
      subject: emails.subject,
      date: emails.date,
      body: emails.body,
      labels: emails.labels,
      read: emails.read,
      distance,
    })
    .from(emails)
    .where(isNotNull(emails.embedding))
    .orderBy(distance)
    .limit(limit);

  return rows.map(({ distance, ...row }) => ({
    ...toEmail(row),
    similarity: 1 - distance,
  }));
}

export interface AttachmentInfo {
  filename: string;
  contentType: string;
  size: number;
  status: (typeof attachments.$inferSelect)["status"];
}

/** Lists the attachments on a given email (metadata only, no file content). */
export async function getAttachments(emailId: string): Promise<AttachmentInfo[]> {
  const rows = await db
    .select({
      filename: attachments.filename,
      contentType: attachments.contentType,
      size: attachments.size,
      status: attachments.status,
    })
    .from(attachments)
    .where(eq(attachments.emailId, emailId));
  return rows;
}
