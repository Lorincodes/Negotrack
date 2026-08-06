import { analyticsConfig, hasClarity, hasDirectGa4, hasGtm } from "./config";
import { hasAnalyticsConsent } from "./consent";
import { eventParams, type AnalyticsEvent, type AnalyticsProvider } from "./events";

type GtagFn = (...args: unknown[]) => void;
type ClarityFn = (...args: unknown[]) => void;

type AnalyticsWindow = Window & {
  gtag?: GtagFn;
  dataLayer?: unknown[];
  clarity?: ClarityFn;
};

function analyticsWindow(): AnalyticsWindow | undefined {
  return typeof window === "undefined" ? undefined : (window as AnalyticsWindow);
}

/**
 * GA4.
 *
 * The tag is configured with `send_page_view: false` in the loader, so the
 * automatic page view never fires. Every page view — including the first —
 * comes from `pageView()` below. That is what keeps SPA navigation and initial
 * load counted exactly once each rather than the first being double-counted.
 */
const googleAnalytics: AnalyticsProvider = {
  id: "ga4",
  pageView(url) {
    const w = analyticsWindow();
    if (!w?.gtag) return;
    w.gtag("event", "page_view", {
      page_path: url,
      page_location: `${analyticsConfig.siteUrl}${url}`,
      send_to: analyticsConfig.gaMeasurementId,
    });
  },
  track(event) {
    const w = analyticsWindow();
    if (!w?.gtag) return;
    w.gtag("event", event.name, eventParams(event));
  },
};

/**
 * Google Tag Manager.
 *
 * GTM's interface is the dataLayer, not a function call: tags inside the
 * container listen for named events and read the rest of the pushed object as
 * variables. Page views are pushed as an explicit event because a container
 * cannot observe SPA navigation on its own — the History Change trigger exists,
 * but relying on it would double-count against the explicit push here.
 */
const tagManager: AnalyticsProvider = {
  id: "gtm",
  pageView(url) {
    const w = analyticsWindow();
    if (!w?.dataLayer) return;
    w.dataLayer.push({ event: "page_view", page_path: url, page_location: `${analyticsConfig.siteUrl}${url}` });
  },
  track(event) {
    const w = analyticsWindow();
    if (!w?.dataLayer) return;
    w.dataLayer.push({ event: event.name, ...eventParams(event) });
  },
};

/**
 * Microsoft Clarity.
 *
 * Clarity records sessions continuously and derives its own page views, so it
 * deliberately implements no `pageView`. Custom events map to its tag API, and
 * its own parameter API takes strings only.
 */
const clarity: AnalyticsProvider = {
  id: "clarity",
  track(event) {
    const w = analyticsWindow();
    if (!w?.clarity) return;
    w.clarity("event", event.name);
    for (const [key, value] of Object.entries(eventParams(event))) {
      w.clarity("set", key, String(value));
    }
  },
};

/**
 * Only configured providers are registered, so an unset measurement ID means
 * that provider's code never runs rather than failing at the call site.
 *
 * Consent is checked here rather than at each call site: this one gate covers
 * every event in the application, and a visitor who declines produces no
 * reporting anywhere without a single `if` elsewhere in the codebase.
 */
export function activeProviders(): AnalyticsProvider[] {
  if (!hasAnalyticsConsent()) return [];
  const providers: AnalyticsProvider[] = [];
  if (hasDirectGa4) providers.push(googleAnalytics);
  if (hasGtm) providers.push(tagManager);
  if (hasClarity) providers.push(clarity);
  return providers;
}

/**
 * Report an event to every registered provider.
 *
 * Safe to call from anywhere, including during development and on the server:
 * with no providers registered this is a no-op. A provider that throws must
 * never break the interaction that reported the event, so each is isolated.
 */
export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  for (const provider of activeProviders()) {
    try {
      provider.track?.(event);
    } catch {
      // Analytics is never allowed to break the page it measures.
    }
  }
}

export function trackPageView(url: string): void {
  if (typeof window === "undefined") return;
  for (const provider of activeProviders()) {
    try {
      provider.pageView?.(url);
    } catch {
      // As above: a reporting failure is not a user-facing failure.
    }
  }
}
