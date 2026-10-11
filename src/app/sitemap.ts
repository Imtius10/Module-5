import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const NOW = new Date();

/** Pages worth indexing; dashboards are excluded on purpose (robots.ts). */
const ROUTES = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/properties", priority: 0.9, changeFrequency: "hourly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/auth/login", priority: 0.4, changeFrequency: "monthly" },
  { path: "/auth/register", priority: 0.4, changeFrequency: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: NOW,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
