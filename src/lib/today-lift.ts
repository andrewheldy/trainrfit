// Lightweight "Today's Lift" store backed by localStorage.
// Keeps the static exercise library decoupled from the Supabase tracker.

import { useSyncExternalStore } from "react";

const KEY = "gymlift:today-lift";

export interface TodayLiftItem {
  slug: string;
  addedAt: number;
}

interface TodayLift {
  date: string; // YYYY-MM-DD
  items: TodayLiftItem[];
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function read(): TodayLift {
  if (typeof window === "undefined") return { date: today(), items: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { date: today(), items: [] };
    const parsed = JSON.parse(raw) as TodayLift;
    if (parsed.date !== today()) return { date: today(), items: [] };
    return parsed;
  } catch {
    return { date: today(), items: [] };
  }
}

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function write(next: TodayLift) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

export function addToTodayLift(slug: string): { added: boolean } {
  const current = read();
  if (current.items.some((i) => i.slug === slug)) {
    return { added: false };
  }
  write({
    date: current.date,
    items: [...current.items, { slug, addedAt: Date.now() }],
  });
  return { added: true };
}

export function removeFromTodayLift(slug: string) {
  const current = read();
  write({
    date: current.date,
    items: current.items.filter((i) => i.slug !== slug),
  });
}

export function clearTodayLift() {
  write({ date: today(), items: [] });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const storageHandler = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", storageHandler);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", storageHandler);
  };
}

const EMPTY: TodayLift = { date: "", items: [] };

export function useTodayLift(): TodayLift {
  return useSyncExternalStore(
    subscribe,
    () => read(),
    () => EMPTY,
  );
}
