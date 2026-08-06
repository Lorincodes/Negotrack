import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/marketing/navigation";
import { Footer } from "@/components/marketing/footer";
import { PageCards, PageCta, PageHero } from "@/components/marketing/page-sections";
import { Reveal } from "@/components/marketing/ui";
import { findGuide, guides, guidesForLocale } from "@/lib/guides";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

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

  const dictionary = getDictionary(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.negotrack.com";
  const url = `${site}/${locale}/guides/${slug}`;
  const spanish = locale === "es-ES";
  const siblings = guidesForLocale(locale).filter((g) => g.slug !== guide.slug).slice(0, 3);

  const t = spanish
    ? { crumb: "Guías", faq: "Preguntas frecuentes", more: "Más guías", updated: "Actualizado",
        cta: "Únete a la lista de espera", ctaBody: "NegoTrack reúne todo esto en un solo sitio y te dice qué arreglar primero. Apúntate y te avisamos cuando abra la beta privada." }
    : { crumb: "Guides", faq: "Frequently asked questions", more: "More guides", updated: "Updated",
        cta: "Join the waiting list", ctaBody: "NegoTrack brings all of this into one place and tells you what to fix first. Join the list and we will tell you when the private beta opens." };

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
        { "@type": "ListItem", position: 2, name: t.crumb, item: `${site}/${locale}/guides` },
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
    <div className="site-shell" data-locale={locale}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <Navigation locale={locale} copy={dictionary.navigation} />

      <main id="main-content">
        <PageHero article>
          <Reveal onMount>
            <nav className="page-hero__crumbs" aria-label={spanish ? "Ruta de navegación" : "Breadcrumb"}>
              <Link href={`/${locale}/guides`}>{t.crumb}</Link>
            </nav>
            <h1>{guide.title}</h1>
            {/* The complete answer sits directly under the title: it is the
                passage answer engines and featured snippets extract. */}
            <p className="page-hero__lead">{guide.answer}</p>
            <p className="guide__meta">
              <time dateTime={guide.updated}>
                {t.updated}{" "}
                {new Date(guide.updated).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </p>
          </Reveal>
        </PageHero>

        <section className="section page-section">
          <div className="container article">
            {guide.sections.map((section) => (
              <section key={section.heading} className="article__section">
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
              <section className="article__section">
                <h2>{t.faq}</h2>
                <div className="page-faq">
                  {guide.faq.map(({ q, a }) => <div key={q}><h3>{q}</h3><p>{a}</p></div>)}
                </div>
              </section>
            )}
          </div>
        </section>

        {siblings.length > 0 && (
          <section className="section page-section page-section--tint">
            <div className="container">
              <h2 className="page-section__title">{t.more}</h2>
              <PageCards locale={locale} base="guides" items={siblings} />
            </div>
          </section>
        )}

        <PageCta locale={locale} dictionary={dictionary} title={t.cta} body={t.ctaBody} source={`guide-${guide.slug}`} />
      </main>

      <Footer locale={locale} copy={dictionary.footer} />
    </div>
  );
}
