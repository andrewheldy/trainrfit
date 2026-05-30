import { useSyncExternalStore } from "react";
import { DEFAULT_PROFILE, type OnboardingProfile, type Program } from "./types";

const PROFILE_KEY = "gym-lift-onboarding-profile";
const PROGRAM_KEY = "gym-lift-program";
const PROGRESS_KEY = "gym-lift-program-progress";

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const h = () => {
    cb();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", h);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", h);
  };
}

export function loadProfile(): OnboardingProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}
export function saveProfile(p: OnboardingProfile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  emit();
}

export function loadProgram(): Program | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROGRAM_KEY);
    return raw ? (JSON.parse(raw) as Program) : null;
  } catch {
    return null;
  }
}
export function saveProgram(p: Program) {
  window.localStorage.setItem(PROGRAM_KEY, JSON.stringify(p));
  emit();
}
export function clearProgram() {
  window.localStorage.removeItem(PROGRAM_KEY);
  emit();
}

// Progress tracking per exercise (key = `${dayIndex}:${exIndex}`)
export type Progress = Record<string, boolean>;
export function loadProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}
export function saveProgress(p: Progress) {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  emit();
}

export function useProfile(): OnboardingProfile {
  return useSyncExternalStore(subscribe, loadProfile, () => DEFAULT_PROFILE);
}
export function useProgram(): Program | null {
  return useSyncExternalStore(subscribe, loadProgram, () => null);
}
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, loadProgress, () => ({}));
}
