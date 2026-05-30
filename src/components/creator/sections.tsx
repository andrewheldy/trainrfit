import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Plus,
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Trophy,
  Wallet,
  Handshake,
  Settings as SettingsIcon,
  Upload,
  Pin,
  Star,
  Download,
  ExternalLink,
  Video,
  FileText,
  Image as ImageIcon,
  BookOpen,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { SectionHeader, StatCard, Card, Pill } from "./section-shell";
import {
  CURRENT_CREATOR,
  OVERVIEW_STATS,
  SUBSCRIBER_GROWTH,
  REVENUE_GROWTH,
  TOP_PROGRAMS,
  POPULAR_MUSCLE_GROUPS,
  COMPLETION_RATE,
  ACTIVITY_HEATMAP,
  ACTIVITY_HEATMAP_DAYS,
  ACTIVITY_HEATMAP_HOURS,
  CREATOR_PROGRAMS,
  CONTENT_LIBRARY,
  AI_COACH_KNOWLEDGE,
  COMMUNITY_POSTS,
  CHALLENGES,
  PAYOUTS,
  REVENUE_BREAKDOWN,
  PARTNERSHIPS,
} from "@/lib/creator/mock-data";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const tooltipStyle = {
  backgroundColor: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

/* ───────────────────────── Overview ───────────────────────── */

export function OverviewSection() {
  const s = OVERVIEW_STATS;
  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Welcome back, ${CURRENT_CREATOR.name.split(" ")[0]}`}
        description="Your creator performance this month."
        action={
          <button className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground sm:self-end">
            <Plus className="h-3.5 w-3.5" /> New Program
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          label="Subscribers"
          value={s.subscribers.total.toLocaleString()}
          sub={
            <span className="inline-flex items-center gap-1 text-lime">
              <TrendingUp className="h-3 w-3" /> +{s.subscribers.growthPct}% • {s.subscribers.newThisMonth.toLocaleString()} new
            </span>
          }
        />
        <StatCard
          label="Monthly Revenue"
          value={usd(s.revenue.gross)}
          sub={`Creator share ${usd(s.revenue.creatorShare)} • 70%`}
        />
        <StatCard
          label="Estimated Payout"
          value={usd(s.revenue.estimatedPayout)}
          sub="Next: Dec 1, 2026"
        />
        <StatCard
          label="Program Sales"
          value={s.programs.purchases.toLocaleString()}
          sub={`${usd(s.programs.revenue)} lifetime`}
        />
        <StatCard
          label="AI Coach Subs"
          value={s.aiCoach.subscribers.toLocaleString()}
          sub={`${usd(s.aiCoach.revenue)} this month`}
        />
        <StatCard
          label="Community"
          value={s.community.members.toLocaleString()}
          sub={`${s.community.activeWeekly.toLocaleString()} active this week`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Subscriber Growth" className="lg:col-span-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SUBSCRIBER_GROWTH}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="subs" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Retention">
          <div className="space-y-5 py-2">
            <RetentionBar label="30-Day" pct={s.retention.d30} />
            <RetentionBar label="90-Day" pct={s.retention.d90} />
            <div className="rounded-md border border-border bg-elevated/40 p-3 text-xs text-muted-foreground">
              Retention is <span className="font-semibold text-lime">above platform average</span> by 12%.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RetentionBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full bg-lime" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ───────────────────────── Analytics ───────────────────────── */

export function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics" description="Performance, engagement, and content insights." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Revenue Growth">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_GROWTH}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => usd(v)} />
                <Line type="monotone" dataKey="gross" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="creator" stroke="var(--lime)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Workout Completion Rate">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPLETION_RATE}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="pct" fill="var(--lime)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Top Programs">
          <ul className="divide-y divide-border text-sm">
            {TOP_PROGRAMS.map((p) => (
              <li key={p.name} className="flex items-center justify-between py-2.5">
                <span className="truncate pr-3">{p.name}</span>
                <span className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{p.sales.toLocaleString()} sales</span>
                  <span className="font-semibold text-foreground">{usd(p.revenue)}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Popular Muscle Groups">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={POPULAR_MUSCLE_GROUPS} layout="vertical">
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="group" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={64} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Activity Heatmap" action={<span className="text-xs text-muted-foreground">Day × Hour</span>}>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-[auto_repeat(7,minmax(36px,1fr))] gap-1 text-[10px] text-muted-foreground">
              <div />
              {ACTIVITY_HEATMAP_HOURS.map((h) => (
                <div key={h} className="text-center">{h}</div>
              ))}
              {ACTIVITY_HEATMAP_DAYS.map((d, di) => (
                <>
                  <div key={d} className="flex items-center pr-1 text-right">{d}</div>
                  {ACTIVITY_HEATMAP[di].map((v, hi) => (
                    <div
                      key={`${d}-${hi}`}
                      className="aspect-square rounded"
                      style={{
                        backgroundColor: `color-mix(in oklab, var(--lime) ${v}%, var(--elevated))`,
                      }}
                      title={`${d} ${ACTIVITY_HEATMAP_HOURS[hi]}: ${v}%`}
                    />
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────────── Programs ───────────────────────── */

export function ProgramsSection() {
  const [showBuilder, setShowBuilder] = useState(false);
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Workout Programs"
        description="Create, publish, and manage your training programs."
        action={
          <button
            onClick={() => setShowBuilder((v) => !v)}
            className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground sm:self-end"
          >
            <Plus className="h-3.5 w-3.5" /> {showBuilder ? "Close Builder" : "New Program"}
          </button>
        }
      />

      {showBuilder && <ProgramBuilder onClose={() => setShowBuilder(false)} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CREATOR_PROGRAMS.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="relative aspect-[16/9] overflow-hidden bg-elevated">
              <img src={p.thumbnail} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute right-2 top-2">
                <Pill tone={p.status === "Published" ? "lime" : p.status === "Draft" ? "warn" : "muted"}>
                  {p.status}
                </Pill>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-base font-semibold leading-tight">{p.name}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                <Pill>{p.difficulty}</Pill>
                <Pill>{p.duration}</Pill>
                <Pill>{p.goal}</Pill>
                <Pill>{p.type}</Pill>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {p.enrolled.toLocaleString()}</span>
                {p.rating > 0 && (
                  <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-lime text-lime" /> {p.rating}</span>
                )}
                <span className="font-semibold text-foreground">${p.price}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-elevated">Edit</button>
                <button className="flex-1 rounded-md bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-elevated/70">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramBuilder({ onClose }: { onClose: () => void }) {
  return (
    <Card title="New Program">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Program Name"><input className="input" placeholder="e.g. Hypertrophy Block" /></Field>
        <Field label="Price (USD)"><input type="number" className="input" placeholder="79" /></Field>
        <Field label="Difficulty">
          <select className="input">
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </Field>
        <Field label="Duration">
          <select className="input">
            <option>4 weeks</option><option>8 weeks</option><option>12 weeks</option><option>Custom</option>
          </select>
        </Field>
        <Field label="Goal">
          <select className="input">
            <option>Muscle Gain</option><option>Fat Loss</option><option>Strength</option>
            <option>Athletic Performance</option><option>Body Recomposition</option>
          </select>
        </Field>
        <Field label="Type">
          <select className="input">
            <option>One-time Purchase</option><option>Subscription</option>
          </select>
        </Field>
        <Field label="Description" full>
          <textarea rows={3} className="input" placeholder="Describe your program..." />
        </Field>
        <Field label="Thumbnail" full>
          <UploadBox label="Drop image or click to upload" />
        </Field>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider">Workout Builder</h4>
        <div className="space-y-2">
          {["Day 1 — Push", "Day 2 — Pull", "Day 3 — Legs"].map((d) => (
            <div key={d} className="flex items-center justify-between rounded-md border border-border bg-elevated/40 px-3 py-2.5 text-sm">
              <span className="font-medium">{d}</span>
              <button className="text-xs text-lime hover:underline">+ Add exercise</button>
            </div>
          ))}
          <button className="w-full rounded-md border border-dashed border-border px-3 py-2.5 text-xs text-muted-foreground hover:bg-elevated/40">
            + Add training day
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
        <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-xs font-semibold hover:bg-elevated">Cancel</button>
        <button className="rounded-md bg-elevated px-4 py-2 text-xs font-semibold hover:bg-elevated/70">Save Draft</button>
        <button className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Publish</button>
      </div>
    </Card>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={"block " + (full ? "md:col-span-2" : "")}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function UploadBox({ label }: { label: string }) {
  return (
    <div className="flex h-28 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-elevated/30 text-xs text-muted-foreground hover:border-lime/40">
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-4 w-4" />
        {label}
      </div>
    </div>
  );
}

/* ───────────────────────── Content Library ───────────────────────── */

const CONTENT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Video, PDF: FileText, Image: ImageIcon, Guide: BookOpen,
};

export function ContentSection() {
  const [filter, setFilter] = useState<string>("All");
  const cats = ["All", "Tutorial", "Program", "Premium", "Community", "Free"];
  const items = filter === "All" ? CONTENT_LIBRARY : CONTENT_LIBRARY.filter((c) => c.category === filter);
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Content Library"
        description="Videos, PDFs, exercise guides, and resources."
        action={
          <button className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground sm:self-end">
            <Upload className="h-3.5 w-3.5" /> Upload Content
          </button>
        }
      />

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={
              "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors " +
              (filter === c
                ? "border-lime/50 bg-lime/15 text-lime"
                : "border-border text-muted-foreground hover:text-foreground")
            }
          >
            {c}
          </button>
        ))}
        <input className="input ml-auto max-w-xs" placeholder="Search content..." />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => {
          const Icon = CONTENT_ICON[c.type] ?? FileText;
          return (
            <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-elevated">
                <Icon className="h-5 w-5 text-lime" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{c.title}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Pill>{c.category}</Pill>
                  <span>{c.size}</span>
                  <span>• {c.updated}</span>
                </div>
              </div>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-elevated hover:text-foreground">
                <Download className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── AI Coach ───────────────────────── */

export function AICoachSection() {
  const [msg, setMsg] = useState("");
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Train Your AI Coach"
        description="Upload knowledge, set personality, and let your audience subscribe to your AI."
        action={<Pill tone="lime">4,280 active subscribers</Pill>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Knowledge Base" className="lg:col-span-2">
          <UploadBox label="Drop videos, PDFs, plans, FAQs, voice samples" />
          <ul className="mt-4 divide-y divide-border text-sm">
            {AI_COACH_KNOWLEDGE.map((k) => (
              <li key={k.name} className="flex items-center justify-between py-2.5">
                <span className="inline-flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 text-lime" />
                  <span className="truncate">{k.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{k.size}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Coach Settings">
          <div className="space-y-3 text-sm">
            <Field label="Personality">
              <select className="input"><option>Analytical & Direct</option><option>Encouraging</option><option>Tough Love</option></select>
            </Field>
            <Field label="Coaching Style">
              <select className="input"><option>Evidence-Based</option><option>Conventional</option><option>Bodybuilding</option></select>
            </Field>
            <Field label="Motivational Tone">
              <select className="input"><option>Calm</option><option>High Energy</option><option>Hardcore</option></select>
            </Field>
            <Field label="Response Tone">
              <select className="input"><option>Concise</option><option>Detailed</option><option>Conversational</option></select>
            </Field>
            <Field label="Expertise">
              <input className="input" defaultValue="Hypertrophy, Strength, Nutrition" />
            </Field>
          </div>
        </Card>
      </div>

      <Card title="Preview Chat">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-lime/15 text-lime">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="rounded-lg bg-elevated/60 px-3 py-2 text-sm">
              Hey! I'm your AI coach trained by {CURRENT_CREATOR.name}. Ask me anything about programming, form, or nutrition.
            </div>
          </div>
          <div className="flex gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="input flex-1"
              placeholder="Ask your coach..."
            />
            <button className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Send</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────────── Community ───────────────────────── */

export function CommunitySection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Community"
        description="Manage announcements, posts, comments, and featured members."
        action={
          <button className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground sm:self-end">
            <Plus className="h-3.5 w-3.5" /> New Announcement
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Members" value="12,640" sub="+340 this week" />
        <StatCard label="Active" value="6,210" sub="Last 7 days" />
        <StatCard label="Posts" value="284" sub="This month" />
        <StatCard label="Engagement" value="68%" sub="Above avg" />
      </div>

      <Card title="Recent Posts">
        <ul className="divide-y divide-border">
          {COMMUNITY_POSTS.map((p) => (
            <li key={p.id} className="flex items-start gap-3 py-3">
              <img src={CURRENT_CREATOR.photo} className="h-8 w-8 flex-shrink-0 rounded-full object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{p.author}</span>
                  {p.pinned && <Pin className="h-3 w-3 text-lime" />}
                  <span className="text-xs text-muted-foreground">• {p.time}</span>
                </div>
                <div className="mt-0.5 text-sm">{p.title}</div>
                <div className="mt-1 flex gap-3 text-[11px] text-muted-foreground">
                  <span>❤ {p.likes}</span>
                  <span><MessageSquare className="mr-1 inline h-3 w-3" />{p.comments}</span>
                </div>
              </div>
              <button className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold hover:bg-elevated">
                Manage
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ───────────────────────── Challenges ───────────────────────── */

export function ChallengesSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Challenges"
        description="Build 30-day, transformation, step, strength, and custom challenges."
        action={
          <button className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground sm:self-end">
            <Plus className="h-3.5 w-3.5" /> New Challenge
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {CHALLENGES.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">{c.name}</h3>
              <Pill tone={c.status === "Active" ? "lime" : "warn"}>{c.status}</Pill>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.participants.toLocaleString()} joined</span>
              <span className="inline-flex items-center gap-1"><Trophy className="h-3 w-3 text-lime" /> {c.reward}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-elevated">Leaderboard</button>
              <button className="flex-1 rounded-md bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-elevated/70">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Payments ───────────────────────── */

const PIE_COLORS = ["var(--lime)", "hsl(var(--primary))", "#a78bfa", "#f59e0b", "#ef4444"];

export function PaymentsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Payments & Revenue"
        description="Earnings, payouts, and tax documents."
        action={
          <button className="inline-flex items-center gap-2 self-start rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-elevated sm:self-end">
            <Download className="h-3.5 w-3.5" /> Export Report
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="This Month" value={usd(64988)} sub="70% creator share" />
        <StatCard label="Pending Payout" value={usd(64988)} sub="Dec 1, 2026" />
        <StatCard label="Lifetime" value={usd(682400)} sub="Since Jan 2025" />
        <StatCard label="Next Tax Doc" value="1099-K" sub="Jan 31, 2027" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Revenue Breakdown" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REVENUE_BREAKDOWN} dataKey="amount" nameKey="source" innerRadius={50} outerRadius={88} paddingAngle={2}>
                  {REVENUE_BREAKDOWN.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => usd(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            {REVENUE_BREAKDOWN.map((r, i) => (
              <li key={r.source} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-muted-foreground">{r.source}</span>
                <span className="ml-auto font-semibold">{usd(r.amount)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Stripe Connection">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 rounded-md border border-border bg-elevated/40 p-3">
              <CheckCircle2 className="h-4 w-4 text-lime" />
              <span>Connected as <span className="font-semibold">{CURRENT_CREATOR.name}</span></span>
            </div>
            <div className="text-xs text-muted-foreground">Payouts arrive monthly on the 1st via direct deposit.</div>
            <button className="w-full rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-elevated">
              Update Banking Info
            </button>
          </div>
        </Card>
      </div>

      <Card title="Payouts">
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr><th className="py-2">Date</th><th>Amount</th><th>Status</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PAYOUTS.map((p) => (
              <tr key={p.id}>
                <td className="py-2.5">{p.date}</td>
                <td className="font-semibold">{usd(p.amount)}</td>
                <td>
                  <Pill tone={p.status === "Completed" ? "lime" : "warn"}>
                    {p.status === "Completed" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                    {p.status}
                  </Pill>
                </td>
                <td className="text-right text-xs text-muted-foreground"><a href="#" className="hover:text-foreground">Receipt</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ───────────────────────── Partnerships ───────────────────────── */

export function PartnershipsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Partnerships"
        description="Sponsorships, campaigns, affiliate revenue, and discount codes."
        action={
          <button className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground sm:self-end">
            <Plus className="h-3.5 w-3.5" /> Generate Referral Link
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Active Partners" value="3" />
        <StatCard label="Affiliate Revenue" value={usd(1508)} sub="This month" />
        <StatCard label="Active Codes" value="2" />
        <StatCard label="Pending Invites" value="1" />
      </div>

      <Card title="Brand Partners">
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr><th className="py-2">Brand</th><th>Type</th><th>Value</th><th>Status</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PARTNERSHIPS.map((p) => (
              <tr key={p.id}>
                <td className="py-3 font-semibold">{p.brand}</td>
                <td className="text-muted-foreground">{p.type}</td>
                <td>{p.value}</td>
                <td><Pill tone={p.status === "Active" ? "lime" : "warn"}>{p.status}</Pill></td>
                <td className="text-right text-xs"><a href="#" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">Manage <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ───────────────────────── Settings ───────────────────────── */

export function SettingsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" description="Profile, subscriptions, payouts, and notifications." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Profile" className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <img src={CURRENT_CREATOR.photo} alt="" className="h-20 w-20 rounded-lg object-cover object-top" />
            <div className="flex-1 space-y-3">
              <Field label="Display Name"><input className="input" defaultValue={CURRENT_CREATOR.name} /></Field>
              <Field label="Bio"><textarea rows={3} className="input" defaultValue={CURRENT_CREATOR.bio} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Instagram"><input className="input" defaultValue={CURRENT_CREATOR.social.instagram} /></Field>
                <Field label="YouTube"><input className="input" defaultValue={CURRENT_CREATOR.social.youtube} /></Field>
                <Field label="TikTok"><input className="input" placeholder="@handle" /></Field>
                <Field label="Website"><input className="input" placeholder="https://" /></Field>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Verification">
            <div className="flex items-center gap-2 rounded-md border border-border bg-elevated/40 p-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-lime" /> Verified Creator
            </div>
          </Card>
          <Card title="Subscription Pricing">
            <Field label="Monthly Membership"><input className="input" defaultValue="$9.99" /></Field>
            <Field label="AI Coach Add-on"><input className="input" defaultValue="$4.99" /></Field>
          </Card>
          <Card title="Notifications">
            <ul className="space-y-2 text-sm">
              {["New subscriber", "Payout completed", "Community comment", "Challenge milestone"].map((n) => (
                <li key={n} className="flex items-center justify-between">
                  <span>{n}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-lime" />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button className="rounded-md border border-border px-4 py-2 text-xs font-semibold hover:bg-elevated">Cancel</button>
        <button className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Save Changes</button>
      </div>
    </div>
  );
}

/* ───────────────────────── Nav config ───────────────────────── */

export const SECTIONS = [
  { id: "overview", label: "Dashboard", icon: TrendingUp, Component: OverviewSection },
  { id: "analytics", label: "Analytics", icon: TrendingUp, Component: AnalyticsSection },
  { id: "programs", label: "Programs", icon: BookOpen, Component: ProgramsSection },
  { id: "content", label: "Content", icon: Video, Component: ContentSection },
  { id: "ai-coach", label: "AI Coach", icon: Sparkles, Component: AICoachSection },
  { id: "community", label: "Community", icon: MessageSquare, Component: CommunitySection },
  { id: "challenges", label: "Challenges", icon: Trophy, Component: ChallengesSection },
  { id: "payments", label: "Payments", icon: Wallet, Component: PaymentsSection },
  { id: "partnerships", label: "Partners", icon: Handshake, Component: PartnershipsSection },
  { id: "settings", label: "Settings", icon: SettingsIcon, Component: SettingsSection },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

// Unused-import shims for tree-shaking awareness
void DollarSign;
