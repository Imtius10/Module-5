"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/store/auth";
import { dashboardPathForRole } from "@/lib/session";

export default function DashboardIndexPage() {
  const router = useRouter();
  const status = useAuth((state) => state.status);
  const user = useAuth((state) => state.user);

  useEffect(() => {
    if (status === "loading") return;
    router.replace(
      user ? dashboardPathForRole(user.role) : "/auth/login?next=/dashboard"
    );
  }, [status, user, router]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm">Opening your dashboard…</p>
      </div>
    </div>
  );
}
