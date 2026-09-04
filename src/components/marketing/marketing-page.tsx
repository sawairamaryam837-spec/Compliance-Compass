import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export interface MarketingSection {
  title: string;
  body: string;
  bullets?: string[];
  to?: string;
  linkLabel?: string;
}

export function MarketingPage({
  eyebrow,
  title,
  intro,
  sections,
  image,
  imageAlt,
  primary = { label: "Sign in with Google Workspace", to: "/signin" },
  secondary = { label: "Report a Concern", to: "/complaints/new" },
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: MarketingSection[];
  image?: string;
  imageAlt?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
  children?: ReactNode;
}) {
  return (
    <MarketingLayout>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link to={primary.to}>
                  {primary.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={secondary.to}>{secondary.label}</Link>
              </Button>
            </div>
          </div>
          {image ? (
            <div className="surface overflow-hidden p-0 shadow-[var(--shadow-elevated)]">
              <img
                src={image}
                alt={imageAlt ?? title}
                width={1280}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <article key={section.title} className="surface flex flex-col p-6 transition-shadow hover:shadow-[var(--shadow-elevated)]">
              <h2 className="font-display text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
              {section.bullets ? (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.to ? (
                <Link
                  to={section.to}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  {section.linkLabel ?? "Learn more"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : null}
            </article>
          ))}
        </div>
        {children}
      </section>
    </MarketingLayout>
  );
}
