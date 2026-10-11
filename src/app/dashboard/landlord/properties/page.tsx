"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Pager } from "@/components/ui/pager";
import { PageHeader } from "@/components/dashboard/page-header";
import { api, errorMessage } from "@/lib/api";
import { fetchLandlordProperties, queryKeys } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import type { Property } from "@/lib/types";

export default function LandlordPropertiesPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.landlordProperties(page),
    queryFn: () => fetchLandlordProperties(page),
  });

  const removeProperty = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/landlord/properties/${id}`);
      return id;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.landlordProperties(page),
      });
      toast.success("Listing deleted");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const items = query.data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My properties"
        description="Update availability, edit details or remove listings."
        action={
          <Button asChild>
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="size-4" /> New listing
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          {query.isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-3">
                  <Skeleton className="h-12 w-12 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <div className="flex gap-2 ml-4">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : query.isError ? (
            <div className="p-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <svg className="size-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <EmptyState
                title="Listings couldn't be loaded"
                description={errorMessage(query.error)}
                action={<Button onClick={() => query.refetch()}>Retry</Button>}
              />
            </div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="size-8 text-primary" />
              </div>
              <EmptyState
                title="You have no listings yet"
                description="Publish your first property and start receiving requests."
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
                    <TableHead>Property</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((property) => {
                    const available = property.isAvailable !== false;
                    return (
                      <TableRow
                        key={property.id}
                        className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                      >
                        <TableCell className="py-4">
                          <Link
                            href={`/properties/${property.id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {property.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">
                            {property.location}
                          </p>
                        </TableCell>
                        <TableCell className="py-4 font-medium text-foreground">
                          {formatPrice(property.price)}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className="capitalize bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors"
                          >
                            {property.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant={available ? "default" : "secondary"}
                            className={
                              available
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            }
                          >
                            {available ? "Available" : "Paused"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/properties/${property.id}`}>
                                <Eye className="size-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon">
                              <Link
                                href={`/dashboard/landlord/properties/${property.id}/edit`}
                              >
                                <Pencil className="size-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="size-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete “{property.title}”?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This permanently removes the listing and its
                                    rental requests. This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      removeProperty.mutate(property.id)
                                    }
                                    className="bg-red-600 text-white hover:bg-red-700"
                                  >
                                    {removeProperty.isPending
                                      ? "Deleting…"
                                      : "Delete listing"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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
