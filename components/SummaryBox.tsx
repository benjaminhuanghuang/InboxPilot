"use client";

import { useState } from "react";

interface Props {
  subject: string;
  from: string;
  body: string;
}

export default function SummaryBox({ subject, from, body }: Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function summarize() {
    setLoading(true);
    setSummary("");
    setError("");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, from, body }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        setSummary((s) => s + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Summarization failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">AI Summary</h3>
        <button
          onClick={summarize}
          disabled={loading}
          className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Summarizing…" : summary ? "Regenerate" : "Summarize"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {summary && (
        <p className="mt-2 whitespace-pre-line text-sm leading-6">{summary}</p>
      )}
      {!summary && !loading && !error && (
        <p className="mt-2 text-sm text-zinc-500">
          Click Summarize to get a 2–3 bullet AI summary of this email.
        </p>
      )}
    </div>
  );
}
