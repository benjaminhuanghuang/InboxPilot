import { streamText } from "ai";
import { google } from "@ai-sdk/google";

interface SummarizeRequest {
  subject?: string;
  from?: string;
  body?: string;
}

/** Demo fallback: streams an extractive summary so the UI works with no API key. */
function mockSummaryStream(req: SummarizeRequest): Response {
  const firstLines = (req.body ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");
  const text =
    `• ${req.subject ?? "(no subject)"}\n` +
    `• From ${req.from ?? "unknown"}: ${firstLines.slice(0, 220)}…\n\n` +
    `[demo summary — set API_KEY for AI-generated summaries]`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const word of text.split(" ")) {
        controller.enqueue(encoder.encode(word + " "));
        await new Promise((r) => setTimeout(r, 25));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request): Promise<Response> {
  let payload: SummarizeRequest;
  try {
    payload = (await req.json()) as SummarizeRequest;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!payload.body || typeof payload.body !== "string") {
    return new Response("Missing email body", { status: 400 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return mockSummaryStream(payload);
  }

  const result = streamText({
    model: google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash"),
    system:
      "You are an email assistant. Summarize the email in 2-3 short " +
      "bullet points: what it's about, and any action needed with " +
      "dates or numbers. Be terse.",
    prompt: `Subject: ${payload.subject ?? ""}\nFrom: ${payload.from ?? ""}\n\n${payload.body}`,
  });
  return result.toTextStreamResponse();
}
