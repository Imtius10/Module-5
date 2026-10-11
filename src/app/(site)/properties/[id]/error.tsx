"use client";

import Link from "next/link";
import { ArrowLeft, ImageOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <ImageOff className="size-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        This property couldn&apos;t be loaded
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {error.message || "The listing may have been removed by its owner."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RefreshCw className="size-4" /> Retry
        </Button>
        <Button asChild variant="outline">
          <Link href="/properties">
            <ArrowLeft className="size-4" /> Back to listings
          </Link>
        </Button>
      </div>
    </div>
  );
}
