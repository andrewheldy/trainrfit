import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ADMIN_SECTIONS, type AdminSectionId } from "@/components/admin/sections";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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
  const { user, isAdmin, loading } = useAuth();
  const [active, setActive] = useState<AdminSectionId>("overview");
  const Section = ADMIN_SECTIONS.find((s) => s.id === active)?.Component ?? ADMIN_SECTIONS[0].Component;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-lime" />
          <h1 className="mt-4 font-display text-2xl font-semibold">Admins only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {user
              ? "Your account doesn't have access to the admin console."
              : "Sign in with an admin account to continue."}
          </p>
          <div className="mt-6">
            <Link
              to={user ? "/" : "/auth"}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              {user ? "Back to Home" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
        <aside className="hidden w-60 flex-shrink-0 lg:block">
          <div className="sticky top-20">
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
