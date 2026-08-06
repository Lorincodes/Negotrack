"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, readConsent, type ConsentState } from "./consent";

/**
 * `pending` is the server's answer: consent lives in localStorage, which does
 * not exist during rendering on the server. Distinguishing it from `unset`
 * means the markup sent to the browser contains no banner, so a visitor who
 * already answered never sees one flash before hydration removes it.
 */
export type ConsentView = ConsentState | "pending";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  // Keeps a second tab in step when consent is given or withdrawn.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const getServerSnapshot = (): ConsentView => "pending";

/**
 * Subscribes to consent as an external store rather than mirroring it into
 * state from an effect. React re-reads it on every change and reconciles the
 * server and client snapshots itself, so there is no setState-in-effect and no
 * hydration mismatch to manage by hand.
 */
export function useConsent(): ConsentView {
  return useSyncExternalStore(subscribe, readConsent, getServerSnapshot);
}
