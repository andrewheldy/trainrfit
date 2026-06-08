import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Users,
  DollarSign,
  Trophy,
  Sparkles,
  Layers,
  Flame,
} from "lucide-react";

export const Route = createFileRoute("/become-a-coach")({
  head: () => ({
    meta: [
      { title: "Become A Coach — Gym Lift" },
      {
        name: "description",
        content:
          "Turn your training system into recurring revenue. Publish workout programs, build your audience, and earn income through Gym Lift.",
      },
      { property: "og:title", content: "Become A Coach — Gym Lift" },
      {
        property: "og:description",
        content:
          "Publish workout programs, build your audience, and earn income through Gym Lift.",
      },
    ],
  }),
  component: BecomeACoach,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-muted-foreground" role="alert">
      Something went wrong: {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-8 text-center">Not found.</div>,
});

const BENEFITS = [
  {
    icon: Layers,
    title: "Create Programs",
    body: "Build multi-week training plans with our program editor. No spreadsheets, no PDFs.",
  },
  {
    icon: Users,
    title: "Build Followers",
    body: "Your audience can follow you, save programs, and get notified when you publish.",
  },
  {
    icon: DollarSign,
    title: "Earn Revenue",
    body: "Charge per program or via membership. We handle payments — you keep the majority.",
  },
  {
    icon: BarChart3,
    title: "Track Analytics",
    body: "See completion rates, retention, and how your members are progressing in real time.",
  },
  {
    icon: Trophy,
    title: "Launch Challenges",
    body: "Run seasonal challenges that turn followers into a community.",
  },
  {
    icon: Flame,
    title: "Premium Programs",
    body: "Offer signature programs at a premium tier for your most engaged audience.",
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Tools",
    body: "Our AI helps members stay on-program — answering questions in your voice and method.",
  },
];

function BecomeACoach() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <div className="label-eyebrow">For Coaches & Creators</div>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Turn Your Training System Into <span className="text-lime">Recurring Revenue.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Publish workout programs, build your audience, and earn income through trainr.
              Bring your followers a real platform — built for serious training, not vanity metrics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/creator-onboarding"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Set Up Creator Profile <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/coaches"
                className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-elevated"
              >
                See Existing Creators
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything You Need</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            The tools, audience, and infrastructure to scale your coaching business.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-lime/40"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-lime text-primary-foreground">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Earn From Your Work</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Two simple ways to monetize. Pick what fits your audience.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <PricingCard
              title="Paid Programs"
              price="70%"
              priceSuffix="creator share"
              body="Sell individual programs to your audience. You set the price, we handle checkout."
              bullets={[
                "$19.99 program → you keep $13.99",
                "Lifetime access for your members",
                "No subscription required to sell",
              ]}
            />
            <PricingCard
              title="Membership Revenue Share"
              price="Recurring"
              priceSuffix="monthly payouts"
              body="Earn a share of Gym Lift Pro memberships from members you bring on."
              bullets={[
                "Earn on every active member you refer",
                "Includes referral lifetime tracking",
                "Stacks with paid program sales",
              ]}
              featured
            />
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-lg border border-border bg-surface p-6 sm:p-10">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Apply To Become A Coach</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We review every application. Tell us about you, your audience, and your training
              methodology.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/creator-onboarding" });
              }}
              className="mt-8 grid gap-4"
            >
              <Field label="Full Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Primary Platform Handle" name="handle" placeholder="@yourname (Instagram, YouTube, TikTok…)" required />
              <Field label="Audience Size" name="audience" placeholder="e.g. 25K Instagram, 8K YouTube" required />
              <Field label="Coaching Specialty" name="specialty" placeholder="e.g. Hypertrophy, Powerlifting, Mobility" required />
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tell us about your methodology
                </label>
                <textarea
                  name="methodology"
                  required
                  rows={4}
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-lime focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Continue to Creator Setup <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-lime focus:outline-none"
      />
    </div>
  );
}

function PricingCard({
  title,
  price,
  priceSuffix,
  body,
  bullets,
  featured,
}: {
  title: string;
  price: string;
  priceSuffix: string;
  body: string;
  bullets: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={
        "rounded-lg border p-6 sm:p-8 " +
        (featured ? "border-lime/40 bg-background ring-1 ring-lime/30" : "border-border bg-background")
      }
    >
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold text-lime">{price}</span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{priceSuffix}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
      <ul className="mt-5 space-y-2 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
