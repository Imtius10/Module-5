"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  FileText,
  IndianRupee,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { errorMessage } from "@/lib/api";
import { fetchAdminRentals, fetchAdminStatistics, queryKeys } from "@/lib/queries";
import { formatDate, formatPrice, truncate } from "@/lib/format";
import { toUiStatus } from "@/lib/status";

export default function AdminOverviewPage() {
  const statsQuery = useQuery({
    queryKey: queryKeys.adminStatistics,
    queryFn: fetchAdminStatistics,
    refetchInterval: 30_000,
  });

  const rentalsQuery = useQuery({
    queryKey: queryKeys.adminRentals(1),
    queryFn: () => fetchAdminRentals(1),
  });

  const stats = statsQuery.data;
  const rentals = rentalsQuery.data?.items ?? [];

  const cards = [
    {
      label: "Total users",
      value: stats?.users.total,
      hint: `${stats?.users.tenants ?? 0} tenants · ${stats?.users.landlords ?? 0} landlords`,
      icon: Users,
      href: "/dashboard/admin/users",
    },
    {
      label: "Properties",
      value: stats?.properties.total,
      hint: "Live listings",
      icon: Building2,
      href: "/dashboard/admin/properties",
    },
    {
      label: "Pending requests",
      value: stats?.rentalRequests.pending,
      hint: `${stats?.rentalRequests.approved ?? 0} approved · ${stats?.rentalRequests.rejected ?? 0} rejected`,
      icon: FileText,
      href: "/dashboard/admin/rentals",
      tone: "warn",
    },
    {
      label: "Rentals requested",
      value: stats?.rentalRequests.total,
      hint: "All time",
      icon: IndianRupee,
      href: "/dashboard/admin/rentals",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin overview"
        description="Platform health at a glance: users, listings and rentals."
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/users">
              <ShieldCheck className="size-4" /> Manage users
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsQuery.isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))
          : statsQuery.isError
            ? (
                <Card className="sm:col-span-2 xl:col-span-4">
                  <CardContent className="p-5">
                    <EmptyState
                      title="Statistics unavailable"
                      description={errorMessage(statsQuery.error)}
                      action={
                        <Button onClick={() => statsQuery.refetch()}>
                          Retry
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              )
            : cards.map((card) => (
                <Link key={card.label} href={card.href}>
                  <Card className="h-full transition-colors hover:border-primary/40">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {card.label}
                          </p>
                          <p className="text-2xl font-semibold tabular-nums">
                            {card.value ?? 0}
                          </p>
                          <p
                            className={`text-xs ${
                              "tone" in card && card.tone === "warn"
                                ? "font-medium text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {card.hint}
                          </p>
                        </div>
                        <span className="rounded-xl bg-brand-gradient/10 p-2.5 text-primary">
                          <card.icon className="size-5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Latest rental requests</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/admin/rentals">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {rentalsQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : rentals.length === 0 ? (
              <EmptyState icon={FileText} title="No rentals yet" />
            ) : (
              <ul className="divide-y divide-border/70">
                {rentals.slice(0, 6).map((request) => (
                  <li
                    key={request.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {request.property?.title ?? "Property"} →{" "}
                        {request.tenant?.name ?? "Tenant"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {formatDate(request.createdAt)} ·{" "}
                        {request.message
                          ? truncate(request.message, 60)
                          : "No message"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden text-sm tabular-nums text-muted-foreground sm:block">
                        {request.property
                          ? formatPrice(request.property.price)
                          : "—"}
                      </span>
                      <StatusBadge
                        status={toUiStatus(request.status, request.payment)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Moderation shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/admin/users">
                <Users className="size-4" /> Review user accounts
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/admin/properties">
                <Building2 className="size-4" /> Inspect listings
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/admin/rentals">
                <UserCheck className="size-4" /> Track bookings
              </Link>
            </Button>
            <div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-xs text-muted-foreground">
              Statistics refresh every 30 seconds while this page stays open.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
