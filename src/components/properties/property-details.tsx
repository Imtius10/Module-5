"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  EyeOff,
  Mail,
  MapPin,
  MessageSquareText,
  Send,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SmartImage } from "@/components/smart-image";
import { PropertyReviews } from "@/components/properties/property-reviews";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { formatPrice, timeAgo } from "@/lib/format";
import { propertyGallery } from "@/lib/images";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/store/auth";
import type { Property, RentalRequest } from "@/lib/types";

export function PropertyDetails({ property }: { property: Property }) {
  const router = useRouter();
  const { user, status } = useAuth();
  const gallery = propertyGallery(property);
  const [activeImage, setActiveImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const available = property.isAvailable !== false;

  const requestMutation = useApiMutation<string, { data: RentalRequest }>({
    mutationFn: (text) =>
      api.post<RentalRequest>("/api/rentals", {
        propertyId: property.id,
        message: text || undefined,
      }),
    successMessage: "Request sent! The landlord will review it shortly.",
    invalidate: [["rentals"]],
    onSuccess: () => {
      setOpen(false);
      setMessage("");
      router.push("/dashboard/tenant/requests");
    },
  });

  const handleRequestClick = () => {
    if (status === "loading") return;
    if (!user) {
      toast.info("Sign in as a tenant to request this property.");
      router.push(`/auth/login?next=/properties/${property.id}`);
      return;
    }
    if (user.role !== "TENANT") {
      toast.error(
        `You are signed in as a ${user.role.toLowerCase()}. Only tenants can request rentals.`
      );
      return;
    }
    setOpen(true);
  };

  const galleryNode = (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border/70 bg-muted">
      <AnimatePresence mode="wait">
        <motion.div
          key={gallery[activeImage]}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          <SmartImage
            src={gallery[activeImage]}
            alt={`${property.title} — photo ${activeImage + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {!available && (
        <Badge className="absolute left-4 top-4 border-0 bg-amber-500 text-white">
          <EyeOff className="size-3" /> Currently unavailable
        </Badge>
      )}

      <div className="absolute inset-x-4 bottom-4 flex gap-2 overflow-x-auto no-scrollbar">
        {gallery.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveImage(index)}
            aria-label={`Show photo ${index + 1}`}
            className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
              index === activeImage
                ? "border-white shadow-lg"
                : "border-white/40 opacity-70 hover:opacity-100"
            }`}
          >
            <SmartImage
              src={src}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        {galleryNode}

        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {property.category}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" /> Listed{" "}
                  {timeAgo(property.createdAt)}
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                {property.title}
              </h1>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" /> {property.location}
              </p>
            </div>
            <div className="rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-right">
              <p className="text-2xl font-semibold text-primary">
                {formatPrice(property.price)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
          </div>

          <Separator className="my-6" />

          <h2 className="text-lg font-semibold">About this place</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
            {property.description}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Building2, label: "Property type", value: property.category },
              { icon: Wallet, label: "Monthly rent", value: formatPrice(property.price) },
              {
                icon: available ? BadgeCheck : EyeOff,
                label: "Availability",
                value: available ? "Open for requests" : "Unavailable",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/70 bg-card p-4"
              >
                <item.icon className="size-4 text-primary" />
                <p className="mt-3 text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-0.5 text-sm font-medium capitalize">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4">
            <Avatar className="size-12 border">
              <AvatarFallback className="bg-brand-gradient font-semibold text-white">
                {(property.landlord?.name ?? "L").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                {property.landlord?.name ?? "Verified landlord"}
                <BadgeCheck className="size-4 text-primary" />
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Your request goes straight to this host
              </p>
            </div>
            {property.landlord?.email && (
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <a href={`mailto:${property.landlord.email}`}>
                  <Mail className="size-4" /> Contact
                </a>
              </Button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Tenant reviews</h2>
          <div className="mt-4">
            <PropertyReviews propertyId={property.id} />
          </div>
        </div>
      </div>

      {/* Sticky booking card */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lg shadow-black/5">
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-semibold tracking-tight">
              {formatPrice(property.price)}
            </p>
            <span className="text-sm text-muted-foreground">/ month</span>
          </div>

          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              Approval usually takes under a day
            </li>
            <li className="flex gap-2">
              <Wallet className="mt-0.5 size-4 shrink-0 text-primary" />
              Secure card payment via Stripe Checkout
            </li>
            <li className="flex gap-2">
              <MessageSquareText className="mt-0.5 size-4 shrink-0 text-primary" />
              Add a personal note to strengthen your request
            </li>
          </ul>

          <Dialog open={open} onOpenChange={setOpen}>
            <Button
              className="mt-6 w-full rounded-xl"
              size="lg"
              disabled={!available}
              onClick={handleRequestClick}
            >
              {available ? "Request to rent" : "Currently unavailable"}
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request this property</DialogTitle>
                <DialogDescription>
                  {property.title} · {property.location}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="rounded-xl border border-border/70 bg-muted/40 p-3 text-sm">
                  <p className="font-medium">{property.title}</p>
                  <p className="text-muted-foreground">
                    {formatPrice(property.price)} / month · {property.location}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="request-message">Message to the landlord</Label>
                  <Textarea
                    id="request-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Hi! I'm interested in moving in next month…"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    {message.length}/500 characters (optional)
                  </p>
                </div>
                {requestMutation.isError && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    {errorMessage(requestMutation.error)}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => requestMutation.mutate(message)}
                  disabled={requestMutation.isPending}
                >
                  {requestMutation.isPending ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" /> Send request
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {!available && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              This listing is paused by the landlord.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="aspect-[16/10] w-full animate-pulse rounded-3xl bg-muted" />
        <div className="h-6 w-2/3 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-72 animate-pulse rounded-3xl bg-muted" />
    </div>
  );
}
