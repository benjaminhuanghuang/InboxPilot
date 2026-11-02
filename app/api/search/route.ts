import { embedOne } from "@/lib/ai/embedding";
import { getEmails, searchEmailsBySimilarity } from "@/lib/db/queries";
import type { Email } from "@/lib/emails";

interface SearchRequest {
  query?: string;
}

export interface SearchResult {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  similarity: number | null;
}

function toResult(email: Email, similarity: number | null): SearchResult {
  return {
    id: email.id,
    subject: email.subject,
    from: email.from,
    date: email.date,
    snippet: email.body.slice(0, 200),
    similarity,
  };
}

/** Demo fallback: plain keyword match so search works with no API key. */
async function mockSearch(query: string): Promise<SearchResult[]> {
  const needle = query.toLowerCase();
  const all = await getEmails();
  return all
    .filter(
      (e) =>
        e.subject.toLowerCase().includes(needle) ||
        e.body.toLowerCase().includes(needle),
    )
    .map((e) => toResult(e, null));
}

export async function POST(req: Request): Promise<Response> {
  let payload: SearchRequest;
  try {
    payload = (await req.json()) as SearchRequest;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const query = payload.query?.trim();
  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json({ results: await mockSearch(query) });
  }

  const queryEmbedding = await embedOne(query, "RETRIEVAL_QUERY");
  const matches = await searchEmailsBySimilarity(queryEmbedding, 3);
  return Response.json({
    results: matches.map((e) => toResult(e, e.similarity)),
  });
}
