import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  FolderLock,
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquareWarning,
  Moon,
  PanelsTopLeft,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  UserCog,
  Users,
} from "lucide-react";
import { BrandMark, Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/badges";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { roleLabels, riskLevel, riskScore } from "@/lib/data";
import { useApp, type Permission } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  perm: Permission;
  badge?: number;
}

export function AppShell({
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, unreadCount, signOut, theme, toggleTheme, can } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  const items: NavItem[] = useMemo(
    () => [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, perm: "view.dashboard" },
      { label: "Complaints", to: "/complaints", icon: MessageSquareWarning, perm: "view.complaints" },
      { label: "Investigations", to: "/investigations", icon: FileSearch, perm: "view.investigations" },
      { label: "Evidence", to: "/evidence", icon: FolderLock, perm: "view.evidence" },
      { label: "Risk Assessment", to: "/risks", icon: ShieldAlert, perm: "view.risks" },
      { label: "Departments", to: "/departments", icon: Building2, perm: "view.departments" },
      { label: "Users & Roles", to: "/users", icon: Users, perm: "view.users" },
      { label: "Audit Logs", to: "/audit-logs", icon: Activity, perm: "view.audit" },
      { label: "Analytics & Reports", to: "/analytics", icon: BarChart3, perm: "view.analytics" },
      { label: "Notifications", to: "/notifications", icon: Bell, perm: "view.dashboard", badge: unreadCount },
      { label: "Settings", to: "/settings", icon: Settings, perm: "view.dashboard" },
    ],
    [unreadCount],
  );

  const visible = items.filter((i) => can(i.perm));

  const sidebar = (mobile = false) => (
    <nav aria-label="Primary" className="flex h-full flex-col gap-1 p-3">
      <div className={cn("mb-3 flex items-center px-1", collapsed && !mobile ? "justify-center" : "justify-between")}>
        {collapsed && !mobile ? <Logo /> : <BrandMark to="/dashboard" subtitle="Northbridge Group" />}
      </div>
      <ul className="flex flex-1 flex-col gap-0.5">
        {visible.map((item) => {
          const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
          const link = (
            <Link
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground",
                collapsed && !mobile && "justify-center px-2",
              )}
            >
              <item.icon className="size-[18px] shrink-0" aria-hidden="true" />
              {collapsed && !mobile ? <span className="sr-only">{item.label}</span> : <span className="flex-1 truncate">{item.label}</span>}
              {item.badge && item.badge > 0 && !(collapsed && !mobile) ? (
                <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-destructive-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
          return (
            <li key={item.to}>
              {collapsed && !mobile ? (
                <Tooltip>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                link
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-2 border-t border-sidebar-border pt-3">
        {!(collapsed && !mobile) ? (
          <div className="rounded-xl bg-muted p-3">
            <p className="text-xs font-semibold text-foreground">Need to raise something?</p>
            <p className="mt-1 text-xs text-muted-foreground">Submit a concern securely in under two minutes.</p>
            <Button asChild size="sm" className="mt-3 w-full">
              <Link to="/complaints/new">Report a Concern</Link>
            </Button>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon" className="w-full">
                <Link to="/complaints/new" aria-label="Report a concern">
                  <MessageSquareWarning className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Report a Concern</TooltipContent>
          </Tooltip>
        )}
        {!mobile ? (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-center text-muted-foreground"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            {!collapsed ? "Collapse" : null}
          </Button>
        ) : null}
      </div>
    </nav>
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex min-h-screen bg-background">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:block",
            collapsed ? "w-[78px]" : "w-[264px]",
          )}
        >
          {sidebar()}
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            {sidebar(true)}
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
              <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                <Menu className="size-4" />
              </Button>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:max-w-md"
              >
                <Search className="size-4" aria-hidden="true" />
                <span className="truncate">Search complaints, investigations, risks…</span>
              </button>

              <div className="ml-auto flex items-center gap-1.5">
                <div className="mr-1 hidden items-center gap-2 xl:flex">
                  <Pill tone="neutral">
                    <PanelsTopLeft className="size-3.5" aria-hidden="true" />
                    Northbridge Group
                  </Pill>
                  {user ? <Pill tone="info">{roleLabels[user.role]}</Pill> : null}
                </div>

                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={() => setHelpOpen(true)} aria-label="Help and support">
                  <HelpCircle className="size-4" />
                </Button>

                <Button asChild variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unreadCount} unread`}>
                  <Link to="/notifications">
                    <Bell className="size-4" />
                    {unreadCount > 0 ? (
                      <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-destructive-foreground">
                        {unreadCount}
                      </span>
                    ) : null}
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted"
                      aria-label="Open user menu"
                    >
                      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                        {user?.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <span className="hidden leading-tight sm:block">
                        <span className="block text-xs font-semibold">{user?.name}</span>
                        <span className="block text-[11px] text-muted-foreground">{user ? roleLabels[user.role] : ""}</span>
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/users/$userId" params={{ userId: user?.id ?? "usr-1" }}>
                        <UserCog className="size-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" search={{ tab: "organization" }}>
                        <Building2 className="size-4" />
                        Organization
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="size-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        signOut();
                        navigate({ to: "/", replace: true });
                      }}
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
              {breadcrumbs?.length ? (
                <nav aria-label="Breadcrumb" className="mb-3">
                  <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    {breadcrumbs.map((crumb, i) => (
                      <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                        {crumb.to ? (
                          <Link to={crumb.to} className="rounded transition-colors hover:text-accent">
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="font-medium text-foreground">{crumb.label}</span>
                        )}
                        {i < breadcrumbs.length - 1 ? <ChevronRight className="size-3" aria-hidden="true" /> : null}
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="page-title">{title}</h1>
                  {description ? <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
                </div>
                {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
              </div>

              {children}
            </div>
          </main>
        </div>

        <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />

        <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LifeBuoy className="size-4 text-accent" />
                Help & support
              </DialogTitle>
              <DialogDescription>Find guidance or reach the compliance operations team.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {[
                { label: "Documentation", to: "/docs" },
                { label: "Help Center", to: "/help" },
                { label: "Guides & Tutorials", to: "/guides" },
                { label: "Platform status", to: "/status" },
                { label: "Contact support", to: "/contact" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setHelpOpen(false)}
                  className="rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { complaints, investigations, risks, users, departments } = useApp();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [] as { label: string; group: string; to: string; params?: Record<string, string> }[];
    const out: { label: string; group: string; to: string; params?: Record<string, string> }[] = [];
    complaints.filter((c) => `${c.ref} ${c.title} ${c.category}`.toLowerCase().includes(q)).slice(0, 5).forEach((c) =>
      out.push({ label: `${c.ref} — ${c.title}`, group: "Complaints", to: "/complaints/$complaintId", params: { complaintId: c.id } }),
    );
    investigations.filter((i) => `${i.ref} ${i.title}`.toLowerCase().includes(q)).slice(0, 5).forEach((i) =>
      out.push({ label: `${i.ref} — ${i.title}`, group: "Investigations", to: "/investigations/$investigationId", params: { investigationId: i.id } }),
    );
    risks.filter((r) => `${r.ref} ${r.title}`.toLowerCase().includes(q)).slice(0, 5).forEach((r) =>
      out.push({ label: `${r.ref} — ${r.title} (${riskLevel(riskScore(r))})`, group: "Risks", to: "/risks/$riskId", params: { riskId: r.id } }),
    );
    users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q)).slice(0, 5).forEach((u) =>
      out.push({ label: `${u.name} — ${u.email}`, group: "Users", to: "/users/$userId", params: { userId: u.id } }),
    );
    departments.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 5).forEach((d) =>
      out.push({ label: d.name, group: "Departments", to: "/departments/$departmentId", params: { departmentId: d.id } }),
    );
    return out;
  }, [q, complaints, investigations, risks, users, departments]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Global search</DialogTitle>
          <DialogDescription>Search complaints, investigations, risks, users and departments.</DialogDescription>
        </DialogHeader>
        <Input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a case reference, name or keyword…" aria-label="Search query" />
        <div className="max-h-80 overflow-y-auto">
          {!q ? (
            <p className="px-1 py-6 text-center text-sm text-muted-foreground">Start typing to search across the platform.</p>
          ) : results.length === 0 ? (
            <div className="px-1 py-6 text-center">
              <p className="text-sm text-muted-foreground">No matches for “{query}”.</p>
              <Button asChild variant="outline" size="sm" className="mt-3" onClick={() => onOpenChange(false)}>
                <Link to="/complaints/new">Report a Concern</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((r, i) => (
                <li key={`${r.to}-${i}`}>
                  <Link
                    to={r.to}
                    params={r.params as never}
                    onClick={() => {
                      onOpenChange(false);
                      setQuery("");
                    }}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="truncate">{r.label}</span>
                    <span className="shrink-0 text-[11px] uppercase tracking-wide text-muted-foreground">{r.group}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
