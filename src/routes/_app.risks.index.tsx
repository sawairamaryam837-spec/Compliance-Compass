import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiskBadge } from "@/components/badges";
import { EmptyState, PermissionState } from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import { formatDate, riskLevel, riskScore } from "@/lib/data";
import { useApp } from "@/lib/store";
import { str } from "@/lib/search";

type RiskSearch = {
  level?: string;
  status?: string;
  department?: string;
  q?: string;
};

const riskDefaults = {
  level: "all",
  status: "all",
  department: "all",
  q: "",
};

export const Route = createFileRoute("/_app/risks/")({
  validateSearch: (search: Record<string, unknown>): RiskSearch => ({
    level: str(search["level"], "all"),
    status: str(search["status"], "all"),
    department: str(search["department"], "all"),
    q: str(search["q"]),
  }),
  head: () => ({
    meta: [
      { title: "Risk register — Compliance Compass" },
      { name: "description", content: "Scored risk register with likelihood, impact, owners and mitigation plans." },
      { property: "og:title", content: "Risk register — Compliance Compass" },
      { property: "og:description", content: "Track and mitigate enterprise compliance risk." },
    ],
  }),
  component: RisksPage,
});

const statusLabels = { open: "Open", mitigating: "Mitigating", monitored: "Monitored", closed: "Closed" } as const;

function RisksPage() {
  const { risks, departments, can } = useApp();
  const search = { ...riskDefaults, ...Route.useSearch() };
  const navigate = useNavigate({ from: Route.fullPath });
  const [query, setQuery] = useState(search.q);

  const setParam = (patch: Record<string, string>) => navigate({ to: ".", search: (prev) => ({ ...prev, ...patch }) });

  const rows = useMemo(() => {
    const q = search.q.trim().toLowerCase();
    return risks
      .filter((r) => (search.level === "all" ? true : riskLevel(riskScore(r)) === search.level))
      .filter((r) => (search.status === "all" ? true : r.status === search.status))
      .filter((r) => (search.department === "all" ? true : r.department === search.department))
      .filter((r) => (q ? `${r.ref} ${r.title} ${r.owner}`.toLowerCase().includes(q) : true))
      .sort((a, b) => riskScore(b) - riskScore(a));
  }, [risks, search]);

  if (!can("view.risks")) {
    return (
      <AppShell title="Risk register">
        <PermissionState resource="the risk register" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Risk register"
      description="Risk score is likelihood × impact. Highest exposure first."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Risk Assessment" }]}
      actions={
        <Button asChild variant="outline">
          <Link to="/analytics">View analytics</Link>
        </Button>
      }
    >
      <div className="surface p-4">
        <form
          role="search"
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setParam({ q: query });
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Search risks" aria-label="Search risks" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select label="Level" value={search.level} onChange={(v) => setParam({ level: v })} options={[["all", "All levels"], ["critical", "Critical"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]]} />
            <Select label="Status" value={search.status} onChange={(v) => setParam({ status: v })} options={[["all", "All statuses"], ...(Object.entries(statusLabels) as [string, string][])]} />
            <Select label="Department" value={search.department} onChange={(v) => setParam({ department: v })} options={[["all", "All departments"], ...departments.map((d) => [d.name, d.name] as [string, string])]} />
            <Button type="submit" variant="outline">Apply</Button>
          </div>
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No risks found." description="No risks match the current filters." actionLabel="Clear filters" onAction={() => navigate({ to: ".", search: { level: "all", status: "all", department: "all", q: "" } })} />
        </div>
      ) : (
        <div className="surface mt-4 overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <caption className="sr-only">Risk register</caption>
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3">Reference</th>
                <th scope="col" className="px-4 py-3">Risk</th>
                <th scope="col" className="px-4 py-3">Owner</th>
                <th scope="col" className="px-4 py-3">Department</th>
                <th scope="col" className="px-4 py-3">L × I</th>
                <th scope="col" className="px-4 py-3">Score</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-muted/60">
                  <td className="px-4 py-3 font-medium">
                    <Link to="/risks/$riskId" params={{ riskId: r.id }} className="text-accent hover:underline">{r.ref}</Link>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <Link to="/risks/$riskId" params={{ riskId: r.id }} className="block truncate hover:underline">{r.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.owner}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.department}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.likelihood} × {r.impact}</td>
                  <td className="px-4 py-3"><RiskBadge level={riskLevel(riskScore(r))} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{statusLabels[r.status]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.reviewDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
