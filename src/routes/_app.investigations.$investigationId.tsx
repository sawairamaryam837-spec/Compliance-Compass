import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileSearch,
  History,
  Loader2,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  InvestigationBadge,
  Pill,
  PriorityBadge,
} from "@/components/badges";
import {
  ErrorState,
  PermissionState,
} from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import {
  formatDate,
  formatDateTime,
  investigationStatusLabels,
  type InvestigationStatus,
} from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute(
  "/_app/investigations/$investigationId",
)({
  head: () => ({
    meta: [
      {
        title: "Investigation detail — Compliance Compass",
      },
      {
        name: "description",
        content:
          "Investigation overview, findings, evidence and audit history.",
      },
      {
        property: "og:title",
        content: "Investigation detail — Compliance Compass",
      },
      {
        property: "og:description",
        content: "Documented findings with full accountability.",
      },
    ],
  }),
  component: InvestigationDetail,
});

const supabase = createClient(
  import.meta.env["VITE_SUPABASE_URL"],
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
);

type Investigation = {
  id: string;
  ref: string;
  title: string;
  department: string;
  complaint_id: string | null;
  investigator: string | null;
  priority: string | null;
  status: string;
  findings: string | null;
  opened_at: string | null;
  due_at: string | null;
  timeline: TimelineItem[];
};

type TimelineItem = {
  id: string;
  message: string;
  actor: string;
  at: string;
};

type Complaint = {
  id: string;
  ref: string;
  title: string;
  description?: string | null;
  reporter?: string | null;
  department?: string | null;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
};

type Evidence = {
  id: string;
  name: string;
  type: string;
  uploader: string;
  linkedTo?: string | null;
  linked_to?: string | null;
};

type AuditLog = {
  id: string;
  action: string;
  user: string;
  at: string;
  entityId?: string | null;
  entity_id?: string | null;
};

