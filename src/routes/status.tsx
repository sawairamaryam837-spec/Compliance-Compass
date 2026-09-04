import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Service status — Compliance Compass" },
      { name: "description", content: "Current availability of intake, investigations, evidence storage and reporting." },
      { property: "og:title", content: "Service status — Compliance Compass" },
      { property: "og:description", content: "All systems and their current operational state." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Status"
      title="All systems operational."
      intro="Live operational state for each part of the platform. Planned maintenance is announced at least five business days ahead."
      sections={[
        { title: "Intake — operational", body: "Concern submission and case reference generation are running normally.", to: "/complaints/new", linkLabel: "Report a concern" },
        { title: "Case management — operational", body: "Triage, assignment and status updates are available.", to: "/complaints", linkLabel: "Open complaints" },
        { title: "Investigations — operational", body: "Findings, timelines and due-date tracking are available.", to: "/investigations", linkLabel: "Open investigations" },
        { title: "Evidence vault — operational", body: "Uploads, downloads and access logging are running normally.", to: "/evidence", linkLabel: "Open evidence" },
        { title: "Audit logging — operational", body: "Audit entries are being written and are queryable.", to: "/audit-logs", linkLabel: "Open audit logs" },
        { title: "Reporting — operational", body: "Dashboards and exports are up to date.", to: "/analytics", linkLabel: "Open analytics" },
      ]}
    />
  ),
});
