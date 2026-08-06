import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/marketing/navigation";
import { Footer } from "@/components/marketing/footer";
import { DemoBadge } from "@/components/marketing/ui";
import { capabilities, capabilitiesForLocale, findCapability } from "@/lib/capabilities";
import { findGuide } from "@/lib/guides";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

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

  const dictionary = getDictionary(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.negotrack.com";
  const url = `${site}/${locale}/capabilities/${slug}`;
  const spanish = locale === "es-ES";
  const guide = capability.relatedGuide ? findGuide(locale, capability.relatedGuide) : undefined;
  const siblings = capabilitiesForLocale(locale).filter((c) => c.slug !== capability.slug).slice(0, 3);

  const t = spanish
    ? { covers: "Qué revisa", why: "Por qué importa", guide: "Guía relacionada", faq: "Preguntas frecuentes",
        more: "Otras capacidades", all: "Ver todas las capacidades", cta: "Únete a la lista de espera",
        ctaBody: "NegoTrack está en desarrollo. Apúntate y te avisamos cuando abra la beta privada.",
        badge: "En desarrollo · beta privada próximamente", eyebrow: "Capacidad" }
    : { covers: "What it covers", why: "Why it matters", guide: "Related guide", faq: "Frequently asked questions",
        more: "Other capabilities", all: "See all capabilities", cta: "Join the waiting list",
        ctaBody: "NegoTrack is in development. Join the list and we will tell you when the private beta opens.",
        badge: "In development · private beta soon", eyebrow: "Capability" };

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
    <div className="site-shell" data-locale={locale}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <Navigation locale={locale} copy={dictionary.navigation} />

      <main id="main-content">
        {/* The same atmosphere layer the homepage hero uses, so a capability
            page reads as part of the site rather than a document attached to it. */}
        <section className="page-hero">
          <div className="page-hero__atmosphere" aria-hidden="true">
            <div className="hero-orb hero-orb--one" />
            <div className="hero-orb hero-orb--two" />
          </div>
          <div className="container page-hero__inner">
            <nav className="page-hero__crumbs" aria-label={spanish ? "Ruta de navegación" : "Breadcrumb"}>
              <Link href={`/${locale}/capabilities`}>{spanish ? "Capacidades" : "Capabilities"}</Link>
              <span aria-hidden="true">·</span>
              <span>{t.eyebrow}</span>
            </nav>
            <h1>{capability.title}</h1>
            <p className="page-hero__lead">{capability.lead}</p>
            <div className="page-hero__actions">
              <Link className="button button--primary" href={`/${locale}#early-access`}>
                {t.cta}<ArrowUpRight aria-hidden="true" />
              </Link>
              <Link className="button button--secondary" href={`/${locale}/capabilities`}>
                {t.all}
              </Link>
            </div>
            <div className="page-hero__badge"><DemoBadge>{t.badge}</DemoBadge></div>
          </div>
        </section>

        <section className="section page-section">
          <div className="container page-grid">
            <div className="page-grid__lead">
              <h2>{t.covers}</h2>
            </div>
            <ul className="capability__covers">
              {capability.covers.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="section page-section page-section--tint">
          <div className="container page-grid">
            <div className="page-grid__lead"><h2>{t.why}</h2></div>
            <div className="page-prose">
              {capability.why.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
              {guide && (
                <p className="page-prose__link">
                  <Link href={`/${locale}/guides/${guide.slug}`}>
                    {t.guide}: {guide.title}<ArrowRight aria-hidden="true" />
                  </Link>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="section page-section">
          <div className="container page-grid">
            <div className="page-grid__lead"><h2>{t.faq}</h2></div>
            <div className="page-faq">
              {capability.faq.map(({ q, a }) => (
                <div key={q}><h3>{q}</h3><p>{a}</p></div>
              ))}
            </div>
          </div>
        </section>

        {siblings.length > 0 && (
          <section className="section page-section page-section--tint">
            <div className="container">
              <h2 className="page-section__title">{t.more}</h2>
              <div className="page-cards">
                {siblings.map((sibling) => (
                  <Link key={sibling.slug} href={`/${locale}/capabilities/${sibling.slug}`} className="page-card">
                    <h3>{sibling.title}<ArrowUpRight aria-hidden="true" /></h3>
                    <p>{sibling.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section section--cta">
          <div className="container">
            <div className="page-cta">
              <h2>{t.cta}</h2>
              <p>{t.ctaBody}</p>
              <Link className="button button--primary" href={`/${locale}#early-access`}>
                {dictionary.navigation.join}<ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} copy={dictionary.footer} />
    </div>
  );
}
