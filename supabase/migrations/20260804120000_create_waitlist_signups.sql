create extension if not exists pgcrypto;

create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  normalized_email text not null,
  name text,
  business_name text,
  website text,
  business_type text,
  biggest_challenge text,
  country text not null,
  preferred_language text not null,
  privacy_consent boolean not null,
  privacy_consented_at timestamptz not null,
  privacy_notice_version text not null,
  marketing_consent boolean not null default false,
  marketing_consented_at timestamptz,
  referral_url text,
  referral_code text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  confirmation_email_sent_at timestamptz,
  status text not null default 'waiting',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint waitlist_signups_normalized_email_unique unique (normalized_email),
  constraint waitlist_signups_email_length check (char_length(email) between 3 and 254),
  constraint waitlist_signups_email_normalized check (
    email = normalized_email
    and normalized_email = lower(btrim(normalized_email))
  ),
  constraint waitlist_signups_country_check check (country in ('GB', 'ES')),
  constraint waitlist_signups_language_check check (
    preferred_language in ('en-GB', 'es-ES')
  ),
  constraint waitlist_signups_privacy_consent_check check (privacy_consent is true),
  constraint waitlist_signups_marketing_timestamp_check check (
    (marketing_consent is true and marketing_consented_at is not null)
    or (marketing_consent is false and marketing_consented_at is null)
  ),
  constraint waitlist_signups_name_length check (
    name is null or char_length(name) <= 100
  ),
  constraint waitlist_signups_business_name_length check (
    business_name is null or char_length(business_name) <= 160
  ),
  constraint waitlist_signups_business_type_length check (
    business_type is null or char_length(business_type) <= 100
  ),
  constraint waitlist_signups_challenge_length check (
    biggest_challenge is null or char_length(biggest_challenge) <= 1000
  ),
  constraint waitlist_signups_website_scheme check (
    website is null or website ~* '^https?://'
  ),
  constraint waitlist_signups_referral_scheme check (
    referral_url is null or referral_url ~* '^https?://'
  ),
  constraint waitlist_signups_referral_code_length check (
    referral_code is null or char_length(referral_code) <= 200
  ),
  constraint waitlist_signups_status_check check (
    status in ('waiting', 'invited', 'joined', 'unsubscribed')
  )
);

create index waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);

alter table public.waitlist_signups enable row level security;

revoke all on table public.waitlist_signups from anon, authenticated;
grant select, insert, update on table public.waitlist_signups to service_role;

create or replace function public.set_waitlist_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger waitlist_signups_set_updated_at
before update on public.waitlist_signups
for each row execute function public.set_waitlist_updated_at();

comment on table public.waitlist_signups is
  'Consent-based NegoTrack pre-launch waiting-list registrations.';
