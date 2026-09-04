import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Eye, FolderLock, Search, Upload } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pill } from "@/components/badges";
import { EmptyState, PermissionState } from "@/components/page-states";
import { Select } from "@/routes/_app.complaints.index";
import { formatDateTime } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence vault — Compliance Compass" },
      { name: "description", content: "Chain-of-custody evidence storage with access logging on every view and download." },
      { property: "og:title", content: "Evidence vault — Compliance Compass" },
      { property: "og:description", content: "Every access to evidence is recorded and attributable." },
    ],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  const { evidence, complaints, can, uploadEvidence, logEvidenceAccess } = useApp();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [name, setName] = useState("");
  const [linkedTo, setLinkedTo] = useState(complaints[0]?.id ?? "");
  const [saving, setSaving] = useState(false);

  const types = useMemo(() => Array.from(new Set(evidence.map((e) => e.type))), [evidence]);
  const rows = evidence
    .filter((e) => (type === "all" ? true : e.type === type))
    .filter((e) => (query ? `${e.name} ${e.uploader} ${e.linkedLabel}`.toLowerCase().includes(query.toLowerCase()) : true));

  const selected = evidence.find((e) => e.id === openId) ?? null;

  if (!can("view.evidence")) {
    return (
      <AppShell title="Evidence">
        <PermissionState resource="the evidence vault" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Evidence vault"
      description="Access-controlled storage. Every view and download is written to the audit trail."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Evidence" }]}
      actions={
        can("manage.cases") ? (
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="size-4" />
            Upload evidence
          </Button>
        ) : null
      }
    >
      <div className="surface flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Search evidence" aria-label="Search evidence" />
        </div>
        <Select label="Type" value={type} onChange={setType} options={[["all", "All types"], ...types.map((t) => [t, t] as [string, string])]} />
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No evidence found." description="Nothing matches your search. Upload a file or clear the filters." actionLabel="Clear filters" onAction={() => { setQuery(""); setType("all"); }} />
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((e) => (
            <li key={e.id} className="surface flex flex-col p-5">
              <span className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <FolderLock className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{e.name}</span>
                  <span className="block text-xs text-muted-foreground">{e.type} · {e.size}</span>
                </span>
              </span>
              <p className="mt-3 text-xs text-muted-foreground">Uploaded by {e.uploader} · {formatDateTime(e.uploadedAt)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Linked to {e.linkedLabel}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    logEvidenceAccess(e.id, "viewed");
                    setOpenId(e.id);
                  }}
                >
                  <Eye className="size-4" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    logEvidenceAccess(e.id, "downloaded");
                    toast.success(`Download logged for ${e.name}`);
                  }}
                >
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>Access history for this item. Every entry is immutable.</DialogDescription>
          </DialogHeader>
          <ul className="max-h-72 space-y-2 overflow-y-auto">
            {selected?.accessLog.map((a, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                <span>{a.actor} · {a.action}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(a.at)}</span>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button asChild variant="outline">
              <Link to="/audit-logs" search={{ q: selected?.name ?? "" }}>Open audit log</Link>
            </Button>
            <Button onClick={() => setOpenId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim().length < 3) {
                toast.error("Give the file a descriptive name.");
                return;
              }
              setSaving(true);
              const complaint = complaints.find((c) => c.id === linkedTo);
              setTimeout(() => {
                uploadEvidence({
                  name: name.trim(),
                  type: name.split(".").pop()?.toUpperCase() ?? "FILE",
                  size: "1.2 MB",
                  linkedTo,
                  linkedLabel: complaint ? `${complaint.ref} — ${complaint.title}` : "Unlinked",
                });
                setSaving(false);
                setUploadOpen(false);
                setName("");
                toast.success("Evidence uploaded and access logged.");
              }, 600);
            }}
          >
            <DialogHeader>
              <DialogTitle>Upload evidence</DialogTitle>
              <DialogDescription>Files are stored in the restricted vault and linked to a case.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="ev-name" className="text-sm font-medium">File name</label>
                <Input id="ev-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="interview-transcript.pdf" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="ev-case" className="text-sm font-medium">Link to case</label>
                <select
                  id="ev-case"
                  value={linkedTo}
                  onChange={(e) => setLinkedTo(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-accent"
                >
                  {complaints.map((c) => (
                    <option key={c.id} value={c.id}>{c.ref} — {c.title}</option>
                  ))}
                </select>
              </div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Pill tone="neutral">Chain of custody</Pill>
                Your name, time and IP are recorded with the upload.
              </p>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Uploading…" : "Upload"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
