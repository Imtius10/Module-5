"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  Home,
  Inbox,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/stat-card";
import { fetchMyPayments, fetchMyRequests, queryKeys } from "@/lib/queries";
import { formatPrice, timeAgo } from "@/lib/format";
import { toUiStatus } from "@/lib/status";

export default function TenantOverviewPage() {
  const requestsQuery = useQuery({
    queryKey: queryKeys.myRequests(1),
    queryFn: () => fetchMyRequests(1),
  });
  const paymentsQuery = useQuery({
    queryKey: queryKeys.myPayments(1),
    queryFn: () => fetchMyPayments(1),
  });

  const requests = requestsQuery.data?.items ?? [];
  const payments = paymentsQuery.data?.items ?? [];
  const paidIds = new Set(
    payments.filter((payment) => payment.status === "PAID").map((p) => p.rentalRequestId)
  );

  const pending = requests.filter((request) => request.status === "PENDING").length;
  const approved = requests.filter((request) => request.status === "APPROVED").length;
  const active = requests.filter(
    (request) => request.status === "APPROVED" && paidIds.has(request.id)
  ).length;
  const spent = payments
    .filter((payment) => payment.status === "PAID")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const isLoading = requestsQuery.isLoading || paymentsQuery.isLoading;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tenant dashboard"
        description="Track your rental requests, payments and next steps in one place."
        action={
          <Button asChild>
            <Link href="/properties">
              <Home className="size-4" /> Find a home
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))
        ) : (
          <>
            <StatCard
              label="Total requests"
              value={requestsQuery.data?.meta?.total ?? requests.length}
              icon={Inbox}
              hint="Sent to landlords"
            />
            <StatCard
              label="Awaiting approval"
              value={pending}
              icon={Clock}
              tone="warning"
              hint="Landlords are reviewing"
            />
            <StatCard
              label="Approved requests"
              value={approved}
              icon={CheckCircle2}
              tone="success"
              hint={active > 0 ? `${active} paid & active` : "Ready for payment"}
            />
            <StatCard
              label="Paid so far"
              value={formatPrice(spent)}
              icon={Wallet}
              tone="info"
              hint={`${payments.filter((p) => p.status === "PAID").length} successful payment(s)`}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Recent requests</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/tenant/requests">
                  View all <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <EmptyState
                title="No requests yet"
                description="Browse listings and send your first rental request."
                action={
                  <Button asChild>
                    <Link href="/properties">Browse properties</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-border/60">
                {requests.slice(0, 5).map((request) => {
                  const uiStatus = toUiStatus(
                    request.status,
                    paidIds.has(request.id) ? { status: "PAID" } : null
                  );
                  const isPaid = paidIds.has(request.id);
                  return (
                    <li
                      key={request.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/properties/${request.propertyId}`}
                          className="block truncate text-sm font-medium hover:text-primary"
                        >
                          {request.property?.title ?? "Property"}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {request.property?.location} ·{" "}
                          {formatPrice(request.property?.price ?? 0)}/mo ·{" "}
                          {timeAgo(request.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={uiStatus} />
                        {request.status === "APPROVED" && !isPaid && (
                          <Button asChild size="sm">
                            <Link
                              href={`/dashboard/tenant/requests/${request.id}/pay`}
                            >
                              <Banknote className="size-4" /> Pay now
                            </Link>
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Latest payments</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/tenant/payments">
                  History <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {paymentsQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-14 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                <Badge variant="secondary" className="mb-3">
                  No payments
                </Badge>
                <p>Approved requests show a “Pay now” button here.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {payments.slice(0, 5).map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {payment.rentalRequest?.property?.title ?? "Rent payment"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(payment.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatPrice(payment.amount)}
                      </p>
                      <StatusBadge
                        status={
                          payment.status === "PAID"
                            ? "PAID"
                            : payment.status === "CANCELLED"
                              ? "CANCELLED"
                              : payment.status === "FAILED"
                                ? "FAILED"
                                : "PENDING_PAYMENT"
                        }
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
