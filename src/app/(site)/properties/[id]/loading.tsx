import { PropertyDetailsSkeleton } from "@/components/properties/property-details";

export default function PropertyLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PropertyDetailsSkeleton />
    </div>
  );
}
