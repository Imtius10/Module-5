"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImagePlus, ListPlus, Save } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { SmartImage } from "@/components/smart-image";
import { api, errorMessage } from "@/lib/api";
import { fetchCategories, queryKeys } from "@/lib/queries";
import type { Property } from "@/lib/types";

export const propertySchema = z.object({
  title: z.string().min(4, "Title needs at least 4 characters"),
  description: z
    .string()
    .min(20, "Describe the place in at least 20 characters")
    .max(2000, "Keep the description under 2000 characters"),
  price: z
    .number({ invalid_type_error: "Enter a monthly rent" })
    .min(500, "Monthly rent must be at least ৳500")
    .max(10_000_000, "That price looks unrealistic"),
  location: z.string().min(3, "Where is the property located?"),
  category: z.string().min(2, "Pick or type a category"),
  imageUrl: z
    .string()
    .url("Enter a full image URL (https://…)")
    .optional()
    .or(z.literal("")),
  isAvailable: z.boolean(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  mode: "create" | "edit";
  property?: Property;
}

export function PropertyForm({ mode, property }: PropertyFormProps) {
  const router = useRouter();
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title ?? "",
      description: property?.description ?? "",
      price: property?.price ?? 15000,
      location: property?.location ?? "",
      category: property?.category ?? "apartment",
      imageUrl: property?.imageUrl ?? "",
      isAvailable: property?.isAvailable ?? true,
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });
  const isAvailable = useWatch({ control, name: "isAvailable" });

  const onSubmit = async (values: PropertyFormValues) => {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      location: values.location.trim(),
      category: values.category.trim().toLowerCase(),
      imageUrl: values.imageUrl?.trim() || null,
      isAvailable: values.isAvailable,
    };

    try {
      if (mode === "create") {
        await api.post<Property>("/api/landlord/properties", payload);
        toast.success("Listing published! Tenants can find it now.");
      } else if (property) {
        await api.put<Property>(
          `/api/landlord/properties/${property.id}`,
          payload
        );
        toast.success("Listing updated.");
      }
      reset(values);
      router.push("/dashboard/landlord/properties");
      router.refresh();
    } catch (error) {
      const message = errorMessage(error);
      toast.error(message);
      if (message.toLowerCase().includes("title")) {
        setError("title", { message });
      } else if (message.toLowerCase().includes("price")) {
        setError("price", { message });
      } else {
        setError("root", { message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <ListPlus className="size-4 text-primary" /> Listing details
            </h2>

            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Sunlit 2BR apartment in Dhanmondi"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                placeholder="Share layout, furnishing, nearby landmarks, rules…"
                {...register("description")}
              />
              {errors.description ? (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Minimum 20 characters — tenants read this first.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="font-semibold">Price & location</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="price">Monthly rent (৳)</Label>
                <Input
                  id="price"
                  type="number"
                  inputMode="numeric"
                  min={500}
                  step={500}
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Banani, Dhaka"
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                list="property-categories"
                placeholder="apartment, house, villa…"
                {...register("category")}
              />
              <datalist id="property-categories">
                {(categoriesQuery.data ?? []).map((category) => (
                  <option key={category} value={category} />
                ))}
                {["apartment", "house", "villa", "studio", "office"].map(
                  (category) => <option key={category} value={category} />
                )}
              </datalist>
              {errors.category && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {errors.root && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {errors.root.message}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving…
              </>
            ) : mode === "create" ? (
              <>
                <ListPlus className="size-4" /> Publish listing
              </>
            ) : (
              <>
                <Save className="size-4" /> Save changes
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          {isDirty && (
            <span className="self-center text-xs text-muted-foreground">
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Preview column */}
      <aside className="space-y-4">
        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <ImagePlus className="size-4 text-primary" /> Cover image
            </h2>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/70 bg-muted">
              {imageUrl ? (
                <SmartImage
                  src={imageUrl}
                  alt="Property preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 340px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-brand-gradient/10 text-muted-foreground">
                  <ImagePlus className="size-6" />
                  <p className="text-xs">Paste an image URL to preview it</p>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://images.unsplash.com/…"
                {...register("imageUrl")}
              />
              {errors.imageUrl ? (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.imageUrl.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Optional — we show a curated photo if it&apos;s empty.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-5">
            <h2 className="font-semibold">Availability</h2>
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="isAvailable"
                checked={isAvailable}
                onCheckedChange={(checked) =>
                  setValue("isAvailable", checked === true, { shouldDirty: true })
                }
              />
              <label htmlFor="isAvailable" className="text-sm text-muted-foreground">
                Accept new rental requests for this property
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              {isAvailable
                ? "Visible as available on the marketplace."
                : "Marked as unavailable — tenants can't request it."}
            </p>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}
