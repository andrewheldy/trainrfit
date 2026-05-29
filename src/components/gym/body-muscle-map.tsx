'use client';

import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  Shield,
  Zap,
  Hand,
  Flame,
  Footprints,
  Mountain,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type View = 'front' | 'back';

interface MuscleGroup {
  name: string;
  slug: string;
  view: View;
  icon: LucideIcon;
  description: string;
  exerciseCount: number;
  /** Approximate hot-zone over the body silhouette, in % of container */
  zone: { top: string; left: string; width: string; height: string };
}

const muscleGroups: MuscleGroup[] = [
  // FRONT
  { name: 'Shoulders', slug: 'shoulders', view: 'front', icon: Shield, description: 'Cap, define, and stabilize every press.', exerciseCount: 18, zone: { top: '14%', left: '32%', width: '36%', height: '8%' } },
  { name: 'Chest',     slug: 'chest',     view: 'front', icon: Dumbbell, description: 'Push strength, pressing power, upper-body size.', exerciseCount: 24, zone: { top: '20%', left: '36%', width: '28%', height: '10%' } },
  { name: 'Biceps',    slug: 'biceps',    view: 'front', icon: Zap,     description: 'Pulling power and arm definition.', exerciseCount: 16, zone: { top: '24%', left: '22%', width: '12%', height: '12%' } },
  { name: 'Forearms',  slug: 'forearms',  view: 'front', icon: Hand,    description: 'Grip strength and arm endurance.', exerciseCount: 10, zone: { top: '36%', left: '18%', width: '12%', height: '12%' } },
  { name: 'Abs',       slug: 'abs',       view: 'front', icon: Flame,   description: 'Core stability, bracing, and definition.', exerciseCount: 20, zone: { top: '32%', left: '40%', width: '20%', height: '14%' } },
  { name: 'Obliques',  slug: 'obliques',  view: 'front', icon: Flame,   description: 'Rotational power and waist control.', exerciseCount: 12, zone: { top: '36%', left: '32%', width: '8%', height: '10%' } },
  { name: 'Quads',     slug: 'quads',     view: 'front', icon: Mountain, description: 'Squat strength and lower-body drive.', exerciseCount: 22, zone: { top: '50%', left: '34%', width: '32%', height: '18%' } },
  { name: 'Calves',    slug: 'calves',    view: 'front', icon: Footprints, description: 'Explosive lower-leg power.', exerciseCount: 8, zone: { top: '74%', left: '36%', width: '28%', height: '12%' } },
  // BACK
  { name: 'Traps',       slug: 'traps',       view: 'back', icon: Mountain, description: 'Upper-back size and shoulder support.', exerciseCount: 12, zone: { top: '12%', left: '36%', width: '28%', height: '8%' } },
  { name: 'Rear Delts',  slug: 'shoulders',   view: 'back', icon: Shield, description: 'Posture, posterior shoulder, pulling.', exerciseCount: 10, zone: { top: '16%', left: '28%', width: '44%', height: '6%' } },
  { name: 'Upper Back',  slug: 'back',        view: 'back', icon: Shield, description: 'Postural strength and density.', exerciseCount: 18, zone: { top: '20%', left: '32%', width: '36%', height: '10%' } },
  { name: 'Lats',        slug: 'back',        view: 'back', icon: Shield, description: 'V-taper width and pulling power.', exerciseCount: 20, zone: { top: '28%', left: '28%', width: '44%', height: '14%' } },
  { name: 'Triceps',     slug: 'triceps',     view: 'back', icon: Zap,    description: 'Lockout strength and arm size.', exerciseCount: 16, zone: { top: '24%', left: '18%', width: '12%', height: '14%' } },
  { name: 'Lower Back',  slug: 'back',        view: 'back', icon: Shield, description: 'Spinal strength and deadlift base.', exerciseCount: 10, zone: { top: '40%', left: '36%', width: '28%', height: '8%' } },
  { name: 'Glutes',      slug: 'glutes',      view: 'back', icon: Mountain, description: 'Hip drive and powerhouse strength.', exerciseCount: 18, zone: { top: '48%', left: '32%', width: '36%', height: '12%' } },
  { name: 'Hamstrings',  slug: 'hamstrings',  view: 'back', icon: Mountain, description: 'Posterior chain and hinge power.', exerciseCount: 16, zone: { top: '58%', left: '34%', width: '32%', height: '16%' } },
  { name: 'Calves',      slug: 'calves',      view: 'back', icon: Footprints, description: 'Explosive lower-leg power.', exerciseCount: 8, zone: { top: '74%', left: '36%', width: '28%', height: '12%' } },
];

