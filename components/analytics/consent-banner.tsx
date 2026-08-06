"use client";

import Link from "next/link";
import { analyticsEnabled } from "@/lib/analytics/config";
import { writeConsent } from "@/lib/analytics/consent";
import { useConsent } from "@/lib/analytics/use-consent";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Analytics consent request.
 *
 * Shown only when a provider is actually configured and the visitor has not
 * answered yet, so a build with no analytics never asks a question that has no
 * consequence. Accept and decline carry equal visual weight: a decline styled
 * as the lesser option is not a free choice.
 *
 * Rendered as a complementary landmark rather than a modal dialog. It does not
 * trap focus or block the page, because nothing has been set on the visitor's
 * device yet and reading the site without answering is a valid outcome.
 */
export function ConsentBanner({ locale, copy }: { locale: Locale; copy: Dictionary["consent"] }) {
  const consent = useConsent();

  // `pending` is the server snapshot, so the delivered markup carries no
  // banner and a visitor who already answered never sees one flash. Writing
  // the answer updates the store, which re-renders this away — no local state
  // to keep in step with it.
  if (!analyticsEnabled || consent !== "unset") return null;

  return (
    <aside className="consent" role="complementary" aria-label={copy.title}>
      <div className="consent__panel">
        <div className="consent__copy">
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
        </div>
        <div className="consent__actions">
          <button type="button" className="button button--primary" onClick={() => writeConsent("granted")} data-testid="consent-accept">
            {copy.accept}
          </button>
          <button type="button" className="button button--secondary" onClick={() => writeConsent("denied")} data-testid="consent-decline">
            {copy.decline}
          </button>
          <Link className="consent__link" href={`/${locale}/privacy`}>{copy.privacy}</Link>
        </div>
      </div>
    </aside>
  );
}
