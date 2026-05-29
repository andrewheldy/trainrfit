import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

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
  const [allExercises, setAllExercises] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [s, ex] = await Promise.all([
        supabase
          .from("workout_sessions")
          .select("id, name, session_date, workout_exercises(id, exercise_id, sets, notes, exercises(name, slug))")
          .eq("user_id", user.id)
          .order("session_date", { ascending: false })
          .limit(10),
        supabase.from("exercises").select("id, name").order("name"),
      ]);
      setSessions((s.data as any) ?? []);
      setAllExercises(ex.data ?? []);
    })();
  }, [user]);

  if (loading) return <PageShell><p className="text-muted-foreground">Loading…</p></PageShell>;
  if (!user) return <SignInGate title="Track Every Set" />;

  async function createSession() {
    if (!user) return;
    const { data, error } = await supabase
      .from("workout_sessions")
      .insert({ user_id: user.id, name: `Lift · ${new Date().toLocaleDateString()}` })
      .select("id, name, session_date, workout_exercises(id, exercise_id, sets, notes, exercises(name, slug))")
      .single();
    if (error) return toast.error(error.message);
    setSessions((prev) => [data as any, ...prev]);
  }

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
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow">Workout Tracker</div>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Today's Lift</h1>
        </div>
        <button
          onClick={createSession}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New Session
        </button>
      </div>

      <div className="mt-10 space-y-6">
        {sessions.length === 0 ? (
          <EmptyState title="No workouts yet." body="Start your first lift and build from there." />
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
    </PageShell>
  );
}

function SessionCard({
  session, allExercises, onAdd, onUpdate, onRemoveExercise, onRemoveSession,
}: {
  session: Session;
  allExercises: { id: string; name: string }[];
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
