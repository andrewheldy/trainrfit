import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { loadProfile } from "@/lib/onboarding/storage";


export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Gym Lift" },
      { name: "description", content: "Sign in to track workouts, save exercises, and ask the coach." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      const p = loadProfile();
      navigate({ to: p.onboardingComplete ? "/dashboard" : "/onboarding", replace: true });
    }
  }, [user, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { username, display_name: username || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Welcome to Gym Lift.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message ?? "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6 sm:py-24">
      <div className="label-eyebrow">{mode === "signin" ? "Welcome back" : "Join Gym Lift"}</div>
      <h1 className="mt-2 font-display text-4xl font-bold">
        {mode === "signin" ? "Sign In" : "Create Account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "signin" ? "Pick up where your last lift ended." : "Track every set. Build with purpose."}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === "signup" ? (
          <Field label="Username">
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-lime/50"
            />
          </Field>
        ) : null}
        <Field label="Email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-lime/50"
          />
        </Field>
        <Field label="Password">
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-lime/50"
          />
        </Field>

        <button
          type="submit"
          disabled={busy}
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-6 text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {mode === "signin" ? "No account? Create one." : "Already have an account? Sign in."}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-eyebrow">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
