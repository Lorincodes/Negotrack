# Analytics and tracking setup

Everything here is inert until you supply the environment variables. Each
provider loads only when **its own variable is set** *and* the build is a
production build, so local development and the e2e suite never write to real
property data.

## 1. Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin for metadata, sitemap, canonical URLs and OG tags |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Google Analytics 4 measurement ID (`G-…`) |
| `NEXT_PUBLIC_GTM_CONTAINER_ID` | Optional | Google Tag Manager container (`GTM-…`) |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Optional | Microsoft Clarity project ID |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Optional | Google Search Console verification token |

All four are `NEXT_PUBLIC_` because they are inlined into the client bundle and
are public identifiers by design. **None of them is a secret.** Never put the
Supabase service-role key or any other credential behind a `NEXT_PUBLIC_` name —
it would ship to every visitor.

Omitting an optional variable is a supported state, not a broken one: that
provider simply never loads.

## 2. Where to obtain each value

**`NEXT_PUBLIC_SITE_URL`** — your canonical origin, including protocol and no
trailing slash. Use the domain visitors actually land on. This site redirects
apex to `www`, so it should be `https://www.negotrack.com`.

**`NEXT_PUBLIC_GA_MEASUREMENT_ID`** — analytics.google.com → **Admin** → **Data
streams** → select (or create) the web stream → the **Measurement ID** at top
right, formatted `G-XXXXXXXXXX`. This is *not* the "Stream ID" (numeric) or the
older `UA-` property ID.

**`NEXT_PUBLIC_GTM_CONTAINER_ID`** — tagmanager.google.com → your container →
the ID beside the container name, formatted `GTM-XXXXXXX`.

### GA4 or Tag Manager — pick one path

These are different products and the IDs are not interchangeable. A GA4
measurement ID looks like `G-XXXXXXXXXX`; a Tag Manager container looks like
`GTM-XXXXXXX`.

Tag Manager is a container that usually *holds* a GA4 tag. If the direct GA4
integration and a container holding GA4 both ran, the property would receive
every page view and event twice. So **when `NEXT_PUBLIC_GTM_CONTAINER_ID` is
set, the direct GA4 tag stands down automatically** and GA4 is expected to be
configured inside the container. Setting both is safe — the code resolves it —
but the GA4 variable then does nothing.

Which to choose:

- **Tag Manager** if you want to add or change tags without redeploying, or
  plan to run several tools. You configure GA4 as a tag inside it.
- **Direct GA4** if GA4 is all you need. Fewer moving parts and one less
  script.

Either way the events in section 7 are emitted the same. With a container they
arrive on the `dataLayer` as named events — build GA4 tags in the container
using **Custom Event** triggers matching those names.

**Note on the GTM `<noscript>` snippet.** Tag Manager gives you two pieces: a
script for `<head>` and a `<noscript>` iframe for the top of `<body>`. Only the
script is installed here. The iframe exists to track visitors with JavaScript
disabled, but those visitors cannot be shown the consent banner or record an
answer, so firing it would track them without consent — the one thing the gate
exists to prevent. It is deliberately omitted.

**`NEXT_PUBLIC_CLARITY_PROJECT_ID`** — clarity.microsoft.com → your project →
**Settings** → **Overview** → **Project ID**. A short lowercase alphanumeric
string. You can also read it out of the install snippet Clarity shows you: it is
the value passed as the last argument.

**`NEXT_PUBLIC_GSC_VERIFICATION`** — search.google.com/search-console → add a
**URL prefix** property → choose the **HTML tag** verification method → copy
only the `content="..."` value, not the whole `<meta>` element.

## 3. Accounts you still need to create

Nothing here is provisioned yet. Each is free and independent:

1. **Google Analytics 4** — analytics.google.com. Create an account, then a
   property, then a **Web** data stream pointed at your domain.
2. **Microsoft Clarity** — clarity.microsoft.com. Sign in, create a project for
   the domain. No billing, no sampling.
3. **Google Search Console** — search.google.com/search-console. Add the
   property, verify, then submit the sitemap (step 5 below).

Search Console and Analytics are separate products; verifying one does not
verify the other, though GA4 ownership can be used as a Search Console
verification method if you prefer it to the meta tag.

## 4. Enabling analytics in production

1. Add the variables in **Vercel → Project → Settings → Environment
   Variables**, scoped to **Production**. Leaving them off Preview keeps
   preview deployments out of your reporting.
