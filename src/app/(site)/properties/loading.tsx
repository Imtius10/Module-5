import { PropertiesPageSkeleton } from "@/components/properties/properties-browser";

export default function PropertiesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PropertiesPageSkeleton />
    </div>
  );
}
