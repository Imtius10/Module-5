import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { FeaturedProperties } from "@/components/home/featured-properties";
import {
  Categories,
  HowItWorks,
  LandlordCTA,
} from "@/components/home/sections";

export const metadata: Metadata = {
  title: "RentNest — Find & List Rental Properties with Ease",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <div id="featured-anchor" />
      <FeaturedProperties />
      <HowItWorks />
      <LandlordCTA />
    </>
  );
}
