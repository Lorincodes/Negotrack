import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Logo } from "@/components/marketing/ui";
import { guidesForLocale } from "@/lib/guides";
import { isLocale, locales, type Locale } from "@/lib/i18n";

const copy = {
  "en-GB": {
    title: "Guides",
    lead: "Plain-language answers to the questions small business owners actually ask about being found online.",
    description:
      "Practical guides on local visibility, Google reviews and website health for small businesses in the UK.",
    back: "Back to homepage",
  },
  "es-ES": {
    title: "Guías",
    lead: "Respuestas en lenguaje claro a las preguntas que se hacen de verdad los autónomos y las pymes sobre su presencia online.",
    description:
      "Guías prácticas sobre visibilidad local, reseñas de Google y salud web para pequeñas empresas en España.",
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
    alternates: { canonical: `/${locale}/guides` },
  };
}

export default async function GuidesIndex({ params }: PageProps) {
  const { locale: candidate } = await params;
  if (!isLocale(candidate)) notFound();
  const locale: Locale = candidate;
  const text = copy[locale];
  const list = guidesForLocale(locale);

  return (
    <main className="info-page">
      <div className="container info-page__inner">
        <Link href={`/${locale}`} aria-label="NegoTrack home"><Logo /></Link>
        <h1>{text.title}</h1>
        <p className="guide__answer">{text.lead}</p>

        <ul className="guide-index">
          {list.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/${locale}/guides/${guide.slug}`}>
                <h2>{guide.title}<ArrowUpRight aria-hidden="true" /></h2>
                <p>{guide.description}</p>
              </Link>
            </li>
          ))}
        </ul>

        <Link className="button button--secondary" href={`/${locale}`}>
          <ArrowLeft aria-hidden="true" />{text.back}
        </Link>
      </div>
    </main>
  );
}
