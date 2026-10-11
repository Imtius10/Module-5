"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CreditCard,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProperties, queryKeys } from "@/lib/queries";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=75";

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Verified landlords" },
  { icon: CreditCard, label: "Stripe-secure rent" },
  { icon: BadgeCheck, label: "Admin-moderated" },
];

export function Hero() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("all");

  const listingsQuery = useQuery({
    queryKey: queryKeys.properties({ limit: 1, hero: true }),
    queryFn: () => fetchProperties({ limit: 1 }),
    staleTime: 60_000,
  });

  const totalListings = listingsQuery.data?.meta?.total ?? 0;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (category !== "all") params.set("category", category);
    router.push(`/properties${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed property photo with a dark scrim for readable copy */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/65 to-background" />
        <div className="hero-grid absolute inset-0 opacity-25" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur"
          >
            <Sparkles className="size-3.5 text-amber-300" />
            Rentals without the runaround
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            A better way to rent{" "}
            <span className="font-accent italic text-gradient">your next home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-pretty text-base text-white/75 sm:text-lg"
          >
            Browse curated homes from verified landlords, request a rental in one
            tap and pay safely with Stripe — all in a single flow.
          </motion.p>

          {/* Glass search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={submit}
            className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/70" />
              <Input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City, area or neighbourhood"
                aria-label="Location"
                className="h-11 border-0 bg-transparent pl-9 text-white shadow-none placeholder:text-white/60 focus-visible:ring-0"
              />
            </div>

            <div className="hidden w-px self-stretch bg-white/25 sm:block" />

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                aria-label="Property type"
                className="h-11 w-full border-0 bg-transparent text-white shadow-none [&>span]:text-white/80 [&>svg]:text-white/70 sm:w-40"
              >
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="h-11 rounded-xl bg-brand-gradient px-5 text-white shadow-lg shadow-emerald-900/20 hover:opacity-95"
            >
              <Search className="size-4" /> Search
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur"
              >
                <Icon className="size-3.5 text-emerald-300" /> {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Floating stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: Building2,
              value: totalListings > 0 ? `${totalListings}` : "Live",
              label: totalListings > 0 ? "homes listed right now" : "listings updating",
            },
            {
              icon: Sparkles,
              value: "3 min",
              label: "average landlord response",
            },
            {
              icon: CreditCard,
              value: "100%",
              label: "online, cash-free rent payment",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-white/15 text-white">
                <item.icon className="size-4" />
              </span>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-white/70">{item.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex justify-center"
        >
          <Button
            asChild
            variant="link"
            className="text-white/80 hover:text-white"
          >
            <Link href="/#featured">
              Explore featured homes <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
