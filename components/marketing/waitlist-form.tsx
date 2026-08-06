"use client";

import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, LoaderCircle, ShieldCheck } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { track } from "@/lib/analytics";

type FormState = {
  email: string;
  name: string;
  businessName: string;
  website: string;
  country: "GB" | "ES";
  preferredLanguage: Locale;
  businessType: string;
  biggestChallenge: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
};

type ApiResponse = {
  ok: boolean;
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string[] | string>;
};

export function WaitlistForm({ locale, copy, businessTypes }: { locale: Locale; copy: Dictionary["form"]; businessTypes: string[] }) {
  const formId = useId();
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "duplicate" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<FormState>({
    email: "", name: "", businessName: "", website: "", country: locale === "es-ES" ? "ES" : "GB", preferredLanguage: locale, businessType: "", biggestChallenge: "", privacyConsent: false, marketingConsent: false,
  });

  useEffect(() => {
    const onPrefill = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      setState((current) => ({ ...current, email: value }));
      document.getElementById("waitlist-email")?.focus();
    };
    window.addEventListener("prefill-waitlist", onPrefill);
    return () => window.removeEventListener("prefill-waitlist", onPrefill);
  }, []);

  const statusMessage = useMemo(() => {
    if (status === "success") return copy.success;
    if (status === "duplicate") return copy.duplicate;
    if (status === "error") return copy.error;
    return "";
  }, [copy, status]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(state.email.trim())) nextErrors.email = copy.emailError;
    if (!state.privacyConsent) nextErrors.privacyConsent = copy.privacyError;
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("error");
      // Field names only. The values the visitor typed are never reported.
      track({ name: "form_validation_error", source: "early-access", fields: Object.keys(nextErrors).sort().join(",") });
      document.getElementById(nextErrors.email ? "waitlist-email" : "waitlist-privacy")?.focus();
      return;
    }

    track({ name: "waitlist_submitted", source: "early-access" });
    setStatus("submitting");
    setErrors({});
    const query = new URLSearchParams(window.location.search);
    const payload = {
      ...state,
      email: state.email.trim().toLowerCase(),
      name: state.name.trim() || undefined,
      businessName: state.businessName.trim() || undefined,
      website: state.website.trim() || undefined,
      businessType: state.businessType || undefined,
      biggestChallenge: state.biggestChallenge.trim() || undefined,
      referralUrl: document.referrer || undefined,
      referrer: query.get("ref") ?? undefined,
      utmSource: query.get("utm_source") ?? undefined,
      utmMedium: query.get("utm_medium") ?? undefined,
      utmCampaign: query.get("utm_campaign") ?? undefined,
      utmTerm: query.get("utm_term") ?? undefined,
      utmContent: query.get("utm_content") ?? undefined,
    };

    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = (await response.json()) as ApiResponse;
      if (result.ok) {
        const duplicate = result.code === "already_registered";
        setStatus(duplicate ? "duplicate" : "success");
        // A duplicate is a registration that already exists, not a failure.
        track({ name: "waitlist_success", source: "early-access", duplicate });
        return;
      }
      const mapped = Object.fromEntries(Object.entries(result.fieldErrors ?? {}).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
      setErrors(mapped);
      setStatus("error");
      track({ name: "waitlist_failure", source: "early-access", reason: result.code ?? "rejected" });
    } catch {
      setStatus("error");
      track({ name: "waitlist_failure", source: "early-access", reason: "network" });
    }
  }

  if (status === "success" || status === "duplicate") {
    return (
      <div className="waitlist-success" data-testid="waitlist-success" role="status">
        <span><Check aria-hidden="true" /></span>
        <div><h3>{copy.title}</h3><p>{statusMessage}</p></div>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit} noValidate data-testid="waitlist-form">
      <div className="waitlist-form__heading">
        <div><h3>{copy.title}</h3><p>{copy.body}</p></div>
        <ShieldCheck aria-hidden="true" />
      </div>
      <div className="form-grid">
        <FormField label={copy.email} htmlFor="waitlist-email" error={errors.email} className="form-field--wide">
          <input id="waitlist-email" data-testid="waitlist-email" type="email" autoComplete="email" value={state.email} onChange={(event) => update("email", event.target.value)} placeholder={copy.emailPlaceholder} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${formId}-email-error` : undefined} required />
        </FormField>
        <FormField label={copy.country} htmlFor="waitlist-country" error={errors.country}>
          <select id="waitlist-country" value={state.country} onChange={(event) => update("country", event.target.value as "GB" | "ES")} required>
            {copy.countries.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </FormField>
        <FormField label={copy.language} htmlFor="waitlist-language" error={errors.preferredLanguage}>
          <select id="waitlist-language" value={state.preferredLanguage} onChange={(event) => update("preferredLanguage", event.target.value as Locale)} required>
            <option value="en-GB">English</option><option value="es-ES">Español</option>
          </select>
        </FormField>
      </div>
      <button className="optional-toggle" type="button" aria-expanded={expanded} aria-controls={`${formId}-optional`} onClick={() => setExpanded((value) => !value)}>{copy.optional}<ChevronDown aria-hidden="true" /></button>
      <div className={`form-optional${expanded ? " is-open" : ""}`} id={`${formId}-optional`}>
        <div className="form-grid">
          <FormField label={copy.name} htmlFor="waitlist-name"><input id="waitlist-name" autoComplete="given-name" value={state.name} onChange={(event) => update("name", event.target.value)} /></FormField>
          <FormField label={copy.business} htmlFor="waitlist-business"><input id="waitlist-business" autoComplete="organization" value={state.businessName} onChange={(event) => update("businessName", event.target.value)} /></FormField>
          <FormField label={copy.website} htmlFor="waitlist-website" error={errors.website}><input id="waitlist-website" type="url" inputMode="url" autoComplete="url" placeholder="https://" value={state.website} onChange={(event) => update("website", event.target.value)} /></FormField>
          <FormField label={copy.type} htmlFor="waitlist-business-type"><select id="waitlist-business-type" value={state.businessType} onChange={(event) => update("businessType", event.target.value)}><option value="">—</option>{businessTypes.map((item) => <option key={item}>{item}</option>)}</select></FormField>
          <FormField label={copy.challenge} htmlFor="waitlist-challenge" className="form-field--wide"><textarea id="waitlist-challenge" rows={3} value={state.biggestChallenge} onChange={(event) => update("biggestChallenge", event.target.value)} /></FormField>
        </div>
      </div>
      <label className={`consent-row${errors.privacyConsent ? " has-error" : ""}`}>
        <input id="waitlist-privacy" data-testid="privacy-consent" type="checkbox" checked={state.privacyConsent} onChange={(event) => update("privacyConsent", event.target.checked)} required />
        <span>{copy.privacy} <Link href={`/${locale}/privacy`}>Privacy</Link></span>
      </label>
      {errors.privacyConsent && <p id={`${formId}-privacy-error`} className="field-error">{errors.privacyConsent}</p>}
      <label className="consent-row"><input data-testid="marketing-consent" type="checkbox" checked={state.marketingConsent} onChange={(event) => update("marketingConsent", event.target.checked)} /><span>{copy.marketing}</span></label>
      <div className="waitlist-form__submit">
        <button className="button button--dark" data-testid="waitlist-submit" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? <><LoaderCircle className="spin" aria-hidden="true" />{copy.submitting}</> : <>{copy.submit}<ArrowRight aria-hidden="true" /></>}
        </button>
        <p aria-live="polite" className="form-status">{status === "error" && !Object.keys(errors).length ? statusMessage : ""}</p>
      </div>
    </form>
  );
}

function FormField({ label, htmlFor, error, children, className = "" }: { label: string; htmlFor: string; error?: string; children: React.ReactNode; className?: string }) {
  return <label className={`form-field ${className}`} htmlFor={htmlFor}><span>{label}</span>{children}{error && <em className="field-error">{error}</em>}</label>;
}
