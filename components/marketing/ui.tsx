"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowUpRight, BarChart3, Bell, Building2, Check, Gauge, Globe2, LayoutDashboard, Lightbulb, MapPin, Search, Settings, Sparkles, Star } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className={`logo-wordmark${inverted ? " logo-wordmark--inverted" : ""}`} aria-label="NegoTrack temporary text logo">
      Nego<span>Track</span>
    </span>
  );
}

export function DemoBadge({ children }: { children: ReactNode }) {
  return <span className="demo-badge"><span aria-hidden="true" />{children}</span>;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

export function ScoreRing({ value, label, sublabel, size = "large" }: { value: number; label: string; sublabel: string; size?: "small" | "large" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!isInView || reduceMotion) return;
    const baseline = Math.max(0, value - 8);
    const controls = animate(baseline, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, reduceMotion, value]);

  return (
    <div ref={rootRef} className={`score-ring score-ring--${size}`}>
      <svg viewBox="0 0 128 128" role="img" aria-label={`${label}: ${value} out of 100`}>
        <circle className="score-ring__track" cx="64" cy="64" r={radius} />
        <circle
          className="score-ring__value"
          cx="64"
          cy="64"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div className="score-ring__copy" aria-hidden="true">
        <strong>{reduceMotion ? value : display}</strong>
        <span>{sublabel}</span>
      </div>
    </div>
  );
}

export type TrendPoint = { label: string; business: number; average: number };

