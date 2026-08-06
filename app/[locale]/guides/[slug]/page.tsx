import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Logo } from "@/components/marketing/ui";
import { findGuide, guides } from "@/lib/guides";
import { isLocale, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ locale: guide.locale, slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const guide = findGuide(locale, slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | NegoTrack`,
    description: guide.description,
    alternates: { canonical: `/${locale}/guides/${slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      locale: locale === "en-GB" ? "en_GB" : "es_ES",
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { locale: candidate, slug } = await params;
  if (!isLocale(candidate)) notFound();
  const locale: Locale = candidate;
  const guide = findGuide(locale, slug);
  if (!guide) notFound();

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.negotrack.com";
  const url = `${site}/${locale}/guides/${slug}`;
  const spanish = locale === "es-ES";

  /**
   * Article carries the author back to the Organization entity, which is where
   * the disambiguation lives. Without that link each guide is an orphan page
   * that says nothing about who wrote it.
   */
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      datePublished: guide.published,
      dateModified: guide.updated,
      inLanguage: locale,
      mainEntityOfPage: url,
      author: { "@id": `${site}/#organization` },
      publisher: { "@id": `${site}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "NegoTrack", item: `${site}/${locale}` },
        { "@type": "ListItem", position: 2, name: spanish ? "Guías" : "Guides", item: `${site}/${locale}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
    ...(guide.faq
      ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }]
      : []),
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
          <Link href={`/${locale}/guides`}>{spanish ? "Guías" : "Guides"}</Link>
        </nav>

        <h1>{guide.title}</h1>
        {/* The answer sits immediately under the title, before anything else,
            because that is the passage answer engines and snippets extract. */}
        <p className="guide__answer">{guide.answer}</p>

        <p className="guide__meta">
          <time dateTime={guide.updated}>
            {spanish ? "Actualizado" : "Updated"}{" "}
            {new Date(guide.updated).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </p>

        {guide.sections.map((section) => (
          <section key={section.heading} className="guide__section">
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
            {section.list && (
              section.numbered
                ? <ol className="guide__list">{section.list.map((item) => <li key={item.slice(0, 40)}>{item}</li>)}</ol>
                : <ul className="guide__list">{section.list.map((item) => <li key={item.slice(0, 40)}>{item}</li>)}</ul>
            )}
          </section>
        ))}

        {guide.faq && (
          <section className="guide__section">
            <h2>{spanish ? "Preguntas frecuentes" : "Frequently asked questions"}</h2>
            {guide.faq.map(({ q, a }) => (
              <div key={q}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </section>
        )}

        <Link className="button button--secondary" href={`/${locale}/guides`}>
          <ArrowLeft aria-hidden="true" />{spanish ? "Todas las guías" : "All guides"}
        </Link>
      </div>
    </main>
  );
}