function InvestigationDetail() {
  const { investigationId } = Route.useParams();
  const navigate = useNavigate();

  const { can } = useApp();

  const [investigation, setInvestigation] =
    useState<Investigation | null>(null);

  const [complaint, setComplaint] =
    useState<Complaint | null>(null);

  const [evidence, setEvidence] =
    useState<Evidence[]>([]);

  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const editable = can("manage.cases");

  useEffect(() => {
    loadInvestigation();
  }, [investigationId]);

  async function loadInvestigation() {
    setLoading(true);
    setError("");

    try {
      /*
       * 1. Investigation
       */
      const {
        data: investigationData,
        error: investigationError,
      } = await supabase
        .from("investigations")
        .select("*")
        .eq("id", investigationId)
        .single();

      if (investigationError) {
        throw investigationError;
      }

      if (!investigationData) {
        setInvestigation(null);
        return;
      }

      const mappedInvestigation: Investigation = {
        id: investigationData.id,
        ref: investigationData.ref,
        title: investigationData.title,
        department:
          investigationData.department ?? "General",
        complaint_id:
          investigationData.complaint_id ??
          investigationData.complaintId ??
          null,
        investigator:
          investigationData.investigator ?? null,
        priority:
          investigationData.priority ?? "Medium",
        status:
          investigationData.status ?? "Open",
        findings:
          investigationData.findings ?? null,
        opened_at:
          investigationData.opened_at ??
          investigationData.openedAt ??
          null,
        due_at:
          investigationData.due_at ??
          investigationData.dueAt ??
          null,
        timeline:
          Array.isArray(investigationData.timeline)
            ? investigationData.timeline
            : [],
      };

      setInvestigation(mappedInvestigation);

      /*
       * 2. Linked complaint
       */
      if (mappedInvestigation.complaint_id) {
        const { data: complaintData } =
          await supabase
            .from("complaints")
            .select("*")
            .eq("id", mappedInvestigation.complaint_id)
            .maybeSingle();

        setComplaint(complaintData ?? null);
      } else {
        setComplaint(null);
      }

      /*
       * 3. Evidence
       */
      if (mappedInvestigation.complaint_id) {
        const { data: evidenceData } =
          await supabase
            .from("evidence")
            .select("*")
            .or(
              `linked_to.eq.${mappedInvestigation.complaint_id},linkedTo.eq.${mappedInvestigation.complaint_id}`,
            );

        setEvidence(evidenceData ?? []);
      } else {
        setEvidence([]);
      }

      /*
       * 4. Audit history
       */
      const { data: auditData } =
        await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      const filteredAudit =
        (auditData ?? []).filter((item) => {
          const entityId =
            item.entity_id ?? item.entityId;

          return (
            entityId === investigationData.id ||
            entityId === investigationData.ref
          );
        });

      setAuditLogs(filteredAudit);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load investigation.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(value: string) {
    if (!investigation) return;

    setSaving(true);

    const { error } = await supabase
      .from("investigations")
      .update({
        status: value,
      })
      .eq("id", investigation.id);

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    setInvestigation({
      ...investigation,
      status: value,
    });

    toast.success(
      `Investigation moved to ${
        investigationStatusLabels[
          value as InvestigationStatus
        ] ?? value
      }`,
    );

    setSaving(false);
  }

  async function saveFinding(e: React.FormEvent) {
    e.preventDefault();

    if (!investigation) return;

    if (note.trim().length < 5) {
      toast.error("Add more detail before saving.");
      return;
    }

    setSaving(true);

    const newTimelineItem: TimelineItem = {
      id: crypto.randomUUID(),
      message: note.trim(),
      actor: "Current user",
      at: new Date().toISOString(),
    };

    const updatedTimeline = [
      ...investigation.timeline,
      newTimelineItem,
    ];

    const newFindings = investigation.findings
      ? `${investigation.findings}\n\n${note.trim()}`
      : note.trim();

    const { error } = await supabase
      .from("investigations")
      .update({
        findings: newFindings,
        timeline: updatedTimeline,
      })
      .eq("id", investigation.id);

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    setInvestigation({
      ...investigation,
      findings: newFindings,
      timeline: updatedTimeline,
    });

    setNote("");
    toast.success(
      "Finding updated and recorded in the timeline.",
    );

    setSaving(false);
  }

  const riskLabel = useMemo(() => {
    if (!investigation) return "Unknown";

    const priority =
      investigation.priority?.toLowerCase();

    if (priority === "critical") return "Critical";
    if (priority === "high") return "High";
    if (priority === "medium") return "Medium";

    return "Low";
  }, [investigation]);

  if (!can("view.investigations")) {
    return (
      <AppShell title="Investigation">
        <PermissionState resource="investigations" />
      </AppShell>
    );
  }

  if (loading) {
    return (
      <AppShell title="Investigation">
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Loading investigation from database...
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !investigation) {
    return (
      <AppShell
        title="Investigation not found"
        breadcrumbs={[
          {
            label: "Investigations",
            to: "/investigations",
          },
          {
            label: "Not found",
          },
        ]}
      >
        <ErrorState
          message={
            error ||
            "This investigation does not exist or is outside your access scope."
          }
          onRetry={() =>
            navigate({
              to: "/investigations",
              search: {},
            })
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      title={investigation.title}
      description={`${investigation.ref} · ${investigation.department}`}
      breadcrumbs={[
        {
          label: "Home",
          to: "/dashboard",
        },
        {
          label: "Investigations",
          to: "/investigations",
        },
        {
          label: investigation.ref,
        },
      ]}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/investigations",
                search: {},
              })
            }
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          {editable && (
            <Select
              label="Status"
              value={investigation.status}
              onChange={updateStatus}
              options={
                Object.entries(
                  investigationStatusLabels,
                ) as [string, string][]
              }
            />
          )}
        </div>
      }
    >
      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<FileSearch className="size-5" />}
          label="Investigation"
          value={investigation.ref}
          description="Reference number"
        />

        <SummaryCard
          icon={<ShieldAlert className="size-5" />}
          label="Risk / Priority"
          value={riskLabel}
          description="Current priority"
        />

        <SummaryCard
          icon={<UserRound className="size-5" />}
          label="Investigator"
          value={
            investigation.investigator ||
            "Unassigned"
          }
          description="Assigned investigator"
        />

        <SummaryCard
          icon={<Clock3 className="size-5" />}
          label="Status"
          value={investigation.status}
          description="Current case status"
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <InvestigationBadge
          status={
            investigation.status as InvestigationStatus
          }
        />

        <PriorityBadge
          priority={
            investigation.priority as any
          }
        />

        <Pill tone="neutral">
          Investigator:{" "}
          {investigation.investigator ||
            "Unassigned"}
        </Pill>

        {investigation.opened_at && (
          <Pill tone="neutral">
            <CalendarDays className="mr-1 inline size-3.5" />
            Opened{" "}
            {formatDate(investigation.opened_at)}
          </Pill>
        )}

        {investigation.due_at && (
          <Pill tone="warning">
            Due{" "}
            {formatDate(investigation.due_at)}
          </Pill>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0">
          <Tabs defaultValue="findings">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="findings">
                Findings
              </TabsTrigger>

              <TabsTrigger value="timeline">
                Timeline
              </TabsTrigger>

              <TabsTrigger value="evidence">
                Evidence
              </TabsTrigger>

              <TabsTrigger value="audit">
                Audit history
              </TabsTrigger>
            </TabsList>

            {/* FINDINGS */}
            <TabsContent
              value="findings"
              className="surface mt-4 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-base font-semibold">
                    Documented findings
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Investigation conclusions and
                    recorded observations.
                  </p>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileSearch className="size-5" />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
                <p className="whitespace-pre-line text-sm leading-7">
                  {investigation.findings ||
                    "No findings recorded yet."}
                </p>
              </div>

              {editable && (
                <form
                  className="mt-6 space-y-3"
                  onSubmit={saveFinding}
                >
                  <label
                    htmlFor="finding"
                    className="text-sm font-medium"
                  >
                    Add investigation note
                  </label>

                  <Textarea
                    id="finding"
                    rows={4}
                    value={note}
                    onChange={(e) =>
                      setNote(e.target.value)
                    }
                    placeholder="Record interview outcomes, document reviews or conclusions..."
                    disabled={saving}
                  />

                  <Button
                    type="submit"
                    size="sm"
                    disabled={saving}
                  >
                    {saving && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    Save note
                  </Button>
                </form>
              )}
            </TabsContent>

            {/* TIMELINE */}
            <TabsContent
              value="timeline"
              className="surface mt-4 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <History className="size-5" />
                </div>

                <div>
                  <h2 className="font-display text-base font-semibold">
                    Investigation timeline
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Chronological activity for this
                    investigation.
                  </p>
                </div>
              </div>

              {investigation.timeline.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No timeline activity recorded yet.
                  </p>
                </div>
              ) : (
                <ol className="mt-6 space-y-5">
                  {investigation.timeline.map(
                    (item) => (
                      <li
                        key={item.id}
                        className="relative flex gap-4"
                      >
                        <span className="relative mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <span className="size-2 rounded-full bg-blue-600" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">
                            {item.message}
                          </span>

                          <span className="mt-1 block text-xs text-muted-foreground">
                            {item.actor} ·{" "}
                            {formatDateTime(item.at)}
                          </span>
                        </span>
                      </li>
                    ),
                  )}
                </ol>
              )}
            </TabsContent>

            {/* EVIDENCE */}
            <TabsContent
              value="evidence"
              className="surface mt-4 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileSearch className="size-5" />
                </div>

                <div>
                  <h2 className="font-display text-base font-semibold">
                    Linked evidence
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Evidence connected to the originating
                    complaint.
                  </p>
                </div>
              </div>

              {evidence.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No evidence linked to this case.
                  </p>
                </div>
              ) : (
                <ul className="mt-5 divide-y divide-border">
                  {evidence.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-4"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {item.name}
                        </span>

                        <span className="block text-xs text-muted-foreground">
                          {item.type} ·{" "}
                          {item.uploader}
                        </span>
                      </span>

                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                      >
                        <Link to="/evidence">
                          Open
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            {/* AUDIT */}
            <TabsContent
              value="audit"
              className="surface mt-4 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <History className="size-5" />
                </div>

                <div>
                  <h2 className="font-display text-base font-semibold">
                    Audit history
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Accountability record for this
                    investigation.
                  </p>
                </div>
              </div>

              {auditLogs.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No audit entries recorded yet.
                  </p>
                </div>
              ) : (
                <ul className="mt-5 divide-y divide-border">
                  {auditLogs.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-sm font-medium">
                        {item.action} · {item.user}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(item.at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-5">
          {/* Linked Complaint */}
          <section className="surface p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileSearch className="size-5" />
              </div>

              <div>
                <h2 className="font-display text-base font-semibold">
                  Linked complaint
                </h2>

                <p className="text-xs text-muted-foreground">
                  Originating case
                </p>
              </div>
            </div>

            {complaint ? (
              <Link
                to="/complaints/$complaintId"
                params={{
                  complaintId: complaint.id,
                }}
                className="mt-4 block rounded-xl border border-border p-4 transition-colors hover:border-accent/40 hover:bg-muted"
              >
                <span className="block text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {complaint.ref}
                </span>

                <span className="mt-1 block text-sm font-semibold">
                  {complaint.title}
                </span>

                {complaint.description && (
                  <span className="mt-2 block line-clamp-3 text-xs leading-5 text-muted-foreground">
                    {complaint.description}
                  </span>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {complaint.department && (
                    <Pill tone="neutral">
                      {complaint.department}
                    </Pill>
                  )}

                  {complaint.category && (
                    <Pill tone="neutral">
                      {complaint.category}
                    </Pill>
                  )}

                  {complaint.priority && (
                    <Pill tone="warning">
                      {complaint.priority}
                    </Pill>
                  )}
                </div>
              </Link>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-border p-4">
                <p className="text-sm text-muted-foreground">
                  This investigation is not linked to a
                  complaint.
                </p>
              </div>
            )}
          </section>

          {/* Investigation Info */}
          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">
              Investigation details
            </h2>

            <div className="mt-4 space-y-4">
              <InfoRow
                label="Reference"
                value={investigation.ref}
              />

              <InfoRow
                label="Department"
                value={investigation.department}
              />

              <InfoRow
                label="Investigator"
                value={
                  investigation.investigator ||
                  "Unassigned"
                }
              />

              <InfoRow
                label="Priority"
                value={
                  investigation.priority ||
                  "Not specified"
                }
              />

              <InfoRow
                label="Status"
                value={investigation.status}
              />

              {investigation.opened_at && (
                <InfoRow
                  label="Opened"
                  value={formatDate(
                    investigation.opened_at,
                  )}
                />
              )}

              {investigation.due_at && (
                <InfoRow
                  label="Due date"
                  value={formatDate(
                    investigation.due_at,
                  )}
                />
              )}
            </div>
          </section>

          {/* Actions */}
          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">
              Actions
            </h2>

            <div className="mt-3 grid gap-2">
              <Link
                to="/evidence"
                className="rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                Upload evidence
              </Link>

              <Link
                to="/risks"
                search={{}}
                className="rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                Raise related risk
              </Link>

              <Link
                to="/audit-logs"
                search={{
                  q: investigation.ref,
                }}
                className="rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                View audit log
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <section className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <CheckCircle2 className="size-4 text-green-500" />
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-lg font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-right text-sm font-medium">
        {value}
      </span>
    </div>
  );
}