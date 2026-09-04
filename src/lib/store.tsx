import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { loadAll, save } from "./db";
import {
  departments as seedDepartments,
  tasks,
  users as seedUsers,
  type AuditLog,
  type Complaint,
  type ComplaintStatus,
  type Department,
  type Evidence,
  type Investigation,
  type Notification,
  type Priority,
  type Risk,
  type Role,
  type User,
} from "./data";

const THEME_KEY = "compliance-compass-theme-v1";

interface State {
  departments: Department[];
  users: User[];
  complaints: Complaint[];
  investigations: Investigation[];
  risks: Risk[];
  evidence: Evidence[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

const empty = (): State => ({
  departments: seedDepartments,
  users: seedUsers,
  complaints: [],
  investigations: [],
  risks: [],
  evidence: [],
  notifications: [],
  auditLogs: [],
});

export interface NewComplaint {
  title: string;
  description: string;
  category: string;
  department: string;
  priority: Priority;
  relatedPeople: string;
  date: string;
  anonymous: boolean;
  attachment?: string;
}

interface Ctx extends State {
  ready: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  user: User | null;
  theme: "light" | "dark";
  toggleTheme: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (role: Role) => void;
  can: (perm: Permission) => boolean;
  unreadCount: number;
  tasks: typeof tasks;
  createComplaint: (input: NewComplaint) => Complaint;
  setComplaintStatus: (id: string, status: ComplaintStatus) => void;
  assignComplaint: (id: string, assignee: string) => void;
  addComment: (id: string, message: string) => void;
  setInvestigationStatus: (id: string, status: Investigation["status"]) => void;
  addFinding: (id: string, message: string) => void;
  updateRisk: (id: string, patch: Partial<Risk>) => void;
  uploadEvidence: (input: { name: string; type: string; size: string; linkedTo: string; linkedLabel: string }) => void;
  logEvidenceAccess: (id: string, action: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setUserRole: (userId: string, role: Role) => void;
  resetData: () => void;
}

export type Permission =
  | "view.dashboard"
  | "view.complaints"
  | "view.investigations"
  | "view.evidence"
  | "view.risks"
  | "view.departments"
  | "view.users"
  | "view.audit"
  | "view.analytics"
  | "manage.cases"
  | "manage.roles"
  | "manage.org";

const MATRIX: Record<Role, Permission[]> = {
  admin: ["view.dashboard", "view.complaints", "view.investigations", "view.evidence", "view.risks", "view.departments", "view.users", "view.audit", "view.analytics", "manage.cases", "manage.roles", "manage.org"],
  compliance_officer: ["view.dashboard", "view.complaints", "view.investigations", "view.evidence", "view.risks", "view.departments", "view.audit", "view.analytics", "manage.cases"],
  investigator: ["view.dashboard", "view.complaints", "view.investigations", "view.evidence", "view.risks", "view.departments", "manage.cases"],
  employee: ["view.dashboard", "view.complaints", "view.risks"],
};

const AppContext = createContext<Ctx | null>(null);

let counter = 149;

const rid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(empty);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadAll();
      setState((s) => ({
        ...s,
        ...data,
        departments: data.departments.length ? data.departments : s.departments,
        users: data.users.length ? data.users : s.users,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Map the authenticated account to an app profile (directory row when present).
  const hydrateUser = useCallback(async (authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null) => {
    if (!authUser) {
      setUser(null);
      loadedFor.current = null;
      return;
    }
    const email = (authUser.email ?? "").toLowerCase();
    let role: Role = "employee";
    const { data: roleRows, error: roleError } = await supabase.from("user_roles").select("role").eq("user_id", authUser.id);
    if (roleError) {
      console.error("[auth] Could not load user role:", roleError.message);
    }
    if (roleRows && roleRows.length) role = roleRows[0]!.role as Role;

    const { data: directory, error: directoryError } = await supabase.from("app_users").select("*").eq("email", email).maybeSingle();
    if (directoryError) {
      console.error("[auth] Could not load app user:", directoryError.message);
    }
    const meta = authUser.user_metadata ?? {};
    const next: User = directory
      ? ({ ...(directory as unknown as User), role })
      : {
          id: authUser.id,
          name: (meta['full_name'] as string) || (meta['name'] as string) || email.split("@")[0] || "User",
          email,
          role,
          department: "Legal & Compliance",
          status: "active",
          lastActivity: "Just now",
          title: "Workspace member",
        };
    setUser(next);
    if (loadedFor.current !== authUser.id) {
      loadedFor.current = authUser.id;
      void refresh();
    }
  }, [refresh]);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      void hydrateUser(session?.user ?? null);
    });
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      void hydrateUser(data.user ?? null).finally(() => setReady(true));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [hydrateUser]);

  const audit = useCallback((entry: Omit<AuditLog, "id" | "at" | "ip">) => {
    const row: AuditLog = { id: rid("aud"), at: new Date().toISOString(), ip: "10.4.22.11 · Web", ...entry };
    setState((s) => ({ ...s, auditLogs: [row, ...s.auditLogs] }));
    save("audit_logs", row as unknown as Record<string, unknown>);
  }, []);

  const signInWithGoogle = useCallback(async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) throw new Error(err.message);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    loadedFor.current = null;
  }, []);

