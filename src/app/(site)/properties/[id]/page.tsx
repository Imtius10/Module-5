import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_URL } from "@/lib/api";
import type { Property } from "@/lib/types";
import { PropertyDetails } from "@/components/properties/property-details";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${API_URL}/api/properties/${id}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as Property | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) return { title: "Property not found" };
  return {
    title: property.title,
    description: property.description.slice(0, 155),
    openGraph: { title: property.title, description: property.description.slice(0, 155) },
  };
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PropertyDetails property={property} />
    </div>
  );
}