const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

export function BodyMuscleMap() {
  const [view, setView] = useState<View>('front');
  const [active, setActive] = useState<MuscleGroup | null>(null);

  const visible = muscleGroups.filter((m) => m.view === view);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-surface">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="var(--lime)" />

      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {/* LEFT — copy + muscle info */}
        <div className="relative z-10 order-2 lg:order-1">
          <div className="label-eyebrow">Interactive Body</div>
          <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Tap a Muscle.<br />
            <span className="text-lime">Build Your Lift.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
            Choose a muscle group to discover exercises, form tutorials, and workouts built around your goals.
          </p>

          {/* Front/Back toggle */}
          <div className="mt-6 inline-flex overflow-hidden rounded-md border border-border bg-elevated text-xs font-semibold">
            {(['front', 'back'] as const).map((v) => (
              <button
                key={v}
                onClick={() => { setView(v); setActive(null); }}
                className={cn(
                  'px-5 py-2 capitalize transition-colors',
                  view === v ? 'bg-lime text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Floating muscle card */}
          <div className="mt-6 min-h-[200px]">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-border bg-elevated p-5 text-card-foreground shadow-none">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-lime text-primary-foreground">
                        <active.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-2xl font-semibold">{active.name}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{active.description}</p>
                        <div className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                          {active.exerciseCount} exercises
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/muscles/$slug"
                      params={{ slug: active.slug }}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-lime px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      View Workouts <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-md border border-dashed border-border bg-background/40 p-5"
                >
                  <div className="label-eyebrow">Start exploring</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hover or tap any highlighted zone on the body to preview that muscle group.
                  </p>
                  <Link
                    to="/exercises"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lime hover:underline"
                  >
                    Start Exploring <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — 3D scene with overlay muscle zones */}
        <div className="relative order-1 h-[420px] w-full overflow-hidden rounded-xl border border-border bg-background sm:h-[520px] lg:order-2 lg:h-[600px]">
          <SplineScene scene={SPLINE_SCENE} className="absolute inset-0 h-full w-full" />

          {/* Subtle gradient mask so zones read on top */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background/30 via-transparent to-background/40" />

          {/* Hot-zone overlays */}
          <div className="absolute inset-0">
            {visible.map((m) => {
              const isActive = active?.name === m.name;
              return (
                <button
                  key={m.name}
                  onMouseEnter={() => setActive(m)}
                  onFocus={() => setActive(m)}
                  onClick={() => setActive(m)}
                  aria-label={`${m.name} — ${m.exerciseCount} exercises`}
                  className={cn(
                    'group absolute rounded-full border transition-all duration-200',
                    'border-lime/0 bg-lime/0 hover:border-lime/60 hover:bg-lime/15 focus:border-lime/70 focus:bg-lime/20 focus:outline-none',
                    isActive && 'border-lime/70 bg-lime/20 shadow-[0_0_30px_-4px_var(--lime)]',
                  )}
                  style={m.zone}
                >
                  <span
                    className={cn(
                      'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-sm bg-background/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground opacity-0 transition-opacity',
                      'group-hover:opacity-100',
                      isActive && 'opacity-100',
                    )}
                  >
                    {m.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View badge */}
          <div className="pointer-events-none absolute right-4 top-4 rounded-md border border-border bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            {view} view · {visible.length} groups
          </div>
        </div>
      </div>
    </section>
  );
}
