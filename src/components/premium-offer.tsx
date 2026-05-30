import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Brain, TrendingUp, RefreshCw, BarChart3, Dumbbell, Moon, Check, ArrowRight, Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { startProTrial, setFree } from "@/lib/subscription";

const FEATURES = [
  { icon: Brain, title: "AI Coach", color: "text-lime", items: ["Unlimited coaching questions", "Workout recommendations", "Exercise substitutions", "Form guidance"] },
  { icon: TrendingUp, title: "Smart Progression", color: "text-primary", items: ["Automatic weight recommendations", "Progressive overload tracking", "Strength milestones"] },
  { icon: RefreshCw, title: "Adaptive Programs", color: "text-lime", items: ["Workouts adjust to missed sessions", "Training frequency changes", "Recovery feedback"] },
  { icon: BarChart3, title: "Advanced Analytics", color: "text-primary", items: ["Strength trends", "Muscle balance insights", "Consistency tracking", "Volume tracking"] },
  { icon: Dumbbell, title: "Unlimited Programs", color: "text-lime", items: ["Save unlimited workout plans", "Custom workout splits", "Goal-specific programming"] },
  { icon: Moon, title: "Recovery Insights", color: "text-primary", items: ["Track sleep", "Track soreness", "Track energy levels", "Recovery recommendations"] },
];

const INTEGRATIONS = ["Apple Health", "Health Connect", "Garmin", "Strava", "Fitbit", "WHOOP", "YouTube"];

const COMPARISON: Array<[string, boolean, boolean]> = [
  ["Exercise Library", true, true],
  ["Muscle Map", true, true],
  ["Workout Tracking", true, true],
  ["Basic Programs", true, true],
  ["Unlimited AI Coach", false, true],
  ["Adaptive Programs", false, true],
  ["Advanced Analytics", false, true],
  ["Recovery Tracking", false, true],
  ["Unlimited Saved Programs", false, true],
  ["Future Integrations", false, true],
];

export function PremiumOffer({
  showSecondaryCTA = true,
  redirectTo = "/my-lift",
}: {
  showSecondaryCTA?: boolean;
  redirectTo?: "/my-lift" | "/dashboard";
}) {
  const navigate = useNavigate();

  const startTrial = () => {
    startProTrial();
    toast.success("🎉 Welcome to Gym Lift Pro!", { description: "Your 30-day free trial has started." });
    navigate({ to: redirectTo });
  };
  const continueFree = () => {
    setFree();
    navigate({ to: redirectTo });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="text-center">
        <div className="label-eyebrow">Recommended Upgrade</div>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Unlock Your Full Gym Lift Potential
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Your personalized plan is ready. Start your free 30-day trial and get access to advanced coaching, smarter recommendations, and premium tools designed to help you stay consistent.
        </p>
      </div>

      {/* Premium card */}
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-lime/30 bg-gradient-to-br from-surface via-elevated to-surface p-6 shadow-2xl shadow-primary/20 sm:p-8">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-lime/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/15 text-lime">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="label-eyebrow">Membership</div>
              <div className="font-display text-2xl font-bold">Gym Lift Pro</div>
            </div>
          </div>
          <span className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-lime">
            30-day free trial
          </span>
        </div>
        <div className="relative mt-6 flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold sm:text-5xl">FREE</span>
          <span className="text-sm text-muted-foreground">for 30 days</span>
        </div>
        <div className="relative mt-1 font-mono text-sm text-muted-foreground">
          then <span className="text-foreground">$4.99/month</span> · Cancel anytime.
        </div>
        <button
          onClick={startTrial}
          className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime to-primary px-6 py-4 font-display text-base font-bold text-primary-foreground shadow-xl shadow-primary/30 transition hover:scale-[1.01]"
        >
          START MY FREE 30-DAY TRIAL
          <ArrowRight className="h-4 w-4" />
        </button>
        {showSecondaryCTA ? (
          <button
            onClick={continueFree}
            className="relative mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm text-muted-foreground transition hover:text-foreground"
          >
            Continue With Free Plan
          </button>
        ) : null}
      </div>

      {/* Features */}
      <section className="mt-12">
        <div className="label-eyebrow">What's Included</div>
        <h2 className="mt-1 font-display text-2xl font-bold">Train smarter. Stay accountable.</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <f.icon className={cn("h-5 w-5", f.color)} />
                <div className="font-display text-base font-bold">{f.title}</div>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {f.items.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", f.color)} />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="mt-12">
        <div className="label-eyebrow">Coming Soon</div>
        <h2 className="mt-1 font-display text-2xl font-bold">Works with your favorite tools.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Gym Lift is being built to work with your favorite fitness tools.
        </p>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {INTEGRATIONS.map((name) => (
            <div
              key={name}
              className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated font-display text-sm font-bold text-muted-foreground">
                {name.slice(0, 1)}
              </div>
              <div className="text-xs font-semibold">{name}</div>
              <span className="rounded-full border border-border bg-background/40 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                Planned
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          These integrations are part of the Gym Lift roadmap and will be released in future updates.
        </p>
      </section>

      {/* Comparison */}
      <section className="mt-12">
        <div className="label-eyebrow">Compare Plans</div>
        <h2 className="mt-1 font-display text-2xl font-bold">Free vs Pro</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-elevated">
              <tr>
                <th className="px-4 py-3 text-left font-display text-xs uppercase tracking-wider text-muted-foreground">Feature</th>
                <th className="px-4 py-3 text-center font-display text-xs uppercase tracking-wider text-muted-foreground">Free</th>
                <th className="px-4 py-3 text-center font-display text-xs uppercase tracking-wider text-lime">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {COMPARISON.map(([label, free, pro]) => (
                <tr key={label}>
                  <td className="px-4 py-3 font-medium">{label}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{free ? "✓" : "—"}</td>
                  <td className="px-4 py-3 text-center font-bold text-lime">{pro ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Psychology */}
      <section className="mt-12 rounded-3xl border border-border bg-gradient-to-br from-surface to-elevated p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">You already did the hard part.</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Most people fail because they don't have a plan. You now have a personalized roadmap. Gym Lift Pro helps you stay consistent and make smarter training decisions along the way.
        </p>
      </section>

      {/* Final CTA */}
      <div className="mt-8 space-y-3">
        <button
          onClick={startTrial}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime to-primary px-6 py-5 font-display text-base font-bold text-primary-foreground shadow-xl shadow-primary/30"
        >
          START MY FREE 30-DAY TRIAL
          <ArrowRight className="h-4 w-4" />
        </button>
        {showSecondaryCTA ? (
          <button
            onClick={continueFree}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
          >
            Continue With Free Plan
          </button>
        ) : (
          <Link
            to="/my-lift"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
          >
            Back to My Lift
          </Link>
        )}
      </div>
    </div>
  );
}
