"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Languages, Menu, X } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "./ui";

export function Navigation({ locale, copy }: { locale: Locale; copy: Dictionary["navigation"] }) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const otherLocale: Locale = locale === "en-GB" ? "es-ES" : "en-GB";

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus({ preventScroll: true }), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);
  const links = [
    [copy.product, "#product"],
    [copy.solutions, "#business-types"],
    [copy.how, "#how-it-works"],
    [copy.pricing, `/${locale}/pricing`],
    [copy.resources, `/${locale}/guides`],
  ] as const;

  return (
    <header className={`site-header${compact ? " is-compact" : ""}`}>
      <div className="site-header__inner container">
        <Link href={`/${locale}`} className="site-header__logo" aria-label="NegoTrack home"><Logo /></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
        </nav>
        <div className="site-header__actions">
          <Link className="language-link" href={`/${otherLocale}`} hrefLang={otherLocale} aria-label={`Switch language to ${otherLocale}`}>
            <Languages aria-hidden="true" />{locale === "en-GB" ? "EN" : "ES"}
          </Link>
          <Link className="button button--primary button--small desktop-cta" href="#early-access">{copy.join}<ArrowUpRight aria-hidden="true" /></Link>
          <button ref={menuButtonRef} className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={copy.menu} onClick={() => setOpen(true)}>
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav-backdrop"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            onMouseDown={(event) => event.target === event.currentTarget && close()}
          >
            <motion.div
              ref={panelRef}
              className="mobile-nav"
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-nav__top"><Logo /><button ref={closeButtonRef} type="button" onClick={close} aria-label={copy.close} autoFocus><X aria-hidden="true" /></button></div>
              <nav aria-label="Mobile navigation links">
                {links.map(([label, href]) => <Link key={label} href={href} onClick={close}>{label}<ArrowUpRight aria-hidden="true" /></Link>)}
              </nav>
              <Link className="mobile-nav__language" href={`/${otherLocale}`} hrefLang={otherLocale} onClick={close}><Languages aria-hidden="true" />{locale === "en-GB" ? "Español" : "English"}</Link>
              <Link className="button button--primary" href="#early-access" onClick={close}>{copy.join}<ArrowUpRight aria-hidden="true" /></Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
