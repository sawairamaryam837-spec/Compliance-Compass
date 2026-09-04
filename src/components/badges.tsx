import { cn } from "@/lib/utils";
import { statusLabels, investigationStatusLabels, roleLabels, type ComplaintStatus, type InvestigationStatus, type Priority, type RiskLevel, type Role } from "@/lib/data";

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

const tones = {
  neutral: "border-border bg-muted text-muted-foreground",
  info: "border-accent/25 bg-accent/10 text-accent",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  danger: "border-destructive/25 bg-destructive/10 text-destructive",
  orange: "border-warning/40 bg-warning/15 text-warning",
} as const;

export type Tone = keyof typeof tones;

const cap = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

export function Pill({ tone = "neutral", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return <span className={cn(base, tones[tone], className)}>{children}</span>;
}

export function Dot({ tone }: { tone: Tone }) {
  const color = { neutral: "bg-muted-foreground", info: "bg-accent", success: "bg-success", warning: "bg-warning", danger: "bg-destructive", orange: "bg-warning" }[tone];
  return <span className={cn("size-1.5 rounded-full", color)} aria-hidden="true" />;
}

const complaintTone: Record<ComplaintStatus, Tone> = { open: "danger", in_progress: "info", under_review: "warning", closed: "success" };
export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <Pill tone={complaintTone[status]}>
      <Dot tone={complaintTone[status]} />
      {statusLabels[status]}
    </Pill>
  );
}

const invTone: Record<InvestigationStatus, Tone> = { planning: "neutral", active: "info", review: "warning", completed: "success" };
export function InvestigationBadge({ status }: { status: InvestigationStatus }) {
  return (
    <Pill tone={invTone[status]}>
      <Dot tone={invTone[status]} />
      {investigationStatusLabels[status]}
    </Pill>
  );
}

const priorityTone: Record<Priority, Tone> = { critical: "danger", high: "orange", medium: "warning", low: "success" };
export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Pill tone={priorityTone[priority]}>{cap(priority)}</Pill>;
}

const riskTone: Record<RiskLevel, Tone> = { critical: "danger", high: "orange", medium: "warning", low: "success" };
export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Pill tone={riskTone[level]}>
      <Dot tone={riskTone[level]} />
      {cap(level)}
    </Pill>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  return <Pill tone={role === "admin" ? "info" : "neutral"}>{roleLabels[role]}</Pill>;
}
