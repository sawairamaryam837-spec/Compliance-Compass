import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides — Compliance Compass" },
      { name: "description", content: "Practical playbooks for intake design, triage, investigation quality and risk review." },
      { property: "og:title", content: "Guides — Compliance Compass" },
      { property: "og:description", content: "Playbooks written by compliance practitioners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Guides"
      title="Playbooks for running a defensible programme."
      intro="Short, opinionated guides you can hand to a new compliance officer on their first week."
      sections={[
        { title: "Designing intake", body: "How to write categories people actually understand, and when to allow anonymity.", to: "/complaints/new", linkLabel: "See the form" },
        { title: "Triage in 24 hours", body: "A repeatable triage routine that keeps severity honest and SLAs achievable.", to: "/complaints", linkLabel: "Open the queue" },
        { title: "Investigation quality", body: "Interview planning, documentation standards and avoiding predetermined conclusions.", to: "/investigations", linkLabel: "Open investigations" },
        { title: "Evidence handling", body: "Chain of custody in practice: what to capture, what to never touch.", to: "/evidence", linkLabel: "Open evidence" },
        { title: "Risk review cadence", body: "Running a quarterly risk review that the board actually reads.", to: "/risks", linkLabel: "Open risk register" },
        { title: "Reporting upward", body: "Turning case data into a two-page report for the audit committee.", to: "/analytics", linkLabel: "Open analytics" },
      ]}
    />
  ),
});
