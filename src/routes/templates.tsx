import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Compliance Compass" },
      { name: "description", content: "Policy, investigation report, risk assessment and closure letter templates you can adapt." },
      { property: "og:title", content: "Templates — Compliance Compass" },
      { property: "og:description", content: "Ready-to-adapt documents for your compliance programme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Templates"
      title="Documents you can adapt this afternoon."
      intro="Drafted with counsel and used in live programmes. Adapt to your jurisdiction before adopting."
      sections={[
        { title: "Whistleblowing policy", body: "Scope, protections, channels and escalation, written in plain language.", to: "/complaints/new", linkLabel: "See intake" },
        { title: "Investigation plan", body: "Scope, hypotheses, interview list and evidence requirements.", to: "/investigations", linkLabel: "Open investigations" },
        { title: "Investigation report", body: "Findings, evidence references, conclusions and recommended actions.", to: "/investigations", linkLabel: "Open investigations" },
        { title: "Risk assessment", body: "Likelihood and impact definitions with a consistent five-point scale.", to: "/risks", linkLabel: "Open risk register" },
        { title: "Closure letter", body: "Notifying a reporter that their concern has been resolved.", to: "/complaints", linkLabel: "Open complaints" },
        { title: "Board report", body: "Two-page quarterly summary for the audit committee.", to: "/analytics", linkLabel: "Open analytics" },
      ]}
    />
  ),
});
