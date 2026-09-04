import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Compliance Compass" },
      { name: "description", content: "Advisory and implementation partners who deliver compliance programmes on Compliance Compass." },
      { property: "og:title", content: "Partners — Compliance Compass" },
      { property: "og:description", content: "Work with advisors who implement the whole programme, not just the software." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Partners"
      title="Implementation partners who know the regulation."
      intro="Our partners deliver policy design, investigator training and programme assurance alongside the platform."
      primary={{ label: "Become a partner", to: "/contact" }}
      secondary={{ label: "See solutions", to: "/solutions" }}
      sections={[
        { title: "Advisory firms", body: "Policy design, control mapping and regulator readiness reviews.", to: "/compliance-library", linkLabel: "Control mappings" },
        { title: "Investigation specialists", body: "Independent investigators available for conflicted or high-severity matters.", to: "/investigations", linkLabel: "See investigations" },
        { title: "Technology partners", body: "Data warehouse, SIEM and GRC integrations via the API.", to: "/api-reference", linkLabel: "API reference" },
        { title: "Training providers", body: "Investigator and manager training aligned to the platform workflow.", to: "/guides", linkLabel: "See guides" },
        { title: "Referral programme", body: "Refer an organisation and we'll handle the rest, with revenue share.", to: "/contact", linkLabel: "Talk to us" },
        { title: "Partner support", body: "Dedicated technical contact and sandbox workspaces for every partner.", to: "/help", linkLabel: "Get help" },
      ]}
    />
  ),
});
