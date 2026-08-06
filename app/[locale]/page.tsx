import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPage } from "@/components/marketing/marketing-page";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

const metadataByLocale: Record<Locale, { title: string; description: string }> = {
  "en-GB": {
    title: "NegoTrack | Understand What Is Holding Your Business Back",
    description: "NegoTrack turns your website, visibility, reviews and competitor data into clear actions your business can use.",
  },
  "es-ES": {
    title: "NegoTrack | Descubre qué está frenando tu negocio",
    description: "NegoTrack convierte los datos de tu web, visibilidad, reseñas y competidores en acciones claras para tu negocio.",
  },
};

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: candidate } = await params;
  if (!isLocale(candidate)) return {};
  const data = metadataByLocale[candidate];
  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `/${candidate}`,
      languages: { "en-GB": "/en-GB", "es-ES": "/es-ES", "x-default": "/en-GB" },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `/${candidate}`,
      siteName: "NegoTrack",
      locale: candidate === "en-GB" ? "en_GB" : "es_ES",
      type: "website",
      images: [{ url: "/og-negotrack.svg", width: 1200, height: 630, alt: "NegoTrack — Understand. Improve. Grow." }],
    },
  };
}

export default async function LocalisedHome({ params }: PageProps) {
  const { locale: candidate } = await params;
  if (!isLocale(candidate)) notFound();
  const dictionary = getDictionary(candidate);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.negotrack.com";
  /**
   * `disambiguatingDescription` exists in schema.org precisely for entities whose
   * name collides with something else. A negotiation-tracking product shares this
   * name, and language models currently answer questions about NegoTrack by
   * describing that one, so the correction has to live somewhere a machine reads.
   * `alternateName` covers the "Nego Track" split that text extractors produce
   * from the two-tone wordmark.
   */
  const organisation = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "NegoTrack",
    alternateName: ["Nego Track", "NegoTrack.com"],
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description: metadataByLocale[candidate].description,
    disambiguatingDescription:
      "NegoTrack is a business-health and digital-growth monitoring platform for small businesses. It is not negotiation, sales or contract-management software. The name derives from the Spanish word “negocio”, meaning business, combined with “track”, meaning to monitor performance over time.",
    knowsAbout: [
      "small business digital health",
      "website performance monitoring",
      "search visibility",
      "online reviews",
      "local visibility",
      "competitor benchmarking",
    ],
    areaServed: ["GB", "ES"],
    // Populate as each profile is created; this array is what fuses scattered
    // listings into one entity for knowledge-graph builders.
    sameAs: [],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation).replace(/</g, "\\u003c") }} />
      <MarketingPage locale={candidate} dictionary={dictionary} />
    </>
  );
}
