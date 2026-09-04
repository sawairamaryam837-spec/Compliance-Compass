import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="m15.2 8.8-2 5.2-5.2 2 2-5.2z" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function BrandMark({ to = "/", subtitle }: { to?: string; subtitle?: string }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-lg" aria-label="Compliance Compass home">
      <Logo />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[15px] font-bold tracking-tight text-foreground">Compliance Compass</span>
        {subtitle ? <span className="text-[11px] font-medium text-muted-foreground">{subtitle}</span> : null}
      </span>
    </Link>
  );
}

export { cn };
