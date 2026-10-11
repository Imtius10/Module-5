"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/**
 * Persistent banner shown while the browser reports no connection.
 * Mutations fail fast with a clear toast meanwhile (see src/lib/api.ts).
 */
export function OfflineBanner() {
  // Assume "online" while rendering on the server to avoid hydration mismatch.
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );

  if (online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2.5 text-sm font-medium text-amber-950 shadow-lg"
    >
      <WifiOff className="size-4 shrink-0" />
      You&apos;re offline — changes will fail until the connection is back.
    </div>
  );
}
