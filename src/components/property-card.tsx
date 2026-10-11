import Link from "next/link";
import { MapPin, User2, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/smart-image";
import { formatPrice, truncate } from "@/lib/format";
import { propertyImage } from "@/lib/images";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  className?: string;
  priority?: boolean;
}

export function PropertyCard({ property, className, priority }: PropertyCardProps) {
  const available = property.isAvailable !== false;

  return (
    <Link
      href={`/properties/${property.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          src={propertyImage(property)}
          alt={property.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        <Badge className="absolute left-3 top-3 border-0 bg-black/60 text-white backdrop-blur">
          {property.category}
        </Badge>

        {!available && (
          <Badge className="absolute right-3 top-3 border-0 bg-amber-500/90 text-white">
            <EyeOff className="size-3" /> Unavailable
          </Badge>
        )}

        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <span className="rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-gray-900 backdrop-blur">
            {property.landlord?.name ?? "Verified landlord"}
          </span>
          <span className="rounded-lg bg-primary px-2.5 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg">
            {formatPrice(property.price)}
            <span className="text-[11px] font-normal opacity-80">/mo</span>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold transition-colors group-hover:text-primary">
          {property.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {truncate(property.description, 110)}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{property.location}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1">
            <User2 className="size-3.5" />
            Host
          </span>
        </div>
      </div>
    </Link>
  );
}
