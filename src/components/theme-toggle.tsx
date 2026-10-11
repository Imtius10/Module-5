"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // Hydration-safe: server snapshot false, client snapshot true.
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && isDark ? (
        <Moon className="size-4.5 transition-transform duration-300" />
      ) : (
        <Sun className="size-4.5 transition-transform duration-300" />
      )}
    </Button>
  );
}

function subscribeNever() {
  return () => {};
}
