"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  Eye,
  MapPin,
  MessageSquareText,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pager } from "@/components/ui/pager";
import { PageHeader } from "@/components/dashboard/page-header";
import { fetchMyPayments, fetchMyRequests, queryKeys } from "@/lib/queries";
import { formatDate, formatPrice, truncate } from "@/lib/format";
import { toUiStatus } from "@/lib/status";
import type { UiRentalStatus } from "@/lib/types";

type Filter = "ALL" | UiRentalStatus;

export default function TenantRequestsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("ALL");

  const requestsQuery = useQuery({
    queryKey: queryKeys.myRequests(page),
    queryFn: () => fetchMyRequests(page),
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

  const rows = (requestsQuery.data?.items ?? []).map((request) => ({
    request,
    status: toUiStatus(
      request.status,
      paidIds.has(request.id) ? { status: "PAID" } : null
    ),
    paid: paidIds.has(request.id),
  }));

  const filtered =
    filter === "ALL" ? rows : rows.filter((row) => row.status === filter);

  const counts = {
    ALL: rows.length,
    PENDING: rows.filter((row) => row.status === "PENDING").length,
    APPROVED: rows.filter((row) => row.status === "APPROVED").length,
    REJECTED: rows.filter((row) => row.status === "REJECTED").length,
    ACTIVE: rows.filter((row) => row.status === "ACTIVE").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My rental requests"
        description="Status updates appear as soon as a landlord responds. Approved requests can be paid immediately."
        action={
          <Button asChild variant="outline">
            <Link href="/properties">Browse more homes</Link>
          </Button>
        }
      />

      <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
        <TabsList className="h-auto flex-wrap bg-transparent p-0">
          {(
            [
              ["ALL", "All"],
              ["PENDING", "Pending"],
              ["APPROVED", "Approved"],
              ["ACTIVE", "Active"],
              ["REJECTED", "Rejected"],
            ] as const
          ).map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-full border border-border/70 px-4 py-1.5 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {label}
              <Badge
                variant="secondary"
                className="ml-2 h-5 min-w-5 rounded-full px-1.5 text-[11px]"
              >
                {counts[value]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {requestsQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : requestsQuery.isError ? (
        <EmptyState
          title="Requests couldn't be loaded"
          description="Please refresh the page or try again in a moment."
          action={<Button onClick={() => requestsQuery.refetch()}>Retry</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={filter === "ALL" ? "No requests yet" : `No ${filter.toLowerCase()} requests`}
          description={
            filter === "ALL"
              ? "Open any listing and press “Request to rent” to start."
              : "Try another filter or send a new request."
          }
          action={
            <Button asChild>
              <Link href="/properties">Browse properties</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(({ request, status, paid }) => (
            <article
              key={request.id}
              className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center"
            >
              <div className="relative flex h-16 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-gradient/15 ring-1 ring-inset ring-primary/15 sm:h-16 sm:w-16">
                <span className="text-lg font-semibold text-primary">
                  {(request.property?.title ?? "R").slice(0, 1).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/properties/${request.propertyId}`}
                    className="font-medium hover:text-primary"
                  >
                    {request.property?.title ?? "Property"}
                  </Link>
                  <StatusBadge status={status} />
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {request.property?.location}
                  </span>
                  <span>{formatPrice(request.property?.price ?? 0)}/month</span>
                  <span>Sent {formatDate(request.createdAt)}</span>
                </p>
                {request.message && (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MessageSquareText className="mt-0.5 size-3.5 shrink-0" />
                    <span>{truncate(request.message, 140)}</span>
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/properties/${request.propertyId}`}>
                    <Eye className="size-4" /> View
                  </Link>
                </Button>

                {request.status === "APPROVED" && !paid && (
                  <Button asChild size="sm">
                    <Link href={`/dashboard/tenant/requests/${request.id}/pay`}>
                      <Banknote className="size-4" /> Pay now
                    </Link>
                  </Button>
                )}

                {paid && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/dashboard/tenant/payments">
                      <Receipt className="size-4" /> Receipt
                    </Link>
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Pager meta={requestsQuery.data?.meta} onPageChange={setPage} />
    </div>
  );
}
