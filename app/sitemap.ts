import type { MetadataRoute } from "next";

const publicSlugs = ["", "pricing", "blog", "guides", "help", "status", "about", "contact", "privacy", "terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://negotrack.com";
  return ["en-GB", "es-ES"].flatMap((locale) =>
    publicSlugs.map((slug) => ({
      url: `${base}/${locale}${slug ? `/${slug}` : ""}`,
      lastModified: new Date("2026-08-04"),
      changeFrequency: slug === "" ? "weekly" as const : "monthly" as const,
      priority: slug === "" ? 1 : 0.5,
    })),
  );
}
