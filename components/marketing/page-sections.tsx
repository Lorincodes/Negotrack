"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import { DashboardPreview, DemoBadge, Reveal } from "./ui";

/**
 * Shared furniture for the inner pages, so a capability page or a guide is
 * built from the same parts as the homepage rather than being a plain document
 * that happens to share a header.
 */

/**
 * Email capture, on every page.
 *
 * It deliberately does not post. Registration requires an explicit privacy
 * consent that these pages have no room to ask for, so the address is carried
 * to the full form on the homepage with only the consent left to give — the
 * same hand-off the homepage hero already uses, extended across a navigation.
 */
export function PageWaitlist({
  locale, copy, source,
}: { locale: Locale; copy: Dictionary["hero"]; source: string }) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track({ name: "waitlist_submitted", source: "hero" });
    track({ name: "hero_cta_clicked", label: source });
    router.push(`/${locale}?prefill=${encodeURIComponent(email)}#early-access`);
  }

  return (
    <form className="page-waitlist" onSubmit={onSubmit} data-testid="page-waitlist">
      <label className="sr-only" htmlFor={`page-email-${source}`}>{copy.emailLabel}</label>
      <input
        id={`page-email-${source}`}
        type="email"
        required
        autoComplete="email"
        placeholder={copy.emailPlaceholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button className="button button--primary" type="submit">
        {copy.primary}<ArrowUpRight aria-hidden="true" />
      </button>
    </form>
  );
}

/** The closing call to action: dark billboard, capture form, benefit line. */
export function PageCta({
  locale, dictionary, title, body, source,
}: { locale: Locale; dictionary: Dictionary; title: string; body: string; source: string }) {
  return (
    <section className="section section--cta">
      <div className="container">
        <Reveal className="page-cta" variant="settle">
          <i className="page-cta__drift" aria-hidden="true" />
          <div className="page-cta__inner">
            <h2>{title}</h2>
            <p>{body}</p>
            <PageWaitlist locale={locale} copy={dictionary.hero} source={source} />
            <ul className="page-cta__points">
              {dictionary.cta.benefits.map((benefit) => (
                <li key={benefit}><Check aria-hidden="true" />{benefit}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The checks a capability runs, as accented cards rather than a flat list.
 * Accents cycle through the palette's analytic colours so a long list still
 * reads as structure instead of a wall of ticks.
 */
const ACCENTS = ["mint", "blue", "violet", "teal", "amber"] as const;

export function CheckGrid({ items }: { items: string[] }) {
  return (
    <Reveal className="check-grid" variant="rail">
      {items.map((item, index) => (
        <div key={item} className={`check-card check-card--${ACCENTS[index % ACCENTS.length]}`} style={{ "--i": index } as CSSProperties}>
          <span><Check aria-hidden="true" /></span>
          <p>{item}</p>
        </div>
      ))}
    </Reveal>
  );
}

/**
 * The real product console, showing the panel that belongs to this capability.
 * Reusing the homepage component rather than a screenshot keeps the preview
 * honest — it carries its own demonstration-data labelling with it.
 */
export function CapabilityConsole({
  dictionary, panelKey, caption,
}: { dictionary: Dictionary; panelKey: string; caption: string }) {
  const panels = dictionary.console.panels;
  const index = Math.max(0, panels.findIndex((panel) => panel.key === panelKey));
  const panel = panels[index];
  if (!panel) return null;

  return (
    <Reveal className="capability-console" variant="settle">
      <div className="capability-console__glow" aria-hidden="true" />
      <div className="capability-console__frame">
        <DashboardPreview
          copy={dictionary.dashboard}
          demoLabel={dictionary.demo}
          previewLabel={dictionary.preview}
          panel={panel}
          panelIndex={index}
        />
      </div>
      <p className="capability-console__caption"><DemoBadge>{caption}</DemoBadge></p>
    </Reveal>
  );
}

/** Hero shell shared by every inner page: atmosphere, grid field, orbs. */
export function PageHero({ children, article = false }: { children: ReactNode; article?: boolean }) {
  return (
    <section className={`page-hero${article ? " page-hero--article" : ""}`}>
      <div className="page-hero__atmosphere" aria-hidden="true">
        <div className="hero-grid-field" />
        <div className="hero-orb hero-orb--one" />
        <div className="hero-orb hero-orb--two" />
        <div className="hero-orb hero-orb--three" />
      </div>
      <div className="container page-hero__inner">{children}</div>
    </section>
  );
}

/** Sibling links, as cards with a nudging arrow. */
export function PageCards({
  items, locale, base,
}: { items: { slug: string; title: string; description: string }[]; locale: Locale; base: string }) {
  return (
    <Reveal className="page-cards" variant="rail">
      {items.map((item, index) => (
        <Link
          key={item.slug}
          href={`/${locale}/${base}/${item.slug}`}
          className="page-card"
          style={{ "--i": index } as CSSProperties}
        >
          <h3>{item.title}<ArrowUpRight aria-hidden="true" /></h3>
          <p>{item.description}</p>
        </Link>
      ))}
    </Reveal>
  );
}
