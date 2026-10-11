"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { PropertyForm } from "@/components/landlord/property-form";
import { api, errorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/queries";
import type { Property } from "@/lib/types";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();

  const query = useQuery({
    queryKey: queryKeys.property(params.id),
    queryFn: async () => {
      const res = await api.get<Property>(`/api/properties/${params.id}`, {
        auth: false,
      });
      return res.data;
    },
    enabled: Boolean(params.id),
  });

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <h1 className="font-semibold">Listing couldn&apos;t be loaded</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {errorMessage(query.error)}
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/landlord/properties">Back to my listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit listing"
        description={query.data.title}
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/landlord/properties">
              <ArrowLeft className="size-4" /> All listings
            </Link>
          </Button>
        }
      />
      <PropertyForm mode="edit" property={query.data} />
    </div>
  );
}
