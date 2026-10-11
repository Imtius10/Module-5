"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { PropertyForm } from "@/components/landlord/property-form";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create a new listing"
        description="Add photos, pricing and location — tenants will see it immediately."
      />
      <PropertyForm mode="create" />
    </div>
  );
}
