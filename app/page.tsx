import { Suspense } from "react";
import { getEmails } from "@/lib/db/queries";
import Inbox from "@/components/inbox";

export default function Home() {
  return (
    <Suspense fallback={<InboxSkeleton />}>
      <InboxData />
    </Suspense>
  );
}

async function InboxData() {
  const emails = await getEmails();
  return <Inbox emails={emails} />;
}

function InboxSkeleton() {
  return (
    <div className="flex h-screen">
      <aside className="flex w-96 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
        <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h1 className="text-lg font-bold">InboxPilot</h1>
          <p className="text-xs text-zinc-500">AI mail assistant · demo</p>
        </header>
        <div className="flex-1 p-4 text-sm text-zinc-500">Loading…</div>
      </aside>
      <main className="flex-1" />
    </div>
  );
}
