import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { LoadingState } from "@/components/page-states";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { ready, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/signin", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="min-h-screen bg-background p-8">
        <LoadingState />
      </div>
    );
  }

  return <Outlet />;
}
