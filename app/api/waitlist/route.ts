import { NextResponse } from "next/server";

import { sendWaitlistConfirmation } from "@/lib/waitlist/email";
import {
  clientRateLimitKey,
  consumeRateLimit,
  emailRateLimitKey,
} from "@/lib/waitlist/rate-limit";
import {
  normalizeSafeReferralUrl,
  parseWaitlistSubmission,
  waitlistFieldErrors,
} from "@/lib/waitlist/schema";
import {
  markConfirmationSent,
  saveWaitlistSubmission,
  WaitlistStorageUnavailableError,
} from "@/lib/waitlist/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1_024;
const GLOBAL_RATE_LIMIT = 120;
const GLOBAL_RATE_WINDOW_MS = 10 * 60 * 1_000;
const CLIENT_RATE_LIMIT = 8;
const CLIENT_RATE_WINDOW_MS = 10 * 60 * 1_000;
const EMAIL_RATE_LIMIT = 5;
const EMAIL_RATE_WINDOW_MS = 60 * 60 * 1_000;

const REGISTERED_MESSAGE =
  "You’re on the NegoTrack waiting list. We’ll keep you updated.";
const DUPLICATE_MESSAGE =
  "You are already on the NegoTrack waiting list. We’ll keep you updated.";

type ErrorCode =
  | "invalid_content_type"
  | "invalid_request"
  | "payload_too_large"
  | "rate_limited"
  | "storage_unavailable";

function responseHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return headers;
}

function errorResponse(
  status: number,
  code: ErrorCode,
  message: string,
  options?: {
    fieldErrors?: Record<string, string[]>;
    headers?: HeadersInit;
  },
) {
  return NextResponse.json(
    {
      ok: false,
      code,
      message,
      ...(options?.fieldErrors ? { fieldErrors: options.fieldErrors } : {}),
    },
    { status, headers: responseHeaders(options?.headers) },
  );
}

function rateLimitedResponse(retryAfterSeconds: number) {
  return errorResponse(
    429,
    "rate_limited",
    "Too many attempts. Please wait a little while and try again.",
    { headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}

function requestDeclaresJson(request: Request): boolean {
  const contentType = request.headers.get("content-type")?.toLowerCase();
  return contentType?.startsWith("application/json") ?? false;
}

async function boundedJsonBody(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; tooLarge: boolean }> {
  const declaredLength = request.headers.get("content-length");

  if (declaredLength && /^\d+$/u.test(declaredLength)) {
    if (Number(declaredLength) > MAX_BODY_BYTES) {
      return { ok: false, tooLarge: true };
    }
  }

  try {
    const reader = request.body?.getReader();
    const decoder = new TextDecoder();
    let body = "";
    let receivedBytes = 0;

    if (reader) {
      while (true) {
        const chunk = await reader.read();

        if (chunk.done) {
          break;
        }

        receivedBytes += chunk.value.byteLength;

        if (receivedBytes > MAX_BODY_BYTES) {
          await reader.cancel().catch(() => undefined);
          return { ok: false, tooLarge: true };
        }

        body += decoder.decode(chunk.value, { stream: true });
      }

      body += decoder.decode();
    }

    return { ok: true, value: JSON.parse(body) as unknown };
  } catch {
    return { ok: false, tooLarge: false };
  }
}

export async function POST(request: Request) {
  if (!requestDeclaresJson(request)) {
    return errorResponse(
      415,
      "invalid_content_type",
      "Send the registration as JSON.",
    );
  }

  const globalLimit = consumeRateLimit(
    "waitlist:global",
    GLOBAL_RATE_LIMIT,
    GLOBAL_RATE_WINDOW_MS,
  );

  if (!globalLimit.allowed) {
    return rateLimitedResponse(globalLimit.retryAfterSeconds);
  }

  const clientKey = clientRateLimitKey(request);

  if (clientKey) {
    const clientLimit = consumeRateLimit(
      clientKey,
      CLIENT_RATE_LIMIT,
      CLIENT_RATE_WINDOW_MS,
    );

    if (!clientLimit.allowed) {
      return rateLimitedResponse(clientLimit.retryAfterSeconds);
    }
  }

  const body = await boundedJsonBody(request);

  if (!body.ok) {
    return body.tooLarge
      ? errorResponse(
          413,
          "payload_too_large",
          "The registration is too large.",
        )
      : errorResponse(400, "invalid_request", "Send valid JSON.");
  }

  const parsed = parseWaitlistSubmission(body.value);

  if (!parsed.success) {
    return errorResponse(
      400,
      "invalid_request",
      "Please check the highlighted fields and try again.",
      { fieldErrors: waitlistFieldErrors(parsed.error) },
    );
  }

  const submission = {
    ...parsed.data,
    referralUrl:
      parsed.data.referralUrl ??
      normalizeSafeReferralUrl(request.headers.get("referer")),
  };

  const emailLimit = consumeRateLimit(
    emailRateLimitKey(submission.email),
    EMAIL_RATE_LIMIT,
    EMAIL_RATE_WINDOW_MS,
  );

  if (!emailLimit.allowed) {
    return rateLimitedResponse(emailLimit.retryAfterSeconds);
  }

  try {
    const result = await saveWaitlistSubmission(submission);

    if (result.kind === "duplicate") {
      return NextResponse.json(
        { ok: true, code: "already_registered", message: DUPLICATE_MESSAGE },
        { status: 200, headers: responseHeaders() },
      );
    }

    const confirmationSent = await sendWaitlistConfirmation(submission);

    if (confirmationSent) {
      await markConfirmationSent(result.id, result.storage);
    }

    return NextResponse.json(
      { ok: true, code: "registered", message: REGISTERED_MESSAGE },
      { status: 201, headers: responseHeaders() },
    );
  } catch (error) {
    if (!(error instanceof WaitlistStorageUnavailableError)) {
      console.error("[waitlist] Registration failed unexpectedly.");
    }

    return errorResponse(
      503,
      "storage_unavailable",
      "Registration is temporarily unavailable. Please try again later.",
    );
  }
}
