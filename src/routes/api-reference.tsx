import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/api-reference")({
  head: () => ({
    meta: [
      { title: "API reference — Compliance Compass" },
      { name: "description", content: "Read case, investigation, risk and audit data programmatically with scoped tokens." },
      { property: "og:title", content: "API reference — Compliance Compass" },
      { property: "og:description", content: "Integrate compliance data with your warehouse or GRC tooling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="API reference"
      title="Read your compliance data where you need it."
      intro="Scoped, read-mostly tokens with the same role-based restrictions as the interface. Every API call is written to the audit log."
      primary={{ label: "Request API access", to: "/contact" }}
      secondary={{ label: "Read the docs", to: "/docs" }}
      sections={[
        { title: "Authentication", body: "Bearer tokens issued per integration, scoped to a role and revocable at any time.", to: "/security", linkLabel: "Security model" },
        { title: "Cases", body: "List and read complaints with status, priority, department and assignment.", to: "/complaints", linkLabel: "See cases" },
        { title: "Investigations", body: "Read investigation status, investigator, due dates and findings metadata.", to: "/investigations", linkLabel: "See investigations" },
        { title: "Risks", body: "Read the register including likelihood, impact, computed score and owner.", to: "/risks", linkLabel: "See risks" },
        { title: "Audit events", body: "Stream audit entries into your SIEM with cursor pagination.", to: "/audit-logs", linkLabel: "See audit logs" },
        { title: "Rate limits", body: "600 requests per minute per token, with standard retry-after headers.", to: "/help", linkLabel: "Get help" },
      ]}
    />
  ),
});
