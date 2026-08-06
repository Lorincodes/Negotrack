/**
 * Public analytics API.
 *
 * Application code imports from here and nowhere deeper, so providers can be
 * added, replaced or removed without touching any call site.
 */
export { track, trackPageView } from "./providers";
export type { AnalyticsEvent, AnalyticsEventName, AnalyticsProvider, WaitlistSource } from "./events";
export { analyticsConfig, analyticsEnabled, hasClarity, hasGoogleAnalytics } from "./config";
