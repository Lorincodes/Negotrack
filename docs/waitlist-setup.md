# Waiting-list backend setup

The waiting-list endpoint is `POST /api/waitlist`. It validates and normalises
registrations on the server, writes them with a Supabase service-role client,
and sends a best-effort confirmation through Resend.

## 1. Create the database table

Run `supabase/migrations/20260804120000_create_waitlist_signups.sql` through the
Supabase CLI or paste it into the Supabase SQL editor. The migration:

- creates `public.waitlist_signups` with a unique normalised email;
- stores lifecycle status plus created and automatically maintained updated timestamps;
- records privacy and optional marketing consent separately;
- constrains the supported countries and languages;
- enables row-level security and grants no access to `anon` or `authenticated`;
- grants the server-side `service_role` only the access used by the endpoint.

## 2. Configure server environment variables

Copy `.env.example` to `.env.local` for local development, then set:

| Variable | Required in production | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Server-side Supabase project URL. `NEXT_PUBLIC_SUPABASE_URL` is also recognised if the app already defines it. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only key that bypasses RLS. Never expose it to browser code or prefix it with `NEXT_PUBLIC_`. |
| `RESEND_API_KEY` | No | Enables confirmation email when paired with a sender. |
| `WAITLIST_FROM_EMAIL` | No | Resend-verified sender, for example `NegoTrack <updates@example.com>`. `RESEND_FROM_EMAIL` is also recognised. |
| `WAITLIST_PRIVACY_NOTICE_VERSION` | Recommended | Version stored with consent. Defaults to `2026-08-04`. Update it when the notice changes materially. |
| `WAITLIST_TRUST_PROXY_HEADERS` | No | Set to `true` only when a trusted reverse proxy overwrites client IP headers and direct origin access is blocked. Enables the per-client limit. |

Restart the Node.js process after changing environment variables. On cPanel,
set these values in the Node.js application's environment settings rather than
committing an `.env` file.

### Development fallback

When valid Supabase URL and service-role credentials are absent and
`NODE_ENV` is not `production`, the endpoint uses a process-local in-memory map.
This is deliberately **non-persistent**: entries disappear on a restart, do not
sync between processes, and exist only to make local form development possible.
It must not be treated as a waiting list or data store. Production fails closed
with a generic `503` response when Supabase is not configured.

If Resend is configured during local development, newly accepted in-memory
registrations still receive a confirmation. Use a Resend test recipient or leave
the Resend variables unset when that is not desired.

## 3. Request contract

Send JSON with these required fields:

```json
{
  "email": "owner@example.com",
  "country": "GB",
  "preferredLanguage": "en-GB",
  "privacyConsent": true
}
```

Supported optional fields are `name`, `businessName`, `website`,
`businessType`, `biggestChallenge`, `marketingConsent`, `referralUrl`, a
bounded referral code in `referrer`, and `utmSource`, `utmMedium`,
`utmCampaign`, `utmTerm`, and `utmContent`. UTM data may instead be nested under
`utm` using the shorter keys `source`, `medium`, `campaign`, `term`, and
`content`.

Email addresses are trimmed and lowercased. Bare website domains are stored as
HTTPS URLs. URLs with non-HTTP schemes or embedded credentials are rejected;
fragments are removed. Referral URL query strings are also removed so accidental
tokens or personal data are not retained. If no referral URL is sent, a valid
HTTP(S) `Referer` header is used with the same filtering.

Successful new registrations return HTTP `201` and code `registered`.
Duplicates return HTTP `200`, code `already_registered`, and the stable message:

> You are already on the NegoTrack waiting list. We’ll keep you updated.

Validation responses use HTTP `400`, code `invalid_request`, and a
`fieldErrors` object keyed by request field. The endpoint also rejects oversized
or non-JSON bodies and always applies process-local global and normalised-email
limits. A hashed per-client limit is enabled only when
`WAITLIST_TRUST_PROXY_HEADERS=true`; without that explicit trust boundary,
caller-controlled forwarding headers are ignored. Confirm that the proxy
overwrites `CF-Connecting-IP`, `X-Real-IP`, or `X-Forwarded-For` and that callers
cannot reach the Node.js origin directly before enabling it. These controls are
intentionally basic; deployments with multiple Node.js processes should add a
shared gateway or datastore-backed rate limiter.

## Delivery and failure behaviour

Confirmation email is attempted only for a newly created registration, with a
short request deadline. A missing Resend configuration or provider-submission
failure never rolls back the stored registration and never changes the
successful API response. `confirmation_email_sent_at` means Resend accepted the
message; it does not claim inbox delivery. Provider errors, database errors,
service-role credentials, and submitted personal data are not returned to the
browser or written to application logs.
