"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pager } from "@/components/ui/pager";
import { PageHeader } from "@/components/dashboard/page-header";
import { errorMessage } from "@/lib/api";
import { fetchAdminRentals, queryKeys } from "@/lib/queries";
import { formatDate, formatPrice, truncate } from "@/lib/format";
import { toUiStatus } from "@/lib/status";

export default function AdminRentalsPage() {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: queryKeys.adminRentals(page),
    queryFn: () => fetchAdminRentals(page),
  });

  const items = query.data?.items ?? [];
  const paidCount = items.filter(
    (request) => request.payment?.status === "PAID"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="All rental requests"
        description="Platform-wide bookings, their tenants and payment state."
        action={
          paidCount > 0 ? (
            <Badge className="border-0 bg-brand-gradient text-white">
              {paidCount} paid on this page
            </Badge>
          ) : undefined
        }
      />

      <Card>
        <CardContent className="p-0">
          {query.isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="p-5">
              <EmptyState
                title="Rentals couldn't be loaded"
                description={errorMessage(query.error)}
                action={<Button onClick={() => query.refetch()}>Retry</Button>}
              />
            </div>
          ) : items.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={FileText} title="No rental requests yet" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((request) => {
                    const uiStatus = toUiStatus(
                      request.status,
                      request.payment
                    );
                    const payment = request.payment;
                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Link
                            href={`/properties/${request.propertyId}`}
                            className="font-medium hover:text-primary"
                          >
                            {request.property?.title ?? "Property"}
                          </Link>
                          <p className="max-w-52 truncate text-xs text-muted-foreground">
                            {request.message
                              ? truncate(request.message, 60)
                              : "No message"}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm">
                          <p>{request.tenant?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {request.tenant?.email}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(request.createdAt)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={uiStatus} />
                        </TableCell>
                        <TableCell>
                          {payment ? (
                            <Badge
                              variant={
                                payment.status === "PAID"
                                  ? "outline"
                                  : "secondary"
                              }
                              className={
                                payment.status === "PAID"
                                  ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                                  : undefined
                              }
                            >
                              {payment.status}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {payment
                            ? formatPrice(payment.amount)
                            : request.property
                              ? formatPrice(request.property.price)
                              : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pager meta={query.data?.meta} onPageChange={setPage} />
    </div>
  );
}
