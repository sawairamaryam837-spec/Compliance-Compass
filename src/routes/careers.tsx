import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Compliance Compass" },
      { name: "description", content: "Join a small team of compliance practitioners and engineers building auditable software." },
      { property: "og:title", content: "Careers — Compliance Compass" },
      { property: "og:description", content: "Open roles across engineering, compliance advisory and customer success." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Careers"
      title="Work on software people rely on under pressure."
      intro="We hire slowly and give people real ownership. Every role touches customers and the product."
      primary={{ label: "Contact the team", to: "/contact" }}
      secondary={{ label: "About us", to: "/about" }}
      sections={[
        { title: "Senior product engineer", body: "TypeScript, React and data modelling for audit-grade systems. London or remote (UK).", to: "/contact", linkLabel: "Apply" },
        { title: "Compliance advisor", body: "Help customers design intake, triage and investigation practice. Ex-practitioner preferred.", to: "/contact", linkLabel: "Apply" },
        { title: "Customer success manager", body: "Own onboarding and quarterly reviews for enterprise accounts.", to: "/contact", linkLabel: "Apply" },
        { title: "Security engineer", body: "Access control, evidence custody and threat modelling for sensitive data.", to: "/security", linkLabel: "Read our security approach" },
        { title: "How we hire", body: "Three conversations, one paid practical exercise, decision within two weeks.", to: "/about", linkLabel: "About the team" },
        { title: "Nothing quite right?", body: "Send us a note anyway — we keep good people in mind.", to: "/contact", linkLabel: "Get in touch" },
      ]}
    />
  ),
});
