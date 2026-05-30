import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import {
  useTodayLift,
  removeFromTodayLift,
  clearTodayLift,
} from "@/lib/today-lift";
import { exercises as staticExercises } from "@/data/exercises";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Workout Tracker — Gym Lift" },
      { name: "description", content: "Log every set. Track every lift. Build your training history." },
    ],
  }),
  component: TrackerPage,
});

interface SessionExercise {
  id: string;
  exercise_id: string;
  sets: { reps: number; weight: number }[];
  notes: string | null;
  exercises: { name: string; slug: string };
}

interface Session {
  id: string;
  name: string | null;
  session_date: string;
  workout_exercises: SessionExercise[];
}

function TrackerPage() {
  const { user, loading } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [allExercises, setAllExercises] = useState<{ id: string; name: string; slug: string }[]>([]);

  async function refresh() {
    if (!user) return;
    const [s, ex] = await Promise.all([
      supabase
        .from("workout_sessions")
        .select("id, name, session_date, workout_exercises(id, exercise_id, sets, notes, exercises(name, slug))")
        .eq("user_id", user.id)
        .order("session_date", { ascending: false })
        .limit(10),
      supabase.from("exercises").select("id, name, slug").order("name"),
    ]);
    setSessions((s.data as any) ?? []);
    setAllExercises(ex.data ?? []);
  }

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  if (loading) return <PageShell><p className="text-muted-foreground">Loading…</p></PageShell>;
  if (!user) return <SignInGate title="Track Every Set" />;

  async function addExercise(sessionId: string, exerciseId: string) {
    if (!user) return;
    const { data, error } = await supabase
      .from("workout_exercises")
      .insert({
        session_id: sessionId,
        exercise_id: exerciseId,
        user_id: user.id,
        sets: [{ reps: 0, weight: 0 }],
      })
      .select("id, exercise_id, sets, notes, exercises(name, slug)")
      .single();
    if (error) return toast.error(error.message);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, workout_exercises: [...s.workout_exercises, data as any] }
          : s
      )
    );
  }

  async function updateSets(weId: string, sets: { reps: number; weight: number }[]) {
    await supabase.from("workout_exercises").update({ sets }).eq("id", weId);
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        workout_exercises: s.workout_exercises.map((we) =>
          we.id === weId ? { ...we, sets } : we
        ),
      }))
    );
  }

  async function removeExercise(weId: string) {
    await supabase.from("workout_exercises").delete().eq("id", weId);
    setSessions((prev) =>
      prev.map((s) => ({ ...s, workout_exercises: s.workout_exercises.filter((we) => we.id !== weId) }))
    );
  }

  async function removeSession(id: string) {
    await supabase.from("workout_sessions").delete().eq("id", id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <PageShell>
      <div>
        <div className="label-eyebrow">Workout Tracker</div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Today's Lift</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Build today's lift from the exercise library, name it, then save it to your history.
        </p>
      </div>

      <TodayLiftBuilder
        userId={user.id}
        allExercises={allExercises}
        onSaved={async () => {
          await refresh();
        }}
      />

      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold">Saved Sessions</h2>
        <div className="mt-4 space-y-6">
          {sessions.length === 0 ? (
            <EmptyState title="No saved sessions yet." body="Save today's lift to start building your history." />
          ) : null}

          {sessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              allExercises={allExercises}
              onAdd={(eid) => addExercise(s.id, eid)}
              onUpdate={updateSets}
              onRemoveExercise={removeExercise}
              onRemoveSession={() => removeSession(s.id)}
            />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function TodayLiftBuilder({
  userId,
  allExercises,
  onSaved,
}: {
  userId: string;
  allExercises: { id: string; name: string; slug: string }[];
  onSaved: () => void | Promise<void>;
}) {
  const lift = useTodayLift();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const items = useMemo(() => {
    return lift.items.map((i) => {
      const dbMatch = allExercises.find((e) => e.slug === i.slug);
      const staticMatch = staticExercises.find((e) => e.slug === i.slug);
      return {
        slug: i.slug,
        name: dbMatch?.name ?? staticMatch?.name ?? i.slug,
        exerciseId: dbMatch?.id ?? null,
      };
    });
  }, [lift.items, allExercises]);

  async function save() {
    if (items.length === 0) return;
    const missing = items.filter((i) => !i.exerciseId);
    if (missing.length > 0) {
      return toast.error("Some exercises aren't in the library yet", {
        description: missing.map((m) => m.name).join(", "),
      });
    }
    setSaving(true);
    try {
      const { data: session, error: sErr } = await supabase
        .from("workout_sessions")
        .insert({
          user_id: userId,
          name: name.trim() || `Lift · ${new Date().toLocaleDateString()}`,
        })
        .select("id")
        .single();
      if (sErr || !session) throw sErr ?? new Error("Failed to create session");

      const rows = items.map((it, idx) => ({
        session_id: session.id,
        exercise_id: it.exerciseId!,
        user_id: userId,
        order_index: idx,
        sets: [{ reps: 0, weight: 0 }],
      }));
      const { error: weErr } = await supabase.from("workout_exercises").insert(rows);
      if (weErr) throw weErr;

      toast.success("Lift saved", { description: `${items.length} exercise${items.length === 1 ? "" : "s"}` });
      clearTodayLift();
      setName("");
      await onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save lift");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-lime/30 bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="label-eyebrow text-lime">Pending</div>
          <h2 className="mt-1 font-display text-xl font-semibold">
            Today's Lift · {items.length} exercise{items.length === 1 ? "" : "s"}
          </h2>
        </div>
        {items.length > 0 ? (
          <button
            onClick={() => clearTodayLift()}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Clear
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Head to the{" "}
          <Link to="/exercises" className="font-semibold text-lime hover:underline">
            Exercise Library
          </Link>{" "}
          and tap "Add to My Lift" on any movement.
        </p>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-border rounded-md border border-border bg-background">
            {items.map((it) => (
              <li key={it.slug} className="flex items-center justify-between px-4 py-3">
                <Link
                  to="/exercises/$slug"
                  params={{ slug: it.slug }}
                  className="text-sm font-medium hover:text-lime"
                >
                  {it.name}
                </Link>
                <button
                  onClick={() => removeFromTodayLift(it.slug)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${it.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name this lift (e.g. Push Day A)"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-lime/50"
            />
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Lift"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SessionCard({
  session, allExercises, onAdd, onUpdate, onRemoveExercise, onRemoveSession,
}: {
  session: Session;
  allExercises: { id: string; name: string; slug: string }[];
  onAdd: (id: string) => void;
  onUpdate: (weId: string, sets: { reps: number; weight: number }[]) => void;
  onRemoveExercise: (id: string) => void;
  onRemoveSession: () => void;
}) {
  const [picker, setPicker] = useState("");

  return (
    <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="label-eyebrow">{new Date(session.session_date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div>
          <h2 className="mt-1 font-display text-xl font-semibold">{session.name ?? "Session"}</h2>
        </div>
        <button onClick={onRemoveSession} className="text-xs text-muted-foreground hover:text-destructive">
          Delete
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {session.workout_exercises.map((we) => (
          <div key={we.id} className="rounded-md border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <Link to="/exercises/$slug" params={{ slug: we.exercises.slug }} className="font-display text-base font-semibold hover:text-lime">
                {we.exercises.name}
              </Link>
              <button onClick={() => onRemoveExercise(we.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-[24px_1fr_1fr] items-center gap-2 text-xs text-muted-foreground">
              <span>#</span><span>Reps</span><span>Weight (kg)</span>
            </div>
            {we.sets.map((set, idx) => (
              <div key={idx} className="mt-2 grid grid-cols-[24px_1fr_1fr_auto] items-center gap-2">
                <span className="font-mono text-sm text-lime">{idx + 1}</span>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => {
                    const sets = [...we.sets];
                    sets[idx] = { ...sets[idx], reps: Number(e.target.value) };
                    onUpdate(we.id, sets);
                  }}
                  className="rounded border border-border bg-surface px-2 py-1.5 font-mono text-sm outline-none focus:border-lime/50"
                />
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) => {
                    const sets = [...we.sets];
                    sets[idx] = { ...sets[idx], weight: Number(e.target.value) };
                    onUpdate(we.id, sets);
                  }}
                  className="rounded border border-border bg-surface px-2 py-1.5 font-mono text-sm outline-none focus:border-lime/50"
                />
                <button
                  onClick={() => onUpdate(we.id, we.sets.filter((_, i) => i !== idx))}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => onUpdate(we.id, [...we.sets, { reps: 0, weight: 0 }])}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-lime hover:underline"
            >
              <Plus className="h-3 w-3" /> Add set
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <select
          value={picker}
          onChange={(e) => setPicker(e.target.value)}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
        >
          <option value="">Add exercise…</option>
          {allExercises.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <button
          onClick={() => { if (picker) { onAdd(picker); setPicker(""); } }}
          disabled={!picker}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">{children}</div>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-10 text-center">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function SignInGate({ title }: { title: string }) {
  return (
    <PageShell>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">Sign in to start tracking your lifts.</p>
      <Link to="/auth" className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
        Sign in
      </Link>
    </PageShell>
  );
}
