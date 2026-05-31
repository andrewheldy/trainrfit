import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { TrainrWordmark } from "@/components/trainr-wordmark";

export function SiteFooter() {
  const { isAdmin } = useAuth();

  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <TrainrWordmark size="lg" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The operating system for fitness. Track, train, and grow with a community that keeps you accountable.
          </p>
        </div>

        <FooterCol title="Product">
          <FLink to="/tracker">Workout Tracker</FLink>
          <FLink to="/coaches">Programs</FLink>
          <FLink to="/muscles">Exercise Library</FLink>
          <FLink to="/coach">AI Coach</FLink>
        </FooterCol>

        <FooterCol title="Account">
          <FLink to="/dashboard">Dashboard</FLink>
          <FLink to="/pricing">Pricing</FLink>
          <FLink to="/auth">Sign in</FLink>
          {isAdmin && <FLink to="/admin">Admin</FLink>}
        </FooterCol>

        <FooterCol title="Creators">
          <FLink to="/become-a-coach">Become a Creator</FLink>
          <FLink to="/creator-dashboard">Creator Studio</FLink>
        </FooterCol>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} trainr</span>
          <span className="font-display tracking-wider">Track better. Train smarter.</span>
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
