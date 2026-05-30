import { createFileRoute } from "@tanstack/react-router";
import { PremiumOffer } from "@/components/premium-offer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Gym Lift Pro" },
      { name: "description", content: "Gym Lift Pro: free 30-day trial, then $4.99/month. Cancel anytime." },
      { property: "og:title", content: "Gym Lift Pro Pricing" },
      { property: "og:description", content: "Train smarter. Build consistency. Reach your goals faster." },
    ],
  }),
  component: () => <PremiumOffer showSecondaryCTA={false} redirectTo="/my-lift" />,
});
