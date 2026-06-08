import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Sparkles,
  Rocket,
  X,
  ShieldCheck,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { calculateTrustScore } from "@/lib/creator/trust-score";

export const Route = createFileRoute("/creator-onboarding")({
  head: () => ({
    meta: [
      { title: "Creator Setup — trainr" },
      { name: "description", content: "Set up your creator profile and start building your fitness community on trainr." },
    ],
  }),
  component: CreatorOnboarding,
});

// ── Static data ────────────────────────────────────────────────────────────────

const CREATOR_TYPES = [
  "Personal Trainer",
  "Strength Coach",
  "Bodybuilding Coach",
  "Weight Loss Coach",
  "Yoga Instructor",
  "Breathwork Coach",
  "Running Coach",
  "Cycling Coach",
  "Endurance Coach",
  "HIIT Coach",
  "Sports Performance Coach",
  "Nutrition Coach",
  "Physical Therapist",
  "Other",
];

const DISCIPLINES = [
  { label: "Strength Training", emoji: "🏋️" },
  { label: "Hypertrophy", emoji: "💪" },
  { label: "Fat Loss", emoji: "🔥" },
  { label: "HIIT", emoji: "⚡" },
  { label: "Powerlifting", emoji: "🏆" },
  { label: "Olympic Lifting", emoji: "🥇" },
  { label: "Mobility", emoji: "🤸" },
  { label: "Flexibility", emoji: "🧘" },
  { label: "Breathwork", emoji: "💨" },
  { label: "Running", emoji: "🏃" },
  { label: "Marathon Training", emoji: "🏅" },
  { label: "Triathlon", emoji: "🚴" },
  { label: "Cycling", emoji: "🚲" },
  { label: "Yoga", emoji: "☯️" },
  { label: "Pilates", emoji: "🩱" },
  { label: "Functional Fitness", emoji: "⚙️" },
  { label: "Sports Performance", emoji: "🎯" },
  { label: "Recovery", emoji: "🛌" },
  { label: "Nutrition", emoji: "🥗" },
];

const EXPERIENCE_OPTIONS = [
  "Just starting",
  "1-2 years",
  "3-5 years",
  "5-10 years",
  "10-15 years",
  "15+ years",
];

const CLIENTS_OPTIONS = [
  "None yet",
  "1-25",
  "25-100",
  "100-500",
  "500-1,000",
  "1,000+",
];

const CERTIFICATIONS = [
  "NASM",
  "ACE",
  "ISSA",
  "ACSM",
  "NSCA",
  "CrossFit L1",
  "CrossFit L2",
  "Yoga Alliance",
  "Precision Nutrition",
  "CPR/AED",
  "Other",
  "None",
];

const MONETIZATION_OPTIONS = [
  { label: "Monthly Subscription", disabled: false },
  { label: "Workout Program Sales", disabled: false },
  { label: "Fitness Challenges", disabled: false },
  { label: "Group Chat Community", disabled: false },
  { label: "1-on-1 Coaching", disabled: false },
  { label: "Nutrition Plans", disabled: false },
  { label: "Habit Tracking", disabled: false },
  { label: "Video Library", disabled: false },
  { label: "Affiliate Products", disabled: false },
  { label: "Supplement Store", disabled: true, badge: "Coming Soon" },
  { label: "White Label Supplements", disabled: true, badge: "Coming Soon" },
];

const STEP_LABELS = [
  "Creator Type",
  "Disciplines",
  "Experience",
  "Clients",
  "Certifications",
  "Creator Story",
  "Welcome Video",
  "Monetization",
  "Review & Launch",
];

const CREATOR_PROFILE_KEY = "trainr.creatorProfile";

// ── State type ─────────────────────────────────────────────────────────────────

interface OnboardingState {
  creatorTypes: string[];
  disciplines: string[];
  yearsTraining: string;
  yearsCoaching: string;
  clientsCoached: string;
  certifications: string[];
  whyCoach: string;
  philosophy: string;
  differentiation: string;
  idealClient: string;
  generatedBio: string;
  welcomeVideoFile: File | null;
  welcomeVideoPreviewUrl: string;
  monetizationOptions: string[];
}

