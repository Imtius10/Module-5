import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/status";

type BadgeKey = keyof typeof STATUS_STYLES;

export function StatusBadge({
  status,
  className,
}: {
  status: BadgeKey;
  className?: string;
}) {
  const config = STATUS_STYLES[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground ring-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.className,
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
}
