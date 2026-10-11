"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, ExternalLink, Wallet } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pager } from "@/components/ui/pager";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/stat-card";
import { fetchMyPayments, queryKeys } from "@/lib/queries";
import { formatDateTime, formatPrice, truncate } from "@/lib/format";

export default function TenantPaymentsPage() {
  const [page, setPage] = useState(1);

  const paymentsQuery = useQuery({
    queryKey: queryKeys.myPayments(page),
    queryFn: () => fetchMyPayments(page),
  });

  const items = paymentsQuery.data?.items ?? [];
  const totalPaid = items
    .filter((payment) => payment.status === "PAID")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const statusVariant = (status: string) =>
    status === "PAID"
      ? "PAID"
      : status === "CANCELLED"
        ? "CANCELLED"
        : status === "FAILED"
          ? "FAILED"
          : "PENDING_PAYMENT";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment history"
        description="Every Stripe transaction linked to your rental requests."
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/tenant/requests">
              <ExternalLink className="size-4" /> My requests
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Transactions"
          value={paymentsQuery.data?.meta?.total ?? items.length}
          icon={CreditCard}
        />
        <StatCard
          label="Successful"
          value={items.filter((payment) => payment.status === "PAID").length}
          icon={Wallet}
          tone="success"
        />
        <StatCard
          label="Total paid"
          value={formatPrice(totalPaid)}
          icon={Wallet}
          tone="info"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {paymentsQuery.isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={CreditCard}
                title="No payments yet"
                description="Approved rental requests show a “Pay now” button that opens Stripe Checkout."
                action={
                  <Button asChild>
                    <Link href="/dashboard/tenant/requests">Go to requests</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/properties/${payment.rentalRequest?.propertyId ?? ""}`}
                          className="hover:text-primary"
                        >
                          {payment.rentalRequest?.property?.title ??
                            "Rental payment"}
                        </Link>
                        <p className="text-xs font-normal text-muted-foreground">
                          {truncate(
                            payment.rentalRequest?.property?.location ?? "",
                            40
                          )}
                        </p>
                      </TableCell>
                      <TableCell>{formatPrice(payment.amount)}</TableCell>
                      <TableCell className="max-w-40 truncate font-mono text-xs">
                        {payment.transactionId ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(payment.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={statusVariant(payment.status)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pager meta={paymentsQuery.data?.meta} onPageChange={setPage} />
    </div>
  );
}
