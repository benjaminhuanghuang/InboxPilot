"use client";

import type { Email } from "@/lib/emails";

interface Props {
  emails: Email[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function EmailList({ emails, selectedId, onSelect }: Props) {
  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {emails.map((email) => {
        const active = email.id === selectedId;
        return (
          <li key={email.id}>
            <button
              onClick={() => onSelect(email.id)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                active
                  ? "bg-blue-50 dark:bg-blue-950/40"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`truncate text-sm ${
                    email.read ? "font-normal" : "font-semibold"
                  }`}
                >
                  {email.from}
                </span>
                <span className="shrink-0 text-xs text-zinc-500">
                  {formatDate(email.date)}
                </span>
              </div>
              <div className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                {email.subject}
              </div>
              <div className="truncate text-xs text-zinc-500">
                {email.body.split("\n").find((l) => l.trim())}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
