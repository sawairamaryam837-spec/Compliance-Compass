import { Link } from "@tanstack/react-router";
import { AlertTriangle, Inbox, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="surface p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-10 w-full rounded-lg last:mb-0" />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  to,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  to?: string;
  onAction?: () => void;
}) {
  return (
    <div className="surface flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Inbox className="size-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {to ? (
        <Button asChild className="mt-2">
          <Link to={to}>{actionLabel}</Link>
        </Button>
      ) : (
        <Button className="mt-2" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="surface flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-base font-semibold">Something went wrong.</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{message ?? "We couldn't load this view. Your data is safe and no changes were lost."}</p>
      <Button className="mt-2" variant="outline" onClick={() => (onRetry ? onRetry() : window.location.reload())}>
        <RefreshCw className="size-4" aria-hidden="true" />
        Try Again
      </Button>
    </div>
  );
}

export function PermissionState({ resource = "this resource" }: { resource?: string }) {
  return (
    <div className="surface flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
        <Lock className="size-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-base font-semibold">You don't have permission to access {resource}.</h3>
      <p className="max-w-md text-sm text-muted-foreground">
        Access is governed by your assigned role. Contact your compliance administrator if you believe this is an error.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
        <Button asChild>
          <Link to="/contact">Request access</Link>
        </Button>
      </div>
    </div>
  );
}
