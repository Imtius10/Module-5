import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="relative mb-6 flex size-20 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-xl shadow-emerald-600/20">
        <Search className="size-9" />
        <span className="absolute -right-2 -top-2 rounded-full bg-background px-2 py-1 text-xs font-semibold text-primary ring-1 ring-border">
          404
        </span>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The listing may have been removed, or the link is outdated. Let&apos;s
        get you back to somewhere useful.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="size-4" /> Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/properties">
            <Compass className="size-4" /> Browse properties
          </Link>
        </Button>
      </div>
    </div>
  );
}
