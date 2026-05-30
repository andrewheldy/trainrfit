import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import logo from "@/assets/gym-lift-logo.jpeg";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Gym Lift" className="h-9 w-9 rounded object-cover" />
            <span className="font-display text-lg font-bold tracking-tight">
              GYM<span className="text-lime"> LIFT</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The operating system for better lifting. Train with purpose.
          </p>
        </div>

        <FooterCol title="Train">
          <FLink to="/muscles">Muscle Explorer</FLink>
          <FLink to="/exercises">Exercise Library</FLink>
          <FLink to="/tracker">Workout Tracker</FLink>
        </FooterCol>

        <FooterCol title="My Lift">
          <FLink to="/dashboard">Dashboard</FLink>
          <FLink to="/coach">AI Coach</FLink>
          <FLink to="/auth">Sign in</FLink>
        </FooterCol>

        <FooterCol title="Brand">
          <span className="text-sm text-muted-foreground">Train With Purpose.</span>
        </FooterCol>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} Gym Lift</span>
          <span className="font-display tracking-wider">v1.0</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="label-eyebrow">{title}</h4>
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
      {children}
    </Link>
  );
}
