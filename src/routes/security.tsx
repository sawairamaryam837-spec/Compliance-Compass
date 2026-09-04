import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — Compliance Compass" },
      { name: "description", content: "Encryption, least-privilege access, evidence custody and immutable audit logging." },
      { property: "og:title", content: "Security — Compliance Compass" },
      { property: "og:description", content: "How we protect the most sensitive records in your organisation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Security"
      title="Built for the most sensitive records you hold."
      intro="Whistleblowing reports and investigation files are among the highest-risk data in any organisation. The platform is designed accordingly."
      sections={[
        { title: "Access control", body: "Role-based permissions decide what each person can see. Denied attempts are logged, not hidden.", to: "/users", linkLabel: "See roles" },
        { title: "Evidence custody", body: "Every view and download of an evidence item is attributed and timestamped.", to: "/evidence", linkLabel: "See evidence vault" },
        { title: "Immutable audit trail", body: "Audit entries are append-only. Nobody, including administrators, can edit history.", to: "/audit-logs", linkLabel: "See audit logs" },
        { title: "Encryption", body: "TLS in transit and encryption at rest, with key rotation handled by the platform." },
        { title: "Identity", body: "Google Workspace single sign-on, so joiners and leavers are handled by your directory.", to: "/signin", linkLabel: "Sign in" },
        { title: "Retention", body: "Configurable retention windows per record class, enforced automatically.", to: "/settings", linkLabel: "Retention settings" },
      ]}
    />
  ),
});
