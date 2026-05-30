import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadProfile, saveProfile } from "@/lib/onboarding/storage";
import type { OnboardingProfile } from "@/lib/onboarding/types";
import { DEFAULT_PROFILE } from "@/lib/onboarding/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — Gym Lift" },
      { name: "description", content: "Build your personalized Gym Lift training plan." },
    ],
  }),
  component: OnboardingPage,
});

const TOTAL_STEPS = 20;

function OnboardingPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<OnboardingProfile>(DEFAULT_PROFILE);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
  }, []);

  const update = (patch: Partial<OnboardingProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      saveProfile(next);
      return next;
    });
  };

  const next = () => {
    if (step >= TOTAL_STEPS) {
      navigate({ to: "/onboarding/results" });
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-lg px-4 py-6 sm:py-10">
        <Header step={step} total={TOTAL_STEPS} onBack={back} />
        <div className="mt-8">
          <StepRouter step={step} profile={profile} update={update} next={next} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

function Header({ step, total, onBack }: { step: number; total: number; onBack: () => void }) {
  const pct = (step / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          disabled={step === 1}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="font-mono text-xs text-muted-foreground">
          {step} / {total}
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime to-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------- Reusable UI ----------------

function QuestionScreen({
  eyebrow,
  title,
  helper,
  children,
  canContinue,
  onContinue,
  ctaLabel = "Continue",
}: {
  eyebrow?: string;
  title: string;
  helper?: string;
  children: ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  ctaLabel?: string;
}) {
  return (
    <div className="flex flex-col">
      {eyebrow ? <div className="label-eyebrow">{eyebrow}</div> : null}
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{title}</h1>
      {helper ? <p className="mt-2 text-sm text-muted-foreground">{helper}</p> : null}
      <div className="mt-6">{children}</div>
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function OptionCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border bg-surface px-4 py-3.5 text-left transition",
        selected
          ? "border-lime bg-lime/10 ring-1 ring-lime"
          : "border-border hover:border-muted-foreground/40 hover:bg-elevated",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-display text-base font-semibold">{label}</div>
          {description ? (
            <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>
          ) : null}
        </div>
        {selected ? <Check className="h-4 w-4 shrink-0 text-lime" /> : null}
      </div>
    </button>
  );
}

function MultiSelectCardGroup({
  options,
  values,
  onChange,
  max,
}: {
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
  max?: number;
}) {
  const toggle = (opt: string) => {
    if (opt === "None") {
      onChange(values.includes("None") ? [] : ["None"]);
      return;
    }
    const without = values.filter((v) => v !== "None");
    if (without.includes(opt)) {
      onChange(without.filter((v) => v !== opt));
    } else {
      if (max && without.length >= max) return;
      onChange([...without, opt]);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <OptionCard
          key={opt}
          label={opt}
          selected={values.includes(opt)}
          onClick={() => toggle(opt)}
        />
      ))}
    </div>
  );
}

// ---------------- Step Router ----------------

function StepRouter({
  step,
  profile,
  update,
  next,
  navigate,
}: {
  step: number;
  profile: OnboardingProfile;
  update: (p: Partial<OnboardingProfile>) => void;
  next: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  switch (step) {
    case 1: return <StepWelcome onContinue={next} />;
    case 2: return <StepAge profile={profile} update={update} onContinue={next} />;
    case 3: return <StepSexAtBirth profile={profile} update={update} onContinue={next} />;
    case 4: return <StepGender profile={profile} update={update} onContinue={next} />;
    case 5: return <StepHeight profile={profile} update={update} onContinue={next} />;
    case 6: return <StepWeight profile={profile} update={update} onContinue={next} />;
    case 7: return <StepLocation profile={profile} update={update} onContinue={next} />;
    case 8: return <StepPrimaryGoal profile={profile} update={update} onContinue={next} />;
    case 9: return <StepExperience profile={profile} update={update} onContinue={next} />;
    case 10: return <StepCurrentFrequency profile={profile} update={update} onContinue={next} />;
    case 11: return <StepRealisticDays profile={profile} update={update} onContinue={next} />;
    case 12: return <StepWorkoutLength profile={profile} update={update} onContinue={next} />;
    case 13: return <StepEquipment profile={profile} update={update} onContinue={next} />;
    case 14: return <StepFocusMuscles profile={profile} update={update} onContinue={next} />;
    case 15: return <StepInjuries profile={profile} update={update} onContinue={next} />;
    case 16: return <StepFitnessLevel profile={profile} update={update} onContinue={next} />;
    case 17: return <StepBarriers profile={profile} update={update} onContinue={next} />;
    case 18: return <StepMotivation profile={profile} update={update} onContinue={next} />;
    case 19: return <StepWorkoutStyle profile={profile} update={update} onContinue={next} />;
    case 20: return <StepGenerating onDone={() => navigate({ to: "/onboarding/results" })} />;
    default: return null;
  }
}

// ---------------- Steps ----------------

function StepWelcome({ onContinue }: { onContinue: () => void }) {
  return (
    <QuestionScreen
      eyebrow="Train Smarter."
      title="Let’s build your Gym Lift plan."
      helper="Answer a few quick questions so your AI training coach can recommend workouts that actually match your body, schedule, goals, and equipment."
      canContinue
      onContinue={onContinue}
      ctaLabel="Start Assessment"
    >
      <div className="rounded-2xl border border-border bg-surface p-5">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Takes about 2 minutes</li>
          <li>• Get a personalized Week 1 plan</li>
          <li>• Save it straight to My Lift</li>
        </ul>
      </div>
    </QuestionScreen>
  );
}

function StepAge({ profile, update, onContinue }: StepProps) {
  const age = profile.age ?? "";
  const valid = profile.age !== null && profile.age >= 13 && profile.age <= 100;
  return (
    <QuestionScreen
      eyebrow="About You"
      title="How old are you?"
      canContinue={valid}
      onContinue={onContinue}
    >
      <NumInput
        value={age}
        min={13}
        max={100}
        suffix="years"
        onChange={(v) => update({ age: v })}
      />
    </QuestionScreen>
  );
}

function StepSexAtBirth({ profile, update, onContinue }: StepProps) {
  const opts: OnboardingProfile["sexAtBirth"][] = ["Male", "Female", "Prefer not to say"];
  return (
    <QuestionScreen
      eyebrow="About You"
      title="What was your sex assigned at birth?"
      helper="This helps with fitness estimates like calorie ranges and realistic progression."
      canContinue={!!profile.sexAtBirth}
      onContinue={onContinue}
    >
      <div className="space-y-2">
        {opts.map((o) => (
          <OptionCard key={o} label={o!} selected={profile.sexAtBirth === o} onClick={() => update({ sexAtBirth: o })} />
        ))}
      </div>
    </QuestionScreen>
  );
}

function StepGender({ profile, update, onContinue }: StepProps) {
  const opts: OnboardingProfile["gender"][] = ["Male", "Female", "Non-binary", "Prefer not to say", "Self-describe"];
  const valid = !!profile.gender && (profile.gender !== "Self-describe" || !!profile.genderSelfDescribe?.trim());
  return (
    <QuestionScreen
      eyebrow="About You"
      title="What’s your gender?"
      canContinue={valid}
      onContinue={onContinue}
    >
      <div className="space-y-2">
        {opts.map((o) => (
          <OptionCard key={o} label={o!} selected={profile.gender === o} onClick={() => update({ gender: o })} />
        ))}
        {profile.gender === "Self-describe" ? (
          <input
            value={profile.genderSelfDescribe ?? ""}
            onChange={(e) => update({ genderSelfDescribe: e.target.value })}
            placeholder="Describe (optional)"
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-lime/50"
          />
        ) : null}
      </div>
    </QuestionScreen>
  );
}

function StepHeight({ profile, update, onContinue }: StepProps) {
  const h = profile.height;
  const valid =
    h.unit === "imperial"
      ? (h.feet ?? 0) > 0
      : (h.centimeters ?? 0) > 0;
  return (
    <QuestionScreen
      eyebrow="Body Metrics"
      title="What’s your height?"
      canContinue={valid}
      onContinue={onContinue}
    >
      <UnitToggle
        left="Feet / inches"
        right="Centimeters"
        value={h.unit === "imperial" ? "left" : "right"}
        onChange={(side) =>
          update({ height: { ...h, unit: side === "left" ? "imperial" : "metric" } })
        }
      />
      {h.unit === "imperial" ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <NumInput value={h.feet ?? ""} suffix="ft" min={3} max={8} onChange={(v) => update({ height: { ...h, feet: v } })} />
          <NumInput value={h.inches ?? ""} suffix="in" min={0} max={11} onChange={(v) => update({ height: { ...h, inches: v } })} />
        </div>
      ) : (
        <div className="mt-4">
          <NumInput value={h.centimeters ?? ""} suffix="cm" min={90} max={250} onChange={(v) => update({ height: { ...h, centimeters: v } })} />
        </div>
      )}
    </QuestionScreen>
  );
}

function StepWeight({ profile, update, onContinue }: StepProps) {
  const w = profile.weight;
  const valid = (w.value ?? 0) > 0;
  return (
    <QuestionScreen
      eyebrow="Body Metrics"
      title="What’s your current weight?"
      canContinue={valid}
      onContinue={onContinue}
    >
      <UnitToggle
        left="Pounds"
        right="Kilograms"
        value={w.unit === "lbs" ? "left" : "right"}
        onChange={(side) => update({ weight: { ...w, unit: side === "left" ? "lbs" : "kg" } })}
      />
      <div className="mt-4">
        <NumInput value={w.value ?? ""} suffix={w.unit} min={50} max={700} onChange={(v) => update({ weight: { ...w, value: v } })} />
      </div>
    </QuestionScreen>
  );
}

function StepLocation({ profile, update, onContinue }: StepProps) {
  const loc = profile.location;
  const valid =
    loc.country === "USA"
      ? !!loc.state.trim() && !!loc.city.trim()
      : !!loc.otherLocation.trim() && !!loc.city.trim();
  return (
    <QuestionScreen
      eyebrow="About You"
      title="Where are you based?"
      canContinue={valid}
      onContinue={onContinue}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <OptionCard label="USA" selected={loc.country === "USA"} onClick={() => update({ location: { ...loc, country: "USA" } })} />
          <OptionCard label="Other" selected={loc.country === "Other"} onClick={() => update({ location: { ...loc, country: "Other" } })} />
        </div>
        {loc.country === "USA" ? (
          <>
            <TextInput placeholder="State" value={loc.state} onChange={(v) => update({ location: { ...loc, state: v } })} />
            <TextInput placeholder="City" value={loc.city} onChange={(v) => update({ location: { ...loc, city: v } })} />
          </>
        ) : (
          <>
            <TextInput placeholder="Country / region" value={loc.otherLocation} onChange={(v) => update({ location: { ...loc, otherLocation: v } })} />
            <TextInput placeholder="City" value={loc.city} onChange={(v) => update({ location: { ...loc, city: v } })} />
          </>
        )}
      </div>
    </QuestionScreen>
  );
}

function StepPrimaryGoal({ profile, update, onContinue }: StepProps) {
  const opts = [
    { label: "Build Muscle", emoji: "💪" },
    { label: "Lose Fat", emoji: "🔥" },
    { label: "Get Stronger", emoji: "🏋️" },
    { label: "Improve Athletic Performance", emoji: "⚡" },
    { label: "Improve General Health", emoji: "❤️" },
    { label: "Body Recomposition", emoji: "🔄" },
  ];
  return (
    <QuestionScreen
      eyebrow="Your Goal"
      title="What’s your main goal right now?"
      canContinue={!!profile.primaryGoal}
      onContinue={onContinue}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {opts.map((o) => (
          <OptionCard
            key={o.label}
            label={`${o.emoji}  ${o.label}`}
            selected={profile.primaryGoal === o.label}
            onClick={() => update({ primaryGoal: o.label })}
          />
        ))}
      </div>
    </QuestionScreen>
  );
}

function StepExperience({ profile, update, onContinue }: StepProps) {
  const opts = ["Never", "Less than 1 year", "1-3 years", "3-5 years", "5+ years"];
  return (
    <QuestionScreen
      eyebrow="Training History"
      title="How long have you been lifting?"
      canContinue={!!profile.trainingExperience}
      onContinue={onContinue}
    >
      <div className="space-y-2">
        {opts.map((o) => (
          <OptionCard key={o} label={o} selected={profile.trainingExperience === o} onClick={() => update({ trainingExperience: o })} />
        ))}
      </div>
    </QuestionScreen>
  );
}

function StepCurrentFrequency({ profile, update, onContinue }: StepProps) {
  const opts = ["I don’t exercise right now", "1-2x per week", "3-4x per week", "5-6x per week", "Daily"];
  return (
    <QuestionScreen
      eyebrow="Current Activity"
      title="How often do you currently exercise?"
      canContinue={!!profile.currentExerciseFrequency}
      onContinue={onContinue}
    >
      <div className="space-y-2">
        {opts.map((o) => (
          <OptionCard key={o} label={o} selected={profile.currentExerciseFrequency === o} onClick={() => update({ currentExerciseFrequency: o })} />
        ))}
      </div>
    </QuestionScreen>
  );
}

function StepRealisticDays({ profile, update, onContinue }: StepProps) {
  return (
    <QuestionScreen
      eyebrow="Start Realistic."
      title="How many days per week can you realistically train?"
      helper="Pick the number you can actually stick to. Consistency beats fantasy mode."
      canContinue={!!profile.realisticTrainingDays}
      onContinue={onContinue}
    >
      <div className="grid grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <button
            key={n}
            onClick={() => update({ realisticTrainingDays: n })}
            className={cn(
              "rounded-xl border bg-surface py-4 font-display text-lg font-bold transition",
              profile.realisticTrainingDays === n
                ? "border-lime bg-lime/10 text-lime"
                : "border-border hover:border-muted-foreground/40",
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </QuestionScreen>
  );
}

function StepWorkoutLength({ profile, update, onContinue }: StepProps) {
  const opts = ["20-30 minutes", "30-45 minutes", "45-60 minutes", "60+ minutes"];
  return (
    <QuestionScreen
      eyebrow="Schedule"
      title="How long do you want most workouts to be?"
      canContinue={!!profile.preferredWorkoutLength}
      onContinue={onContinue}
    >
      <div className="grid grid-cols-2 gap-2">
        {opts.map((o) => (
          <OptionCard key={o} label={o} selected={profile.preferredWorkoutLength === o} onClick={() => update({ preferredWorkoutLength: o })} />
        ))}
      </div>
    </QuestionScreen>
  );
}

function StepEquipment({ profile, update, onContinue }: StepProps) {
  const opts = ["Commercial Gym", "Dumbbells", "Barbell", "Machines", "Cable Machine", "Kettlebells", "Resistance Bands", "Bodyweight Only", "Home Gym"];
  return (
    <QuestionScreen
      eyebrow="Equipment"
      title="What equipment do you have access to?"
      canContinue={profile.equipment.length > 0}
      onContinue={onContinue}
    >
      <MultiSelectCardGroup options={opts} values={profile.equipment} onChange={(v) => update({ equipment: v })} />
    </QuestionScreen>
  );
}

function StepFocusMuscles({ profile, update, onContinue }: StepProps) {
  const opts = ["Chest", "Back", "Shoulders", "Arms", "Abs", "Glutes", "Quads", "Hamstrings", "Calves", "Full Body"];
  return (
    <QuestionScreen
      eyebrow="Focus"
      title="Which areas do you care about most?"
      helper="Pick up to 3."
      canContinue={profile.focusMuscles.length > 0}
      onContinue={onContinue}
    >
      <MultiSelectCardGroup options={opts} values={profile.focusMuscles} onChange={(v) => update({ focusMuscles: v })} max={3} />
    </QuestionScreen>
  );
}

function StepInjuries({ profile, update, onContinue }: StepProps) {
  const opts = ["None", "Shoulder", "Knee", "Back", "Elbow", "Wrist", "Hip", "Ankle", "Other"];
  const showDetails = profile.injuries.length > 0 && !(profile.injuries.length === 1 && profile.injuries[0] === "None");
  return (
    <QuestionScreen
      eyebrow="Safety First."
      title="Any injuries or movement limitations?"
      canContinue={profile.injuries.length > 0}
      onContinue={onContinue}
    >
      <MultiSelectCardGroup options={opts} values={profile.injuries} onChange={(v) => update({ injuries: v })} />
      {showDetails ? (
        <div className="mt-4">
          <TextInput
            placeholder="Anything your coach should know?"
            value={profile.injuryDetails}
            onChange={(v) => update({ injuryDetails: v })}
          />
        </div>
      ) : null}
    </QuestionScreen>
  );
}

function StepFitnessLevel({ profile, update, onContinue }: StepProps) {
  const opts = [
    { label: "Beginner", description: "I need help learning exercises." },
    { label: "Intermediate", description: "I know most movements but want structure." },
    { label: "Advanced", description: "I already follow structured training." },
  ];
  return (
    <QuestionScreen
      eyebrow="Self-Assessment"
      title="How would you describe yourself?"
      canContinue={!!profile.fitnessLevelSelfAssessment}
      onContinue={onContinue}
    >
      <div className="space-y-2">
        {opts.map((o) => (
          <OptionCard
            key={o.label}
            label={o.label}
            description={o.description}
            selected={profile.fitnessLevelSelfAssessment === o.label}
            onClick={() => update({ fitnessLevelSelfAssessment: o.label })}
          />
        ))}
      </div>
    </QuestionScreen>
  );
}

function StepBarriers({ profile, update, onContinue }: StepProps) {
  const opts = ["Lack of time", "Lack of motivation", "Not knowing what to do", "Gym anxiety", "Inconsistent schedule", "Results feel slow", "Equipment access", "Other"];
  return (
    <QuestionScreen
      eyebrow="Real Talk"
      title="What usually gets in the way?"
      canContinue={profile.barriers.length > 0}
      onContinue={onContinue}
    >
      <MultiSelectCardGroup options={opts} values={profile.barriers} onChange={(v) => update({ barriers: v })} />
    </QuestionScreen>
  );
}

function StepMotivation({ profile, update, onContinue }: StepProps) {
  const opts = ["Looking better", "Feeling healthier", "Building confidence", "Athletic performance", "Stress relief", "Longevity", "Building discipline"];
  return (
    <QuestionScreen
      eyebrow="Your Why"
      title="What motivates you most?"
      canContinue={!!profile.motivation}
      onContinue={onContinue}
    >
      <div className="space-y-2">
        {opts.map((o) => (
          <OptionCard key={o} label={o} selected={profile.motivation === o} onClick={() => update({ motivation: o })} />
        ))}
      </div>
    </QuestionScreen>
  );
}

function StepWorkoutStyle({ profile, update, onContinue }: StepProps) {
  const opts = ["Simple and beginner-friendly", "Strength focused", "Muscle-building focused", "Fast and efficient", "Balanced full-body", "Athletic conditioning"];
  return (
    <QuestionScreen
      eyebrow="Style"
      title="What style sounds best?"
      canContinue={!!profile.preferredWorkoutStyle}
      onContinue={onContinue}
      ctaLabel="Build My Plan"
    >
      <div className="space-y-2">
        {opts.map((o) => (
          <OptionCard key={o} label={o} selected={profile.preferredWorkoutStyle === o} onClick={() => update({ preferredWorkoutStyle: o })} />
        ))}
      </div>
    </QuestionScreen>
  );
}

function StepGenerating({ onDone }: { onDone: () => void }) {
  const items = useMemo(
    () => [
      "Reviewing your goals",
      "Matching exercises to your equipment",
      "Setting a realistic weekly target",
      "Creating your Week 1 plan",
    ],
    [],
  );
  const [done, setDone] = useState<number>(0);

  useEffect(() => {
    const timers: number[] = [];
    items.forEach((_, i) => {
      timers.push(window.setTimeout(() => setDone(i + 1), 600 * (i + 1)));
    });
    const finalTimer = window.setTimeout(() => onDone(), 600 * (items.length + 1));
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [items, onDone]);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="label-eyebrow">No bro-science. Just better training.</div>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
        Building your Gym Lift starting plan…
      </h1>
      <div className="mt-8 w-full space-y-3">
        {items.map((label, i) => {
          const isDone = i < done;
          const isActive = i === done;
          return (
            <div
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-surface px-4 py-3 text-left transition",
                isDone ? "border-lime/40" : "border-border",
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                  isDone
                    ? "border-lime bg-lime text-primary-foreground"
                    : isActive
                      ? "border-lime text-lime"
                      : "border-border text-muted-foreground",
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : isActive ? "…" : i + 1}
              </div>
              <div className={cn("text-sm", isDone ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Small inputs ----------------

interface StepProps {
  profile: OnboardingProfile;
  update: (p: Partial<OnboardingProfile>) => void;
  onContinue: () => void;
}

function NumInput({
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  value: number | string;
  onChange: (v: number | null) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 pr-16 font-mono text-base outline-none focus:border-lime/50"
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-lime/50"
    />
  );
}

function UnitToggle({
  left,
  right,
  value,
  onChange,
}: {
  left: string;
  right: string;
  value: "left" | "right";
  onChange: (side: "left" | "right") => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-xl border border-border bg-elevated p-1 text-sm">
      <button
        onClick={() => onChange("left")}
        className={cn(
          "rounded-lg py-2 font-medium transition",
          value === "left" ? "bg-surface text-foreground shadow" : "text-muted-foreground",
        )}
      >
        {left}
      </button>
      <button
        onClick={() => onChange("right")}
        className={cn(
          "rounded-lg py-2 font-medium transition",
          value === "right" ? "bg-surface text-foreground shadow" : "text-muted-foreground",
        )}
      >
        {right}
      </button>
    </div>
  );
}
