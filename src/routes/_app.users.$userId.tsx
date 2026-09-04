import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Pill, RoleBadge, StatusBadge } from "@/components/badges";
import { ErrorState, PermissionState } from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import { formatDate, formatDateTime, roleLabels, type Role } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/users/$userId")({
  head: () => ({
    meta: [
      { title: "User profile — Compliance Compass" },
      { name: "description", content: "User role, access scope, assigned cases and recent audit activity." },
      { property: "og:title", content: "User profile — Compliance Compass" },
      { property: "og:description", content: "Role-based access and activity for a platform user." },
    ],
  }),
  component: UserDetail,
});

function UserDetail() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const { users, complaints, investigations, auditLogs, user: currentUser, can, setUserRole } = useApp();
  const person = users.find((u) => u.id === userId);

  if (!can("view.users")) {
    return (
      <AppShell title="User profile">
        <PermissionState resource="user management" />
      </AppShell>
    );
  }

  if (!person) {
    return (
      <AppShell title="User not found" breadcrumbs={[{ label: "Users & Roles", to: "/users" }, { label: "Not found" }]}>
        <ErrorState message="This user does not exist." onRetry={() => navigate({ to: "/users", search: {} })} />
      </AppShell>
    );
  }

  const isSelf = currentUser?.id === person.id;
  const canManage = can("manage.roles") && !isSelf;
  const assignedCases = complaints.filter((c) => c.assignee === person.name);
  const assignedInvestigations = investigations.filter((i) => i.investigator === person.name);
  const activity = auditLogs.filter((l) => l.user === person.name);

  return (
    <AppShell
      title={person.name}
      description={`${person.title} · ${person.department}`}
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Users & Roles", to: "/users" }, { label: person.name }]}
      actions={
        <>
          <Button variant="outline" onClick={() => navigate({ to: "/users", search: {} })}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Select
            label="Role"
            value={person.role}
            onChange={(v) => {
              if (!canManage) return;
              setUserRole(person.id, v as Role);
              toast.success(`${person.name} is now ${roleLabels[v as Role]}`);
            }}
            options={
              canManage
                ? (Object.entries(roleLabels) as [string, string][])
                : [[person.role, roleLabels[person.role]] as [string, string]]
            }
          />
        </>
      }
    >
      {isSelf ? (
        <p className="mb-4 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          You cannot change your own role. Ask another administrator to make this change.
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <section className="surface p-6">
          <h2 className="font-display text-base font-semibold">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Email", person.email],
              ["Department", person.department],
              ["Last activity", formatDate(person.lastActivity)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Role</dt>
              <dd><RoleBadge role={person.role} /></dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Status</dt>
              <dd><Pill tone={person.status === "active" ? "success" : "danger"}>{person.status}</Pill></dd>
            </div>
          </dl>
          <Button asChild variant="outline" className="mt-5 w-full">
            <Link to="/departments">View department</Link>
          </Button>
        </section>

        <div className="space-y-5">
          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">Assigned cases</h2>
            {assignedCases.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No cases assigned.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {assignedCases.map((c) => (
                  <li key={c.id} className="py-3">
                    <Link to="/complaints/$complaintId" params={{ complaintId: c.id }} className="flex items-center justify-between gap-3 hover:underline">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{c.title}</span>
                        <span className="block text-xs text-muted-foreground">{c.ref}</span>
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
            {assignedInvestigations.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No investigations assigned.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {assignedInvestigations.map((i) => (
                  <li key={i.id} className="py-3">
                    <Link to="/investigations/$investigationId" params={{ investigationId: i.id }} className="block text-sm hover:underline">
                      {i.ref} — {i.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">Recent activity</h2>
            {activity.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No audit entries for this user.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span>{a.action} · {a.entity}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(a.at)}</span>
                  </li>
                ))}
              </ul>
            )}
            {can("view.audit") ? (
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/audit-logs" search={{ q: person.name }}>Full audit trail</Link>
              </Button>
            ) : null}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
