"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import { dashboardPathForRole } from "@/lib/session";

export default function NoAccessPage() {
  const router = useRouter();
  const { user, status, signOut } = useAuth();

  useEffect(() => {
    if (status === "authed" && user) {
      router.replace(dashboardPathForRole(user.role));
    }
  }, [status, user, router]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
        <Lock className="size-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">No access here</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        This dashboard belongs to a different role. Taking you to your own
        workspace…
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" onClick={() => signOut()}>
          Sign in with another account
        </Button>
      </div>
    </div>
  );
}
