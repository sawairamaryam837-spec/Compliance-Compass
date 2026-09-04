import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, FolderLock, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriorityBadge, StatusBadge, Pill } from "@/components/badges";
import { EmptyState, ErrorState, PermissionState } from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import { formatDateTime, statusLabels, type ComplaintStatus } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/complaints/$complaintId")({
  head: () => ({
    meta: [
      { title: "Case detail — Compliance Compass" },
      { name: "description", content: "Full case record: timeline, evidence, comments and audit history." },
      { property: "og:title", content: "Case detail — Compliance Compass" },
      { property: "og:description", content: "Governed case record with a complete audit trail." },
    ],
  }),
  component: ComplaintDetail,
});

function ComplaintDetail() {
  const { complaintId } = Route.useParams();
  const navigate = useNavigate();
  const { complaints, investigations, evidence, auditLogs, users, can, setComplaintStatus, assignComplaint, addComment } = useApp();
  const [comment, setComment] = useState("");

  const complaint = complaints.find((c) => c.id === complaintId);

  if (!can("view.complaints")) {
    return (
      <AppShell title="Case detail">
        <PermissionState resource="this case" />
      </AppShell>
    );
  }

  if (!complaint) {
    return (
      <AppShell title="Case not found" breadcrumbs={[{ label: "Complaints", to: "/complaints" }, { label: "Not found" }]}>
        <ErrorState message="This case does not exist or is outside your access scope." onRetry={() => navigate({ to: "/complaints", search: {} })} />
      </AppShell>
    );
  }

  const linkedInvestigations = investigations.filter((i) => i.complaintId === complaint.id);
  const linkedEvidence = evidence.filter((e) => e.linkedTo === complaint.id);
  const history = auditLogs.filter((l) => l.entityId === complaint.id || l.entityId === complaint.ref);
  const editable = can("manage.cases");

  return (
    <AppShell
      title={complaint.title}
      description={`${complaint.ref} · ${complaint.category} · ${complaint.department}`}
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Complaints", to: "/complaints" }, { label: complaint.ref }]}
      actions={
        <>
          <Button variant="outline" onClick={() => navigate({ to: "/complaints", search: {} })}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
          {editable ? (
            <Select
              label="Status"
              value={complaint.status}
              onChange={(v) => {
                setComplaintStatus(complaint.id, v as ComplaintStatus);
                toast.success(`Status updated to ${statusLabels[v as ComplaintStatus]}`);
              }}
              options={Object.entries(statusLabels) as [string, string][]}
            />
          ) : null}
          {editable ? (
            <Select
              label="Assignee"
              value={complaint.assignee ?? ""}
              onChange={(v) => {
                assignComplaint(complaint.id, v);
                toast.success(`Assigned to ${v}`);
              }}
              options={[["", "Unassigned"], ...users.filter((u) => u.role === "investigator").map((u) => [u.name, u.name] as [string, string])]}
            />
          ) : null}
        </>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StatusBadge status={complaint.status} />
        <PriorityBadge priority={complaint.priority} />
        <Pill tone="neutral">Reporter: {complaint.reporter}</Pill>
        <Pill tone="neutral">Opened {formatDateTime(complaint.createdAt)}</Pill>
        <Pill tone="neutral">Updated {formatDateTime(complaint.updatedAt)}</Pill>
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="audit">Audit history</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="surface mt-4 p-6">
              <h2 className="font-display text-base font-semibold">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{complaint.description}</p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Case reference", complaint.ref],
                  ["Category", complaint.category],
                  ["Department", complaint.department],
                  ["Assigned investigator", complaint.assignee ?? "Unassigned"],
                  ["Related people", complaint.relatedPeople || "—"],
                  ["Anonymous", complaint.anonymous ? "Yes" : "No"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border p-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>

            <TabsContent value="timeline" className="surface mt-4 p-6">
              <ol className="space-y-4">
                {complaint.timeline.map((t) => (
                  <li key={t.id} className="flex gap-3">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>
                      <span className="block text-sm">{t.message}</span>
                      <span className="block text-xs text-muted-foreground">{t.actor} · {formatDateTime(t.at)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="evidence" className="mt-4">
              {linkedEvidence.length === 0 ? (
                <EmptyState title="No evidence attached" description="Upload documents, images or extracts to the private evidence store." actionLabel="Go to Evidence" to="/evidence" />
              ) : (
                <ul className="surface divide-y divide-border">
                  {linkedEvidence.map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-3 p-4">
                      <span className="flex min-w-0 items-center gap-3">
                        <FolderLock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{e.name}</span>
                          <span className="block text-xs text-muted-foreground">{e.type} · {e.size} · {e.uploader}</span>
                        </span>
                      </span>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/evidence">Open</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="comments" className="surface mt-4 p-6">
              {complaint.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : (
                <ul className="space-y-4">
                  {complaint.comments.map((c) => (
                    <li key={c.id} className="rounded-xl border border-border p-4">
                      <p className="text-sm">{c.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{c.actor} · {formatDateTime(c.at)}</p>
                    </li>
                  ))}
                </ul>
              )}
              {editable ? (
                <form
                  className="mt-5 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (comment.trim().length < 3) {
                      toast.error("Write a comment before posting.");
                      return;
                    }
                    addComment(complaint.id, comment.trim());
                    setComment("");
                    toast.success("Comment added to the case record.");
                  }}
                >
                  <label htmlFor="comment" className="text-sm font-medium">Add a comment</label>
                  <Textarea id="comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Record a decision, question or update…" />
                  <Button type="submit" size="sm">
                    <MessageSquare className="size-4" />
                    Post comment
                  </Button>
                </form>
              ) : null}
            </TabsContent>

            <TabsContent value="audit" className="surface mt-4 overflow-x-auto p-0">
              {history.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No audit entries recorded for this case yet.</p>
              ) : (
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th scope="col" className="px-4 py-3">Timestamp</th>
                      <th scope="col" className="px-4 py-3">User</th>
                      <th scope="col" className="px-4 py-3">Action</th>
                      <th scope="col" className="px-4 py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {history.map((h) => (
                      <tr key={h.id}>
                        <td className="px-4 py-3 text-muted-foreground">{formatDateTime(h.at)}</td>
                        <td className="px-4 py-3">{h.user}</td>
                        <td className="px-4 py-3">{h.action}</td>
                        <td className="px-4 py-3">
                          <Pill tone={h.result === "success" ? "success" : "danger"}>{h.result}</Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-5">
          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">Linked investigations</h2>
            {linkedInvestigations.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No investigation opened for this case yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {linkedInvestigations.map((i) => (
                  <li key={i.id}>
                    <Link
                      to="/investigations/$investigationId"
                      params={{ investigationId: i.id }}
                      className="block rounded-xl border border-border p-3 transition-colors hover:border-accent/40 hover:bg-muted"
                    >
                      <span className="block text-sm font-medium">{i.ref}</span>
                      <span className="block text-xs text-muted-foreground">{i.title} · {i.investigator}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/investigations" search={{}}>Open investigations</Link>
            </Button>
          </section>

          <section className="surface p-6">
            <h2 className="font-display text-base font-semibold">Related records</h2>
            <div className="mt-3 grid gap-2">
              <Link to="/risks" search={{}} className="rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted">Risk register</Link>
              <Link to="/audit-logs" search={{ q: complaint.ref }} className="rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted">Audit log for {complaint.ref}</Link>
              <Link to="/departments" className="rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted">{complaint.department} department</Link>
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
