import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PermissionState } from "@/components/page-states";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { CATEGORIES, formatDate, statusLabels, type ComplaintStatus, type Priority } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { num, str } from "@/lib/search";

type ComplaintSearch = {
  status?: string;
  priority?: string;
  category?: string;
  department?: string;
  q?: string;
  page?: number;
};

const complaintDefaults = {
  status: "all",
  priority: "all",
  category: "all",
  department: "all",
  q: "",
  page: 1,
};

export const Route = createFileRoute("/_app/complaints/")({
  validateSearch: (search: Record<string, unknown>): ComplaintSearch => ({
    status: str(search["status"], "all"),
    priority: str(search["priority"], "all"),
    category: str(search["category"], "all"),
    department: str(search["department"], "all"),
    q: str(search["q"]),
    page: num(search["page"], 1),
  }),
  head: () => ({
    meta: [
      { title: "Complaints — Compliance Compass" },
      { name: "description", content: "Search, filter and triage every concern raised across the organisation." },
      { property: "og:title", content: "Complaints — Compliance Compass" },
      { property: "og:description", content: "Governed intake and case management for compliance teams." },
    ],
  }),
  component: ComplaintsPage,
});

const PAGE_SIZE = 6;

function ComplaintsPage() {
  const { complaints, departments, can } = useApp();
  const search = { ...complaintDefaults, ...Route.useSearch() };
  const navigate = useNavigate({ from: Route.fullPath });
  const [query, setQuery] = useState(search.q);

  const setParam = (patch: Record<string, string | number>) =>
    navigate({ to: ".", search: (prev) => ({ ...prev, page: 1, ...patch }) });

  const filtered = useMemo(() => {
    const q = search.q.trim().toLowerCase();
    return complaints
      .filter((c) => (search.status === "all" ? true : c.status === search.status))
      .filter((c) => (search.priority === "all" ? true : c.priority === search.priority))
      .filter((c) => (search.category === "all" ? true : c.category === search.category))
      .filter((c) => (search.department === "all" ? true : c.department === search.department))
      .filter((c) => (q ? `${c.ref} ${c.title} ${c.description} ${c.assignee ?? ""}`.toLowerCase().includes(q) : true))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [complaints, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(search.page, pages);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!can("view.complaints")) {
    return (
      <AppShell title="Complaints">
        <PermissionState resource="complaints" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Complaints"
      description="Every concern raised across the organisation, with triage status, ownership and priority."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Complaints" }]}
      actions={
        <Button asChild>
          <Link to="/complaints/new">
            <Plus className="size-4" />
            Create Complaint
          </Link>
        </Button>
      }
    >
      <div className="surface p-4">
        <form
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setParam({ q: query });
          }}
          role="search"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by reference, title or investigator"
              aria-label="Search complaints"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select label="Status" value={search.status} onChange={(v) => setParam({ status: v })} options={[["all", "All statuses"], ...Object.entries(statusLabels)]} />
            <Select label="Priority" value={search.priority} onChange={(v) => setParam({ priority: v })} options={[["all", "All priorities"], ["critical", "Critical"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]]} />
            <Select label="Category" value={search.category} onChange={(v) => setParam({ category: v })} options={[["all", "All categories"], ...CATEGORIES.map((c) => [c, c] as [string, string])]} />
            <Select label="Department" value={search.department} onChange={(v) => setParam({ department: v })} options={[["all", "All departments"], ...departments.map((d) => [d.name, d.name] as [string, string])]} />
            <Button type="submit" variant="outline">
              <Filter className="size-4" />
              Apply
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Showing {rows.length} of {filtered.length} complaints
      </p>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No complaints found."
            description="No cases match the current filters. Adjust the filters or raise a new concern."
            actionLabel="Create Complaint"
            to="/complaints/new"
          />
        </div>
      ) : (
        <div className="surface mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <caption className="sr-only">Complaints</caption>
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-semibold">Reference</th>
                <th scope="col" className="px-4 py-3 font-semibold">Title</th>
                <th scope="col" className="px-4 py-3 font-semibold">Department</th>
                <th scope="col" className="px-4 py-3 font-semibold">Priority</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Assignee</th>
                <th scope="col" className="px-4 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-muted/60">
                  <td className="px-4 py-3 font-medium">
                    <Link to="/complaints/$complaintId" params={{ complaintId: c.id }} className="text-accent hover:underline">
                      {c.ref}
                    </Link>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <Link to="/complaints/$complaintId" params={{ complaintId: c.id }} className="block truncate hover:underline">
                      {c.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.department}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={c.priority as Priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.status as ComplaintStatus} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.assignee ?? "Unassigned"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 ? (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate({ to: ".", search: (prev) => ({ ...prev, page: page - 1 }) })}>
            Previous
          </Button>
          <ul className="flex items-center gap-1">
            {Array.from({ length: pages }).map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-current={page === i + 1 ? "page" : undefined}
                  onClick={() => navigate({ to: ".", search: (prev) => ({ ...prev, page: i + 1 }) })}
                  className={cn(
                    "size-8 rounded-lg border text-xs font-medium transition-colors",
                    page === i + 1 ? "border-accent bg-accent text-accent-foreground" : "border-border hover:bg-muted",
                  )}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => navigate({ to: ".", search: (prev) => ({ ...prev, page: page + 1 }) })}>
            Next
          </Button>
        </nav>
      ) : null}
    </AppShell>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-muted-foreground focus-within:border-accent">
      <span className="sr-only sm:not-sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="h-9 bg-transparent pr-1 text-xs font-medium text-foreground outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
