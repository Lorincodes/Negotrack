import type { MetadataRoute } from "next";

import { capabilitiesForLocale } from "@/lib/capabilities";
import { guidesForLocale } from "@/lib/guides";
import { locales } from "@/lib/i18n";

/**
 * A sitemap is a list of the pages worth ranking, not an inventory of every URL
 * that resolves. Pages that are deliberately kept out of the index — pricing,
 * guides, help and status, none of which can be filled honestly before launch —
 * are omitted here too, so the two signals agree.
 *
 * Dates are per-page rather than one shared constant. Retrieval systems weight
 * recency, and a sitemap where every URL claims the same timestamp carries no
 * freshness information at all.
 */
const LAST_MODIFIED = {
  home: "2026-08-06",
  identity: "2026-08-06",
  about: "2026-08-06",
  contact: "2026-08-06",
  legal: "2026-08-04",
} as const;

type Entry = { path: string; date: string; changeFrequency: "weekly" | "monthly"; priority: number };

const shared: Entry[] = [
  { path: "", date: LAST_MODIFIED.home, changeFrequency: "weekly", priority: 1 },
  { path: "/about", date: LAST_MODIFIED.about, changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", date: LAST_MODIFIED.contact, changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", date: LAST_MODIFIED.legal, changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", date: LAST_MODIFIED.legal, changeFrequency: "monthly", priority: 0.3 },
];

/** The identity page exists once per language, under a slug native to it. */
const identityByLocale: Record<string, string> = {
  "en-GB": "/what-is-negotrack",
  "es-ES": "/que-es-negotrack",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.negotrack.com";

  return locales.flatMap((locale) => {
    const published = guidesForLocale(locale);
    const documented = capabilitiesForLocale(locale);
    const entries: Entry[] = [
      ...shared,
      { path: identityByLocale[locale], date: LAST_MODIFIED.identity, changeFrequency: "monthly", priority: 0.9 },
      // The index only earns a place once it has something to list.
      ...(published.length
        ? [{ path: "/guides", date: LAST_MODIFIED.home, changeFrequency: "weekly" as const, priority: 0.7 }]
        : []),
      ...published.map((guide) => ({
        path: `/guides/${guide.slug}`,
        date: guide.updated,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...(documented.length
        ? [{ path: "/capabilities", date: LAST_MODIFIED.home, changeFrequency: "monthly" as const, priority: 0.8 }]
        : []),
      ...documented.map((capability) => ({
        path: `/capabilities/${capability.slug}`,
        date: LAST_MODIFIED.home,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
    return entries.map((entry) => ({
      url: `${base}/${locale}${entry.path}`,
      lastModified: new Date(entry.date),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));
  });
}
