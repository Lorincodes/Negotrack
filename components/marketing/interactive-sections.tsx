"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  Activity, ArrowRight, BrainCircuit, BriefcaseBusiness, Building2, Check, CheckCircle2, ChevronDown, ClipboardCheck,
  Clock3, Eye, FileChartColumn, Gauge, Globe2, Lightbulb, LineChart as LineChartIcon, LoaderCircle, MapPin,
  MousePointer2, Play, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Store, Stethoscope, TrendingUp, Wrench,
} from "lucide-react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { capabilitiesForLocale } from "@/lib/capabilities";
import { CountUp, DemoBadge, ProductFrame, Reveal, ScoreRing, standardTrendData, TrendChart, useAmbientRegion, useInViewOnce } from "./ui";

const workflowIcons = [Search, BrainCircuit, ClipboardCheck, LineChartIcon];

/** Parses a demonstration metric string such as "92" or "4.6" so it can be counted up. */
function numericValue(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export function WorkflowSection({ copy }: { copy: Dictionary["workflow"] }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInViewOnce(lineRef, { threshold: 0.2 });
  return (
    <section className="section section--workflow" id="how-it-works">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p></Reveal>
        <div className="workflow" role="list">
          <div ref={lineRef} className="workflow__line" data-inview={lineInView ? "true" : undefined} aria-hidden="true" />
          {copy.steps.map((step, index) => {
            const Icon = workflowIcons[index];
            return (
              <Reveal key={step.title} className="workflow-step" variant="sequence" delay={index * 0.09}>
                <div role="listitem">
                  <span className="workflow-step__icon"><Icon aria-hidden="true" /></span>
                  <h3>{step.title}</h3><p>{step.body}</p>
                  <div className="workflow-step__demo" aria-hidden="true">
                    {index === 0 && <><span className="scan-line"><i /></span><em>76%</em></>}
                    {index === 1 && <><BrainCircuit /><span className="pulse-line" /></>}
                    {index === 2 && <><span className="priority-dot priority-dot--high" />High <span className="priority-dot priority-dot--medium" />Medium</>}
                    {index === 3 && <><strong>+16%</strong><ArrowRight /></>}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Uneven dwell per stage — a uniform tick reads as a fake progress bar. */
const scanStageDwell = [520, 620, 460, 560, 700, 420];
const scanStageProgress = [14, 33, 47, 64, 88, 100];

export function ScanDemo({ copy, preview, demo }: { copy: Dictionary["scan"]; preview: string; demo: string }) {
  const reduceMotion = useReducedMotion();
  const { ref: sectionRef, ambientClass } = useAmbientRegion<HTMLElement>();
  const experienceRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const inView = useInViewOnce(experienceRef, { threshold: 0.35, rootMargin: "0px 0px -10% 0px" });
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState(-1);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(() => {
    if (reduceMotion) {
      setStage(copy.stages.length - 1);
      setComplete(true);
      return;
    }
    setComplete(false);
    setStage(0);
  }, [copy.stages.length, reduceMotion]);

  // Never show an empty panel: the demonstration starts itself the first time the section is seen.
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const timer = window.setTimeout(run, reduceMotion ? 0 : 320);
    return () => window.clearTimeout(timer);
  }, [inView, reduceMotion, run]);

  useEffect(() => {
    if (stage < 0 || complete || reduceMotion) return;
    const timer = window.setTimeout(() => {
      if (stage >= copy.stages.length - 1) setComplete(true);
      else setStage((value) => value + 1);
    }, scanStageDwell[stage] ?? 520);
    return () => window.clearTimeout(timer);
  }, [complete, copy.stages.length, reduceMotion, stage]);

  function startScan() {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error("protocol");
      setError("");
      started.current = true;
      run();
    } catch {
      setError(copy.invalid);
    }
  }

  function reset() { setStage(-1); setComplete(false); setUrl(""); setError(""); }

  const announcement = complete
    ? `${copy.scanning} — 100%. ${copy.metrics[0][0]} 86. ${copy.recommendation}`
    : stage >= 0
      ? `${copy.stages[stage]} — ${scanStageProgress[stage] ?? 0}%`
      : "";

  return (
    <section ref={sectionRef} className={`section section--scan${ambientClass}`} id="scan-preview">
      <ScanAmbient />
      <div className="container scan-layout">
        <Reveal className="scan-copy" variant="left">
          <h2>{copy.title}</h2><p>{copy.body}</p>
          <div className="scan-input-shell">
            <Globe2 aria-hidden="true" />
            <input data-testid="scan-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder={copy.placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? "scan-error" : undefined} onKeyDown={(event) => event.key === "Enter" && startScan()} />
            <button data-testid="scan-submit" type="button" onClick={startScan} disabled={stage >= 0 && !complete}>{stage >= 0 && !complete ? <LoaderCircle className="spin" aria-hidden="true" /> : <Search aria-hidden="true" />}{copy.action}</button>
          </div>
          {error && <p className="scan-error" id="scan-error" role="alert">{error}</p>}
          <p className="scan-disclaimer"><ShieldCheck aria-hidden="true" />{copy.disclaimer}</p>
        </Reveal>
        <Reveal className="scan-experience" variant="right" delay={0.08}>
          <div ref={experienceRef}>
            <ProductFrame chromeLabel={preview}>
              <div className="scan-window">
                <AnimatePresence mode="wait" initial={false}>
                  {stage < 0 ? (
                    <ScanReady key="ready" copy={copy} demo={demo} onRun={() => { started.current = true; run(); }} />
                  ) : !complete ? (
                    <ScanProgress key="progress" copy={copy} stage={stage} />
                  ) : (
                    <ScanResult key="result" copy={copy} onReset={reset} />
                  )}
                </AnimatePresence>
              </div>
            </ProductFrame>
          </div>
          <p className="sr-only" aria-live="polite">{announcement}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Two travelling signal strokes and a slow glow — the only ambient motion permitted on the dark canvas. */
function ScanAmbient() {
  return (
    <svg className="scan-signal-lines" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="scan-signal-lines__path scan-signal-lines__path--teal" d="M-40 470 C 220 380, 380 470, 600 340 S 980 190, 1240 240" />
      <path className="scan-signal-lines__path scan-signal-lines__path--blue" d="M-40 210 C 260 300, 420 150, 660 210 S 1000 400, 1240 330" />
    </svg>
  );
}

const scanMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

function ScanReady({ copy, demo, onRun }: { copy: Dictionary["scan"]; demo: string; onRun: () => void }) {
  return (
    <motion.div className="scan-idle" {...scanMotion} transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}>
      <span><Search aria-hidden="true" /></span>
      <h3>{copy.action}</h3>
      <p>{copy.stages[0]} · {copy.stages[1]} · {copy.stages[2]}</p>
      <div className="scan-idle__meta">
        <em className="product-meta product-meta--dot">{copy.lastScanned}</em>
        <em className="product-meta"><Clock3 aria-hidden="true" />{copy.nextScan}</em>
      </div>
      <button type="button" className="scan-idle__replay" onClick={onRun}><Play aria-hidden="true" />{copy.replay}</button>
      <DemoBadge>{demo}</DemoBadge>
    </motion.div>
  );
}

function ScanProgress({ copy, stage }: { copy: Dictionary["scan"]; stage: number }) {
  const progress = scanStageProgress[stage] ?? 0;
  const previous = stage > 0 ? scanStageProgress[stage - 1] : 0;
  const dwell = scanStageDwell[stage] ?? 520;
  return (
    <motion.div className="scan-progress" data-testid="scan-progress" {...scanMotion} transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}>
      <div className="scan-progress__header">
        <span><LoaderCircle className="spin" aria-hidden="true" /></span>
        {/* The percentage counts alongside the bar rather than jumping to the stage target. */}
        <div><strong>{copy.scanning}</strong><p>{copy.stages[stage]} · <CountUp key={stage} from={previous} to={progress} duration={dwell} />%</p></div>
      </div>
      <div className="scan-progress__bar"><motion.span animate={{ scaleX: progress / 100 }} initial={{ scaleX: previous / 100 }} transition={{ duration: dwell / 1000, ease: [0.16, 1, 0.3, 1] }} /></div>
      <ol>{copy.stages.map((item, index) => (
        <li key={item} className={index < stage ? "is-done" : index === stage ? "is-active" : ""}>
          {index < stage ? <Check aria-hidden="true" /> : <span>{index + 1}</span>}
          <div><strong>{item}</strong><em>{copy.stageDetails[index]}</em></div>
        </li>
      ))}</ol>
    </motion.div>
  );
}

function ScanResult({ copy, onReset }: { copy: Dictionary["scan"]; onReset: () => void }) {
  return (
    <motion.div className="scan-result" data-testid="scan-result" data-inview="true" {...scanMotion} transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}>
      <div className="scan-result__top">
        <div>
          <span><CheckCircle2 aria-hidden="true" /></span>
          <div><strong>{copy.metrics[0][0]}</strong><p>{copy.signals} · {copy.completedAt}</p></div>
        </div>
        <b><CountUp to={86} duration={900} /></b>
      </div>
      <div className="scan-result__metrics">{copy.metrics.slice(1).map(([label, value], index) => (
        <div key={label} style={{ "--i": index } as CSSProperties}><span>{label}</span><strong>{value}</strong></div>
      ))}</div>
      <div className="scan-result__recommendation"><Lightbulb aria-hidden="true" /><div><span>{copy.top}</span><strong>{copy.recommendation}</strong></div></div>
      <p className="scan-result__note"><Activity aria-hidden="true" />{copy.resultNote}</p>
      <div className="scan-result__footer">
        <em className="product-meta"><Clock3 aria-hidden="true" />{copy.nextScan}</em>
        <button type="button" onClick={onReset}>{copy.reset}<ArrowRight aria-hidden="true" /></button>
      </div>
    </motion.div>
  );
}

// Reviews are a 0–5 rating, so 4.6 is plotted as 92% of its own scale, not an invented 84.
const healthBarFill = [92, 78, 92, 72, 62];

export function HealthSection({ copy, demo }: { copy: Dictionary["health"]; demo: string }) {
  const breakdownRef = useRef<HTMLDivElement>(null);
  const breakdownInView = useInViewOnce(breakdownRef, { threshold: 0.3 });
  return (
    <section className="section section--health" id="product">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p><DemoBadge>{demo}</DemoBadge></Reveal>
        <div className="health-grid">
          <Reveal className="health-score-panel" variant="quiet">
            <span className="panel-label">{copy.score}</span>
            <ScoreRing value={86} label={copy.score} sublabel="Good" />
            <p><ArrowRight aria-hidden="true" />{copy.trending}</p>
            <small className="product-meta product-meta--dot">{copy.updated}</small>
          </Reveal>
          <Reveal className="health-breakdown" variant="quiet" delay={0.06}>
            <span className="panel-label">{copy.breakdown}</span>
            <small className="product-meta"><Activity aria-hidden="true" />{copy.changes}</small>
            <div ref={breakdownRef} data-inview={breakdownInView ? "true" : undefined}>
              {copy.metrics.map(([label, value], index) => {
                const target = numericValue(value);
                return (
                  <div className="health-metric" key={label} style={{ "--i": index, "--fill": healthBarFill[index] / 100 } as CSSProperties}>
                    <span>{label}</span>
                    <div><i /></div>
                    <strong>{target === null ? value : <CountUp to={target} decimals={value.includes(".") ? 1 : 0} duration={700} delay={260 + index * 90} active={breakdownInView} />}</strong>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal className="health-trend-panel" variant="quiet" delay={0.12}>
            <div className="panel-heading">
              <span className="panel-label">{copy.trend}</span>
              <div><i className="legend-dot legend-dot--mint" />{copy.yours}<i className="legend-dot legend-dot--violet" />{copy.average}</div>
            </div>
            <small className="product-meta">{copy.nextScan}</small>
            <TrendChart data={standardTrendData} yours={copy.yours} average={copy.average} draw />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const monitoredIcons = [Globe2, Search, Star, Building2, Gauge, Sparkles, MapPin];

export function MonitoredAreas({ copy }: { copy: Dictionary["monitored"] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = copy.items[activeIndex];
  const ActiveIcon = monitoredIcons[activeIndex];
  return (
    <section className="section section--monitored">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p></Reveal>
        <div className="area-selector" role="tablist" aria-label={copy.title}>
          {copy.items.map((item, index) => { const Icon = monitoredIcons[index]; return <button key={item.key} type="button" role="tab" aria-selected={activeIndex === index} aria-controls="area-preview" id={`area-${index}`} onClick={() => setActiveIndex(index)}><Icon aria-hidden="true" /><span>{item.label}</span></button>; })}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div className="area-preview" id="area-preview" role="tabpanel" aria-labelledby={`area-${activeIndex}`} key={active.key} initial={{ opacity: 0.72, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.6 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
            <div className="area-preview__visual"><div className="area-preview__mark"><span><ActiveIcon aria-hidden="true" /></span><div className="area-orbit" aria-hidden="true"><i /><i /><i /></div></div><strong>{active.metric}</strong></div>
            <div className="area-preview__copy">
              <span>{active.label}</span><h3>{active.title}</h3><p>{active.body}</p>
              <div className="signal-bars" aria-hidden="true"><i /><i /><i /><i /><i /></div>
              <small className="product-meta">{copy.checked}</small>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const featureIcons = [Globe2, Gauge, Building2, BrainCircuit, Star, FileChartColumn, LineChartIcon, MapPin];

export function FeatureTabs({ copy }: { copy: Dictionary["features"] }) {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const visible = selected === 0 ? copy.items : copy.items.filter((item) => item.category === copy.tabs[selected]);
  function onTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowLeft") next = (index - 1 + copy.tabs.length) % copy.tabs.length;
    if (event.key === "ArrowRight") next = (index + 1) % copy.tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = copy.tabs.length - 1;
    setSelected(next);
    document.getElementById(`feature-tab-${next}`)?.focus();
  }
  const layoutTransition = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.9 };
  return (
    <section className="section section--features" id="features">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p></Reveal>
        <div className="feature-tabs" role="tablist" aria-label={copy.title}>
          {copy.tabs.map((tab, index) => (
            <button id={`feature-tab-${index}`} data-testid={`feature-tab-${index}`} type="button" role="tab" aria-selected={selected === index} aria-controls="feature-panel" tabIndex={selected === index ? 0 : -1} key={tab} onClick={() => setSelected(index)} onKeyDown={(event) => onTabKeyDown(event, index)}>
              {selected === index && <motion.span className="tab-indicator" layoutId="feature-tab-indicator" aria-hidden="true" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }} />}
              <span className="tab-label">{tab}</span>
            </button>
          ))}
        </div>
        <LayoutGroup>
          <motion.div className="feature-grid" id="feature-panel" role="tabpanel" aria-labelledby={`feature-tab-${selected}`} layout transition={layoutTransition}>
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((item, position) => {
                const originalIndex = copy.items.indexOf(item);
                const Icon = featureIcons[originalIndex];
                return (
                  <motion.article
                    className="feature-card"
                    key={item.title}
                    layout
                    initial={{ opacity: 0, y: 8, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: Math.min(position, 4) * 0.04, layout: layoutTransition }}
                  >
                    <div className="feature-card__preview"><span><Icon aria-hidden="true" /></span>{originalIndex === 1 ? <ScoreRing value={86} label={item.title} sublabel="Good" size="small" /> : <FeatureMiniature index={originalIndex} />}</div>
                    <div className="feature-card__copy"><span>{item.category}</span><h3>{item.title}</h3><p>{item.body}</p></div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}

function FeatureMiniature({ index }: { index: number }) {
  if (index === 2) return <div className="mini-bars" aria-hidden="true"><i /><i /><i /><i /></div>;
  if (index === 4) return <div className="mini-stars" aria-hidden="true"><Star /><Star /><Star /><Star /><Star /></div>;
  if (index === 5) return <ul className="mini-list" aria-hidden="true"><li /><li /><li /></ul>;
  if (index === 6) return <div className="mini-line" aria-hidden="true"><svg viewBox="0 0 120 48"><path d="M2 43 L20 33 L37 36 L56 20 L73 25 L91 12 L118 4" /></svg></div>;
  return <div className="mini-audit" aria-hidden="true"><i /><i /><i /></div>;
}

export function ProductStory({ copy }: { copy: Dictionary["story"] }) {
  return (
    <section className="section section--story" id="story">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p></Reveal>
        <div className="story-rows">
          <article className="story-row story-row--recommendations">
            <RecommendationStory copy={copy.recommendation} />
          </article>
          <article className="story-row story-row--competitors">
            <CompetitorStory copy={copy.competitors} />
          </article>
          <article className="story-row story-row--report">
            <Reveal className="story-copy" variant="left"><h3>{copy.report.title}</h3><p>{copy.report.body}</p></Reveal>
            <Reveal className="weekly-report" variant="right" delay={0.08}><WeeklyReport copy={copy.report} /></Reveal>
          </article>
        </div>
      </div>
    </section>
  );
}

function RecommendationStory({ copy }: { copy: Dictionary["story"]["recommendation"] }) {
  const [sort, setSort] = useState<"impact" | "effort">("impact");
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const boardInView = useInViewOnce(boardRef, { threshold: 0.2 });
  const items = useMemo(
    () => sort === "impact" ? copy.items : [copy.items[0], copy.items[2], copy.items[1]],
    [copy.items, sort],
  );
  const layoutTransition = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 32 };

  return (
    <>
      <Reveal className="story-copy" variant="left">
        <h3>{copy.title}</h3><p>{copy.body}</p>
        <div className="sort-control" role="group" aria-label={copy.title}>
          {([["impact", copy.sortImpact], ["effort", copy.sortEffort]] as const).map(([key, label]) => (
            <button key={key} type="button" aria-pressed={sort === key} onClick={() => setSort(key)}>
              {sort === key && <motion.span className="tab-indicator tab-indicator--light" layoutId="sort-indicator" aria-hidden="true" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }} />}
              <span className="tab-label">{label}</span>
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal className="recommendation-board" variant="right" delay={0.08}>
        <div className="recommendation-board__meta">
          <em className="product-meta"><Check aria-hidden="true" />{copy.completed}</em>
          <em className="product-meta product-meta--dot">{copy.updated}</em>
        </div>
        <div ref={boardRef} className="recommendation-list" data-inview={boardInView ? "true" : undefined}>
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, index) => {
              const open = openTitle === item.title;
              const detailId = `recommendation-detail-${index}`;
              return (
                <motion.div
                  className={`recommendation-row${index === 0 ? " is-top" : ""}`}
                  layout
                  key={item.title}
                  style={{ "--i": index } as CSSProperties}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.3, layout: layoutTransition }}
                >
                  <span className={`recommendation-row__number priority-${index + 1}`} aria-hidden="true">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.b key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.16 }}>{index + 1}</motion.b>
                    </AnimatePresence>
                  </span>
                  <div>
                    <h4>{item.title}{index === 0 && <em className="recommendation-row__flag">{copy.topLabel}</em>}</h4>
                    <p>{item.detail}</p>
                    <em>{item.action}<ArrowRight aria-hidden="true" /></em>
                    <button type="button" className="recommendation-row__toggle" aria-expanded={open} aria-controls={detailId} onClick={() => setOpenTitle(open ? null : item.title)}>
                      {open ? copy.collapse : copy.expand}<ChevronDown aria-hidden="true" />
                    </button>
                    <div className={`recommendation-row__detail${open ? " is-open" : ""}`} id={detailId}>
                      <div><p>{item.why}</p></div>
                    </div>
                  </div>
                  <div className="recommendation-row__meta"><span>{item.impact}</span><span>{item.effort}</span></div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Reveal>
    </>
  );
}

/** Peer A starts below the example business on review volume and overtakes it once, on entry. */
const PEER_A_REVIEWS_BEFORE = 123;

function CompetitorStory({ copy }: { copy: Dictionary["story"]["competitors"] }) {
  const reduceMotion = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(boardRef, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });
  const [sort, setSort] = useState<"health" | "reviews">("health");
  const [played, setPlayed] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;
    // Reduced motion lands on the finished order immediately; otherwise the overtake plays once.
    const timer = window.setTimeout(() => { setSort("reviews"); setPlayed(true); }, reduceMotion ? 0 : 700);
    return () => window.clearTimeout(timer);
  }, [inView, reduceMotion]);

  const rows = useMemo(() => {
    const indexed = copy.rows.map((row, index) => ({ row, index }));
    if (sort === "health") return indexed;
    return [...indexed].sort((a, b) => Number(b.row[2]) - Number(a.row[2]));
  }, [copy.rows, sort]);

  const layoutTransition = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 240, damping: 30 };
  const overtaken = played && sort === "reviews";

  return (
    <>
      <Reveal className="competitor-board" variant="left">
        <div ref={boardRef}>
          <div className="competitor-board__top">
            <span><Building2 aria-hidden="true" /></span>
            <div><strong>{copy.boardTitle}</strong><p>{copy.movement}</p><small className="product-meta product-meta--dot">{copy.updated}</small></div>
          </div>
          <div className="sort-control sort-control--compact" role="group" aria-label={copy.sortLabel}>
            {([["health", copy.sortHealth], ["reviews", copy.sortReviews]] as const).map(([key, label]) => (
              <button key={key} type="button" aria-pressed={sort === key} onClick={() => setSort(key)}>
                {sort === key && <motion.span className="tab-indicator tab-indicator--light" layoutId="competitor-sort-indicator" aria-hidden="true" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }} />}
                <span className="tab-label">{label}</span>
              </button>
            ))}
          </div>
          <div className="competitor-table" role="table" aria-label={copy.title}>
            <div role="row" className="competitor-table__header">{copy.headers.map((header) => <span role="columnheader" key={header}>{header}</span>)}</div>
            {rows.map(({ row, index }) => (
              <motion.div
                role="row"
                key={row[0]}
                layout
                className={`${index === 0 ? "is-you" : ""}${index === 1 && overtaken ? " is-moved" : ""}`}
                transition={layoutTransition}
              >
                {row.map((value, cellIndex) => (
                  <span role="cell" key={`${value}-${cellIndex}`}>
                    {index === 1 && cellIndex === 2
                      ? <><CountUp from={PEER_A_REVIEWS_BEFORE} to={Number(value)} duration={700} active={played} /><i className="competitor-table__delta" data-shown={overtaken ? "true" : undefined}>+6</i></>
                      : value}
                  </span>
                ))}
              </motion.div>
            ))}
          </div>
          {/* The explanation only stands while the table is actually showing the overtake. */}
          <div className="competitor-board__change" data-shown={overtaken ? "true" : undefined} aria-live="polite">
            <p><strong>{copy.changeTitle}</strong></p>
            <p>{copy.changeBody}</p>
          </div>
        </div>
      </Reveal>
      <Reveal className="story-copy" variant="right" delay={0.08}>
        <h3>{copy.title}</h3><p>{copy.body}</p>
        <div className="story-stat"><strong><CountUp to={78} duration={900} /></strong><span>{copy.headers[3]}</span><i><ArrowRight aria-hidden="true" />+4</i></div>
      </Reveal>
    </>
  );
}

const reportIcons = [TrendingUp, Gauge, Building2, Check];

function WeeklyReport({ copy }: { copy: Dictionary["story"]["report"] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const inView = useInViewOnce(listRef, { threshold: 0.2 });
  return (
    <>
      <div className="weekly-report__header">
        <div><span>{copy.date}</span><strong>NegoTrack</strong><small className="product-meta"><Clock3 aria-hidden="true" />{copy.next}</small></div>
        <FileChartColumn aria-hidden="true" />
      </div>
      <div className="weekly-report__score">
        <ScoreRing value={86} label={copy.scoreLabel} sublabel="+4" size="small" />
        <div><span>{copy.scoreLabel}</span><strong>86 / 100</strong><p>{copy.weekDelta}</p></div>
      </div>
      <ul ref={listRef} data-inview={inView ? "true" : undefined}>
        {copy.items.map((item, index) => {
          // Icon and tint follow the event, so amber only ever marks the competitive loss.
          const ReportIcon = reportIcons[index] ?? Check;
          return (
          <li key={item} style={{ "--i": index } as CSSProperties}>
            <span className={`report-icon report-icon--${index}`}><ReportIcon aria-hidden="true" /></span>
            <span className="weekly-report__text">{item}</span>
            <small>{copy.times[index]}</small>
            <em className={`weekly-report__delta${index === 2 ? " weekly-report__delta--amber" : ""}`}>{copy.changes[index]}</em>
          </li>
          );
        })}
      </ul>
    </>
  );
}

export function ComparisonSlider({ copy }: { copy: Dictionary["comparison"] }) {
  const reduceMotion = useReducedMotion();
  const [position, setPosition] = useState(52);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(stageRef, { threshold: 0.4 });
  const hasDemoed = useRef(false);
  const touched = useRef(false);

  // One short wipe on entry so the divider explains itself, then the control is entirely the visitor's.
  useEffect(() => {
    if (!inView || reduceMotion || hasDemoed.current) return;
    hasDemoed.current = true;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      if (touched.current) return;
      const elapsed = Math.min(1, (now - start) / 900);
      const eased = 0.5 - Math.cos(elapsed * Math.PI * 2) / 2;
      setPosition(Math.round(52 + eased * 16));
      if (elapsed < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion]);

  return (
    <section className="section section--comparison">
      <div className="container comparison-layout">
        <Reveal className="comparison-copy" variant="left"><h2>{copy.title}</h2><p>{copy.body}</p><div className="comparison-legend"><span><i />{copy.traditional}</span><span><i />{copy.negotrack}</span></div></Reveal>
        <Reveal className="comparison-slider" variant="right" delay={0.08}>
          <div className="comparison-stage" ref={stageRef}>
            <div className="audit-panel"><span>{copy.traditional}</span><ul>{copy.findings.map((item) => <li key={item}><Search aria-hidden="true" />{item}</li>)}</ul></div>
            <div className="explanation-panel" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><span>{copy.negotrack}</span><div><Lightbulb aria-hidden="true" /><p>{copy.explanation}</p></div><strong>{copy.action}</strong></div>
            <div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true"><span><MousePointer2 /></span></div>
          </div>
          <label><span className="sr-only">{copy.label}</span><input data-testid="comparison-slider" type="range" min="10" max="90" value={position} onChange={(event) => { touched.current = true; setPosition(Number(event.target.value)); }} aria-valuetext={`${position}% ${copy.negotrack}`} /></label>
        </Reveal>
      </div>
    </section>
  );
}

const businessIcons = [Wrench, BriefcaseBusiness, Stethoscope, Store, ShoppingBag, Building2];

export function BusinessTypeSelector({ copy, preview }: { copy: Dictionary["businessTypes"]; preview: string }) {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const item = copy.items[selected];
  const Icon = businessIcons[selected];
  const score = numericValue(item.score);
  return (
    <section className="section section--business-types" id="business-types">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body} <span className="inline-preview">— {preview}</span></p></Reveal>
        <div className="business-selector" role="tablist" aria-label={copy.title}>
          {copy.items.map((entry, index) => {
            const TabIcon = businessIcons[index];
            return (
              <button data-testid={`business-tab-${index}`} key={entry.label} type="button" role="tab" aria-selected={selected === index} onClick={() => setSelected(index)}>
                {selected === index && <motion.span className="tab-indicator" layoutId="business-indicator" aria-hidden="true" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }} />}
                <TabIcon aria-hidden="true" /><span className="tab-label">{entry.label}</span>
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div className="business-preview" key={item.label} initial={{ opacity: 0.7, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.6 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
            <div className="business-preview__identity">
              <span><Icon aria-hidden="true" /></span>
              <div><em>{item.label}</em><h3>{item.company}</h3><p>{item.detail}</p><small className="product-meta">{copy.exampleMeta}</small></div>
            </div>
            <div className="business-preview__score"><span>{copy.scoreLabel}</span><strong>{score === null ? item.score : <CountUp to={score} duration={800} />}</strong><i>/100</i></div>
            <div className="business-preview__priority"><Lightbulb aria-hidden="true" /><div><span>{copy.priorityLabel}</span><strong>{item.priority}</strong></div><ArrowRight aria-hidden="true" /></div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export function MarketsSection({ copy }: { copy: Dictionary["markets"] }) {
  return (
    <section className="section section--markets" id="markets">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p></Reveal>
        <div className="market-panels">
          <Reveal className="market-panel market-panel--uk" variant="settle"><div className="market-panel__map" aria-hidden="true"><MapPin /><span>GB</span></div><div><span>United Kingdom</span><h3>Built for local context.</h3><ul>{copy.uk.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div></Reveal>
          <Reveal className="market-panel market-panel--es" variant="settle" delay={0.09}><div className="market-panel__map" aria-hidden="true"><MapPin /><span>ES</span></div><div><span>España</span><h3>Creado para el contexto local.</h3><ul>{copy.es.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div></Reveal>
        </div>
      </div>
    </section>
  );
}

const capabilityIcons = [Gauge, Globe2, Search, Building2, Star, MapPin, Activity, Eye, Sparkles, FileChartColumn, LineChartIcon, BriefcaseBusiness];

export function Capabilities({ copy, locale }: { copy: Dictionary["capabilities"]; locale: Locale }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(gridRef, { threshold: 0.1 });
  // Only capabilities with a real page become links; the rest stay as plain
  // cells rather than leading somewhere that says nothing.
  const documented = new Map(capabilitiesForLocale(locale).map((c) => [c.name, c.slug]));

  return (
    <section className="section section--capabilities">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2></Reveal>
        <div ref={gridRef} className="capability-grid" data-inview={inView ? "true" : undefined}>
          {copy.items.map((item, index) => {
            const Icon = capabilityIcons[index];
            const slug = documented.get(item);
            const body = (
              <><span><Icon aria-hidden="true" /></span><strong>{item}</strong>{index > 7 && <em>{copy.coming}</em>}</>
            );
            return slug ? (
              <Link key={item} href={`/${locale}/capabilities/${slug}`} style={{ "--i": index } as CSSProperties}>{body}</Link>
            ) : (
              <div key={item} style={{ "--i": index } as CSSProperties}>{body}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
