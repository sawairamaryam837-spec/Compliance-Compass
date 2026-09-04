import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/routes/_app.complaints.index";
import { CATEGORIES, type Priority } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/complaints/new")({
  head: () => ({
    meta: [
      { title: "Report a Concern — Compliance Compass" },
      { name: "description", content: "Raise a concern securely. Every submission generates a case reference and an audit event." },
      { property: "og:title", content: "Report a Concern — Compliance Compass" },
      { property: "og:description", content: "Secure, governed intake for compliance concerns." },
    ],
  }),
  component: NewComplaintPage,
});

const schema = z.object({
  title: z.string().trim().min(6, "Give the concern a clear title (at least 6 characters).").max(140),
  description: z.string().trim().min(20, "Describe what happened in at least 20 characters.").max(4000),
  category: z.string().min(1, "Select a category."),
  department: z.string().min(1, "Select a department."),
  priority: z.string().min(1),
  relatedPeople: z.string().max(300).optional(),
  date: z.string().min(1, "Select the date the concern relates to."),
});

function NewComplaintPage() {
  const { departments, createComplaint } = useApp();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0] as string,
    department: departments[0]?.name ?? "",
    priority: "medium",
    relatedPeople: "",
    date: new Date().toISOString().slice(0, 10),
    anonymous: false,
    attachment: "",
  });

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  function submit(e: FormEvent) {
    e.preventDefault();
    setFailed(false);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0]) as keyof FieldErrors] = issue.message;
      setErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      try {
        const complaint = createComplaint({
          title: form.title,
          description: form.description,
          category: form.category,
          department: form.department,
          priority: form.priority as Priority,
          relatedPeople: form.relatedPeople,
          date: form.date,
          anonymous: form.anonymous,
          ...(form.attachment ? { attachment: form.attachment } : {}),
        });
        setSubmitting(false);
        toast.success(`Concern recorded as ${complaint.ref}`, {
          description: "Compliance has been notified and an audit event was written.",
        });
        navigate({ to: "/complaints/$complaintId", params: { complaintId: complaint.id } });
      } catch {
        setSubmitting(false);
        setFailed(true);
      }
    }, 600);
  }

  return (
    <AppShell
      title="Report a Concern"
      description="Submissions are encrypted, access-controlled and recorded in the audit trail. You can report anonymously."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Complaints", to: "/complaints" }, { label: "Report a Concern" }]}
      actions={
        <Button asChild variant="outline">
          <Link to="/complaints" search={{}}>Back to complaints</Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <form onSubmit={submit} noValidate className="surface space-y-5 p-6">
          <Field label="Concern title" error={errors.title} htmlFor="title">
            <Input id="title" value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="Summarise the concern in one line" aria-invalid={Boolean(errors.title)} />
          </Field>

          <Field label="Description" error={errors.description} htmlFor="description" hint="Include what happened, when, and who was involved.">
            <Textarea id="description" rows={7} value={form.description} onChange={(e) => set({ description: e.target.value })} aria-invalid={Boolean(errors.description)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" error={errors.category}>
              <Select label="Category" value={form.category} onChange={(v) => set({ category: v })} options={CATEGORIES.map((c) => [c, c])} />
            </Field>
            <Field label="Department" error={errors.department}>
              <Select label="Department" value={form.department} onChange={(v) => set({ department: v })} options={departments.map((d) => [d.name, d.name])} />
            </Field>
            <Field label="Priority">
              <Select label="Priority" value={form.priority} onChange={(v) => set({ priority: v })} options={[["critical", "Critical"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]]} />
            </Field>
            <Field label="Date of concern" error={errors.date} htmlFor="date">
              <Input id="date" type="date" value={form.date} onChange={(e) => set({ date: e.target.value })} />
            </Field>
          </div>

          <Field label="Related people" htmlFor="people" hint="Optional. Names, teams or roles involved.">
            <Input id="people" value={form.relatedPeople} onChange={(e) => set({ relatedPeople: e.target.value })} />
          </Field>

          <Field label="Attachment / evidence" htmlFor="file" hint="Files are stored in private evidence storage with access logging.">
            <Input id="file" type="file" onChange={(e) => set({ attachment: e.target.files?.[0]?.name ?? "" })} />
          </Field>

          <label className="flex items-start gap-3 rounded-xl border border-border p-4">
            <Checkbox checked={form.anonymous} onCheckedChange={(v) => set({ anonymous: v === true })} aria-label="Submit anonymously" />
            <span>
              <span className="block text-sm font-medium">Submit anonymously</span>
              <span className="block text-xs text-muted-foreground">Your identity will not be attached to this case record.</span>
            </span>
          </label>

          {failed ? (
            <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Something went wrong submitting your concern.{" "}
              <button type="button" className="font-semibold underline" onClick={() => setFailed(false)}>
                Try Again
              </button>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Submit concern
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/complaints" search={{}}>Cancel</Link>
            </Button>
          </div>
        </form>

        <aside className="surface h-fit p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <ShieldCheck className="size-4 text-success" aria-hidden="true" />
            What happens next
          </h2>
          <ol className="mt-4 space-y-4">
            {[
              "A unique case reference is generated for your concern.",
              "Compliance is notified and triages the case within one business day.",
              "An audit event is written and cannot be edited or removed.",
              "You are redirected to the case record to follow progress.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            Retaliation against anyone raising a concern in good faith is prohibited under the Speak Up policy.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}

type FieldErrors = {
  title?: string;
  description?: string;
  category?: string;
  department?: string;
  date?: string;
  priority?: string;
  relatedPeople?: string;
};

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
