import { streamText } from "ai";
import { google } from "@ai-sdk/google";

const TONES = ["formal", "friendly", "concise"] as const;
type Tone = (typeof TONES)[number];

interface DraftRequest {
  subject?: string;
  from?: string;
  body?: string;
  tone?: string;
}

function isTone(t: unknown): t is Tone {
  return typeof t === "string" && (TONES as readonly string[]).includes(t);
}

function firstName(from?: string): string {
  const name = (from ?? "").split("<")[0].trim();
  return name.split(/\s+/)[0] || "there";
}

/** Demo fallback: streams a template draft so the UI works with no API key. */
function mockDraftStream(req: DraftRequest, tone: Tone): Response {
  const name = firstName(req.from);
  const subject = req.subject ?? "(no subject)";
  const drafts: Record<Tone, string> = {
    formal:
      `Dear ${name},\n\n` +
      `Thank you for your email regarding "${subject}".\n\n` +
      `We have received your message and are looking into the matter. ` +
      `I will follow up with you shortly.\n\n` +
      `Best regards,\nBenjamin`,
    friendly:
      `Hi ${name},\n\n` +
      `Thanks for reaching out about "${subject}" — appreciate the heads-up!\n\n` +
      `I'm on it and will get back to you soon.\n\n` +
      `Cheers,\nBenjamin`,
    concise:
      `${name} — on "${subject}".\n\n` +
      `Got it, looking into it now. Will update you shortly.\n\n` +
      `— Benjamin`,
  };
  const text =
    drafts[tone] +
    `\n\n[demo draft — set GOOGLE_GENERATIVE_AI_API_KEY for AI-generated drafts]`;

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
  let payload: DraftRequest;
  try {
    payload = (await req.json()) as DraftRequest;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!payload.body || typeof payload.body !== "string") {
    return new Response("Missing email body", { status: 400 });
  }
  if (!isTone(payload.tone)) {
    return new Response("Invalid tone: use formal, friendly, or concise", {
      status: 400,
    });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return mockDraftStream(payload, payload.tone);
  }

  const result = streamText({
    model: google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash"),
    system:
      `You are an email assistant. Draft a short reply to the email below ` +
      `in a ${payload.tone} tone. Reply in the same language as the email. ` +
      `Do not invent facts not present in the email. Output only the reply ` +
      `body, no subject line.`,
    prompt: `Subject: ${payload.subject ?? ""}\nFrom: ${payload.from ?? ""}\n\n${payload.body}`,
  });
  return result.toTextStreamResponse();
}
