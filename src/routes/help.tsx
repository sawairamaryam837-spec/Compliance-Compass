import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help centre — Compliance Compass" },
      { name: "description", content: "Answers on access, reporting a concern, case status and evidence handling." },
      { property: "og:title", content: "Help centre — Compliance Compass" },
      { property: "og:description", content: "Get unstuck quickly, or reach a human." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Help centre"
      title="Answers, and a way to reach a person."
      intro="Most questions are covered below. If yours isn't, contact us and we'll respond within one business day."
      sections={[
        { title: "I can't sign in", body: "Access uses your Google Workspace account. If sign-in fails, your administrator may not have provisioned you yet.", to: "/contact", linkLabel: "Request access" },
        { title: "How do I report a concern?", body: "Use the concern form. You can submit anonymously; you will still receive a case reference.", to: "/complaints/new", linkLabel: "Report a concern" },
        { title: "What happens after I report?", body: "The case is triaged within one business day, assigned an owner, and tracked to closure.", to: "/complaints", linkLabel: "Track cases" },
        { title: "Who can see my report?", body: "Only compliance officers and the assigned investigator. Every access is logged.", to: "/security", linkLabel: "Read security overview" },
        { title: "Service status", body: "Check current availability and any planned maintenance windows.", to: "/status", linkLabel: "View status" },
        { title: "Still stuck?", body: "Email the compliance team directly and we'll pick it up.", to: "/contact", linkLabel: "Contact us" },
      ]}
    />
  ),
});
