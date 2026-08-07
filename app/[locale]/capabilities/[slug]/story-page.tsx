import Link from "next/link";
import { Navigation } from "@/components/marketing/navigation";
import { Footer } from "@/components/marketing/footer";
import { PageWaitlist } from "@/components/marketing/page-sections";
import { Reveal } from "@/components/marketing/ui";
import {
  Comparison, IndustrySwitcher, InsightMoment, Outcomes, PageMatchPanel, RelatedRail, SearchConsole, TrendPanel,
} from "@/components/marketing/capability-story";
import type { CapabilityStory } from "@/lib/capability-story";
import type { Capability } from "@/lib/capabilities";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * The long-form capability page.
 *
 * Composition rather than a template: sections alternate side, the product
 * visuals are built from this capability's own data, and the dark insight
 * section is the page's single loudest moment. Capabilities without a story
 * fall back to the shorter layout.
 */
export function CapabilityStoryPage({
  story, capability, siblings, locale, dictionary, schema,
}: {
  story: CapabilityStory;
  capability: Capability;
  siblings: Capability[];
  locale: Locale;
  dictionary: Dictionary;
  schema: unknown;
}) {
  const spanish = locale === "es-ES";
  const t = spanish
    ? { crumb: "Capacidades", demo: "Vista previa · datos de demostración", gap: "Ninguna página cubre este término",
        related: "Capacidades relacionadas", faq: "Preguntas frecuentes", reassure: "Gratis · Sin compromiso · Acceso anticipado" }
    : { crumb: "Capabilities", demo: "Product preview · demonstration data", gap: "No page covers this term",
        related: "Related capabilities", faq: "Frequently asked questions", reassure: "Free to join · No obligation · Early access" };

  return (
    <div className="site-shell story" data-locale={locale}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Navigation locale={locale} copy={dictionary.navigation} />

      <main id="main-content">
        {/* 1 — Hero. The console is the visual, not an illustration beside it. */}
        <section className="story-hero">
          <div className="story-hero__atmosphere" aria-hidden="true">
            <div className="hero-grid-field" />
            <div className="hero-orb hero-orb--one" />
            <div className="hero-orb hero-orb--two" />
          </div>
          <div className="container story-hero__inner">
            <Reveal className="story-hero__copy" onMount>
              <nav className="story-hero__crumbs" aria-label={t.crumb}>
                <Link href={`/${locale}/capabilities`}>{t.crumb}</Link>
              </nav>
              <p className="story-eyebrow">{story.eyebrow}</p>
              <h1>{story.headline}</h1>
              <p className="story-hero__lead">{story.lead}</p>
              <PageWaitlist locale={locale} copy={dictionary.hero} source={story.slug} />
              <p className="story-hero__reassure">{t.reassure}</p>
            </Reveal>
            <Reveal className="story-hero__visual" variant="settle" delay={0.08}>
              <SearchConsole story={story} caption={t.demo} />
            </Reveal>
          </div>
        </section>

        {/* 2 — Visual left, copy right. */}
        <section className="story-section">
          <div className="container story-split">
            <Reveal className="story-split__visual" variant="left">
              <TrendPanel title={story.benefitOne.chartTitle} meta={story.benefitOne.chartMeta} series={story.benefitOne.series} />
            </Reveal>
            <Reveal className="story-split__copy" variant="right">
              <p className="story-eyebrow">{story.benefitOne.eyebrow}</p>
              <h2>{story.benefitOne.heading}</h2>
              {story.benefitOne.body.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
            </Reveal>
          </div>
        </section>

        {/* 3 — Reversed. */}
        <section className="story-section story-section--tint">
          <div className="container story-split story-split--reverse">
            <Reveal className="story-split__copy" variant="left">
              <p className="story-eyebrow">{story.benefitTwo.eyebrow}</p>
              <h2>{story.benefitTwo.heading}</h2>
              {story.benefitTwo.body.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
            </Reveal>
            <Reveal className="story-split__visual" variant="right">
              <PageMatchPanel title={story.benefitTwo.rowTitle} rows={story.benefitTwo.rows} gapLabel={t.gap} />
            </Reveal>
          </div>
        </section>

        {/* 4 — The loudest moment on the page. */}
        <InsightMoment story={story} />

        {/* 5 — Outcomes: numerals and air. */}
        <section className="story-section">
          <div className="container">
            <Reveal className="story-lead-heading" variant="soft">
              <h2>{story.outcomes.heading}</h2>
            </Reveal>
            <Outcomes story={story} />
          </div>
        </section>

        {/* 6 — Before / after. */}
        <section className="story-section story-section--tint">
          <div className="container">
            <Reveal className="story-lead-heading" variant="soft"><h2>{story.comparison.heading}</h2></Reveal>
            <Comparison story={story} />
          </div>
        </section>

        {/* 7 — Who it is for, as a live selector. */}
        <section className="story-section">
          <div className="container">
            <Reveal className="story-lead-heading" variant="soft">
              <h2>{story.industries.heading}</h2>
              <p>{story.industries.lead}</p>
            </Reveal>
            <IndustrySwitcher story={story} />
          </div>
        </section>

        {/* 8 — Related, as a rail. */}
        {siblings.length > 0 && (
          <section className="story-section story-section--tint">
            <div className="container">
              <Reveal className="story-lead-heading" variant="soft"><h2>{t.related}</h2></Reveal>
            </div>
            <RelatedRail locale={locale} label={t.related} items={siblings} />
          </section>
        )}

        {/* 9 — Finale. */}
        <section className="story-finale">
          <div className="story-finale__atmosphere" aria-hidden="true">
            <div className="hero-orb hero-orb--one" />
            <div className="hero-orb hero-orb--three" />
          </div>
          <div className="container story-finale__inner">
            <Reveal variant="settle">
              <h2>{story.finale.heading}</h2>
              <p>{story.finale.body}</p>
              <PageWaitlist locale={locale} copy={dictionary.hero} source={`finale-${story.slug}`} />
              <p className="story-hero__reassure">{t.reassure}</p>
            </Reveal>
          </div>
        </section>

        {/* FAQ kept for the answer-engine value, but demoted to a quiet close. */}
        <section className="story-section story-faq">
          <div className="container story-faq__inner">
            <h2>{t.faq}</h2>
            <div className="page-faq">
              {capability.faq.map(({ q, a }) => <div key={q}><h3>{q}</h3><p>{a}</p></div>)}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} copy={dictionary.footer} />
    </div>
  );
}
