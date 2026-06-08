import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  BadgeCheck,
  Users,
  Star,
  Layers,
  Instagram,
  Youtube,
  Twitter,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Award,
  Clock,
  UserCheck,
  TrendingUp,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { getCoach, formatFollowers, COACHES, type Coach } from "@/lib/coaches/data";
import { useFollowedCoaches, useStartedPrograms } from "@/lib/coaches/storage";
import { ProgramCard } from "@/components/coaches/program-card";
import { cn } from "@/lib/utils";
import { calculateTrustScore } from "@/lib/creator/trust-score";

export const Route = createFileRoute("/coaches/$slug")({
  head: ({ params }) => {
    const coach = getCoach(params.slug);
    const title = coach ? `${coach.name} — ${coach.specialty} | trainr` : "Creator — trainr";
    const description = coach?.bio ?? "Discover elite fitness creators on trainr.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(coach ? [{ property: "og:image", content: coach.banner }] : []),
      ],
    };
  },
  loader: ({ params }): Coach => {
    const coach = getCoach(params.slug);
    if (!coach) throw notFound();
    return coach;
  },
  component: CoachProfile,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-sm text-muted-foreground" role="alert">
      Couldn't load creator: {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-10 text-center">
      <h2 className="font-display text-2xl font-semibold">Creator not found</h2>
      <Link to="/coaches" className="mt-4 inline-block text-sm font-semibold text-lime">
        ← Back to creators
      </Link>
    </div>
  ),
});

function WelcomeVideoCard({ coach }: { coach: Coach }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  const hasVideo = !!coach.welcomeVideoUrl;

  return (
    <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-border shadow-2xl lg:mx-0">
      <div className="aspect-[3/4] bg-elevated">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={coach.welcomeVideoUrl}
            poster={coach.welcomeVideoThumbnail ?? coach.photo}
            muted
            autoPlay
            loop
            playsInline
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <img
            src={coach.welcomeVideoThumbnail ?? coach.photo}
            alt={`${coach.name} profile`}
            style={coach.photoPosition ? { objectPosition: coach.photoPosition } : undefined}
            className="h-full w-full object-cover object-top"
          />
        )}
      </div>

      {/* gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* play / pause button */}
      <button
        onClick={handleTogglePlay}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur transition-opacity duration-200",
            hasVideo
              ? playing
                ? "opacity-0 hover:opacity-100"
                : "opacity-100"
              : "cursor-default opacity-30",
          )}
        >
          {playing ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
          )}
        </div>
      </button>

      {/* bottom bar */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-eyebrow text-[10px] text-white/50">
              {hasVideo ? "Welcome Video" : "Profile Photo"}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-white">{coach.name}</p>
          </div>
          {hasVideo && (
            <button
              onClick={handleToggleMute}
              className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </button>
          )}
        </div>
        {hasVideo && (
          <p className="mt-1.5 text-center text-[9px] uppercase tracking-widest text-white/30">
            [CC] Captions
          </p>
        )}
      </div>
    </div>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-1.5 font-display text-xl font-bold">{value}</div>
    </div>
  );
}

function ExtStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime/10">
        <Icon className="h-4 w-4 text-lime" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function SocialChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-lime/40">
      {icon} {label}
    </span>
  );
}

