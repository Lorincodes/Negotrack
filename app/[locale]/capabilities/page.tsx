import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Logo } from "@/components/marketing/ui";
import { capabilitiesForLocale } from "@/lib/capabilities";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

const copy = {
  "en-GB": {
    title: "Capabilities",
    lead: "What NegoTrack monitors, and what each part is for. The product is in development; these pages describe what it is being built to do.",
    description: "Website audit, SEO tracking, review monitoring, local visibility and more — what NegoTrack monitors for small businesses.",
    planned: "Planned for later",
    plannedLead: "These are on the roadmap and do not have pages yet, because there is nothing honest to say about them beyond the name.",
    back: "Back to homepage",
  },
  "es-ES": {
    title: "Capacidades",
    lead: "Qué vigila NegoTrack y para qué sirve cada parte. El producto está en desarrollo; estas páginas describen lo que se está construyendo.",
    description: "Auditoría web, seguimiento SEO, reseñas, visibilidad local y más: qué vigila NegoTrack para pequeñas empresas.",
    planned: "Previsto más adelante",
    plannedLead: "Están en la hoja de ruta y todavía no tienen página, porque no hay nada honesto que contar sobre ellas más allá del nombre.",
    back: "Volver al inicio",
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
  const documented = capabilitiesForLocale(locale);
  const dictionary = getDictionary(locale);

  /**
   * The homepage grid lists twelve capabilities; only those with a real page
   * link anywhere. The rest are named honestly as roadmap rather than given
   * pages that would say nothing.
   */
  const documentedNames = new Set(documented.map((capability) => capability.name));
  const planned = dictionary.capabilities.items.filter((name) => !documentedNames.has(name));

  return (
    <main className="info-page">
      <div className="container info-page__inner">
        <Link href={`/${locale}`} aria-label="NegoTrack home"><Logo /></Link>
        <h1>{text.title}</h1>
        <p className="guide__answer">{text.lead}</p>

        <ul className="guide-index">
          {documented.map((capability) => (
            <li key={capability.slug}>
              <Link href={`/${locale}/capabilities/${capability.slug}`}>
                <h2>{capability.title}<ArrowUpRight aria-hidden="true" /></h2>
                <p>{capability.description}</p>
              </Link>
            </li>
          ))}
        </ul>

        {planned.length > 0 && (
          <section className="guide__section">
            <h2>{text.planned}</h2>
            <p>{text.plannedLead}</p>
            <ul className="capability__covers">
              {planned.map((name) => <li key={name}>{name}</li>)}
            </ul>
          </section>
        )}

        <Link className="button button--secondary" href={`/${locale}`}>
          <ArrowLeft aria-hidden="true" />{text.back}
        </Link>
      </div>
    </main>
  );
}
