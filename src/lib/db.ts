import { supabase } from "@/integrations/supabase/client";
import type {
  AuditLog,
  Complaint,
  Department,
  Evidence,
  Investigation,
  Notification,
  Risk,
  User,
} from "./data";

type AnyRow = Record<string, unknown>;

async function all(table: string, order?: { column: string; ascending?: boolean }) {
  let query = supabase.from(table as never).select("*");
  if (order) query = query.order(order.column, { ascending: order.ascending ?? false });
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as AnyRow[];
}

export interface RemoteData {
  departments: Department[];
  users: User[];
  complaints: Complaint[];
  investigations: Investigation[];
  risks: Risk[];
  evidence: Evidence[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

export async function loadAll(): Promise<RemoteData> {
  const [departments, users, complaints, investigations, risks, evidence, notifications, auditLogs] =
    await Promise.all([
      all("departments"),
      all("app_users"),
      all("complaints", { column: "createdAt" }),
      all("investigations", { column: "openedAt" }),
      all("risks", { column: "reviewDate" }),
      all("evidence", { column: "uploadedAt" }),
      all("notifications", { column: "at" }),
      all("audit_logs", { column: "at" }),
    ]);

  return {
    departments: departments as unknown as Department[],
    users: users as unknown as User[],
    complaints: complaints as unknown as Complaint[],
    investigations: investigations as unknown as Investigation[],
    risks: risks as unknown as Risk[],
    evidence: evidence as unknown as Evidence[],
    notifications: notifications as unknown as Notification[],
    auditLogs: auditLogs as unknown as AuditLog[],
  };
}

/** Fire-and-forget upsert — UI already updated optimistically. */
export function save(table: string, row: AnyRow) {
  void supabase
    .from(table as never)
    .upsert(row as never)
    .then(({ error }) => {
      if (error) console.error(`[db] ${table} save failed`, error.message);
    });
}
