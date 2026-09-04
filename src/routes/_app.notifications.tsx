import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/badges";
import { EmptyState } from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import { formatDateTime } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Compliance Compass" },
      { name: "description", content: "Case assignments, escalations, risk reviews and system alerts in one inbox." },
      { property: "og:title", content: "Notifications — Compliance Compass" },
      { property: "og:description", content: "Stay ahead of escalations and overdue reviews." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useApp();
  const [filter, setFilter] = useState("all");

  const rows = notifications.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.read : n.kind === filter,
  );

  return (
    <AppShell
      title="Notifications"
      description={`${unreadCount} unread of ${notifications.length} total.`}
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Notifications" }]}
      actions={
        <Button
          variant="outline"
          disabled={unreadCount === 0}
          onClick={() => {
            markAllRead();
            toast.success("All notifications marked as read.");
          }}
        >
          <CheckCheck className="size-4" />
          Mark all read
        </Button>
      }
    >
      <div className="surface flex flex-wrap items-center gap-3 p-4">
        <Select
          label="Filter"
          value={filter}
          onChange={setFilter}
          options={[
            ["all", "All notifications"],
            ["unread", "Unread only"],
            ["complaint", "Complaints"],
            ["investigation", "Investigations"],
            ["risk", "Risks"],
            ["task", "Tasks"],
            ["system", "System"],
          ]}
        />
        <Pill tone={unreadCount > 0 ? "warning" : "success"}>{unreadCount} unread</Pill>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="You're all caught up." description="No notifications match this filter." actionLabel="Back to dashboard" to="/dashboard" />
        </div>
      ) : (
        <ul className="surface mt-4 divide-y divide-border">
          {rows.map((n) => (
            <li key={n.id} className={n.read ? "" : "bg-accent/5"}>
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Bell className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.at)} · {n.kind}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!n.read ? (
                    <Button size="sm" variant="outline" onClick={() => markRead(n.id)}>Mark read</Button>
                  ) : null}
                  <Button asChild size="sm" onClick={() => markRead(n.id)}>
                    <Link to={n.kind === "risk" ? "/risks" : n.kind === "investigation" ? "/investigations" : n.kind === "complaint" ? "/complaints" : "/dashboard"} search={{}}>
                      Open
                    </Link>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
