import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pill, RiskBadge } from "@/components/badges";
import { ErrorState, PermissionState } from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import { formatDate, formatDateTime, riskLevel, riskScore, type Risk } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/risks/$riskId")({
  head: () => ({
    meta: [
      { title: "Risk detail — Compliance Compass" },
      { name: "description", content: "Risk scoring, mitigation plan, owner and review history." },
      { property: "og:title", content: "Risk detail — Compliance Compass" },
      { property: "og:description", content: "Likelihood × impact scoring with a documented mitigation plan." },
    ],
  }),
  component: RiskDetail,
});

const statusLabels: Record<Risk["status"], string> = {
  open: "Open",
  mitigating: "Mitigating",
  monitored: "Monitored",
  closed: "Closed",
};

function RiskDetail() {
  const { riskId } = Route.useParams();
  const navigate = useNavigate();
  const { risks, can, updateRisk } = useApp();
  const risk = risks.find((r) => r.id === riskId);
  const [mitigation, setMitigation] = useState(risk?.mitigation ?? "");

  if (!can("view.risks")) {
    return (
      <AppShell title="Risk">
        <PermissionState resource="the risk register" />
      </AppShell>
    );
  }

  if (!risk) {
    return (
      <AppShell title="Risk not found" breadcrumbs={[{ label: "Risks", to: "/risks" }, { label: "Not found" }]}>
        <ErrorState message="This risk does not exist." onRetry={() => navigate({ to: "/risks", search: {} })} />
      </AppShell>
    );
  }

  const score = riskScore(risk);
  const editable = can("manage.cases");
  const scale = [1, 2, 3, 4, 5];

  return (
    <AppShell
      title={risk.title}
      description={`${risk.ref} · ${risk.department} · Owner ${risk.owner}`}
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Risk Assessment", to: "/risks" }, { label: risk.ref }]}
      actions={
        <>
          <Button variant="outline" onClick={() => navigate({ to: "/risks", search: {} })}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
          {editable ? (
            <Select
              label="Status"
              value={risk.status}
              onChange={(v) => {
                updateRisk(risk.id, { status: v as Risk["status"] });
                toast.success(`Risk marked as ${statusLabels[v as Risk["status"]]}`);
              }}
              options={Object.entries(statusLabels) as [string, string][]}
            />
          ) : null}
        </>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <RiskBadge level={riskLevel(score)} />
        <Pill tone="neutral">Score {score} ({risk.likelihood} × {risk.impact})</Pill>
        <Pill tone="neutral">{statusLabels[risk.status]}</Pill>
        <Pill tone="warning">Review {formatDate(risk.reviewDate)}</Pill>
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">Risk description</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{risk.description}</p>
          </section>

          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">Scoring</h2>
            <p className="mt-1 text-sm text-muted-foreground">Score = likelihood × impact.</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {(["likelihood", "impact"] as const).map((field) => (
                <div key={field}>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{field}</p>
                  <div className="mt-2 flex gap-1.5">
                    {scale.map((n) => (
                      <button
                        key={n}
                        type="button"
                        disabled={!editable}
                        aria-pressed={risk[field] === n}
                        aria-label={`Set ${field} to ${n}`}
                        onClick={() => {
                          updateRisk(risk.id, { [field]: n } as Partial<Risk>);
                          toast.success(`${field === "likelihood" ? "Likelihood" : "Impact"} set to ${n}`);
                        }}
                        className={
                          "size-9 rounded-lg border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
                          (risk[field] === n ? "border-accent bg-accent text-accent-foreground" : "border-border hover:bg-muted")
                        }
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">Mitigation plan</h2>
            {editable ? (
              <form
                className="mt-3 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (mitigation.trim().length < 5) {
                    toast.error("Describe the mitigation before saving.");
                    return;
                  }
                  updateRisk(risk.id, { mitigation: mitigation.trim() });
                  toast.success("Mitigation plan saved.");
                }}
              >
                <label htmlFor="mitigation" className="sr-only">Mitigation plan</label>
                <Textarea id="mitigation" rows={4} value={mitigation} onChange={(e) => setMitigation(e.target.value)} />
                <Button type="submit" size="sm">Save mitigation</Button>
              </form>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{risk.mitigation}</p>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">History</h2>
            <ol className="mt-3 space-y-4">
              {risk.timeline.map((t) => (
                <li key={t.id} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>
                    <span className="block text-sm">{t.message}</span>
                    <span className="block text-xs text-muted-foreground">{t.actor} · {formatDateTime(t.at)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">Related</h2>
            <div className="mt-3 grid gap-2">
              <Link to="/complaints" search={{}} className="rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted">Related complaints</Link>
              <Link to="/departments" className="rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted">{risk.department} department</Link>
              <Link to="/audit-logs" search={{ q: risk.ref }} className="rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted">Audit log</Link>
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
