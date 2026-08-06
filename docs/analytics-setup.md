# Analytics and tracking setup

Everything here is inert until you supply the environment variables. Each
provider loads only when **its own variable is set** *and* the build is a
production build, so local development and the e2e suite never write to real
property data.

## 1. Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin for metadata, sitemap, canonical URLs and OG tags |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Google Analytics 4 measurement ID |
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

## 8. Privacy note

No analytics consent banner is implemented. GA4 and Clarity both set cookies and
Clarity records session replays, which in the UK and Spain generally requires
consent under PECR and the ePrivacy Directive before the scripts load — the
waitlist form already collects an explicit privacy consent for registration, but
that is a separate lawful basis and does not cover analytics cookies. Before
enabling these in production for real EU/UK traffic, get advice on whether you
need a consent gate. The provider registry is the natural place for one: gate
`activeProviders()` on stored consent and no call site changes.
