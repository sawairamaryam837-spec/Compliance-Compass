import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/signin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Compliance Compass" },
      { name: "description", content: "Sign in to Compliance Compass with Google Workspace or your work email." },
      { property: "og:title", content: "Sign in — Compliance Compass" },
      { property: "og:description", content: "Secure, role-based access to your compliance workspace." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { signInWithGoogle, signInWithEmail, user, ready } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"sso" | "password" | null>(null);

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard", replace: true });
  }, [ready, user, navigate]);

  async function sso() {
    setError(null);
    setLoading("sso");
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed.");
      setLoading(null);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(email.trim())) {
      setError("Enter a valid work email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError(null);
    setLoading("password");
    try {
      await signInWithEmail(email.trim(), password);
      toast.success("Welcome back", { description: "Session secured and audit event recorded." });
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(null);
    }
  }


  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <BrandMark />
          <h1 className="mt-10 font-display text-2xl font-bold tracking-tight">Sign in to your workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access is role-based and every session is recorded in the audit trail.
          </p>

          <Button className="mt-8 w-full" onClick={sso} disabled={loading !== null}>
            {loading === "sso" ? <Loader2 className="size-4 animate-spin" /> : null}
            Sign in with Google Workspace
            {loading !== "sso" ? <ArrowRight className="size-4" /> : null}
          </Button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" />
            </div>
            {error ? (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" variant="outline" className="w-full" disabled={loading !== null}>
              {loading === "password" ? <Loader2 className="size-4 animate-spin" /> : null}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">
            Need to raise something without an account?{" "}
            <Link to="/complaints/new" className="font-semibold text-accent hover:underline">
              Report a concern
            </Link>
            .
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-accent">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden flex-col justify-center border-l border-border bg-card px-12 lg:flex">
        <div className="max-w-md">
          <h2 className="font-display text-xl font-semibold">Enterprise-grade by default</h2>
          <ul className="mt-6 space-y-5">
            {[
              { icon: ShieldCheck, title: "Database-enforced access control", body: "Row-level policies decide what each role can read — never the interface alone." },
              { icon: Lock, title: "Private evidence storage", body: "Every download and preview is authorised and written to the access log." },
              { icon: ShieldCheck, title: "Complete audit trail", body: "Immutable records of every status change, assignment and permission decision." },
            ].map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <f.icon className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{f.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{f.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
