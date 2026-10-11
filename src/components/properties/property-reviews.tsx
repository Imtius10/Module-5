"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pager } from "@/components/ui/pager";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { errorMessage } from "@/lib/api";
import { fetchPropertyReviews, queryKeys } from "@/lib/queries";
import { formatDate, initials, timeAgo, truncate } from "@/lib/format";

export function PropertyReviews({ propertyId }: { propertyId: string }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...queryKeys.reviews(propertyId), page],
    queryFn: () => fetchPropertyReviews(propertyId, page),
  });

  const average =
    data && data.items.length > 0
      ? data.items.reduce((sum, review) => sum + review.rating, 0) / data.items.length
      : null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1].map((index) => (
          <div key={index} className="rounded-2xl border border-border/70 p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
        Reviews couldn&apos;t be loaded — {errorMessage(error)}{" "}
        <Button variant="link" className="px-0" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No reviews yet"
        description="Once a tenant completes a stay, their review shows up here."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
          <Star className="size-4 fill-current" />
          {average?.toFixed(1) ?? "—"}
        </div>
        <span className="text-sm text-muted-foreground">
          based on {data.meta?.total ?? data.items.length} review(s)
        </span>
      </div>

      <div className="space-y-4">
        {data.items.map((review) => (
          <article
            key={review.id}
            className="rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/30"
          >
            <header className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border">
                  <AvatarFallback className="bg-brand-gradient text-xs font-semibold text-white">
                    {initials(review.tenant?.name ?? "Tenant")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {review.tenant?.name ?? "Verified tenant"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)} · {timeAgo(review.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={
                      index < review.rating
                        ? "size-4 fill-amber-400 text-amber-400"
                        : "size-4 text-muted-foreground/40"
                    }
                  />
                ))}
              </div>
            </header>
            {review.comment && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {truncate(review.comment, 400)}
              </p>
            )}
          </article>
        ))}
      </div>

      <Pager meta={data.meta} onPageChange={setPage} />
    </div>
  );
}
