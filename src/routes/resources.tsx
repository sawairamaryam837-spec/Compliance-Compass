import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";
import resourcesHero from "@/assets/resources-hero.jpg";


export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Compliance Compass" },
      { name: "description", content: "Guides, templates, documentation and the compliance library for programme owners." },
      { property: "og:title", content: "Resources — Compliance Compass" },
      { property: "og:description", content: "Practical material for running a defensible compliance programme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Resources"
      title="Everything you need to run the programme well."
      image={resourcesHero}
      imageAlt="Compliance guides, templates and documentation on a desk"
      intro="Implementation guides, policy templates and technical documentation, written by people who have sat through the inspection."
      sections={[
        { title: "Guides", body: "Step-by-step playbooks for intake design, triage and investigation quality.", to: "/guides", linkLabel: "Browse guides" },
        { title: "Templates", body: "Policy, investigation report and risk assessment templates you can adapt today.", to: "/templates", linkLabel: "Browse templates" },
        { title: "Documentation", body: "Product documentation covering configuration, roles and retention.", to: "/docs", linkLabel: "Read the docs" },
        { title: "API reference", body: "Integrate case data with your data warehouse or GRC tooling.", to: "/api-reference", linkLabel: "View API reference" },
        { title: "Compliance library", body: "Regulatory summaries and control mappings maintained by our team.", to: "/compliance-library", linkLabel: "Open the library" },
        { title: "Help centre", body: "Answers to common questions, plus how to reach a human quickly.", to: "/help", linkLabel: "Get help" },
      ]}
    />
  ),
});
