import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  className?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

const TONES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-accent text-accent-foreground",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
  tone = "default",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            TONES[tone]
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <div className="absolute -right-6 -top-6 size-20 rounded-full bg-brand-gradient opacity-10 blur-2xl" />
    </div>
  );
}
