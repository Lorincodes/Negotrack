import { z } from "zod";

const SINGLE_LINE_CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;
const MULTI_LINE_CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u;
const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

function prepareOptionalText(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.normalize("NFC").trim();
  return normalized.length === 0 ? undefined : normalized;
}

function optionalSingleLine(maxLength: number, tooLongMessage: string) {
  return z.preprocess(
    prepareOptionalText,
    z
      .string()
      .max(maxLength, tooLongMessage)
      .refine((value) => !SINGLE_LINE_CONTROL_CHARACTERS.test(value), {
        message: "Remove unsupported characters.",
      })
      .optional(),
  );
}

function prepareOptionalUrl(value: unknown): unknown {
  const prepared = prepareOptionalText(value);

  if (typeof prepared !== "string" || prepared.length === 0) {
    return prepared;
  }

  // A business owner will often enter a bare domain. Treat it as HTTPS while
  // still rejecting explicit non-HTTP schemes during validation.
  const includesExplicitScheme = /^[a-z][a-z\d+.-]*:/iu.test(prepared);
  const looksLikeHostAndPort = /^[^/?#\s:]+:\d+(?:[/?#]|$)/u.test(prepared);

  if (!includesExplicitScheme || looksLikeHostAndPort) {
    return `https://${prepared}`;
  }

  return prepared;
}

const optionalSafeHttpUrl = z.preprocess(
  prepareOptionalUrl,
  z
    .string()
    .max(2_048, "Enter a shorter URL.")
    .superRefine((value, context) => {
      try {
        const url = new URL(value);

        if (
          !HTTP_PROTOCOLS.has(url.protocol) ||
          !url.hostname ||
          url.username.length > 0 ||
          url.password.length > 0
        ) {
          context.addIssue({
            code: "custom",
            message: "Enter a safe HTTP or HTTPS URL.",
          });
        }
      } catch {
        context.addIssue({
          code: "custom",
          message: "Enter a valid URL.",
        });
      }
    })
    .transform((value) => {
      const url = new URL(value);
      // Fragments are browser-local and frequently contain accidental PII.
      url.hash = "";
      return url.toString();
    })
    .optional(),
);

const optionalSafeReferralUrl = optionalSafeHttpUrl.transform((value) => {
  if (!value) {
    return undefined;
  }

  const url = new URL(value);
  // Attribution is captured in dedicated fields. Do not retain arbitrary query
  // values, which can contain reset tokens, email addresses, or session IDs.
  url.search = "";
  return url.toString();
});

const optionalUtmValue = optionalSingleLine(
  200,
  "Use 200 characters or fewer.",
);

const utmSchema = z
  .object({
    source: optionalUtmValue,
    medium: optionalUtmValue,
    campaign: optionalUtmValue,
    term: optionalUtmValue,
    content: optionalUtmValue,
  })
  .strict()
  .optional();

const waitlistRequestSchema = z
  .object({
    email: z
      .string({ error: "Enter your email address." })
      .trim()
      .max(254, "Enter a shorter email address.")
      .email("Enter a valid email address.")
      .transform((value) => value.toLowerCase()),
    country: z.enum(["GB", "ES"], {
      error: "Choose the United Kingdom or Spain.",
    }),
    preferredLanguage: z.enum(["en-GB", "es-ES"], {
      error: "Choose English or Spanish.",
    }),
    privacyConsent: z.literal(true, {
      error: "You must accept the privacy notice to join.",
    }),
    name: optionalSingleLine(100, "Use 100 characters or fewer."),
    businessName: optionalSingleLine(160, "Use 160 characters or fewer."),
    website: optionalSafeHttpUrl,
    businessType: optionalSingleLine(100, "Use 100 characters or fewer."),
    biggestChallenge: z.preprocess(
      prepareOptionalText,
      z
        .string()
        .max(1_000, "Use 1,000 characters or fewer.")
        .refine((value) => !MULTI_LINE_CONTROL_CHARACTERS.test(value), {
          message: "Remove unsupported characters.",
        })
        .optional(),
    ),
    marketingConsent: z.boolean().optional().default(false),
    referralUrl: optionalSafeReferralUrl,
    referrer: optionalSingleLine(200, "Use 200 characters or fewer."),
    utmSource: optionalUtmValue,
    utmMedium: optionalUtmValue,
    utmCampaign: optionalUtmValue,
    utmTerm: optionalUtmValue,
    utmContent: optionalUtmValue,
    utm: utmSchema,
  })
  .strict()
  .transform((value) => ({
    email: value.email,
    country: value.country,
    preferredLanguage: value.preferredLanguage,
    privacyConsent: value.privacyConsent,
    name: value.name,
    businessName: value.businessName,
    website: value.website,
    businessType: value.businessType,
    biggestChallenge: value.biggestChallenge,
    marketingConsent: value.marketingConsent,
    referralUrl: value.referralUrl,
    referrer: value.referrer,
    utmSource: value.utmSource ?? value.utm?.source,
    utmMedium: value.utmMedium ?? value.utm?.medium,
    utmCampaign: value.utmCampaign ?? value.utm?.campaign,
    utmTerm: value.utmTerm ?? value.utm?.term,
    utmContent: value.utmContent ?? value.utm?.content,
  }));

export type WaitlistSubmission = z.output<typeof waitlistRequestSchema>;

export type WaitlistFieldErrors = Record<string, string[]>;

export function parseWaitlistSubmission(input: unknown) {
  return waitlistRequestSchema.safeParse(input);
}

export function normalizeSafeReferralUrl(value: unknown): string | undefined {
  const result = optionalSafeReferralUrl.safeParse(value);
  return result.success ? result.data : undefined;
}

export function waitlistFieldErrors(error: z.ZodError): WaitlistFieldErrors {
  const fieldErrors: WaitlistFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path.length > 0 ? issue.path.join(".") : "_form";
    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }

  return fieldErrors;
}