function CoachProfile() {
  const coach = Route.useLoaderData() as Coach;
  const { has, toggle } = useFollowedCoaches();
  const started = useStartedPrograms();
  const followed = has(coach.slug);

  const firstProgram = coach.programs[0];
  const firstProgramId = firstProgram ? `${coach.slug}/${firstProgram.slug}` : null;
  const isStarted = firstProgramId ? started.has(firstProgramId) : false;

  const handleStartProgram = () => {
    if (!firstProgramId || !firstProgram) return;
    started.add(firstProgramId);
    toast.success(`${firstProgram.name} added to My Lift`, {
      description: `${coach.name} · Week 1 starts now`,
    });
  };

  const hasExtStats = !!(
    coach.yearsTraining ||
    coach.yearsCoaching ||
    coach.clientsCoached ||
    (coach.certifications && coach.certifications.length > 0)
  );

  const trustScore = calculateTrustScore({
    yearsCoaching: coach.yearsCoaching,
    clientsCoached: coach.clientsCoached,
    certificationsCount: coach.certifications?.length ?? 0,
    hasWelcomeVideo: !!coach.welcomeVideoUrl,
    disciplineCount: (coach.disciplines ?? coach.categories).length,
    isVerified: coach.verified,
  });

  const tags = coach.disciplines && coach.disciplines.length > 0
    ? coach.disciplines
    : coach.categories;

  const reviewLabel =
    coach.ratings.count >= 1000
      ? `${(coach.ratings.count / 1000).toFixed(1)}K`
      : String(coach.ratings.count);

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6">
          <Link
            to="/coaches"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All Creators
          </Link>

          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[300px_1fr]">
            {/* Welcome video card */}
            <WelcomeVideoCard coach={coach} />

            {/* Creator info */}
            <div className="flex flex-col">
              {/* Name + verified */}
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
                  {coach.name}
                </h1>
                {coach.verified && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-lime/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-lime">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                {coach.headline ?? coach.specialty}
              </p>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => toggle(coach.slug)}
                  className={cn(
                    "rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
                    followed
                      ? "border border-lime/40 bg-lime/10 text-lime"
                      : "bg-primary text-primary-foreground hover:opacity-90",
                  )}
                >
                  {followed ? "Following" : "Follow Coach"}
                </button>
                <button
                  onClick={handleStartProgram}
                  disabled={!firstProgram}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
                    isStarted
                      ? "border border-border bg-elevated text-foreground"
                      : "border border-lime/40 bg-lime/10 text-lime hover:bg-lime/15",
                    !firstProgram && "cursor-not-allowed opacity-40",
                  )}
                >
                  <Zap className="h-4 w-4" />
                  {isStarted ? "Program Started" : "Start Program"}
                </button>
              </div>

              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <QuickStat
                  icon={Users}
                  label="Followers"
                  value={formatFollowers(coach.followers)}
                />
                <QuickStat
                  icon={Layers}
                  label="Programs"
                  value={String(coach.programs.length)}
                />
                <QuickStat
                  icon={Star}
                  label="Rating"
                  value={`${coach.ratings.score} ★`}
                />
                {coach.communityMembers ? (
                  <QuickStat
                    icon={TrendingUp}
                    label="Community"
                    value={formatFollowers(coach.communityMembers)}
                  />
                ) : (
                  <QuickStat
                    icon={Award}
                    label="Reviews"
                    value={reviewLabel}
                  />
                )}
              </div>

              {/* Specialty tags */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-lime/25 bg-lime/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-lime/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Extended Stats Bar ──────────────────────────── */}
      {hasExtStats && (
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {coach.yearsTraining && (
                <ExtStat icon={Clock} label="Years Training" value={coach.yearsTraining} />
              )}
              {coach.yearsCoaching && (
                <ExtStat icon={UserCheck} label="Years Coaching" value={coach.yearsCoaching} />
              )}
              {coach.clientsCoached && (
                <ExtStat icon={Users} label="Clients Coached" value={coach.clientsCoached} />
              )}
              {coach.certifications && coach.certifications.length > 0 && (
                <ExtStat
                  icon={Award}
                  label="Certifications"
                  value={coach.certifications.join(", ")}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── About + Social + Trust ──────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="label-eyebrow">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {coach.bio}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="label-eyebrow">Connect</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {coach.social.instagram && (
                    <SocialChip
                      icon={<Instagram className="h-3.5 w-3.5" />}
                      label={coach.social.instagram}
                    />
                  )}
                  {coach.social.youtube && (
                    <SocialChip
                      icon={<Youtube className="h-3.5 w-3.5" />}
                      label={coach.social.youtube}
                    />
                  )}
                  {coach.social.twitter && (
                    <SocialChip
                      icon={<Twitter className="h-3.5 w-3.5" />}
                      label={coach.social.twitter}
                    />
                  )}
                </div>
              </div>

              {/* Trust score — shown for all coaches to illustrate the feature */}
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-lime" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider">
                    Creator Trust Score
                  </h3>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
                    <div
                      className="h-full rounded-full bg-lime transition-all duration-500"
                      style={{ width: `${trustScore}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-display text-lg font-bold text-lime">
                    {trustScore}
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Based on experience, certifications, community, and profile completeness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programs ────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Programs</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Follow a structured plan from {coach.name}.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coach.programs.map((p) => (
              <ProgramCard key={p.slug} program={p} coach={coach} showCoach={false} />
            ))}
          </div>
        </div>
      </section>

      {/* ── More Creators ───────────────────────────────── */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-xl font-bold sm:text-2xl">More Creators</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {COACHES.filter((c) => c.slug !== coach.slug)
              .slice(0, 5)
              .map((c) => (
                <Link
                  key={c.slug}
                  to="/coaches/$slug"
                  params={{ slug: c.slug }}
                  className="group block overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-lime/30"
                >
                  <div className="aspect-square overflow-hidden bg-elevated">
                    <img
                      src={c.photo}
                      alt={c.name}
                      loading="lazy"
                      style={c.photoPosition ? { objectPosition: c.photoPosition } : undefined}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-display text-sm font-semibold">{c.name}</div>
                    <div className="line-clamp-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.specialty}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
