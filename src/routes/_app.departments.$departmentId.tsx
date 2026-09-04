import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { InvestigationBadge, Pill, RiskBadge, RoleBadge, StatusBadge } from "@/components/badges";
import { EmptyState, ErrorState, PermissionState } from "@/components/page-states";
import { formatDate, riskLevel, riskScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/departments/$departmentId")({
  head: () => ({
    meta: [
      { title: "Department detail — Compliance Compass" },
      { name: "description", content: "Department cases, investigations, risks and team members in one view." },
      { property: "og:title", content: "Department detail — Compliance Compass" },
      { property: "og:description", content: "Departmental compliance posture at a glance." },
    ],
  }),
  component: DepartmentDetail,
});

function DepartmentDetail() {
  const { departmentId } = Route.useParams();
  const navigate = useNavigate();
  const { departments, complaints, investigations, risks, users, can } = useApp();
  const department = departments.find((d) => d.id === departmentId);

  if (!can("view.departments")) {
    return (
      <AppShell title="Department">
        <PermissionState resource="departments" />
      </AppShell>
    );
  }

  if (!department) {
    return (
      <AppShell title="Department not found" breadcrumbs={[{ label: "Departments", to: "/departments" }, { label: "Not found" }]}>
        <ErrorState message="This department does not exist." onRetry={() => navigate({ to: "/departments" })} />
      </AppShell>
    );
  }

  const deptComplaints = complaints.filter((c) => c.department === department.name);
  const deptInvestigations = investigations.filter((i) => i.department === department.name);
  const deptRisks = risks.filter((r) => r.department === department.name);
  const team = users.filter((u) => u.department === department.name);

  return (
    <AppShell
      title={department.name}
      description={`${department.region} · ${department.employees} employees · Manager ${department.manager}`}
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Departments", to: "/departments" }, { label: department.name }]}
      actions={
        <Button variant="outline" onClick={() => navigate({ to: "/departments" })}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Cases", deptComplaints.length, "/complaints"],
          ["Investigations", deptInvestigations.length, "/investigations"],
          ["Risks", deptRisks.length, "/risks"],
        ].map(([label, value]) => (
          <div key={label as string} className="surface p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="metric mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="surface p-6">
          <h2 className="font-display text-base font-semibold">Complaints</h2>
          {deptComplaints.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No complaints recorded for this department.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {deptComplaints.map((c) => (
                <li key={c.id} className="py-3">
                  <Link to="/complaints/$complaintId" params={{ complaintId: c.id }} className="flex items-center justify-between gap-3 hover:underline">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{c.title}</span>
                      <span className="block text-xs text-muted-foreground">{c.ref} · {formatDate(c.createdAt)}</span>
                    </span>
                    <StatusBadge status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface p-6">
          <h2 className="font-display text-base font-semibold">Investigations</h2>
          {deptInvestigations.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No investigations for this department.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {deptInvestigations.map((i) => (
                <li key={i.id} className="py-3">
                  <Link to="/investigations/$investigationId" params={{ investigationId: i.id }} className="flex items-center justify-between gap-3 hover:underline">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{i.title}</span>
                      <span className="block text-xs text-muted-foreground">{i.ref} · {i.investigator}</span>
                    </span>
                    <InvestigationBadge status={i.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface p-6">
          <h2 className="font-display text-base font-semibold">Risks</h2>
          {deptRisks.length === 0 ? (
            <div className="mt-3">
              <EmptyState title="No risks logged" description="This department has no entries in the risk register." actionLabel="Open risk register" to="/risks" />
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {deptRisks.map((r) => (
                <li key={r.id} className="py-3">
                  <Link to="/risks/$riskId" params={{ riskId: r.id }} className="flex items-center justify-between gap-3 hover:underline">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{r.title}</span>
                      <span className="block text-xs text-muted-foreground">{r.ref} · score {riskScore(r)}</span>
                    </span>
                    <RiskBadge level={riskLevel(riskScore(r))} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface p-6">
          <h2 className="font-display text-base font-semibold">Team</h2>
          <ul className="mt-3 divide-y divide-border">
            {team.map((u) => (
              <li key={u.id} className="py-3">
                {can("view.users") ? (
                  <Link to="/users/$userId" params={{ userId: u.id }} className="flex items-center justify-between gap-3 hover:underline">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{u.name}</span>
                      <span className="block text-xs text-muted-foreground">{u.title}</span>
                    </span>
                    <RoleBadge role={u.role} />
                  </Link>
                ) : (
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{u.name}</span>
                    <Pill tone="neutral">{u.title}</Pill>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
