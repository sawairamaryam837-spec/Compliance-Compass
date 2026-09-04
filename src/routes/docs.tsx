import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — Compliance Compass" },
      { name: "description", content: "Configuration, roles, retention and workflow documentation for administrators." },
      { property: "og:title", content: "Documentation — Compliance Compass" },
      { property: "og:description", content: "Everything an administrator needs to configure the platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <MarketingPage
      eyebrow="Documentation"
      title="Configure the platform with confidence."
      intro="Reference material for administrators and compliance officers running the workspace day to day."
      sections={[
        { title: "Getting started", body: "Connect Google Workspace, invite your team and set departmental ownership.", to: "/settings", linkLabel: "Open settings" },
        { title: "Roles & permissions", body: "What each of the four roles can see and do, and how to change assignments safely.", to: "/users", linkLabel: "Manage roles" },
        { title: "Intake configuration", body: "Categories, severity levels, anonymity and required fields on the concern form.", to: "/complaints/new", linkLabel: "See intake form" },
        { title: "Investigation workflow", body: "Statuses, due dates, findings and how the timeline is assembled.", to: "/investigations", linkLabel: "See investigations" },
        { title: "Risk scoring", body: "How likelihood × impact maps to critical, high, medium and low.", to: "/risks", linkLabel: "See risk register" },
        { title: "API reference", body: "Endpoints, authentication and pagination for programmatic access.", to: "/api-reference", linkLabel: "Open API reference" },
      ]}
    />
  ),
});
