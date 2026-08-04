import { Resend, type CreateEmailRequestOptions } from "resend";

import type { WaitlistSubmission } from "./schema";

type ConfirmationCopy = {
  subject: string;
  greeting: string;
  body: string;
  signoff: string;
};

const copy: Record<WaitlistSubmission["preferredLanguage"], ConfirmationCopy> = {
  "en-GB": {
    subject: "You’re on the NegoTrack waiting list",
    greeting: "Hello",
    body: "Thanks for joining the NegoTrack waiting list. We’ll keep you updated as we get closer to private beta.",
    signoff: "The NegoTrack team",
  },
  "es-ES": {
    subject: "Ya estás en la lista de espera de NegoTrack",
    greeting: "Hola",
    body: "Gracias por unirte a la lista de espera de NegoTrack. Te mantendremos al día mientras nos acercamos a la beta privada.",
    signoff: "El equipo de NegoTrack",
  },
};

const EMAIL_REQUEST_TIMEOUT_MS = 4_000;

export async function sendWaitlistConfirmation(
  submission: WaitlistSubmission,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.WAITLIST_FROM_EMAIL?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return false;
  }

  const message = copy[submission.preferredLanguage];
  const greeting = submission.name
    ? `${message.greeting} ${submission.name},`
    : `${message.greeting},`;

  try {
    const resend = new Resend(apiKey);
    // Resend forwards request options to fetch even though its public option
    // type currently omits AbortSignal.
    const requestOptions = {
      signal: AbortSignal.timeout(EMAIL_REQUEST_TIMEOUT_MS),
    } as CreateEmailRequestOptions & { signal: AbortSignal };
    const { error } = await resend.emails.send(
      {
        from,
        to: submission.email,
        subject: message.subject,
        text: `${greeting}\n\n${message.body}\n\n${message.signoff}`,
      },
      requestOptions,
    );

    if (error) {
      console.error("[waitlist] Confirmation email could not be submitted.");
      return false;
    }

    return true;
  } catch {
    console.error("[waitlist] Confirmation email could not be submitted.");
    return false;
  }
}
