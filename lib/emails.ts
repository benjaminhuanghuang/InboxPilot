export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  labels: string[];
  read: boolean;
}

export const EMAILS: Email[] = [
  {
    id: "m1",
    from: "Priya Nair <priya.nair@acmecorp.com>",
    to: "support@inboxpilot.dev",
    subject: "Urgent: Checkout failing for EU customers since this morning",
    date: "2026-10-13T08:12:00",
    body: `Hi team,

Since around 6:40 AM CET our EU storefront checkout has been failing.
Customers see "Payment could not be processed" after submitting the
payment form. It affects roughly 30% of attempts, mostly cards issued
in Germany and France.

Our status page shows all green, so this looks like a partial outage.
We have a flash sale starting at noon and cannot afford downtime.

Can someone confirm you're seeing this on your end and give us an ETA?

Order IDs for two failed attempts: #88412, #88419.

Thanks,
Priya
VP Engineering, Acme Corp`,
    labels: ["urgent", "customer"],
    read: false,
  },
  {
    id: "m2",
    from: "Stripe <notifications@stripe.com>",
    to: "billing@inboxpilot.dev",
    subject: "Your invoice for October is ready — $1,284.50",
    date: "2026-10-12T17:02:00",
    body: `Hello,

Your Stripe invoice for October 2026 is ready.

Amount due: $1,284.50
Due date: November 1, 2026

This is $312 more than last month, driven by increased payment
volume (12,400 successful charges vs 9,100 in September).

View and download the invoice from your dashboard.

Thanks for using Stripe.`,
    labels: ["billing"],
    read: true,
  },
  {
    id: "m3",
    from: "Dan Kim <dan.kim@inboxpilot.dev>",
    to: "team@inboxpilot.dev",
    subject: "Re: Q4 roadmap review moved to Thursday 2pm",
    date: "2026-10-12T14:45:00",
    body: `Team,

Moving the Q4 roadmap review from Wednesday to Thursday 2:00 PM PT.
Same room (4B), same agenda.

Two asks before then:
1. Eng: freeze the scope doc by EOD Wednesday.
2. Design: bring the two onboarding variants for the final vote.

If Thursday doesn't work for anyone, speak now.

— Dan`,
    labels: ["internal"],
    read: true,
  },
  {
    id: "m4",
    from: "Logistics <tracking@fastship.io>",
    to: "orders@inboxpilot.dev",
    subject: "Shipment delayed: order #FS-99213 (2 business days)",
    date: "2026-10-11T09:30:00",
    body: `Hello,

Your shipment for order #FS-99213 (4x MacBook Pro 14") has been
delayed by 2 business days due to a carrier backlog at the Oakland
hub. New estimated delivery: Thursday, October 15.

Track your package: https://fastship.io/t/FS-99213

We apologize for the inconvenience.`,
    labels: ["shipping"],
    read: false,
  },
  {
    id: "m5",
    from: "Hacker Newsletter <digest@hackernewsletter.com>",
    to: "dev@inboxpilot.dev",
    subject: "This week: local-first software, SQLite at scale, Rust GUIs",
    date: "2026-10-10T06:00:00",
    body: `Top stories this week:

1. "Local-first software is having a moment" — why CRDTs are
   finally practical for mainstream apps.
2. "Running SQLite at 10k writes/sec" — WAL mode, connection
   pooling, and when to shard.
3. "Rust GUI in 2026" — egui vs iced vs Tauri, with benchmarks.
4. "The evals gap" — why most AI demos fail in production.

Read the full digest: https://hackernewsletter.com/issues/612`,
    labels: ["newsletter"],
    read: true,
  },
  {
    id: "m6",
    from: "Amelia Hart <amelia.hart@gmail.com>",
    to: "support@inboxpilot.dev",
    subject: "Refund request — charged twice for annual plan",
    date: "2026-10-09T19:22:00",
    body: `Hi,

I was charged twice for the annual plan renewal on October 7:
$299 on card ending 4412 at 9:14 AM, and another $299 at 9:16 AM.

The second charge looks like a duplicate. My account shows only
one active subscription.

Please refund the duplicate charge. Happy to provide statements
if needed.

Amelia Hart
Account: amelia.hart@gmail.com`,
    labels: ["customer", "billing"],
    read: false,
  },
  {
    id: "m7",
    from: "GitHub <notifications@github.com>",
    to: "dev@inboxpilot.dev",
    subject: "[inboxpilot/web] CI failed on main — 2 failing tests",
    date: "2026-10-09T11:05:00",
    body: `CI run #4821 on main failed.

Failing tests:
- app/api/summarize/route.test.ts > returns 400 on empty body
- components/EmailView.test.tsx > renders labels

The summarize route test looks like a real regression from PR #88
(changed the validation schema). The EmailView one might be flaky —
it passed on re-run last week.

Details: https://github.com/inboxpilot/web/actions/runs/4821`,
    labels: ["internal", "ci"],
    read: true,
  },
  {
    id: "m8",
    from: "Sofia Marques <sofia.m@linguacorp.pt>",
    to: "partnerships@inboxpilot.dev",
    subject: "Partnership inquiry — localized AI support for PT market",
    date: "2026-10-08T15:40:00",
    body: `Hello,

I'm Sofia from LinguaCorp, a Lisbon-based consultancy. Several of
our clients (mid-size SaaS, 50–200 seats) are asking for AI-assisted
support in European Portuguese.

Two questions:
1. Does InboxPilot support pt-PT out of the box, or only pt-BR?
2. Do you offer a reseller/partner program for the EU market?

We're evaluating three vendors this month and would love a 30-min
call next week if there's a fit.

Best,
Sofia`,
    labels: ["sales"],
    read: false,
  },
];
