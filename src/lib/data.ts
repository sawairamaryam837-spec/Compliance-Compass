export type Role = "admin" | "compliance_officer" | "investigator" | "employee";

export type ComplaintStatus = "open" | "in_progress" | "under_review" | "closed";
export type Priority = "critical" | "high" | "medium" | "low";
export type RiskLevel = "critical" | "high" | "medium" | "low";
export type InvestigationStatus = "planning" | "active" | "review" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: "active" | "suspended";
  lastActivity: string;
  title: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employees: number;
  region: string;
}

export interface TimelineEntry {
  id: string;
  at: string;
  actor: string;
  message: string;
}

export interface Complaint {
  id: string;
  ref: string;
  title: string;
  description: string;
  reporter: string;
  anonymous: boolean;
  department: string;
  category: string;
  priority: Priority;
  status: ComplaintStatus;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
  relatedPeople: string;
  timeline: TimelineEntry[];
  comments: TimelineEntry[];
}

export interface Investigation {
  id: string;
  ref: string;
  title: string;
  complaintId: string | null;
  investigator: string;
  department: string;
  status: InvestigationStatus;
  priority: Priority;
  openedAt: string;
  dueAt: string;
  findings: string;
  timeline: TimelineEntry[];
}

export interface Risk {
  id: string;
  ref: string;
  title: string;
  description: string;
  department: string;
  owner: string;
  likelihood: number;
  impact: number;
  status: "open" | "mitigating" | "monitored" | "closed";
  mitigation: string;
  reviewDate: string;
  timeline: TimelineEntry[];
}

