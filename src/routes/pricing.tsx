import { createFileRoute } from "@tanstack/react-router";
import { PricingSection } from "@/components/pricing-section";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — trainr Pro" },
      { name: "description", content: "trainr plans: Free, Pro, and Team. Monthly or yearly billing — save with annual." },
      { property: "og:title", content: "trainr Pricing" },
      { property: "og:description", content: "Track better. Train smarter. Choose monthly or yearly." },
    ],
  }),
  component: () => <PricingSection />,
});
