import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-provider";
import { TrainrWordmark } from "@/components/trainr-wordmark";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/coaches", label: "Creators" },
  { to: "/muscles", label: "Library" },
  { to: "/tracker", label: "Tracker" },
  { to: "/coach", label: "AI Coach" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <TrainrWordmark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/creator-onboarding"
            className="inline-flex items-center rounded-md border border-lime/40 bg-lime/5 px-3 py-1.5 text-xs font-medium text-lime transition-colors hover:bg-lime/10"
          >
            Become a Creator
          </Link>
          <Link
            to="/creator-dashboard"
            className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-lime/40 hover:text-foreground"
          >
            Creator Studio
          </Link>
          {user ? (
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="rounded-md bg-lime px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start free
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            className="rounded-md p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "border-t border-border bg-background lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              onClick={() => setOpen(false)}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="border-b border-border/60 py-3 text-base font-medium last:border-0"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/creator-onboarding"
            onClick={() => setOpen(false)}
            className="mt-3 block w-full rounded-md border border-lime/40 bg-lime/5 px-3 py-2.5 text-center text-sm font-medium text-lime"
          >
            Become a Creator
          </Link>
          <Link
            to="/creator-dashboard"
            onClick={() => setOpen(false)}
            className="mt-2 block w-full rounded-md border border-border px-3 py-2.5 text-center text-sm font-medium text-muted-foreground"
          >
            Creator Studio
          </Link>
          <div className="pt-3">
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="block w-full rounded-md bg-lime px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              >
                Start free
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
