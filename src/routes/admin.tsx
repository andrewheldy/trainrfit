import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { ADMIN_SECTIONS, type AdminSectionId } from "@/components/admin/sections";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Gym Lift" },
      { name: "description", content: "Gym Lift admin dashboard: creators, revenue, AI coaches, moderation, and platform health." },
      { property: "og:title", content: "Admin — Gym Lift" },
      { property: "og:description", content: "Operate the Gym Lift platform." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [active, setActive] = useState<AdminSectionId>("overview");
  const Section = ADMIN_SECTIONS.find((s) => s.id === active)?.Component ?? ADMIN_SECTIONS[0].Component;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
        <aside className="hidden w-60 flex-shrink-0 lg:block">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-lime/15 text-lime">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-display text-sm font-semibold">Gym Lift Admin</div>
                  <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">Operator console</div>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {ADMIN_SECTIONS.map((s) => {
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

        <main className="min-w-0 flex-1">
          <Section />
        </main>
      </div>

      {/* Mobile section pills */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="flex gap-1 overflow-x-auto px-3 py-2">
          {ADMIN_SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold " +
                  (isActive ? "bg-lime text-background" : "bg-elevated text-muted-foreground")
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
