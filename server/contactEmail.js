import { contactLimits } from "../src/content/contact";

const DEFAULT_CONTACT_TO_EMAIL = "jeremie.nagi@epitech.eu";

export const jsonResponse = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    },
  });

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Same limits as the form (src/content/contact.ts).
const MAX_BODY_BYTES = 10_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trimmed string, with line breaks removed when it goes into a header-like field. */
const clean = (value, singleLine) => {
  if (typeof value !== "string") return "";
  const text = value.trim();
  return singleLine ? text.replace(/[\r\n]+/g, " ") : text;
};

/** First reason to refuse the message, worded for the visitor; null when it is valid. */
const invalidField = ({ name, email, subject, message }) => {
  if (!name || name.length > contactLimits.name) return "Nom manquant ou trop long.";
  if (!EMAIL_PATTERN.test(email) || email.length > contactLimits.email) return "Adresse email invalide.";
  if (!subject || subject.length > contactLimits.subject) return "Sujet manquant ou trop long.";
  if (message.length < contactLimits.messageMin) return "Message trop court.";
  if (message.length > contactLimits.message) return `Message trop long (${contactLimits.message} caractères au plus).`;
  return null;
};

export const handleContactRequest = async (request, env) => {
  if (request.method !== "POST") {
    return jsonResponse(405, { message: "Méthode non autorisée." });
  }

  // Only the site itself may post (a browser always sends Origin on a cross-site POST).
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return jsonResponse(403, { message: "Origine non autorisée." });
  }

  // At most a few messages per minute per visitor (rate-limiting binding in wrangler.toml).
  if (env.CONTACT_LIMITER) {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
    if (!success) {
      return jsonResponse(429, { message: "Trop de messages envoyés. Réessayez dans une minute, ou écrivez directement par email." });
    }
  }

  if (!env.RESEND_API_KEY) {
    console.error("contact: RESEND_API_KEY is not set");
    return jsonResponse(500, { message: "Service d'envoi indisponible." });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return jsonResponse(413, { message: "Message trop long." });
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return jsonResponse(400, { message: "Format de requête invalide." });
  }

  // Honeypot filled: answer as if sent, send nothing.
  if (payload?.company) {
    return jsonResponse(200, { message: "Message envoyé." });
  }

  const name = clean(payload?.name, true);
  const email = clean(payload?.email, true);
  const subject = clean(payload?.subject, true);
  const message = clean(payload?.message, false);

  const refusal = invalidField({ name, email, subject, message });
  if (refusal) {
    return jsonResponse(400, { message: refusal });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const fromEmail =
    env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `[Portfolio] ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\nSujet: ${subject}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nouveau message depuis le portfolio</h2>
          <p><strong>Nom:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Sujet:</strong> ${safeSubject}</p>
          <hr />
          <p>${safeMessage}</p>
        </div>
      `,
    }),
  });

  // The provider's error stays in the Worker logs; the visitor gets a generic message.
  if (!response.ok) {
    console.error("contact: Resend refused the message", response.status, await response.text());
    return jsonResponse(502, { message: "Service d'envoi indisponible." });
  }

  return jsonResponse(200, { message: "Message envoyé." });
};
