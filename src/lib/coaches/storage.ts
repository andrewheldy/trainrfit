import { useEffect, useState, useCallback } from "react";

const FOLLOW_KEY = "gymlift.followedCoaches";
const SAVE_KEY = "gymlift.savedPrograms";
const STARTED_KEY = "gymlift.startedPrograms";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("coachesStorageChange", { detail: { key } }));
}

function useListStore(key: string) {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    setList(read(key));
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key?: string };
      if (!detail || detail.key === key) setList(read(key));
    };
    window.addEventListener("coachesStorageChange", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("coachesStorageChange", handler);
      window.removeEventListener("storage", handler);
    };
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      const current = read(key);
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      write(key, next);
    },
    [key],
  );

  const add = useCallback(
    (id: string) => {
      const current = read(key);
      if (!current.includes(id)) write(key, [...current, id]);
    },
    [key],
  );

  const has = useCallback((id: string) => list.includes(id), [list]);

  return { list, toggle, add, has };
}

export const useFollowedCoaches = () => useListStore(FOLLOW_KEY);
export const useSavedPrograms = () => useListStore(SAVE_KEY);
export const useStartedPrograms = () => useListStore(STARTED_KEY);
