"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Home,
  KeyRound,
  Landmark,
  ShieldCheck,
  Tent,
  TreePine,
  Wallet,
} from "lucide-react";
import { fetchCategories, queryKeys } from "@/lib/queries";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  apartment: Building2,
  flat: Building2,
  house: Home,
  villa: TreePine,
  studio: Tent,
  office: Landmark,
};

export function Categories() {
  const { data = [], isLoading } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  });

  const categories = data.length > 0 ? data : ["apartment", "house", "villa", "studio"];
  const visible = categories.slice(0, 6);

  return (
    <section className="border-y border-border/60 bg-card/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Browse by need</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Popular categories
            </h2>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {visible.map((category, index) => {
            const Icon = ICONS[category.toLowerCase()] ?? Home;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <Link
                  href={`/properties?category=${encodeURIComponent(category)}`}
                  className={cn(
                    "group flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  )}
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-brand-gradient group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium capitalize">{category}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: KeyRound,
    title: "Discover",
    text: "Filter by location, price and type to find a place that actually fits.",
  },
  {
    icon: ShieldCheck,
    title: "Request & approve",
    text: "Send a rental request. Landlords approve or reject it from their dashboard.",
  },
  {
    icon: Wallet,
    title: "Pay securely",
    text: "Checkout with Stripe and get an instant, verifiable receipt.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">How RentNest works</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Three steps from search to keys
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6"
          >
            <span className="absolute right-5 top-4 text-5xl font-semibold text-muted/60">
              0{index + 1}
            </span>
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-emerald-600/20">
              <step.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function LandlordCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -left-10 top-0 size-48 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 size-56 rounded-full bg-black/10 blur-3xl" />

        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Own a place? Turn it into income this week.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base">
          Publish a listing in under two minutes, receive requests in one tidy
          inbox and approve them with a single click.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-emerald-700 hover:bg-white/90"
          >
            <Link href="/auth/register?role=landlord">Start listing free</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/properties">See what's trending</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