  const switchRole = useCallback((role: Role) => {
    setUser((u) => (u ? { ...u, role } : u));
  }, []);

  const can = useCallback((perm: Permission) => (user ? MATRIX[user.role].includes(perm) : false), [user]);

  const actor = user?.name ?? "System";

  const value = useMemo<Ctx>(() => {
    const entry = (message: string) => ({ id: rid("tl"), at: new Date().toISOString(), actor, message });

    const patchComplaint = (id: string, fn: (c: Complaint) => Complaint) =>
      setState((s) => {
        const complaints = s.complaints.map((c) => (c.id === id ? fn(c) : c));
        const updated = complaints.find((c) => c.id === id);
        if (updated) save("complaints", updated as unknown as Record<string, unknown>);
        return { ...s, complaints };
      });

    return {
      ...state,
      ready,
      loading,
      error,
      refresh,
      user,
      theme,
      tasks,
      unreadCount: state.notifications.filter((n) => !n.read).length,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      signInWithGoogle,
      signInWithEmail,
      signOut,
      switchRole,
      can,
      createComplaint: (input) => {
        counter += 1;
        const now = new Date().toISOString();
        const complaint: Complaint = {
          id: rid("cmp"),
          ref: `CC-2026-0${counter}`,
          title: input.title,
          description: input.description,
          reporter: input.anonymous ? "Anonymous" : actor,
          anonymous: input.anonymous,
          department: input.department,
          category: input.category,
          priority: input.priority,
          status: "open",
          assignee: null,
          createdAt: input.date ? new Date(input.date).toISOString() : now,
          updatedAt: now,
          relatedPeople: input.relatedPeople,
          timeline: [entry("Concern submitted through the secure intake form."), entry("Compliance team notified for triage.")],
          comments: [],
        };
        const notification: Notification = {
          id: `not-${complaint.id}`,
          title: "New concern submitted",
          body: `${complaint.ref} — ${complaint.title}`,
          at: now,
          read: false,
          kind: "complaint",
          href: `/complaints/${complaint.id}`,
        };
        const attachment: Evidence | null = input.attachment
          ? { id: rid("ev"), name: input.attachment, type: "Attachment", size: "—", uploader: complaint.reporter, uploadedAt: now, linkedTo: complaint.id, linkedLabel: complaint.ref, accessLog: [] }
          : null;
        const log: AuditLog = { id: `aud-${complaint.id}`, at: now, user: complaint.reporter, action: "complaint.create", entity: "Complaint", entityId: complaint.ref, department: complaint.department, ip: "10.4.22.11 · Web", result: "success" };

        setState((s) => ({
          ...s,
          complaints: [complaint, ...s.complaints],
          notifications: [notification, ...s.notifications],
          evidence: attachment ? [attachment, ...s.evidence] : s.evidence,
          auditLogs: [log, ...s.auditLogs],
        }));
        save("complaints", complaint as unknown as Record<string, unknown>);
        save("notifications", notification as unknown as Record<string, unknown>);
        if (attachment) save("evidence", attachment as unknown as Record<string, unknown>);
        save("audit_logs", log as unknown as Record<string, unknown>);
        return complaint;
      },
      setComplaintStatus: (id, status) => {
        patchComplaint(id, (c) => ({ ...c, status, updatedAt: new Date().toISOString(), timeline: [...c.timeline, entry(`Status changed to ${status.replace("_", " ")}.`)] }));
        audit({ user: actor, action: "complaint.status", entity: "Complaint", entityId: id, department: user?.department ?? "—", result: "success" });
      },
      assignComplaint: (id, assignee) => {
        patchComplaint(id, (c) => ({ ...c, assignee, updatedAt: new Date().toISOString(), timeline: [...c.timeline, entry(`Assigned to ${assignee}.`)] }));
        audit({ user: actor, action: "complaint.assign", entity: "Complaint", entityId: id, department: user?.department ?? "—", result: "success" });
      },
      addComment: (id, message) => {
        patchComplaint(id, (c) => ({ ...c, comments: [...c.comments, entry(message)] }));
      },
      setInvestigationStatus: (id, status) => {
        setState((s) => {
          const investigations = s.investigations.map((i) => (i.id === id ? { ...i, status, timeline: [...i.timeline, entry(`Status changed to ${status}.`)] } : i));
          const updated = investigations.find((i) => i.id === id);
          if (updated) save("investigations", updated as unknown as Record<string, unknown>);
          return { ...s, investigations };
        });
        audit({ user: actor, action: "investigation.status", entity: "Investigation", entityId: id, department: user?.department ?? "—", result: "success" });
      },
      addFinding: (id, message) => {
        setState((s) => {
          const investigations = s.investigations.map((i) => (i.id === id ? { ...i, findings: i.findings ? `${i.findings}\n\n${message}` : message, timeline: [...i.timeline, entry("Findings updated.")] } : i));
          const updated = investigations.find((i) => i.id === id);
          if (updated) save("investigations", updated as unknown as Record<string, unknown>);
          return { ...s, investigations };
        });
      },
      updateRisk: (id, patch) => {
        setState((s) => {
          const risks = s.risks.map((r) => (r.id === id ? { ...r, ...patch, timeline: [...r.timeline, entry("Risk assessment updated.")] } : r));
          const updated = risks.find((r) => r.id === id);
          if (updated) save("risks", updated as unknown as Record<string, unknown>);
          return { ...s, risks };
        });
        audit({ user: actor, action: "risk.update", entity: "Risk", entityId: id, department: user?.department ?? "—", result: "success" });
      },
      uploadEvidence: (input) => {
        const now = new Date().toISOString();
        const item: Evidence = { id: rid("ev"), ...input, uploader: actor, uploadedAt: now, accessLog: [] };
        setState((s) => ({ ...s, evidence: [item, ...s.evidence] }));
        save("evidence", item as unknown as Record<string, unknown>);
        audit({ user: actor, action: "evidence.upload", entity: "Evidence", entityId: input.name, department: user?.department ?? "—", result: "success" });
      },
      logEvidenceAccess: (id, action) => {
        const now = new Date().toISOString();
        setState((s) => {
          const evidence = s.evidence.map((e) => (e.id === id ? { ...e, accessLog: [{ at: now, actor, action }, ...e.accessLog] } : e));
          const updated = evidence.find((e) => e.id === id);
          if (updated) save("evidence", updated as unknown as Record<string, unknown>);
          return { ...s, evidence };
        });
        audit({ user: actor, action: `evidence.${action.toLowerCase()}`, entity: "Evidence", entityId: id, department: user?.department ?? "—", result: "success" });
      },
      markRead: (id) =>
        setState((s) => {
          const notifications = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
          const updated = notifications.find((n) => n.id === id);
          if (updated) save("notifications", updated as unknown as Record<string, unknown>);
          return { ...s, notifications };
        }),
      markAllRead: () =>
        setState((s) => {
          const notifications = s.notifications.map((n) => ({ ...n, read: true }));
          notifications.forEach((n) => save("notifications", n as unknown as Record<string, unknown>));
          return { ...s, notifications };
        }),
      setUserRole: (userId, role) => {
        setState((s) => {
          const usersNext = s.users.map((u) => (u.id === userId ? { ...u, role } : u));
          const updated = usersNext.find((u) => u.id === userId);
          if (updated) save("app_users", updated as unknown as Record<string, unknown>);
          return { ...s, users: usersNext };
        });
        audit({ user: actor, action: "user.role_change", entity: "User", entityId: userId, department: user?.department ?? "—", result: "success" });
      },
      resetData: () => {
        void refresh();
      },
    };
  }, [state, ready, loading, error, refresh, user, theme, actor, can, audit, signInWithGoogle, signInWithEmail, signOut, switchRole]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
