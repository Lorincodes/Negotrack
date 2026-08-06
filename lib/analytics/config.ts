/**
 * Single source of truth for analytics configuration.
 *
 * Every value comes from the environment; nothing here is hardcoded. These are
 * all NEXT_PUBLIC_ because they are inlined into the client bundle at build
 * time — measurement IDs are public identifiers by design, not secrets. Adding
 * a real secret to this file would ship it to every visitor.
 */

const SITE_URL_FALLBACK = "https://negotrack.com";

function read(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "";
}

/**
 * Next inlines `process.env.NEXT_PUBLIC_*` only when referenced as a full
 * static member expression, so each one is written out literally rather than
 * looked up through a variable.
 */
export const analyticsConfig = {
  siteUrl: read(process.env.NEXT_PUBLIC_SITE_URL) || SITE_URL_FALLBACK,
  gaMeasurementId: read(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  gtmContainerId: read(process.env.NEXT_PUBLIC_GTM_CONTAINER_ID),
  clarityProjectId: read(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID),
  gscVerification: read(process.env.NEXT_PUBLIC_GSC_VERIFICATION),
} as const;

/**
 * Analytics run in production builds only, so local development and the e2e
 * suite never write to real property data. `NODE_ENV` is statically replaced at
 * build time, which lets the bundler drop the provider code entirely from
 * development bundles.
 */
export const isProductionRuntime = process.env.NODE_ENV === "production";

export const hasGoogleAnalytics = isProductionRuntime && analyticsConfig.gaMeasurementId !== "";
export const hasGtm = isProductionRuntime && analyticsConfig.gtmContainerId !== "";
export const hasClarity = isProductionRuntime && analyticsConfig.clarityProjectId !== "";

/**
 * Tag Manager usually *contains* a GA4 tag. Running both it and the direct GA4
 * integration would report every page view and event twice into the same
 * property, so the direct tag stands down when a container is configured and
 * GA4 is expected to be managed inside it.
 */
export const hasDirectGa4 = hasGoogleAnalytics && !hasGtm;

/** True when at least one provider is configured and allowed to load. */
export const analyticsEnabled = hasDirectGa4 || hasGtm || hasClarity;
