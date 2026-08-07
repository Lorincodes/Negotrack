"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Lightbulb, Minus, Search, TrendingDown, TrendingUp } from "lucide-react";
import type { CapabilityStory, KeywordRow } from "@/lib/capability-story";
import { CountUp, DemoBadge, Reveal } from "./ui";

/**
 * Product visuals for the long-form capability pages.
 *
 * These are built from the capability's own data rather than reusing the
 * homepage console, so an SEO page shows search positions and a reviews page
 * will show sentiment. The visuals are the argument; the prose is support.
 */

function Movement({ change }: { change: number }) {
  if (change === 0) {
    return <span className="kw__move kw__move--flat"><Minus aria-hidden="true" />held</span>;
  }
  const up = change > 0;
  return (
    <span className={`kw__move kw__move--${up ? "up" : "down"}`}>
      {up ? <TrendingUp aria-hidden="true" /> : <TrendingDown aria-hidden="true" />}
      {up ? "+" : ""}{change}
    </span>
  );
}

/** Hero console: visibility score, tracked terms, and the position table. */
export function SearchConsole({ story, caption }: { story: CapabilityStory; caption: string }) {
  const { hero } = story;
  return (
    <div className="story-console">
      <div className="story-console__glow" aria-hidden="true" />
      <div className="story-console__frame">
        <div className="story-console__chrome" aria-hidden="true">
          <i /><i /><i />
          <span>app.negotrack.com</span>
        </div>

        <div className="story-console__body">
          <div className="story-console__stats">
            <div className="story-stat story-stat--lead">
              <span>{hero.scoreLabel}</span>
              <strong><CountUp to={hero.score} /></strong>
              <em>{hero.scoreCaption}</em>
            </div>
            <div className="story-stat">
              <span>{hero.trackedLabel}</span>
              <strong><CountUp to={hero.tracked} /></strong>
            </div>
            <div className="story-stat">
              <span>{hero.indexedLabel}</span>
              <strong className="story-stat__text">{hero.indexed}</strong>
            </div>
          </div>

          <div className="story-table">
            <div className="story-table__head">
              <h3>{hero.tableTitle}</h3>
              <span>{hero.tableMeta}</span>
            </div>
            {hero.rows.map((row, index) => (
              <div key={row.term} className="kw" style={{ "--i": index } as CSSProperties}>
                <Search className="kw__icon" aria-hidden="true" />
                <span className="kw__term">{row.term}</span>
                <Movement change={row.change} />
                <span className="kw__pos">{row.position}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating signals, aria-hidden: decoration that restates on-screen data. */}
      <span className="story-badge story-badge--one" aria-hidden="true">
        <i><TrendingUp /></i>
        <span><strong>{hero.badgeOne.title}</strong><em>{hero.badgeOne.detail}</em></span>
      </span>
      <span className="story-badge story-badge--two" aria-hidden="true">
        <i><Check /></i>
        <span><strong>{hero.badgeTwo.title}</strong><em>{hero.badgeTwo.detail}</em></span>
      </span>

      <p className="story-console__caption"><DemoBadge>{caption}</DemoBadge></p>
    </div>
  );
}

/** Benefit one: the visibility trend, drawn on scroll. */
export function TrendPanel({ title, meta, series }: { title: string; meta: string; series: number[] }) {
  const reduce = useReducedMotion();
  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = Math.max(1, max - min);
  const points = series.map((value, index) => {
    const x = (index / (series.length - 1)) * 100;
    const y = 100 - ((value - min) / span) * 78 - 11;
    return `${x},${y}`;
  });
  const path = `M ${points.join(" L ")}`;

  return (
    <div className="story-panel">
      <div className="story-panel__head">
        <h3>{title}</h3>
        <strong>{series[series.length - 1]}</strong>
      </div>
      <svg className="story-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`${title}: ${meta}`}>
        <defs>
          <linearGradient id="story-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--green)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} className="story-chart__grid" />)}
        <motion.path
          d={`${path} L 100,100 L 0,100 Z`}
          fill="url(#story-fill)"
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        />
        <motion.path
          d={path}
          className="story-chart__line"
          initial={reduce ? undefined : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <p className="story-panel__meta">{meta}</p>
    </div>
  );
}

/** Benefit two: term, page and the gap where no page exists. */
export function PageMatchPanel({ title, rows, gapLabel }: { title: string; rows: KeywordRow[]; gapLabel: string }) {
  return (
    <div className="story-panel">
      <div className="story-panel__head"><h3>{title}</h3></div>
      <div className="match-list">
        {rows.map((row, index) => (
          <Reveal key={row.term} className="match" variant="quiet" delay={index * 0.06}>
            <div className="match__top">
              <span className="match__term">{row.term}</span>
              <span className="match__pos">{row.position}</span>
            </div>
            {row.page ? (
              <code className="match__page">{row.page}</code>
            ) : (
              <span className="match__gap"><Lightbulb aria-hidden="true" />{gapLabel}</span>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** The dark moment: one large recommendation. */
export function InsightMoment({ story }: { story: CapabilityStory }) {
  const { insight } = story;
  return (
    <section className="story-insight">
      <i className="story-insight__drift" aria-hidden="true" />
      <div className="container story-insight__inner">
        <Reveal variant="settle">
          <h2>{insight.heading}</h2>
        </Reveal>
        <Reveal className="insight-card" variant="settle" delay={0.1}>
          <span className="insight-card__label"><i /> {insight.label}</span>
          <p className="insight-card__term">{insight.term}</p>
          <div className="insight-card__meta">
            <span>{insight.position}</span>
            <span>{insight.trend}</span>
          </div>
          <div className="insight-card__action">
            <span>{insight.actionLabel}</span>
            <p>{insight.action}</p>
          </div>
          <div className="insight-card__scores">
            <div><span>{insight.impactLabel}</span><strong>{insight.impact}</strong></div>
            <div><span>{insight.effortLabel}</span><strong>{insight.effort}</strong></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Interactive industry selector; choosing one swaps the example. */
export function IndustrySwitcher({ story }: { story: CapabilityStory }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const item = story.industries.items[active];

  return (
    <div className="industry">
      <div className="industry__tabs" role="tablist" aria-label={story.industries.heading}>
        {story.industries.items.map((entry, index) => (
          <button
            key={entry.key}
            role="tab"
            type="button"
            aria-selected={index === active}
            className={`industry__tab${index === active ? " is-active" : ""}`}
            onClick={() => setActive(index)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="industry__panel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.key}
            initial={reduce ? undefined : { opacity: 0.4, y: 8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0.4, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="industry__content"
          >
            <div className="industry__metric">
              <strong>{item.metric}</strong>
              <span>{item.metricLabel}</span>
            </div>
            <div className="industry__copy">
              <h3>{item.headline}</h3>
              <p>{item.detail}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Before / after, as two opposed columns rather than a table. */
export function Comparison({ story }: { story: CapabilityStory }) {
  const { comparison } = story;
  return (
    <div className="compare">
      <Reveal className="compare__side compare__side--before" variant="left">
        <span className="compare__label">{comparison.beforeLabel}</span>
        <ul>{comparison.before.map((line) => <li key={line}>{line}</li>)}</ul>
      </Reveal>
      <Reveal className="compare__side compare__side--after" variant="right">
        <span className="compare__label">{comparison.afterLabel}</span>
        <ul>{comparison.after.map((line) => <li key={line}><Check aria-hidden="true" />{line}</li>)}</ul>
      </Reveal>
    </div>
  );
}

/** Outcomes: large numerals, generous space, no cards. */
export function Outcomes({ story }: { story: CapabilityStory }) {
  return (
    <Reveal className="outcomes" variant="rail">
      {story.outcomes.items.map((outcome, index) => (
        <div key={outcome.number} className="outcome" style={{ "--i": index } as CSSProperties}>
          <span>{outcome.number}</span>
          <p>{outcome.text}</p>
        </div>
      ))}
    </Reveal>
  );
}

/** Related capabilities as a snapping horizontal rail. */
export function RelatedRail({
  items, locale, label,
}: { items: { slug: string; title: string; description: string }[]; locale: string; label: string }) {
  return (
    <div className="rail" role="region" aria-label={label}>
      {items.map((item) => (
        <a key={item.slug} className="rail__card" href={`/${locale}/capabilities/${item.slug}`}>
          <span className="rail__mark" aria-hidden="true" />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <span className="rail__go" aria-hidden="true"><ArrowUpRight /></span>
        </a>
      ))}
    </div>
  );
}
