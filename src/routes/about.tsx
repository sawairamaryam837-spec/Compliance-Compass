import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";
import aboutHero from "@/assets/about-hero.jpg";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Compliance Compass" },
      { name: "description", content: "Why we built a single auditable record for concerns, investigations and risk." },
      { property: "og:title", content: "About — Compliance Compass" },
      { property: "og:description", content: "A compliance platform built by people who have run the programme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="About"
      title="Compliance work deserves better than a shared inbox."
      image={aboutHero}
      imageAlt="Compliance practitioners and engineers collaborating at a whiteboard"
      intro="We built Compliance Compass after watching too many investigations run out of email threads and spreadsheets — with no way to prove, months later, who knew what and when."
      sections={[
        { title: "Our principles", body: "Auditable by default. Least privilege by default. No silent edits, ever.", bullets: ["Append-only audit trail", "Role-based access", "Evidence chain of custody"] },
        { title: "Who we serve", body: "Compliance officers, investigators, internal audit and the executives who answer for them.", to: "/solutions", linkLabel: "See solutions" },
        { title: "How we work", body: "Short implementation, opinionated defaults, and a team that answers the phone.", to: "/contact", linkLabel: "Talk to us" },
        { title: "Careers", body: "We're a small team of compliance practitioners and engineers.", to: "/careers", linkLabel: "See open roles" },
        { title: "Partners", body: "We work with advisory firms who implement compliance programmes end to end.", to: "/partners", linkLabel: "Partner with us" },
        { title: "Security", body: "Encryption in transit and at rest, least-privilege access, and full activity logging.", to: "/security", linkLabel: "Read security overview" },
      ]}
    />
  ),
});