const INITIAL_STATE: OnboardingState = {
  creatorTypes: [],
  disciplines: [],
  yearsTraining: "",
  yearsCoaching: "",
  clientsCoached: "",
  certifications: [],
  whyCoach: "",
  philosophy: "",
  differentiation: "",
  idealClient: "",
  generatedBio: "",
  welcomeVideoFile: null,
  welcomeVideoPreviewUrl: "",
  monetizationOptions: [],
};

// ── Bio generator ──────────────────────────────────────────────────────────────

function generateBioDraft(s: OnboardingState): string {
  const type = s.creatorTypes[0] ?? "fitness coach";
  const topDisc = s.disciplines.slice(0, 3).map((d) => d.toLowerCase());
  const discText = topDisc.length > 0 ? topDisc.join(", ") : "fitness training";
  const certs = s.certifications.filter((c) => c !== "None");
  const parts: string[] = [];

  if (s.whyCoach.trim()) {
    parts.push(s.whyCoach.trim().replace(/\.?\s*$/, "."));
  }

  parts.push(`As a ${type.toLowerCase()}, I specialize in ${discText}.`);

  if (s.philosophy.trim()) {
    parts.push(s.philosophy.trim().replace(/\.?\s*$/, "."));
  }

  if (s.yearsCoaching && s.yearsCoaching !== "Just starting") {
    const clientPart =
      s.clientsCoached && s.clientsCoached !== "None yet"
        ? ` I've worked with ${s.clientsCoached} clients`
        : "";
    parts.push(`With ${s.yearsCoaching} of coaching experience,${clientPart || " I help athletes of all levels"} achieve their fitness goals.`);
  }

  if (s.differentiation.trim()) {
    parts.push(s.differentiation.trim().replace(/\.?\s*$/, "."));
  }

  if (s.idealClient.trim()) {
    parts.push(`My programs are built for ${s.idealClient.toLowerCase().replace(/\.?\s*$/, "")}.`);
  }

  if (certs.length > 0) {
    parts.push(`Certified: ${certs.join(", ")}.`);
  }

  return parts.filter(Boolean).join(" ");
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SelectCard({
  label,
  emoji,
  selected,
  disabled,
  badge,
  onClick,
}: {
  label: string;
  emoji?: string;
  selected: boolean;
  disabled?: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all",
        selected
          ? "border-lime bg-lime/10 text-foreground"
          : "border-border bg-surface hover:border-lime/40",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {emoji && <span className="text-xl leading-none">{emoji}</span>}
      <span className="flex-1 leading-snug">{label}</span>
      {badge && (
        <span className="absolute right-2 top-2 rounded-full border border-border bg-elevated px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
          {badge}
        </span>
      )}
      {selected && !disabled && (
        <Check className="h-4 w-4 shrink-0 text-lime" />
      )}
    </button>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      {/* Step dots — hidden on mobile, visible on sm+ */}
      <div className="mb-4 hidden items-center justify-center gap-1.5 sm:flex">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i < step
                ? "w-6 bg-lime"
                : i === step
                  ? "w-8 bg-lime/70"
                  : "w-4 bg-border",
            )}
          />
        ))}
      </div>
      {/* Mobile: text + bar */}
      <div className="sm:hidden">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Step {step + 1} of {total} — {STEP_LABELS[step]}
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-lime transition-all duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>
      {/* Desktop: label */}
      <p className="hidden text-center text-xs font-semibold text-muted-foreground sm:block">
        Step {step + 1} of {total} — {STEP_LABELS[step]}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

function CreatorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const totalSteps = STEP_LABELS.length;

  const update = useCallback(
    <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
      setState((s) => ({ ...s, [key]: value }));
    },
    [],
  );

  const toggleItem = useCallback(
    (key: "creatorTypes" | "disciplines" | "certifications" | "monetizationOptions", item: string) => {
      setState((s) => {
        const list = s[key] as string[];
        return {
          ...s,
          [key]: list.includes(item) ? list.filter((x) => x !== item) : [...list, item],
        };
      });
    },
    [],
  );

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setState((s) => ({ ...s, welcomeVideoFile: file, welcomeVideoPreviewUrl: url }));
  };

  const handleGenerateBio = () => {
    const bio = generateBioDraft(state);
    update("generatedBio", bio);
    toast.success("Bio draft generated!", { description: "Edit it to match your voice." });
  };

  const handleLaunch = () => {
    const savePayload = {
      ...state,
      welcomeVideoFile: null, // File objects can't be serialized
      launchedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CREATOR_PROFILE_KEY, JSON.stringify(savePayload));
    } catch {
      // storage quota exceeded — proceed anyway
    }
    toast.success("Creator profile launched! 🚀", {
      description: "Your profile is live. Head to Creator Studio to set up your programs.",
    });
    navigate({ to: "/creator-dashboard" });
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return state.creatorTypes.length > 0;
      case 1: return state.disciplines.length > 0;
      case 2: return !!(state.yearsTraining && state.yearsCoaching);
      case 3: return !!state.clientsCoached;
      case 4: return state.certifications.length > 0;
      case 5: return !!(state.whyCoach.trim() || state.philosophy.trim());
      case 6: return true; // video is optional
      case 7: return state.monetizationOptions.length > 0;
      case 8: return true;
      default: return true;
    }
  };

  const trustScore = calculateTrustScore({
    yearsCoaching: state.yearsCoaching,
    clientsCoached: state.clientsCoached,
    certificationsCount: state.certifications.filter((c) => c !== "None").length,
    hasWelcomeVideo: !!state.welcomeVideoPreviewUrl,
    disciplineCount: state.disciplines.length,
    isVerified: false,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-display text-lg font-bold">
            trainr
          </Link>
          <span className="text-xs text-muted-foreground">Creator Setup</span>
          <Link
            to="/coaches"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ProgressBar step={step} total={totalSteps} />

        {/* ── Step 1: Creator Type ─────────────────────── */}
        {step === 0 && (
          <StepShell
            title="What type of creator are you?"
            description="Select all that apply. You can always refine this later."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CREATOR_TYPES.map((type) => (
                <SelectCard
                  key={type}
                  label={type}
                  selected={state.creatorTypes.includes(type)}
                  onClick={() => toggleItem("creatorTypes", type)}
                />
              ))}
            </div>
          </StepShell>
        )}

        {/* ── Step 2: Disciplines ───────────────────────── */}
        {step === 1 && (
          <StepShell
            title="What disciplines do you teach?"
            description="Pick every area you coach. This powers your profile tags."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {DISCIPLINES.map((d) => (
                <SelectCard
                  key={d.label}
                  label={d.label}
                  emoji={d.emoji}
                  selected={state.disciplines.includes(d.label)}
                  onClick={() => toggleItem("disciplines", d.label)}
                />
              ))}
            </div>
          </StepShell>
        )}

        {/* ── Step 3: Experience ───────────────────────── */}
        {step === 2 && (
          <StepShell
            title="How long have you been training & coaching?"
            description="Be honest — experience builds trust with your audience."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="label-eyebrow mb-3 block">Years Training</label>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("yearsTraining", opt)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                        state.yearsTraining === opt
                          ? "border-lime bg-lime/10 text-lime"
                          : "border-border hover:border-lime/40",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-eyebrow mb-3 block">Years Coaching</label>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("yearsCoaching", opt)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                        state.yearsCoaching === opt
                          ? "border-lime bg-lime/10 text-lime"
                          : "border-border hover:border-lime/40",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </StepShell>
        )}

        {/* ── Step 4: Clients Coached ──────────────────── */}
        {step === 3 && (
          <StepShell
            title="How many clients have you coached?"
            description="Total clients across all platforms and methods."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CLIENTS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update("clientsCoached", opt)}
                  className={cn(
                    "relative flex items-center justify-center rounded-xl border p-5 text-sm font-semibold transition-all",
                    state.clientsCoached === opt
                      ? "border-lime bg-lime/10 text-lime"
                      : "border-border bg-surface hover:border-lime/40",
                  )}
                >
                  {opt}
                  {state.clientsCoached === opt && (
                    <Check className="absolute right-2.5 top-2.5 h-4 w-4 text-lime" />
                  )}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* ── Step 5: Certifications ───────────────────── */}
        {step === 4 && (
          <StepShell
            title="Do you have certifications?"
            description="Select all you hold. Upload proof is optional for now."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CERTIFICATIONS.map((cert) => (
                <SelectCard
                  key={cert}
                  label={cert}
                  selected={state.certifications.includes(cert)}
                  onClick={() => toggleItem("certifications", cert)}
                />
              ))}
            </div>
            <div className="mt-6 flex cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-elevated/30 px-4 py-6 opacity-50">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload certification proof — coming soon
              </p>
            </div>
          </StepShell>
        )}

        {/* ── Step 6: Creator Story ────────────────────── */}
        {step === 5 && (
          <StepShell
            title="Tell your story"
            description="Answer a few questions to craft your coaching bio. You can generate a draft or write your own."
          >
            <div className="space-y-5">
              <Textarea
                label="Why do you coach?"
                placeholder="What drives you to help others transform through fitness?"
                value={state.whyCoach}
                onChange={(v) => update("whyCoach", v)}
              />
              <Textarea
                label="What is your fitness philosophy?"
                placeholder="e.g. Progressive overload, consistency over perfection, evidence-based methods..."
                value={state.philosophy}
                onChange={(v) => update("philosophy", v)}
              />
              <Textarea
                label="What makes you different?"
                placeholder="What separates your approach from other coaches?"
                value={state.differentiation}
                onChange={(v) => update("differentiation", v)}
              />
              <Textarea
                label="Who do you help best?"
                placeholder="e.g. Beginners who've failed every program, busy professionals, competitive athletes..."
                value={state.idealClient}
                onChange={(v) => update("idealClient", v)}
              />

              <button
                type="button"
                onClick={handleGenerateBio}
                className="inline-flex items-center gap-2 rounded-xl border border-lime/40 bg-lime/10 px-5 py-2.5 text-sm font-semibold text-lime transition-colors hover:bg-lime/15"
              >
                <Sparkles className="h-4 w-4" />
                Generate Bio Draft
              </button>

              {state.generatedBio && (
                <div>
                  <label className="label-eyebrow mb-2 block">Your Bio (editable)</label>
                  <textarea
                    rows={5}
                    className="input w-full resize-y"
                    value={state.generatedBio}
                    onChange={(e) => update("generatedBio", e.target.value)}
                  />
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Edit this to sound exactly like you.
                  </p>
                </div>
              )}
            </div>
          </StepShell>
        )}

        {/* ── Step 7: Welcome Video ────────────────────── */}
        {step === 6 && (
          <StepShell
            title="Upload your welcome video"
            description="A 30–60 second intro video dramatically increases profile conversions. Vertical format preferred."
          >
            <div className="space-y-4">
              {!state.welcomeVideoPreviewUrl ? (
                <>
                  <label className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-elevated/30 py-16 text-center transition-colors hover:border-lime/40">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface group-hover:border-lime/30">
                      <Video className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Click to upload your welcome video</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        MP4, MOV up to 500 MB
                      </p>
                    </div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="sr-only"
                      onChange={handleVideoChange}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold transition-colors hover:border-lime/40"
                  >
                    <Upload className="mr-2 inline h-4 w-4" />
                    Select Video File
                  </button>
                </>
              ) : (
                <div className="relative mx-auto max-w-[260px]">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-border">
                    <video
                      src={state.welcomeVideoPreviewUrl}
                      controls
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        welcomeVideoFile: null,
                        welcomeVideoPreviewUrl: "",
                      }))
                    }
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition-colors hover:bg-black/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="rounded-xl border border-border bg-surface/50 p-4">
                <p className="text-xs font-semibold text-muted-foreground">Tips for a great welcome video</p>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  <li>• Aim for 30–60 seconds — short and powerful</li>
                  <li>• Film in vertical (9:16) format for mobile-first presentation</li>
                  <li>• Introduce who you are, who you help, and what makes you different</li>
                  <li>• Good lighting matters more than fancy equipment</li>
                </ul>
              </div>
            </div>
          </StepShell>
        )}

        {/* ── Step 8: Monetization ─────────────────────── */}
        {step === 7 && (
          <StepShell
            title="How do you want to earn on trainr?"
            description="Choose the revenue streams that fit your business. You can enable more later."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {MONETIZATION_OPTIONS.map((opt) => (
                <SelectCard
                  key={opt.label}
                  label={opt.label}
                  selected={state.monetizationOptions.includes(opt.label)}
                  disabled={opt.disabled}
                  badge={opt.badge}
                  onClick={() =>
                    !opt.disabled && toggleItem("monetizationOptions", opt.label)
                  }
                />
              ))}
            </div>
          </StepShell>
        )}

        {/* ── Step 9: Review & Launch ──────────────────── */}
        {step === 8 && (
          <StepShell
            title="Review & launch your profile"
            description="Here's a preview of your creator profile. Launch when you're ready."
          >
            <div className="space-y-5">
              {/* Preview card */}
              <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                {state.welcomeVideoPreviewUrl && (
                  <div className="relative aspect-[3/1] overflow-hidden bg-elevated">
                    <video
                      src={state.welcomeVideoPreviewUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="h-full w-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold">
                        {state.creatorTypes[0] ?? "Fitness Creator"}
                      </h3>
                      <p className="mt-0.5 text-sm uppercase tracking-widest text-muted-foreground">
                        {state.disciplines.slice(0, 3).join(" · ") || "—"}
                      </p>
                    </div>
                    {state.welcomeVideoPreviewUrl && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-lime">
                        <Video className="h-3 w-3" /> Has Video
                      </span>
                    )}
                  </div>

                  {state.generatedBio && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {state.generatedBio}
                    </p>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                    {state.yearsCoaching && (
                      <ReviewStat label="Years Coaching" value={state.yearsCoaching} />
                    )}
                    {state.clientsCoached && (
                      <ReviewStat label="Clients" value={state.clientsCoached} />
                    )}
                    {state.certifications.filter((c) => c !== "None").length > 0 && (
                      <ReviewStat
                        label="Certs"
                        value={String(state.certifications.filter((c) => c !== "None").length)}
                      />
                    )}
                    {state.monetizationOptions.length > 0 && (
                      <ReviewStat
                        label="Revenue Streams"
                        value={String(state.monetizationOptions.length)}
                      />
                    )}
                  </div>

                  {state.monetizationOptions.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {state.monetizationOptions.map((opt) => (
                        <span
                          key={opt}
                          className="rounded-full border border-lime/25 bg-lime/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-lime/80"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Trust score preview */}
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-lime" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider">
                    Estimated Trust Score
                  </h3>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
                    <div
                      className="h-full rounded-full bg-lime transition-all duration-500"
                      style={{ width: `${trustScore}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-display text-lg font-bold text-lime">
                    {trustScore}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Your score increases with experience, certifications, and a welcome video.
                  Verification adds +13 points.
                </p>
              </div>

              {/* Launch button */}
              <button
                type="button"
                onClick={handleLaunch}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-lime px-6 py-4 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Rocket className="h-5 w-5" />
                Launch Creator Profile
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Your profile data is saved locally. Connect Supabase to sync across devices.
              </p>
            </div>
          </StepShell>
        )}

        {/* ── Navigation ───────────────────────────────── */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-elevated",
              step === 0 && "cursor-not-allowed opacity-30",
            )}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step < totalSteps - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
                !canProceed() && "cursor-not-allowed opacity-40",
              )}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────

function StepShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Textarea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label-eyebrow mb-2 block">{label}</label>
      <textarea
        rows={3}
        className="input w-full resize-y"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ReviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-elevated/50 p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </div>
  );
}
