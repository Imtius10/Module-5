/** Canonical origin of the deployed app (used by metadata, robots, sitemap). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://module-5.vercel.app"
).replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
