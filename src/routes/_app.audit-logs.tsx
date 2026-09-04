import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/badges";
import { EmptyState, PermissionState } from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import { formatDateTime } from "@/lib/data";
import { useApp } from "@/lib/store";
import { num, str } from "@/lib/search";

type AuditSearch = {
  q?: string;
  result?: string;
  entity?: string;
  page?: number;
};

const auditDefaults = {
  q: "",
  result: "all",
  entity: "all",
  page: 1,
};

export const Route = createFileRoute("/_app/audit-logs")({
  validateSearch: (search: Record<string, unknown>): AuditSearch => ({
    q: str(search["q"]),
    result: str(search["result"], "all"),
    entity: str(search["entity"], "all"),
    page: num(search["page"], 1),
  }),
  head: () => ({
    meta: [
      { title: "Audit logs — Compliance Compass" },
      { name: "description", content: "Immutable audit trail of every action taken across the compliance platform." },
      { property: "og:title", content: "Audit logs — Compliance Compass" },
      { property: "og:description", content: "Who did what, when, and from where." },
    ],
  }),
  component: AuditLogsPage,
});

const PAGE_SIZE = 12;

function AuditLogsPage() {
  const { auditLogs, can } = useApp();
  const search = { ...auditDefaults, ...Route.useSearch() };
  const navigate = useNavigate({ from: Route.fullPath });
  const [query, setQuery] = useState(search.q);

  const entities = useMemo(() => Array.from(new Set(auditLogs.map((l) => l.entity))), [auditLogs]);

  const filtered = auditLogs
    .filter((l) => (search.result === "all" ? true : l.result === search.result))
    .filter((l) => (search.entity === "all" ? true : l.entity === search.entity))
    .filter((l) => (search.q ? `${l.user} ${l.action} ${l.entity} ${l.entityId} ${l.department}`.toLowerCase().includes(search.q.toLowerCase()) : true));

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, search.page), pages);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!can("view.audit")) {
    return (
      <AppShell title="Audit logs">
        <PermissionState resource="audit logs" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Audit logs"
      description="Append-only record of platform activity. Entries can never be edited or deleted."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Audit Logs" }]}
      actions={
        <Button variant="outline" onClick={() => toast.success(`Export queued for ${filtered.length} entries.`)}>
          <Download className="size-4" />
          Export
        </Button>
      }
    >
      <div className="surface p-4">
        <form
          role="search"
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: ".", search: (prev) => ({ ...prev, q: query, page: 1 }) });
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Search by user, action or record" aria-label="Search audit logs" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select label="Entity" value={search.entity} onChange={(v) => navigate({ to: ".", search: (prev) => ({ ...prev, entity: v, page: 1 }) })} options={[["all", "All entities"], ...entities.map((e) => [e, e] as [string, string])]} />
            <Select label="Result" value={search.result} onChange={(v) => navigate({ to: ".", search: (prev) => ({ ...prev, result: v, page: 1 }) })} options={[["all", "All results"], ["success", "Success"], ["denied", "Denied"]]} />
            <Button type="submit" variant="outline">Apply</Button>
          </div>
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No audit entries found."
            description="No activity matches these filters."
            actionLabel="Clear filters"
            onAction={() => { setQuery(""); navigate({ to: ".", search: { q: "", result: "all", entity: "all", page: 1 } }); }}
          />
        </div>
      ) : (
        <>
          <div className="surface mt-4 overflow-x-auto">
            <table className="w-full min-w-225 text-sm">
              <caption className="sr-only">Audit log entries</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-4 py-3">Timestamp</th>
                  <th scope="col" className="px-4 py-3">User</th>
                  <th scope="col" className="px-4 py-3">Action</th>
                  <th scope="col" className="px-4 py-3">Record</th>
                  <th scope="col" className="px-4 py-3">Department</th>
                  <th scope="col" className="px-4 py-3">IP</th>
                  <th scope="col" className="px-4 py-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-muted/60">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDateTime(l.at)}</td>
                    <td className="px-4 py-3 font-medium">{l.user}</td>
                    <td className="px-4 py-3">{l.action}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.entity} · {l.entityId}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.department}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.ip}</td>
                    <td className="px-4 py-3"><Pill tone={l.result === "success" ? "success" : "danger"}>{l.result}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav aria-label="Pagination" className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate({ to: ".", search: (prev) => ({ ...prev, page: page - 1 }) })}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => navigate({ to: ".", search: (prev) => ({ ...prev, page: page + 1 }) })}>Next</Button>
            </div>
          </nav>
        </>
      )}
    </AppShell>
  );
}
