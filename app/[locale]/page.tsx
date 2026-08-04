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
  const organisation = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NegoTrack",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://negotrack.com",
    description: metadataByLocale[candidate].description,
    areaServed: ["GB", "ES"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation).replace(/</g, "\\u003c") }} />
      <MarketingPage locale={candidate} dictionary={dictionary} />
    </>
  );
}
