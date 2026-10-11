"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Clock3,
  Eye,
  IndianRupee,
  Plus,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  fetchLandlordProperties,
  fetchLandlordRequests,
  queryKeys,
} from "@/lib/queries";
import { formatDate, formatPrice, truncate } from "@/lib/format";
import type { UiRentalStatus } from "@/lib/types";
import { toUiStatus } from "@/lib/status";

export default function LandlordOverviewPage() {
  const propertiesQuery = useQuery({
    queryKey: queryKeys.landlordProperties(1),
    queryFn: () => fetchLandlordProperties(1),
  });

  const requestsQuery = useQuery({
    queryKey: queryKeys.landlordRequests(1),
    queryFn: () => fetchLandlordRequests(1),
  });

  const properties = propertiesQuery.data?.items ?? [];
  const requests = requestsQuery.data?.items ?? [];

  const propertiesTotal = propertiesQuery.data?.meta?.total ?? 0;
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const listedMonthlyValue = properties
    .filter((p) => p.isAvailable !== false)
    .reduce((sum, p) => sum + p.price, 0);

  const loading = propertiesQuery.isLoading || requestsQuery.isLoading;

  const stats = [
    {
      label: "Total listings",
      value: propertiesTotal,
      icon: Building2,
      hint: `${properties.filter((p) => p.isAvailable !== false).length} accepting requests`,
    },
    {
      label: "Pending requests",
      value: pendingCount,
      icon: Clock3,
      hint: "Need a decision",
      tone: pendingCount > 0 ? "warn" : "default",
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: ThumbsUp,
      hint: "Waiting for payment",
      tone: "ok",
    },
    {
      label: "Listing value / month",
      value: formatPrice(listedMonthlyValue),
      icon: IndianRupee,
      hint: "Available listings combined",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Landlord dashboard"
        description="Manage listings, respond to tenants and track your rental business."
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/landlord/requests">
                Review requests
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/landlord/properties/new">
                <Plus className="size-4" /> New listing
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))
          : stats.map((stat) => (
              <Card key={stat.label} className="relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-semibold tabular-nums">
                        {stat.value}
                      </p>
                      <p
                        className={`text-xs ${
                          "tone" in stat && stat.tone === "warn"
                            ? "font-medium text-amber-600 dark:text-amber-400"
                            : "tone" in stat && stat.tone === "ok"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                        }`}
                      >
                        {stat.hint}
                      </p>
                    </div>
                    <span className="rounded-xl bg-brand-gradient/10 p-2.5 text-primary">
                      <stat.icon className="size-5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent requests</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/landlord/requests">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {requestsQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <EmptyState
                icon={Eye}
                title="No requests yet"
                description="Approve tenants from this list the moment they ask for a property."
              />
            ) : (
              <ul className="divide-y divide-border/70">
                {requests.slice(0, 5).map((request) => {
                  const ui = toUiStatus(request.status, request.payment);
                  return (
                    <li
                      key={request.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {request.tenant?.name ?? "Tenant"} →{" "}
                          {request.property?.title ?? "Property"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {request.message
                            ? truncate(request.message, 70)
                            : "No message"}{" "}
                          · {formatDate(request.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <StatusBadge status={ui as UiRentalStatus} />
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href="/dashboard/landlord/requests"
                            className="text-primary"
                          >
                            {request.status === "PENDING" ? "Decide" : "Open"}
                          </Link>
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Your listings</CardTitle>
          </CardHeader>
          <CardContent>
            {propertiesQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="No listings"
                description="Publish your first property to start earning."
                action={
                  <Button asChild size="sm">
                    <Link href="/dashboard/landlord/properties/new">
                      Create listing
                    </Link>
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-3">
                {properties.slice(0, 5).map((property) => (
                  <li
                    key={property.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/properties/${property.id}`}
                        className="block truncate text-sm font-medium hover:text-primary"
                      >
                        {property.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(property.price)}/month · {property.location}
                      </p>
                    </div>
                    <Badge
                      variant={
                        property.isAvailable !== false ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {property.isAvailable !== false ? "Open" : "Paused"}
                    </Badge>
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
