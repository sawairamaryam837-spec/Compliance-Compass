import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";
import solutionsHero from "@/assets/solutions-hero.jpg";


export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Compliance Compass" },
      { name: "description", content: "Solutions for financial services, healthcare, manufacturing and public sector compliance teams." },
      { property: "og:title", content: "Solutions — Compliance Compass" },
      { property: "og:description", content: "Configured for the regulatory pressure your sector actually faces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Solutions"
      title="Built for teams accountable to regulators."
      image={solutionsHero}
      imageAlt="Compliance team reviewing regulatory documents in a meeting room"
      intro="Whether you answer to the FCA, a health inspectorate or an internal audit committee, the workflow is the same: capture, investigate, evidence, report."
      sections={[
        { title: "Financial services", body: "Whistleblowing, conduct risk and conflicts of interest with regulator-ready evidence packs.", bullets: ["SMCR-aligned ownership", "Conduct risk register", "Retention policy controls"], to: "/complaints", linkLabel: "See intake" },
        { title: "Healthcare", body: "Patient safety concerns, safeguarding referrals and incident investigation.", bullets: ["Confidential intake", "Safeguarding escalation", "Investigation timelines"], to: "/investigations", linkLabel: "See investigations" },
        { title: "Manufacturing & energy", body: "Health, safety and environmental concerns tied to site-level risk exposure.", bullets: ["Site risk scoring", "Contractor concerns", "Corrective action tracking"], to: "/risks", linkLabel: "See risk register" },
        { title: "Public sector", body: "Transparency obligations met with an immutable trail of every decision.", bullets: ["FOI-ready records", "Role-based access", "Audit export"], to: "/audit-logs", linkLabel: "See audit logs" },
        { title: "Internal audit", body: "Give the audit committee live numbers instead of a quarterly spreadsheet.", bullets: ["Live dashboards", "Departmental exposure", "Resolution rates"], to: "/analytics", linkLabel: "See analytics" },
        { title: "Multi-entity groups", body: "Departments, regions and managers modelled so accountability is never ambiguous.", bullets: ["Department views", "Manager ownership", "Region reporting"], to: "/departments", linkLabel: "See departments" },
      ]}
    />
  ),
});
