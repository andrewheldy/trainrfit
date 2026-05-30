import { useSyncExternalStore } from "react";

const KEY = "gym-lift-subscription";

export type SubscriptionTier = "FREE" | "PRO_TRIAL" | "PRO";

export type Subscription = {
  tier: SubscriptionTier;
  hasActiveTrial: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
};

const DEFAULT: Subscription = { tier: "FREE", hasActiveTrial: false };

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const h = () => cb();
  if (typeof window !== "undefined") window.addEventListener("storage", h);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", h);
  };
}

export function loadSubscription(): Subscription {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}
export function saveSubscription(s: Subscription) {
  window.localStorage.setItem(KEY, JSON.stringify(s));
  emit();
}
export function startProTrial(): Subscription {
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sub: Subscription = {
    tier: "PRO_TRIAL",
    hasActiveTrial: true,
    trialStartDate: now.toISOString(),
    trialEndDate: end.toISOString(),
  };
  saveSubscription(sub);
  return sub;
}
export function setFree() {
  saveSubscription({ tier: "FREE", hasActiveTrial: false });
}
export function useSubscription(): Subscription {
  return useSyncExternalStore(subscribe, loadSubscription, () => DEFAULT);
}
