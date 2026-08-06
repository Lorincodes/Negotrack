"use client";

import { animate, AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Activity, ArrowUpRight, BarChart3, Bell, Building2, Check, Clock3, Globe2, LayoutDashboard, Lightbulb, MapPin, Search, Settings, Sparkles, Star } from "lucide-react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Fires once when the element first scrolls into range. Never un-sets, so revealed content stays revealed. */
export function useInViewOnce<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "0px 0px -8% 0px", threshold = 0 }: { rootMargin?: string; threshold?: number } = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // Without an observer, show the finished state rather than withholding content.
      const timer = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return inView;
}

/**
 * Continuous ambient loops only run while their region is on screen and the tab is visible,
 * so nothing decorative burns frames in the background.
 */
export function useAmbientRegion<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setActive(true), 0);
      return () => window.clearTimeout(timer);
    }
    let onScreen = false;
    let tabVisible = document.visibilityState === "visible";
    const sync = () => setActive(onScreen && tabVisible);
    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "120px", threshold: 0 },
    );
    observer.observe(node);
    const onVisibilityChange = () => {
      tabVisible = document.visibilityState === "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reduceMotion]);

  return { ref, ambientClass: active ? " is-ambient" : "" } as const;
}

/** Pointer-reactive tilt, capped at a degree and a half. Never attaches on touch, small screens, or reduced motion. */
function useTilt<T extends HTMLElement>(ref: RefObject<T | null>, max = 1.5) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.innerWidth < 1120) return;

    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        node.style.setProperty("--tilt-y", `${(x * max).toFixed(2)}deg`);
        node.style.setProperty("--tilt-x", `${(-y * max * 0.7).toFixed(2)}deg`);
      });
    };
    const onPointerLeave = () => {
      cancelAnimationFrame(frame);
      node.style.setProperty("--tilt-y", "0deg");
      node.style.setProperty("--tilt-x", "0deg");
    };

    node.addEventListener("pointermove", onPointerMove, { passive: true });
    node.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [max, ref, reduceMotion]);
}

/**
 * Counts to a demonstration value. The final value is what renders on the server and on first
 * paint, so the number is never missing if scripting fails, motion is reduced, or the element
 * is never scrolled into view. The count is written straight to the DOM rather than held in
 * state, so a page full of counters does not re-render once per frame.
 */
export function CountUp({
  to,
  from = 0,
  decimals = 0,
  duration = 1000,
  delay = 0,
  active = true,
}: { to: number; from?: number; decimals?: number; duration?: number; delay?: number; active?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = to.toFixed(decimals);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node || !active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    node.textContent = from.toFixed(decimals);
    const controls = animate(from, to, {
      duration: duration / 1000,
      delay: delay / 1000,
      ease: EASE_OUT,
      onUpdate: (latest) => { node.textContent = latest.toFixed(decimals); },
    });
    return () => {
      controls.stop();
      node.textContent = final;
    };
  }, [active, decimals, delay, duration, final, from, to]);

  return (
    <>
      <span ref={ref} className="count-up" aria-hidden="true">{final}</span>
      <span className="sr-only">{final}</span>
    </>
  );
}

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

/** Abstract profile marks for the hero social-proof row. No faces, no photography, no claim about a real person. */
const avatarTints = [
  ["#e8f8f3", "#8fd8c2"],
  ["#edf2ff", "#9db3f2"],
  ["#f3efff", "#b7a1ec"],
] as const;

export function AvatarMark({ index }: { index: number }) {
  const [background, figure] = avatarTints[index % avatarTints.length];
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="16" fill={background} />
      <circle cx="16" cy="12.6" r="5.2" fill={figure} />
      <path d="M4.6 30.4a11.6 11.6 0 0 1 22.8 0Z" fill={figure} />
    </svg>
  );
}

