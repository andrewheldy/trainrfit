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
  Legend,
} from "recharts";
import {
  ShieldCheck,
  Users,
  DollarSign,
  Sparkles,
  MessageSquare,
  Trophy,
  TrendingUp,
  Activity,
  CreditCard,
  LifeBuoy,
  AlertTriangle,
  BadgeCheck,
  Check,
  X,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Ban,
  Flag,
  Server,
  Wallet,
} from "lucide-react";
import { SectionHeader, StatCard, Card, Pill } from "@/components/creator/section-shell";
import {
  PLATFORM_KPIS,
  REVENUE_TREND,
  USER_GROWTH,
  COHORT_RETENTION,
  CREATOR_APPLICATIONS,
  TOP_CREATORS,
  REVENUE_SPLITS,
  AI_COACHES_REVIEW,
  MODERATION_QUEUE,
  CHALLENGES,
  TOP_PROGRAMS,
  TOP_COMMUNITIES,
  SYSTEM_HEALTH,
  STRIPE_SNAPSHOT,
  TICKETS,
  FRAUD_ALERTS,
  VERIFICATION_QUEUE,
} from "@/lib/admin/mock-data";

const lime = "hsl(var(--lime))";
const muted = "hsl(var(--muted-foreground))";
const surface = "hsl(var(--border))";

