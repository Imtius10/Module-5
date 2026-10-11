"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { clearSession } from "@/lib/session";
import { useAuth } from "@/store/auth";

function AuthBootstrap({ children }: { children: ReactNode }) {
  const bootstrap = useAuth((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return <>{children}</>;
}

/**
 * The API client fires `rn:session-expired` when a request gets a 401 and
 * the refresh token is missing/invalid. We clear the local session and send
 * the user back to login (keeping their destination) exactly once.
 */
function SessionWatcher({ children }: { children: ReactNode }) {
  const router = useRouter();
  const lastSeen = useRef(0);

  useEffect(() => {
    const handleExpired = () => {
      const now = Date.now();
      if (now - lastSeen.current < 3_000) return;
      lastSeen.current = now;

      clearSession();
      useAuth.setState({ user: null, status: "guest", notice: null });

      const here =
        typeof window === "undefined"
          ? "/dashboard"
          : window.location.pathname + window.location.search;
      const onLogin = here.startsWith("/auth");

      toast.error("Your session has expired. Please sign in again.");
      if (!onLogin) {
        router.replace(`/auth/login?next=${encodeURIComponent(here)}`);
      }
    };

    window.addEventListener("rn:session-expired", handleExpired);
    return () => window.removeEventListener("rn:session-expired", handleExpired);
  }, [router]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={200}>
          <SessionWatcher>
            <AuthBootstrap>{children}</AuthBootstrap>
          </SessionWatcher>
        </TooltipProvider>
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
