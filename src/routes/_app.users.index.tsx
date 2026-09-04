import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { Input } from "@/components/ui/input";
import { Pill, RoleBadge } from "@/components/badges";
import { EmptyState, PermissionState } from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import { formatDate, roleLabels } from "@/lib/data";
import { useApp } from "@/lib/store";
import { str } from "@/lib/search";

type UserSearch = {
  role?: string;
  department?: string;
  q?: string;
};

const userDefaults = {
  role: "all",
  department: "all",
  q: "",
};

export const Route = createFileRoute("/_app/users/")({
  validateSearch: (search: Record<string, unknown>): UserSearch => ({
    role: str(search["role"], "all"),
    department: str(search["department"], "all"),
    q: str(search["q"]),
  }),
  head: () => ({
    meta: [
      { title: "Users & roles — Compliance Compass" },
      { name: "description", content: "Manage platform users, roles and access scope with a full change history." },
      { property: "og:title", content: "Users & roles — Compliance Compass" },
      { property: "og:description", content: "Role-based access control for the compliance platform." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const { users, departments, can } = useApp();
  const search = { ...userDefaults, ...Route.useSearch() };
  const navigate = useNavigate({ from: Route.fullPath });
  const [query, setQuery] = useState(search.q);

  const setParam = (patch: Record<string, string>) => navigate({ to: ".", search: (prev) => ({ ...prev, ...patch }) });

  if (!can("view.users")) {
    return (
      <AppShell title="Users & roles">
        <PermissionState resource="user management" />
      </AppShell>
    );
  }

  const rows = users
    .filter((u) => (search.role === "all" ? true : u.role === search.role))
    .filter((u) => (search.department === "all" ? true : u.department === search.department))
    .filter((u) => (search.q ? `${u.name} ${u.email} ${u.title}`.toLowerCase().includes(search.q.toLowerCase()) : true));

  return (
    <AppShell
      title="Users & roles"
      description="Access is governed by role. Role changes are recorded in the audit log."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Users & Roles" }]}
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
            <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Search people" aria-label="Search users" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select label="Role" value={search.role} onChange={(v) => setParam({ role: v })} options={[["all", "All roles"], ...(Object.entries(roleLabels) as [string, string][])]} />
            <Select label="Department" value={search.department} onChange={(v) => setParam({ department: v })} options={[["all", "All departments"], ...departments.map((d) => [d.name, d.name] as [string, string])]} />
          </div>
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No users found." description="Adjust the filters to see more people." actionLabel="Clear filters" onAction={() => { setQuery(""); navigate({ to: ".", search: { role: "all", department: "all", q: "" } }); }} />
        </div>
      ) : (
        <div className="surface mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <caption className="sr-only">Platform users</caption>
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Email</th>
                <th scope="col" className="px-4 py-3">Department</th>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Last activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-muted/60">
                  <td className="px-4 py-3 font-medium">
                    <Link to="/users/$userId" params={{ userId: u.id }} className="text-accent hover:underline">{u.name}</Link>
                    <span className="block text-xs font-normal text-muted-foreground">{u.title}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.department}</td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3"><Pill tone={u.status === "active" ? "success" : "danger"}>{u.status}</Pill></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(u.lastActivity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
