import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { PermissionState } from "@/components/page-states";
import { Pill } from "@/components/badges";
import { riskLevel, riskScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/departments/")({
  head: () => ({
    meta: [
      { title: "Departments — Compliance Compass" },
      { name: "description", content: "Compliance posture by department: open cases, investigations and risk exposure." },
      { property: "og:title", content: "Departments — Compliance Compass" },
      { property: "og:description", content: "See where compliance pressure sits across the organisation." },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const { departments, complaints, investigations, risks, users, can } = useApp();

  if (!can("view.departments")) {
    return (
      <AppShell title="Departments">
        <PermissionState resource="departments" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Departments"
      description="Compliance posture across every business unit."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Departments" }]}
    >
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((d) => {
          const open = complaints.filter((c) => c.department === d.name && c.status !== "closed").length;
          const inv = investigations.filter((i) => i.department === d.name && i.status !== "completed").length;
          const high = risks.filter((r) => r.department === d.name && ["critical", "high"].includes(riskLevel(riskScore(r)))).length;
          const people = users.filter((u) => u.department === d.name).length;
          return (
            <li key={d.id}>
              <Link
                to="/departments/$departmentId"
                params={{ departmentId: d.id }}
                className="surface flex h-full flex-col p-6 transition-shadow hover:shadow-[var(--shadow-elevated)]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Building2 className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display text-base font-semibold">{d.name}</span>
                    <span className="block text-xs text-muted-foreground">{d.region} · {d.employees} employees</span>
                  </span>
                </span>
                <span className="mt-4 text-sm text-muted-foreground">Manager: {d.manager}</span>
                <span className="mt-4 flex flex-wrap gap-2">
                  <Pill tone={open > 0 ? "warning" : "success"}>{open} open cases</Pill>
                  <Pill tone="neutral">{inv} investigations</Pill>
                  <Pill tone={high > 0 ? "danger" : "success"}>{high} high risks</Pill>
                  <Pill tone="neutral">{people} platform users</Pill>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
