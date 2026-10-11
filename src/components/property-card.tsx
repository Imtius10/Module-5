"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  EyeOff,
  Heart,
  MapPin,
  Sparkles,
  User2,
} from "lucide-react";
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
  const [liked, setLiked] = useState(false);

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10",
        className
      )}
    >
      <Link
        href={`/properties/${property.id}`}
        className="flex flex-1 flex-col focus-visible:outline-none"
        aria-label={`View ${property.title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage
            src={propertyImage(property)}
            alt={property.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge className="border-0 bg-black/55 text-white backdrop-blur">
              {property.category}
            </Badge>
            {!available && (
              <Badge className="border-0 bg-amber-500/95 text-white">
                <EyeOff className="size-3" /> Rented
              </Badge>
            )}
          </div>

          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
            <span className="inline-flex max-w-[70%] items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-900 backdrop-blur">
              <BadgeCheck className="size-3.5 text-emerald-600" />
              <span className="truncate">
                {property.landlord?.name ?? "Verified landlord"}
              </span>
            </span>
            <span className="rounded-full bg-brand-gradient px-3 py-1.5 text-sm font-semibold text-white shadow-lg">
              {formatPrice(property.price)}
              <span className="text-[11px] font-normal opacity-80">/mo</span>
            </span>
          </div>

          {/* Hover cue */}
          <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 sm:inline-flex">
            View details <ArrowUpRight className="size-3.5" />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-base font-semibold transition-colors group-hover:text-primary">
              {property.title}
            </h3>
            {available && (
              <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <Sparkles className="size-3" /> Available
              </span>
            )}
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {truncate(property.description, 110)}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
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

      {/* Favourite toggle sits above the stretched card link */}
      <button
        type="button"
        aria-label={liked ? "Remove from saved" : "Save this home"}
        aria-pressed={liked}
        onClick={() => setLiked((value) => !value)}
        className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur transition hover:scale-110 hover:bg-black/60"
      >
        <Heart
          className={cn(
            "size-4 transition-colors",
            liked && "fill-red-500 text-red-500"
          )}
        />
      </button>
    </div>
  );
}
