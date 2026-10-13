"use client";

import type { Email } from "@/lib/emails";
import SummaryBox from "./SummaryBox";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EmailView({ email }: { email: Email }) {
  return (
    <div className="mx-auto max-w-3xl px-8 py-6">
      <h1 className="text-xl font-semibold">{email.subject}</h1>
      <div className="mt-2 flex items-center justify-between text-sm text-zinc-500">
        <span>{email.from}</span>
        <span>{formatDateTime(email.date)}</span>
      </div>
      <div className="mt-2 flex gap-2">
        {email.labels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <SummaryBox
          subject={email.subject}
          from={email.from}
          body={email.body}
        />
      </div>

      <div className="mt-6 whitespace-pre-line text-sm leading-7">
        {email.body}
      </div>
    </div>
  );
}
