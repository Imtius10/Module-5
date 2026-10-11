"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ListFilter, MapPin, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PropertyCard } from "@/components/property-card";
import { PropertyGridSkeleton } from "@/components/property-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Pager } from "@/components/ui/pager";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { errorMessage } from "@/lib/api";
import { fetchCategories, fetchProperties, queryKeys } from "@/lib/queries";
import type { PageMeta } from "@/lib/types";

const CATEGORY_OPTIONS = ["apartment", "house", "villa", "studio", "office"];

export function PropertiesBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      location: searchParams.get("location") ?? "",
      category: searchParams.get("category") ?? "all",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
    }),
    [searchParams]
  );

  const [search, setSearch] = useState(initial.search);
  const [location, setLocation] = useState(initial.location);
  const [category, setCategory] = useState(initial.category);
  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [page, setPage] = useState(
    () => Number(searchParams.get("page")) || 1
  );

  const debouncedSearch = useDebouncedValue(search, 400);
  const debouncedLocation = useDebouncedValue(location, 400);
  const debouncedMin = useDebouncedValue(minPrice, 500);
  const debouncedMax = useDebouncedValue(maxPrice, 500);

  // Keep the URL shareable/bookmarkable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (debouncedLocation) params.set("location", debouncedLocation);
    if (category !== "all") params.set("category", category);
    if (debouncedMin) params.set("minPrice", debouncedMin);
    if (debouncedMax) params.set("maxPrice", debouncedMax);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [
    debouncedSearch,
    debouncedLocation,
    category,
    debouncedMin,
    debouncedMax,
    page,
    pathname,
    router,
  ]);

  // Any filter change invalidates the current page (avoids empty pages).
  const resetPage = () => setPage(1);

  const filters = {
    search: debouncedSearch || undefined,
    location: debouncedLocation || undefined,
    category: category !== "all" ? category : undefined,
    minPrice: debouncedMin || undefined,
    maxPrice: debouncedMax || undefined,
    page,
    limit: 9,
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: queryKeys.properties(filters),
    queryFn: () => fetchProperties(filters),
    placeholderData: (previous) => previous,
  });

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  });

  const categoryOptions =
    categoriesQuery.data && categoriesQuery.data.length > 0
      ? categoriesQuery.data
      : CATEGORY_OPTIONS;

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    router.replace(pathname, { scroll: false });
  };

  const hasFilters =
    Boolean(debouncedSearch || debouncedLocation || debouncedMin || debouncedMax) ||
    category !== "all";

  const filterPanel = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="filter-search">Keyword</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="filter-search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            placeholder="Studio, pool, balcony…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-location">Location</Label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="filter-location"
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              resetPage();
            }}
            placeholder="Banani, Dhaka…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property type</Label>
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            resetPage();
          }}
        >
          <SelectTrigger aria-label="Property type">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem key={option} value={option}>
                <span className="capitalize">{option}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Monthly rent (৳)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={minPrice}
            onChange={(event) => {
              setMinPrice(event.target.value);
              resetPage();
            }}
            placeholder="Min"
            aria-label="Minimum price"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={maxPrice}
            onChange={(event) => {
              setMaxPrice(event.target.value);
              resetPage();
            }}
            placeholder="Max"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={resetFilters}
        disabled={!hasFilters}
      >
        <RotateCcw className="size-4" /> Reset filters
      </Button>
    </div>
  );

  const meta: PageMeta | undefined = data?.meta;

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border/70 bg-card p-5">
          <div className="mb-5 flex items-center gap-2">
            <ListFilter className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Filters</h2>
          </div>
          {filterPanel}
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {category !== "all" ? (
                <span className="capitalize">{category}s</span>
              ) : (
                "All properties"
              )}
            </h1>
            {meta && (
              <Badge variant="secondary" className="rounded-full">
                {meta.total} found
              </Badge>
            )}
            {isFetching && !isLoading && (
              <Skeleton className="h-4 w-10 rounded-full" />
            )}
          </div>

          {/* Mobile filter trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="size-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter listings</SheetTitle>
              </SheetHeader>
              <div className="mt-4">{filterPanel}</div>
            </SheetContent>
          </Sheet>
        </div>

        {isLoading ? (
          <PropertyGridSkeleton count={6} />
        ) : isError ? (
          <EmptyState
            title="Listings are unavailable right now"
            description={errorMessage(error)}
            action={<Button onClick={() => refetch()}>Retry</Button>}
          />
        ) : data && data.items.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {data.items.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No properties match those filters"
            description="Try widening the price range or clearing the location."
            action={
              <Button onClick={resetFilters}>
                <RotateCcw className="size-4" /> Clear filters
              </Button>
            }
          />
        )}

        <div className="mt-8">
          <Pager
            meta={meta}
            onPageChange={(next) => {
              setPage(next);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function PropertiesPageSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4 rounded-2xl border border-border/70 bg-card p-5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </aside>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
        <PropertyGridSkeleton count={6} />
      </div>
    </div>
  );
}
