import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/marketing/navigation";
import { Footer } from "@/components/marketing/footer";
import { DemoBadge } from "@/components/marketing/ui";
import { capabilitiesForLocale } from "@/lib/capabilities";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

const copy = {
  "en-GB": {
    title: "Everything NegoTrack watches, in one place.",
    lead: "Website health, search visibility, reviews, local presence and competitors — monitored together and turned into an ordered list of what to fix first.",
    description: "Website audit, SEO tracking, review monitoring, local visibility and more — what NegoTrack monitors for small businesses in the UK and Spain.",
    planned: "Planned for later",
    plannedLead: "These are on the roadmap. They do not have pages yet because there is nothing honest to say about them beyond the name.",
    badge: "In development · private beta soon",
    cta: "Join the waiting list",
    ctaBody: "NegoTrack is in development. Join the list and we will tell you when the private beta opens.",
  },
  "es-ES": {
    title: "Todo lo que vigila NegoTrack, en un solo sitio.",
    lead: "Estado de la web, visibilidad en buscadores, reseñas, presencia local y competencia: vigilados juntos y convertidos en una lista ordenada de qué arreglar primero.",
    description: "Auditoría web, seguimiento SEO, reseñas, visibilidad local y más: qué vigila NegoTrack para pequeñas empresas de España y el Reino Unido.",
    planned: "Previsto más adelante",
    plannedLead: "Están en la hoja de ruta. Todavía no tienen página porque no hay nada honesto que contar sobre ellas más allá del nombre.",
    badge: "En desarrollo · beta privada próximamente",
    cta: "Únete a la lista de espera",
    ctaBody: "NegoTrack está en desarrollo. Apúntate y te avisamos cuando abra la beta privada.",
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
    alternates: { canonical: `/${locale}/capabilities` },
  };
}

export default async function CapabilitiesIndex({ params }: PageProps) {
  const { locale: candidate } = await params;
  if (!isLocale(candidate)) notFound();
  const locale: Locale = candidate;
  const text = copy[locale];
  const dictionary = getDictionary(locale);
  const documented = capabilitiesForLocale(locale);

  const documentedNames = new Set(documented.map((capability) => capability.name));
  const planned = dictionary.capabilities.items.filter((name) => !documentedNames.has(name));

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
            <div className="page-hero__badge"><DemoBadge>{text.badge}</DemoBadge></div>
          </div>
        </section>

        <section className="section page-section">
          <div className="container">
            <div className="page-cards page-cards--wide">
              {documented.map((capability) => (
                <Link key={capability.slug} href={`/${locale}/capabilities/${capability.slug}`} className="page-card">
                  <h3>{capability.title}<ArrowUpRight aria-hidden="true" /></h3>
                  <p>{capability.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {planned.length > 0 && (
          <section className="section page-section page-section--tint">
            <div className="container page-grid">
              <div className="page-grid__lead"><h2>{text.planned}</h2></div>
              <div className="page-prose">
                <p>{text.plannedLead}</p>
                <ul className="planned-list">
                  {planned.map((name) => <li key={name}>{name}</li>)}
                </ul>
              </div>
            </div>
          </section>
        )}

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