2. **Redeploy.** These are build-time inlined values — an existing deployment
   will not pick them up, and changing a variable without redeploying changes
   nothing.
3. Confirm with the checks below.

Because analytics is gated on `NODE_ENV === "production"`, `npm run dev` never
loads a provider even with every variable set. To exercise the real behaviour
locally, build and serve a production bundle:

```
npm run build && npm start
```

## 5. Verifying it works

**Scripts load (production only).** Open the deployed site, DevTools →
**Network**, filter `gtag` and `clarity`. Expect one request each to
`googletagmanager.com/gtag/js?id=G-…` and `clarity.ms/tag/…`. On `npm run dev`
expect none.

**Page views are counted once.** In the console run:

```js
dataLayer.filter(a => a[1] === "page_view").map(a => a[2].page_path)
```

One entry per page. Switch language and it becomes two. If you ever see the same
path twice for a single visit, the automatic page view has been re-enabled
somewhere — the tag is deliberately configured `send_page_view: false` so that
this module is the only source.

**Events fire.** GA4 → **Reports** → **Realtime**, or DevTools console:

```js
dataLayer.filter(a => a[0] === "event").map(a => a[1])
```

Scroll the page to the bottom and you should see `scroll_depth` at 25, 50, 75
and 90, once each. Submit the waitlist and you should see `waitlist_submitted`
followed by `waitlist_success`.

GA4 takes up to 24–48 hours to show custom events in standard reports, but
**Realtime** shows them within seconds. Judge success by Realtime, not by the
standard reports, on day one.

**Clarity.** Its dashboard shows session recordings within a few minutes.
Custom events appear under **Filters → Custom events**.

**Search Console.** After deploying with `NEXT_PUBLIC_GSC_VERIFICATION` set,
click **Verify**. Then submit `https://<your-domain>/sitemap.xml` under
**Sitemaps**. The sitemap already lists both locales for every public route.

## 6. Adding another provider

`lib/analytics/providers.ts` holds one adapter per destination. An adapter is an
object with an `id` and optional `pageView` / `track` methods. Add it to
`activeProviders()` behind its own configuration check and every existing call
site reports to it — no component changes. Call sites import only from
`@/lib/analytics` and never reference a vendor API directly.

## 7. Tracked events

| Event | Fires when | Parameters |
| --- | --- | --- |
| `waitlist_submitted` | A waitlist form is submitted | `source` |
| `waitlist_success` | The server accepted it | `source`, `duplicate` |
| `waitlist_failure` | Rejected, or the request failed | `source`, `reason` |
| `form_validation_error` | Client-side validation blocked it | `source`, `fields` |
| `language_changed` | Either language control is used | `from`, `to` |
| `hero_cta_clicked` | Hero waitlist button | `label` |
| `secondary_cta_clicked` | "See how it works" | `label` |
| `feature_tab_changed` | A dashboard feature tab is chosen | `tab`, `index` |
| `scroll_depth` | 25 / 50 / 75 / 90% reached | `percent` |
| `external_link_clicked` | Any off-site link | `href`, `host` |

`source` is `hero`, `footer` or `early-access`.

Two deliberate choices worth knowing. `feature_tab_changed` reports only
*deliberate* selections — the hero's idle rotation moves through the same state
and would otherwise flood the stream with events no visitor caused. And
`form_validation_error` reports **field names only**; the values a visitor typed
are never sent to any provider.

## 8. Consent

Analytics is behind **prior consent**: no provider script is requested until the
visitor accepts. UK PECR and the Spanish transposition of the ePrivacy Directive
require consent *before* non-essential cookies are set, and Clarity records
session replays, so a notice-only banner would not be sufficient.

The gate is in one place — `activeProviders()` returns an empty list without
consent, so declining silences every event in the application without a single
check at a call site.

| Visitor state | Banner | Provider scripts |
| --- | --- | --- |
| Has not answered | shown | none requested |
| Accepted | hidden | loaded |
| Declined | hidden | none requested, permanently |

The answer is stored in `localStorage` under `negotrack.analytics-consent` and
survives reloads. To re-test the banner, clear that key.

The waitlist form's privacy consent is a **separate lawful basis** covering
registration data, and deliberately does not imply analytics consent.

Two things this does not do, which you should decide on before relying on it
legally: there is no way for a visitor to change their mind after answering
(a "cookie settings" link in the footer would be the usual place), and declining
is remembered on that device only. Neither is required for the scripts to be
gated correctly, but both are common expectations in a full consent solution,
and this has not been reviewed by anyone qualified in data protection law.
