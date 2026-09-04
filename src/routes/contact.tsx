
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

import { MarketingLayout } from "@/components/marketing/marketing-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Supabase client
const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabaseKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

const supabase = createClient(supabaseUrl, supabaseKey);

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Compliance Compass" },
      {
        name: "description",
        content:
          "Talk to the Compliance Compass team about implementation, access requests or a demo.",
      },
      {
        property: "og:title",
        content: "Contact — Compliance Compass",
      },
      {
        property: "og:description",
        content:
          "Reach the team for a demo, access request or support.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    message: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const next: {
      name?: string;
      email?: string;
      message?: string;
    } = {};

    // Validation
    if (form.name.trim().length < 2) {
      next.name = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid work email.";
    }

    if (form.message.trim().length < 10) {
      next.message = "Tell us a little more (10+ characters).";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSending(true);
    setSent(false);

    try {
      // Save contact form data to Supabase
      const { error } = await supabase
        .from("moj_contact")
        .insert({
          full_name: form.name.trim(),
          work_email: form.email.trim(),
          organisation: form.org.trim() || null,
          message: form.message.trim(),
        });

      if (error) {
        console.error("Supabase contact error:", error);

        toast.error(
          error.message || "Unable to send your message."
        );

        return;
      }

      // Success
      setSent(true);

      toast.success(
        "Message sent. We reply within one business day."
      );

      // Clear form
      setForm({
        name: "",
        email: "",
        org: "",
        message: "",
      });
    } catch (error) {
      console.error("Unexpected contact error:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <MarketingLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Contact
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Talk to the compliance team.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Request a demo, ask about access to your organisation's
          workspace, or get help with an existing case.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <form
            onSubmit={submit}
            noValidate
            className="surface p-6"
          >
            {sent ? (
              <div className="mb-6 rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm">
                Thank you — your message is with our team.
                A reference has been logged.
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Full Name */}
              <div className="space-y-2">
                <label
                  htmlFor="c-name"
                  className="text-sm font-medium"
                >
                  Full name *
                </label>

                <Input
                  id="c-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "c-name-err" : undefined
                  }
                />

                {errors.name ? (
                  <p
                    id="c-name-err"
                    className="text-xs text-destructive"
                  >
                    {errors.name}
                  </p>
                ) : null}
              </div>

              {/* Work Email */}
              <div className="space-y-2">
                <label
                  htmlFor="c-email"
                  className="text-sm font-medium"
                >
                  Work email *
                </label>

                <Input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "c-email-err" : undefined
                  }
                />

                {errors.email ? (
                  <p
                    id="c-email-err"
                    className="text-xs text-destructive"
                  >
                    {errors.email}
                  </p>
                ) : null}
              </div>

              {/* Organisation */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="c-org"
                  className="text-sm font-medium"
                >
                  Organisation
                </label>

                <Input
                  id="c-org"
                  value={form.org}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      org: e.target.value,
                    })
                  }
                />
              </div>

              {/* Message */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="c-msg"
                  className="text-sm font-medium"
                >
                  How can we help? *
                </label>

                <Textarea
                  id="c-msg"
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "c-msg-err" : undefined
                  }
                />

                {errors.message ? (
                  <p
                    id="c-msg-err"
                    className="text-xs text-destructive"
                  >
                    {errors.message}
                  </p>
                ) : null}
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6"
              disabled={sending}
            >
              {sending ? "Sending…" : "Send message"}
            </Button>
          </form>

          {/* Direct Lines */}
          <aside className="surface h-fit p-6">
            <h2 className="font-display text-base font-semibold">
              Direct lines
            </h2>

            <ul className="mt-4 space-y-4 text-sm">

              <li className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 size-4 text-muted-foreground"
                  aria-hidden="true"
                />

                <span>
                  <span className="block font-medium">
                    compliance@northbridge.example
                  </span>

                  <span className="block text-xs text-muted-foreground">
                    General and demo requests
                  </span>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 size-4 text-muted-foreground"
                  aria-hidden="true"
                />

                <span>
                  <span className="block font-medium">
                    +44 20 7946 0102
                  </span>

                  <span className="block text-xs text-muted-foreground">
                    Mon–Fri, 09:00–18:00 UK
                  </span>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 text-muted-foreground"
                  aria-hidden="true"
                />

                <span>
                  <span className="block font-medium">
                    14 Gresham Street, London
                  </span>

                  <span className="block text-xs text-muted-foreground">
                    By appointment only
                  </span>
                </span>
              </li>

            </ul>
          </aside>
        </div>
      </section>
    </MarketingLayout>
  );
}