export function TrendChart({ data, yours, average, compact = false }: { data: TrendPoint[]; yours: string; average: string; compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const summary = `${yours} moves from ${data[0]?.business ?? 0} to ${data.at(-1)?.business ?? 0}; ${average} moves from ${data[0]?.average ?? 0} to ${data.at(-1)?.average ?? 0}.`;
  const width = compact ? 360 : 520;
  const height = compact ? 138 : 230;
  const inset = { top: 12, right: 12, bottom: compact ? 8 : 30, left: compact ? 8 : 34 };
  const plotWidth = width - inset.left - inset.right;
  const plotHeight = height - inset.top - inset.bottom;
  const point = (value: number, index: number) => ({
    x: inset.left + (plotWidth * index) / Math.max(1, data.length - 1),
    y: inset.top + ((100 - value) / 60) * plotHeight,
  });
  const pathFor = (key: "business" | "average") => data.map((entry, index) => {
    const { x, y } = point(entry[key], index);
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
  const businessPath = pathFor("business");
  const averagePath = pathFor("average");
  const gridValues = [40, 60, 80, 100];

  return (
    <div className={`trend-chart${compact ? " trend-chart--compact" : ""}`} role="img" aria-label={summary}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {!compact && gridValues.map((value) => {
          const { y } = point(value, 0);
          return <g key={value}><line className="trend-chart__grid" x1={inset.left} x2={width - inset.right} y1={y} y2={y} /><text className="trend-chart__axis" x="0" y={y + 4}>{value}</text></g>;
        })}
        <path className="trend-chart__line trend-chart__line--average" d={averagePath} />
        <path className="trend-chart__line trend-chart__line--business" d={businessPath} />
        <motion.path
          className="trend-chart__line trend-chart__line--highlight"
          d={businessPath}
          initial={reduceMotion ? false : { pathLength: 0.78, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
        {!compact && data.map((entry, index) => {
          const { x, y } = point(entry.business, index);
          return <circle className="trend-chart__point" cx={x} cy={y} r="3" key={entry.label} />;
        })}
        {!compact && data.filter((_, index) => index % 2 === 0 || index === data.length - 1).map((entry) => {
          const index = data.indexOf(entry);
          const { x } = point(entry.business, index);
          return <text className="trend-chart__label" x={x} y={height - 5} textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"} key={entry.label}>{entry.label.replace("May ", "")}</text>;
        })}
      </svg>
    </div>
  );
}

export function ProductFrame({ children, className = "", chromeLabel }: { children: ReactNode; className?: string; chromeLabel?: string }) {
  return (
    <div className={`product-frame ${className}`}>
      <div className="product-frame__chrome" aria-hidden="true">
        <span /><span /><span />
        <div className="product-frame__address">app.negotrack.com</div>
        {chromeLabel && <em className="product-frame__label">{chromeLabel}</em>}
      </div>
      {children}
    </div>
  );
}

const trendData: TrendPoint[] = [
  { label: "May 02", business: 58, average: 48 },
  { label: "May 06", business: 63, average: 51 },
  { label: "May 10", business: 59, average: 54 },
  { label: "May 14", business: 69, average: 57 },
  { label: "May 18", business: 66, average: 60 },
  { label: "May 22", business: 78, average: 62 },
  { label: "May 26", business: 75, average: 65 },
  { label: "May 30", business: 86, average: 67 },
];

type DashboardCopy = {
  overview: string; greeting: string; health: string; good: string; seo: string; performance: string; reviews: string; competitor: string; ahead: string; trend: string; top: string; recommendation: string; recent: string; insightOne: string; insightTwo: string;
};

export function DashboardPreview({ copy, demoLabel, previewLabel }: { copy: DashboardCopy; demoLabel: string; previewLabel: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="hero-dashboard-wrap"
      initial={reduceMotion ? false : { y: 18, rotateX: 2 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <ProductFrame className="hero-dashboard" chromeLabel={previewLabel}>
        <aside className="dashboard-sidebar" aria-label="Dashboard preview navigation">
          <Logo />
          <nav>
            {[LayoutDashboard, Gauge, Globe2, Search, Star, Building2, MapPin, BarChart3].map((Icon, index) => (
              <span key={index} className={index === 0 ? "is-active" : ""}><Icon aria-hidden="true" />{index === 0 && <em>{copy.overview}</em>}</span>
            ))}
          </nav>
          <span className="dashboard-sidebar__settings"><Settings aria-hidden="true" /></span>
        </aside>
        <div className="dashboard-main">
          <header className="dashboard-header">
            <div><span>{copy.greeting}</span><h3>{copy.overview}</h3></div>
            <div className="dashboard-header__tools"><span>{demoLabel}</span><Bell aria-hidden="true" /></div>
          </header>
          <div className="dashboard-metrics">
            <DashboardMetric label={copy.health} value="86" note={copy.good} accent="mint" />
            <DashboardMetric label={copy.seo} value="78" note="Fair" accent="blue" />
            <DashboardMetric label={copy.performance} value="92" note="Excellent" accent="violet" />
            <DashboardMetric label={copy.reviews} value="4.6" note="★★★★★" accent="amber" />
          </div>
          <div className="dashboard-grid">
            <section className="dashboard-panel dashboard-panel--trend">
              <div className="dashboard-panel__heading"><span>{copy.trend}</span><strong>+6</strong></div>
              <TrendChart data={trendData} yours={copy.health} average="Average" compact />
            </section>
            <section className="dashboard-panel dashboard-panel--recommendation">
              <span className="dashboard-panel__label">{copy.top}</span>
              <div className="recommendation-highlight"><Lightbulb aria-hidden="true" /><strong>{copy.recommendation}</strong><ArrowUpRight aria-hidden="true" /></div>
              <button type="button" tabIndex={-1}>{copy.overview}<ArrowUpRight aria-hidden="true" /></button>
            </section>
          </div>
          <div className="dashboard-lower">
            <div><span>{copy.competitor}</span><strong>{copy.ahead}</strong></div>
            <div className="dashboard-insights"><span>{copy.recent}</span><em><Check aria-hidden="true" />{copy.insightOne}</em><em><Sparkles aria-hidden="true" />{copy.insightTwo}</em></div>
          </div>
        </div>
      </ProductFrame>
    </motion.div>
  );
}

function DashboardMetric({ label, value, note, accent }: { label: string; value: string; note: string; accent: string }) {
  return (
    <div className={`dashboard-metric dashboard-metric--${accent}`}>
      <span>{label}</span>
      <div><strong>{value}</strong><em>{note}</em></div>
      <small><ArrowUpRight aria-hidden="true" /> vs last week</small>
    </div>
  );
}

export const standardTrendData = trendData;