const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K` : `$${n.toFixed(0)}`;
const fmtNum = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : `${n}`;

function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={"inline-flex items-center gap-0.5 text-xs font-semibold " + (positive ? "text-lime" : "text-red-500")}>
      <Icon className="h-3 w-3" />
      {Math.abs(value)}
      {suffix}
    </span>
  );
}

/* ───────────────────── Overview ───────────────────── */
function OverviewSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Platform Overview"
        description="Real-time view of Gym Lift's growth, revenue, and creator economy."
        action={<Pill tone="lime">Live</Pill>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="MRR" value={fmtMoney(PLATFORM_KPIS.mrr)} sub={<Delta value={PLATFORM_KPIS.mrrGrowthPct} />} />
        <StatCard label="ARR" value={fmtMoney(PLATFORM_KPIS.arr)} sub={<Delta value={PLATFORM_KPIS.arrGrowthPct} />} />
        <StatCard label="Active Users" value={fmtNum(PLATFORM_KPIS.activeUsers)} sub={<Delta value={PLATFORM_KPIS.activeUsersGrowthPct} />} />
        <StatCard label="Premium" value={fmtNum(PLATFORM_KPIS.premiumUsers)} sub={<Delta value={PLATFORM_KPIS.premiumGrowthPct} />} />
        <StatCard label="Churn" value={`${PLATFORM_KPIS.churnPct}%`} sub={<Delta value={PLATFORM_KPIS.churnDeltaPct} />} />
        <StatCard label="LTV" value={`$${PLATFORM_KPIS.ltv}`} sub={`${PLATFORM_KPIS.ltvCacRatio}x CAC`} />
        <StatCard label="CAC" value={`$${PLATFORM_KPIS.cac}`} sub="blended" />
        <StatCard label="Gross Margin" value={`${PLATFORM_KPIS.grossMargin}%`} sub="trailing 30d" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Revenue & Creator Payouts">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND}>
                <defs>
                  <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={lime} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={lime} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={surface} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke={muted} fontSize={11} />
                <YAxis stroke={muted} fontSize={11} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: `1px solid ${surface}`, borderRadius: 8, fontSize: 12 }} formatter={(v: number) => fmtMoney(v)} />
                <Area type="monotone" dataKey="mrr" stroke={lime} fill="url(#mrr)" strokeWidth={2} />
                <Line type="monotone" dataKey="creatorPayout" stroke={muted} strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="User Growth">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={USER_GROWTH}>
                <CartesianGrid stroke={surface} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke={muted} fontSize={11} />
                <YAxis stroke={muted} fontSize={11} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: `1px solid ${surface}`, borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="free" stackId="a" fill={muted} radius={[0, 0, 0, 0]} />
                <Bar dataKey="premium" stackId="a" fill={lime} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Creator Revenue YTD" className="lg:col-span-1">
          <div className="font-display text-3xl font-bold">{fmtMoney(PLATFORM_KPIS.creatorRevenue)}</div>
          <div className="mt-1 text-xs text-muted-foreground">{fmtMoney(PLATFORM_KPIS.creatorPayoutPending)} pending payout</div>
          <div className="mt-4 space-y-2">
            {REVENUE_SPLITS.map((s) => (
              <div key={s.tier} className="flex items-center justify-between text-xs">
                <span className="font-medium">{s.tier}</span>
                <span className="text-muted-foreground">
                  {s.creatorPct}% / {s.platformPct}% · {s.creators} creators
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Cohort Retention" className="lg:col-span-2">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={COHORT_RETENTION}>
                <CartesianGrid stroke={surface} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="cohort" stroke={muted} fontSize={11} />
                <YAxis stroke={muted} fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: `1px solid ${surface}`, borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="d30" stroke={lime} strokeWidth={2} />
                <Line type="monotone" dataKey="d60" stroke="#a3e635" strokeWidth={2} />
                <Line type="monotone" dataKey="d90" stroke={muted} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ───────────────────── Creators ───────────────────── */
function CreatorsSection() {
  const [tab, setTab] = useState<"applications" | "rankings" | "splits">("applications");

  return (
    <div className="space-y-6">
      <SectionHeader title="Creators" description="Approve applications, review rankings, and manage revenue splits." />

      <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
        {(["applications", "rankings", "splits"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "flex-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors " +
              (tab === t ? "bg-lime/15 text-lime" : "text-muted-foreground hover:text-foreground")
            }
          >
            {t === "applications" ? `Applications (${CREATOR_APPLICATIONS.length})` : t === "rankings" ? "Rankings" : "Revenue Splits"}
          </button>
        ))}
      </div>

      {tab === "applications" && (
        <div className="space-y-3">
          {CREATOR_APPLICATIONS.map((a) => (
            <div key={a.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start gap-3">
                <img src={a.photo} alt={a.name} className="h-12 w-12 rounded-lg object-cover object-top" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-display text-sm font-semibold">{a.name}</div>
                    <span className="text-xs text-muted-foreground">{a.handle}</span>
                    <Pill tone={a.status === "pending" ? "warn" : a.status === "in_review" ? "muted" : "danger"}>
                      {a.status.replace("_", " ")}
                    </Pill>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {a.specialty} · {fmtNum(a.followers)} followers · submitted {a.submittedAt}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                    <Pill tone={a.socialVerified ? "lime" : "muted"}>{a.socialVerified ? "Social ✓" : "Social ✗"}</Pill>
                    <Pill tone={a.idVerified ? "lime" : "muted"}>{a.idVerified ? "ID ✓" : "ID ✗"}</Pill>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button className="inline-flex items-center gap-1 rounded-md bg-lime px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "rankings" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-3">Creator</th>
                  <th className="py-2 pr-3">Subs</th>
                  <th className="py-2 pr-3">MRR</th>
                  <th className="py-2 pr-3">Programs</th>
                  <th className="py-2 pr-3">Rating</th>
                  <th className="py-2 pr-3">Growth</th>
                </tr>
              </thead>
              <tbody>
                {TOP_CREATORS.map((c) => (
                  <tr key={c.slug} className="border-b border-border/40">
                    <td className="py-2.5 pr-3 font-display font-bold text-lime">#{c.rank}</td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <img src={c.photo} alt={c.name} style={c.photoPosition ? { objectPosition: c.photoPosition } : undefined} className="h-7 w-7 rounded object-cover object-top" />
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3">{fmtNum(c.subscribers)}</td>
                    <td className="py-2.5 pr-3 font-semibold">{fmtMoney(c.mrr)}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{c.programs}</td>
                    <td className="py-2.5 pr-3">⭐ {c.rating}</td>
                    <td className="py-2.5 pr-3"><Delta value={c.growthPct} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "splits" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {REVENUE_SPLITS.map((s) => (
            <Card key={s.tier} title={`${s.tier} Tier`}>
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-display text-3xl font-bold text-lime">{s.creatorPct}%</div>
                  <div className="text-xs text-muted-foreground">creator share</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-muted-foreground">platform {s.platformPct}%</div>
                  <div className="mt-1 font-semibold">{s.creators} creators</div>
                </div>
              </div>
              <button className="mt-3 w-full rounded-md border border-border py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
                Edit split
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Verification ───────────────────── */
function VerificationSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Verification" description="Review verification badge requests from creators." />
      <div className="space-y-3">
        {VERIFICATION_QUEUE.map((v) => (
          <div key={v.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-start gap-3">
              <img src={v.photo} alt={v.name} className="h-12 w-12 rounded-lg object-cover object-top" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-display font-semibold">{v.name}</div>
                  <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{v.handle} · {fmtNum(v.followers)} followers</div>
                <div className="mt-1 text-xs">{v.documents} documents submitted · {v.submittedAt}</div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-md bg-lime px-3 py-1.5 text-xs font-semibold text-background">Verify</button>
                <button className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">Deny</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── AI Coaches ───────────────────── */
function AICoachesSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="AI Coaches" description="Review training data, safety, and quality of every AI coach." />
      <div className="grid gap-3 sm:grid-cols-2">
        {AI_COACHES_REVIEW.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start gap-3">
              <img src={a.photo} alt={a.creator} className="h-10 w-10 rounded-lg object-cover object-top" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-display text-sm font-semibold">{a.name}</div>
                    <div className="text-xs text-muted-foreground">by {a.creator}</div>
                  </div>
                  <Pill tone={a.status === "approved" ? "lime" : a.status === "flagged" ? "danger" : "warn"}>{a.status}</Pill>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-display text-lg font-bold">{a.trainingDocs}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">docs</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold">{fmtNum(a.conversations)}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">chats</div>
                  </div>
                  <div>
                    <div className={"font-display text-lg font-bold " + (a.satisfactionPct >= 90 ? "text-lime" : a.satisfactionPct >= 75 ? "" : "text-red-500")}>
                      {a.satisfactionPct}%
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">CSAT</div>
                  </div>
                </div>
                {a.flaggedResponses > 0 && (
                  <div className="mt-3 flex items-center gap-2 rounded-md bg-red-500/10 px-2 py-1.5 text-xs text-red-500">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {a.flaggedResponses} flagged responses
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-md border border-border py-1.5 text-xs font-semibold hover:text-foreground">Audit</button>
                  <button className="flex-1 rounded-md bg-lime py-1.5 text-xs font-semibold text-background">Approve</button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Moderation ───────────────────── */
function ModerationSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Community Moderation" description="Reported posts, comments, and DMs across all communities." action={<Pill tone="danger">{MODERATION_QUEUE.filter(m => m.severity === "high").length} high</Pill>} />
      <div className="space-y-3">
        {MODERATION_QUEUE.map((m) => (
          <div key={m.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={m.severity === "high" ? "danger" : m.severity === "med" ? "warn" : "muted"}>{m.severity}</Pill>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.type}</span>
              <span className="text-xs text-muted-foreground">· {m.community}</span>
              <span className="ml-auto text-xs text-muted-foreground">{m.reportedAt}</span>
            </div>
            <div className="mt-2 text-sm italic text-foreground">"{m.excerpt}"</div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">{m.reportedUser}</span> · {m.reason} · {m.reports} reports
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"><Check className="h-3 w-3" /> Approve</button>
                <button className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"><Flag className="h-3 w-3" /> Warn</button>
                <button className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-500"><Ban className="h-3 w-3" /> Ban</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Challenges ───────────────────── */
function ChallengesSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Challenges" description="Live, upcoming, and completed platform challenges." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CHALLENGES.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">by {c.creator}</div>
              </div>
              <Pill tone={c.status === "live" ? "lime" : c.status === "upcoming" ? "warn" : "muted"}>{c.status}</Pill>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="font-display text-xl font-bold">{fmtNum(c.participants)}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">participants</div>
              </div>
              <div>
                <div className="font-display text-xl font-bold text-lime">{fmtMoney(c.prizePool)}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">prize pool</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-semibold">{c.completionPct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
                <div className="h-full bg-lime" style={{ width: `${c.completionPct}%` }} />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{c.endsIn}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Analytics ───────────────────── */
function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Platform Analytics" description="Top programs, communities, and content drivers." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Most Popular Programs">
          <div className="space-y-3">
            {TOP_PROGRAMS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="font-display text-lg font-bold text-lime">#{i + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.creator} · ⭐ {p.rating}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{fmtMoney(p.revenue)}</div>
                  <div className="text-xs text-muted-foreground">{fmtNum(p.purchases)} sales</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Communities">
          <div className="space-y-3">
            {TOP_COMMUNITIES.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="font-display text-lg font-bold text-lime">#{i + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.creator}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-semibold">{fmtNum(c.members)} members</div>
                  <div className="text-muted-foreground">{fmtNum(c.dau)} DAU · {fmtNum(c.posts7d)} posts/7d</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top AI Coaches">
          <div className="space-y-3">
            {AI_COACHES_REVIEW.filter(a => a.status === "approved").sort((a, b) => b.conversations - a.conversations).map((a, i) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="font-display text-lg font-bold text-lime">#{i + 1}</div>
                <img src={a.photo} alt="" className="h-8 w-8 rounded object-cover object-top" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.creator}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-semibold">{fmtNum(a.conversations)} chats</div>
                  <div className="text-lime">{a.satisfactionPct}% CSAT</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Most Completed Challenges">
          <div className="space-y-3">
            {[...CHALLENGES].sort((a, b) => b.completionPct - a.completionPct).slice(0, 5).map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="font-display text-lg font-bold text-lime">#{i + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.creator} · {fmtNum(c.participants)} joined</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-lime">{c.completionPct}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ───────────────────── Stripe ───────────────────── */
function StripeSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Stripe Dashboard" description="Live payments, payouts, and disputes." action={<Pill tone="lime">Connected</Pill>} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Today Volume" value={fmtMoney(STRIPE_SNAPSHOT.todayVolume)} sub={`${fmtNum(STRIPE_SNAPSHOT.todayTransactions)} txns`} />
        <StatCard label="Success Rate" value={`${STRIPE_SNAPSHOT.succeededPct}%`} sub="last 24h" />
        <StatCard label="Next Payout" value={fmtMoney(STRIPE_SNAPSHOT.payoutNext)} sub={STRIPE_SNAPSHOT.payoutDate} />
        <StatCard label="Disputes (30d)" value={`${STRIPE_SNAPSHOT.disputes30d}`} sub={`${fmtMoney(STRIPE_SNAPSHOT.refunds7d)} refunds 7d`} />
      </div>

      <Card title="Recent Charges">
        <div className="space-y-2">
          {STRIPE_SNAPSHOT.recentCharges.map((c) => (
            <div key={c.id} className="flex items-center justify-between border-b border-border/40 py-2 text-sm last:border-0">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-mono text-xs">{c.id}</div>
                  <div className="text-xs text-muted-foreground">{c.customer}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">${c.amount.toFixed(2)}</span>
                <Pill tone={c.status === "succeeded" ? "lime" : c.status === "failed" ? "danger" : "warn"}>{c.status}</Pill>
                <span className="text-xs text-muted-foreground">{c.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────── System ───────────────────── */
function SystemSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="System Health" description="Live infrastructure and service status." action={<Pill tone={SYSTEM_HEALTH.activeIncidents === 0 ? "lime" : "danger"}>{SYSTEM_HEALTH.activeIncidents === 0 ? "All systems normal" : `${SYSTEM_HEALTH.activeIncidents} incidents`}</Pill>} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Uptime (30d)" value={`${SYSTEM_HEALTH.uptime}%`} />
        <StatCard label="API p95" value={`${SYSTEM_HEALTH.apiP95Ms}ms`} sub={`p99 ${SYSTEM_HEALTH.apiP99Ms}ms`} />
        <StatCard label="Error Rate" value={`${SYSTEM_HEALTH.errorRatePct}%`} />
        <StatCard label="DB CPU" value={`${SYSTEM_HEALTH.dbCpuPct}%`} sub={`CDN hit ${SYSTEM_HEALTH.cdnHitPct}%`} />
      </div>

      <Card title="Services">
        <div className="space-y-2">
          {SYSTEM_HEALTH.services.map((s) => (
            <div key={s.name} className="flex items-center justify-between border-b border-border/40 py-2.5 last:border-0">
              <div className="flex items-center gap-3">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{s.latencyMs}ms</span>
                <Pill tone={s.status === "operational" ? "lime" : s.status === "degraded" ? "warn" : "danger"}>{s.status}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────── Support ───────────────────── */
function SupportSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Support Tickets" description={`${TICKETS.filter(t => t.status !== "resolved").length} open tickets`} />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Subject</th>
                <th className="py-2 pr-3">User</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Priority</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Age</th>
              </tr>
            </thead>
            <tbody>
              {TICKETS.map((t) => (
                <tr key={t.id} className="border-b border-border/40">
                  <td className="py-2.5 pr-3 font-mono text-xs">{t.id}</td>
                  <td className="py-2.5 pr-3 font-medium">{t.subject}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{t.user}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{t.category}</td>
                  <td className="py-2.5 pr-3"><Pill tone={t.priority === "urgent" ? "danger" : t.priority === "high" ? "warn" : "muted"}>{t.priority}</Pill></td>
                  <td className="py-2.5 pr-3"><Pill tone={t.status === "open" ? "warn" : t.status === "pending" ? "muted" : "lime"}>{t.status}</Pill></td>
                  <td className="py-2.5 pr-3 text-xs text-muted-foreground">{t.agedHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────── Fraud ───────────────────── */
function FraudSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Fraud Detection" description="ML-flagged accounts, payments, and behavior." action={<Pill tone="danger">{FRAUD_ALERTS.filter(f => f.status === "new").length} new</Pill>} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Risk Score Avg" value="42" sub="of 100" />
        <StatCard label="Blocked (7d)" value="284" sub="auto + manual" />
        <StatCard label="Saved (7d)" value={fmtMoney(48_200)} sub="vs predicted loss" />
        <StatCard label="False Positive" value="2.1%" sub="trailing 30d" />
      </div>

      <div className="space-y-3">
        {FRAUD_ALERTS.map((f) => (
          <div key={f.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <AlertTriangle className={"h-4 w-4 " + (f.risk >= 80 ? "text-red-500" : f.risk >= 60 ? "text-yellow-500" : "text-muted-foreground")} />
              <span className="font-display text-sm font-semibold">{f.type}</span>
              <Pill tone={f.status === "new" ? "danger" : f.status === "investigating" ? "warn" : f.status === "blocked" ? "muted" : "lime"}>{f.status}</Pill>
              <span className="ml-auto text-xs text-muted-foreground">{f.detectedAt}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-mono text-muted-foreground">{f.user}</span>
                {f.amount && <span className="ml-2 font-semibold">${f.amount.toFixed(2)}</span>}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs">
                  Risk <span className={"font-bold " + (f.risk >= 80 ? "text-red-500" : f.risk >= 60 ? "text-yellow-500" : "text-lime")}>{f.risk}</span>
                </div>
                <button className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold hover:text-foreground">Investigate</button>
                <button className="rounded-md bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-500">Block</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Export sections ───────────────────── */
export const ADMIN_SECTIONS = [
  { id: "overview", label: "Overview", icon: TrendingUp, Component: OverviewSection },
  { id: "creators", label: "Creators", icon: Users, Component: CreatorsSection },
  { id: "verification", label: "Verify", icon: BadgeCheck, Component: VerificationSection },
  { id: "ai-coaches", label: "AI Coaches", icon: Sparkles, Component: AICoachesSection },
  { id: "moderation", label: "Moderation", icon: MessageSquare, Component: ModerationSection },
  { id: "challenges", label: "Challenges", icon: Trophy, Component: ChallengesSection },
  { id: "analytics", label: "Analytics", icon: Activity, Component: AnalyticsSection },
  { id: "stripe", label: "Stripe", icon: DollarSign, Component: StripeSection },
  { id: "system", label: "System", icon: Server, Component: SystemSection },
  { id: "support", label: "Support", icon: LifeBuoy, Component: SupportSection },
  { id: "fraud", label: "Fraud", icon: ShieldCheck, Component: FraudSection },
] as const;

export type AdminSectionId = (typeof ADMIN_SECTIONS)[number]["id"];
