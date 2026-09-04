import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileSearch,
  FolderSearch,
  MessageSquareWarning,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Pill, PriorityBadge } from "@/components/badges";
import { EmptyState } from "@/components/page-states";

import {
  formatDateTime,
  riskLevel,
  riskScore,
  statusLabels,
  type ComplaintStatus,
  type RiskLevel,
} from "@/lib/data";

import { useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Executive Dashboard — Compliance Compass",
      },
      {
        name: "description",
        content:
          "Compliance score, complaints, investigations, risks, evidence and audit activity in one governed view.",
      },
      {
        property: "og:title",
        content: "Executive Dashboard — Compliance Compass",
      },
      {
        property: "og:description",
        content:
          "Live compliance posture across complaints, investigations, risk, evidence and audit activity.",
      },
    ],
  }),

  component: Dashboard,
});

function Dashboard() {
  const {
    complaints,
    investigations,
    risks,
    tasks,
    auditLogs,
    user,
  } = useApp();

  /* -------------------------------------------------------
     DASHBOARD CALCULATIONS
  ------------------------------------------------------- */

  const openComplaints = complaints.filter(
    (c) => c.status !== "closed",
  );

  const openInvestigations = investigations.filter(
    (i) => i.status !== "completed",
  );

  const highRisks = risks.filter((r) =>
    ["critical", "high"].includes(
      riskLevel(riskScore(r)),
    ),
  );

  const closedThisMonth = complaints.filter(
    (c) => c.status === "closed",
  );

  const complianceScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 -
          openComplaints.length * 2 -
          highRisks.length * 3,
      ),
    ),
  );

  /* -------------------------------------------------------
     KPI DATA
  ------------------------------------------------------- */

  const kpis = [
    {
      label: "Compliance Score",
      value: `${complianceScore}%`,
      hint: "Weighted posture index",
      icon: ShieldCheck,
      to: "/analytics",
      search: {},
    },

    {
      label: "Total Complaints",
      value: complaints.length,
      hint: "All time",
      icon: MessageSquareWarning,
      to: "/complaints",
      search: {},
    },

    {
      label: "Open Cases",
      value: openComplaints.length,
      hint: "Awaiting closure",
      icon: ClipboardList,
      to: "/complaints",
      search: { status: "open" },
    },

    {
      label: "Investigations",
      value: openInvestigations.length,
      hint: "Active and in review",
      icon: FileSearch,
      to: "/investigations",
      search: { status: "active" },
    },

    {
      label: "High Risks",
      value: highRisks.length,
      hint: "Critical and high",
      icon: ShieldAlert,
      to: "/risks",
      search: { level: "high" },
    },

    {
      label: "Closed Cases",
      value: closedThisMonth.length,
      hint: "Resolved cases",
      icon: CheckCircle2,
      to: "/complaints",
      search: { status: "closed" },
    },
  ];

  /* -------------------------------------------------------
     COMPLAINT STATUS CHART
  ------------------------------------------------------- */

  const statusData = (
    [
      "open",
      "in_progress",
      "under_review",
      "closed",
    ] as ComplaintStatus[]
  ).map((status) => ({
    key: status,
    name: statusLabels[status],
    value: complaints.filter(
      (complaint) => complaint.status === status,
    ).length,
  }));

  const statusColors = [
    "var(--destructive)",
    "var(--accent)",
    "var(--warning)",
    "var(--success)",
  ];

  /* -------------------------------------------------------
     RISK CHART
  ------------------------------------------------------- */

  const riskData = (
    ["critical", "high", "medium", "low"] as RiskLevel[]
  ).map((level) => ({
    key: level,
    name:
      level.charAt(0).toUpperCase() +
      level.slice(1),
    value: risks.filter(
      (risk) =>
        riskLevel(riskScore(risk)) === level,
    ).length,
  }));

  const riskColors: Record<string, string> = {
    critical: "var(--destructive)",
    high: "var(--warning)",
    medium: "var(--chart-3)",
    low: "var(--success)",
  };

  /* -------------------------------------------------------
     MODULES
  ------------------------------------------------------- */

  const modules = [
    {
      title: "Risk Assessment",
      description:
        "Assess, score and monitor compliance risks.",
      icon: ClipboardCheck,
      to: "/risk-assessment",
    },

    {
      title: "Investigations",
      description:
        "Manage active and completed investigations.",
      icon: FileSearch,
      to: "/investigations",
    },

    {
      title: "Evidence",
      description:
        "Review and manage investigation evidence.",
      icon: FolderSearch,
      to: "/evidence",
    },

    {
      title: "Careers",
      description:
        "Manage career and employee compliance workflows.",
      icon: BriefcaseBusiness,
      to: "/careers",
    },

    {
      title: "Audit Logs",
      description:
        "Track compliance activity and system changes.",
      icon: ShieldCheck,
      to: "/audit-logs",
    },

    {
      title: "Complaints",
      description:
        "Review and manage reported compliance concerns.",
      icon: MessageSquareWarning,
      to: "/complaints",
    },

    {
      title: "Risks",
      description:
        "Monitor organizational risks and risk levels.",
      icon: ShieldAlert,
      to: "/risks",
    },

    {
      title: "Analytics",
      description:
        "View reports, trends and compliance metrics.",
      icon: ClipboardList,
      to: "/analytics",
    },
  ];

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  return (
    <AppShell
      title="Executive Overview"
      description={`Welcome back, ${
        user?.name?.split(" ")[0] ?? "User"
      }. Here is the current compliance posture for Northbridge Group.`}
      breadcrumbs={[
        {
          label: "Home",
          to: "/dashboard",
        },
        {
          label: "Executive Overview",
        },
      ]}
      actions={
        <>
          <Button asChild variant="outline">
            <Link to="/analytics">
              View reports
            </Link>
          </Button>

          <Button asChild>
            <Link to="/complaints/new">
              Report a Concern
            </Link>
          </Button>
        </>
      }
    >
      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <Link
              key={kpi.label}
              to={kpi.to}
              search={kpi.search as never}
              className="surface group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-(--shadow-elevated)"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                  <Icon
                    className="size-4"
                    aria-hidden="true"
                  />
                </span>

                <ArrowUpRight
                  className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>

              <p className="metric mt-4 text-3xl">
                {kpi.value}
              </p>

              <p className="mt-1 text-sm font-medium">
                {kpi.label}
              </p>

              <p className="text-xs text-muted-foreground">
                {kpi.hint}
              </p>
            </Link>
          );
        })}
      </div>

      {/* =====================================================
          COMPLIANCE WORKSPACE
      ====================================================== */}

      <section className="mt-6">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold">
            Compliance Workspace
          </h2>

          <p className="text-sm text-muted-foreground">
            Access all major compliance management modules.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.title}
                to={module.to}
                className="surface group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-(--shadow-elevated)"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                    <Icon
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <ArrowUpRight
                    className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-4 font-semibold">
                  {module.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {module.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          CHARTS
      ====================================================== */}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* COMPLAINT STATUS */}

        <section
          className="surface p-6"
          aria-labelledby="by-status"
        >
          <div className="flex items-center justify-between">
            <h2
              id="by-status"
              className="font-display text-base font-semibold"
            >
              Complaints by Status
            </h2>

            <Link
              to="/complaints"
              search={{}}
              className="text-sm font-semibold text-accent hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {statusData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.key}
                        fill={
                          statusColors[index]
                        }
                        className="cursor-pointer outline-none"
                      />
                    ),
                  )}
                </Pie>

                <RTooltip
                  contentStyle={{
                    borderRadius: 12,
                    border:
                      "1px solid var(--border)",
                    background:
                      "var(--card)",
                    color:
                      "var(--foreground)",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={24}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {statusData.map((status) => (
              <Link
                key={status.key}
                to="/complaints"
                search={{
                  status: status.key,
                }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/40 hover:bg-muted"
              >
                {status.name} ·{" "}
                {status.value}
              </Link>
            ))}
          </div>
        </section>

        {/* RISK LEVEL */}

        <section
          className="surface p-6"
          aria-labelledby="by-risk"
        >
          <div className="flex items-center justify-between">
            <h2
              id="by-risk"
              className="font-display text-base font-semibold"
            >
              Risks by Level
            </h2>

            <Link
              to="/risks"
              search={{}}
              className="text-sm font-semibold text-accent hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={riskData}
                margin={{
                  top: 8,
                  right: 8,
                  left: -18,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />

                <RTooltip
                  cursor={{
                    fill: "var(--muted)",
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border:
                      "1px solid var(--border)",
                    background:
                      "var(--card)",
                  }}
                />

                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                >
                  {riskData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={
                        riskColors[
                          entry.key
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {riskData.map((risk) => (
              <Link
                key={risk.key}
                to="/risks"
                search={{
                  level: risk.key,
                }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/40 hover:bg-muted"
              >
                {risk.name} ·{" "}
                {risk.value}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* =====================================================
          RECENT ACTIVITY + TASKS
      ====================================================== */}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* RECENT ACTIVITY */}

        <section
          className="surface p-6"
          aria-labelledby="activity"
        >
          <div className="flex items-center justify-between">
            <h2
              id="activity"
              className="font-display text-base font-semibold"
            >
              Recent Activity
            </h2>

            <Link
              to="/audit-logs"
              search={{}}
              className="text-sm font-semibold text-accent hover:underline"
            >
              View all
            </Link>
          </div>

          {auditLogs.length === 0 ? (
            <div className="mt-4">
              <EmptyState 
  title="No recent activity" 
  description="There are no audit activities to display yet."
  actionLabel="View Activity"
/>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {auditLogs
                .slice(0, 6)
                .map((log) => (
                  <li key={log.id}>
                    <Link
                      to="/audit-logs"
                      search={{
                        q: log.entityId,
                      }}
                      className="flex items-start justify-between gap-3 py-3 transition-colors hover:bg-muted/60"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {log.action.replace(
                            ".",
                            " · ",
                          )}
                        </span>

                        <span className="block truncate text-xs text-muted-foreground">
                          {log.user} ·{" "}
                          {log.entity}{" "}
                          {log.entityId}
                        </span>
                      </span>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDateTime(
                          log.at,
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </section>

        {/* TASKS */}

        <section
          className="surface p-6"
          aria-labelledby="tasks"
        >
          <div className="flex items-center justify-between">
            <h2
              id="tasks"
              className="font-display text-base font-semibold"
            >
              My Tasks
            </h2>

            <Pill tone="info">
              {tasks.length} assigned
            </Pill>
          </div>

          {tasks.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="Nothing assigned"
                description="You have no open tasks right now."
                actionLabel="Review complaints"
                to="/complaints"
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {tasks.map((task) => (
                <li key={task.id}>
                  <Link
                    to={task.href}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:border-accent/40 hover:bg-muted"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {task.label}
                      </span>

                      <span className="block text-xs text-muted-foreground">
                        Due {task.due}
                      </span>
                    </span>

                    <PriorityBadge
                      priority={task.priority}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <section className="mt-5 surface p-6">
        <div className="mb-4">
          <h2 className="font-display text-base font-semibold">
            Quick Actions
          </h2>

          <p className="text-sm text-muted-foreground">
            Start a common compliance workflow.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/complaints/new">
              Report a Concern
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
          >
           <Link to="/risk-assessment">
              Start Risk Assessment
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
          >
            <Link to="/investigations">
              Review Investigations
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
          >
            <Link to="/evidence">
              Review Evidence
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
          >
            <Link to="/audit-logs">
              View Audit Logs
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
          >
            <Link to="/analytics">
              Open Analytics
            </Link>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}