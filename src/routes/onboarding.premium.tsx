import { createFileRoute } from "@tanstack/react-router";
import { PremiumOffer } from "@/components/premium-offer";

export const Route = createFileRoute("/onboarding/premium")({
  head: () => ({
    meta: [
      { title: "Unlock Your Full trainr Potential" },
      { name: "description", content: "Start your free 30-day trainr Pro trial." },
    ],
  }),
  component: () => <PremiumOffer showSecondaryCTA redirectTo="/my-lift" />,
});
