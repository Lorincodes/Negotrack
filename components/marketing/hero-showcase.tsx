"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { Building2, Check, CheckCircle2, Gauge, Globe2, LineChart, Link2, ScanLine, Search, Smartphone, Sparkles, Star, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import { DashboardPreview, useAmbientRegion } from "./ui";

const tabIcons = [Gauge, Globe2, Search, Star, Building2, Sparkles];
const PANEL_ID = "hero-console-panel";

/**
 * Each feature gets its own pair of notification icons, so the two chips read as belonging to the
 * panel on screen rather than being fixed page furniture.
 *
 * Accents follow the palette rules rather than the signal's sentiment: mint for improvement in
 * your own numbers, amber for a competitor move that needs attention, blue for a neutral analytic
 * reading, violet for a comparative one.
 */
const chipsByPanel: Record<string, [{ icon: LucideIcon; accent: string }, { icon: LucideIcon; accent: string }]> = {
  overview: [{ icon: Gauge, accent: "mint" }, { icon: Star, accent: "amber" }],
  website: [{ icon: Smartphone, accent: "blue" }, { icon: ScanLine, accent: "blue" }],
  seo: [{ icon: Search, accent: "mint" }, { icon: LineChart, accent: "violet" }],
  reviews: [{ icon: Star, accent: "mint" }, { icon: TrendingDown, accent: "blue" }],
  competitors: [{ icon: Building2, accent: "amber" }, { icon: TrendingUp, accent: "mint" }],
  actions: [{ icon: CheckCircle2, accent: "mint" }, { icon: Link2, accent: "violet" }],
};

const fallbackChips = chipsByPanel.overview;

/**
 * The hero product explorer. One console frame stays mounted while the selected feature swaps
 * its contents, so the visitor can look through six product areas without the hero reloading.
 *
 * Rotation is driven by the progress bar's own CSS animation rather than a JS timer: pausing the
 * animation pauses the advance exactly in step, and resuming continues from where it stopped.
 */
export function HeroShowcase({ copy, children }: { copy: Dictionary; children: ReactNode }) {
  const panels = copy.console.panels;
  const [selected, setSelected] = useState(0);
  const [chosenManually, setChosenManually] = useState(false);
  const [paused, setPaused] = useState(false);
  const tablistRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Off-screen, hidden-tab and reduced-motion handling all come from this one hook.
  const { ref: regionRef, ambientClass } = useAmbientRegion<HTMLDivElement>();
  const onScreen = ambientClass !== "";
  const rotating = onScreen && !chosenManually && !reduceMotion;

  const panel = panels[selected];

  const advance = useCallback(() => {
    setSelected((current) => (current + 1) % panels.length);
  }, [panels.length]);

  // Where the selector scrolls (tablet and below), keep the active pill in view. Only the
  // tablist scrolls — never the page.
  useEffect(() => {
    const list = tablistRef.current;
    const tab = list?.querySelectorAll<HTMLElement>("[role='tab']")[selected];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: Math.max(0, tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion, selected]);

  /** A manual choice ends rotation for the rest of the visit. */
  const choose = useCallback((index: number) => {
    setSelected(index);
    setChosenManually(true);
    // Only deliberate selections are reported. The idle rotation advances
    // through the same state and would otherwise flood the event stream.
    track({ name: "feature_tab_changed", tab: panels[index]?.key ?? String(index), index });
  }, [panels]);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowLeft") next = (index - 1 + panels.length) % panels.length;
    if (event.key === "ArrowRight") next = (index + 1) % panels.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = panels.length - 1;
    choose(next);
    tablistRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  }

  return (
    <div
      ref={regionRef}
      className="hero__showcase"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="container hero__grid">
        {children}
        {/* The console and its controls share one column, so the pills read as belonging to the
            dashboard rather than to the copy beside it. */}
        <div className="hero__stage">
          <div className="hero__visual">
            <DashboardPreview
              copy={copy.dashboard}
              demoLabel={copy.demo}
              previewLabel={copy.preview}
              panel={panel}
              panelIndex={selected}
              panelId={PANEL_ID}
              labelledBy={`hero-tab-${panel.key}`}
            />
            {panel.chips.map((chip, index) => {
              const [title, detail, accent] = chip;
              const { icon: Icon, accent: tint } = (chipsByPanel[panel.key] ?? fallbackChips)[index];
              return (
                // Keyed by slot, not by panel: the chip stays mounted across feature changes so its
                // delayed entrance plays once on load instead of blanking the chip on every switch.
                // Only the contents are keyed by panel, giving each swap a short crossfade.
                <span
                  key={`chip-${index}`}
                  className={`hero-chip hero-chip--${index === 0 ? "one" : "two"} hero-chip--${tint}`}
                  aria-hidden="true"
                >
                  <i className="hero-chip__icon" key={`${panel.key}-icon`}><Icon /></i>
                  <span className="hero-chip__text" key={`${panel.key}-text`}>
                    <strong>{title}</strong>
                    <em>{detail}{accent && <b> {accent}</b>}</em>
                  </span>
                </span>
              );
            })}
          </div>

          <div className="hero__tabs">
            <div ref={tablistRef} className="hero-tablist" role="tablist" aria-label={copy.console.label}>
          {panels.map((item, index) => {
            const Icon = tabIcons[index];
            const active = index === selected;
            return (
              <button
                key={item.key}
                id={`hero-tab-${item.key}`}
                type="button"
                role="tab"
                data-testid={`hero-tab-${index}`}
                aria-selected={active}
                aria-controls={PANEL_ID}
                tabIndex={active ? 0 : -1}
                className={`hero-tab${active ? " is-active" : ""}`}
                onClick={() => choose(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <Icon className="hero-tab__icon" aria-hidden="true" />
                <span className="hero-tab__label">{item.tab}</span>
                {active && <Check className="hero-tab__check" aria-hidden="true" />}
                {active && rotating && (
                  <span
                    key={item.key}
                    className={`hero-tab__progress${paused ? " is-paused" : ""}`}
                    onAnimationEnd={advance}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
