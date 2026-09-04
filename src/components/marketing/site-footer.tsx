import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Linkedin,
  Lock,
  Moon,
  ShieldCheck,
  Sun,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Complaints", to: "/complaints" },
      { label: "Investigations", to: "/investigations" },
      { label: "Risks", to: "/risks" },
      { label: "Evidence", to: "/evidence" },
      { label: "Reports", to: "/analytics" },
      { label: "Audit Log", to: "/audit-logs" },
      { label: "Notifications", to: "/notifications" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Compliance Teams", to: "/solutions" },
      { label: "Legal & Risk", to: "/solutions" },
      { label: "Internal Audit", to: "/solutions" },
      { label: "HR & People Ops", to: "/solutions" },
      { label: "Regulated Industries", to: "/solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "Help Center", to: "/help" },
      { label: "Guides & Tutorials", to: "/guides" },
      { label: "Templates", to: "/templates" },
      { label: "Compliance Library", to: "/compliance-library" },
      { label: "API Reference", to: "/api-reference" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Security", to: "/security" },
      { label: "Careers", to: "/careers" },
      { label: "Partners", to: "/partners" },
      { label: "Contact Us", to: "/contact" },
      { label: "Status", to: "/status" },
    ],
  },
];

const badges = [
  { label: "SOC 2 Compliant", icon: ShieldCheck },
  { label: "GDPR Ready", icon: CheckCircle2 },
  { label: "ISO 27001 Aligned", icon: ShieldCheck },
  { label: "Encrypted End to End", icon: Lock },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    setDarkMode(document.documentElement.classList.contains("dark"));
  }

  function subscribe(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();

    if (!/^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(value)) {
      setError("Enter a valid work email address.");
      return;
    }

    if (/@(gmail|yahoo|outlook|hotmail)\./i.test(value)) {
      setError("Please use your work email address.");
      return;
    }

    setError(null);
    setDone(true);
    setEmail("");

    toast.success("You're subscribed", {
      description: "Compliance insights will arrive monthly.",
    });
  }

  return (
<footer className="border-t border-border bg-card">    
  <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2.4fr]">
          <div className="space-y-5">
            <BrandMark />

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A single governed workflow for every concern, investigation and
              risk — with database-enforced access control and a complete
              audit trail.
            </p>

            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Compliance Compass on LinkedIn"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Linkedin className="size-4" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Compliance Compass on X"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Twitter className="size-4" />
              </a>

              <Link
                to="/"
                aria-label="Compliance Compass website"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Globe className="size-4" />
              </Link>

              {/* Dark Mode Toggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {darkMode ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
                  {col.title}
                </h3>

                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 rounded-2xl border border-border bg-muted/50 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h3 className="font-display text-base font-semibold">
              Stay updated
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Get the latest updates, product news and compliance insights.
            </p>
          </div>

          <form
            onSubmit={subscribe}
            className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"
            noValidate
          >
            <div className="w-full sm:w-72">
              <label htmlFor="newsletter-email" className="sr-only">
                Work email
              </label>

              <Input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setDone(false);
                }}
                placeholder="Enter your work email"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="bg-card"
              />

              {error ? (
                <p
                  id="newsletter-error"
                  role="alert"
                  className="mt-1.5 text-xs text-destructive"
                >
                  {error}
                </p>
              ) : null}

              {done ? (
                <p className="mt-1.5 text-xs text-success">
                  Thanks — check your inbox to confirm.
                </p>
              ) : null}
            </div>

            <Button type="submit" className="sm:w-auto">
              Subscribe
              <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 Compliance Compass. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {badges.map((b) => (
              <li
                key={b.label}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <b.icon
                  className="size-3.5 text-success"
                  aria-hidden="true"
                />
                {b.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}