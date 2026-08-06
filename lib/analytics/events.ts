/**
 * The event catalogue.
 *
 * Events are described once, as data, and then handed to whichever providers
 * are registered. Nothing in the application imports a vendor SDK or knows a
 * vendor's parameter names — call sites emit an `AnalyticsEvent` and adapters
 * translate. Adding a provider means writing one adapter, not touching the
 * twelve places that report events.
 *
 * Names use snake_case because GA4 requires it of custom event names; keeping
 * the canonical name in that shape avoids a translation table for the common
 * case while leaving adapters free to rename where a provider differs.
 */

export type WaitlistSource = "hero" | "footer" | "early-access";

export type AnalyticsEvent =
  /** The visitor submitted a waitlist form, before the server has answered. */
  | { name: "waitlist_submitted"; source: WaitlistSource }
  /** The server accepted the registration. `duplicate` is a success, not a failure. */
  | { name: "waitlist_success"; source: WaitlistSource; duplicate: boolean }
  /** The server rejected it, or the request never completed. */
  | { name: "waitlist_failure"; source: WaitlistSource; reason: string }
  /** Client-side validation blocked a submission; `fields` names what failed. */
  | { name: "form_validation_error"; source: WaitlistSource; fields: string }
  | { name: "language_changed"; from: string; to: string }
  | { name: "hero_cta_clicked"; label: string }
  | { name: "secondary_cta_clicked"; label: string }
  | { name: "feature_tab_changed"; tab: string; index: number }
  | { name: "scroll_depth"; percent: 25 | 50 | 75 | 90 }
  | { name: "external_link_clicked"; href: string; host: string };

export type AnalyticsEventName = AnalyticsEvent["name"];

/** Everything on an event except its discriminating `name`. */
export type AnalyticsEventParams = Record<string, string | number | boolean>;

export function eventParams(event: AnalyticsEvent): AnalyticsEventParams {
  const { name: _name, ...rest } = event;
  void _name;
  return rest as AnalyticsEventParams;
}

/**
 * A destination for analytics data. Both methods are optional so a provider
 * that only records sessions (Clarity) can skip page views it already tracks
 * itself, without implementing an empty method.
 */
export type AnalyticsProvider = {
  readonly id: string;
  /** Called on first load and on every client-side route change. */
  pageView?: (url: string) => void;
  track?: (event: AnalyticsEvent) => void;
};
