import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/compliance-library")({
  head: () => ({
    meta: [
      { title: "Compliance library — Compliance Compass" },
      { name: "description", content: "Regulatory summaries and control mappings for whistleblowing, conduct and risk obligations." },
      { property: "og:title", content: "Compliance library — Compliance Compass" },
      { property: "og:description", content: "Regulatory summaries and control mappings, kept current." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Compliance library"
      title="Regulatory context, mapped to controls."
      intro="Summaries of the obligations that shape speak-up programmes, each mapped to the controls the platform evidences."
      sections={[
        { title: "EU Whistleblower Directive", body: "Channel requirements, acknowledgement deadlines and feedback obligations.", to: "/complaints", linkLabel: "See intake controls" },
        { title: "UK conduct expectations", body: "Senior manager accountability and record-keeping expectations.", to: "/users", linkLabel: "See ownership" },
        { title: "Data protection", body: "Lawful basis, minimisation and retention for investigation records.", to: "/settings", linkLabel: "Retention settings" },
        { title: "Evidence standards", body: "What makes evidence defensible months later, and what breaks the chain.", to: "/evidence", linkLabel: "See evidence vault" },
        { title: "Risk frameworks", body: "Mapping likelihood × impact scoring to common enterprise risk taxonomies.", to: "/risks", linkLabel: "See risk register" },
        { title: "Audit evidence", body: "Producing an audit pack that answers the inspector's first three questions.", to: "/audit-logs", linkLabel: "See audit logs" },
      ]}
    />
  ),
});
