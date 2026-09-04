import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileWarning,
  Loader2,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/risk-assessment")({
  component: RouteComponent,
});

type RiskAssessment = {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  category: string | null;
  likelihood: number | null;
  impact: number | null;
  risk_score: number | null;
  risk_level: string | null;
  status: string | null;
  owner: string | null;
  mitigation: string | null;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabaseKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

const supabase = createClient(supabaseUrl, supabaseKey);

function RouteComponent() {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRiskAssessments();
  }, []);

  async function loadRiskAssessments() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("risk_assessments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Risk assessment error:", error);
      setError(error.message);
      setAssessments([]);
    } else {
      setAssessments(data ?? []);
    }

    setLoading(false);
  }

  const stats = useMemo(() => {
    const total = assessments.length;

    const high = assessments.filter(
      (item) => item.risk_level?.toLowerCase() === "high",
    ).length;

    const medium = assessments.filter(
      (item) => item.risk_level?.toLowerCase() === "medium",
    ).length;

    const low = assessments.filter(
      (item) => item.risk_level?.toLowerCase() === "low",
    ).length;

    const critical = assessments.filter(
      (item) => item.risk_level?.toLowerCase() === "critical",
    ).length;

    const averageScore =
      total > 0
        ? Math.round(
            assessments.reduce(
              (sum, item) => sum + Number(item.risk_score ?? 0),
              0,
            ) / total,
          )
        : 0;

    const open = assessments.filter(
      (item) => item.status?.toLowerCase() === "open",
    ).length;

    return {
      total,
      high,
      medium,
      low,
      critical,
      averageScore,
      open,
    };
  }, [assessments]);

  const riskPercentage = (count: number) => {
    if (!stats.total) return 0;
    return Math.round((count / stats.total) * 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-600">
                <ShieldCheck className="size-4" />
                Compliance & Risk Management
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Risk Assessment
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Monitor, evaluate, and manage organizational risks from one
                centralized dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRiskAssessments}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <TrendingUp className="size-4" />
              Refresh Assessment
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />

            <div>
              <p className="font-semibold">Unable to load risk assessments</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Assessments"
            value={stats.total}
            description="All recorded assessments"
            icon={<FileWarning className="size-5" />}
            trend="Overall portfolio"
          />

          <StatCard
            title="High & Critical"
            value={stats.high + stats.critical}
            description="Require priority attention"
            icon={<AlertTriangle className="size-5" />}
            trend={
              stats.total
                ? `${riskPercentage(stats.high + stats.critical)}% of total`
                : "0% of total"
            }
            danger
          />

          <StatCard
            title="Average Risk Score"
            value={stats.averageScore}
            description="Across all assessments"
            icon={<Target className="size-5" />}
            trend="Current average"
          />

          <StatCard
            title="Open Risks"
            value={stats.open}
            description="Awaiting resolution"
            icon={<Clock3 className="size-5" />}
            trend="Needs monitoring"
          />
        </div>

        {/* Risk Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="surface p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Risk Overview</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Distribution of identified organizational risks.
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BarChart3 className="size-5" />
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <RiskBar
                label="Critical"
                count={stats.critical}
                percentage={riskPercentage(stats.critical)}
                className="bg-red-500"
              />

              <RiskBar
                label="High"
                count={stats.high}
                percentage={riskPercentage(stats.high)}
                className="bg-orange-500"
              />

              <RiskBar
                label="Medium"
                count={stats.medium}
                percentage={riskPercentage(stats.medium)}
                className="bg-yellow-500"
              />

              <RiskBar
                label="Low"
                count={stats.low}
                percentage={riskPercentage(stats.low)}
                className="bg-green-500"
              />
            </div>
          </section>

          {/* Risk Score */}
          <section className="surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Risk Health</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current portfolio health
                </p>
              </div>

              <ShieldCheck className="size-5 text-blue-600" />
            </div>

            <div className="mt-8 flex items-center justify-center">
              <div className="relative flex size-44 items-center justify-center rounded-full border-[14px] border-blue-100">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {stats.averageScore}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    Avg. Score
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-xl bg-blue-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Risk monitoring active
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Continue reviewing high-priority risks and their mitigation
                    plans.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Recent Assessments */}
        <section className="surface overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Recent Risk Assessments</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Latest assessments recorded in the system.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {stats.total} Total
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Loading risk assessments...
              </div>
            </div>
          ) : assessments.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                <ShieldCheck className="size-7 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">
                No risk assessments yet
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Once risk assessments are created, they will appear here with
                their current risk level and status.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {assessments.slice(0, 8).map((assessment) => (
                <RiskRow
                  key={assessment.id}
                  assessment={assessment}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  danger = false,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend: string;
  danger?: boolean;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between">
        <div
          className={`flex size-10 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-50 text-red-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <ArrowUpRight className="size-3.5" />
          {trend}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-3xl font-bold tracking-tight">{value}</div>

        <div className="mt-1 font-semibold">{title}</div>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function RiskBar({
  label,
  count,
  percentage,
  className,
}: {
  label: string;
  count: number;
  percentage: number;
  className: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="font-medium">{label}</div>

        <div className="text-muted-foreground">
          {count} <span className="mx-1">·</span> {percentage}%
        </div>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${className}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function RiskRow({
  assessment,
}: {
  assessment: RiskAssessment;
}) {
  const level = assessment.risk_level?.toLowerCase() ?? "low";

  const levelClass =
    level === "critical"
      ? "bg-red-100 text-red-700"
      : level === "high"
        ? "bg-orange-100 text-orange-700"
        : level === "medium"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700";

  return (
    <div className="flex flex-col gap-4 p-6 transition hover:bg-muted/30 lg:flex-row lg:items-center">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <FileWarning className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold">
            {assessment.title}
          </h3>

          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${levelClass}`}
          >
            {assessment.risk_level ?? "Low"}
          </span>
        </div>

        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {assessment.description || "No description provided."}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            Department: {assessment.department || "N/A"}
          </span>

          <span>
            Category: {assessment.category || "N/A"}
          </span>

          <span>
            Owner: {assessment.owner || "Unassigned"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            Score
          </div>

          <div className="mt-1 text-lg font-bold">
            {assessment.risk_score ?? 0}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            Status
          </div>

          <div className="mt-1 text-sm font-semibold">
            {assessment.status || "Open"}
          </div>
        </div>

        <ChevronRight className="hidden size-5 text-muted-foreground sm:block" />
      </div>
    </div>
  );
}
