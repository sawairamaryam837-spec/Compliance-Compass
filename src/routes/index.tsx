import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, FileSearch, FolderLock, Activity, MessageSquareWarning, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/marketing/marketing-page";
import { Pill } from "@/components/badges";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Compliance Compass — Every concern on one auditable record" },
      {
        name: "description",
        content:
          "A single governed workflow from the moment a concern is raised to the moment it is closed, with database-enforced access control and a complete audit trail.",
      },
      { property: "og:title", content: "Compliance Compass" },
      {
        property: "og:description",
        content: "Governed intake, investigations, risk and audit for enterprise compliance teams.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { title: "Intake & Case Management", body: "Capture concerns from any channel and track them with structured workflows.", to: "/complaints", icon: MessageSquareWarning },
  { title: "Investigations", body: "Assign, investigate and document findings with clear timelines and accountability.", to: "/investigations", icon: FileSearch },
  { title: "Risk Management", body: "Identify, assess and mitigate risks across your organization.", to: "/risks", icon: ShieldAlert },
  { title: "Audit & Compliance", body: "Complete audit trail, reports and role-based access control.", to: "/audit-logs", icon: Activity },
];

function Landing() {
  return (
    <MarketingLayout>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24 lg:px-8">
          <div>
            <Pill tone="info">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Enterprise security · SOC 2 · ISO 27001 aligned
            </Pill>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              Every concern, investigation and risk — on one auditable record.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Compliance Compass gives compliance teams a single governed workflow from the moment a concern is raised
              to the moment it is closed, with database-enforced access control and a complete audit trail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/signin">
                  Sign in with Google Workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/complaints/new">Report a Concern</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground">
              <li className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-success" aria-hidden="true" />Enterprise security</li>
              <li className="flex items-center gap-1.5"><Users className="size-3.5 text-success" aria-hidden="true" />Role-based access</li>
              <li className="flex items-center gap-1.5"><Activity className="size-3.5 text-success" aria-hidden="true" />Complete audit trail</li>
            </ul>
          </div>

          <DashboardPreview />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">The platform</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">One connected compliance record</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Intake, investigation, evidence, risk and audit share the same governed data model — so nothing falls
            between systems.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="surface group flex flex-col p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-elevated)]"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                Open
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">Ready to see your compliance posture?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to the executive dashboard, or raise a concern without an account.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/dashboard">
                Open the dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Talk to our team</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

function DashboardPreview() {
  const kpis = [
    { label: "Compliance score", value: "94%", tone: "success" as const, to: "/analytics" },
    { label: "Open cases", value: "12", tone: "info" as const, to: "/complaints" },
    { label: "Investigations", value: "5", tone: "warning" as const, to: "/investigations" },
    { label: "High risks", value: "3", tone: "danger" as const, to: "/risks" },
  ];
  const rows = [
    { ref: "CC-2026-0148", title: "Undisclosed vendor relationship", to: "/complaints" },
    { ref: "CC-2026-0147", title: "Expense reimbursement irregularities", to: "/complaints" },
    { ref: "CC-INV-0040", title: "Customer data export incident", to: "/investigations" },
  ];
  return (
    <div className="surface overflow-hidden p-0 shadow-[var(--shadow-elevated)]">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-semibold">Executive Overview</span>
        </div>
        <Pill tone="success">Live</Pill>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to} className="rounded-xl border border-border p-4 transition-colors hover:border-accent/40 hover:bg-muted">
            <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
            <p className="metric mt-1.5 text-2xl">{k.value}</p>
            <Pill tone={k.tone} className="mt-2">Tracked</Pill>
          </Link>
        ))}
      </div>
      <div className="border-t border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent activity</p>
          <Link to="/dashboard" className="text-xs font-semibold text-accent hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.ref}>
              <Link to={r.to} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted">
                <span className="truncate">
                  <span className="font-medium">{r.ref}</span>
                  <span className="ml-2 text-muted-foreground">{r.title}</span>
                </span>
                <FolderLock className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
