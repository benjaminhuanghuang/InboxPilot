"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TONES = ["formal", "friendly", "concise"] as const;
type Tone = (typeof TONES)[number];

interface Props {
  subject: string;
  from: string;
  body: string;
}

export default function DraftBox({ subject, from, body }: Props) {
  const [tone, setTone] = useState<Tone>("friendly");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate(nextTone: Tone) {
    setLoading(true);
    setDraft("");
    setError("");
    setCopied(false);
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, from, body, tone: nextTone }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let received = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        received += decoder.decode(value, { stream: true });
        setDraft(received);
      }
      if (!received.trim()) {
        throw new Error(
          "No draft returned — the AI provider likely failed mid-stream. Check server logs."
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Draft generation failed");
    } finally {
      setLoading(false);
    }
  }

  function selectTone(nextTone: Tone) {
    setTone(nextTone);
    if (draft) generate(nextTone);
  }

  async function copy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Draft Reply</CardTitle>
        <CardAction className="flex gap-2">
          {draft && (
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
          <Button onClick={() => generate(tone)} disabled={loading}>
            {loading ? "Drafting…" : draft ? "Regenerate" : "Draft"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex gap-1">
          {TONES.map((t) => (
            <Button
              key={t}
              variant={t === tone ? "secondary" : "ghost"}
              size="sm"
              onClick={() => selectTone(t)}
              disabled={loading}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {draft && (
          <p className="whitespace-pre-line text-sm leading-6">{draft}</p>
        )}
        {!draft && !loading && !error && (
          <p className="text-sm text-muted-foreground">
            Pick a tone and click Draft to generate a reply.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
