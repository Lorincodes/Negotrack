import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { DemoBadge, Logo } from "@/components/marketing/ui";
import { capabilities, findCapability } from "@/lib/capabilities";
import { findGuide } from "@/lib/guides";
import { isLocale, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return capabilities.map((capability) => ({ locale: capability.locale, slug: capability.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const capability = findCapability(locale, slug);
  if (!capability) return {};
  return {
    title: `${capability.title} | NegoTrack`,
    description: capability.description,
    alternates: { canonical: `/${locale}/capabilities/${slug}` },
    openGraph: {
      type: "website",
      title: capability.title,
      description: capability.description,
      locale: locale === "en-GB" ? "en_GB" : "es_ES",
    },
  };
}

export default async function CapabilityPage({ params }: PageProps) {
  const { locale: candidate, slug } = await params;
  if (!isLocale(candidate)) notFound();
  const locale: Locale = candidate;
  const capability = findCapability(locale, slug);
  if (!capability) notFound();

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.negotrack.com";
  const url = `${site}/${locale}/capabilities/${slug}`;
  const spanish = locale === "es-ES";
  const guide = capability.relatedGuide ? findGuide(locale, capability.relatedGuide) : undefined;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "NegoTrack", item: `${site}/${locale}` },
        { "@type": "ListItem", position: 2, name: spanish ? "Capacidades" : "Capabilities", item: `${site}/${locale}/capabilities` },
        { "@type": "ListItem", position: 3, name: capability.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: capability.faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ];

  return (
    <main className="info-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <div className="container info-page__inner">
        <Link href={`/${locale}`} aria-label="NegoTrack home"><Logo /></Link>

        <nav className="guide__crumbs" aria-label={spanish ? "Ruta de navegación" : "Breadcrumb"}>
          <Link href={`/${locale}/capabilities`}>{spanish ? "Capacidades" : "Capabilities"}</Link>
        </nav>

        <h1>{capability.title}</h1>
        <p className="guide__answer">{capability.lead}</p>

        {/* The product is pre-launch, and these pages say so rather than
            implying an operating service. */}
        <div style={{ marginTop: 18 }}>
          <DemoBadge>{spanish ? "En desarrollo · beta privada próximamente" : "In development · private beta soon"}</DemoBadge>
        </div>

        <section className="guide__section">
          <h2>{spanish ? "Qué revisa" : "What it covers"}</h2>
          <ul className="capability__covers">
            {capability.covers.map((item) => (
              <li key={item}><Check aria-hidden="true" />{item}</li>
            ))}
          </ul>
        </section>

        <section className="guide__section">
          <h2>{spanish ? "Por qué importa" : "Why it matters"}</h2>
          {capability.why.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
        </section>

        {guide && (
          <section className="guide__section">
            <h2>{spanish ? "Guía relacionada" : "Related guide"}</h2>
            <ul className="guide-index">
              <li>
                <Link href={`/${locale}/guides/${guide.slug}`}>
                  <h2>{guide.title}<ArrowUpRight aria-hidden="true" /></h2>
                  <p>{guide.description}</p>
                </Link>
              </li>
            </ul>
          </section>
        )}

        <section className="guide__section">
          <h2>{spanish ? "Preguntas frecuentes" : "Frequently asked questions"}</h2>
          {capability.faq.map(({ q, a }) => (
            <div key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </section>

        <Link className="button button--secondary" href={`/${locale}/capabilities`}>
          <ArrowLeft aria-hidden="true" />{spanish ? "Todas las capacidades" : "All capabilities"}
        </Link>
      </div>
    </main>
  );
}
