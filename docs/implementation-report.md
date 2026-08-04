# NegoTrack implementation report

## Outcome

NegoTrack now has a complete bilingual marketing site built with Next.js App Router and strict TypeScript. The homepage follows the supplied product-led SaaS reference while presenting NegoTrack correctly as an AI-powered business-health and digital-growth platform for small businesses. Every product preview is coded; the supplied reference image is stored for design evidence and is never rendered on the website.

## Application structure

- `app/[locale]/page.tsx` supplies locale-specific metadata and the homepage entry for `en-GB` and `es-ES`.
- `components/marketing/marketing-page.tsx` composes the full homepage narrative.
- `components/marketing/ui.tsx` owns the logo placeholder, coded browser frame, score ring, responsive SVG charts, dashboard preview and reveal primitive.
- `components/marketing/interactive-sections.tsx` owns the workflow, scan simulation, health overview, monitored-area selector, feature tabs, product story, comparison slider, business-type selector, market panels and capability matrix.
- `components/marketing/navigation.tsx` provides the compacting desktop navigation and keyboard-managed mobile dialog.
- `components/marketing/waitlist-form.tsx` provides the full consent-aware registration experience.
- `lib/i18n.ts` contains equivalent English and Spanish page content.
- `app/[locale]/[slug]/page.tsx` creates valid supporting routes for pricing, resources, company and legal links.

## Visual and interaction system

The page uses a daylight-white base, midnight-navy typography, mint and teal operative signals, blue/violet analytical accents, hairline borders and soft product elevation. Plus Jakarta Sans is used for display typography and Inter for body/interface text through `next/font`.

Implemented interactions include:

- compacting fixed navigation;
- accessible mobile navigation with scroll lock, focus handoff/trap, close control and Escape support;
- hero dashboard rise/perspective treatment;
- SVG score rings with legible first-paint values and numeric progression;
- responsive coded trend charts with a visible baseline and restrained line-draw emphasis;
- connected workflow line animation;
- user-triggered simulated website scan with progress stages and an honest preview result;
- accessible monitored-area and business-type selectors;
- arrow-key feature tabs with animated filtering;
- a discoverable snap rail for mobile feature results;
- impact/ease recommendation reordering;
- mouse, touch and keyboard comparison range control;
- coordinated section reveals and CTA hover/gradient motion;
- reduced-motion fallbacks that preserve content and complete the scan immediately.

## Localisation and SEO

The root route redirects to `/en-GB`; `/es-ES` provides equivalent Spanish content. Locale changes update the document language after navigation. Each homepage has its own title, description, canonical URL, `hreflang`, Open Graph data and Organisation structured data. The project also includes `sitemap.xml`, `robots.txt`, a web manifest, social-sharing artwork and placeholder app icon.

## Waiting-list implementation

`POST /api/waitlist` is a Node.js route handler. It performs strict Zod validation, lowercases and normalises email addresses, constrains countries and languages, requires privacy consent, keeps marketing consent optional, sanitises URLs and attribution values, applies bounded request parsing and basic rate limits, and returns safe field-level errors.

Production persistence uses a server-only Supabase service-role client. The migration creates `public.waitlist_signups` with a unique normalised email, explicit consent timestamps, attribution fields, lifecycle status, created/updated dates and row-level security with no anonymous or authenticated grants. Duplicate emails return the required friendly response. Development can use a clearly documented non-persistent in-memory fallback; production fails closed when Supabase is missing.

Resend confirmation is best-effort and bounded. A provider failure does not roll back a stored registration or change a successful API response. Secrets and submitted personal data are not exposed in browser code or returned in errors.

## Deployment shape

The production build uses `output: "standalone"` and the standard Node.js runtime. A portable post-build script copies public and static assets into the standalone bundle, and `npm start` runs its generated Node server with `process.env.PORT` support. It contains no edge-only route dependencies. Namecheap cPanel deployment is documented in `docs/namecheap-deployment.md`, including Linux build requirements, environment variables, nested-route smoke tests and versioned rollback.

## Required configuration

- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WAITLIST_PRIVACY_NOTICE_VERSION`
- optional `RESEND_API_KEY` plus `WAITLIST_FROM_EMAIL`
- optional `WAITLIST_TRUST_PROXY_HEADERS` only behind a trusted overwrite-only proxy

## Known limitations and replacement list

- The production logo file has not been supplied. A deliberately plain text wordmark and placeholder icon are used; replace them with approved brand assets without changing the logo design.
- The scan, dashboard values, business-type examples and product interfaces are demonstrations, not a live crawler or AI analysis engine.
- Supabase, Resend, the final public domain and sender identity require production configuration.
- Supporting resource/company pages are valid launch-state pages, not a populated content publishing system.
- Final legal wording should be reviewed by the business before production launch.
