import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/marketing/navigation";
import { Footer } from "@/components/marketing/footer";
import { guidesForLocale } from "@/lib/guides";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

const copy = {
  "en-GB": {
    title: "Plain answers to the questions owners actually ask.",
    lead: "Practical guides on being found online — local visibility, reviews and website health — written for people running a business, not for marketers.",
    description: "Practical guides on local visibility, Google reviews and website health for small businesses in the UK.",
    cta: "Join the waiting list",
    ctaBody: "NegoTrack brings these checks into one place and tells you what to fix first. Join the list and we will tell you when the private beta opens.",
  },
  "es-ES": {
    title: "Respuestas claras a las preguntas que se hacen de verdad.",
    lead: "Guías prácticas sobre cómo te encuentran online —visibilidad local, reseñas y estado de la web— escritas para quien lleva un negocio, no para especialistas en marketing.",
    description: "Guías prácticas sobre visibilidad local, reseñas de Google y salud web para autónomos y pymes en España.",
    cta: "Únete a la lista de espera",
    ctaBody: "NegoTrack reúne estas comprobaciones en un solo sitio y te dice qué arreglar primero. Apúntate y te avisamos cuando abra la beta privada.",
  },
} as const;

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const text = copy[locale];
  return {
    title: `${text.title} | NegoTrack`,
    description: text.description,
    alternates: { canonical: `/${locale}/guides` },
  };
}

export default async function GuidesIndex({ params }: PageProps) {
  const { locale: candidate } = await params;
  if (!isLocale(candidate)) notFound();
  const locale: Locale = candidate;
  const text = copy[locale];
  const dictionary = getDictionary(locale);
  const list = guidesForLocale(locale);

  return (
    <div className="site-shell" data-locale={locale}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navigation locale={locale} copy={dictionary.navigation} />

      <main id="main-content">
        <section className="page-hero">
          <div className="page-hero__atmosphere" aria-hidden="true">
            <div className="hero-orb hero-orb--one" />
            <div className="hero-orb hero-orb--two" />
          </div>
          <div className="container page-hero__inner">
            <h1>{text.title}</h1>
            <p className="page-hero__lead">{text.lead}</p>
          </div>
        </section>

        <section className="section page-section">
          <div className="container">
            <div className="page-cards page-cards--wide">
              {list.map((guide) => (
                <Link key={guide.slug} href={`/${locale}/guides/${guide.slug}`} className="page-card">
                  <h3>{guide.title}<ArrowUpRight aria-hidden="true" /></h3>
                  <p>{guide.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--cta">
          <div className="container">
            <div className="page-cta">
              <h2>{text.cta}</h2>
              <p>{text.ctaBody}</p>
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