export interface Evidence {
  id: string;
  name: string;
  type: string;
  size: string;
  uploader: string;
  uploadedAt: string;
  linkedTo: string;
  linkedLabel: string;
  accessLog: { at: string; actor: string; action: string }[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  kind: "complaint" | "investigation" | "risk" | "task" | "system";
  href: string;
}

export interface AuditLog {
  id: string;
  at: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  department: string;
  ip: string;
  result: "success" | "denied";
}

export interface Task {
  id: string;
  label: string;
  due: string;
  priority: Priority;
  href: string;
}

export const CATEGORIES = [
  "Harassment",
  "Fraud & Financial",
  "Data Privacy",
  "Health & Safety",
  "Conflict of Interest",
  "Discrimination",
  "Bribery & Corruption",
];

export const riskScore = (r: Pick<Risk, "likelihood" | "impact">) => r.likelihood * r.impact;

export function riskLevel(score: number): RiskLevel {
  if (score >= 20) return "critical";
  if (score >= 12) return "high";
  if (score >= 6) return "medium";
  return "low";
}

const iso = (daysAgo: number, hour = 10) => {
  const d = new Date(Date.UTC(2026, 7, 28, hour, 15, 0));
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString();
};

export const departments: Department[] = [
  { id: "dep-ops", name: "Operations", manager: "Daniel Okafor", employees: 248, region: "EMEA" },
  { id: "dep-fin", name: "Finance", manager: "Priya Raman", employees: 96, region: "APAC" },
  { id: "dep-hr", name: "People & Culture", manager: "Laura Bennett", employees: 54, region: "AMER" },
  { id: "dep-eng", name: "Engineering", manager: "Marcus Feld", employees: 412, region: "EMEA" },
  { id: "dep-legal", name: "Legal & Compliance", manager: "Sofia Marchetti", employees: 38, region: "EMEA" },
  { id: "dep-sales", name: "Commercial", manager: "Jon Alvarez", employees: 187, region: "AMER" },
];

export const users: User[] = [
  { id: "usr-1", name: "Amelia Hart", email: "amelia.hart@northbridge.com", role: "admin", department: "Legal & Compliance", status: "active", lastActivity: iso(0, 8), title: "Chief Compliance Officer" },
  { id: "usr-2", name: "Sofia Marchetti", email: "sofia.marchetti@northbridge.com", role: "compliance_officer", department: "Legal & Compliance", status: "active", lastActivity: iso(0, 9), title: "Compliance Manager" },
  { id: "usr-3", name: "Daniel Okafor", email: "daniel.okafor@northbridge.com", role: "investigator", department: "Operations", status: "active", lastActivity: iso(1, 16), title: "Lead Investigator" },
  { id: "usr-4", name: "Priya Raman", email: "priya.raman@northbridge.com", role: "investigator", department: "Finance", status: "active", lastActivity: iso(2, 11), title: "Forensic Analyst" },
  { id: "usr-5", name: "Laura Bennett", email: "laura.bennett@northbridge.com", role: "compliance_officer", department: "People & Culture", status: "active", lastActivity: iso(1, 13), title: "HR Compliance Partner" },
  { id: "usr-6", name: "Marcus Feld", email: "marcus.feld@northbridge.com", role: "employee", department: "Engineering", status: "active", lastActivity: iso(3, 15), title: "Engineering Director" },
  { id: "usr-7", name: "Jon Alvarez", email: "jon.alvarez@northbridge.com", role: "employee", department: "Commercial", status: "suspended", lastActivity: iso(12, 10), title: "Regional Sales Lead" },
  { id: "usr-8", name: "Nadia Cheng", email: "nadia.cheng@northbridge.com", role: "investigator", department: "Legal & Compliance", status: "active", lastActivity: iso(0, 7), title: "Senior Investigator" },
];

const tl = (items: [number, string, string][]): TimelineEntry[] =>
  items.map(([d, actor, message], i) => ({ id: `tl-${i}-${d}`, at: iso(d), actor, message }));

export const complaints: Complaint[] = [
  {
    id: "cmp-1", ref: "CC-2026-0148", title: "Undisclosed vendor relationship in procurement",
    description: "A procurement lead appears to have an undisclosed financial interest in a shortlisted supplier for the EMEA logistics tender.",
    reporter: "Anonymous", anonymous: true, department: "Operations", category: "Conflict of Interest",
    priority: "high", status: "in_progress", assignee: "Daniel Okafor", createdAt: iso(6), updatedAt: iso(1),
    relatedPeople: "Procurement team, EMEA logistics vendor",
    timeline: tl([[6, "System", "Concern submitted through the anonymous intake channel."], [5, "Sofia Marchetti", "Triaged as high priority and routed to Operations."], [4, "Daniel Okafor", "Investigation CC-INV-0042 opened."], [1, "Daniel Okafor", "Supplier register reviewed; two conflicting entries identified."]]),
    comments: tl([[3, "Sofia Marchetti", "Please confirm whether the declaration register was checked for FY25."]]),
  },
  {
    id: "cmp-2", ref: "CC-2026-0147", title: "Expense reimbursement irregularities",
    description: "Repeated round-number reimbursements submitted without receipts across two consecutive quarters.",
    reporter: "Priya Raman", anonymous: false, department: "Finance", category: "Fraud & Financial",
    priority: "critical", status: "under_review", assignee: "Priya Raman", createdAt: iso(11), updatedAt: iso(2),
    relatedPeople: "Finance shared services",
    timeline: tl([[11, "Priya Raman", "Concern raised after quarterly reconciliation."], [9, "Amelia Hart", "Escalated to critical; audit committee notified."], [2, "Priya Raman", "Draft findings shared for compliance review."]]),
    comments: [],
  },
  {
    id: "cmp-3", ref: "CC-2026-0146", title: "Inappropriate conduct during offsite",
    description: "Two employees reported inappropriate behaviour by a senior manager during the regional offsite.",
    reporter: "Anonymous", anonymous: true, department: "People & Culture", category: "Harassment",
    priority: "critical", status: "open", assignee: null, createdAt: iso(2), updatedAt: iso(2),
    relatedPeople: "Regional offsite attendees",
    timeline: tl([[2, "System", "Concern submitted through the web intake form."], [2, "Laura Bennett", "Acknowledged; awaiting investigator assignment."]]),
    comments: [],
  },
  {
    id: "cmp-4", ref: "CC-2026-0145", title: "Customer data exported to personal device",
    description: "Security tooling flagged a bulk export of customer records to an unmanaged device.",
    reporter: "Marcus Feld", anonymous: false, department: "Engineering", category: "Data Privacy",
    priority: "high", status: "in_progress", assignee: "Nadia Cheng", createdAt: iso(8), updatedAt: iso(3),
    relatedPeople: "Platform engineering, Security operations",
    timeline: tl([[8, "Marcus Feld", "Alert forwarded from the security operations centre."], [7, "Nadia Cheng", "Device isolated; access revoked pending review."], [3, "Nadia Cheng", "Export scope confirmed at 1,204 records."]]),
    comments: tl([[5, "Amelia Hart", "Confirm whether regulator notification thresholds are met."]]),
  },
  {
    id: "cmp-5", ref: "CC-2026-0144", title: "Unsafe working conditions in warehouse 3",
    description: "Blocked emergency exits and missing PPE reported over multiple shifts.",
    reporter: "Anonymous", anonymous: true, department: "Operations", category: "Health & Safety",
    priority: "medium", status: "closed", assignee: "Daniel Okafor", createdAt: iso(34), updatedAt: iso(9),
    relatedPeople: "Warehouse 3 shift supervisors",
    timeline: tl([[34, "System", "Concern submitted via hotline."], [30, "Daniel Okafor", "Site inspection completed."], [9, "Daniel Okafor", "Remediation verified. Case closed."]]),
    comments: [],
  },
  {
    id: "cmp-6", ref: "CC-2026-0143", title: "Gift acceptance above policy threshold",
    description: "A commercial lead accepted hospitality significantly above the disclosed policy threshold.",
    reporter: "Jon Alvarez", anonymous: false, department: "Commercial", category: "Bribery & Corruption",
    priority: "medium", status: "under_review", assignee: "Sofia Marchetti", createdAt: iso(15), updatedAt: iso(4),
    relatedPeople: "Commercial EMEA",
    timeline: tl([[15, "Jon Alvarez", "Self-disclosure submitted."], [4, "Sofia Marchetti", "Policy exception review in progress."]]),
    comments: [],
  },
  {
    id: "cmp-7", ref: "CC-2026-0142", title: "Promotion decision bias concern",
    description: "Concern raised that a promotion cycle disadvantaged part-time employees.",
    reporter: "Anonymous", anonymous: true, department: "People & Culture", category: "Discrimination",
    priority: "high", status: "open", assignee: null, createdAt: iso(4), updatedAt: iso(4),
    relatedPeople: "People & Culture leadership",
    timeline: tl([[4, "System", "Concern submitted through the anonymous intake channel."]]),
    comments: [],
  },
  {
    id: "cmp-8", ref: "CC-2026-0141", title: "Third-party sanctions screening gap",
    description: "A new supplier was onboarded without completing sanctions screening.",
    reporter: "Sofia Marchetti", anonymous: false, department: "Legal & Compliance", category: "Fraud & Financial",
    priority: "high", status: "closed", assignee: "Nadia Cheng", createdAt: iso(41), updatedAt: iso(20),
    relatedPeople: "Supplier onboarding team",
    timeline: tl([[41, "Sofia Marchetti", "Gap identified in onboarding controls."], [20, "Nadia Cheng", "Screening completed, control redesigned. Closed."]]),
    comments: [],
  },
];

export const investigations: Investigation[] = [
  { id: "inv-1", ref: "CC-INV-0042", title: "Procurement conflict of interest review", complaintId: "cmp-1", investigator: "Daniel Okafor", department: "Operations", status: "active", priority: "high", openedAt: iso(4), dueAt: iso(-10), findings: "Two supplier register entries conflict with declared interests. Interviews scheduled with the procurement lead and category manager.", timeline: tl([[4, "Daniel Okafor", "Investigation plan approved."], [1, "Daniel Okafor", "Document review completed."]]) },
  { id: "inv-2", ref: "CC-INV-0041", title: "Expense fraud forensic analysis", complaintId: "cmp-2", investigator: "Priya Raman", department: "Finance", status: "review", priority: "critical", openedAt: iso(9), dueAt: iso(-3), findings: "Pattern analysis identified 27 reimbursements totalling €41,800 without supporting documentation.", timeline: tl([[9, "Priya Raman", "Forensic extract obtained from the expense platform."], [2, "Priya Raman", "Draft findings submitted for compliance review."]]) },
  { id: "inv-3", ref: "CC-INV-0040", title: "Customer data export incident", complaintId: "cmp-4", investigator: "Nadia Cheng", department: "Engineering", status: "active", priority: "high", openedAt: iso(7), dueAt: iso(-6), findings: "Export scope confirmed at 1,204 customer records. Regulatory notification assessment underway.", timeline: tl([[7, "Nadia Cheng", "Device forensics initiated."], [3, "Nadia Cheng", "Export scope confirmed."]]) },
  { id: "inv-4", ref: "CC-INV-0039", title: "Warehouse safety remediation verification", complaintId: "cmp-5", investigator: "Daniel Okafor", department: "Operations", status: "completed", priority: "medium", openedAt: iso(30), dueAt: iso(12), findings: "All corrective actions verified on site. No repeat findings in the follow-up inspection.", timeline: tl([[30, "Daniel Okafor", "Site inspection completed."], [12, "Daniel Okafor", "Remediation verified; investigation closed."]]) },
  { id: "inv-5", ref: "CC-INV-0038", title: "Hospitality policy exception review", complaintId: "cmp-6", investigator: "Sofia Marchetti", department: "Commercial", status: "planning", priority: "medium", openedAt: iso(3), dueAt: iso(-14), findings: "", timeline: tl([[3, "Sofia Marchetti", "Scoping in progress."]]) },
];

export const risks: Risk[] = [
  { id: "rsk-1", ref: "CC-RSK-0071", title: "Third-party sanctions exposure", description: "Suppliers onboarded across EMEA without consistent sanctions screening create regulatory exposure.", department: "Legal & Compliance", owner: "Sofia Marchetti", likelihood: 4, impact: 5, status: "mitigating", mitigation: "Automated screening at onboarding plus quarterly re-screening of the active supplier base.", reviewDate: iso(-21), timeline: tl([[25, "Sofia Marchetti", "Risk registered following control gap."], [6, "Sofia Marchetti", "Mitigation plan approved by the risk committee."]]) },
  { id: "rsk-2", ref: "CC-RSK-0070", title: "Customer data handling on unmanaged devices", description: "Bulk export capability available to engineering roles without device posture checks.", department: "Engineering", owner: "Marcus Feld", likelihood: 4, impact: 4, status: "open", mitigation: "Device posture enforcement and export rate limiting scheduled for the next platform release.", reviewDate: iso(-10), timeline: tl([[8, "Nadia Cheng", "Risk raised from incident CC-2026-0145."]]) },
  { id: "rsk-3", ref: "CC-RSK-0069", title: "Expense control weakness", description: "Manual approval thresholds allow reimbursements without receipts below €500.", department: "Finance", owner: "Priya Raman", likelihood: 3, impact: 4, status: "mitigating", mitigation: "Receipt enforcement and anomaly detection enabled in the expense platform.", reviewDate: iso(-30), timeline: tl([[11, "Priya Raman", "Risk registered from case CC-2026-0147."]]) },
  { id: "rsk-4", ref: "CC-RSK-0068", title: "Warehouse safety compliance drift", description: "Shift-level safety checks inconsistently recorded across regional warehouses.", department: "Operations", owner: "Daniel Okafor", likelihood: 2, impact: 3, status: "monitored", mitigation: "Digital shift checklist rollout with weekly supervisor attestation.", reviewDate: iso(-45), timeline: tl([[30, "Daniel Okafor", "Risk registered following site inspection."]]) },
  { id: "rsk-5", ref: "CC-RSK-0067", title: "Speak-up culture in regional offices", description: "Low reporting rates in two regions may indicate under-reporting rather than low incidence.", department: "People & Culture", owner: "Laura Bennett", likelihood: 3, impact: 2, status: "open", mitigation: "Regional speak-up campaign and manager training programme.", reviewDate: iso(-18), timeline: tl([[20, "Laura Bennett", "Risk registered after engagement survey."]]) },
  { id: "rsk-6", ref: "CC-RSK-0066", title: "Records retention non-compliance", description: "Legacy case records retained beyond the statutory retention window.", department: "Legal & Compliance", owner: "Amelia Hart", likelihood: 2, impact: 2, status: "closed", mitigation: "Retention automation deployed; legacy archive purged under legal sign-off.", reviewDate: iso(60), timeline: tl([[70, "Amelia Hart", "Risk registered."], [60, "Amelia Hart", "Remediation complete; risk closed."]]) },
];

export const evidence: Evidence[] = [
  { id: "ev-1", name: "supplier-register-fy26.xlsx", type: "Spreadsheet", size: "412 KB", uploader: "Daniel Okafor", uploadedAt: iso(3), linkedTo: "cmp-1", linkedLabel: "CC-2026-0148", accessLog: [{ at: iso(2), actor: "Sofia Marchetti", action: "Viewed metadata" }, { at: iso(1), actor: "Daniel Okafor", action: "Downloaded" }] },
  { id: "ev-2", name: "expense-extract-q1-q2.csv", type: "Data extract", size: "1.8 MB", uploader: "Priya Raman", uploadedAt: iso(8), linkedTo: "cmp-2", linkedLabel: "CC-2026-0147", accessLog: [{ at: iso(7), actor: "Amelia Hart", action: "Viewed metadata" }] },
  { id: "ev-3", name: "device-forensics-report.pdf", type: "Document", size: "2.4 MB", uploader: "Nadia Cheng", uploadedAt: iso(5), linkedTo: "cmp-4", linkedLabel: "CC-2026-0145", accessLog: [{ at: iso(4), actor: "Nadia Cheng", action: "Downloaded" }] },
  { id: "ev-4", name: "warehouse-3-inspection.jpg", type: "Image", size: "820 KB", uploader: "Daniel Okafor", uploadedAt: iso(29), linkedTo: "cmp-5", linkedLabel: "CC-2026-0144", accessLog: [] },
  { id: "ev-5", name: "interview-transcript-01.docx", type: "Document", size: "96 KB", uploader: "Nadia Cheng", uploadedAt: iso(2), linkedTo: "cmp-4", linkedLabel: "CC-2026-0145", accessLog: [{ at: iso(1), actor: "Amelia Hart", action: "Viewed metadata" }] },
];

export const notifications: Notification[] = [
  { id: "not-1", title: "New critical concern submitted", body: "CC-2026-0146 — Inappropriate conduct during offsite requires investigator assignment.", at: iso(2, 9), read: false, kind: "complaint", href: "/complaints/cmp-3" },
  { id: "not-2", title: "Investigation findings ready for review", body: "CC-INV-0041 draft findings submitted by Priya Raman.", at: iso(2, 14), read: false, kind: "investigation", href: "/investigations/inv-2" },
  { id: "not-3", title: "Risk score increased", body: "CC-RSK-0070 moved from High to Critical after the latest assessment.", at: iso(3, 11), read: false, kind: "risk", href: "/risks/rsk-2" },
  { id: "not-4", title: "Evidence uploaded", body: "interview-transcript-01.docx linked to CC-2026-0145.", at: iso(2, 16), read: true, kind: "complaint", href: "/evidence" },
  { id: "not-5", title: "Quarterly attestation due", body: "Departmental compliance attestations close in 7 days.", at: iso(5, 8), read: true, kind: "system", href: "/analytics" },
];

export const auditLogs: AuditLog[] = [
  { id: "aud-1", at: iso(0, 9), user: "Amelia Hart", action: "role.view", entity: "User", entityId: "usr-7", department: "Legal & Compliance", ip: "10.4.22.11 · macOS", result: "success" },
  { id: "aud-2", at: iso(1, 15), user: "Daniel Okafor", action: "evidence.download", entity: "Evidence", entityId: "ev-1", department: "Operations", ip: "10.9.3.87 · Windows", result: "success" },
  { id: "aud-3", at: iso(1, 11), user: "Marcus Feld", action: "complaint.view", entity: "Complaint", entityId: "cmp-3", department: "Engineering", ip: "10.2.7.4 · Linux", result: "denied" },
  { id: "aud-4", at: iso(2, 14), user: "Priya Raman", action: "investigation.update", entity: "Investigation", entityId: "inv-2", department: "Finance", ip: "10.6.1.33 · Windows", result: "success" },
  { id: "aud-5", at: iso(3, 10), user: "Nadia Cheng", action: "risk.update", entity: "Risk", entityId: "rsk-2", department: "Legal & Compliance", ip: "10.4.22.19 · macOS", result: "success" },
  { id: "aud-6", at: iso(4, 8), user: "Sofia Marchetti", action: "complaint.assign", entity: "Complaint", entityId: "cmp-6", department: "Legal & Compliance", ip: "10.4.22.15 · macOS", result: "success" },
  { id: "aud-7", at: iso(5, 17), user: "Jon Alvarez", action: "auth.signin", entity: "Session", entityId: "sess-9912", department: "Commercial", ip: "10.8.55.2 · iOS", result: "denied" },
  { id: "aud-8", at: iso(6, 12), user: "System", action: "complaint.create", entity: "Complaint", entityId: "cmp-1", department: "Operations", ip: "intake-service", result: "success" },
  { id: "aud-9", at: iso(8, 13), user: "Nadia Cheng", action: "evidence.upload", entity: "Evidence", entityId: "ev-3", department: "Legal & Compliance", ip: "10.4.22.19 · macOS", result: "success" },
  { id: "aud-10", at: iso(9, 9), user: "Amelia Hart", action: "settings.update", entity: "Organization", entityId: "org-northbridge", department: "Legal & Compliance", ip: "10.4.22.11 · macOS", result: "success" },
];

export const tasks: Task[] = [
  { id: "tsk-1", label: "Review complaint CC-2026-0146", due: "Today", priority: "critical", href: "/complaints/cmp-3" },
  { id: "tsk-2", label: "Approve investigation plan CC-INV-0038", due: "Tomorrow", priority: "medium", href: "/investigations/inv-5" },
  { id: "tsk-3", label: "Review risk assessment CC-RSK-0070", due: "In 2 days", priority: "high", href: "/risks/rsk-2" },
  { id: "tsk-4", label: "Upload interview evidence for CC-2026-0148", due: "In 3 days", priority: "high", href: "/evidence" },
  { id: "tsk-5", label: "Complete quarterly attestation", due: "In 7 days", priority: "low", href: "/settings" },
];

export const monthlyTrend = [
  { month: "Mar", complaints: 18, investigations: 7, closed: 14, risks: 9 },
  { month: "Apr", complaints: 22, investigations: 9, closed: 17, risks: 11 },
  { month: "May", complaints: 16, investigations: 6, closed: 19, risks: 10 },
  { month: "Jun", complaints: 27, investigations: 12, closed: 21, risks: 13 },
  { month: "Jul", complaints: 24, investigations: 10, closed: 25, risks: 12 },
  { month: "Aug", complaints: 31, investigations: 14, closed: 28, risks: 15 },
];

export const statusLabels: Record<ComplaintStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  under_review: "Under Review",
  closed: "Closed",
};

export const investigationStatusLabels: Record<InvestigationStatus, string> = {
  planning: "Planning",
  active: "Active",
  review: "In Review",
  completed: "Completed",
};

export const roleLabels: Record<Role, string> = {
  admin: "Administrator",
  compliance_officer: "Compliance Officer",
  investigator: "Investigator",
  employee: "Employee",
};

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
