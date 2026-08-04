import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { WaitlistSubmission } from "./schema";

export type WaitlistStorageMode = "supabase" | "memory";

export type SaveWaitlistResult =
  | { kind: "created"; id: string; storage: WaitlistStorageMode }
  | { kind: "duplicate"; storage: WaitlistStorageMode };

export class WaitlistStorageUnavailableError extends Error {
  constructor() {
    super("Waitlist storage is unavailable.");
    this.name = "WaitlistStorageUnavailableError";
  }
}

type MemoryWaitlistEntry = {
  id: string;
  submission: WaitlistSubmission;
  status: "waiting";
  createdAt: string;
  updatedAt: string;
};

type WaitlistStorageGlobal = typeof globalThis & {
  __negoTrackDevelopmentWaitlist?: Map<string, MemoryWaitlistEntry>;
  __negoTrackSupabaseAdmin?: SupabaseClient;
};

const storageGlobal = globalThis as WaitlistStorageGlobal;
const DATABASE_WRITE_TIMEOUT_MS = 8_000;
const CONFIRMATION_STATUS_TIMEOUT_MS = 2_000;
const developmentWaitlist =
  storageGlobal.__negoTrackDevelopmentWaitlist ??
  new Map<string, MemoryWaitlistEntry>();

storageGlobal.__negoTrackDevelopmentWaitlist = developmentWaitlist;

function configuredSupabase(): SupabaseClient | undefined {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return undefined;
  }

  if (!storageGlobal.__negoTrackSupabaseAdmin) {
    storageGlobal.__negoTrackSupabaseAdmin = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return storageGlobal.__negoTrackSupabaseAdmin;
}

function developmentFallbackAllowed(): boolean {
  return process.env.NODE_ENV !== "production";
}

function databaseRecord(submission: WaitlistSubmission) {
  const now = new Date().toISOString();

  return {
    email: submission.email,
    normalized_email: submission.email,
    name: submission.name ?? null,
    business_name: submission.businessName ?? null,
    website: submission.website ?? null,
    business_type: submission.businessType ?? null,
    biggest_challenge: submission.biggestChallenge ?? null,
    country: submission.country,
    preferred_language: submission.preferredLanguage,
    privacy_consent: submission.privacyConsent,
    privacy_consented_at: now,
    privacy_notice_version:
      process.env.WAITLIST_PRIVACY_NOTICE_VERSION?.trim() || "2026-08-04",
    marketing_consent: submission.marketingConsent,
    marketing_consented_at: submission.marketingConsent ? now : null,
    referral_url: submission.referralUrl ?? null,
    referral_code: submission.referrer ?? null,
    utm_source: submission.utmSource ?? null,
    utm_medium: submission.utmMedium ?? null,
    utm_campaign: submission.utmCampaign ?? null,
    utm_term: submission.utmTerm ?? null,
    utm_content: submission.utmContent ?? null,
    status: "waiting",
    updated_at: now,
  };
}

async function saveToSupabase(
  client: SupabaseClient,
  submission: WaitlistSubmission,
): Promise<SaveWaitlistResult> {
  const { data, error } = await client
    .from("waitlist_signups")
    .insert(databaseRecord(submission))
    .select("id")
    .abortSignal(AbortSignal.timeout(DATABASE_WRITE_TIMEOUT_MS))
    .single();

  if (error?.code === "23505") {
    return { kind: "duplicate", storage: "supabase" };
  }

  if (error || typeof data?.id !== "string") {
    throw new WaitlistStorageUnavailableError();
  }

  return { kind: "created", id: data.id, storage: "supabase" };
}

function saveToDevelopmentMemory(
  submission: WaitlistSubmission,
): SaveWaitlistResult {
  if (developmentWaitlist.has(submission.email)) {
    return { kind: "duplicate", storage: "memory" };
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  developmentWaitlist.set(submission.email, {
    id,
    submission,
    status: "waiting",
    createdAt: now,
    updatedAt: now,
  });

  return { kind: "created", id, storage: "memory" };
}

export async function saveWaitlistSubmission(
  submission: WaitlistSubmission,
): Promise<SaveWaitlistResult> {
  const supabase = configuredSupabase();

  if (supabase) {
    return saveToSupabase(supabase, submission);
  }

  if (developmentFallbackAllowed()) {
    return saveToDevelopmentMemory(submission);
  }

  throw new WaitlistStorageUnavailableError();
}

export async function markConfirmationSent(
  signupId: string,
  storage: WaitlistStorageMode,
): Promise<void> {
  if (storage !== "supabase") {
    return;
  }

  const supabase = configuredSupabase();

  if (!supabase) {
    return;
  }

  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("waitlist_signups")
      .update({ confirmation_email_sent_at: now, updated_at: now })
      .eq("id", signupId)
      .abortSignal(AbortSignal.timeout(CONFIRMATION_STATUS_TIMEOUT_MS));

    if (error) {
      console.error("[waitlist] Confirmation sent status could not be recorded.");
    }
  } catch {
    // The provider already accepted the message, so tracking remains best-effort.
    console.error("[waitlist] Confirmation sent status could not be recorded.");
  }
}