export type RevealVariant = "soft" | "left" | "right" | "quiet" | "rail" | "sequence" | "settle";

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "soft",
}: { children: ReactNode; className?: string; delay?: number; variant?: RevealVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(ref);
  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant} ${className}`}
      data-inview={inView ? "true" : undefined}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function ScoreRing({
  value,
  label,
  sublabel,
  size = "large",
  decimals = 0,
}: { value: number; label: string; sublabel: string; size?: "small" | "large"; decimals?: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(rootRef, { threshold: 0.4, rootMargin: "0px" });
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      ref={rootRef}
      className={`score-ring score-ring--${size}`}
      data-inview={inView ? "true" : undefined}
      style={{ "--ring-length": `${circumference.toFixed(2)}` } as CSSProperties}
    >
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
        <strong><CountUp to={value} decimals={decimals} duration={1200} active={inView} /></strong>
        <span>{sublabel}</span>
      </div>
    </div>
  );
}

export type TrendPoint = { label: string; business: number; average: number };

export function TrendChart({
  data,
  yours,
  average,
  compact = false,
  draw = false,
}: { data: TrendPoint[]; yours: string; average: string; compact?: boolean; draw?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(rootRef, { threshold: 0.25, rootMargin: "0px 0px -6% 0px" });
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
  // Exact polyline length, so the draw animation can be expressed as a pure CSS dash offset.
  const lengthFor = (key: "business" | "average") => data.reduce((total, entry, index) => {
    if (index === 0) return 0;
    const from = point(data[index - 1][key], index - 1);
    const to = point(entry[key], index);
    return total + Math.hypot(to.x - from.x, to.y - from.y);
  }, 0);
  const businessPath = pathFor("business");
  const averagePath = pathFor("average");
  const gridValues = [40, 60, 80, 100];

  return (
    <div
      ref={rootRef}
      className={`trend-chart${compact ? " trend-chart--compact" : ""}${draw ? " trend-chart--draw" : ""}`}
      data-inview={inView ? "true" : undefined}
      style={{
        "--length-business": lengthFor("business").toFixed(2),
        "--length-average": lengthFor("average").toFixed(2),
      } as CSSProperties}
      role="img"
      aria-label={summary}
    >
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {!compact && gridValues.map((value) => {
          const { y } = point(value, 0);
          return <g key={value}><line className="trend-chart__grid" x1={inset.left} x2={width - inset.right} y1={y} y2={y} /><text className="trend-chart__axis" x="0" y={y + 4}>{value}</text></g>;
        })}
        <path className="trend-chart__line trend-chart__line--average" d={averagePath} />
        <path className="trend-chart__line trend-chart__line--business" d={businessPath} />
        <path className="trend-chart__line trend-chart__line--highlight" d={businessPath} />
        {!compact && data.map((entry, index) => {
          const { x, y } = point(entry.business, index);
          return <circle className="trend-chart__point" cx={x} cy={y} r="3" key={entry.label} style={{ "--i": index } as CSSProperties} />;
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

/** The extra width on desktop is spent on a labelled nav rail, as a real console would have. */
const sidebarIcons = [LayoutDashboard, Globe2, Search, Star, Building2, Sparkles, MapPin, BarChart3] as const;

type DashboardCopy = {
  overview: string; greeting: string; health: string; good: string; seo: string; performance: string; reviews: string; competitor: string; ahead: string; trend: string; top: string; recommendation: string; recent: string; insightOne: string; insightTwo: string;
  live: string; lastScanned: string; nextScan: string; changes: string; completed: string; updated: string; sinceLast: string; fair: string; excellent: string; viewPlan: string; navLabel: string; settings: string; nav: readonly string[]; chips: readonly string[];
};

export type ConsolePanel = Dictionary["console"]["panels"][number];

const metricAccents = ["mint", "blue", "violet", "amber"] as const;

/** Demonstration values are strings; only the numeric ones count up. */
function metricNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

/** Bars read as a share of their own scale: 0–100 scores directly, 0–5 ratings scaled up. */
function metricFill(value: string) {
  const parsed = metricNumber(value);
  if (parsed === null) return 0.78;
  if (parsed <= 5) return Math.min(1, parsed / 5);
  return Math.min(1, parsed / 100);
}

/**
 * The console frame — chrome, sidebar and header — stays mounted across feature changes.
 * Only the metrics and body crossfade, so the product never appears to reload.
 */
export function DashboardPreview({
  copy, demoLabel, previewLabel, panel, panelIndex, panelId, labelledBy,
}: {
  copy: DashboardCopy; demoLabel: string; previewLabel: string;
  panel: ConsolePanel; panelIndex: number; panelId?: string; labelledBy?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInViewOnce(wrapRef, { threshold: 0.3, rootMargin: "0px" });
  const resolving = inView && !reduceMotion;
  // The mint sweep across the recommendation is the console's one authored punctuation mark.
  // It plays on the first view only — never again as the visitor flips between features.
  const [firstPlayOver, setFirstPlayOver] = useState(false);
  useTilt(tiltRef);

  useEffect(() => {
    if (!resolving || firstPlayOver) return;
    const timer = window.setTimeout(() => setFirstPlayOver(true), 2000);
    return () => window.clearTimeout(timer);
  }, [firstPlayOver, resolving]);

  const swap = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div ref={wrapRef} className="hero-dashboard-wrap" data-resolve={resolving ? "playing" : undefined} data-first={resolving && !firstPlayOver ? "true" : undefined}>
      <div ref={tiltRef} className="hero-dashboard-tilt">
        <ProductFrame className="hero-dashboard" chromeLabel={previewLabel}>
          <aside className="dashboard-sidebar" aria-label="Dashboard preview navigation">
            <Logo />
            <nav>
              {copy.nav.map((label, index) => {
                const Icon = sidebarIcons[index];
                return <span key={label} className={index === panelIndex ? "is-active" : ""}><Icon aria-hidden="true" /><em>{label}</em></span>;
              })}
            </nav>
            <span className="dashboard-sidebar__settings"><Settings aria-hidden="true" /><em>{copy.settings}</em></span>
          </aside>
          <div className="dashboard-main" id={panelId} role={panelId ? "tabpanel" : undefined} aria-labelledby={labelledBy} tabIndex={panelId ? 0 : undefined}>
            <header className="dashboard-header">
              <div>
                <span>{copy.greeting}</span>
                <h3>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={panel.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={swap}>{panel.title}</motion.span>
                  </AnimatePresence>
                </h3>
                <div className="dashboard-header__meta">
                  <small className="product-meta product-meta--dot">{copy.lastScanned}</small>
                  <small className="product-meta"><Clock3 aria-hidden="true" />{copy.nextScan}</small>
                </div>
              </div>
              <div className="dashboard-header__tools">
                <span>{demoLabel}</span>
                <Bell aria-hidden="true" />
              </div>
            </header>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={panel.key}
                className="dashboard-panels"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={swap}
              >
                <div className="dashboard-metrics">
                  {panel.metrics.map(([label, value, note, delta], index) => {
                    const numeric = metricNumber(value);
                    return (
                      <DashboardMetric
                        key={`${panel.key}-${label}`}
                        index={index}
                        label={label}
                        value={numeric}
                        rawValue={value}
                        decimals={value.includes(".") ? 1 : 0}
                        delta={delta}
                        note={note}
                        accent={metricAccents[index]}
                        fill={metricFill(value)}
                        since={copy.sinceLast}
                        active={inView}
                      />
                    );
                  })}
                </div>
                <div className="dashboard-body">
                  <div className="dashboard-body__main">
                    <section className="dashboard-panel dashboard-panel--trend">
                      <div className="dashboard-panel__heading"><span>{panel.mainLabel}</span><strong>{panel.mainBadge}</strong></div>
                      <small className="product-meta">{panel.mainMeta}</small>
                      {panel.rows.length === 0
                        ? <TrendChart data={trendData} yours={panel.metrics[0][0]} average="Average" compact draw />
                        : <DashboardRows rows={panel.rows} />}
                    </section>
                  </div>
                  <aside className="dashboard-body__rail">
                    <section className="dashboard-panel dashboard-panel--recommendation">
                      <span className="dashboard-panel__label">{panel.railLabel}</span>
                      <div className="recommendation-highlight"><Lightbulb aria-hidden="true" /><strong>{panel.railHeadline}</strong><ArrowUpRight aria-hidden="true" /></div>
                      <small className="product-meta"><Check aria-hidden="true" />{panel.railMeta}</small>
                      <button type="button" tabIndex={-1}>{panel.railAction}<ArrowUpRight aria-hidden="true" /></button>
                    </section>
                  </aside>
                  <div className="dashboard-strip">
                    <section className="dashboard-panel dashboard-panel--competitor" style={{ "--i": 0 } as CSSProperties}>
                      <span className="dashboard-panel__label">{panel.stripLabel}</span>
                      <strong>{panel.stripValue}</strong>
                    </section>
                    <section className="dashboard-panel dashboard-insights" style={{ "--i": 1 } as CSSProperties}>
                      <span className="dashboard-panel__label">{panel.insightsLabel}</span>
                      {panel.insights.map((insight, index) => {
                        const Icon = [Check, Sparkles, Activity][index] ?? Check;
                        return <em key={insight}><Icon aria-hidden="true" />{insight}</em>;
                      })}
                    </section>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </ProductFrame>
      </div>
    </div>
  );
}

/** The non-chart panels share one compact two-column readout. */
function DashboardRows({ rows }: { rows: readonly (readonly string[])[] }) {
  return (
    <ul className="dashboard-rows">
      {rows.map(([label, value]) => (
        <li key={label}><span>{label}</span><strong>{value}</strong></li>
      ))}
    </ul>
  );
}

function DashboardMetric({
  index, label, value, rawValue, delta, note, accent, fill, since, active, decimals = 0,
}: { index: number; label: string; value: number | null; rawValue: string; delta: string; note: string; accent: string; fill: number; since: string; active: boolean; decimals?: number }) {
  return (
    <div className={`dashboard-metric dashboard-metric--${accent}`} style={{ "--i": index, "--fill": fill } as CSSProperties}>
      <span>{label}</span>
      <div><strong>{value === null ? rawValue : <CountUp to={value} decimals={decimals} duration={900} delay={150 + index * 70} active={active} />}</strong><em>{note}</em></div>
      <small><ArrowUpRight aria-hidden="true" /> <b>{delta}</b> {since}</small>
      <div className="dashboard-metric__bar" aria-hidden="true"><i /></div>
    </div>
  );
}

export const standardTrendData = trendData;
