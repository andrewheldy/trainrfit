"use client";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  cta: string;
  href: string;
  popular?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Free",
    description: "Everything you need to start training and tracking your lifts.",
    monthly: 0,
    yearly: 0,
    cta: "Get started",
    href: "/auth",
    features: [
      "Workout tracking",
      "Exercise library & muscle map",
      "Basic programs",
      "Community feed",
    ],
  },
  {
    name: "Pro",
    description: "Smart programming, AI coaching, and advanced analytics.",
    monthly: 4.99,
    yearly: 49,
    cta: "Start free trial",
    href: "/onboarding/premium",
    popular: true,
    features: [
      "Everything in Free",
      "Unlimited AI coaching",
      "Adaptive programs",
      "Advanced analytics",
      "Recovery insights",
      "Unlimited saved programs",
    ],
  },
  {
    name: "Team",
    description: "For coaches and small teams managing multiple athletes.",
    monthly: 19,
    yearly: 190,
    cta: "Contact sales",
    href: "/become-a-coach",
    features: [
      "Everything in Pro",
      "Up to 25 athletes",
      "Program builder & assignments",
      "Athlete progress dashboard",
      "Priority support",
    ],
  },
];

function PricingSwitch({
  isYearly,
  onChange,
}: {
  isYearly: boolean;
  onChange: (yearly: boolean) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-surface p-1">
      {[
        { label: "Monthly", value: false },
        { label: "Yearly", value: true },
      ].map((opt) => {
        const active = isYearly === opt.value;
        return (
          <button
            key={opt.label}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="pricing-pill"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {opt.label}
            {opt.value && (
              <span
                className={cn(
                  "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  active ? "bg-background/20 text-primary-foreground" : "bg-lime/15 text-lime",
                )}
              >
                -17%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="label-eyebrow">Pricing</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Plans that scale with your training
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Start free. Upgrade when you want smarter programming, deeper insights, and your own AI coach.
        </p>
        <div className="mt-8 flex justify-center">
          <PricingSwitch isYearly={isYearly} onChange={setIsYearly} />
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const price = isYearly ? plan.yearly : plan.monthly;
          const suffix = plan.monthly === 0 ? "" : isYearly ? "/year" : "/month";
          return (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-surface p-8 transition-colors",
                plan.popular
                  ? "border-lime/60 shadow-[0_0_60px_-20px_color-mix(in_oklab,var(--lime)_50%,transparent)]"
                  : "border-border",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Most popular
                </span>
              )}

              <div>
                <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                <p className="mt-2 min-h-[2.5rem] text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">$</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${plan.name}-${isYearly}`}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-5xl font-semibold tracking-tight"
                  >
                    <NumberFlow value={price} format={{ minimumFractionDigits: price % 1 ? 2 : 0 }} />
                  </motion.span>
                </AnimatePresence>
                {suffix && (
                  <span className="ml-1 text-sm text-muted-foreground">{suffix}</span>
                )}
              </div>

              <Link
                to={plan.href}
                className={cn(
                  "mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-colors",
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-elevated text-foreground hover:bg-elevated/70",
                )}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-lime" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PricingSection;
