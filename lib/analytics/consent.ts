/**
 * Analytics consent.
 *
 * UK PECR and the Spanish transposition of the ePrivacy Directive require
 * consent *before* non-essential cookies are set, so this is a prior-consent
 * gate, not a notice: no provider script is requested until the visitor
 * accepts. Declining is a real, remembered answer rather than a dismissal that
 * re-asks on the next page.
 *
 * The waitlist form's privacy consent is a separate lawful basis covering
 * registration data, and deliberately does not imply this one.
 */

export type ConsentState = "granted" | "denied" | "unset";

const STORAGE_KEY = "negotrack.analytics-consent";

/** Notifies listeners in the same document; storage events only fire cross-tab. */
export const CONSENT_EVENT = "negotrack:consent-change";

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    // Safari in private mode and blocked-storage settings both throw here.
    // Treat an unreadable store as "not consented" rather than assuming yes.
    return "unset";
  }
}

export function writeConsent(state: Exclude<ConsentState, "unset">): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, state);
  } catch {
    // If it cannot be persisted the choice still applies for this page view.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

export function hasAnalyticsConsent(): boolean {
  return readConsent() === "granted";
}
