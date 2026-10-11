"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, MessageSquarePlus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StarRating } from "@/components/reviews/star-rating";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/lib/api";
import { fetchMyPayments, fetchMyRequests, queryKeys } from "@/lib/queries";
import { formatDate, formatPrice } from "@/lib/format";
import type { Review } from "@/lib/types";

function ReviewForm({
  requestId,
  propertyTitle,
  onDone,
}: {
  requestId: string;
  propertyTitle: string;
  onDone: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submit = useApiMutation<{ rating: number; comment: string }, { data: Review }>({
    mutationFn: (input) =>
      api.post<Review>("/api/reviews", {
        rentalRequestId: requestId,
        rating: input.rating,
        comment: input.comment || undefined,
      }),
    successMessage: "Thanks! Your review is live.",
    onSuccess: onDone,
  });

  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex items-center gap-2">
        <MessageSquarePlus className="size-4 text-primary" />
        <h3 className="font-semibold">Review “{propertyTitle}”</h3>
      </div>

      <div className="space-y-2">
        <Label>How was it?</Label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`comment-${requestId}`}>Your experience</Label>
        <Textarea
          id={`comment-${requestId}`}
          rows={3}
          maxLength={500}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="The place was exactly as described, landlord was responsive…"
        />
        <p className="text-xs text-muted-foreground">{comment.length}/500</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          disabled={submit.isPending || rating < 1}
          onClick={() => submit.mutate({ rating, comment })}
        >
          {submit.isPending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting…
            </>
          ) : (
            <>
              <Star className="size-4" /> Submit review
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
      {rating < 1 && (
        <p className="text-xs text-muted-foreground">
          Pick a star rating before submitting.
        </p>
      )}
    </div>
  );
}

export default function TenantReviewsPage() {
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  const requestsQuery = useQuery({
    queryKey: queryKeys.myRequests(1),
    queryFn: () => fetchMyRequests(1),
  });
  const paymentsQuery = useQuery({
    queryKey: queryKeys.myPayments(1),
    queryFn: () => fetchMyPayments(1),
  });

  const paidIds = useMemo(
    () =>
      new Set(
        (paymentsQuery.data?.items ?? [])
          .filter((payment) => payment.status === "PAID")
          .map((payment) => payment.rentalRequestId)
      ),
    [paymentsQuery.data]
  );

  const approved = (requestsQuery.data?.items ?? []).filter(
    (request) => request.status === "APPROVED"
  );

  const markDone = (id: string) => {
    setDone((current) => new Set(current).add(id));
    setReviewing(null);
    toast.success("Review added to your history");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My reviews"
        description="Share your experience for approved rentals — reviews appear on the property page."
        action={
          <Button asChild variant="outline">
            <Link href="/properties">
              <Star className="size-4" /> Explore more stays
            </Link>
          </Button>
        }
      />

      {requestsQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : approved.length === 0 ? (
        <EmptyState
          icon={MessageSquarePlus}
          title="Nothing to review yet"
          description="Once a landlord approves your request you can leave a review."
          action={
            <Button asChild>
              <Link href="/dashboard/tenant/requests">View my requests</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {approved.map((request) => {
            const isPaid = paidIds.has(request.id);
            const completed = done.has(request.id);
            const expanded = reviewing === request.id;

            return (
              <Card key={request.id}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {request.property?.title ?? "Property"}
                        </h3>
                        <StatusBadge
                          status={isPaid ? "ACTIVE" : "APPROVED"}
                        />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.property?.location} ·{" "}
                        {formatPrice(request.property?.price ?? 0)}/month ·
                        approved {formatDate(request.updatedAt)}
                      </p>
                    </div>

                    {completed ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                        <CheckCircle2 className="size-4" /> Reviewed
                      </span>
                    ) : expanded ? null : (
                      <Button
                        onClick={() => setReviewing(request.id)}
                        variant="outline"
                      >
                        <Star className="size-4" /> Leave a review
                      </Button>
                    )}
                  </div>

                  {expanded && (
                    <div className="mt-4">
                      <ReviewForm
                        requestId={request.id}
                        propertyTitle={request.property?.title ?? "this property"}
                        onDone={() => markDone(request.id)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
