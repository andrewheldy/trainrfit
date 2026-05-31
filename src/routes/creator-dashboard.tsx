import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { SECTIONS, type SectionId } from "@/components/creator/sections";
import { CURRENT_CREATOR } from "@/lib/creator/mock-data";
import { BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/creator-dashboard")({
  head: () => ({
    meta: [
      { title: "Creator Studio — Gym Lift" },
      { name: "description", content: "Manage programs, community, AI coach, payouts, and analytics." },
      { property: "og:title", content: "Creator Studio — Gym Lift" },
      { property: "og:description", content: "The Gym Lift Creator Dashboard for fitness coaches and athletes." },
    ],
  }),
  component: CreatorDashboardPage,
});

function CreatorDashboardPage() {
  const [active, setActive] = useState<SectionId>("overview");
  const Section = SECTIONS.find((s) => s.id === active)?.Component ?? SECTIONS[0].Component;

  return (
    <div className="min-h-screen bg-background">


      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 flex-shrink-0 lg:block">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <img
                  src={CURRENT_CREATOR.photo}
                  alt={CURRENT_CREATOR.name}
                  className="h-12 w-12 rounded-lg object-cover object-top"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1 truncate font-display text-sm font-semibold">
                    {CURRENT_CREATOR.name}
                    {CURRENT_CREATOR.verified && <BadgeCheck className="h-3.5 w-3.5 text-lime" />}
                  </div>
                  <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                    Creator Studio
                  </div>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const isActive = active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                      (isActive
                        ? "bg-lime/15 text-lime"
                        : "text-muted-foreground hover:bg-elevated hover:text-foreground")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {s.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <Section />
        </main>
      </div>

      {/* Mobile bottom nav (top 5 sections) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {SECTIONS.slice(0, 5).map((s) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold " +
                  (isActive ? "text-lime" : "text-muted-foreground")
                }
              >
                <Icon className="h-5 w-5" />
                {s.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
