import { type ReactNode } from "react";

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  accent = "lime",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: "lime" | "muted";
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={
          "mt-2 font-display text-2xl font-bold sm:text-3xl " +
          (accent === "lime" ? "text-foreground" : "text-foreground")
        }
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={"rounded-lg border border-border bg-surface p-4 " + className}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-display text-sm font-semibold uppercase tracking-wider">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Pill({
  tone = "muted",
  children,
}: {
  tone?: "lime" | "muted" | "warn" | "danger";
  children: ReactNode;
}) {
  const t =
    tone === "lime"
      ? "bg-lime/15 text-lime"
      : tone === "warn"
        ? "bg-yellow-500/15 text-yellow-500"
        : tone === "danger"
          ? "bg-red-500/15 text-red-500"
          : "bg-elevated text-muted-foreground";
  return (
    <span className={"inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider " + t}>
      {children}
    </span>
  );
}
