import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/badges";
import { PermissionState } from "@/components/page-states";
import { monthlyTrend, riskLevel, riskScore, statusLabels, type ComplaintStatus } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics & reports — Compliance Compass" },
      { name: "description", content: "Trends, resolution times and departmental breakdowns across compliance activity." },
      { property: "og:title", content: "Analytics & reports — Compliance Compass" },
      { property: "og:description", content: "Board-ready compliance reporting built on live case data." },
    ],
  }),
  component: AnalyticsPage,
});

const statusTone: Record<ComplaintStatus, string> = {
  open: "bg-warning",
  in_progress: "bg-accent",
  under_review: "bg-primary",
  closed: "bg-success",
};

function AnalyticsPage() {
  const { complaints, investigations, risks, departments, can } = useApp();

  if (!can("view.analytics")) {
    return (
      <AppShell title="Analytics & reports">
        <PermissionState resource="analytics and reports" />
      </AppShell>
    );
  }

  const total = complaints.length;
  const closed = complaints.filter((c) => c.status === "closed").length;
  const byStatus = (Object.keys(statusLabels) as ComplaintStatus[]).map((s) => ({
    status: s,
    count: complaints.filter((c) => c.status === s).length,
  }));
  const maxTrend = Math.max(...monthlyTrend.map((m) => m.complaints), 1);

  return (
    <AppShell
      title="Analytics & reports"
      description="Live reporting across complaints, investigations and risk."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Analytics & Reports" }]}
      actions={
        <Button variant="outline" onClick={() => toast.success("Board report export queued.")}>
          <Download className="size-4" />
          Export report
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total complaints", value: total, to: "/complaints" as const },
          { label: "Resolution rate", value: `${total ? Math.round((closed / total) * 100) : 0}%`, to: "/complaints" as const },
          { label: "Active investigations", value: investigations.filter((i) => i.status !== "completed").length, to: "/investigations" as const },
          { label: "High & critical risks", value: risks.filter((r) => ["critical", "high"].includes(riskLevel(riskScore(r)))).length, to: "/risks" as const },
        ].map((kpi) => (
          <Link key={kpi.label} to={kpi.to} search={{}} className="surface p-5 transition-shadow hover:shadow-(--shadow-elevated)">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
            <p className="metric mt-1">{kpi.value}</p>
            <p className="mt-2 text-xs text-accent">View detail →</p>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="surface p-6">
          <h2 className="font-display text-base font-semibold">Complaints over time</h2>
          <ul className="mt-5 flex h-48 items-end gap-3">
            {monthlyTrend.map((m) => (
              <li key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className="w-full rounded-t-lg bg-accent/80 transition-colors hover:bg-accent"
                  style={{ height: `${Math.max(8, (m.complaints / maxTrend) * 100)}%` }}
                  title={`${m.month}: ${m.complaints} complaints`}
                />
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-6">
          <h2 className="font-display text-base font-semibold">Complaints by status</h2>
          <ul className="mt-4 space-y-3">
            {byStatus.map((s) => (
              <li key={s.status}>
                <Link to="/complaints" search={{ status: s.status }} className="block rounded-lg p-2 transition-colors hover:bg-muted">
                  <span className="flex items-center justify-between text-sm">
                    <span>{statusLabels[s.status]}</span>
                    <span className="font-semibold">{s.count}</span>
                  </span>
                  <span className="mt-1.5 block h-2 w-full overflow-hidden rounded-full bg-muted">
                    <span className={`block h-full rounded-full ${statusTone[s.status]}`} style={{ width: `${total ? (s.count / total) * 100 : 0}%` }} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-6 lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Department breakdown</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-160text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-3 py-3">Department</th>
                  <th scope="col" className="px-3 py-3">Complaints</th>
                  <th scope="col" className="px-3 py-3">Open</th>
                  <th scope="col" className="px-3 py-3">Investigations</th>
                  <th scope="col" className="px-3 py-3">Risk exposure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departments.map((d) => {
                  const dc = complaints.filter((c) => c.department === d.name);
                  const exposure = risks.filter((r) => r.department === d.name).reduce((a, r) => a + riskScore(r), 0);
                  return (
                    <tr key={d.id} className="transition-colors hover:bg-muted/60">
                      <td className="px-3 py-3 font-medium">
                        <Link to="/departments/$departmentId" params={{ departmentId: d.id }} className="text-accent hover:underline">{d.name}</Link>
                      </td>
                      <td className="px-3 py-3">{dc.length}</td>
                      <td className="px-3 py-3">{dc.filter((c) => c.status !== "closed").length}</td>
                      <td className="px-3 py-3">{investigations.filter((i) => i.department === d.name).length}</td>
                      <td className="px-3 py-3"><Pill tone={exposure >= 20 ? "danger" : exposure >= 10 ? "warning" : "success"}>{exposure}</Pill></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
