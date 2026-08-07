import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/marketing/navigation";
import { Footer } from "@/components/marketing/footer";
import { CapabilityConsole, CheckGrid, PageCards, PageCta, PageHero, PageWaitlist } from "@/components/marketing/page-sections";
import { Reveal } from "@/components/marketing/ui";
import { CapabilityStoryPage } from "./story-page";
import { findStory } from "@/lib/capability-story";
import { capabilities, capabilitiesForLocale, findCapability, panelForCapability } from "@/lib/capabilities";
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
        more: "Otras capacidades", all: "Ver todas", cta: "Únete a la lista de espera",
        ctaBody: "NegoTrack está en desarrollo. Apúntate y te avisamos cuando abra la beta privada.",
        badge: "En desarrollo · beta privada próximamente", crumb: "Capacidades",
        console: "Vista previa del producto · datos de demostración" }
    : { covers: "What it covers", why: "Why it matters", guide: "Related guide", faq: "Frequently asked questions",
        more: "Other capabilities", all: "See all", cta: "Join the waiting list",
        ctaBody: "NegoTrack is in development. Join the list and we will tell you when the private beta opens.",
        badge: "In development · private beta soon", crumb: "Capabilities",
        console: "Product preview · demonstration data" };

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "NegoTrack", item: `${site}/${locale}` },
        { "@type": "ListItem", position: 2, name: t.crumb, item: `${site}/${locale}/capabilities` },
        { "@type": "ListItem", position: 3, name: capability.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: capability.faq.map(({ q, a }) => ({
        "@type": "Question", name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ];

  // Capabilities with a long-form story render the editorial page; the rest
  // keep the shorter template until their story is written.
  const story = findStory(locale, slug);
  if (story) {
    return (
      <CapabilityStoryPage
        story={story}
        capability={capability}
        siblings={siblings}
        locale={locale}
        dictionary={dictionary}
        schema={schema}
      />
    );
  }

  return (
    <div className="site-shell" data-locale={locale}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Navigation locale={locale} copy={dictionary.navigation} />

      <main id="main-content">
        <PageHero>
          <div className="page-hero__split">
            <Reveal className="page-hero__copy" onMount>
              <nav className="page-hero__crumbs" aria-label={spanish ? "Ruta de navegación" : "Breadcrumb"}>
                <Link href={`/${locale}/capabilities`}>{t.crumb}</Link>
              </nav>
              <h1>{capability.title}</h1>
              <p className="page-hero__lead">{capability.lead}</p>
              {/* Capture on the page itself, not a link away from it. */}
              <PageWaitlist locale={locale} copy={dictionary.hero} source={capability.slug} />
              <p className="page-hero__note">{t.badge}</p>
            </Reveal>

            {/* The real console, showing the panel this capability describes. */}
            <CapabilityConsole dictionary={dictionary} panelKey={panelForCapability(capability.slug)} caption={t.console} />
          </div>
        </PageHero>

        <section className="section page-section">
          <div className="container page-grid">
            <Reveal className="page-grid__lead" variant="left"><h2>{t.covers}</h2></Reveal>
            <CheckGrid items={capability.covers} />
          </div>
        </section>

        <section className="section page-section page-section--tint">
          <div className="container page-grid">
            <Reveal className="page-grid__lead" variant="left"><h2>{t.why}</h2></Reveal>
            <Reveal className="page-prose" variant="right">
              {capability.why.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
              {guide && (
                <p className="page-prose__link">
                  <Link href={`/${locale}/guides/${guide.slug}`}>
                    {t.guide}: {guide.title}<ArrowRight aria-hidden="true" />
                  </Link>
                </p>
              )}
            </Reveal>
          </div>
        </section>

        <section className="section page-section">
          <div className="container page-grid">
            <Reveal className="page-grid__lead" variant="left"><h2>{t.faq}</h2></Reveal>
            <Reveal className="page-faq" variant="right">
              {capability.faq.map(({ q, a }) => <div key={q}><h3>{q}</h3><p>{a}</p></div>)}
            </Reveal>
          </div>
        </section>

        {siblings.length > 0 && (
          <section className="section page-section page-section--tint">
            <div className="container">
              <div className="page-section__head">
                <h2 className="page-section__title">{t.more}</h2>
                <Link className="page-section__link" href={`/${locale}/capabilities`}>
                  {t.all}<ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
              <PageCards locale={locale} base="capabilities" items={siblings} />
            </div>
          </section>
        )}

        <PageCta locale={locale} dictionary={dictionary} title={t.cta} body={t.ctaBody} source={`capability-${capability.slug}`} />
      </main>

      <Footer locale={locale} copy={dictionary.footer} />
    </div>
  );
}
