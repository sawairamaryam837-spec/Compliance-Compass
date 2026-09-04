import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";
import featuresHero from "@/assets/features-hero.jpg";


export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Compliance Compass" },
      { name: "description", content: "Intake, investigations, evidence custody, risk scoring and immutable audit logging in one platform." },
      { property: "og:title", content: "Features — Compliance Compass" },
      { property: "og:description", content: "Everything a compliance team needs, on one auditable record." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Platform"
      title="One record for every concern, investigation and risk."
      image={featuresHero}
      imageAlt="Compliance dashboard displayed on a monitor in a modern office"
      intro="Compliance Compass connects intake, investigation, evidence and reporting so nothing falls between systems — and every action is attributable."
      sections={[
        { title: "Intake & case management", body: "Structured intake with categories, severity and anonymity, then triage, assignment and SLA tracking.", bullets: ["Anonymous reporting", "Automatic case references", "Assignment and status workflow"], to: "/complaints", linkLabel: "Open complaints" },
        { title: "Investigations", body: "Plan, assign and document investigations with due dates, findings and a full timeline.", bullets: ["Investigator ownership", "Findings log", "Due-date tracking"], to: "/investigations", linkLabel: "Open investigations" },
        { title: "Evidence custody", body: "Restricted evidence vault where every view and download is written to the audit trail.", bullets: ["Chain of custody", "Access logging", "Case linkage"], to: "/evidence", linkLabel: "Open evidence" },
        { title: "Risk management", body: "Likelihood × impact scoring with owners, mitigation plans and review dates.", bullets: ["Automatic risk levels", "Owner accountability", "Review reminders"], to: "/risks", linkLabel: "Open risk register" },
        { title: "Audit & compliance", body: "Append-only audit log covering every action, denial and access event.", bullets: ["Immutable entries", "Filter by user or record", "Exportable evidence"], to: "/audit-logs", linkLabel: "Open audit logs" },
        { title: "Analytics & reporting", body: "Board-ready reporting on volumes, resolution rates and departmental exposure.", bullets: ["Trend analysis", "Department breakdown", "One-click export"], to: "/analytics", linkLabel: "Open analytics" },
      ]}
    />
  ),
});
