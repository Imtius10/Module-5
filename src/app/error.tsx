"use client";

import Link from "next/link";

import { useEffect } from "react";
import { AlertOctagon, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300">
        <AlertOctagon className="size-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong here
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {errorMessage(error) ||
          "An unexpected error occurred while loading this page."}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>
          <RefreshCw className="size-4" /> Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="size-4" /> Back home
          </Link>
        </Button>
      </div>
    </div>
  );
}
