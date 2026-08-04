"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Globe2, HeartHandshake, Languages, LockKeyhole, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Navigation } from "./navigation";
import { DashboardPreview, Logo, Reveal } from "./ui";
import { BusinessTypeSelector, Capabilities, ComparisonSlider, FeatureTabs, HealthSection, MarketsSection, MonitoredAreas, ProductStory, ScanDemo, WorkflowSection } from "./interactive-sections";
import { WaitlistForm } from "./waitlist-form";

const trustIcons = [MapPin, Languages, HeartHandshake, Sparkles, LockKeyhole];

export function MarketingPage({ locale, dictionary: copy }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navigation locale={locale} copy={copy.navigation} />
      <main id="main-content">
        <section className="hero section" id="overview">
          <div className="hero-orb hero-orb--one" aria-hidden="true" /><div className="hero-orb hero-orb--two" aria-hidden="true" />
          <div className="container hero__grid">
            <Reveal className="hero__copy">
              <h1><span className="hero__lead">{copy.hero.lineOne}</span><span className="hero__emphasis">{copy.hero.emphasis}</span></h1>
              <p className="hero__body"><span>{copy.hero.eyebrow}. </span>{copy.hero.body}</p>
              <div className="hero__actions">
                <Link className="button button--primary" href="#early-access">{copy.hero.primary}<ArrowUpRight aria-hidden="true" /></Link>
                <Link className="button button--secondary" href="#how-it-works"><span><ArrowDown aria-hidden="true" /></span>{copy.hero.secondary}</Link>
              </div>
              <p className="hero__launch"><Globe2 aria-hidden="true" />{copy.hero.note}</p>
              <ul className="hero__points">{copy.hero.points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul>
            </Reveal>
            <div className="hero__visual">
              <DashboardPreview copy={copy.dashboard} demoLabel={copy.demo} previewLabel={copy.preview} />
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Launch facts">
          <div className="container trust-strip__inner">
            {copy.trust.map((item, index) => { const Icon = trustIcons[index]; return <div key={item}><span><Icon aria-hidden="true" /></span><p>{item}</p></div>; })}
          </div>
        </section>

        <WorkflowSection copy={copy.workflow} />
        <ScanDemo copy={copy.scan} preview={copy.preview} />
        <HealthSection copy={copy.health} demo={copy.demo} />
        <MonitoredAreas copy={copy.monitored} />
        <FeatureTabs copy={copy.features} />
        <ProductStory copy={copy.story} />
        <ComparisonSlider copy={copy.comparison} />
        <BusinessTypeSelector copy={copy.businessTypes} preview={copy.preview} />
        <MarketsSection copy={copy.markets} />
        <Capabilities copy={copy.capabilities} />

        <section className="section section--cta" id="early-access">
          <div className="container">
            <div className="early-access">
              <div className="early-access__pattern" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <Reveal className="early-access__copy">
                <span>{copy.navigation.join}</span><h2>{copy.cta.title}</h2><p>{copy.cta.body}</p>
                <ul>{copy.cta.benefits.map((benefit) => <li key={benefit}><Check aria-hidden="true" />{benefit}</li>)}</ul>
              </Reveal>
              <Reveal className="early-access__form" delay={0.08}>
                <WaitlistForm locale={locale} copy={copy.form} businessTypes={copy.businessTypes.items.map((item) => item.label)} />
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} copy={copy.footer} />
    </div>
  );
}

function Footer({ locale, copy }: { locale: Locale; copy: Dictionary["footer"] }) {
  const [email, setEmail] = useState("");
  function forwardEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("prefill-waitlist", { detail: email }));
    document.getElementById("early-access")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  const groups = [
    { title: copy.product, links: [[copy.links.overview, "#overview"], [copy.links.features, "#features"], [copy.links.how, "#how-it-works"], [copy.links.early, "#early-access"]] },
    { title: copy.solutions, links: [[copy.links.small, "#business-types"], [copy.links.agencies, "#business-types"], [copy.links.local, "#markets"], [copy.links.uk, "#markets"], [copy.links.spain, "#markets"]] },
    { title: copy.resources, links: [[copy.links.blog, `/${locale}/blog`], [copy.links.guides, `/${locale}/guides`], [copy.links.help, `/${locale}/help`], [copy.links.status, `/${locale}/status`]] },
    { title: copy.company, links: [[copy.links.about, `/${locale}/about`], [copy.links.contact, `/${locale}/contact`], [copy.links.privacy, `/${locale}/privacy`], [copy.links.terms, `/${locale}/terms`]] },
  ];
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand"><Logo /><p>{copy.summary}</p><span><ShieldCheck aria-hidden="true" />Private beta · UK & Spain</span></div>
        {groups.map((group) => <div className="footer-group" key={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>)}
        <div className="footer-updates"><h3>{copy.stay}</h3><p>{copy.stayBody}</p><form onSubmit={forwardEmail}><label className="sr-only" htmlFor="footer-email">{copy.email}</label><input id="footer-email" type="email" required placeholder={copy.email} value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit" aria-label={copy.stay}><ArrowRight aria-hidden="true" /></button></form></div>
      </div>
      <div className="container site-footer__bottom"><p>{copy.rights}</p><p>Understand. Improve. Grow.</p></div>
    </footer>
  );
}
