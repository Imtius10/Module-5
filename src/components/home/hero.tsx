"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Verified landlords" },
  { icon: Wallet, label: "Secure Stripe checkout" },
  { icon: Sparkles, label: "Curated listings" },
];

export function Hero() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("all");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (category !== "all") params.set("category", category);
    router.push(`/properties${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 size-72 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            <Sparkles className="size-3.5" />
            Rentals without the runaround
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
          >
            Find &amp; list rental properties{" "}
            <span className="font-accent italic text-gradient">with ease</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            RentNest connects tenants with trusted landlords — browse homes,
            request a viewing, approve in one tap and pay securely online.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={submit}
            className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 p-3 shadow-xl shadow-black/5 backdrop-blur sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City, area or neighbourhood"
                aria-label="Location"
                className="h-11 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="hidden w-px self-stretch bg-border sm:block" />

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                aria-label="Property type"
                className="h-11 w-full border-0 bg-transparent shadow-none sm:w-40"
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

            <Button type="submit" className="h-11 rounded-xl px-5">
              <Search className="size-4" /> Search
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <Icon className="size-4 text-primary" /> {label}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "3 min", label: "Average request response" },
              { value: "100%", label: "Online, cash-free rent payment" },
              { value: "24/7", label: "Moderated by real admins" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/70 bg-card/70 p-5 text-left backdrop-blur"
              >
                <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex justify-center"
        >
          <Button asChild variant="link" className="text-muted-foreground">
            <a href="#featured">
              Explore featured homes <ArrowRight className="size-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
