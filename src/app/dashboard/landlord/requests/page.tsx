"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, MessageSquareText, ThumbsDown, ThumbsUp, X } from "lucide-react";
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
import { api, errorMessage } from "@/lib/api";
import { fetchLandlordRequests, queryKeys } from "@/lib/queries";
import { formatDate, formatPrice, truncate } from "@/lib/format";
import type { RentalRequest, RentalStatus } from "@/lib/types";

export default function LandlordRequestsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const queryKey = queryKeys.landlordRequests(page);

  const query = useQuery({
    queryKey,
    queryFn: () => fetchLandlordRequests(page),
  });

  const decide = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Extract<RentalStatus, "APPROVED" | "REJECTED">;
    }) => {
      await api.patch(`/api/landlord/requests/${id}`, { status });
      return { id, status };
    },

    // Optimistic UI: flip the badge before the server responds.
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey });
      const snapshot = queryClient.getQueryData(queryKey);
      queryClient.setQueryData<{ items: RentalRequest[]; meta: typeof snapshot extends { meta: infer M } ? M : never }>(
        queryKey,
        (current) => {
          if (!current) return current;
          return {
            ...current,
            items: current.items.map((request) =>
              request.id === id ? { ...request, status } : request
            ),
          };
        }
      );
      return { snapshot };
    },

    onSuccess: (_data, variables) => {
      toast.success(
        variables.status === "APPROVED"
          ? "Request approved — tenant can now pay"
          : "Request rejected",
        {
          description:
            variables.status === "APPROVED"
              ? "The tenant will see a “Pay now” button."
              : undefined,
        }
      );
    },

    onError: (error, _variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }
      toast.error(errorMessage(error));
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminRentals(1) });
    },
  });

  const items = query.data?.items ?? [];
  const pendingCount = items.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incoming requests"
        description="Approve tenants you'd like to host — they get a payment button instantly."
        action={
          pendingCount > 0 ? (
            <Badge className="border-0 bg-brand-gradient text-white">
              {pendingCount} waiting
            </Badge>
          ) : undefined
        }
      />

      <Card>
        <CardContent className="p-0">
          {query.isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="p-5">
              <EmptyState
                title="Requests couldn't be loaded"
                description={errorMessage(query.error)}
                action={<Button onClick={() => query.refetch()}>Retry</Button>}
              />
            </div>
          ) : items.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={MessageSquareText}
                title="No requests yet"
                description="Publish listings so tenants can send you requests."
                action={
                  <Button asChild>
                    <Link href="/dashboard/landlord/properties/new">
                      Create listing
                    </Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Decision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((request) => (
                    <TableRow
                      key={request.id}
                      className={
                        request.status === "PENDING"
                          ? "bg-amber-50/40 dark:bg-amber-500/5"
                          : undefined
                      }
                    >
                      <TableCell>
                        <p className="font-medium">{request.tenant?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.tenant?.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/properties/${request.propertyId}`}
                          className="hover:text-primary"
                        >
                          {request.property?.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(request.property?.price ?? 0)}/month
                        </p>
                      </TableCell>
                      <TableCell className="max-w-56">
                        <p className="text-xs text-muted-foreground">
                          {request.message
                            ? truncate(request.message, 90)
                            : "No message attached"}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === "PENDING" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              disabled={decide.isPending}
                              onClick={() =>
                                decide.mutate({
                                  id: request.id,
                                  status: "APPROVED",
                                })
                              }
                            >
                              {decide.isPending ? (
                                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <ThumbsUp className="size-4" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={decide.isPending}
                              onClick={() =>
                                decide.mutate({
                                  id: request.id,
                                  status: "REJECTED",
                                })
                              }
                            >
                              <ThumbsDown className="size-4" /> Reject
                            </Button>
                          </div>
                        ) : request.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <Check className="size-3.5" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                            <X className="size-3.5" /> Rejected
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
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
