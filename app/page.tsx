"use client";

import { useState } from "react";
import { EMAILS } from "@/lib/emails";
import EmailList from "@/components/email-list";
import EmailView from "@/components/email-view";

export default function Home() {
  const [selectedId, setSelectedId] = useState(EMAILS[0].id);
  const email = EMAILS.find((e) => e.id === selectedId) ?? EMAILS[0];

  return (
    <div className="flex h-screen">
      <aside className="flex w-96 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
        <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h1 className="text-lg font-bold">InboxPilot</h1>
          <p className="text-xs text-zinc-500">AI mail assistant · demo</p>
        </header>
        <div className="flex-1 overflow-y-auto">
          <EmailList
            emails={EMAILS}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <EmailView key={email.id} email={email} />
      </main>
    </div>
  );
}
