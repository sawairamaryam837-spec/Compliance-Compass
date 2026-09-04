import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvestigationBadge, PriorityBadge } from "@/components/badges";
import { EmptyState, PermissionState } from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import { formatDate, investigationStatusLabels } from "@/lib/data";
import { useApp } from "@/lib/store";
import { str } from "@/lib/search";

type InvestigationSearch = {
  status?: string;
  priority?: string;
  investigator?: string;
  department?: string;
  q?: string;
};

const investigationDefaults = {
  status: "all",
  priority: "all",
  investigator: "all",
  department: "all",
  q: "",
};

export const Route = createFileRoute("/_app/investigations/")({
  validateSearch: (search: Record<string, unknown>): InvestigationSearch => ({
    status: str(search["status"], "all"),
    priority: str(search["priority"], "all"),
    investigator: str(search["investigator"], "all"),
    department: str(search["department"], "all"),
    q: str(search["q"]),
  }),
  head: () => ({
    meta: [
      { title: "Investigations — Compliance Compass" },
      { name: "description", content: "Assign, track and document investigations with clear ownership and timelines." },
      { property: "og:title", content: "Investigations — Compliance Compass" },
      { property: "og:description", content: "Investigation workload across departments and investigators." },
    ],
  }),
  component: InvestigationsPage,
});

function InvestigationsPage() {
  const { investigations, departments, users, can } = useApp();
  const search = { ...investigationDefaults, ...Route.useSearch() };
  const navigate = useNavigate({ from: Route.fullPath });
  const [query, setQuery] = useState(search.q);

  const setParam = (patch: Record<string, string>) => navigate({ to: ".", search: (prev) => ({ ...prev, ...patch }) });

  const rows = useMemo(() => {
    const q = search.q.trim().toLowerCase();
    return investigations
      .filter((i) => (search.status === "all" ? true : i.status === search.status))
      .filter((i) => (search.priority === "all" ? true : i.priority === search.priority))
      .filter((i) => (search.investigator === "all" ? true : i.investigator === search.investigator))
      .filter((i) => (search.department === "all" ? true : i.department === search.department))
      .filter((i) => (q ? `${i.ref} ${i.title} ${i.investigator}`.toLowerCase().includes(q) : true));
  }, [investigations, search]);

  if (!can("view.investigations")) {
    return (
      <AppShell title="Investigations">
        <PermissionState resource="investigations" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Investigations"
      description="Every open and closed investigation, with investigator, status and due date."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Investigations" }]}
      actions={
        <Button asChild variant="outline">
          <Link to="/complaints" search={{}}>Open complaints</Link>
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
            <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Search investigations" aria-label="Search investigations" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select label="Status" value={search.status} onChange={(v) => setParam({ status: v })} options={[["all", "All statuses"], ...(Object.entries(investigationStatusLabels) as [string, string][])]} />
            <Select label="Priority" value={search.priority} onChange={(v) => setParam({ priority: v })} options={[["all", "All priorities"], ["critical", "Critical"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]]} />
            <Select label="Investigator" value={search.investigator} onChange={(v) => setParam({ investigator: v })} options={[["all", "All investigators"], ...users.filter((u) => u.role === "investigator" || u.role === "compliance_officer").map((u) => [u.name, u.name] as [string, string])]} />
            <Select label="Department" value={search.department} onChange={(v) => setParam({ department: v })} options={[["all", "All departments"], ...departments.map((d) => [d.name, d.name] as [string, string])]} />
            <Button type="submit" variant="outline">Apply</Button>
          </div>
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No investigations found." description="No investigations match the current filters." actionLabel="Review complaints" to="/complaints" />
        </div>
      ) : (
        <div className="surface mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <caption className="sr-only">Investigations</caption>
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3">Reference</th>
                <th scope="col" className="px-4 py-3">Title</th>
                <th scope="col" className="px-4 py-3">Investigator</th>
                <th scope="col" className="px-4 py-3">Department</th>
                <th scope="col" className="px-4 py-3">Priority</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Opened</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((i) => (
                <tr key={i.id} className="transition-colors hover:bg-muted/60">
                  <td className="px-4 py-3 font-medium">
                    <Link to="/investigations/$investigationId" params={{ investigationId: i.id }} className="text-accent hover:underline">{i.ref}</Link>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <Link to="/investigations/$investigationId" params={{ investigationId: i.id }} className="block truncate hover:underline">{i.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{i.investigator}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.department}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={i.priority} /></td>
                  <td className="px-4 py-3"><InvestigationBadge status={i.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(i.openedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
