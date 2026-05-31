import { createFileRoute } from "@tanstack/react-router";
import { PremiumOffer } from "@/components/premium-offer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — trainr Pro" },
      { name: "description", content: "trainr Pro: free 30-day trial, then $4.99/month. Cancel anytime." },
      { property: "og:title", content: "trainr Pro Pricing" },
      { property: "og:description", content: "Track better. Train smarter. Reach your goals faster." },
    ],
  }),
  component: () => <PremiumOffer showSecondaryCTA={false} redirectTo="/my-lift" />,
});
