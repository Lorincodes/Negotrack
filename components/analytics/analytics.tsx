"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { analyticsConfig, hasClarity, hasDirectGa4, hasGtm } from "@/lib/analytics/config";
import { useConsent } from "@/lib/analytics/use-consent";
import { track, trackPageView } from "@/lib/analytics/providers";

/**
 * Analytics loader and ambient trackers.
 *
 * Renders nothing. All scripts use `afterInteractive`, so they are requested
 * after the page is usable and never block rendering or hydration. Because the
 * `has*` flags fold to `false` at build time outside production, the bundler
 * drops this component's provider branches from development builds entirely.
 */
export function Analytics() {
  const granted = useConsent() === "granted";

  return (
    <>
      {/* Prior consent: no provider script is requested until the visitor
          accepts, so nothing is set on their device before they choose. */}
      {granted && <AnalyticsScripts />}
      {granted && (
        // useSearchParams needs a Suspense boundary or it opts the whole route
        // into client rendering.
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
      )}
      {granted && <ScrollDepthTracker />}
      {granted && <ExternalLinkTracker />}
    </>
  );
}

function AnalyticsScripts() {
  return (
    <>
      {hasDirectGa4 && (
        <>
          <Script
            id="ga4-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaMeasurementId}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
window.gtag=window.gtag||gtag;gtag('js',new Date());
gtag('config','${analyticsConfig.gaMeasurementId}',{send_page_view:false});`}
          </Script>
        </>
      )}
      {hasGtm && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analyticsConfig.gtmContainerId}');`}
        </Script>
      )}
      {hasClarity && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${analyticsConfig.clarityProjectId}');`}
        </Script>
      )}
    </>
  );
}

/**
 * One page view per URL, on first load and on every client-side navigation.
 *
 * GA4's own automatic page view is disabled in the loader above, so this is the
 * only source. The last-reported URL is held in a ref and compared before
 * sending, which absorbs the duplicate effect invocations that Strict Mode and
 * re-renders would otherwise turn into double counts.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (lastUrl.current === url) return;
    lastUrl.current = url;
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

const DEPTHS = [25, 50, 75, 90] as const;

/**
 * Scroll depth, reported once per threshold per page.
 *
 * State lives in refs and the listener is passive, so scrolling triggers no
 * React re-render at all. Measurement is deferred to an animation frame so the
 * handler itself never reads layout during the scroll.
 */
function ScrollDepthTracker() {
  const pathname = usePathname();
  const reached = useRef(new Set<number>());
  const ticking = useRef(false);

  useEffect(() => {
    reached.current = new Set();
  }, [pathname]);

  useEffect(() => {
    function measure() {
      ticking.current = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = ((window.scrollY / scrollable) * 100);
      for (const depth of DEPTHS) {
        if (percent >= depth && !reached.current.has(depth)) {
          reached.current.add(depth);
          track({ name: "scroll_depth", percent: depth });
        }
      }
      if (reached.current.size === DEPTHS.length) {
        window.removeEventListener("scroll", onScroll);
      }
    }
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(measure);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}

/**
 * External link clicks, captured at the document root.
 *
 * One delegated listener rather than a handler per anchor: nothing needs to be
 * wired into the markup, so links added later are covered automatically and no
 * component re-renders to support this.
 */
function ExternalLinkTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;
      // Ignore in-page anchors, relative routes and non-navigational schemes.
      if (!/^https?:\/\//i.test(href)) return;
      let host: string;
      try {
        host = new URL(href).host;
      } catch {
        return;
      }
      if (host === window.location.host) return;
      track({ name: "external_link_clicked", href, host });
    }
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
