"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  Activity, ArrowRight, BrainCircuit, BriefcaseBusiness, Building2, Check, CheckCircle2, ClipboardCheck,
  Eye, FileChartColumn, Gauge, Globe2, Lightbulb, LineChart as LineChartIcon, LoaderCircle, MapPin,
  MousePointer2, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Store, Stethoscope, Wrench,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { DemoBadge, ProductFrame, Reveal, ScoreRing, standardTrendData, TrendChart } from "./ui";

const workflowIcons = [Search, BrainCircuit, ClipboardCheck, LineChartIcon];

export function WorkflowSection({ copy }: { copy: Dictionary["workflow"] }) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="section section--workflow" id="how-it-works">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p></Reveal>
        <div className="workflow" role="list">
          <motion.div className="workflow__line" aria-hidden="true" initial={false} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }} />
          {copy.steps.map((step, index) => {
            const Icon = workflowIcons[index];
            return (
              <Reveal key={step.title} className="workflow-step" delay={index * 0.06}>
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

export function ScanDemo({ copy, preview }: { copy: Dictionary["scan"]; preview: string }) {
  const reduceMotion = useReducedMotion();
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState(-1);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (stage < 0 || complete) return;
    if (reduceMotion) return;
    const timer = window.setTimeout(() => {
      if (stage >= copy.stages.length - 1) setComplete(true);
      else setStage((value) => value + 1);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [complete, copy.stages.length, reduceMotion, stage]);

  function startScan() {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error("protocol");
      setError("");
      if (reduceMotion) {
        setStage(copy.stages.length - 1);
        setComplete(true);
      } else {
        setComplete(false);
        setStage(0);
      }
    } catch {
      setError(copy.invalid);
    }
  }

  function reset() { setStage(-1); setComplete(false); setUrl(""); setError(""); }

  return (
    <section className="section section--scan" id="scan-preview">
      <div className="container scan-layout">
        <Reveal className="scan-copy">
          <h2>{copy.title}</h2><p>{copy.body}</p>
          <div className="scan-input-shell">
            <Globe2 aria-hidden="true" />
            <input data-testid="scan-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder={copy.placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? "scan-error" : undefined} onKeyDown={(event) => event.key === "Enter" && startScan()} />
            <button data-testid="scan-submit" type="button" onClick={startScan} disabled={stage >= 0 && !complete}>{stage >= 0 && !complete ? <LoaderCircle className="spin" aria-hidden="true" /> : <Search aria-hidden="true" />}{copy.action}</button>
          </div>
          {error && <p className="scan-error" id="scan-error" role="alert">{error}</p>}
          <p className="scan-disclaimer"><ShieldCheck aria-hidden="true" />{copy.body.split(". ").at(-1)}</p>
        </Reveal>
        <Reveal className="scan-experience" delay={0.08}>
          <ProductFrame chromeLabel={preview}>
            <div className="scan-window" aria-live="polite">
              {stage < 0 ? <ScanIdle copy={copy} /> : !complete ? <ScanProgress copy={copy} stage={stage} /> : <ScanResult copy={copy} onReset={reset} />}
            </div>
          </ProductFrame>
        </Reveal>
      </div>
    </section>
  );
}

function ScanIdle({ copy }: { copy: Dictionary["scan"] }) {
  return <div className="scan-idle"><span><Search aria-hidden="true" /></span><h3>{copy.action}</h3><p>{copy.stages[0]} · {copy.stages[1]} · {copy.stages[2]}</p></div>;
}

function ScanProgress({ copy, stage }: { copy: Dictionary["scan"]; stage: number }) {
  const progress = Math.round(((stage + 1) / copy.stages.length) * 100);
  return (
    <div className="scan-progress" data-testid="scan-progress">
      <div className="scan-progress__header"><span><LoaderCircle className="spin" aria-hidden="true" /></span><div><strong>{copy.scanning}</strong><p>{progress}%</p></div></div>
      <div className="scan-progress__bar"><motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} /></div>
      <ol>{copy.stages.map((item, index) => <li key={item} className={index < stage ? "is-done" : index === stage ? "is-active" : ""}>{index < stage ? <Check aria-hidden="true" /> : <span>{index + 1}</span>}{item}</li>)}</ol>
    </div>
  );
}

function ScanResult({ copy, onReset }: { copy: Dictionary["scan"]; onReset: () => void }) {
  return (
    <motion.div className="scan-result" data-testid="scan-result" initial={{ opacity: 0.7, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="scan-result__top"><div><span><CheckCircle2 aria-hidden="true" /></span><div><strong>{copy.metrics[0][0]}</strong><p>{copy.recommendation}</p></div></div><b>86</b></div>
      <div className="scan-result__metrics">{copy.metrics.slice(1).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className="scan-result__recommendation"><Lightbulb aria-hidden="true" /><div><span>{copy.top}</span><strong>{copy.recommendation}</strong></div></div>
      <button type="button" onClick={onReset}>{copy.reset}<ArrowRight aria-hidden="true" /></button>
    </motion.div>
  );
}

export function HealthSection({ copy, demo }: { copy: Dictionary["health"]; demo: string }) {
  return (
    <section className="section section--health" id="product">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p><DemoBadge>{demo}</DemoBadge></Reveal>
        <div className="health-grid">
          <Reveal className="health-score-panel"><span className="panel-label">{copy.score}</span><ScoreRing value={86} label={copy.score} sublabel="Good" /><p><ArrowRight aria-hidden="true" />{copy.trending}</p></Reveal>
          <Reveal className="health-breakdown" delay={0.06}><span className="panel-label">{copy.breakdown}</span><div>{copy.metrics.map(([label, value], index) => <div className="health-metric" key={label}><span>{label}</span><div><i style={{ width: `${[92, 78, 84, 72, 62][index]}%` }} /></div><strong>{value}</strong></div>)}</div></Reveal>
          <Reveal className="health-trend-panel" delay={0.12}><div className="panel-heading"><span className="panel-label">{copy.trend}</span><div><i className="legend-dot legend-dot--mint" />{copy.yours}<i className="legend-dot legend-dot--violet" />{copy.average}</div></div><TrendChart data={standardTrendData} yours={copy.yours} average={copy.average} /></Reveal>
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
        <AnimatePresence mode="wait">
          <motion.div className="area-preview" id="area-preview" role="tabpanel" aria-labelledby={`area-${activeIndex}`} key={active.key} initial={{ opacity: 0.72, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.6 }} transition={{ duration: 0.26 }}>
            <div className="area-preview__visual"><span><ActiveIcon aria-hidden="true" /></span><div className="area-orbit" aria-hidden="true"><i /><i /><i /></div><strong>{active.metric}</strong></div>
            <div className="area-preview__copy"><span>{active.label}</span><h3>{active.title}</h3><p>{active.body}</p><div className="signal-bars" aria-hidden="true"><i /><i /><i /><i /><i /></div></div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const featureIcons = [Globe2, Gauge, Building2, BrainCircuit, Star, FileChartColumn, LineChartIcon, MapPin];

export function FeatureTabs({ copy }: { copy: Dictionary["features"] }) {
  const [selected, setSelected] = useState(0);
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
  return (
    <section className="section section--features" id="features">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p></Reveal>
        <div className="feature-tabs" role="tablist" aria-label={copy.title}>{copy.tabs.map((tab, index) => <button id={`feature-tab-${index}`} data-testid={`feature-tab-${index}`} type="button" role="tab" aria-selected={selected === index} aria-controls="feature-panel" tabIndex={selected === index ? 0 : -1} key={tab} onClick={() => setSelected(index)} onKeyDown={(event) => onTabKeyDown(event, index)}>{tab}</button>)}</div>
        <LayoutGroup><motion.div className="feature-grid" id="feature-panel" role="tabpanel" aria-labelledby={`feature-tab-${selected}`} layout>{visible.map((item) => { const originalIndex = copy.items.indexOf(item); const Icon = featureIcons[originalIndex]; return <motion.article className="feature-card" key={item.title} layout initial={{ opacity: 0.62, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}><div className="feature-card__preview"><span><Icon aria-hidden="true" /></span>{originalIndex === 1 ? <ScoreRing value={86} label={item.title} sublabel="Good" size="small" /> : <FeatureMiniature index={originalIndex} />}</div><div className="feature-card__copy"><span>{item.category}</span><h3>{item.title}</h3><p>{item.body}</p></div></motion.article>; })}</motion.div></LayoutGroup>
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
  const [sort, setSort] = useState<"impact" | "effort">("impact");
  const items = useMemo(() => sort === "impact" ? copy.recommendation.items : [copy.recommendation.items[0], copy.recommendation.items[2], copy.recommendation.items[1]], [copy.recommendation.items, sort]);
  return (
    <section className="section section--story" id="story">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body}</p></Reveal>
        <div className="story-rows">
          <article className="story-row story-row--recommendations">
            <Reveal className="story-copy"><h3>{copy.recommendation.title}</h3><p>{copy.recommendation.body}</p><div className="sort-control" aria-label="Recommendation order"><button type="button" aria-pressed={sort === "impact"} onClick={() => setSort("impact")}>{copy.recommendation.sortImpact}</button><button type="button" aria-pressed={sort === "effort"} onClick={() => setSort("effort")}>{copy.recommendation.sortEffort}</button></div></Reveal>
            <Reveal className="recommendation-board" delay={0.08}><AnimatePresence mode="popLayout">{items.map((item, index) => <motion.div className="recommendation-row" layout key={item.title} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}><span className={`recommendation-row__number priority-${index + 1}`}>{index + 1}</span><div><h4>{item.title}</h4><p>{item.detail}</p><em>{item.action}<ArrowRight aria-hidden="true" /></em></div><div className="recommendation-row__meta"><span>{item.impact}</span><span>{item.effort}</span></div></motion.div>)}</AnimatePresence></Reveal>
          </article>
          <article className="story-row story-row--competitors">
            <Reveal className="competitor-board"><div className="competitor-board__top"><span><Building2 aria-hidden="true" /></span><div><strong>{copy.competitors.headers[0]}</strong><p>{copy.competitors.body}</p></div></div><div className="competitor-table" role="table" aria-label={copy.competitors.title}><div role="row" className="competitor-table__header">{copy.competitors.headers.map((header) => <span role="columnheader" key={header}>{header}</span>)}</div>{copy.competitors.rows.map((row, rowIndex) => <div role="row" key={row[0]} className={rowIndex === 0 ? "is-you" : ""}>{row.map((value, index) => <span role="cell" key={`${value}-${index}`}>{value}</span>)}</div>)}</div></Reveal>
            <Reveal className="story-copy" delay={0.08}><h3>{copy.competitors.title}</h3><p>{copy.competitors.body}</p><div className="story-stat"><strong>62%</strong><span>{copy.competitors.headers[3]}</span><i><ArrowRight aria-hidden="true" />+4</i></div></Reveal>
          </article>
          <article className="story-row story-row--report">
            <Reveal className="story-copy"><h3>{copy.report.title}</h3><p>{copy.report.body}</p></Reveal>
            <Reveal className="weekly-report" delay={0.08}><div className="weekly-report__header"><div><span>{copy.report.date}</span><strong>NegoTrack</strong></div><FileChartColumn aria-hidden="true" /></div><div className="weekly-report__score"><ScoreRing value={86} label="Business Health" sublabel="+4" size="small" /><div><span>Business Health</span><strong>86 / 100</strong><p>+4 this week</p></div></div><ul>{copy.report.items.map((item, index) => <li key={item}><span className={`report-icon report-icon--${index}`}><Check aria-hidden="true" /></span>{item}</li>)}</ul></Reveal>
          </article>
        </div>
      </div>
    </section>
  );
}

export function ComparisonSlider({ copy }: { copy: Dictionary["comparison"] }) {
  const [position, setPosition] = useState(52);
  return (
    <section className="section section--comparison">
      <div className="container comparison-layout">
        <Reveal className="comparison-copy"><h2>{copy.title}</h2><p>{copy.body}</p><div className="comparison-legend"><span><i />{copy.traditional}</span><span><i />{copy.negotrack}</span></div></Reveal>
        <Reveal className="comparison-slider" delay={0.08}>
          <div className="comparison-stage">
            <div className="audit-panel"><span>{copy.traditional}</span><ul>{copy.findings.map((item) => <li key={item}><Search aria-hidden="true" />{item}</li>)}</ul></div>
            <div className="explanation-panel" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><span>{copy.negotrack}</span><div><Lightbulb aria-hidden="true" /><p>{copy.explanation}</p></div><strong>{copy.action}</strong></div>
            <div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true"><span><MousePointer2 /></span></div>
          </div>
          <label><span className="sr-only">{copy.label}</span><input data-testid="comparison-slider" type="range" min="10" max="90" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-valuetext={`${position}% ${copy.negotrack}`} /></label>
        </Reveal>
      </div>
    </section>
  );
}

const businessIcons = [Wrench, BriefcaseBusiness, Stethoscope, Store, ShoppingBag, Building2];

export function BusinessTypeSelector({ copy, preview }: { copy: Dictionary["businessTypes"]; preview: string }) {
  const [selected, setSelected] = useState(0);
  const item = copy.items[selected];
  const Icon = businessIcons[selected];
  return (
    <section className="section section--business-types" id="business-types">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2><p>{copy.body} <span className="inline-preview">— {preview}</span></p></Reveal>
        <div className="business-selector" role="tablist" aria-label={copy.title}>{copy.items.map((entry, index) => { const TabIcon = businessIcons[index]; return <button data-testid={`business-tab-${index}`} key={entry.label} type="button" role="tab" aria-selected={selected === index} onClick={() => setSelected(index)}><TabIcon aria-hidden="true" /><span>{entry.label}</span></button>; })}</div>
        <AnimatePresence mode="wait"><motion.div className="business-preview" key={item.label} initial={{ opacity: 0.7, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0.6 }} transition={{ duration: 0.28 }}><div className="business-preview__identity"><span><Icon aria-hidden="true" /></span><div><em>{item.label}</em><h3>{item.company}</h3><p>{item.detail}</p></div></div><div className="business-preview__score"><span>Business health</span><strong>{item.score}</strong><i>/100</i></div><div className="business-preview__priority"><Lightbulb aria-hidden="true" /><div><span>Priority</span><strong>{item.priority}</strong></div><ArrowRight aria-hidden="true" /></div></motion.div></AnimatePresence>
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
          <Reveal className="market-panel market-panel--uk"><div className="market-panel__map" aria-hidden="true"><MapPin /><span>GB</span></div><div><span>United Kingdom</span><h3>Built for local context.</h3><ul>{copy.uk.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div></Reveal>
          <Reveal className="market-panel market-panel--es" delay={0.08}><div className="market-panel__map" aria-hidden="true"><MapPin /><span>ES</span></div><div><span>España</span><h3>Creado para el contexto local.</h3><ul>{copy.es.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div></Reveal>
        </div>
      </div>
    </section>
  );
}

const capabilityIcons = [Gauge, Globe2, Search, Building2, Star, MapPin, Activity, Eye, Sparkles, FileChartColumn, LineChartIcon, BriefcaseBusiness];

export function Capabilities({ copy }: { copy: Dictionary["capabilities"] }) {
  return (
    <section className="section section--capabilities">
      <div className="container">
        <Reveal className="section-intro section-intro--center"><h2>{copy.title}</h2></Reveal>
        <div className="capability-grid">{copy.items.map((item, index) => { const Icon = capabilityIcons[index]; return <div key={item}><span><Icon aria-hidden="true" /></span><strong>{item}</strong>{index > 7 && <em>{copy.coming}</em>}</div>; })}</div>
      </div>
    </section>
  );
}
