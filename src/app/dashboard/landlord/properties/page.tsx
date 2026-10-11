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

  const toggleAvailability = useMutation({
    mutationFn: async (property: Property) => {
      await api.put(`/api/landlord/properties/${property.id}`, {
        isAvailable: property.isAvailable === false,
      });
      return { id: property.id, next: property.isAvailable === false };
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.landlordProperties(page),
      });
      toast.success(
        result.next ? "Listing is now open for requests" : "Listing paused"
      );
    },
    onError: (error) => toast.error(errorMessage(error)),
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
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="p-5">
              <EmptyState
                title="Listings couldn't be loaded"
                description={errorMessage(query.error)}
                action={<Button onClick={() => query.refetch()}>Retry</Button>}
              />
            </div>
          ) : items.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Plus}
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
                    <TableHead>Availability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((property) => {
                    const available = property.isAvailable !== false;
                    return (
                      <TableRow key={property.id}>
                        <TableCell>
                          <Link
                            href={`/properties/${property.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {property.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {property.location}
                          </p>
                        </TableCell>
                        <TableCell>{formatPrice(property.price)}</TableCell>
                        <TableCell className="capitalize">
                          {property.category}
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            disabled={toggleAvailability.isPending}
                            onClick={() => toggleAvailability.mutate(property)}
                            className="inline-flex items-center gap-2 rounded-full text-sm"
                          >
                            <span
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                available
                                  ? "bg-primary"
                                  : "bg-muted-foreground/30"
                              }`}
                            >
                              <span
                                className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                                  available ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </span>
                            <Badge
                              variant={available ? "default" : "secondary"}
                              className="capitalize"
                            >
                              {available ? "Available" : "Paused"}
                            </Badge>
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
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
