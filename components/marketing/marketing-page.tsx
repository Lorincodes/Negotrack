"use client";

import Link from "next/link";
import { useState, type CSSProperties, type FormEvent } from "react";
import { ArrowDown, ArrowUpRight, Check, HeartHandshake, Languages, LockKeyhole, MapPin, Sparkles } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import { ConsentBanner } from "@/components/analytics/consent-banner";
import { Navigation } from "./navigation";
import { Footer } from "./footer";
import { AvatarMark, Reveal, useAmbientRegion } from "./ui";
import { HeroShowcase } from "./hero-showcase";
import { BusinessTypeSelector, Capabilities, ComparisonSlider, FeatureTabs, HealthSection, MarketsSection, MonitoredAreas, ProductStory, ScanDemo, WorkflowSection } from "./interactive-sections";
import { WaitlistForm } from "./waitlist-form";

const trustIcons = [MapPin, Languages, HeartHandshake, Sparkles, LockKeyhole];

export function MarketingPage({ locale, dictionary: copy }: { locale: Locale; dictionary: Dictionary }) {
  const { ref: heroRef, ambientClass: heroAmbient } = useAmbientRegion<HTMLElement>();
  const { ref: billboardRef, ambientClass: billboardAmbient } = useAmbientRegion<HTMLDivElement>();
  return (
    <div className="site-shell" data-locale={locale}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navigation locale={locale} copy={copy.navigation} />
      <main id="main-content">
        <section ref={heroRef} className={`hero section${heroAmbient}`} id="overview">
          {/* The atmosphere runs past the hero's own box and dissolves over a wide band, so the
              page reads as one canvas rather than a hero rectangle stacked on a white section. */}
          <div className="hero__atmosphere" aria-hidden="true">
            <div className="hero-grid-field" />
            <div className="hero-orb hero-orb--one" />
            <div className="hero-orb hero-orb--two" />
            <div className="hero-orb hero-orb--three" />
          </div>
          <HeroShowcase copy={copy}>
            <Reveal className="hero__copy" onMount>
              <h1><span className="hero__lead">{copy.hero.lineOne}</span><span className="hero__emphasis">{copy.hero.emphasis}</span></h1>
              <p className="hero__body"><span>{copy.hero.eyebrow}. </span>{copy.hero.body}</p>
              <HeroWaitlist copy={copy.hero} />
              <div className="hero__actions">
                <Link
                  className="button button--secondary"
                  href="#how-it-works"
                  onClick={() => track({ name: "secondary_cta_clicked", label: copy.hero.secondary })}
                ><span><ArrowDown aria-hidden="true" /></span>{copy.hero.secondary}</Link>
              </div>
              <div className="hero__proof">
                <span className="hero__proof-avatars" aria-hidden="true"><AvatarMark index={0} /><AvatarMark index={1} /><AvatarMark index={2} /></span>
                <p>{copy.hero.socialProof}</p>
              </div>
              <div className="hero__mobile">
                <span className="hero__mobile-label">{copy.hero.mobileSoon}</span>
                {/* Placeholders until the apps ship: deliberately not links, so nothing promises
                    a download that does not exist yet. */}
                <div className="hero__stores">
                  <img src="/badges/app-store.svg" alt={copy.hero.appStore} width={120} height={40} />
                  <img src="/badges/google-play.svg" alt={copy.hero.googlePlay} width={120} height={40} />
                </div>
              </div>
              <ul className="hero__points">{copy.hero.points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul>
            </Reveal>
          </HeroShowcase>
        </section>

        <section className="trust-strip" aria-label="Launch facts">
          <Reveal className="container trust-strip__inner" variant="rail">
            {copy.trust.map((item, index) => { const Icon = trustIcons[index]; return <div key={item} style={{ "--i": index } as CSSProperties}><span><Icon aria-hidden="true" /></span><p>{item}</p></div>; })}
          </Reveal>
        </section>

        <WorkflowSection copy={copy.workflow} />
        <ScanDemo copy={copy.scan} preview={copy.preview} demo={copy.demo} />
        <HealthSection copy={copy.health} demo={copy.demo} />
        <MonitoredAreas copy={copy.monitored} />
        <FeatureTabs copy={copy.features} />
        <ProductStory copy={copy.story} />
        <ComparisonSlider copy={copy.comparison} />
        <BusinessTypeSelector copy={copy.businessTypes} preview={copy.preview} />
        <MarketsSection copy={copy.markets} />
        <Capabilities copy={copy.capabilities} locale={locale} />

        <section className="section section--cta" id="early-access">
          <div className="container">
            <div ref={billboardRef} className={`early-access${billboardAmbient}`}>
              <i className="early-access__drift" aria-hidden="true" />
              <div className="early-access__pattern" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <Reveal className="early-access__copy" variant="settle">
                <span>{copy.navigation.join}</span><h2>{copy.cta.title}</h2><p>{copy.cta.body}</p>
                <ul>{copy.cta.benefits.map((benefit) => <li key={benefit}><Check aria-hidden="true" />{benefit}</li>)}</ul>
              </Reveal>
              <Reveal className="early-access__form" variant="settle" delay={0.12}>
                <WaitlistForm locale={locale} copy={copy.form} businessTypes={copy.businessTypes.items.map((item) => item.label)} />
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} copy={copy.footer} />
      {/* Mounted here rather than in the root layout so the request is asked in
          the visitor's own language. */}
      <ConsentBanner locale={locale} copy={copy.consent} />
    </div>
  );
}

/**
 * Hero email capture. It hands the address to the full waitlist form rather than posting on its
 * own: registration requires an explicit privacy consent the hero has no room to ask for, so the
 * visitor lands on the form with their email already filled and only the consent left to give.
 * Reuses the same `prefill-waitlist` channel the footer already uses.
 */
function HeroWaitlist({ copy }: { copy: Dictionary["hero"] }) {
  const [email, setEmail] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track({ name: "hero_cta_clicked", label: copy.primary });
    track({ name: "waitlist_submitted", source: "hero" });
    window.dispatchEvent(new CustomEvent("prefill-waitlist", { detail: email }));
    document.getElementById("early-access")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <form className="hero__waitlist" onSubmit={onSubmit} data-testid="hero-waitlist">
      <label className="sr-only" htmlFor="hero-email">{copy.emailLabel}</label>
      <input
        id="hero-email"
        data-testid="hero-email"
        type="email"
        required
        autoComplete="email"
        placeholder={copy.emailPlaceholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button className="button button--primary" type="submit" data-testid="hero-waitlist-submit">
        {copy.primary}<ArrowUpRight aria-hidden="true" />
      </button>
    </form>
  );
}

