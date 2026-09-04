import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleBadge } from "@/components/badges";
import { Select } from "@/routes/_app.complaints.index";
import { roleLabels, type Role } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Compliance Compass" },
      { name: "description", content: "Profile, notification, organisation and data settings for your workspace." },
      { property: "og:title", content: "Settings — Compliance Compass" },
      { property: "og:description", content: "Control your profile, alerts and organisation policy." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, theme, toggleTheme, can, switchRole, resetData } = useApp();
  const [alerts, setAlerts] = useState({ email: true, escalations: true, weekly: false });
  const [org, setOrg] = useState({ name: "Northbridge Group", retention: "7 years", sla: "5 business days" });

  return (
    <AppShell
      title="Settings"
      description="Manage your profile, alerts and organisation policy."
      breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Settings" }]}
    >
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          {can("manage.org") ? <TabsTrigger value="organization">Organization</TabsTrigger> : null}
        </TabsList>

        <TabsContent value="profile" className="surface mt-4 p-6">
          <h2 className="font-display text-base font-semibold">Your profile</h2>
          <form
            className="mt-4 grid max-w-xl gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Profile saved.");
            }}
          >
            <div className="space-y-2">
              <label htmlFor="p-name" className="text-sm font-medium">Full name</label>
              <Input id="p-name" defaultValue={user?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <label htmlFor="p-email" className="text-sm font-medium">Work email</label>
              <Input id="p-email" type="email" defaultValue={user?.email ?? ""} readOnly aria-readonly="true" className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email is managed by your Google Workspace directory.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Current role</span>
              {user ? <RoleBadge role={user.role} /> : null}
            </div>
            <Button type="submit" className="justify-self-start">Save profile</Button>
          </form>

          <div className="mt-8 border-t border-border pt-6">
            <h3 className="font-display text-sm font-semibold">Demo role switcher</h3>
            <p className="mt-1 text-sm text-muted-foreground">Preview the platform as another role. Real role assignments are managed in Users &amp; Roles.</p>
            <div className="mt-3">
              <Select
                label="Preview role"
                value={user?.role ?? "employee"}
                onChange={(v) => {
                  switchRole(v as Role);
                  toast.success(`Now previewing as ${roleLabels[v as Role]}`);
                }}
                options={Object.entries(roleLabels) as [string, string][]}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="surface mt-4 p-6">
          <h2 className="font-display text-base font-semibold">Notification preferences</h2>
          <ul className="mt-4 max-w-xl divide-y divide-border">
            {[
              ["email", "Email digests", "Daily summary of case activity assigned to you."],
              ["escalations", "Escalation alerts", "Immediate alert when a case is escalated or breaches SLA."],
              ["weekly", "Weekly risk report", "Every Monday, a summary of high and critical risks."],
            ].map(([key, label, desc]) => (
              <li key={key} className="flex items-center justify-between gap-4 py-4">
                <span>
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs text-muted-foreground">{desc}</span>
                </span>
                <Switch
                  checked={alerts[String(key) as keyof typeof alerts]}
                  aria-label={label}
                  onCheckedChange={(v) => {
                    setAlerts((a) => ({ ...a, [String(key)]: v }));
                    toast.success(`${label} ${v ? "enabled" : "disabled"}.`);
                  }}
                />
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="appearance" className="surface mt-4 p-6">
          <h2 className="font-display text-base font-semibold">Appearance</h2>
          <div className="mt-4 flex max-w-xl items-center justify-between gap-4 rounded-xl border border-border p-4">
            <span>
              <span className="block text-sm font-medium">Dark mode</span>
              <span className="block text-xs text-muted-foreground">Currently using the {theme} theme.</span>
            </span>
            <Switch checked={theme === "dark"} aria-label="Toggle dark mode" onCheckedChange={() => toggleTheme()} />
          </div>
        </TabsContent>

        {can("manage.org") ? (
          <TabsContent value="organization" className="surface mt-4 p-6">
            <h2 className="font-display text-base font-semibold">Organization policy</h2>
            <form
              className="mt-4 grid max-w-xl gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Organization settings updated.");
              }}
            >
              <div className="space-y-2">
                <label htmlFor="o-name" className="text-sm font-medium">Organization name</label>
                <Input id="o-name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="o-retention" className="text-sm font-medium">Evidence retention</label>
                <Input id="o-retention" value={org.retention} onChange={(e) => setOrg({ ...org, retention: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="o-sla" className="text-sm font-medium">Triage SLA</label>
                <Input id="o-sla" value={org.sla} onChange={(e) => setOrg({ ...org, sla: e.target.value })} />
              </div>
              <Button type="submit" className="justify-self-start">Save organization</Button>
            </form>

            <div className="mt-8 border-t border-border pt-6">
              <h3 className="font-display text-sm font-semibold">Demo data</h3>
              <p className="mt-1 text-sm text-muted-foreground">Restore the seeded demo records to their original state.</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => {
                  resetData();
                  toast.success("Demo data restored.");
                }}
              >
                Reset demo data
              </Button>
            </div>
          </TabsContent>
        ) : null}
      </Tabs>
    </AppShell>
  );
}
