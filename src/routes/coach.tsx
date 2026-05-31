import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "AI Coach — trainr" },
      { name: "description", content: "Personalized guidance powered by AI. Workout adjustments, alternatives, plateau detection." },
    ],
  }),
  component: CoachPage,
});

interface Question { id: string; question: string; answer: string | null; created_at: string }

function placeholderAnswer(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("split")) return "A solid starting point is an Upper/Lower split 4 days per week. It hits each muscle group twice with enough recovery for most lifters.";
  if (lower.includes("hypertrophy")) return "Aim for 10–20 hard sets per muscle per week, mostly in the 6–15 rep range, taken close to failure. Progress weight or reps over time.";
  if (lower.includes("form") || lower.includes("technique")) return "Open the exercise's detail page in the library for step-by-step instructions, common mistakes, and form tips.";
  return "Great question. A coach-quality response is coming soon — for now, browse the Exercise Library and Muscle Explorer for evidence-based guidance.";
}

function CoachPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Question[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("ai_questions")
        .select("id, question, answer, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setItems(data ?? []);
    })();
  }, [user]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    if (!user) return;
    setBusy(true);
    const answer = placeholderAnswer(input);
    const { data } = await supabase
      .from("ai_questions")
      .insert({ user_id: user.id, question: input, answer })
      .select("id, question, answer, created_at")
      .single();
    if (data) setItems((prev) => [data, ...prev]);
    setInput("");
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex items-center gap-2 label-eyebrow">
        <Sparkles className="h-3.5 w-3.5 text-lime" /> AI Coach
      </div>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Personalized Guidance Powered By AI</h1>
      <p className="mt-3 text-muted-foreground">
        trainr reads your training history, consistency, and recovery to recommend real adjustments — not generic advice.
      </p>

      {!user ? (
        <div className="mt-8 rounded-md border border-border bg-surface p-6">
          <p className="text-sm text-muted-foreground">Sign in to ask questions and save your coach history.</p>
          <Link to="/auth" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Sign in</Link>
        </div>
      ) : (
        <>
          <form onSubmit={submit} className="mt-8 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. What split should I run as a beginner?"
              className="flex-1 rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-lime/50"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-4 w-4" /> Ask
            </button>
          </form>

          <div className="mt-10 space-y-4">
            {items.length === 0 ? (
              <p className="rounded-md border border-border bg-surface p-6 text-sm text-muted-foreground">
                No questions yet. Try one of: "Best split for hypertrophy?", "How many sets per week for chest?", or "How do I improve squat form?"
              </p>
            ) : null}
            {items.map((q) => (
              <div key={q.id} className="rounded-md border border-border bg-surface p-5">
                <div className="label-eyebrow">You asked</div>
                <p className="mt-1 font-display text-lg">{q.question}</p>
                <div className="mt-4 label-eyebrow">Coach</div>
                <p className="mt-1 text-sm text-foreground/90">{q.answer}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
