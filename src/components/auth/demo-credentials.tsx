"use client";

import { ShieldCheck, Home, KeyRound, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DemoAccount {
  email: string;
  password: string;
  role: "Tenant" | "Landlord" | "Admin";
  icon: typeof UserIcon;
  hint: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "tanvir@tenant.com",
    password: "123456",
    role: "Tenant",
    icon: UserIcon,
    hint: "Browse, request, pay & review",
  },
  {
    email: "imtius1@example.com",
    password: "12345678",
    role: "Landlord",
    icon: Home,
    hint: "10 seeded listings + approvals",
  },
  {
    email: "admin@rentnest.com",
    password: "admin123",
    role: "Admin",
    icon: ShieldCheck,
    hint: "Users, moderation & stats",
  },
];

export function DemoCredentials({
  onSelect,
  className,
}: {
  onSelect: (account: DemoAccount) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-primary/35 bg-primary/5 p-4",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <KeyRound className="size-3.5" /> Demo accounts (click to fill)
        </p>
        <Badge variant="outline" className="text-[10px]">
          seeded
        </Badge>
      </div>

      <div className="mt-3 grid gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => onSelect(account)}
            className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-2 text-left transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-brand-gradient group-hover:text-white">
              <account.icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium">
                {account.email}
              </span>
              <span className="block text-[11px] text-muted-foreground">
                {account.role} · {account.hint}
              </span>
            </span>
            <span className="text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Use
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
